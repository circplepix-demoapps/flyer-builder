import * as fs from 'fs-extra';
import { expect } from 'chai';
import * as path from 'path';

const ng = require('../helpers/ng');
const tmp = require('../helpers/tmp');
const SilentError = require('silent-error');

const root = process.cwd();

describe('Acceptance: ng generate guard', function () {
  beforeEach(() => {
    return tmp.setup('./tmp').then(() => {
      process.chdir('./tmp');
    }).then(() => {
      return ng(['new', 'foo', '--skip-install']);
    });
  });

  afterEach(() => {
    this.timeout(10000);

    return tmp.teardown('./tmp');
  });

  it('ng generate guard my-guard', () => {
    const appRoot = path.join(root, 'tmp/foo');
    const testPath = path.join(appRoot, 'src/app/my-guard.guard.ts');
    const testSpecPath = path.join(appRoot, 'src/app/my-guard.guard.spec.ts');
    const appModulePath = path.join(appRoot, 'src/app/app.module.ts');

    return ng(['generate', 'guard', 'my-guard'])
      .then(() => {
        expect(fs.pathExistsSync(testPath)).to.equal(true);
        expect(fs.pathExistsSync(testSpecPath)).to.equal(true);
      })
      .then(() => fs.readFile(appModulePath, 'utf-8'))
      .then((content: string) => {
        expect(content).not.to.matches(/import.*MyGuardGuard.*from '.\/my-guard.guard';/);
        expect(content).not.to.matches(/providers:\s*\[MyGuardGuard\]/m);
      });
  });

  it('ng generate guard my-guard --no-spec', () => {
    const appRoot = path.join(root, 'tmp/foo');
    const testPath = path.join(appRoot, 'src/app/my-guard.guard.ts');
    const testSpecPath = path.join(appRoot, 'src/app/my-guard.guard.spec.ts');
    const appModulePath = path.join(appRoot, 'src/app/app.module.ts');

    return ng(['generate', 'guard', 'my-guard', '--no-spec'])
      .then(() => {
        expect(fs.pathExistsSync(testPath)).to.equal(true);
        expect(fs.pathExistsSync(testSpecPath)).to.equal(false);
      })
      .then(() => fs.readFile(appModulePath, 'utf-8'))
      .then((content: string) => {
        expect(content).not.to.matches(/import.*MyGuardGuard.*from '.\/my-guard.guard';/);
        expect(content).not.to.matches(/providers:\s*\[MyGuardGuard\]/m);
      });
  });

  it('ng generate guard test' + path.sep + 'my-guard', () => {
    fs.mkdirsSync(path.join(root, 'tmp', 'foo', 'src', 'app', 'test'));
    return ng(['generate', 'guard', 'test' + path.sep + 'my-guard']).then(() => {
      const testPath = path.join(root, 'tmp', 'foo', 'src', 'app', 'test', 'my-guard.guard.ts');
      expect(fs.pathExistsSync(testPath)).to.equal(true);
    });
  });

  it('ng generate guard test' + path.sep + '..' + path.sep + 'my-guard', () => {
    return ng(['generate', 'guard', 'test' + path.sep + '..' + path.sep + 'my-guard']).then(() => {
      const testPath = path.join(root, 'tmp', 'foo', 'src', 'app', 'my-guard.guard.ts');
      expect(fs.pathExistsSync(testPath)).to.equal(true);
    });
  });

  it('ng generate guard my-guard from a child dir', () => {
    fs.mkdirsSync(path.join(root, 'tmp', 'foo', 'src', 'app', '1'));
    return new Promise(function (resolve) {
      process.chdir('./src');
      resolve();
    })
      .then(() => process.chdir('./app'))
      .then(() => process.chdir('./1'))
      .then(() => {
        process.env.CWD = process.cwd();
        return ng(['generate', 'guard', 'my-guard']);
      })
      .then(() => {
        const testPath = path.join(root, 'tmp', 'foo', 'src', 'app', '1', 'my-guard.guard.ts');
        expect(fs.pathExistsSync(testPath)).to.equal(true);
      });
  });

  it('ng generate guard child-dir' + path.sep + 'my-guard from a child dir', () => {
    fs.mkdirsSync(path.join(root, 'tmp', 'foo', 'src', 'app', '1', 'child-dir'));
    return new Promise(function (resolve) {
      process.chdir('./src');
      resolve();
    })
      .then(() => process.chdir('./app'))
      .then(() => process.chdir('./1'))
      .then(() => {
        process.env.CWD = process.cwd();
        return ng(['generate', 'guard', 'child-dir' + path.sep + 'my-guard']);
      })
      .then(() => {
        const testPath = path.join(
          root, 'tmp', 'foo', 'src', 'app', '1', 'child-dir', 'my-guard.guard.ts');
        expect(fs.pathExistsSync(testPath)).to.equal(true);
      });
  });

  it('ng generate guard child-dir' + path.sep + '..' + path.sep + 'my-guard from a child dir',
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
            ['generate', 'guard', 'child-dir' + path.sep + '..' + path.sep + 'my-guard']);
        })
        .then(() => {
          const testPath =
            path.join(root, 'tmp', 'foo', 'src', 'app', '1', 'my-guard.guard.ts');
          expect(fs.pathExistsSync(testPath)).to.equal(true);
        });
    });

  it('ng generate guard ' + path.sep + 'my-guard from a child dir, gens under ' +
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
          return ng(['generate', 'guard', path.sep + 'my-guard']);
        })
        .then(() => {
          const testPath = path.join(root, 'tmp', 'foo', 'src', 'app', 'my-guard.guard.ts');
          expect(fs.pathExistsSync(testPath)).to.equal(true);
        });
    });

  it('ng generate guard ..' + path.sep + 'my-guard from root dir will fail', () => {
    return ng(['generate', 'guard', '..' + path.sep + 'my-guard']).then(() => {
      throw new SilentError(`ng generate guard ..${path.sep}my-guard from root dir should fail.`);
    }, (err: string) => {
      // tslint:disable-next-line:max-line-length
      expect(err).to.equal(`Invalid path: "..${path.sep}my-guard" cannot be above the "src${path.sep}app" directory`);
    });
  });

  it('should error out when given an incorrect module path', () => {
    return Promise.resolve()
      .then(() => ng(['generate', 'guard', 'baz', '--module', 'foo']))
      .catch((error) => {
        expect(error).to.equal('Specified module does not exist');
      });
  });

  describe('should import and add to provider list', () => {
    it('when given a root level module with module.ts suffix', () => {
      const appRoot = path.join(root, 'tmp/foo');
      const modulePath = path.join(appRoot, 'src/app/app.module.ts');

      return Promise.resolve()
        .then(() => ng(['generate', 'guard', 'baz', '--module', 'app.module.ts']))
        .then(() => fs.readFile(modulePath, 'utf-8'))
        .then(content => {
          expect(content).to.matches(/import.*BazGuard.*from '.\/baz.guard';/);
          expect(content).to.matches(/providers:\s*\[BazGuard\]/m);
        });
    });

    it('when given a root level module with missing module.ts suffix', () => {
      const appRoot = path.join(root, 'tmp/foo');
      const modulePath = path.join(appRoot, 'src/app/app.module.ts');

      return Promise.resolve()
        .then(() => ng(['generate', 'guard', 'baz', '--module', 'app']))
        .then(() => fs.readFile(modulePath, 'utf-8'))
        .then(content => {
          expect(content).to.matches(/import.*BazGuard.*from '.\/baz.guard';/);
          expect(content).to.matches(/providers:\s*\[BazGuard\]/m);
        });
    });

    it('when given a submodule with module.ts suffix', () => {
      const appRoot = path.join(root, 'tmp/foo');
      const modulePath = path.join(appRoot, 'src/app/foo/foo.module.ts');

      return Promise.resolve()
        .then(() => ng(['generate', 'module', 'foo']))
        .then(() => ng(['generate', 'guard', 'baz', '--module', path.join('foo', 'foo.module.ts')]))
        .then(() => fs.readFile(modulePath, 'utf-8'))
        .then(content => {
          expect(content).to.matches(/import.*BazGuard.*from '..\/baz.guard';/);
          expect(content).to.matches(/providers:\s*\[BazGuard\]/m);
        });
    });

    it('when given a submodule with missing module.ts suffix', () => {
      const appRoot = path.join(root, 'tmp/foo');
      const modulePath = path.join(appRoot, 'src/app/foo/foo.module.ts');

      return Promise.resolve()
        .then(() => ng(['generate', 'module', 'foo']))
        .then(() => ng(['generate', 'guard', 'baz', '--module', path.join('foo', 'foo')]))
        .then(() => fs.readFile(modulePath, 'utf-8'))
        .then(content => {
          expect(content).to.matches(/import.*BazGuard.*from '..\/baz.guard';/);
          expect(content).to.matches(/providers:\s*\[BazGuard\]/m);
        });
    });

    it('when given a submodule folder', () => {
      const appRoot = path.join(root, 'tmp/foo');
      const modulePath = path.join(appRoot, 'src/app/foo/foo.module.ts');

      return Promise.resolve()
        .then(() => ng(['generate', 'module', 'foo']))
        .then(() => ng(['generate', 'guard', 'baz', '--module', 'foo']))
        .then(() => fs.readFile(modulePath, 'utf-8'))
        .then(content => {
          expect(content).to.matches(/import.*BazGuard.*from '..\/baz.guard';/);
          expect(content).to.matches(/providers:\s*\[BazGuard\]/m);
        });
    });

    it('when given deep submodule folder with missing module.ts suffix', () => {
      const appRoot = path.join(root, 'tmp/foo');
      const modulePath = path.join(appRoot, 'src/app/foo/bar/bar.module.ts');

      return Promise.resolve()
        .then(() => ng(['generate', 'module', 'foo']))
        .then(() => ng(['generate', 'module', path.join('foo', 'bar')]))
        .then(() => ng(['generate', 'guard', 'baz', '--module', path.join('foo', 'bar')]))
        .then(() => fs.readFile(modulePath, 'utf-8'))
        .then(content => {
          expect(content).to.matches(/import.*BazGuard.*from '..\/..\/baz.guard';/);
          expect(content).to.matches(/providers:\s*\[BazGuard\]/m);
        });
    });
  });
});
