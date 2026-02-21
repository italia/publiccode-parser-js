import { build, emptyDir } from "@deno/dnt";
import denoJson from "./deno.json" with { type: "json" };

const command = new Deno.Command("go", {
  args: ["build", "-o", "../main.wasm", "main.go"],
  cwd: "src/go",
  env: {
    GOARCH: "wasm",
    GOOS: "js",
  },
  stderr: "inherit",
  stdout: "inherit",
});

const { code } = await command.output();
if (code !== 0) {
  Deno.exit(code);
}

const wasmExecJs = Deno.env.get("WASM_EXEC_JS");

if (!wasmExecJs) {
  console.error("WASM_EXEC_JS environment variable is not set.");
  Deno.exit(1);
}

await Deno.copyFile(wasmExecJs, "src/wasm_exec.js");
await Deno.chmod("src/wasm_exec.js", 0o644);

// Build npm package
await emptyDir("npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "npm",
  scriptModule: false,
  shims: {
    deno: "dev",
  },
  compilerOptions: {
    lib: ["DOM", "ESNext"],
    target: "Latest",
  },
  package: {
    name: "publiccode-parser",
    version: denoJson.version,
    description: denoJson.description,
    license: "EUPL-1.2",
    repository: {
      type: "git",
      url: "git+https://github.com/italia/publiccode-parser-js.git",
    },
    bugs: {
      url: "https://github.com/italia/publiccode-parser-js/issues",
    },
    devDependencies: {
      "@types/golang-wasm-exec": "^1.15.2",
    },
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("src/main.wasm", "npm/esm/src/main.wasm");
  },
});
