import { createRoot } from "react-dom/client";
import "./index.css";
import Experience from "./Experience.tsx";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { OrthographicCamera } from "@react-three/drei";

createRoot(document.getElementById("root")!).render(
  <>
    <Canvas gl={{ alpha: false, antialias: true }} className="">
      <OrthographicCamera makeDefault position={[0, 0, 5]} />
      <Experience />
    </Canvas>
    <Leva collapsed />
  </>
);
