import * as THREE from "three";

/* Our entity type */
export type Entity = {
  object3D: THREE.Object3D;
  velocity?: THREE.Vector3;
  partyMember?: { state: "IDLE" | "WALKING" | "DEAD"; target: THREE.Vector3 };
  partyLeader?: { targetPathIndex: number }
};
