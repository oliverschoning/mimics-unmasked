import React from "react";
import * as THREE from "three";
import { ECS } from "./ecs/state"
import type { Entity } from "./ecs/Entity";
import { PARTY,PARTY_PATH } from "./global"


const newPartyMember = () => {

	const partyLeader: Entity = {
		object3D: new THREE.Object3D(),
		partyMember: { 
			state: "WALKING", 
			target: new THREE.Vector3(),
		},
		partyLeader: { targetPathIndex: 0 },
	}
	partyLeader.object3D.position.copy( new THREE.Vector3(-10, 0, 0))

	partyLeader.partyMember.target.fromArray(PARTY_PATH[0])

	PARTY.push(partyLeader);

	// const partyMemberPositions = [
	// 	new THREE.Vector3(-12, 0, 0),
	// 	new THREE.Vector3(-14, 0, 0),
	// 	new THREE.Vector3(-16, 0, 0),
	// 	new THREE.Vector3(-18, 0, 0),	
	// ];
	//
	// const targets = [
	// 	new THREE.Vector3(8, 0, 0),	
	// 	new THREE.Vector3(6, 0, 0),
	// 	new THREE.Vector3(4, 0, 0),
	// 	new THREE.Vector3(2, 0, 0),
	// 	new THREE.Vector3(0, 0, 0),
	// ]
	//
	// partyMemberPositions.forEach((p) => {
	// 	const partyMember: Entity = {
	// 		object3D: new THREE.Object3D(),
	// 		partyMember: { 
	// 			state: "WALKING",
	// 			target: new THREE.Vector3(),
	// 		},
	// 	}
	// 	partyMember.object3D.position.copy(p)
	//
	// 	PARTY.push(partyMember);
	// });


	// PARTY.forEach((p, i) => {
	// 	p.partyMember?.target.copy(targets[i])
	// })

	PARTY.forEach((p) => {
		ECS.world.add(p);
	})
}



export const Setup = () => {
	React.useEffect(() => {
		newPartyMember();
	}, [])

	return null;
}
