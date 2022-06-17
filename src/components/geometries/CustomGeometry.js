import { BufferGeometry } from "three";
import { geometryComponent } from "troisjs/src/geometries/Geometry";

export const props = {
  points: Array,
};

export function createGeometry(comp) {
  if (!comp.points) throw Error("No points provided");

  const geometry = new BufferGeometry().setFromPoints(comp.points);

  return geometry;
}

export default geometryComponent("CustomGeometry", props, createGeometry);
