import { useControls } from "leva";
import PointsGrid from "./PointsGrid";
import { Perf } from "r3f-perf";

function Experience() {
  const { color } = useControls({
    color: "#fff",
  });
  return (
    <>
      <color attach="background" args={[color]} />
      <Perf position="top-left" />
      <PointsGrid />
    </>
  );
}

export default Experience;
