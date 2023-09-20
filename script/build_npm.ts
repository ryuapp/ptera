import { build, emptyDir } from "../deps.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    deno: true,
  },
  package: {
    name: "ptera",
    version: Deno.args[0],
    description: "Ptera is DateTime library for Deno",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/ryuapp/ptera.git",
    },
    bugs: {
      url: "https://github.com/ryuapp/ptera/issues",
    },
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
