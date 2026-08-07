import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";
import heroFallback from "@/assets/images/iphone-hero.png";

const MODEL_URL = "/models/iphone.glb";
const CANVAS_HEIGHT = "h-[440px] sm:h-[560px] md:h-[680px]";

/** Limites de inclinação vertical — compartilhados com o cálculo de enquadramento. */
const POLAR_MIN = Math.PI / 3; // 60°
const POLAR_MAX = Math.PI / 1.7; // ~106°

/** Folga em volta do aparelho: 1 = encostando na borda, maior = mais respiro. */
const FILL = 1.06;

/** Animação de entrada: o aparelho "chega" girado e assenta na posição de descanso. */
const ENTRY_ANGLE = THREE.MathUtils.degToRad(65);
const ENTRY_DURATION = 1.1; // segundos — mesma duração da entrada do Hero (Hero.tsx)

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

    const distance = Math.max(halfHeight / Math.tan(vFov / 2), radius / Math.tan(hFov / 2)) * FILL;

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
        <Environment preset="city" />
        <directionalLight position={[2, 3, 4]} intensity={0.6} />
      </Suspense>
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

/** Halo violeta atrás do aparelho — no 2D ele vinha pintado dentro do PNG. */
function DeviceGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-1/2 h-[72%] w-[64%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--color-violet)_75%,transparent)_0%,transparent_70%)] opacity-55 blur-2xl"
    />
  );
}

function FallbackImage() {
  // O PNG já traz o halo violeta na própria arte — por isso não leva DeviceGlow.
  return (
    <div className={`relative flex w-full items-center justify-center ${CANVAS_HEIGHT}`}>
      <img
        src={heroFallback}
        alt="iPhone em destaque na Guara iPhones"
        width={521}
        height={651}
        fetchPriority="high"
        decoding="async"
        className="block h-full w-auto max-w-full object-contain select-none"
      />
    </div>
  );
}

export default function Hero3DDevice() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  // O WebGL não roda no SSR: até hidratar, sai sempre a imagem estática.
  // Esse mesmo caminho cobre prefers-reduced-motion — nunca chega a montar
  // o Canvas, então a animação de entrada nem é instanciada.
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || reduced) {
    return <FallbackImage />;
  }

  return (
    <div className={`relative w-full ${CANVAS_HEIGHT}`}>
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
