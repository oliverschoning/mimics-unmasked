import { World } from "miniplex"
import createReactAPI from "miniplex-react"
import type { Entity } from "./Entity";


/* Create a Miniplex world that holds our entities */
const world = new World<Entity>()

/* Create and export React bindings */
export const ECS = createReactAPI(world)
