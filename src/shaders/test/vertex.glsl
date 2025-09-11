uniform vec2 uMouseWorld;           // mouse on the z=0 plane in world space
uniform float uStrength;            // world units
uniform float uRadiusInner;         // world units
uniform float uRadiusOuter;         // world units

attribute float aSize;

varying float vIntensity;

void main() {
  // start from the model position
  vec3 p = position;

  // distance/falloff in world units
  float dist = distance(p.xy, uMouseWorld);
  float falloff = 1.0 - smoothstep(uRadiusInner, uRadiusOuter, dist);
  vIntensity = falloff;

  if (falloff > 0.0) {
    // guard against zero-length normalize
    vec2 dir = dist > 0.0 ? normalize(p.xy - uMouseWorld) : vec2(0.0);
    p.xy += dir * (uStrength * falloff);
  }

  // hand back to CSM
  csm_Position = p;
  csm_PointSize = aSize;
}