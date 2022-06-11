import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { name: "home", path: "/", component: () => import("@/pages/Home.vue") },
  {
    name: "body-system",
    path: "/1",
    component: () => import("@/pages/BodySystem.vue"),
  },
  {
    name: "tree",
    path: "/2",
    component: () => import("@/pages/Tree.vue"),
  },
  {
    name: "sphere",
    path: "/3",
    component: () => import("@/pages/Sphere.vue"),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
