import {
  BufferGeometry,
  Vector3,
  Float32BufferAttribute as Float32,
} from "three";
import { geometryComponent } from "@/helpers";

export const props = {
  points: { type: Array, default: () => [new Vector3(0, 0, 0)] },
  colors: { type: Array },
};

export function createGeometry(comp) {
  const { points, colors } = comp;
  const geometry = new BufferGeometry().setFromPoints(points);

  if (colors?.length) geometry.setAttribute("color", new Float32(colors, 4));

  return geometry;
}

export default geometryComponent("CustomGeometry", props, createGeometry);
