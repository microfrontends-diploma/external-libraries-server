import fs from "fs";
import path from "path";
import { RequestHandler } from "express";
import { ImportMapServiceInterface } from "src/service/importMap/types";
import { UpdateExternalsRequestBodyType } from "./types";
import { inject, injectable } from "tsyringe";

// TODO: написать тесты
// TODO: добавить версионность (??)
@injectable()
export class ExternalsController {
  private importMapService: ImportMapServiceInterface = null;

  constructor(
    @inject("ImportMapService") importMapService: ImportMapServiceInterface
  ) {
    this.importMapService = importMapService;
  }

  updateExternals(
    EXTERNALS_PATH: string
  ): RequestHandler<{}, {}, UpdateExternalsRequestBodyType> {
    return async (req, res) => {
      const data = req.body;

      const mfName = data.name;
      const externals = data.externals;
      const env = data.env || "dev";

      const externalsToDelete = externals
        .filter(({ action }) => action === "deleted")
        .map(({ lib }) => lib);
      const externalsToAdd = externals.filter(
        ({ action }) => action === "added"
      );

      if (fs.existsSync(EXTERNALS_PATH)) {
        /**
         * Начнем с удаляемых внешних зависимостей
         * Просмотрим внешние зависимости всех остальных микрофронтов и в случае,
         * если удаляемая зависимость более нигде не используется - посылаем запрос к importmap-deployer
         */
        const externalLibs = fs.readdirSync(EXTERNALS_PATH);

        for (const filename of externalLibs) {
          if (filename.split(".").at(0) === mfName) continue;

          const jsonExternals: string[] = JSON.parse(
            fs.readFileSync(path.resolve(EXTERNALS_PATH, filename)).toString()
          );

          for (const external of jsonExternals) {
            const targetIndex = externalsToDelete.findIndex(
              (val) => val === external
            );

            if (targetIndex >= 0) {
              externalsToDelete.splice(targetIndex, 1);
            }

            if (!externalsToDelete.length) break;
          }

          if (!externalsToDelete.length) break;
        }
      } else {
        fs.mkdirSync(EXTERNALS_PATH);
      }

      if (externalsToDelete.length) {
        const promises = externalsToDelete.map((external) =>
          this.importMapService.deleteImportMap(external, env)
        );
        try {
          await Promise.all(promises);
        } catch (e) {
          console.error(
            "Error occurred while deleting services from importmap",
            e
          );
          res.status(500);
          res.send();
        }
      }

      if (externalsToAdd.length) {
        const promises = externalsToAdd.map((external) =>
          this.importMapService.patchImportMap(
            { service: external.lib, url: external.url },
            env
          )
        );

        try {
          await Promise.all(promises);
        } catch (e) {
          console.error(
            "Error occurred while patching services within importmap",
            e
          );
          res.status(500);
          res.send();
        }
      }

      const externalsToWrite = externals
        .filter(({ action }) => action !== "deleted")
        .map(({ lib }) => lib);
      fs.writeFileSync(
        path.resolve(EXTERNALS_PATH, `${mfName}.json`),
        JSON.stringify(externalsToWrite)
      );

      res.status(
        !externalsToDelete.length && !externalsToAdd.length ? 304 : 200
      );
      res.send();
    };
  }
}

export default ExternalsController;
