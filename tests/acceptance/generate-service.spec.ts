import * as fs from 'fs-extra';
import { expect } from 'chai';
import * as path from 'path';

const ng = require('../helpers/ng');
const tmp = require('../helpers/tmp');
const SilentError = require('silent-error');

const root = process.cwd();


describe('Acceptance: ng generate service', function () {
  beforeEach(function () {
    return tmp.setup('./tmp').then(function () {
      process.chdir('./tmp');
    }).then(function () {
      return ng(['new', 'foo', '--skip-install']);
    });
  });

  afterEach(function () {
    this.timeout(10000);

    return tmp.teardown('./tmp');
  });

  it('ng generate service my-svc', function () {
    const appRoot = path.join(root, 'tmp/foo');
    const testPath = path.join(appRoot, 'src/app/my-svc.service.ts');
    const testSpecPath = path.join(appRoot, 'src/app/my-svc.service.spec.ts');
    const appModulePath = path.join(appRoot, 'src/app/app.module.ts');

    return ng(['generate', 'service', 'my-svc'])
      .then(() => {
        expect(fs.pathExistsSync(testPath)).to.equal(true);
        expect(fs.pathExistsSync(testSpecPath)).to.equal(true);
      })
      .then(() => fs.readFile(appModulePath, 'utf-8'))
      .then((content: string) => {
        expect(content).not.to.matches(/import.*\MySvcService\b.*from '.\/my-svc.service';/);
        expect(content).not.to.matches(/providers:\s*\[MySvcService\]/m);
      });
  });

  it('ng generate service my-svc --no-spec', function () {
    const appRoot = path.join(root, 'tmp/foo');
    const testPath = path.join(appRoot, 'src/app/my-svc.service.ts');
    const testSpecPath = path.join(appRoot, 'src/app/my-svc.service.spec.ts');
    const appModulePath = path.join(appRoot, 'src/app/app.module.ts');

    return ng(['generate', 'service', 'my-svc', '--no-spec'])
      .then(() => {
        expect(fs.pathExistsSync(testPath)).to.equal(true);
        expect(fs.pathExistsSync(testSpecPath)).to.equal(false);
      })
      .then(() => fs.readFile(appModulePath, 'utf-8'))
      .then((content: string) => {
        expect(content).not.to.matches(/import.*\MySvcService\b.*from '.\/my-svc.service';/);
        expect(content).not.to.matches(/providers:\s*\[MySvcService\]/m);
      });
  });

  it('ng generate service test' + path.sep + 'my-svc', function () {
    fs.mkdirsSync(path.join(root, 'tmp', 'foo', 'src', 'app', 'test'));
    return ng(['generate', 'service', 'test' + path.sep + 'my-svc']).then(() => {
      const testPath = path.join(root, 'tmp', 'foo', 'src', 'app', 'test', 'my-svc.service.ts');
      expect(fs.pathExistsSync(testPath)).to.equal(true);
    });
  });

  it('ng generate service test' + path.sep + '..' + path.sep + 'my-svc', function () {
    return ng(['generate', 'service', 'test' + path.sep + '..' + path.sep + 'my-svc']).then(() => {
      const testPath = path.join(root, 'tmp', 'foo', 'src', 'app', 'my-svc.service.ts');
      expect(fs.pathExistsSync(testPath)).to.equal(true);
    });
  });

  it('ng generate service my-svc from a child dir', () => {
    fs.mkdirsSync(path.join(root, 'tmp', 'foo', 'src', 'app', '1'));
    return new Promise(function (resolve) {
      process.chdir('./src');
      resolve();
    })
      .then(() => process.chdir('./app'))
      .then(() => process.chdir('./1'))
      .then(() => {
        process.env.CWD = process.cwd();
        return ng(['generate', 'service', 'my-svc']);
      })
      .then(() => {
        const testPath = path.join(root, 'tmp', 'foo', 'src', 'app', '1', 'my-svc.service.ts');
        expect(fs.pathExistsSync(testPath)).to.equal(true);
      });
  });

  it('ng generate service child-dir' + path.sep + 'my-svc from a child dir', () => {
    fs.mkdirsSync(path.join(root, 'tmp', 'foo', 'src', 'app', '1', 'child-dir'));
    return new Promise(function (resolve) {
      process.chdir('./src');
      resolve();
    })
      .then(() => process.chdir('./app'))
      .then(() => process.chdir('./1'))
      .then(() => {
        process.env.CWD = process.cwd();
        return ng(['generate', 'service', 'child-dir' + path.sep + 'my-svc']);
      })
      .then(() => {
        const testPath = path.join(
          root, 'tmp', 'foo', 'src', 'app', '1', 'child-dir', 'my-svc.service.ts');
        expect(fs.pathExistsSync(testPath)).to.equal(true);
      });
  });

  it('ng generate service child-dir' + path.sep + '..' + path.sep + 'my-svc from a child dir',
    () => {
      fs.mkdirsSync(path.join(root, 'tmp', 'foo', 'src', 'app', '1'));
      return new Promise(function (resolve) {
        process.chdir('./src');
        resolve();
      })
        .then(() => process.chdir('./app'))
        .then(() => process.chdir('./1'))
        .then(() => {
          process.env.CWD = process.cwd();
          return ng(
            ['generate', 'service', 'child-dir' + path.sep + '..' + path.sep + 'my-svc']);
        })
        .then(() => {
          const testPath =
            path.join(root, 'tmp', 'foo', 'src', 'app', '1', 'my-svc.service.ts');
          expect(fs.pathExistsSync(testPath)).to.equal(true);
        });
    });

  it('ng generate service ' + path.sep + 'my-svc from a child dir, gens under ' +
    path.join('src', 'app'),
    () => {
      fs.mkdirsSync(path.join(root, 'tmp', 'foo', 'src', 'app', '1'));
      return new Promise(function (resolve) {
        process.chdir('./src');
        resolve();
      })
        .then(() => process.chdir('./app'))
        .then(() => process.chdir('./1'))
        .then(() => {
          process.env.CWD = process.cwd();
          return ng(['generate', 'service', path.sep + 'my-svc']);
        })
        .then(() => {
          const testPath = path.join(root, 'tmp', 'foo', 'src', 'app', 'my-svc.service.ts');
          expect(fs.pathExistsSync(testPath)).to.equal(true);
        });
    });

  it('ng generate service ..' + path.sep + 'my-svc from root dir will fail', () => {
    return ng(['generate', 'service', '..' + path.sep + 'my-svc']).then(() => {
      throw new SilentError(`ng generate service ..${path.sep}my-svc from root dir should fail.`);
    }, (err: string) => {
      // tslint:disable-next-line:max-line-length
      expect(err).to.equal(`Invalid path: "..${path.sep}my-svc" cannot be above the "src${path.sep}app" directory`);
    });
  });

  it('should error out when given an incorrect module path', () => {
    return Promise.resolve()
      .then(() => ng(['generate', 'service', 'baz', '--module', 'foo']))
      .catch((error) => {
        expect(error).to.equal('Specified module does not exist');
      });
  });

  describe('should import and add to provider list', () => {
    it('when given a root level module with module.ts suffix', () => {
      const appRoot = path.join(root, 'tmp/foo');
      const modulePath = path.join(appRoot, 'src/app/app.module.ts');

      return Promise.resolve()
        .then(() => ng(['generate', 'service', 'baz', '--module', 'app.module.ts']))
        .then(() => fs.readFile(modulePath, 'utf-8'))
        .then(content => {
          expect(content).to.matches(/import.*BazService.*from '.\/baz.service';/);
          expect(content).to.matches(/providers:\s*\[BazService\]/m);
        });
    });

    it('when given a root level module with missing module.ts suffix', () => {
      const appRoot = path.join(root, 'tmp/foo');
      const modulePath = path.join(appRoot, 'src/app/app.module.ts');

      return Promise.resolve()
        .then(() => ng(['generate', 'service', 'baz', '--module', 'app']))
        .then(() => fs.readFile(modulePath, 'utf-8'))
        .then(content => {
          expect(content).to.matches(/import.*BazService.*from '.\/baz.service';/);
          expect(content).to.matches(/providers:\s*\[BazService\]/m);
        });
    });

    it('when given a submodule with module.ts suffix', () => {
      const appRoot = path.join(root, 'tmp/foo');
      const modulePath = path.join(appRoot, 'src/app/foo/foo.module.ts');

      return Promise.resolve()
        .then(() => ng(['generate', 'module', 'foo']))
        .then(() => ng(['generate', 'service', 'baz', '--module',
          path.join('foo', 'foo.module.ts')]))
        .then(() => fs.readFile(modulePath, 'utf-8'))
        .then(content => {
          expect(content).to.matches(/import.*BazService.*from '..\/baz.service';/);
          expect(content).to.matches(/providers:\s*\[BazService\]/m);
        });
    });

    it('when given a submodule with missing module.ts suffix', () => {
      const appRoot = path.join(root, 'tmp/foo');
      const modulePath = path.join(appRoot, 'src/app/foo/foo.module.ts');

      return Promise.resolve()
        .then(() => ng(['generate', 'module', 'foo']))
        .then(() => ng(['generate', 'service', 'baz', '--module', path.join('foo', 'foo')]))
        .then(() => fs.readFile(modulePath, 'utf-8'))
        .then(content => {
          expect(content).to.matches(/import.*BazService.*from '..\/baz.service';/);
          expect(content).to.matches(/providers:\s*\[BazService\]/m);
        });
    });

    it('when given a submodule folder', () => {
      const appRoot = path.join(root, 'tmp/foo');
      const modulePath = path.join(appRoot, 'src/app/foo/foo.module.ts');

      return Promise.resolve()
        .then(() => ng(['generate', 'module', 'foo']))
        .then(() => ng(['generate', 'service', 'baz', '--module', 'foo']))
        .then(() => fs.readFile(modulePath, 'utf-8'))
        .then(content => {
          expect(content).to.matches(/import.*BazService.*from '..\/baz.service';/);
          expect(content).to.matches(/providers:\s*\[BazService\]/m);
        });
    });

    it('when given deep submodule folder with missing module.ts suffix', () => {
      const appRoot = path.join(root, 'tmp/foo');
      const modulePath = path.join(appRoot, 'src/app/foo/bar/bar.module.ts');

      return Promise.resolve()
        .then(() => ng(['generate', 'module', 'foo']))
        .then(() => ng(['generate', 'module', path.join('foo', 'bar')]))
        .then(() => ng(['generate', 'service', 'baz', '--module', path.join('foo', 'bar')]))
        .then(() => fs.readFile(modulePath, 'utf-8'))
        .then(content => {
          expect(content).to.matches(/import.*BazService.*from '..\/..\/baz.service';/);
          expect(content).to.matches(/providers:\s*\[BazService\]/m);
        });
    });
  });
});
