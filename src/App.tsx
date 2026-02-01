import { Canvas,useFrame,useThree } from "@react-three/fiber";
import { Box,
Environment,
Gltf,
Sphere,
Stats, 
useGLTF} from "@react-three/drei";
import { PersistentOrbitControls } from "./util/PersistentOrbitControls";
import { Suspense,useEffect,useEffectEvent,useRef,useState } from "react";
import * as THREE from "three"
import { ECS } from "./ecs/state";	
import type { Entity,MimicType } from "./ecs/Entity";
import PartyMember from "./ecs/component/PartyMember";
import { HareSprite,
StopSignSprite,
StreetlightSprite,
TrashcanSprite, 
TrashSprite, 
Tree1Sprite,
Tree2Sprite,
Tree3Sprite,
} from "./components/Sprite";
import Mimic from "./ecs/component/Mimic";
import { atom,useAtom } from "jotai"

import CameraController from "./components/CameraController"


const partyLeaderQuery = ECS.world.with("object3D", "partyMember", "direction")

const getPartyLeader = () => {
	let leader: Entity;
	for (const pm of partyLeaderQuery) {
		leader = pm;
		return leader;
	}
}


//
// const CameraPath = () => {
//   const { camera } = useThree();
//
//   // persistent vectors (no GC, no jitter)
//   const targetPos = useRef(new THREE.Vector3());
//   const desiredPos = useRef(new THREE.Vector3());
//   const lookTarget = useRef(new THREE.Vector3());
//
//   useFrame((_, delta) => {
//     const leader = getPartyLeader();
//     if (!leader) return;
//
//     const obj = leader.object3D;
//
//     // === CONFIG ===
//     const followDistance = 6;
//     const followHeight = 2;
//     const lookAhead = 2;
//     const positionDamping = 6;
//     const rotationDamping = 8;
//
//     // Forward direction (world-space)
//     const forward = new THREE.Vector3(0, 0, 1)
//       .applyQuaternion(obj.quaternion)
//       .normalize();
//
//     // Target we want the camera to orbit around
//     targetPos.current.copy(obj.position);
//     targetPos.current.y += followHeight;
//
//     // Desired camera position (behind the character)
//     desiredPos.current
//       .copy(targetPos.current)
//       .addScaledVector(forward, followDistance);
//
//     // Smooth camera movement
//     camera.position.lerp(
//       desiredPos.current,
//       1 - Math.exp(-positionDamping * delta)
//     );
//
//     // Look slightly ahead of the character (feels WAY better)
//     lookTarget.current
//       .copy(obj.position)
//       .addScaledVector(forward, lookAhead);
//
//     // Smooth rotation
//     const targetQuat = new THREE.Quaternion();
//     const m = new THREE.Matrix4().lookAt(
//       camera.position,
//       lookTarget.current,
//       new THREE.Vector3(0, 1, 0)
//     );
//     targetQuat.setFromRotationMatrix(m);
//
//     camera.quaternion.slerp(
//       targetQuat,
//       1 - Math.exp(-rotationDamping * delta)
//     );
//   });
//
//   return null;
// };



const SPRITE_Y_OFFSET = 4;	
const SPRITE_SCALE = [5, 5, 5];
const TREE_SCALE = [10, 10, 10];


const pathAtom = atom<THREE.Vector3[]>([])

const Setup = () => {
	const pathTrace = useGLTF("/path_trace.glb")
	const replaceObjects = useGLTF("/replacive_objects.glb")
	const rabbits = useGLTF("/rabbits.glb")
	const mimics = useGLTF("/mimics.glb")
	const lampMimics = useGLTF("/mimic_lamp.glb")
	
	const [, setPath] = useAtom(pathAtom)

	useEffect(() => {
		console.log("Setup");

		console.log("CREATE PATH")
		const nodes: THREE.Mesh[] = [];
		Object.keys(pathTrace.meshes).forEach(key => {
			const node = pathTrace.meshes[key];
			node.parent!.position.y += 2
			nodes.push(node);
		})
		
		ECS.world.add({
				object3D: new THREE.Object3D(),
				path:  nodes,
			} )

		
		setPath( nodes.map(n => n.parent!.position ))





		  const partyLeader: Entity = {
      object3D: new THREE.Object3D(),
      partyMember: {
		  type: "LEADER",
        state: "WALKING",
        target: new THREE.Vector3(0, 0, 0),
      },
	  velocity: new THREE.Vector3(),
		direction: new THREE.Vector3(...nodes[0].position.clone().toArray()),
      partyLeader: { targetPathIndex: 0 },
    };
	

	partyLeader.object3D.position.copy(nodes[0].parent!.position)
	partyLeader.object3D.scale.set(4, 4, 4)


	ECS.world.add(partyLeader)
	


	console.log("ADD REPLACE OBJECTS")
	console.log(replaceObjects)
	
	Object.keys(replaceObjects.meshes).map(key => {
		const mesh = replaceObjects.meshes[ key ]
		
		const sprite: Entity = {
			object3D: new THREE.Object3D(),
			sprite: { type: key },
		}

		sprite.object3D.position.copy(mesh.parent!.position)
		sprite.object3D.position.y += SPRITE_Y_OFFSET
		
		if (key.includes("rab")) {
			sprite.object3D.position.y -= 1;
		}
		

		ECS.world.add(sprite);
	})


	}, [])
	
	const getMimicType = (key: string): MimicType => {
		
		if (key.includes("trash_can")) {
			return "TRASH_CAN"
		}

		if (key.includes("trash_bag")) {
			return "TRASH"
		}

		if (key.includes("lamp")) {
			return "STREET_LIGHT"
		}
		
		if (key.includes("stop_sign")) {
			return "STOP_SIGN"
		}
		
		if (key.includes("regular_tree")) {
			return "TREE_1"
		}

		if (key.includes("pine")) {
			return "TREE_2"
		}

		if (key.includes("birch")) {
			return "TREE_3"
		}

		return "HARE"
	}

	console.log("ADD MIMICS")
	console.log(mimics.meshes)
	Object.keys(mimics.meshes).map(key => {
		const mesh = mimics.meshes[ key ]
		
		const sprite: Entity = {
			object3D: new THREE.Object3D(),
			mimic: { state: "IDLE", type: getMimicType(key) }
		}

		sprite.object3D.position.copy(mesh.parent!.position)
		sprite.object3D.position.y += 2.5;


		sprite.object3D.scale.set(4, 4, 4)
		ECS.world.add(sprite);
	})
	Object.keys(lampMimics.meshes).map(key => {
		const mesh = lampMimics.meshes[ key ]
		
		const sprite: Entity = {
			object3D: new THREE.Object3D(),
			mimic: { state: "IDLE", type: getMimicType(key) }
		}

		sprite.object3D.position.copy(mesh.parent!.position)
		sprite.object3D.position.y += SPRITE_Y_OFFSET

		sprite.object3D.scale.set(4, 4, 4)
		ECS.world.add(sprite);
	})

	return null;
}

