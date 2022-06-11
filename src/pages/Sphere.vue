<template>
  <Menu>
    <div class="flex space-between">
      <span>speed</span>
      <input type="range" min="0" max="100" v-model="params.speed" />
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
        <CustomGeometry :points="points" />
        <LineBasicMaterial color="#00ffff" />
      </Line>
    </Scene>
  </Renderer>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Camera, Renderer, Scene } from "troisjs";
import { Vector3, MathUtils } from "three";

import Menu from "@/components/Menu.vue";
import CustomGeometry from "@/components/CustomGeometry";
import LineBasicMaterial from "@/components/LineBasicMaterial";
import Line from "@/components/Line";

const { randFloatSpread: rndFS } = MathUtils;

const renderer = ref();
const frame = ref(0);
const points = ref([new Vector3(0, 0, 0)]);
const params = ref({
  speed: 20,
});

onMounted(() => {
  renderer.value.onBeforeRender(() => {
    frame.value = frame.value + 1;

    if (frame.value % Math.round(100 / params.value.speed) !== 0) return;

    points.value = [
      ...points.value,
      new Vector3(rndFS(1), rndFS(1), rndFS(1)).setLength(1),
    ];
  });
});
</script>
