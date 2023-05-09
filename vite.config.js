// import { resolve } from "path";
// import { defineConfig } from "vite";
// import fs from "fs";

// const files = fs.readdirSync("./src");
// let pageObject = {};

// files.forEach((file) => {
//   let page = file.replace(".html", "");
//   pageObject[page] = resolve(__dirname + "/src/", file);
// });

// export default defineConfig({
//   build: {

//     rollupOptions: {
//       input: pageObject,
//     },
//   },
// });

// import glsl from "vite-plugin-glsl";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
//   plugins: [glsl()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "pages/about.html"),
		contact: resolve(__dirname, "pages/contact.html"),
      },
    },
  },
});
