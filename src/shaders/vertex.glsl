uniform vec2 uMouse;
uniform vec2 uResolution;
uniform float uRadius;
uniform float uStrength;
uniform float uDamping; // Let's use time for a little extra movement

// Attribute from your bufferGeometry
attribute vec3 aStartPosition;
attribute vec3 aVelocity;

// A varying to pass the strength of the effect to the fragment shader
varying float vIntensity;

void main(){
  vec3 pos = position;

  // --- 1. Coordinate Conversion ---
  vec4 screenPosition = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  vec2 screenCoords = (screenPosition.xy / screenPosition.w + 1.0) / 2.0 * uResolution;

  // --- 2. Repulsion Calculation ---
  float dist = distance(screenCoords, uMouse);
  vIntensity = 0.0;
  
  if (dist < uRadius) {
    // Calculate strength with a smooth falloff
    float strength = 1.0 - pow(dist / uRadius, 2.0);
    vIntensity = strength;

    // Direction from mouse to point
    vec2 direction = normalize(screenCoords - uMouse);

    // Displace the position
    // We multiply by strength and our main uStrength uniform
    pos.xy += direction * strength * uStrength;
  }

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 2.0;
}