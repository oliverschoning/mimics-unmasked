import { useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';

function CameraController({ shouldAnimate }) {
  const { set, gl, camera } = useThree();
  const [isAnimating, setIsAnimating] = useState(false);
  const [targetLookAt, setTargetLookAt] = useState(new THREE.Vector3(0, 10, -30));
  useEffect(() => {
    console.log()
    if (camera) {
      camera.position.set(-30, 30, 30);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    }
  }, [set]);

  useEffect(() => {
    if (shouldAnimate && camera) {
      setIsAnimating(true);

      const finalPosition = { x: 0, y: 10, z: 0 };

      const timeline = gsap.timeline({
        onUpdate: () => {
          camera.updateProjectionMatrix();
        },
        onComplete: () => {
          setIsAnimating(false);
          camera.lookAt(targetLookAt);
          document.addEventListener('mousemove', handleMouseMove);
        },
      });

      // Animate the camera position
      timeline.to(camera.position, {
        duration: 2,
        x: finalPosition.x,
        y: finalPosition.y,
        z: finalPosition.z,
        ease: 'power2.out',
        onUpdate: () => {
          const currentPos = new THREE.Vector3(
            camera.position.x,
            camera.position.y,
            camera.position.z
          );
          const targetQuat = new THREE.Quaternion().setFromRotationMatrix(
            new THREE.Matrix4().lookAt(currentPos, targetLookAt, new THREE.Vector3(0, 1, 0))
          );
          camera.quaternion.slerp(targetQuat, 0.1);
        }
      });

    }

    return () => {
      gsap.killTweensOf(camera.position);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [shouldAnimate]);

  const handleMouseMove = (event) => {
    if (isAnimating) return;

    const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    camera.rotation.order = 'YXZ';
    camera.rotation.y -= movementX * 0.002; // Yaw (horizontal rotation)
    camera.rotation.x -= movementY * 0.002; // Pitch (vertical rotation)

    camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
  };

  useFrame(() => {
    if (isAnimating) {
      // If using controls, update them here
    }
  });

  return (
    <perspectiveCamera
      fov={75}
      aspect={gl.domElement.clientWidth / gl.domElement.clientHeight}
      near={0.1}
      far={200}
    />
  );
}

export default CameraController;
