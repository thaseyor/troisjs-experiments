import { BufferGeometry, Vector3 } from "three";
import { geometryComponent } from "@/helpers";

export const props = {
  points: { type: Array, default: () => [new Vector3(0, 0, 0)] },
};

export function createGeometry(comp) {
  const geometry = new BufferGeometry().setFromPoints(comp.points);

  return geometry;
}

export default geometryComponent("CustomGeometry", props, createGeometry);
