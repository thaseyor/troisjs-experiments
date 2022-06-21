import { BufferGeometry, Vector3, Float32BufferAttribute } from "three";
import { geometryComponent } from "@/helpers";

type PropsType = {
  points: Vector3[];
  colors: number[];
};

const props = {
  points: { type: Array, default: [new Vector3(0, 0, 0)] },
  colors: Array,
};

export function createGeometry(comp: PropsType): BufferGeometry {
  const { points, colors } = comp;
  const geometry: BufferGeometry = new BufferGeometry().setFromPoints(points);

  if (colors?.length)
    geometry.setAttribute("color", new Float32BufferAttribute(colors, 4));

  return geometry;
}

export default geometryComponent("CustomGeometry", props, createGeometry);
