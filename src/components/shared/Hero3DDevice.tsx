import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls, useGLTF } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";
import { useFinePointer, useMediaQuery } from "@/hooks/useMediaQuery";
import {
  DeviceGlow,
  HERO_DEVICE_HEIGHT,
  HeroDevicePlaceholder,
  HeroFallbackImage,
} from "@/components/shared/HeroFallbackImage";

const MODEL_URL = "/models/iphone.glb";

/** Limites de inclinação vertical — compartilhados com o cálculo de enquadramento. */
const POLAR_MIN = Math.PI / 3; // 60°
const POLAR_MAX = Math.PI / 1.7; // ~106°

/** Folga em volta do aparelho: 1 = encostando na borda, maior = mais respiro. */
const FILL = 0.88;

/** Animação de entrada: o aparelho "chega" girado e assenta na posição de descanso. */
const ENTRY_ANGLE = THREE.MathUtils.degToRad(65);
const ENTRY_DURATION = 1.1; // segundos — mesma duração da entrada do Hero (Hero.tsx)
const SCREEN_MATERIAL = "17ProMax_glass";
const LENS_MATERIALS = new Set(["17ProMax_Lens", "17ProMax_Lens2.001"]);
/**
 * Corpo e laterais. No .glb esses materiais vêm sem `metallicFactor`, que no
 * glTF significa 1.0 — ou seja, metal puro. Metal não tem componente difusa,
 * então luz ambiente e direcional quase não os atingem: quem define o brilho
 * deles é o reflexo do environment map. Por isso o ajuste aqui é em
 * envMapIntensity, e não em intensidade de luz.
 */
const BODY_MATERIALS = new Set(["17ProMax_color", "17ProMax_color2", "17ProMax_color3"]);

/**
 * Lente de câmera não é um material padrão: é vidro de safira sobre um
 * interior escuro, com revestimento antirreflexo. O que dá o aspecto real é
 * a combinação de três coisas que o MeshStandardMaterial não faz:
 *
 * - `clearcoat`: a lâmina de safira por cima, com brilho próprio e mais
 *   nítido que o do vidro de baixo;
 * - `iridescence`: interferência de película fina — literalmente o que é o
 *   revestimento antirreflexo, e de onde vem o reflexo azul/violeta que
 *   aparece na lente de verdade conforme o ângulo muda;
 *   `iridescenceThicknessRange` é a espessura em nanômetros, e é ela que
 *   decide a cor: mais fina puxa pro violeta, mais grossa pro azul/verde;
 * - `ior` de 1.77: índice de refração da safira, mais alto que o do vidro
 *   comum (1.5), o que intensifica o Fresnel nas bordas da lente.
 *
 * Mantido discreto de propósito: iridescência no talo vira arco-íris de
 * bijuteria, não lente de câmera.
 */
function criarMaterialLente(nome: string): THREE.MeshPhysicalMaterial {
  const interno = nome === "17ProMax_Lens2.001";

  const material = new THREE.MeshPhysicalMaterial({
    // O escuro vem do interior da lente, nunca de um metal preto.
    color: interno
      ? new THREE.Color(0.010, 0.016, 0.075)
      : new THREE.Color(0.005, 0.009, 0.028),
    metalness: 0,
    roughness: interno ? 0.05 : 0.07,
    ior: 1.77,
    specularIntensity: 1,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    iridescence: interno ? 0.85 : 0.55,
    iridescenceIOR: 1.35,
    envMapIntensity: 2.6,
  });

  material.iridescenceThicknessRange = interno ? [180, 420] : [140, 320];
  material.name = nome;
  return material;
}

// Início do download do .glb assim que este módulo é avaliado no browser —
// em paralelo com o resto do carregamento, em vez de esperar o Canvas
// montar. Protegido contra SSR: este módulo pode ser importado no servidor
// pra resolver o Suspense do lazy(), e useGLTF.preload toca APIs de browser.
if (typeof window !== "undefined") {
  useGLTF.preload(MODEL_URL);
}

/**
 * Distância de câmera que mantém o aparelho inteiro dentro do canvas em
 * qualquer ângulo. O OrbitControls gira a câmera em volta da origem, então
 * basta enquadrar o pior caso de inclinação uma vez: girando no eixo Y a
 * silhueta não cresce além do raio calculado aqui. A mesma conta vale pra
 * rotação de entrada, que gira o objeto em vez da câmera — geometricamente
 * é a mesma relação, só o lado que se move muda.
 */
