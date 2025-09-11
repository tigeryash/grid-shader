uniform vec2 uMouse; //mouse in world units
uniform float uStrength; //displacement strength
uniform float uRadiusInner; //start of falloff
uniform float uRadiusOuter; //end of falloff

// Attribute from your bufferGeometry
attribute float aSize;


void main() {
  // start from the model position
  //1. get position of vertex from object/model
  vec3 p = position;

  // 2.how far is this vertex from the mouse?
  float dist = distance(p.xy, uMouse);
  // 3. compute falloff (0-1) based on distance
  float falloff = 1.0 - smoothstep(uRadiusInner, uRadiusOuter, dist);

  //4. repulsion direction and displacement
  if (falloff > 0.0) {
    // guard against zero-length normalize
    vec2 dir = dist > 0.0 ? normalize(p.xy - uMouse) : vec2(0.0);
    p.xy += dir * (uStrength * falloff);
  }

  // hand back to CSM
  csm_Position = p;
  csm_PointSize = aSize;
}