import { defineComponent } from "vue";
import { LineSegments } from "three";
import Object3D from "troisjs/src/core/Object3D";
import { MeshInjectionKey } from "troisjs/src/meshes/Mesh";

// not really a mesh, but allow us to easily get geometry/material support
export default defineComponent({
  extends: Object3D,
  setup() {
    return {};
  },
  provide() {
    return {
      [MeshInjectionKey]: this,
    };
  },
  mounted() {
    this.mesh = new LineSegments(this.geometry, this.material);
    this.initObject3D(this.mesh);
  },
  methods: {
    setGeometry(geometry) {
      this.geometry = geometry;
      if (this.mesh) this.mesh.geometry = geometry;
    },
    setMaterial(material) {
      this.material = material;
      if (this.mesh) this.mesh.material = material;
    },
  },
});
