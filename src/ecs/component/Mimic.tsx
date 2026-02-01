import React from "react";
import { ECS } from "../state";
import { Image } from "@react-three/drei";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import type { Entity } from "../Entity";
import { degToRad } from "three/src/math/MathUtils.js";

type MimicProps = {
  entity: Entity;
};

const newSprite = (url: string) =>
  React.forwardRef<THREE.Mesh, MimicProps>(({ entity, ...props }, ref) => {
    const localRef = React.useRef<THREE.Mesh>(null!);
    const { camera } = useThree();

    // Use the forwarded ref if provided, otherwise fallback
    const meshRef = (ref as React.RefObject<THREE.Mesh>) ?? localRef;

    useFrame(() => {
      const mesh = meshRef.current;
      const object3D = entity.object3D;

      if (!mesh) return;

      mesh.position.copy(object3D.position);
      mesh.scale.copy(object3D.scale);
      mesh.rotation.copy(object3D.rotation);
      mesh.lookAt(camera.position);
    });

    return <Image ref={meshRef} url={url} transparent {...props} />;
  });


const HareIdleSprite = newSprite("/Hare_mimick.png");
const HareAttackSprite = newSprite("/Hare_attack.png");

const TrashIdleSprite = newSprite("/Trash_mimick.png");
const TrashAttackSprite = newSprite("/Trash_attack.png");

const TrashcanIdleSprite = newSprite("/Trashcan_mimick.png");
const TrashcanAttackSprite = newSprite("/Trashcan_attack.png");

const StopSignIdleSprite = newSprite("/Stop_sign_mimick.png");
const StopSignAttackSprite = newSprite("/Stop_sign_attack.png");

const StreetlightIdleSprite = newSprite("/Streetlight_mimick.png");
const StreetlightAttackSprite = newSprite("/Streetlight_attack.png");

const Tree1IdleSprite = newSprite("/Tree_1_mimick.png");
const Tree1AttackSprite = newSprite("/Tree_1_attack.png");

const Tree2IdleSprite = newSprite("/Tree_2_mimick.png");
const Tree2AttackSprite = newSprite("/Tree_2_attack.png");

const Tree3IdleSprite = newSprite("/Tree_3.png");
const Tree3AttackSprite = newSprite("/Tree_3_attack.png");

export const Mimick = ({ entity }: { entity: Entity }) => {
  const refA = React.useRef<THREE.Mesh>(null!);
  const refB = React.useRef<THREE.Mesh>(null!);

  const { camera } = useThree();

  useFrame(() => {
    const object3D = entity.object3D;

    if (!refA.current || !refB.current) return;

    refA.current.position.copy(object3D.position);
    refA.current.scale.copy(object3D.scale);
    refA.current.rotation.copy(object3D.rotation);
    refA.current.lookAt(camera.position);

    refB.current.position.copy(object3D.position);
    refB.current.scale.copy(object3D.scale);
    refB.current.rotation.copy(object3D.rotation);
    refB.current.lookAt(camera.position);

    if (entity.mimic?.state === "IDLE") {
      refA.current.visible = true;
      refB.current.visible = false;
    }

    if (entity.mimic?.state === "ATTACKING") {
      refA.current.visible = false;
      refB.current.visible = true;
    }

	if (entity.mimic.state === "DEAD") {
		refA.current.visible = false;
		refB.current.visible = true;
		refB.current.rotation.z = degToRad(90)
		refB.current.position.y = 2;
	}
  });

  const handleClick = () => {

	  console.log("CLICK")
		entity!.mimic!.state = "DEAD"
		console.log(entity.mimic)
  }

  return (
    <>

      {/* TRASH */}
      {entity.mimic?.type === "TRASH" && (
        <>
          <TrashIdleSprite  onClick={handleClick} ref={refA} entity={entity} />
          <TrashAttackSprite  onClick={handleClick} ref={refB} entity={entity} />
        </>
      )}

      {/* HARE */}
      {entity.mimic?.type === "HARE" && (
        <>
          <HareIdleSprite  onClick={handleClick} ref={refA} entity={entity} />
          <HareAttackSprite  onClick={handleClick} ref={refB} entity={entity} />
        </>
      )}

      {/* TRASHCAN */}
      {entity.mimic?.type === "TRASH_CAN" && (
        <>
          <TrashcanIdleSprite  onClick={handleClick} ref={refA} entity={entity} />
          <TrashcanAttackSprite  onClick={handleClick} ref={refB} entity={entity} />
        </>
      )}

      {/* STOP SIGN */}
      {entity.mimic?.type === "STOP_SIGN" && (
        <>
          <StopSignIdleSprite  onClick={handleClick} ref={refA} entity={entity} />
          <StopSignAttackSprite  onClick={handleClick} ref={refB} entity={entity} />
        </>
      )}

      {/* STREETLIGHT */}
      {entity.mimic?.type === "STREET_LIGHT" && (
        <>
          <StreetlightIdleSprite  onClick={handleClick} ref={refA} entity={entity} />
          <StreetlightAttackSprite  onClick={handleClick} ref={refB} entity={entity} />
        </>
      )}

      {/* TREE 1 */}
      {entity.mimic?.type === "TREE_1" && (
        <>
          <Tree1IdleSprite  onClick={handleClick} ref={refA} entity={entity} />
          <Tree1AttackSprite  onClick={handleClick} ref={refB} entity={entity} />
        </>
      )}

      {/* TREE 2 */}
      {entity.mimic?.type === "TREE_2" && (
        <>
          <Tree2IdleSprite  onClick={handleClick} ref={refA} entity={entity} />
          <Tree2AttackSprite  onClick={handleClick} ref={refB} entity={entity} />
        </>
      )}

      {/* TREE 3 */}
      {entity.mimic?.type === "TREE_3" && (
        <>
          <Tree3IdleSprite  onClick={handleClick} ref={refA} entity={entity} />
          <Tree3AttackSprite  onClick={handleClick} ref={refB} entity={entity} />
        </>
      )}
    </>
  );
};


