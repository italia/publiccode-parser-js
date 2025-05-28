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
Deno.exit(code);
