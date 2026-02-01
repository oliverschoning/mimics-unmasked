import React from "react";
import { HareSprite, TrashSprite, TrashcanSprite, StopSignSprite, StreetlightSprite, Tree1Sprite, Tree2Sprite, Tree3Sprite } from "./Sprite";
import { FixtureWrapper } from "../ecs/component/Mimic.fixture"

const sprites = [
  HareSprite,
  TrashSprite,
  TrashcanSprite,
  StopSignSprite,
  StreetlightSprite,
  Tree1Sprite,
  Tree2Sprite,
  Tree3Sprite,
];

function Example () {
  // Generate 10 random positions
  const randomSprites = Array.from({ length: 10 }, () => {
    const SpriteComponent = sprites[Math.floor(Math.random() * sprites.length)];
    return {
      SpriteComponent,
      position: [
        (Math.random() - 0.5) * 20, // x between -10 and 10
        0,                           // y fixed at 0
        (Math.random() - 0.5) * 20, // z between -10 and 10
      ],
      scale: [1, 1, 1],              // uniform scale
    };
  });

  return (
    <group>
      {randomSprites.map(({ SpriteComponent, position, scale }, index) => (
        <SpriteComponent key={index} position={position} scale={scale} />
      ))}
    </group>
  );
};

export default function SpriteFixture() {

	return (<FixtureWrapper>
		<Example />
		</FixtureWrapper>)
}
