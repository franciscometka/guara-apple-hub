import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";
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
const FILL = 0.92;

/** Animação de entrada: o aparelho "chega" girado e assenta na posição de descanso. */
const ENTRY_ANGLE = THREE.MathUtils.degToRad(65);
const ENTRY_DURATION = 1.1; // segundos — mesma duração da entrada do Hero (Hero.tsx)

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
function FitCamera({ halfHeight, radius }: { halfHeight: number; radius: number }) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const vFov = (cam.fov * Math.PI) / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * cam.aspect);

    // Em telas estreitas o aparelho encostava nas bordas e parecia cortado /
    // desalinhado — mais folga no mobile.
    const fill = size.width < 640 ? FILL * 1.18 : FILL;
    const distance = Math.max(halfHeight / Math.tan(vFov / 2), radius / Math.tan(hFov / 2)) * fill;

    cam.position.setLength(distance);
    cam.updateProjectionMatrix();
    invalidate();
  }, [camera, size, halfHeight, radius, invalidate]);

  return null;
}

function Device({ onEntryComplete }: { onEntryComplete: () => void }) {
  const { scene } = useGLTF(MODEL_URL);
  const spinRef = useRef<THREE.Group>(null);
  const startTime = useRef<number | null>(null);
  const done = useRef(false);
  const invalidate = useThree((s) => s.invalidate);

  // Modelos .glb chegam com escala e origem arbitrárias: centralizamos na
  // origem e medimos o aparelho pra câmera se ajustar sozinha ao tamanho real.
  const { center, halfHeight, radius } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
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
  }, [scene]);

  useFrame((state) => {
    if (done.current || !spinRef.current) return;

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
      <group ref={spinRef} rotation={[0, ENTRY_ANGLE, 0]}>
        {/* Recentraliza a geometria: translação pura, nunca gira. */}
        <group position={center.clone().negate()}>
          <primitive object={scene} />
        </group>
      </group>
      <FitCamera halfHeight={halfHeight} radius={radius} />
    </>
  );
}

function Scene() {
  // Só libera o arraste depois que a animação de entrada assentar — evita o
  // gesto do usuário brigar com o giro de chegada.
  const [controlsEnabled, setControlsEnabled] = useState(false);

  return (
    <>
      <Suspense fallback={null}>
        <Device onEntryComplete={() => setControlsEnabled(true)} />
      </Suspense>
      {/* Boundary própria: o mapa de ambiente vem de um HDR hospedado fora
          do nosso build (raw.githack.com, via drei) — não pode travar a
          revelação do aparelho se esse download for lento ou falhar. */}
      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>
      <directionalLight position={[2, 3, 4]} intensity={0.6} />
      <OrbitControls
        enabled={controlsEnabled}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={POLAR_MIN}
        maxPolarAngle={POLAR_MAX}
        rotateSpeed={0.6}
      />
    </>
  );
}

export default function Hero3DDevice() {
  const reduced = useReducedMotion();
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
    <div className={`relative w-full ${HERO_DEVICE_HEIGHT}`}>
      <DeviceGlow />
      <Canvas
        frameloop="demand"
        camera={{ position: [0, 0, 4.2], fov: 35 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
