import { defineComponent } from "vue";
import {
  BufferGeometry as Geometry,
  Material as BaseMaterial,
  Mesh,
} from "troisjs";

type CreateFunction = (comp: any) => any;

export function meshComponent(name: string, props, createMesh: CreateFunction) {
  return defineComponent({
    name,
    extends: Mesh,
    props,
    // setup() {
    //   return { mesh<any>: null };
    // },
    created() {
      this.createMesh();
      this.initObject3D(this.mesh as any);
    },
    methods: {
      createMesh() {
        this.mesh = createMesh(this);
      },
    },
  });
}

export function geometryComponent(
  name: string,
  props,
  createGeometry: CreateFunction
) {
  return defineComponent({
    name,
    extends: Geometry,
    props,
    methods: {
      createGeometry() {
        this.geometry = createGeometry(this);
        this.geometry!.userData.component = this;
        this.$emit("created", this.geometry);
      },
    },
  });
}

export function materialComponent(
  name: string,
  props,
  createMaterial: CreateFunction
) {
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
