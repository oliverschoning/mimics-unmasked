import React from "react";
import { Image } from "@react-three/drei";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

const createSprite = (url: string) => {
  return React.forwardRef<THREE.Mesh, {}>((props, ref) => {
    const localRef = React.useRef<THREE.Mesh>(null!);
    const { camera } = useThree();

    const meshRef = (ref as React.RefObject<THREE.Mesh>) ?? localRef;

    useFrame(() => {
      const mesh = meshRef.current;
      if (!mesh) return;

      // Make sprite face the camera
      mesh.lookAt(camera.position);
    });

    return <Image ref={meshRef} url={url} transparent {...props} />;
  });
};

// Non-enemy sprites
export const HareSprite = createSprite("/Hare.png");
export const TrashSprite = createSprite("/Trash.png");
export const TrashcanSprite = createSprite("/Trashcan.png");
export const StopSignSprite = createSprite("/Stop_sign.png");
export const StreetlightSprite = createSprite("/Streetlight.png");
export const Tree1Sprite = createSprite("/Tree_1.png");
export const Tree2Sprite = createSprite("/Tree_2.png");
export const Tree3Sprite = createSprite("/Tree_3.png");
