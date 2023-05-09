import fs from "fs";
import path from "path";
import { CommanderError } from "commander";
import { fileURLToPath } from "url";
import { GetArrayValueType } from "../types/utils.js";
import { Module, TConfig } from "../types/index.js";
import { Template } from "../enum.js";
import { TEMPLATE_PREFIX } from "./global.js";

// @ts-ignore 防止IDE对import.meta.url报错
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class PackageJsonModule implements Module {
  public config: Record<string, any> = {};
  constructor() {
    let template = fs.readFileSync(
      path.join(__dirname, TEMPLATE_PREFIX, "/package.json")
    );
    this.config = JSON.parse(template.toString());
  }

  /**
   * 添加依赖
   * @param deps 依赖项
   */
  public addDeps(deps: GetArrayValueType<TConfig["deps"]>): void {
    this.config.dependencies = {
      ...this.config.dependencies,
      ...(deps.dependencies ?? {}),
    };
    this.config.devDependencies = {
      ...this.config.devDependencies,
      ...(deps.devDependencies ?? {}),
    };
  }

  public async init(config: TConfig) {
    config.deps.forEach((dep) => {
      this.addDeps(dep);
    });
    fs.writeFileSync(
      path.join(config.rootPath, "/package.json"),
      JSON.stringify(this.config)
    );
  }
}

class reactPackageJsonModule extends PackageJsonModule {
  constructor() {
    super();
    this.config.dependencies = {
      react: "*",
      "react-dom": "*",
      "react-router-dom": "*",
    };
    this.config.devDependencies = {
      "@commitlint/cli": "*",
      "@commitlint/config-conventional": "*",
      "@types/node": "*",
      "@types/react": "*",
      "@types/react-dom": "*",
      "@typescript-eslint/eslint-plugin": "*",
      "@typescript-eslint/parser": "*",
      commitizen: "*",
      commitlint: "*",
      "cz-conventional-changelog": "*",
      eslint: "*",
      "eslint-config-prettier": "*",
      "eslint-plugin-prettier": "*",
      "eslint-plugin-react": "*",
      husky: "*",
      "lint-staged": "*",
      prettier: "*",
      stylelint: "*",
      "stylelint-config-prettier": "*",
      "stylelint-config-recess-order": "*",
      "stylelint-config-standard": "*",
      "stylelint-prettier": "*",
      terser: "*",
      typescript: "*",
    };
  }
}

export function createPackageJsonModule(template: string) {
  if (template === Template.REACT) {
    return new reactPackageJsonModule();
  } else {
    throw new CommanderError(500, "500", "没有对应的template");
  }
}