import { materialComponent } from "troisjs/src/materials/Material";
import { LineBasicMaterial } from "three";

export default materialComponent(
  "LineBasicMaterial",
  { color: { type: String } },
  (opts) => new LineBasicMaterial(opts)
);
