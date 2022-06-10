import { geometryComponent } from "troisjs/src/geometries/Geometry";
import { BoxGeometry, EdgesGeometry } from "three";

export const props = {
  size: Number,
  width: { type: Number, default: 1 },
  height: { type: Number, default: 1 },
  depth: { type: Number, default: 1 },
  widthSegments: { type: Number, default: 1 },
  heightSegments: { type: Number, default: 1 },
  depthSegments: { type: Number, default: 1 },
};

export function createGeometry(comp) {
  const geometry = new BoxGeometry(
    comp.size ? comp.size : comp.width,
    comp.size ? comp.size : comp.height,
    comp.size ? comp.size : comp.depth,
    comp.widthSegments,
    comp.heightSegments,
    comp.depthSegments
  );

  return new EdgesGeometry(geometry);
}

export default geometryComponent("EdgesGeometry", props, createGeometry);
