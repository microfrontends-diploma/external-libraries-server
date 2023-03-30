export interface ImportMapServiceInterface {
  patchImportMap: (service: ServiceToPatch, env: string) => Promise<unknown>;
  deleteImportMap: (service: string, env: string) => Promise<unknown>;
}

export type ServiceToPatch = {
  service: string;
  url: string;
};
