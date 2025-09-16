// main.jsx
import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, redirect } from "react-router-dom";
import "./styles.css";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectMarioKart from "./pages/ProjectMarioKart.jsx";
import ProjectSFML from "./pages/ProjectSFML.jsx";
import ProjectUnity from "./pages/ProjectUnity.jsx";
import Music from "./pages/Music.jsx";
import Running from "./pages/Running.jsx";
import ProjectMinecraftDemo from "./pages/ProjectMinecraftDemo.jsx";
import CV from "./pages/CV.jsx";
import { LangProvider } from "./lib/lang.jsx";

// 1) Choisir une langue par défaut (mémoire > navigateur > "fr")
const defaultLang = (() => {
  try {
    const saved = localStorage.getItem("lang");
    if (saved === "fr" || saved === "en") return saved;
  } catch {}
  const nav = (navigator.language || navigator.userLanguage || "fr").toLowerCase();
  return nav.startsWith("fr") ? "fr" : "en";
})();

const routes = [
  // Redirection racine -> /<defaultLang>
  { path: "/", loader: () => redirect(`/${defaultLang}`) },

  // Toutes les pages sont sous /:lang
  {
    path: "/:lang",
    element: (
      <Suspense
        fallback={
          <div className="fixed inset-0 grid place-items-center text-neutral-300">
            Chargement…
          </div>
        }
      >
        <LangProvider>
          <App />
        </LangProvider>
      </Suspense>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "projects", element: <Projects /> },
      { path: "projects/mariokart", element: <ProjectMarioKart /> },
      { path: "projects/minecraftdemo", element: <ProjectMinecraftDemo /> },
      { path: "projects/sfml", element: <ProjectSFML /> },
      { path: "projects/unity", element: <ProjectUnity /> },
      { path: "music", element: <Music /> },
      { path: "running", element: <Running /> },
      { path: "cv", element: <CV /> },
    ],
  },

  // Optionnel : catch-all -> /<defaultLang>
  { path: "*", loader: () => redirect(`/${defaultLang}`) },
];

// ⚠️ ICI le basename est passé en **option**, pas dans les routes
const router = createBrowserRouter(routes, {
  basename: import.meta.env.BASE_URL, // "/" en dev, "/<repo>/" sur GH Pages
});

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
