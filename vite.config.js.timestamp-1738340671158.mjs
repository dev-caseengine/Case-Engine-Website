// vite.config.js
import { resolve } from "path";
import { defineConfig } from "file:///C:/Users/Ognen/Desktop/case-wp/case-new/node_modules/vite/dist/node/index.js";
import { viteStaticCopy } from "file:///C:/Users/Ognen/Desktop/case-wp/case-new/node_modules/vite-plugin-static-copy/dist/index.js";
import dotenv from "file:///C:/Users/Ognen/Desktop/case-wp/case-new/node_modules/dotenv/lib/main.js";
var __vite_injected_original_dirname = "C:\\Users\\Ognen\\Desktop\\case-wp\\case-new";
dotenv.config();
var vite_config_default = defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "assets/*",
          dest: "../dist/assets/"
        },
        {
          src: "sendMail.php",
          dest: "../dist/"
        }
      ]
    })
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__vite_injected_original_dirname, "index.html"),
        about: resolve(__vite_injected_original_dirname, "about.html"),
        // about: resolve(__dirname, "pages/about.html"),
        contact: resolve(__vite_injected_original_dirname, "contact.html"),
        results: resolve(__vite_injected_original_dirname, "results.html")
      }
    }
  },
  define: {
    __VALUE__: `"${process.env.VITE_ASSETS_PATH}"`
    // wrapping in "" since it's a string
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxPZ25lblxcXFxEZXNrdG9wXFxcXGNhc2Utd3BcXFxcY2FzZS1uZXdcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXE9nbmVuXFxcXERlc2t0b3BcXFxcY2FzZS13cFxcXFxjYXNlLW5ld1xcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvT2duZW4vRGVza3RvcC9jYXNlLXdwL2Nhc2UtbmV3L3ZpdGUuY29uZmlnLmpzXCI7Ly8gaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XHJcbi8vIGltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XHJcbi8vIGltcG9ydCBmcyBmcm9tIFwiZnNcIjtcclxuXHJcbi8vIGNvbnN0IGZpbGVzID0gZnMucmVhZGRpclN5bmMoXCIuL3NyY1wiKTtcclxuLy8gbGV0IHBhZ2VPYmplY3QgPSB7fTtcclxuXHJcbi8vIGZpbGVzLmZvckVhY2goKGZpbGUpID0+IHtcclxuLy8gICBsZXQgcGFnZSA9IGZpbGUucmVwbGFjZShcIi5odG1sXCIsIFwiXCIpO1xyXG4vLyAgIHBhZ2VPYmplY3RbcGFnZV0gPSByZXNvbHZlKF9fZGlybmFtZSArIFwiL3NyYy9cIiwgZmlsZSk7XHJcbi8vIH0pO1xyXG5cclxuLy8gZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuLy8gICBidWlsZDoge1xyXG5cclxuLy8gICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuLy8gICAgICAgaW5wdXQ6IHBhZ2VPYmplY3QsXHJcbi8vICAgICB9LFxyXG4vLyAgIH0sXHJcbi8vIH0pO1xyXG5cclxuLy8gaW1wb3J0IGdsc2wgZnJvbSBcInZpdGUtcGx1Z2luLWdsc2xcIjtcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCB7IHZpdGVTdGF0aWNDb3B5IH0gZnJvbSBcInZpdGUtcGx1Z2luLXN0YXRpYy1jb3B5XCI7XHJcbmltcG9ydCBkb3RlbnYgZnJvbSBcImRvdGVudlwiO1xyXG5cclxuZG90ZW52LmNvbmZpZygpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcblxyXG4gICAgdml0ZVN0YXRpY0NvcHkoe1xyXG4gICAgICB0YXJnZXRzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgc3JjOiBcImFzc2V0cy8qXCIsXHJcbiAgICAgICAgICBkZXN0OiBcIi4uL2Rpc3QvYXNzZXRzL1wiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgc3JjOiBcInNlbmRNYWlsLnBocFwiLFxyXG4gICAgICAgICAgZGVzdDogXCIuLi9kaXN0L1wiXHJcbiAgICAgICAgfVxyXG4gICAgICBdLFxyXG4gICAgfSksXHJcbiAgXSxcclxuXHJcbiAgYnVpbGQ6IHtcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgaW5wdXQ6IHtcclxuICAgICAgICBtYWluOiByZXNvbHZlKF9fZGlybmFtZSwgXCJpbmRleC5odG1sXCIpLFxyXG4gICAgICAgIGFib3V0OiByZXNvbHZlKF9fZGlybmFtZSwgXCJhYm91dC5odG1sXCIpLFxyXG4gICAgICAgIC8vIGFib3V0OiByZXNvbHZlKF9fZGlybmFtZSwgXCJwYWdlcy9hYm91dC5odG1sXCIpLFxyXG4gICAgICAgIGNvbnRhY3Q6IHJlc29sdmUoX19kaXJuYW1lLCBcImNvbnRhY3QuaHRtbFwiKSxcclxuXHRcdHJlc3VsdHM6IHJlc29sdmUoX19kaXJuYW1lLCBcInJlc3VsdHMuaHRtbFwiKSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBkZWZpbmU6IHtcclxuXHRfX1ZBTFVFX186IGBcIiR7cHJvY2Vzcy5lbnYuVklURV9BU1NFVFNfUEFUSH1cImAsIC8vIHdyYXBwaW5nIGluIFwiXCIgc2luY2UgaXQncyBhIHN0cmluZ1xyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBc0JBLFNBQVMsZUFBZTtBQUN4QixTQUFTLG9CQUFvQjtBQUM3QixTQUFTLHNCQUFzQjtBQUMvQixPQUFPLFlBQVk7QUF6Qm5CLElBQU0sbUNBQW1DO0FBMkJ6QyxPQUFPLE9BQU87QUFFZCxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFFUCxlQUFlO0FBQUEsTUFDYixTQUFTO0FBQUEsUUFDUDtBQUFBLFVBQ0UsS0FBSztBQUFBLFVBQ0wsTUFBTTtBQUFBLFFBQ1I7QUFBQSxRQUNBO0FBQUEsVUFDRSxLQUFLO0FBQUEsVUFDTCxNQUFNO0FBQUEsUUFDUjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFFQSxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsTUFDYixPQUFPO0FBQUEsUUFDTCxNQUFNLFFBQVEsa0NBQVcsWUFBWTtBQUFBLFFBQ3JDLE9BQU8sUUFBUSxrQ0FBVyxZQUFZO0FBQUE7QUFBQSxRQUV0QyxTQUFTLFFBQVEsa0NBQVcsY0FBYztBQUFBLFFBQ2hELFNBQVMsUUFBUSxrQ0FBVyxjQUFjO0FBQUEsTUFDdEM7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ1QsV0FBVyxJQUFJLFFBQVEsSUFBSTtBQUFBO0FBQUEsRUFDMUI7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
