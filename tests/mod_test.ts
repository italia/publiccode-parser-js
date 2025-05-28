import { assertEquals } from "jsr:@std/assert";

import "./wasm_exec.js";
import { validator } from "../src/validator.ts";

const go = new Go();
const mainWasm = await Deno.readFile("src/main.wasm");
const { instance } = await WebAssembly.instantiate(mainWasm, go.importObject);
go.run(instance);

Deno.test("Simple test", async () => {
  const path = new URL("./publiccode.yml", import.meta.url);
  const publicCodeYaml = await Deno.readTextFile(path);

  const res = await validator({ publiccode: publicCodeYaml });

  assertEquals(res.version, 0);
  assertEquals(res.errors, [
    {
      key: "platforms",
      description: "must be more than 0",
      line: 1,
      column: 1,
    },
    {
      key: "developmentStatus",
      description: "required",
      line: 1,
      column: 1,
    },
    {
      key: "softwareType",
      description: "required",
      line: 1,
      column: 1,
    },
    {
      key: "description.la.longDescription",
      description: "must be more or equal than 150",
      line: 7,
      column: 5,
    },
    {
      key: "description.la.features",
      description: "must be more than 0",
      line: 7,
      column: 5,
    },
    {
      key: "legal.license",
      description: "required",
      line: 0,
      column: 0,
    },
    {
      key: "maintenance.type",
      description: "required",
      line: 0,
      column: 0,
    },
    {
      key: "localisation.localisationReady",
      description: "required",
      line: 0,
      column: 0,
    },
    {
      key: "localisation.availableLanguages",
      description: "required",
      line: 0,
      column: 0,
    },
  ]);
});
