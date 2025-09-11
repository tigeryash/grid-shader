import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import CustomShaderMaterial from "three-custom-shader-material";
import * as THREE from "three";
import vert from "./shaders/vertex.glsl";
import frag from "./shaders/fragment.glsl";
import { useControls } from "leva";

const DENSITY = 0.1;
const STRENGTH = 84;
const RADIUS_INNER = 0;
const RADIUS_OUTER = 230;

const PointsGrid = () => {
  const mat = useRef<any>(null);
  const { viewport, camera } = useThree();

  const shaderControls = useControls("Shader Effect", {
    strength: { value: STRENGTH, min: 0.0, max: 2.0, step: 0.01 },
    density: { value: DENSITY, min: 0.01, max: 0.2, step: 0.01 },
    radiusInner: { value: RADIUS_INNER, min: 0, max: 500, step: 5 },
    radiusOuter: { value: RADIUS_OUTER, min: 0, max: 500, step: 5 },
  });

  // --- RESPONSIVE Grid Calculation (Corrected) ---
  const { positions, sizes } = useMemo(() => {
    // Calculate number of columns and rows based on viewport size and density max of 2 or whatever the viewport * density is.
    const cols = Math.max(
      2,
      Math.floor(viewport.width * shaderControls.density)
    );
    const rows = Math.max(
      2,
      Math.floor(viewport.height * shaderControls.density)
    );

    const totalPoints = cols * rows; // Total number of points in the grid
    const pts = new Float32Array(totalPoints * 3); // 3 components (x, y, z) per point
    const s = new Float32Array(totalPoints); // Size attribute for each point

    //loop through rows and columns to set positions and sizes
    let i = 0;
    for (let iy = 0; iy < rows; iy++) {
      for (let ix = 0; ix < cols; ix++) {
        // Calculate x and y positions to center the grid around (0,0)
        //ix is the column index, iy is the row index
        // (cols - 1) and (rows - 1) to ensure points span the full width and height and subtracting 0.5 to center around zero
        // Multiplying by viewport.width and viewport.height to scale to world units
        const x = (ix / (cols - 1) - 0.5) * viewport.width;
        const y = (iy / (rows - 1) - 0.5) * viewport.height;
        // Set position in the pts array we're multiplying i by 3 because each point has 3 components
        // (x, y, z). instead of lopping through pts like a regular for loop we need to
        //  multiply by three to get the correct index for x, y, z
        pts[i * 3 + 0] = x;
        pts[i * 3 + 1] = y;
        pts[i * 3 + 2] = 0;
        // Set size for this point
        s[i] = 1.0;
        // Increment point index
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
      uMouse: { value: new THREE.Vector2(-9999, -9999) },
      uStrength: { value: STRENGTH }, // How strong the push effect is
      uRadiusInner: { value: RADIUS_INNER }, // Inner radius for full effect
      uRadiusOuter: { value: RADIUS_OUTER }, // Outer radius for falloff
    }),
    []
  );
  //we need plane and raycaster to convert mouse position to world coordinates.
  // world coordinates are needed because our points are in world space.
  // world space is the 3D space where our objects exist.
  // screen space is the 2D space of the screen where the mouse moves.
  // By converting mouse position to world coordinates, we can accurately
  // determine which points are near the mouse and apply the effect correctly.
  // This ensures that the interaction feels natural and intuitive, as the effect
  //  will correspond to the actual positions of the points in the 3D scene.
  const planeZ0 = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
    []
  );
  const mouseWorld3 = useMemo(() => new THREE.Vector3(), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  useFrame(({ pointer, size }) => {
    //ray is coming from camera and going through mouse position on screen.
    raycaster.setFromCamera(pointer, camera);
    raycaster.ray.intersectPlane(planeZ0, mouseWorld3);
    const mouseWorld2 = uniforms.uMouse.value as THREE.Vector2;
    mouseWorld2.set(mouseWorld3.x, mouseWorld3.y);

    const worldPerPx = viewport.width / size.width; // same for Y on this plane
    const strenghtWorld = STRENGTH * worldPerPx;
    const rInnerWorld = RADIUS_INNER * worldPerPx;
    const rOuterWorld = RADIUS_OUTER * worldPerPx;

    if (mat.current) {
      mat.current.uniforms.uMouse.value.copy(mouseWorld2);
      mat.current.uniforms.uRadiusInner.value = rInnerWorld;
      mat.current.uniforms.uRadiusOuter.value = rOuterWorld;
      mat.current.uniforms.uStrength.value = strenghtWorld;
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
        transparent={true}
        depthWrite={false}
        size={0.1}
        sizeAttenuation={false}
        color={"black"}
      />
    </points>
  );
};

export default PointsGrid;
