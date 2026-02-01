import React from "react";
import * as THREE from "three";
import { Gltf } from "@react-three/drei";


export const Tree = ({ position, src }: { position: THREE.Vector3, src: string }) => {
  const ref = React.useRef<THREE.Group>(null!);

  React.useEffect(() => {
    ref.current.position.x = position.x;
    ref.current.position.y = position.y;
    ref.current.position.z = position.z;
  }, [position]);

  return <Gltf ref={ref} src={src} />;
};
