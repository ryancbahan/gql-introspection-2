import react from "@vitejs/plugin-react";
import "dotenv/config";
import monacoEditorPlugin from "vite-plugin-monaco-editor";

/**
 * @type {import('vite').UserConfig}
 */
export default {
  define: {
    "process.env.SHOPIFY_API_KEY": JSON.stringify(process.env.SHOPIFY_API_KEY),
  },
  build: {
    target: "esnext",
  },
  plugins: [
    react(),
    monacoEditorPlugin.default({
      languageWorkers: ["json", "editorWorkerService"],
      customWorkers: [
        {
          label: "graphql",
          entry: "monaco-graphql/dist/graphql.worker",
        },
      ],
    }),
  ],
};
