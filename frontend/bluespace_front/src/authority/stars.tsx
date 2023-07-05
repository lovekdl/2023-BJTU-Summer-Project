
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useRef, useLayoutEffect,RefObject  } from "react";
import { useTransform, useScroll, useTime } from "framer-motion";
import { degreesToRadians, progress, mix } from "popmotion";
import * as THREE from 'three';
import { Mesh,BufferGeometry,NormalBufferAttributes,Material } from "three";

const color = "#111111";

const Icosahedron = () => (
  <mesh rotation-x={0.35}>
    <icosahedronGeometry args={[1, 0]} />
    <meshBasicMaterial wireframe color={color} />
  </mesh>
);

const Star = ({ p }: { p: number }) => {
  const ref = useRef<THREE.Object3D>(null) as RefObject<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[]>>;
  const gl = useThree((state) => state.gl);
  useLayoutEffect(() => {
    const distance = mix(2, 3.5, Math.random());
    const yAngle = mix(
      degreesToRadians(80),
      degreesToRadians(100),
      Math.random()
    );
    
    const xAngle = degreesToRadians(360) * p;
    ref.current!.position.setFromSphericalCoords(distance, yAngle, xAngle);
    
  });
  useLayoutEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
  }, []);

  return (
    <mesh ref={ref}>
      <boxGeometry args={[0.05, 0.05, 0.05]} />
      <meshBasicMaterial wireframe color={color} />
    </mesh>
  );
};

function Scene({ numStars = 100 }) {
  const gl = useThree((state) => state.gl);
  const { scrollYProgress } = useScroll();
  const yAngle = useTransform(
    scrollYProgress,
    [0, 1],
    [0.001, degreesToRadians(180)]
  );
  const distance = useTransform(scrollYProgress, [0, 1], [10, 3]);
  const time = useTime();
    
  useFrame(({ camera }) => {
    camera.position.setFromSphericalCoords(
      distance.get(),
      1,
      time.get() * 0.0005
    );
    camera.updateProjectionMatrix();
    camera.lookAt(0, 0, 0);
  });

  useLayoutEffect(() => gl.setPixelRatio(0.3));

  const stars = [];
  for (let i = 0; i < numStars; i++) {
    stars.push(<Star p={progress(0, numStars, i)} />);
  }

  return (
    <>
      <Icosahedron />
      {stars}
    </>
  );
}

export default function Stars() {
  return (
    <div className="containerauth">
      <Canvas className='canvasqwq' gl={{ antialias: false }}>
        <Scene />
      </Canvas>
    </div>
  );
}
