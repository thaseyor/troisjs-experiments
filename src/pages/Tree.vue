<template>
  <Renderer
    antialias
    shadow
    :orbit-ctrl="{ enableDamping: true }"
    resize="window"
  >
    <Camera ref="camera" :position="{ z: 12 }" />
    <Scene>
      <Points>
        <BoxGeometry
          :widthSegments="5"
          :heightSegments="5"
          :depthSegments="5"
          :width="5"
          :height="5"
          :depth="5"
        />
        <PointsMaterial :props="{ size: 0.05 }" />
      </Points>
      <LineSegments>
        <EdgesGeometry :width="5" :height="5" :depth="5"></EdgesGeometry>
        <LineBasicMaterial color="#00ffff"></LineBasicMaterial>
      </LineSegments>
    </Scene>
  </Renderer>
</template>

<script setup>
import { ref } from "vue";
import {
  Camera,
  Renderer,
  Scene,
  Points,
  BoxGeometry,
  PointsMaterial,
} from "troisjs";
import LineSegments from "../components/LineSegments";
import EdgesGeometry from "../components/EdgesGeometry";
import LineBasicMaterial from "../components/LineBasicMaterial";

const camera = ref();
</script>

<style>
canvas {
  display: block;
}
</style>
