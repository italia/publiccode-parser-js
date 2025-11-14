import { assertEquals } from "@std/assert";

import { initializeWasm, validator } from "../src/validator.ts";

await initializeWasm();

Deno.test("Simple test", async () => {
  const path = new URL("./publiccode.yml", import.meta.url);
  const publicCodeYaml = await Deno.readTextFile(path);

  const res = await validator({ publiccode: publicCodeYaml });

  assertEquals(res.version, 0);
  assertEquals(res.errors, [
    {
      key: "platforms",
      description: "platforms must contain more than 0 items",
      line: 1,
      column: 1,
    },
    {
      key: "developmentStatus",
      description: "developmentStatus is a required field",
      line: 1,
      column: 1,
    },
    {
      key: "softwareType",
      description: "softwareType is a required field",
      line: 1,
      column: 1,
    },
    {
      key: "description.la.longDescription",
      description: "longDescription must be at least 150 characters in length",
      line: 7,
      column: 5,
    },
    {
      key: "description.la.features",
      description: "features must contain more than 0 items",
      line: 7,
      column: 5,
    },
    {
      key: "legal.license",
      description: "license is a required field",
      line: 0,
      column: 0,
    },
    {
      key: "maintenance.type",
      description: "type is a required field",
      line: 0,
      column: 0,
    },
    {
      key: "localisation.localisationReady",
      description: "localisationReady is a required field",
      line: 0,
      column: 0,
    },
    {
      key: "localisation.availableLanguages",
      description: "availableLanguages is a required field",
      line: 0,
      column: 0,
    },
  ]);
});
