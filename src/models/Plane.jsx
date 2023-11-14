import { useAnimations, useGLTF } from "@react-three/drei";
import planeScene from "../assets/3d/plane.glb";
import { useEffect, useRef } from "react";
import * as THREE from "three";
const Plane = ({ isRotating, ...props }) => {
  const ref = useRef();
  const { scene, animations } = useGLTF(planeScene);
 
  const take001Animation = useRef(null);

  useEffect(() => {
    // Find the "Take 001" animation
    if (animations && animations.length > 0) {
      take001Animation.current = animations.find(animation => animation.name === "Take 001");
    }
  }, [animations]);

  useEffect(() => {
    if (isRotating && take001Animation.current) {
      console.log(isRotating);

      // Set up the animation mixer
      const mixer = new THREE.AnimationMixer(scene);
      const action = mixer.clipAction(take001Animation.current);
      action.play();

      // Update the mixer in the animation loop
      const animate = () => {
        mixer.update(0.016); // Assuming a frame rate of 60 fps
        requestAnimationFrame(animate);
      };

      animate();

      // Clean up the mixer when the component unmounts
      return () => {
        mixer.stopAllAction();
        mixer.uncacheRoot(scene);
      };
    }
  }, [isRotating, scene]);


  return (
    <mesh {...props}>
      <primitive object={scene} />
    </mesh>
  );
};

export default Plane;
