uniform vec2 uMouse;
uniform vec2 uResolution;
uniform float uRadius;
uniform float uStrength;

uniform float uRadiusInner;
uniform float uRadiusOuter;

// Attribute from your bufferGeometry
attribute float aSize;

// A varying to pass the strength of the effect to the fragment shader
varying float vIntensity;

void main(){
  vec3 csm_Position = position;

  // --- 1. Coordinate Conversion ---
  vec4 screenPosition = projectionMatrix * modelViewMatrix * vec4(csm_Position, 1.0);
  vec2 screenCoords = (screenPosition.xy / screenPosition.w + 1.0) / 2.0 * uResolution;

  // --- 2. Repulsion Calculation ---
  float dist = distance(screenCoords, uMouse);
  
  float falloff = 1.0 - smoothstep(uRadiusInner, uRadiusOuter, dist);

  vIntensity = falloff;

  if(falloff > .0){
    vec2 direction = normalize(screenCoords - uMouse);

    csm_Position.xy += direction * uStrength * falloff;
  }

   csm_PointSize = aSize;
}