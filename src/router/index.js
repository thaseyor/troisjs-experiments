import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { name: "home", path: "/", component: () => import("@/pages/Home.vue") },
  {
    name: "body-system",
    path: "/1",
    component: () => import("@/pages/BodySystem.vue"),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
