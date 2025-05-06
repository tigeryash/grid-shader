import { Environment, OrbitControls } from "@react-three/drei";
import { useControls } from "leva";
import { Perf } from "r3f-perf";

function Experience() {
  const { color } = useControls({
    color: "#000",
  });
  return (
    <>
      <color attach="background" args={[color]} />
      <Perf position="top-left" />
      <OrbitControls />
      <Environment
        background
        preset="city"
        backgroundIntensity={1}
        environmentIntensity={0.6}
      />
      <mesh position={[0, -1, 0]}>
        <boxGeometry args={[10, 1, 10]} />
        <meshStandardMaterial color={"#000"} />
      </mesh>

      <mesh position={[-2, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={"#f00"} />
      </mesh>

      <mesh position={[2, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={"#0f0"} />
      </mesh>

      <directionalLight
        position={[0.25, 2, -2.25]}
        intensity={2.6}
        color={"#ffffff"}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={15}
      />
      <ambientLight intensity={0.2} />
    </>
  );
}

export default Experience;
