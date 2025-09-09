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
  const { positions, sizes, count } = useMemo(() => {
    const cols = 120;
    const rows = 80;
    const pts: number[] = [];
    const s: number[] = [];
    const w = viewport.width;
    const h = viewport.height;
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
      count: cols * rows,
    };
  }, [viewport.width, viewport.height]);

  useFrame(({ clock }) => {
    if (!mat.current) return;
    const x = (pointer.x + 1) * 0.5 * size.width;
    const y = (-pointer.y + 1) * 0.5 * size.height;
    mat.current.uMousex = x;
    mat.current.uMousey = y;
    mat.current.uResolution = (size.width, size.height);
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
        uniforms={{
          uMouse: { value: new THREE.Vector2(-1, -1) },
          uResolution: { value: new THREE.Vector2(1, 1) },
          uRadius: { value: 180 },
          uStrength: { value: 0.12 }, // tune for your world scale
        }}
        // Base material props
        transparent={true}
        depthWrite={false}
        size={1}
        sizeAttenuation={false} // keep constant pixel size
        color={"#000"} // base color; used as csm_DiffuseColor
      />
    </points>
  );
};

export default PointsGrid;
