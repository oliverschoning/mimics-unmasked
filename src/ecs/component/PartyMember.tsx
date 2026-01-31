import React from "react";
import { ECS } from "../state";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { Entity } from "../Entity";
import { PARTY_PATH } from "../../global";

const PartyMember = (entity: Entity) => {
  const ref = React.useRef<THREE.Mesh>(null!);

  useFrame(() => {
    ref.current.position.copy(entity.object3D.position);
    // ref.current.rotation.copy(entity.object3D.rotation.copy)
    // ref.current.scale.copy(entity.object3D.scale.copy)
  });

  return (
    <Sphere ref={ref}>
      {entity.partyLeader && <meshNormalMaterial />}
      {!entity.partyLeader && <meshBasicMaterial color="cornflowerblue" />}
    </Sphere>
  );
};

const partyMemberQuery = ECS.world.with("object3D", "partyMember", "partyLeader");

const List = () => {
  return (
    <ECS.Entities in={partyMemberQuery}>
      {(entity) => <PartyMember {...entity} />}
    </ECS.Entities>
  );
};

const MOVEMENT_SPEED = 5; // units per second
const ARRIVAL_EPSILON = 0.01;

const System = () => {
  useFrame((_, dt) => {
    for (const entity of partyMemberQuery) {
      if (entity.partyMember.state === "WALKING") {
        const position = entity.object3D.position;
        const target = entity.partyMember.target;

        // Vector from current position to target
        const direction = target.clone().sub(position);
        const distance = direction.length();
        // // Move toward target
        direction.normalize();
        const step = Math.min(distance, MOVEMENT_SPEED * dt);

        position.addScaledVector(direction, step);

        // Optional: keep velocity in sync
        if (entity.velocity) {
          entity.velocity.copy(direction).multiplyScalar(MOVEMENT_SPEED);
        }

		
      // Have we arrived?
      if (distance <= ARRIVAL_EPSILON) {
        position.copy(target);        // snap exactly to target
        entity.velocity?.set(0, 0, 0); // optional

		entity.partyLeader.targetPathIndex += 1;
		const nextNode = PARTY_PATH[ entity.partyLeader.targetPathIndex ]
		console.log("nextNode", nextNode)
		if (nextNode) {
			entity.partyMember.target.fromArray(nextNode);
		}
        continue;
      }
      }

    }
  });

  return null;
};

export default {
  List,
  System,
};
