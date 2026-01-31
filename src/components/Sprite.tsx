import { Image } from "@react-three/drei";

export const Sprite = ({ position, scale, url }) => {
  return (
    <Image
      url={url}
      position={position}
      scale={scale} // width, height
      transparent
    />
  )
}
