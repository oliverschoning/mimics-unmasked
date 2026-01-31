import React from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Box,OrbitControls,PerspectiveCamera } from "@react-three/drei";

export const App = () => {
  return (
	  <Canvas>
	  	<ambientLight />
		<Box>
			<meshNormalMaterial />
		</Box>
		<PerspectiveCamera makeDefault position={[0, 0, 5]} />
		<OrbitControls />
	  </Canvas>
  );
};

