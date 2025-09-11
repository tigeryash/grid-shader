import { useControls } from "leva";
// import PointsGrid from "./PointsGrid";
import { Perf } from "r3f-perf";
import TestGrid from "./test-grid";

function Experience() {
  const { color } = useControls({
    color: "#fff",
  });
  return (
    <>
      <color attach="background" args={[color]} />
      <Perf position="top-left" />
      <TestGrid />
    </>
  );
}

export default Experience;
