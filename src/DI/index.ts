import { ImportMapService } from "src/service/importMap";
import { container } from "tsyringe";

export function registerDI() {
  container.register("ImportMapService", {
    useValue: new ImportMapService("http://94.250.250.29:5000"),
  });
}
