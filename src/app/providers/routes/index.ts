import { createRouter, createWebHistory } from "vue-router";
import { LandingPage } from "../../../pages/landing";
import { ScanChoicePage } from "../../../pages/scanChoicePage";
import { RecommendationPage } from "../../../pages/RecommendationPage";
import { AnalyzePage } from "../../../pages/AnalyzePage";

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: "/",
      component: LandingPage,
    },

    {
      path: "/scanChoice",
      component: ScanChoicePage,
    },

    {
      path: "/chat/recommendation",
      name: "chat-recommendation",
      component: RecommendationPage,
    },

    {
      path: "/chat/analyze",
      name: "chat-analyze",
      component: AnalyzePage,
    },
  ],
});

export { router };
