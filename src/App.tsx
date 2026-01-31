import { Canvas } from "@react-three/fiber";
import { Billboard,
Grid,Image, 
Plane} from "@react-three/drei";
import { PersistentOrbitControls } from "./util/PersistentOrbitControls";
import { Setup } from "./Setup";
import PartyMember from "./ecs/component/PartyMember";
import { PartyPath } from "./components/PartyPath"

export const Sprite = ({ position, scale, url }) => {
  return (
    <Image
      url={url}
      position={position}
      scale={scale} // width, height
      transparent
    />
  )
}

export const App = () => {
  return (
	  <Canvas>
	  	<ambientLight />

		<Grid args={[40, 20]} />
		<PartyPath />

		<Setup />

		<Sprite url="/Tree_1.png" />


		<PartyMember.List />



		<PartyMember.System />

      	<PersistentOrbitControls persist={{ localStorageKey: "GAME" }} />
	  </Canvas>
  );
};