function FitCamera({
  halfHeight,
  radius,
  onFit,
}: {
  halfHeight: number;
  radius: number;
  onFit: () => void;
}) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);

  // useLayoutEffect: o enquadramento precisa acontecer ANTES do primeiro
  // quadro pintado, senão o aparelho aparece na distância padrão da câmera
  // (pequeno) e "salta" pro tamanho certo no recarregamento da página.
  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const vFov = (cam.fov * Math.PI) / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * cam.aspect);

    // Em telas estreitas o aparelho encostava nas bordas e parecia cortado /
    // desalinhado — mais folga no mobile.
    const fill = size.width < 640 ? FILL * 1.12 : FILL;
    const distance = Math.max(halfHeight / Math.tan(vFov / 2), radius / Math.tan(hFov / 2)) * fill;

    cam.position.setLength(distance);
    cam.updateProjectionMatrix();
    onFit();
    invalidate();
  }, [camera, size, halfHeight, radius, invalidate, onFit]);

  return null;
}

function Device({ onEntryComplete }: { onEntryComplete: () => void }) {
  const { scene } = useGLTF(MODEL_URL);
  const spinRef = useRef<THREE.Group>(null);
  const startTime = useRef<number | null>(null);
  const done = useRef(false);
  const invalidate = useThree((s) => s.invalidate);
  // Só revelamos o aparelho depois que a câmera está na distância correta.
  const [fitted, setFitted] = useState(false);
  const handleFit = useCallback(() => setFitted(true), []);

  // Limpa objetos auxiliares antes de medir/enquadrar. O modelo atual inclui
  // uma base de exposição muito maior que o aparelho; se ela entrasse no
  // cálculo, o iPhone ficaria minúsculo no Hero.
  const cleanedScene = useMemo(() => {
    const clone = scene.clone();
    const toRemove: THREE.Object3D[] = [];
    clone.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;

      const sourceMaterials = Array.isArray(obj.material) ? obj.material : [obj.material];
      const materialNames = sourceMaterials.map((material) => material.name);

      if (obj.name === "iphone17promax001_1" || materialNames.includes("Material.003")) {
        toRemove.push(obj);
        return;
      }

      const polishedMaterials = sourceMaterials.map((source) => {
        // Substituição, não ajuste: safira e antirreflexo precisam de um
        // MeshPhysicalMaterial, que o material do .glb não é.
        if (LENS_MATERIALS.has(source.name)) return criarMaterialLente(source.name);

        const material = source.clone();
        if (!(material instanceof THREE.MeshStandardMaterial)) return material;

        if (material.name === SCREEN_MATERIAL) {
          material.color.setRGB(0.004, 0.006, 0.012);
          material.metalness = 0.92;
          material.roughness = 0.045;
          material.envMapIntensity = 1.25;
        } else if (BODY_MATERIALS.has(material.name)) {
          // Só o reflexo — a cor de fábrica do aparelho fica intacta.
          material.envMapIntensity = 2.2;
        }

        material.needsUpdate = true;
        return material;
      });

      obj.material = Array.isArray(obj.material) ? polishedMaterials : polishedMaterials[0];
    });
    toRemove.forEach((obj) => obj.removeFromParent());
    return clone;
  }, [scene]);

  // Modelos .glb chegam com escala e origem arbitrárias: centralizamos na
  // origem e medimos o aparelho pra câmera se ajustar sozinha ao tamanho real.
  const { center, halfHeight, radius } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(cleanedScene);
    const boxSize = box.getSize(new THREE.Vector3());
    const halfY = boxSize.y / 2;
    // Raio máximo no plano horizontal — o que a silhueta ocupa ao girar em Y.
    const xzRadius = Math.hypot(boxSize.x, boxSize.z) / 2;

    // Pior caso de altura projetada dentro da faixa de inclinação permitida.
    let worstHalfHeight = 0;
    for (let a = POLAR_MIN; a <= POLAR_MAX; a += Math.PI / 180) {
      worstHalfHeight = Math.max(
        worstHalfHeight,
        halfY * Math.sin(a) + xzRadius * Math.abs(Math.cos(a)),
      );
    }

    return {
      center: box.getCenter(new THREE.Vector3()),
      halfHeight: worstHalfHeight,
      radius: xzRadius,
    };
  }, [cleanedScene]);

  useFrame((state) => {
    if (done.current || !spinRef.current || !fitted) return;

    if (startTime.current === null) startTime.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - startTime.current;
    const t = Math.min(elapsed / ENTRY_DURATION, 1);
    const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic

    spinRef.current.rotation.y = ENTRY_ANGLE * (1 - eased);

    if (t < 1) {
      // frameloop="demand" só segue renderizando se a gente pedir quadro a
      // quadro — sem isso a animação trava no primeiro tick.
      invalidate();
    } else {
      done.current = true;
      onEntryComplete();
    }
  });

  return (
    <>
      {/* Gira em volta da origem — o mesmo pivô que o OrbitControls usa depois. */}
      <group ref={spinRef} rotation={[0, ENTRY_ANGLE, 0]} visible={fitted}>
        {/* Recentraliza a geometria: translação pura, nunca gira. */}
        <group position={center.clone().negate()}>
          <primitive object={cleanedScene} />
        </group>
      </group>
      <FitCamera halfHeight={halfHeight} radius={radius} onFit={handleFit} />
    </>
  );
}

