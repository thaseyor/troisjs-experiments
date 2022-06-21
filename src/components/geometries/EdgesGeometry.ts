import { BoxGeometry, EdgesGeometry } from "three";
import { geometryComponent } from "@/helpers";

type PropsType = {
  size: number;
  width: number;
  height: number;
  depth: number;
  widthSegments: number;
  heightSegments: number;
  depthSegments: number;
};

const props = {
  size: Number,
  width: { type: Number, default: 1 },
  height: { type: Number, default: 1 },
  depth: { type: Number, default: 1 },
  widthSegments: { type: Number, default: 1 },
  heightSegments: { type: Number, default: 1 },
  depthSegments: { type: Number, default: 1 },
};

export function createGeometry(comp: PropsType): EdgesGeometry {
  const geometry: BoxGeometry = new BoxGeometry(
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
