// src/components/PartyMembers.tsx
import React, { useEffect, useRef } from "react";
import { Image } from "@react-three/drei";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useInterval } from "usehooks-ts" // Assuming you have a useInterval hook
import type { Entity } from "../Entity";
import { ECS } from "../state";
import { degToRad } from "three/src/math/MathUtils.js";

type PartyMemberProps = {
  entity: Entity;
};

const ANIMATION_FRAME = 0.5; // seconds

const newPartySprite = (url: string) =>
  React.forwardRef<THREE.Mesh, PartyMemberProps>(({ entity }, ref) => {
    const localRef = useRef<THREE.Mesh>(null!);
    const { camera } = useThree();

    const meshRef = (ref as React.RefObject<THREE.Mesh>) ?? localRef;

    useFrame(() => {
      const mesh = meshRef.current;

      if (!mesh || !entity.object3D) return;

      mesh.position.copy(entity.object3D.position);
      mesh.scale.copy(entity.object3D.scale);
      mesh.rotation.copy(entity.object3D.rotation);
      mesh.lookAt(camera.position);


	  mesh.material.opacity = 0.75;
	  mesh.material.transparent = true;

	  if (entity.partyMember?.state === "DEAD") {
		mesh.rotation.z = degToRad(90)
	  }
    });

    return <Image ref={meshRef} url={url} transparent />;
  });

// ----- PARTY MEMBER SPRITES -----
const Leader1Sprite = newPartySprite("/Leader_1.png");
const Leader2Sprite = newPartySprite("/Leader_2.png");

const Fedora1Sprite = newPartySprite("/Fedora_1.png");
const Fedora2Sprite = newPartySprite("/Fedora_2.png");

const BoubbleJacket1Sprite = newPartySprite("/Boubble_jacket_1.png");
const BoubbleJacket2Sprite = newPartySprite("/Boubble_jacket_2.png");

const LeatherJacket1Sprite = newPartySprite("/Leather_jacket_1.png");
const LeatherJacket2Sprite = newPartySprite("/Leather_jacket_2.png");

const BucketHat1Sprite = newPartySprite("/Bucket_hat_1.png");
const BucketHat2Sprite = newPartySprite("/Bucket_hat_2.png");

// ----- PARTY MEMBER COMPONENT -----
export const PartyMember = ({ entity }: PartyMemberProps) => {
  const refA = useRef<THREE.Mesh>(null!);
  const refB = useRef<THREE.Mesh>(null!);
  const frameRef = useRef<boolean>(true);
	
	useEffect(() => {
		refB.current.visible = false;
	}, [])

  useInterval(() => {
	if (entity.partyMember?.state === "DEAD") {	
		return;
	}


	if (frameRef.current) {
		refA.current.visible = true;
		refB.current.visible = false;
	} else {
		refA.current.visible = false;
		refB.current.visible = true;
	}
	frameRef.current = !frameRef.current;

  }, ANIMATION_FRAME * 1000); // convert seconds to ms

  return (
    <>
      {entity.partyMember?.type === "LEADER" && (
        <>
          <Leader1Sprite ref={refA} entity={entity} />
          <Leader2Sprite ref={refB} entity={entity} />
        </>
      )}

      {entity.partyMember?.type === "FEDORA" && (
        <>
          <Fedora1Sprite ref={refA} entity={entity} />
          <Fedora2Sprite ref={refB} entity={entity} />
        </>
      )}

      {entity.partyMember?.type === "BOUBBLE" && (
        <>
          <BoubbleJacket1Sprite ref={refA} entity={entity} />
          <BoubbleJacket2Sprite ref={refB} entity={entity} />
        </>
      )}

      {entity.partyMember?.type === "LEATHER" && (
        <>
          <LeatherJacket1Sprite ref={refA} entity={entity} />
          <LeatherJacket2Sprite ref={refB} entity={entity} />
        </>
      )}

      {entity.partyMember?.type === "BUCKET_HAT" && (
        <>
          <BucketHat1Sprite ref={refA} entity={entity} />
          <BucketHat2Sprite ref={refB} entity={entity} />
        </>
      )}
    </>
  );
};

// ----- PARTY MEMBER LIST -----
const partyQuery = ECS.world.with("object3D", "partyMember", "partyLeader");

const pathQuery = ECS.world.with("path")

const getPathNode = (idx: number) => {
	for (const path of pathQuery) {
		return path.path[ idx ]
	}
}
const List = () => {
  return <ECS.Entities in={partyQuery}>{(entity) => <PartyMember entity={entity} />}</ECS.Entities>;
};
const MOVEMENT_SPEED = 3.5 // units per second
const ARRIVAL_EPSILON = 0.01;

const partyLeaderQuery = ECS.world.with("object3D", "partyMember", "partyLeader", "direction")

const getPartyLeader = () => {
	let leader: Entity;
	for (const pm of partyLeaderQuery) {
		leader = pm;
		return leader;
	}
}


const System = () => {

  useFrame((_, dt) => {
	const partyLeader = getPartyLeader()



	if (!partyLeader) {
		// TODO
		// set new leader 
		return;
	}

      if (partyLeader!.partyMember!.state === "WALKING") {
		  const targetNode = getPathNode(partyLeader.partyLeader!.targetPathIndex)

		  if (!targetNode) {
			return;
		  }
		


        // Vector from current position to target
        const direction = targetNode.parent!.position.clone().sub(partyLeader.object3D.position);


        const distance = direction.length();
        // // Move toward target
        direction.normalize();

		ECS.world.addComponent(partyLeader, "direction", direction);

        const step = Math.min(distance, MOVEMENT_SPEED * dt);

        partyLeader.object3D.position.addScaledVector(direction, step);
		
		    if (distance <= ARRIVAL_EPSILON) {
		      partyLeader.object3D.position.copy(targetNode.parent!.position);        // snap exactly to target


				partyLeader.partyLeader!.targetPathIndex += 1;
				const nextNode = getPathNode(partyLeader.partyLeader!.targetPathIndex)
				if (nextNode) {
					partyLeader!.partyMember!.target = (nextNode.position);
				}
		    }
      }

    })

  return null;
};




export default {
	List,
	System
}