function Scene({ interactive, mobile }: { interactive: boolean; mobile: boolean }) {
  // Só libera o arraste depois que a animação de entrada assentar — evita o
  // gesto do usuário brigar com o giro de chegada.
  const [controlsEnabled, setControlsEnabled] = useState(false);

  return (
    <>
      <Suspense fallback={null}>
        <Device onEntryComplete={() => setControlsEnabled(true)} />
      </Suspense>
      {/* Estúdio local de reflexos: não depende de HDR externo e mantém vidro,
          lentes e alumínio vivos mesmo em conexões móveis instáveis.
          environmentIntensity é o dial de exposição desse estúdio — e é ele,
          não as luzes abaixo, que governa o brilho das peças metálicas. */}
      <Environment resolution={256} environmentIntensity={2.1}>
        <Lightformer intensity={2.4} position={[0, 4, 2]} scale={[5, 2, 1]} />
        <Lightformer
          intensity={2}
          position={[-4, 0, 1]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[6, 1.5, 1]}
        />
        <Lightformer
          intensity={1.6}
          position={[4, -1, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[4, 1, 1]}
        />
      </Environment>
      <ambientLight intensity={mobile ? 0.62 : 0.34} />
      <directionalLight position={[2, 3, 4]} intensity={mobile ? 1.15 : 0.85} />

      <OrbitControls
        enabled={controlsEnabled && interactive}
        enableZoom={false}
        enablePan={false}
        enableDamping={!mobile}
        minPolarAngle={POLAR_MIN}
        maxPolarAngle={POLAR_MAX}
        rotateSpeed={mobile ? 0.45 : 0.6}
      />
    </>
  );
}

export default function Hero3DDevice() {
  const reduced = useReducedMotion();
  const finePointer = useFinePointer();
  const mobile = useMediaQuery("(max-width: 767px)");
  const [mounted, setMounted] = useState(false);

  // O WebGL não roda no SSR: até hidratar, sai sempre o placeholder de glow,
  // nunca a imagem estática — senão ela fica gravada no HTML do servidor e
  // persiste, sem piscar, até o chunk deste componente terminar de baixar no
  // cliente (é esse HTML que aparece na tela, não o fallback do Suspense lá
  // em Hero.tsx: o SSR resolve o lazy() direto, então o fallback nunca chega
  // a ser usado no carregamento inicial da página).
  //
  // Importante: esse branch de pré-montagem NÃO pode depender de `reduced`.
  // No servidor prefers-reduced-motion é sempre desconhecido (null); no
  // cliente ele já resolve pro valor real de cara, antes do efeito de
  // montagem rodar — se a saída daqui variasse com `reduced`, o React veria
  // HTML diferente do servidor pra quem usa reduced-motion e re-renderizaria
  // do zero nesse ponto (mismatch), com um flash pior do que o que estamos
  // tentando evitar. Por isso quem pediu reduced-motion vê um instante de
  // glow antes da imagem estática assentar — só nesse primeiro carregamento,
  // nunca mais depois. Diferente do comportamento anterior (imagem direto,
  // sem esse instante) — avisar se isso não for aceitável.
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <HeroDevicePlaceholder />;
  }

  if (reduced) {
    return <HeroFallbackImage />;
  }

  // Sem fallback 2D aqui: enquanto o .glb ainda está carregando, o Canvas já
  // está montado mas o Suspense interno da Scene ainda não renderizou o
  // <Device>, então só aparece o glow atrás. Quando o modelo chega, ele
  // entra direto tocando a animação de giro — essa entrada já É a transição.
  return (
    <div className={`relative mx-auto w-full max-w-[520px] overflow-visible ${HERO_DEVICE_HEIGHT}`}>
      <DeviceGlow />
      <Canvas
        frameloop="demand"
        camera={{ position: [0, 0, 4.2], fov: 35 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
          // O padrão do R3F é ACES Filmic, feito pra cinema: comprime os tons
          // médios e deixa o aparelho murcho. O Neutral (Khronos PBR Neutral)
          // existe justamente pra visualização de produto — preserva a cor de
          // fábrica e os médios, sem estourar o brilho das partes polidas.
          toneMapping: THREE.NeutralToneMapping,
          toneMappingExposure: 1.3,
        }}
        dpr={mobile ? [1, 1.75] : [1, 2]}

        style={{ background: "transparent", touchAction: "pan-y" }}
      >
        <Scene interactive={finePointer || mobile} mobile={mobile} />
      </Canvas>
    </div>
  );
}
