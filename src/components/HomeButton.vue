<template>
  <template v-if="show">
    <router-link class="home-button" :to="{ name: 'home' }">
      <div style="color: white">{{ "<" }}</div>
    </router-link>
  </template>
</template>

<script setup>
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";
const route = useRoute();

const show = computed(() => route.name !== "home");
</script>

<style>
.home-button {
  position: fixed;
  top: 8px;
  left: 8px;
  color: white;
  font-size: x-large;
}
</style>
