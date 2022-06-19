import { Line } from "three";
import { meshComponent } from "@/helpers";

export default meshComponent(
  "Line",
  {},
  (comp) => new Line(comp.geometry, comp.material)
);
