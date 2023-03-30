import { ImportMapService } from "src/service/importMap";

import { container } from "tsyringe";

export function registerDI() {
  container.register("ImportMapService", {
    useValue: new ImportMapService("http://localhost:5000"),
  });
}
