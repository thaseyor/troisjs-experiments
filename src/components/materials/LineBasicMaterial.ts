import { LineBasicMaterial } from "three";
import { materialComponent } from "@/helpers";

const props = {
  color: { type: String, default: "#fff" },
};

export default materialComponent(
  "LineBasicMaterial",
  props,
  (opts) => new LineBasicMaterial(opts)
);
