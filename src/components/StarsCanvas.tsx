"use client";

import { Points, PointMaterial } from "@react-three/drei";
import { Canvas, type PointsProps, useFrame } from "@react-three/fiber";
import * as random from "maath/random";
import { useState, useRef, Suspense } from "react";
import type { Points as PointsType } from "three";

export const StarBackground = (props: PointsProps) => {
  const ref = useRef<PointsType | null>(null);
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(5000), { radius: 1.2 })
  );

  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <Points
      ref={ref}
      stride={3}
      positions={new Float32Array(sphere)}
      frustumCulled
      rotation={[0, 0, Math.PI / 4]}
      {...props}
    >
      <PointMaterial
        transparent
        color="#fff"
        size={0.002}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
};

export const StarsCanvas = ({ className }: { className?: string }) => (
  <div className={`absolute inset-0 w-full h-full ${className || ""}`}>
    <Canvas camera={{ position: [0, 0, 1] }}>
      <Suspense fallback={null}>
        <StarBackground />
      </Suspense>
    </Canvas>
  </div>
);
export default StarsCanvas;