const pathNodeQuery = ECS.world.with("path")

const PathList = () => {
  return <ECS.Entities in={pathNodeQuery}>{(entity) => {
		const path = entity.path;
		
	  return (
		<group>
		{ path.map((node, i) => <Box key={"PathNode." + i} scale={[0.1, 0.1, 0.1]} position={node.parent!.position}><meshBasicMaterial color="hotpink" /></Box>)}
		</group>
	  )

  }}</ECS.Entities>;
};

const spriteQuery = ECS.world.with("object3D", "sprite");


const SpriteList = () => {
  return (
    <ECS.Entities in={spriteQuery}>
      {(entity) => {
        const key = entity.sprite!.type;
        const position = entity.object3D.position;

        if (key.startsWith("rabbit")) {
          return <HareSprite scale={SPRITE_SCALE} position={position} />;
        }

        if (key.startsWith("trash_can")) {
          return <TrashcanSprite scale={SPRITE_SCALE} position={position} />;
        }

        if (key.startsWith("trash_bag")) {
          return <TrashSprite scale={SPRITE_SCALE} position={position} />;
        }

        if (key.startsWith("stop_sign")) {
          return <StopSignSprite scale={SPRITE_SCALE} position={position} />;
        }

        if (key.startsWith("lamp")) {
          return <StreetlightSprite scale={SPRITE_SCALE} position={position} />;
        }

        if (key.startsWith("regular_tree")) {
          return <Tree1Sprite scale={TREE_SCALE} position={position} />;
        }

        if (key.startsWith("pine")) {
          return <Tree2Sprite scale={TREE_SCALE} position={position} />;
        }

        if (key.startsWith("birch")) {
          return <Tree1Sprite scale={TREE_SCALE} position={position} />;
        }

        return null;
      }}
    </ECS.Entities>
  );
};


export const App = () => {
	const [ pathPositions ] = useAtom(pathAtom)


  return (
    <Canvas>
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <ambientLight intensity={0.3} />
	 	 
		<Suspense>
			<Gltf visible={true} src="/textured.glb" />	
			<Gltf visible={true} src="/banyan.glb" />	
			<Gltf visible={true} src="/elm.glb" />	
			<Gltf visible={true} src="/tree.glb" />	
			<Setup />



		</Suspense>

			<PartyMember.List />
			<PartyMember.System />
			
			<Mimic.List />
			<Mimic.System />

			<SpriteList />


			
<directionalLight
  position={[10, 15, 10]}
  intensity={1}
  shadow-mapSize={[2048, 2048]}
  shadow-camera-far={50}
  shadow-camera-left={-20}
  shadow-camera-right={20}
  shadow-camera-top={20}
  shadow-camera-bottom={-20}
/>

<hemisphereLight
  groundColor="#444444"
  intensity={0.6}
/>

  
<CameraPath  />
  
	

    </Canvas>
  );
};



let speed = 0.000125;

function CameraPath() {
  const { camera } = useThree()
  const tRef = useRef(0)
  const [path] = useAtom(pathAtom) // pathAtom should be an array of THREE.Vector3
	const [cameraFollowEnabled, setCameraFollowEnabled] = useState(false)
	
	useEffect(() => {
		setTimeout(() => {
			setCameraFollowEnabled(true)
		}, 2000)

		setTimeout(() => {
			speed = 0.00013;
		}, 20000)


		
	}, [])
  // Make sure path is an array of THREE.Vector3
  const curve = new THREE.CatmullRomCurve3(path, false, "catmullrom", 0.5)
  // false: not closed
  // "catmullrom": type of interpolation
  // 0.5: tension (0 = tight, 1 = loose)


  useFrame(() => {
	  if (!cameraFollowEnabled) {
		return;
	  }
    tRef.current += speed
    if (tRef.current > 1) tRef.current = 1 // Stop at end, or reset to 0 to loop

    const pos = curve.getPoint(tRef.current)
    camera.position.copy(pos)

	camera.position.y = 3;


    const lookAtPos = curve.getPoint(Math.min(tRef.current + 0.01, 1))
    camera.lookAt(lookAtPos)
  })

  return null
}