const ATTACK_DISTANCE = 10;
const MOVEMENT_SPEED = 10;

const findHumanInAttackRange = (mimic: Entity, humans: Entity[]) => {
	return humans.find(human => {

        const direction = human.object3D.position.clone().sub(mimic.object3D.position);
        const distance = direction.length();

        if (distance <= ATTACK_DISTANCE) {
			console.log("ATTACK")
			return human;
        }
	})
}




const moveTowardsTarget = (
  mimic: Entity,
  human: Entity,
  dt: number
) => {
  const position = mimic.object3D.position;
        const target = human.object3D.position.clone();

        // Vector from current position to target
        const direction = target.clone().sub(position);

        const distance = direction.length();
        // // Move toward target
        direction.normalize();

        const step = Math.min(distance, MOVEMENT_SPEED * dt);

        position.addScaledVector(direction, step);

};

const mimicQuery = ECS.world.with("object3D", "mimic");
const partyMemberQuery = ECS.world.with("object3D", "partyMember")

// Helper function to check if the mimic has reached its target
  const hasArrivedAtTarget = (mimic: Entity, target: Entity, threshold = 0.5) => {
    if (!target?.object3D || !mimic.object3D) return false;
    const dx = mimic.object3D.position.x - target.object3D.position.x;
    const dz = mimic.object3D.position.z - target.object3D.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    return distance <= threshold;
  };

const System = () => {

  useFrame((_, dt) => {

    const humans: Entity[] = [];
    for (const h of partyMemberQuery) {
      humans.push(h);
    }

    for (const mimic of mimicQuery) {
      if (mimic.mimic.state === "IDLE") {
        const target = findHumanInAttackRange(mimic, humans);
        if (target) {
          mimic.mimic.state = "ATTACKING";
          mimic.mimic.target = target;
        }
        continue;
      }

      if (mimic.mimic.state === "ATTACKING") {
        moveTowardsTarget(mimic, mimic.mimic.target!, dt);
		
		if (hasArrivedAtTarget(mimic, mimic.mimic.target!)) {
			ECS.world.remove(mimic)
			// TODO
			mimic.mimic.target!.partyMember!.state = "DEAD"
		}

        continue;
      }

		if (mimic.mimic.state === "DEAD") {
			console.log("DEAD")
			mimic.object3D.rotation.z = degToRad(90)

		}

    }

  });

  return null;
};


const List = () => {
  return <ECS.Entities in={mimicQuery}>{(entity) => <Mimick entity={entity} />}</ECS.Entities>;
};



export default {
  List,
  System,
};
