import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import CustomShaderMaterial from "three-custom-shader-material";
import * as THREE from "three";
import vert from "./shaders/test/vertex.glsl";
import frag from "./shaders/fragment.glsl";
import { useControls } from "leva";

const TestGrid = () => {
  const mat = useRef<any>(null);
  const { viewport, camera, size } = useThree();

  // UI in pixels for intuitive control, we'll convert to world units
  const shaderControls = useControls("Shader Effect", {
    strength: { value: 40, min: 0.0, max: 200, step: 1 }, // px
    density: { value: 0.1, min: 0.01, max: 0.2, step: 0.01 },
    radiusInner: { value: 100, min: 0, max: 500, step: 5 }, // px
    radiusOuter: { value: 250, min: 0, max: 1000, step: 5 }, // px
  });

  // Grid
  const { positions, sizes } = useMemo(() => {
    const cols = Math.max(
      2,
      Math.floor(viewport.width * shaderControls.density)
    );
    const rows = Math.max(
      2,
      Math.floor(viewport.height * shaderControls.density)
    );

    const total = cols * rows;
    const pts = new Float32Array(total * 3);
    const s = new Float32Array(total);

    let i = 0;
    for (let iy = 0; iy < rows; iy++) {
      for (let ix = 0; ix < cols; ix++) {
        const x = (ix / (cols - 1) - 0.5) * viewport.width;
        const y = (iy / (rows - 1) - 0.5) * viewport.height;
        pts[i * 3 + 0] = x;
        pts[i * 3 + 1] = y;
        pts[i * 3 + 2] = 0;
        s[i] = 1.0;
        i++;
      }
    }
    return { positions: pts, sizes: s };
  }, [viewport.width, viewport.height, shaderControls.density]);

  // uniforms
  const uniforms = useMemo(
    () => ({
      uMouseWorld: { value: new THREE.Vector2(-9999, -9999) },
      uStrength: { value: 0 }, // world units (filled every frame)
      uRadiusInner: { value: 0 }, // world units (filled every frame)
      uRadiusOuter: { value: 0 }, // world units (filled every frame)
    }),
    []
  );

  // Helpers for ray/plane and temp vectors
  const planeZ0 = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
    []
  );
  const mouseWorld3 = useMemo(() => new THREE.Vector3(), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  useFrame((state) => {
    // 1) Mouse world position on z=0 plane
    raycaster.setFromCamera(state.pointer, camera);
    raycaster.ray.intersectPlane(planeZ0, mouseWorld3);
    const mouseWorld2 = uniforms.uMouseWorld.value as THREE.Vector2;
    mouseWorld2.set(mouseWorld3.x, mouseWorld3.y);

    // 2) Convert px controls -> world units (uniform scale on this plane)
    const worldPerPx = state.viewport.width / state.size.width; // same for Y on this plane
    const strengthWorld = shaderControls.strength * worldPerPx;
    const rInnerWorld = shaderControls.radiusInner * worldPerPx;
    const rOuterWorld = shaderControls.radiusOuter * worldPerPx;

    // 3) Push to GPU
    if (mat.current) {
      mat.current.uniforms.uMouseWorld.value.copy(mouseWorld2);
      mat.current.uniforms.uStrength.value = strengthWorld;
      mat.current.uniforms.uRadiusInner.value = rInnerWorld;
      mat.current.uniforms.uRadiusOuter.value = rOuterWorld;
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
      </bufferGeometry>

      <CustomShaderMaterial
        ref={mat}
        baseMaterial={THREE.PointsMaterial}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        size={0.1}
        sizeAttenuation={false}
        color={"black"}
      />
    </points>
  );
};

export default TestGrid;
