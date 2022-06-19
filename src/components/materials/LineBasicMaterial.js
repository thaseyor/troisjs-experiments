import { LineBasicMaterial } from "three";
import { materialComponent } from "@/helpers";

export default materialComponent(
  "LineBasicMaterial",
  { color: { type: String, default: "#fff" } },
  (opts) => new LineBasicMaterial(opts)
);
