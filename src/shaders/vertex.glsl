uniform vec2 uMouse;
uniform vec2 uResolution;
uniform float uStrength;

uniform float uRadiusInner;
uniform float uRadiusOuter;

// Attribute from your bufferGeometry
attribute float aSize;

// A varying to pass the strength of the effect to the fragment shader
varying float vIntensity;

void main(){
// start from the model position
  vec3 p = position;

  // distance/falloff in world units
  float dist = distance(p.xy, uMouse);
  float falloff = 1.0 - smoothstep(uRadiusInner, uRadiusOuter, dist);
  vIntensity = falloff;

  if (falloff > 0.0) {
    // guard against zero-length normalize
    vec2 dir = dist > 0.0 ? normalize(p.xy - uMouse) : vec2(0.0);
    p.xy += dir * (uStrength * falloff);
  }

  // hand back to CSM
  csm_Position = p;
  csm_PointSize = aSize;
}