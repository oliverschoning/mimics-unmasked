import { Canvas } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import { PersistentOrbitControls } from "./util/PersistentOrbitControls";
import { Setup } from "./Setup";
import PartyMember from "./ecs/component/PartyMember";
import { PartyPath } from "./components/PartyPath"

export const App = () => {
  return (
	  <Canvas>
	  	<ambientLight />

		<Grid args={[40, 20]} />
		<PartyPath />

		<Setup />
		
		<PartyMember.List />



		<PartyMember.System />

      	<PersistentOrbitControls persist={{ localStorageKey: "GAME" }} />
	  </Canvas>
  );
};

