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
