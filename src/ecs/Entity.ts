import * as THREE from "three";

export type MimicType = "HARE" | "TREE_1" | "TREE_2" | "TREE_3" | "TRASH" | "TRASH_CAN" | "STOP_SIGN" | "STREET_LIGHT"
export type PartyMemberType = "LEADER" | "FEDORA" | "BOUBBLE" | "LEATHER" | "BUCKET_HAT"

/* Our entity type */
export type Entity = {
  object3D: THREE.Object3D;
  velocity?: THREE.Vector3;
  direction?: THREE.Vector3;
  partyMember?: { state: "IDLE" | "WALKING" | "DEAD"; type: PartyMemberType; target: THREE.Vector3 };
  partyLeader?: { targetPathIndex: number };

  mimic?: { state: "IDLE" | "ATTACKING" | "DEAD", type: MimicType, target?: Entity }


  path?: THREE.Mesh[]
  

  sprite?: { type: string }
};
