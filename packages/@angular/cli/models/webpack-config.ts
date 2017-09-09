const webpackMerge = require('webpack-merge');
import { CliConfig } from './config';
import { BuildOptions } from './build-options';
import {
  getBrowserConfig,
  getCommonConfig,
  getDevConfig,
  getProdConfig,
  getStylesConfig,
  getNonAotConfig,
  getAotConfig
} from './webpack-configs';

const path = require('path');

export interface WebpackConfigOptions {
  projectRoot: string;
  buildOptions: BuildOptions;
  appConfig: any;
}

export class NgCliWebpackConfig {
  public config: any;
  public wco: WebpackConfigOptions;
  constructor(buildOptions: BuildOptions, appConfig: any) {

    this.validateBuildOptions(buildOptions);

    const configPath = CliConfig.configFilePath();
    const projectRoot = path.dirname(configPath);

    appConfig = this.addAppConfigDefaults(appConfig);
    buildOptions = this.addTargetDefaults(buildOptions);
    buildOptions = this.mergeConfigs(buildOptions, appConfig);

    this.wco = { projectRoot, buildOptions, appConfig };
  }

  public buildConfig() {
    let webpackConfigs = [
      getCommonConfig(this.wco),
      getBrowserConfig(this.wco),
      getStylesConfig(this.wco),
      this.getTargetConfig(this.wco)
    ];

    if (this.wco.appConfig.main || this.wco.appConfig.polyfills) {
      const typescriptConfigPartial = this.wco.buildOptions.aot
        ? getAotConfig(this.wco)
        : getNonAotConfig(this.wco);
      webpackConfigs.push(typescriptConfigPartial);
    }

    this.config = webpackMerge(webpackConfigs);
    return this.config;
  }

  public getTargetConfig(webpackConfigOptions: WebpackConfigOptions): any {
    switch (webpackConfigOptions.buildOptions.target) {
      case 'development':
        return getDevConfig(webpackConfigOptions);
      case 'production':
        return getProdConfig(webpackConfigOptions);
    }
  }

  // Validate build options
  public validateBuildOptions(buildOptions: BuildOptions) {
    buildOptions.target = buildOptions.target || 'development';
    if (buildOptions.target !== 'development' && buildOptions.target !== 'production') {
      throw new Error("Invalid build target. Only 'development' and 'production' are available.");
    }
  }

  // Fill in defaults for build targets
  public addTargetDefaults(buildOptions: BuildOptions): BuildOptions {
    const targetDefaults: { [target: string]: BuildOptions } = {
      development: {
        environment: 'dev',
        outputHashing: 'media',
        sourcemaps: true,
        extractCss: false
      },
      production: {
        environment: 'prod',
        outputHashing: 'all',
        sourcemaps: false,
        extractCss: true,
        aot: true
      }
    };

    return Object.assign({}, targetDefaults[buildOptions.target], buildOptions);
  }

  // Fill in defaults from .angular-cli.json
  public mergeConfigs(buildOptions: BuildOptions, appConfig: any) {
    const mergeableOptions = {
      outputPath: appConfig.outDir,
      deployUrl: appConfig.deployUrl
    };

    return Object.assign({}, mergeableOptions, buildOptions);
  }

  public addAppConfigDefaults(appConfig: any) {
    const appConfigDefaults: any = {
      testTsconfig: appConfig.tsconfig,
      scripts: [],
      styles: []
    };

    // can't use Object.assign here because appConfig has a lot of getters/setters
    for (let key of Object.keys(appConfigDefaults)) {
      appConfig[key] = appConfig[key] || appConfigDefaults[key];
    }

    return appConfig;
  }
}
