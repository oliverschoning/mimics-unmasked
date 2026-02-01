import{Box} from "@react-three/drei";
// import { GLOBAL } from "../global";


const PathNode = ({position} : {position : number []}) => {
	return (
		<Box position={position as [number, number, number]}>
			<meshBasicMaterial color="hotpink" />
	   	</ Box>
	);
}

export const PartyPath = () => {
        return (
		<group>
			{[].map((p, i) => <PathNode key={`PathNode.${i}`} position={p} />)}
		</group>
	)
}
