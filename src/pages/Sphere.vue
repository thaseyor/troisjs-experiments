<template>
  <Menu>
    <div class="flex space-between">
      <span>speed</span>
      <input type="range" min="0" max="100" v-model="params.speed" />
    </div>
    <div class="flex space-between">
      <span>type</span>
      <select v-model="params.type">
        <option value="surface">Surface</option>
        <option value="full">Full</option>
      </select>
    </div>
    <div class="flex space-between">
      <span>color</span>
      <input type="color" v-model="mainColor" />
    </div>
  </Menu>
  <Renderer
    antialias
    shadow
    :orbit-ctrl="{ enableDamping: true }"
    resize="window"
    ref="renderer"
  >
    <Camera ref="camera" :position="{ z: 10 }" />
    <Scene>
      <Line>
        <CustomGeometry :points="points" :colors="colors" />
        <LineBasicMaterial :color="mainColor" :props="{ vertexColors: true }" />
      </Line>
    </Scene>
  </Renderer>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Camera, Renderer, Scene } from "troisjs";
import { Vector3, MathUtils } from "three";

import Menu from "@/components/Menu.vue";
import { CustomGeometry } from "@/components/geometries";
import { LineBasicMaterial } from "@/components/materials";
import { Line } from "@/components/meshes";

import type { Ref } from "vue";

const { randFloatSpread: rndFS } = MathUtils;
const { random } = Math;

const renderer = ref();
const frame = ref(0);
const points = ref([new Vector3(0, 0, 1)]);
const mainColor = ref("#ffffff");
const colors: Ref<number[]> = ref([]);
const params = ref({
  speed: 30,
  type: "surface",
});

const generatePoint = {
  surface: (prev) => {
    const x = prev.x + rndFS(1);
    const y = prev.y + rndFS(1);
    const z = prev.z + rndFS(1);
    return new Vector3(x, y, z);
  },
  full: () => {
    const x = rndFS(1);
    const y = rndFS(1);
    const z = rndFS(1);
    return new Vector3(x, y, z);
  },
};

onMounted(() => {
  renderer.value.onBeforeRender(() => {
    frame.value = frame.value + 1;
    const { type, speed } = params.value;

    if (frame.value % Math.round(100 / speed) !== 0) return;

    const lastPoint = points.value[points.value.length - 1];
    const nextPoint = generatePoint[type](lastPoint);

    points.value = [...points.value, nextPoint.setLength(1)];
    colors.value = [...colors.value, random(), random(), random(), 1];
  });
});
</script>
