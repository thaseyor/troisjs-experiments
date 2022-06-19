import { LineSegments } from "three";
import { meshComponent } from "@/helpers";

export default meshComponent(
  "LineSegments",
  {},
  (comp) => new LineSegments(comp.geometry, comp.material)
);
