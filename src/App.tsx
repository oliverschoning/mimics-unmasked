import { Canvas } from "@react-three/fiber";
import { Billboard, Grid, Image, Plane, useGLTF } from "@react-three/drei";
import { PersistentOrbitControls } from "./util/PersistentOrbitControls";
import { Setup } from "./Setup";
import PartyMember from "./ecs/component/PartyMember";
import { PartyPath } from "./components/PartyPath";
import { Sprite } from "./components/Sprite";
import { Suspense } from "react";

const SurfacePath = () => {
  const glb = useGLTF("/surface path.glb");

  console.log(glb);

  return (
    <>
      <primitive object={glb.meshes.path} />
    </>
  );
};

export const App = () => {
  return (
    <Canvas>
      <ambientLight />

      <Grid args={[40, 20]} />
      <PartyPath />

      <Setup />

      <Suspense>
        <SurfacePath />
      </Suspense>

      <Sprite position={[0, 2, 2]} scale={[4, 4]} url="/Tree_1.png" />
      <Sprite position={[5, 1, 2]} scale={[4, 4]} url="/Tree_2.png" />

      <PartyMember.List />

      <PartyMember.System />

      <PersistentOrbitControls persist={{ localStorageKey: "GAME" }} />
    </Canvas>
  );
};
