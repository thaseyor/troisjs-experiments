import { defineComponent } from "vue";
import {
  BufferGeometry as Geometry,
  Material as BaseMaterial,
  Mesh,
} from "troisjs";

export function meshComponent(name, props, createMesh) {
  return defineComponent({
    name,
    extends: Mesh,
    props,
    created() {
      this.createMesh();
      this.initObject3D(this.mesh);
    },
    methods: {
      createMesh() {
        this.mesh = createMesh(this);
      },
    },
  });
}

export function geometryComponent(name, props, createGeometry) {
  return defineComponent({
    name,
    extends: Geometry,
    props,
    methods: {
      createGeometry() {
        this.geometry = createGeometry(this);
        this.geometry.userData.component = this;
        this.$emit("created", this.geometry);
      },
    },
  });
}

export function materialComponent(name, props, createMaterial) {
  return defineComponent({
    name,
    extends: BaseMaterial,
    props,
    methods: {
      createMaterial() {
        return createMaterial(this.getMaterialParams());
      },
    },
  });
}
