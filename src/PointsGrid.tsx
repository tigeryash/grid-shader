import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import CustomShaderMaterial from "three-custom-shader-material";
import * as THREE from "three";
import vert from "./shaders/vertex.glsl";
import frag from "./shaders/fragment.glsl";
import { useControls } from "leva";

const PointsGrid = () => {
  const mat = useRef<any>(null);
  const { viewport } = useThree();

  const shaderControls = useControls("Shader Effect", {
    radius: { value: 200, min: 50, max: 1000, step: 10 },
    strength: { value: 0.25, min: 0.0, max: 2.0, step: 0.01 },
    density: { value: 0.1, min: 0.01, max: 0.2, step: 0.01 },
    radiusInner: { value: 100, min: 0, max: 500, step: 5 },
    radiusOuter: { value: 250, min: 0, max: 500, step: 5 },
  });

  // --- RESPONSIVE Grid Calculation (Corrected) ---
  const { positions, sizes } = useMemo(() => {
    // This DENSITY factor is your ".08" but more explicit.
    // It means "we want about 8 points for every 1 world unit of space".

    // Ensure we have integers for our loops by using Math.floor()
    const cols = viewport.width * shaderControls.density;
    const rows = viewport.height * shaderControls.density;

    const totalPoints = cols * rows;
    const pts = new Float32Array(totalPoints * 3);
    const s = new Float32Array(totalPoints);

    let i = 0;
    for (let iy = 0; iy < rows; iy++) {
      for (let ix = 0; ix < cols; ix++) {
        // Distribute points across the viewport width and height
        const x = (ix / (cols - 1) - 0.5) * viewport.width;
        const y = (iy / (rows - 1) - 0.5) * viewport.height;

        pts[i * 3 + 0] = x;
        pts[i * 3 + 1] = y;
        pts[i * 3 + 2] = 0;
        s[i] = 1.0;
        i++;
      }
    }

    return {
      positions: pts,
      sizes: s,
    };
    // This dependency array ensures the grid rebuilds when the viewport size changes.
  }, [viewport.width, viewport.height, shaderControls.density]);

  const uniforms = useMemo(
    () => ({
      uMouse: { value: new THREE.Vector2(-1, -1) },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uRadius: { value: 200 }, // Radius in pixels
      uStrength: { value: shaderControls.strength }, // How strong the push effect is
      uTime: { value: 0 },
      uRadiusInner: { value: shaderControls.radiusInner },
      uRadiusOuter: { value: shaderControls.radiusOuter },
    }),
    [
      shaderControls.strength,
      shaderControls.radiusInner,
      shaderControls.radiusOuter,
    ]
  );

  useFrame(({ clock, pointer, size }) => {
    if (mat.current) {
      const x = pointer.x * size.width * 0.5 + size.width * 0.5;
      const y = pointer.y * size.height * 0.5 + size.height * 0.5;

      // Update uniforms via the ref
      mat.current.uniforms.uMouse.value.set(x, y);
      mat.current.uniforms.uResolution.value.set(size.width, size.height);
      mat.current.uniforms.uTime.value = clock.getElapsedTime();
      mat.current.uniforms.uRadius.value = shaderControls.radius;
      mat.current.uniforms.uRadiusInner.value = shaderControls.radiusInner;
      mat.current.uniforms.uRadiusOuter.value = shaderControls.radiusOuter;
      mat.current.uniforms.uStrength.value = shaderControls.strength;
    }
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
        size={0.1} // base size; multiplied by aSize attribute
        sizeAttenuation={false} // keep constant pixel size
        color={"black"}
      />
    </points>
  );
};

export default PointsGrid;
