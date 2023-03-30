import axios, { AxiosInstance } from "axios";
import { ImportMapServiceInterface, ServiceToPatch } from "./types";

export class ImportMapService implements ImportMapServiceInterface {
  private axiosInstance: AxiosInstance = null;

  constructor(importmapURL: string) {
    this.axiosInstance = axios.create({
      baseURL: importmapURL,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  patchImportMap(service: ServiceToPatch, env: string) {
    return this.axiosInstance.patch<{}, {}, ServiceToPatch>(
      `/services`,
      service,
      {
        params: { env },
      }
    );
  }

  deleteImportMap(service: string, env: string) {
    return this.axiosInstance.delete(`/services/${service}`, {
      params: { env },
    });
  }
}

export default ImportMapService;
