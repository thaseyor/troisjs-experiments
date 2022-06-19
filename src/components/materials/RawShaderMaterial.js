import { RawShaderMaterial } from "three";
import { materialComponent } from "@/helpers";

const defaultVertexShader = `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
`;

const defaultFragmentShader = `
  varying vec2 vUv;
  void main() {
    gl_FragColor = vec4(vUv.x, vUv.y, 0., 1.0);
  }
`;

export function excludeProps(props, whiteList = []) {
  const values = {};
  Object.entries(props).forEach(([key, value]) => {
    if (!whiteList || !whiteList.includes(key)) {
      values[key] = value;
    }
  });
  return values;
}

export default materialComponent(
  "RawShaderMaterial",
  {
    props: {
      type: Object,
      default: () => ({
        uniforms: {},
        vertexShader: defaultVertexShader,
        fragmentShader: defaultFragmentShader,
      }),
    },
  },
  (opts) => new RawShaderMaterial(excludeProps(opts, ["color"]))
);
