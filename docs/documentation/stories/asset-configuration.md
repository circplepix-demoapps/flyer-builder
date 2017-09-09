# Project assets

You use the `assets` array in `.angular-cli.json` to list files or folders you want to copy as-is
when building your project.

By default, the `src/assets/` folder and `src/favicon.ico` are copied over.

```json
"assets": [
  "assets",
  "favicon.ico"
]
```

You can also further configure assets to be copied by using objects as configuration.

The array below does the same as the default one:

```json
"assets": [
  { "glob": "**/*", "input": "./assets/", "output": "./assets/" },
  { "glob": "favicon.ico", "input": "./", "output": "./" },
]
```

`glob` is the a [node-glob](https://github.com/isaacs/node-glob) using `input` as base directory.
`input` is relative to the project root (`src/` default), while `output` is
 relative to `outDir` (`dist` default).

 You can use this extended configuration to copy assets from outside your project.
 For instance, you can copy assets from a node package:

 ```json
"assets": [
  { "glob": "**/*", "input": "../node_modules/some-package/images", "output": "./some-package/" },
]
```

The contents of `node_modules/some-package/images/` will be available in `dist/some-package/`.