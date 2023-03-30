export type ExternalLibrariesType = {
  lib: string;
  url: string;
  action: "added" | "deleted" | "unchanged";
};

export type UpdateExternalsRequestBodyType = {
  name: string;
  externals: Array<ExternalLibrariesType>;
  env?: ImportMapEnv;
};

export type ImportMapEnv = "dev" | "prod";
