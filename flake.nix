{
  description = "Publiccode parser";

  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };

  outputs = {
    flake-utils,
    nixpkgs,
    ...
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {inherit system;};
      in {
        devShells.default = pkgs.mkShell {
          packages = [
            pkgs.deno
            pkgs.go
            pkgs.gopls
          ];

          env = {
            WASM_EXEC_JS = "${pkgs.go}/share/go/lib/wasm/wasm_exec.js";
          };
        };
        formatter = pkgs.alejandra;
      }
    );
}
