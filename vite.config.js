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
import { viteStaticCopy } from "vite-plugin-static-copy";


export default defineConfig({
  plugins: [

    viteStaticCopy({
      targets: [
        {
          src: "assets/*",
          dest: "../dist/assets/",
        },
        {
          src: "sendMail.php",
          dest: "../dist/"
        }
      ],
    }),
  ],

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "about.html"),
        // about: resolve(__dirname, "pages/about.html"),
        contact: resolve(__dirname, "contact.html"),
      },
    },
  },
});
