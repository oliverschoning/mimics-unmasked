import{Box} from "@react-three/drei";
import { PARTY_PATH } from "../global";


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
			{PARTY_PATH.map((p, i) => <PathNode key={`PathNode.${i}`} position={p} />)}
		</group>
	)
}
