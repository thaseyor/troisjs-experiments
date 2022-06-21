<template>
  <div class="menu flex flex-col">
    <div
      class="collapse pointer flex space-between noselect"
      @click="show = !show"
    >
      Menu
      <div class="arrow" :class="{ rotate: show }">></div>
    </div>
    <div class="content flex flex-col" v-show="show">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const show = ref(false);
</script>

<style>
.menu {
  position: fixed;
  top: 8px;
  right: 8px;
  background-color: white;
  border-radius: 8px;
}

.collapse {
  min-width: 200px;
  height: 20px;
  padding: 8px;
}

.rotate {
  transform: rotate(90deg);
}

.arrow {
  transition: transform 0.1s;
}
.content {
  min-height: 20px;
  padding: 8px;
}
</style>
