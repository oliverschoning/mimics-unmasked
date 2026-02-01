import React from "react";
import { Canvas } from "@react-three/fiber";
import { PersistentOrbitControls } from "../../util/PersistentOrbitControls";
import "../../index.css";

import type { Entity,PartyMemberType } from "../Entity";
import * as THREE from "three";
import { Plane } from "@react-three/drei";
import { ECS } from "../state";
import Mimic from "./Mimic";
import PartyMember from "./PartyMember";

export const FixtureWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Canvas>
      <ambientLight />
      {children}
      <PersistentOrbitControls persist={{ localStorageKey: "GAME" }} />
    </Canvas>
  );
};


export default function MimicFixture() {
  const handlePointerMove = (evt) => {
    const point = evt.point;

	for (const human of partyMemberQuery) {
		human.object3D.position.copy(point)
		human.object3D.position.z = 1
	}

  };

  React.useEffect(() => {
    const partyLeader: Entity = {
      object3D: new THREE.Object3D(),
      partyMember: {
		  type: "LEADER",
        state: "IDLE",
        target: new THREE.Vector3(0, 0, 0),
      },
      partyLeader: { targetPathIndex: 0 },
    };

    // Helper function to create a party member
    const createPartyMember = (
      position: THREE.Vector3,
      type: PartyMemberType,
    ): Entity => {
      const entity: Entity = {
        object3D: new THREE.Object3D(),
        partyMember: {
          state: "IDLE",
		  type: type,
          target: new THREE.Vector3(0, 0, 0),
        },
      };

      if (type === "LEADER") {
        entity.partyLeader = { targetPathIndex: 0 };
      }

      entity.object3D.position.copy(position);

      return ECS.world.add(entity);
    };

    // Create 4 party members
    const partyMembers = [
      createPartyMember(new THREE.Vector3(-100, -100, -100), "LEADER"), // leader
      // createPartyMember(new THREE.Vector3(-90, -100, -100), "FEDORA"),
      // createPartyMember(new THREE.Vector3(-110, -100, -100), "LEADER"),
      // createPartyMember(new THREE.Vector3(-100, -100, -90), "BOUBBLE"),
      // createPartyMember(new THREE.Vector3(-100, -100, -90), "BUCKET_HAT"),
    ];

    partyLeader.object3D.position.set(-100, -100, -100);

    partyMembers.forEach((pm) => {
      ECS.world.add(pm);
    });

    // --- HARE ---
    const hare: Entity = {
      object3D: new THREE.Object3D(),
      mimic: {
        state: "IDLE",
        type: "HARE",
      },
    };
    hare.object3D.position.set(3, 5, 1);
    ECS.world.add(hare);

    // --- TRASH ---
    const trash: Entity = {
      object3D: new THREE.Object3D(),
      mimic: {
        state: "IDLE",
        type: "TRASH",
      },
    };
    trash.object3D.position.set(5, 0, 1);
    ECS.world.add(trash);

    // --- STOP SIGN ---
    const stopSign: Entity = {
      object3D: new THREE.Object3D(),
      mimic: {
        state: "IDLE",
        type: "STOP_SIGN",
      },
    };
    stopSign.object3D.position.set(2, 0, 1);
    ECS.world.add(stopSign);

    // --- STREETLIGHT ---
    const streetlight: Entity = {
      object3D: new THREE.Object3D(),
      mimic: {
        state: "IDLE",
        type: "STREETLIGHT",
      },
    };
    streetlight.object3D.position.set(-4, 0, 1);
    ECS.world.add(streetlight);

    // --- TREE 2 ---
    const tree2: Entity = {
      object3D: new THREE.Object3D(),
      mimic: {
        state: "IDLE",
        type: "TREE_2",
      },
    };
    tree2.object3D.position.set(-2, 0, 1);
    ECS.world.add(tree2);
  }, []);

  return (
    <FixtureWrapper>
      <Mimic.List />
      <Mimic.System />

	  <PartyMember.List /> 

      <Plane args={[10, 10]} onPointerMove={handlePointerMove} />
    </FixtureWrapper>
  );
}

const partyMemberQuery = ECS.world.with("object3D", "partyMember");

// const PartyMemberList = () => {
//   return (
//     <ECS.Entities in={partyMemberQuery}>
//       {(entity) => <RenderPartyMember {...entity} />}
//     </ECS.Entities>
//   );
// };
//
// const RenderPartyMember = (entity: Entity) => {
//   // Use the forwarded ref if provided, otherwise fallback
//   const ref = React.useRef<THREE.Mesh>(null!);
//
//   useFrame(() => {
//     const mesh = ref.current;
//     const object3D = entity.object3D;
//
//     if (!mesh) return;
//
//     mesh.position.copy(object3D.position);
//     mesh.scale.copy(object3D.scale);
//     mesh.rotation.copy(object3D.rotation);
//   });
//
//   return (
//     <Sphere ref={ref} args={[0.5]}>
//       <meshNormalMaterial />
//     </Sphere>
//   );
// };
