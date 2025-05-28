import PublicCode from "./publiccode/index.ts";

type Err = {
  column: number;
  description: string;
  key: string;
  line: number;
};

type Result = {
  publicCode: Partial<PublicCode>;
  warnings: Array<Err>;
  errors: Array<Err>;
  version: number;
};

declare function IsPublicCodeYmlValid(
  publiccode: string,
  branch: string,
  baseURL: string,
): Promise<string>;

interface ValidatorParams {
  publiccode: string;
  branch?: string;
  baseURL?: string;
}

export const validator = async (
  {
    publiccode,
    branch = "main",
    baseURL = "",
  }: ValidatorParams,
): Promise<Result> => {
  if (!IsPublicCodeYmlValid) throw new Error("Validator not ready");

  let url = "";
  try {
    url = new URL(baseURL).href;
  } catch (_: unknown) {
    console.warn("invalid URL");
  }

  const res = await IsPublicCodeYmlValid(publiccode, branch, url);

  const {
    publicCode,
    results,
    version,
  }: {
    publicCode: Partial<PublicCode>;
    results: Array<Err & { type: string }> | null;
    version: number;
  } = JSON.parse(res);

  const warnings: Array<Err> = [];
  const errors: Array<Err> = [];

  if (results !== null) {
    for (const { type, ...rest } of results) {
      if (type === "error") {
        errors.push(rest);
      } else {
        warnings.push(rest);
      }
    }
  }

  return {
    publicCode,
    warnings,
    errors,
    version,
  };
};
