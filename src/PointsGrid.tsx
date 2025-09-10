import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import CustomShaderMaterial from "three-custom-shader-material";
import * as THREE from "three";
import vert from "./shaders/vertex.glsl";
import frag from "./shaders/fragment.glsl";

const PointsGrid = () => {
  const mat = useRef<any>(null);
  const { size, viewport, pointer } = useThree();

  // Build a grid of points in world space
  const { positions, sizes } = useMemo(() => {
    const cols = viewport.width * 0.08;
    const rows = viewport.height * 0.08;
    const pts: number[] = [];
    const s: number[] = [];
    const w = viewport.width;
    const h = viewport.height - 20;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const px = (x / (cols - 1) - 0.5) * w;
        const py = (y / (rows - 1) - 0.5) * h;
        pts.push(px, py, 0);
        s.push(3); // pixel size for gl_PointSize; you can vary
      }
    }
    return {
      positions: new Float32Array(pts),
      sizes: new Float32Array(s),
    };
  }, [viewport.width, viewport.height]);

  const uniforms = useMemo(
    () => ({
      uMouse: { value: new THREE.Vector2(-1, -1) },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uRadius: { value: 200 }, // Radius in pixels
      uStrength: { value: 0.15 }, // How strong the push effect is
      uTime: { value: 0 },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (!mat.current) return;
    const x = pointer.x * size.width * 0.5 + size.width * 0.5;
    const y = -pointer.y * size.height * 0.5 + size.height * 0.5;
    mat.current.uMouse = [x, y];
    mat.current.uResolution = [size.width, size.height];
    mat.current.uTime = clock.getElapsedTime();
  });

  return (
    <points args={[]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
      </bufferGeometry>
      <CustomShaderMaterial
        ref={mat}
        // Base on PointsMaterial so size/sizeAttenuation work out of the box
        baseMaterial={THREE.PointsMaterial}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        // Base material props
        transparent={true}
        depthWrite={false}
        size={1} // base size; multiplied by aSize attribute
        sizeAttenuation={false} // keep constant pixel size
        color={"black"}
      />
    </points>
  );
};

export default PointsGrid;
