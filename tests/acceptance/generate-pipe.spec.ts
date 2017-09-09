import * as fs from 'fs-extra';
import { expect } from 'chai';
import * as path from 'path';

const ng = require('../helpers/ng');
const tmp = require('../helpers/tmp');
const SilentError = require('silent-error');

const root = process.cwd();


describe('Acceptance: ng generate pipe', function () {
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

  it('ng generate pipe my-pipe', function () {
    const appRoot = path.join(root, 'tmp/foo');
    const testPath = path.join(appRoot, 'src/app/my-pipe.pipe.ts');
    const testSpecPath = path.join(appRoot, 'src/app/my-pipe.pipe.spec.ts');
    const appModulePath = path.join(appRoot, 'src/app/app.module.ts');
    return ng(['generate', 'pipe', 'my-pipe'])
      .then(() => {
        expect(fs.pathExistsSync(testPath)).to.equal(true);
        expect(fs.pathExistsSync(testSpecPath)).to.equal(true);
      })
      .then(() => fs.readFile(appModulePath, 'utf-8'))
      .then((content: string) => {
        expect(content).matches(/import.*\bMyPipePipe\b.*from '.\/my-pipe.pipe';/);
        expect(content).matches(/declarations:\s*\[[^\]]+?,\r?\n\s+MyPipePipe\r?\n/m);
      });
  });

  it('ng generate pipe my-pipe --no-spec', function () {
    const appRoot = path.join(root, 'tmp/foo');
    const testPath = path.join(appRoot, 'src/app/my-pipe.pipe.ts');
    const testSpecPath = path.join(appRoot, 'src/app/my-pipe.pipe.spec.ts');

    return ng(['generate', 'pipe', 'my-pipe', '--no-spec'])
      .then(() => {
        expect(fs.pathExistsSync(testPath)).to.equal(true);
        expect(fs.pathExistsSync(testSpecPath)).to.equal(false);
      });
  });

  it('ng generate pipe test' + path.sep + 'my-pipe', function () {
    fs.mkdirsSync(path.join(root, 'tmp', 'foo', 'src', 'app', 'test'));
    return ng(['generate', 'pipe', 'test' + path.sep + 'my-pipe']).then(() => {
      const testPath = path.join(root, 'tmp', 'foo', 'src', 'app', 'test', 'my-pipe.pipe.ts');
      expect(fs.pathExistsSync(testPath)).to.equal(true);
    });
  });

  it('ng generate pipe test' + path.sep + '..' + path.sep + 'my-pipe', function () {
    return ng(['generate', 'pipe', 'test' + path.sep + '..' + path.sep + 'my-pipe']).then(() => {
      const testPath = path.join(root, 'tmp', 'foo', 'src', 'app', 'my-pipe.pipe.ts');
      expect(fs.pathExistsSync(testPath)).to.equal(true);
    });
  });

  it('ng generate pipe my-pipe from a child dir', () => {
    fs.mkdirsSync(path.join(root, 'tmp', 'foo', 'src', 'app', '1'));
    return new Promise(function (resolve) {
      process.chdir('./src');
      resolve();
    })
      .then(() => process.chdir('./app'))
      .then(() => process.chdir('./1'))
      .then(() => {
        process.env.CWD = process.cwd();
        return ng(['generate', 'pipe', 'my-pipe']);
      })
      .then(() => {
        const testPath = path.join(root, 'tmp', 'foo', 'src', 'app', '1', 'my-pipe.pipe.ts');
        expect(fs.pathExistsSync(testPath)).to.equal(true);
      }, err => console.log('ERR: ', err));
  });

  it('ng generate pipe child-dir' + path.sep + 'my-pipe from a child dir', () => {
    fs.mkdirsSync(path.join(root, 'tmp', 'foo', 'src', 'app', '1', 'child-dir'));
    return new Promise(function (resolve) {
      process.chdir('./src');
      resolve();
    })
      .then(() => process.chdir('./app'))
      .then(() => process.chdir('./1'))
      .then(() => {
        process.env.CWD = process.cwd();
        return ng(['generate', 'pipe', 'child-dir' + path.sep + 'my-pipe']);
      })
      .then(() => {
        const testPath = path.join(
          root, 'tmp', 'foo', 'src', 'app', '1', 'child-dir', 'my-pipe.pipe.ts');
        expect(fs.pathExistsSync(testPath)).to.equal(true);
      }, err => console.log('ERR: ', err));
  });

  it('ng generate pipe child-dir' + path.sep + '..' + path.sep + 'my-pipe from a child dir', () => {
    fs.mkdirsSync(path.join(root, 'tmp', 'foo', 'src', 'app', '1'));
    return new Promise(function (resolve) {
      process.chdir('./src');
      resolve();
    })
      .then(() => process.chdir('./app'))
      .then(() => process.chdir('./1'))
      .then(() => {
        process.env.CWD = process.cwd();
        return ng(['generate', 'pipe', 'child-dir' + path.sep + '..' + path.sep + 'my-pipe']);
      })
      .then(() => {
        const testPath = path.join(root, 'tmp', 'foo', 'src', 'app', '1', 'my-pipe.pipe.ts');
        expect(fs.pathExistsSync(testPath)).to.equal(true);
      }, err => console.log('ERR: ', err));
  });

  it('ng generate pipe ' + path.sep + 'my-pipe from a child dir, gens under ' +
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
          return ng(['generate', 'pipe', path.sep + 'my-pipe']);
        })
        .then(() => {
          const testPath = path.join(root, 'tmp', 'foo', 'src', 'app', 'my-pipe.pipe.ts');
          expect(fs.pathExistsSync(testPath)).to.equal(true);
        }, err => console.log('ERR: ', err));
    });

  it('ng generate pipe ..' + path.sep + 'my-pipe from root dir will fail', () => {
    return ng(['generate', 'pipe', '..' + path.sep + 'my-pipe']).then(() => {
      throw new SilentError(`ng generate pipe ..${path.sep}my-pipe from root dir should fail.`);
    }, (err: string) => {
      // tslint:disable-next-line:max-line-length
      expect(err).to.equal(`Invalid path: "..${path.sep}my-pipe" cannot be above the "src${path.sep}app" directory`);
    });
  });

  it('should error out when given an incorrect module path', () => {
    return Promise.resolve()
      .then(() => ng(['generate', 'pipe', 'baz', '--module', 'foo']))
      .catch((error) => {
        expect(error).to.equal('Specified module does not exist');
      });
  });

  describe('should import and add to declaration list', () => {
    it('when given a root level module with module.ts suffix', () => {
      const appRoot = path.join(root, 'tmp/foo');
      const modulePath = path.join(appRoot, 'src/app/app.module.ts');

      return Promise.resolve()
        .then(() => ng(['generate', 'pipe', 'baz', '--module', 'app.module.ts']))
        .then(() => fs.readFile(modulePath, 'utf-8'))
        .then(content => {
          expect(content).matches(/import.*BazPipe.*from '.\/baz.pipe';/);
          // tslint:disable-next-line:max-line-length
          expect(content).matches(/declarations:\s+\[\r?\n\s+AppComponent,\r?\n\s+BazPipe\r?\n\s+\]/m);
        });
    });

    it('when given a root level module with missing module.ts suffix', () => {
      const appRoot = path.join(root, 'tmp/foo');
      const modulePath = path.join(appRoot, 'src/app/app.module.ts');

      return Promise.resolve()
        .then(() => ng(['generate', 'pipe', 'baz', '--module', 'app']))
        .then(() => fs.readFile(modulePath, 'utf-8'))
        .then(content => {
          expect(content).matches(/import.*BazPipe.*from '.\/baz.pipe';/);
          // tslint:disable-next-line:max-line-length
          expect(content).matches(/declarations:\s+\[\r?\n\s+AppComponent,\r?\n\s+BazPipe\r?\n\s+\]/m);
        });
    });

    it('when given a submodule with module.ts suffix', () => {
      const appRoot = path.join(root, 'tmp/foo');
      const modulePath = path.join(appRoot, 'src/app/foo/foo.module.ts');

      return Promise.resolve()
        .then(() => ng(['generate', 'module', 'foo']))
        .then(() => ng(['generate', 'pipe', 'baz', '--module', path.join('foo', 'foo.module.ts')]))
        .then(() => fs.readFile(modulePath, 'utf-8'))
        .then(content => {
          expect(content).matches(/import.*BazPipe.*from '..\/baz.pipe';/);
          expect(content).matches(/declarations:\s+\[BazPipe]/m);
        });
    });

    it('when given a submodule with missing module.ts suffix', () => {
      const appRoot = path.join(root, 'tmp/foo');
      const modulePath = path.join(appRoot, 'src/app/foo/foo.module.ts');

      return Promise.resolve()
        .then(() => ng(['generate', 'module', 'foo']))
        .then(() => ng(['generate', 'pipe', 'baz', '--module', path.join('foo', 'foo')]))
        .then(() => fs.readFile(modulePath, 'utf-8'))
        .then(content => {
          expect(content).matches(/import.*BazPipe.*from '..\/baz.pipe';/);
          expect(content).matches(/declarations:\s+\[BazPipe]/m);
        });
    });

    it('when given a submodule folder', () => {
      const appRoot = path.join(root, 'tmp/foo');
      const modulePath = path.join(appRoot, 'src/app/foo/foo.module.ts');

      return Promise.resolve()
        .then(() => ng(['generate', 'module', 'foo']))
        .then(() => ng(['generate', 'pipe', 'baz', '--module', 'foo']))
        .then(() => fs.readFile(modulePath, 'utf-8'))
        .then(content => {
          expect(content).matches(/import.*BazPipe.*from '..\/baz.pipe';/);
          expect(content).matches(/declarations:\s+\[BazPipe]/m);
        });
    });

    it('when given deep submodule folder with missing module.ts suffix', () => {
      const appRoot = path.join(root, 'tmp/foo');
      const modulePath = path.join(appRoot, 'src/app/foo/bar/bar.module.ts');

      return Promise.resolve()
        .then(() => ng(['generate', 'module', 'foo']))
        .then(() => ng(['generate', 'module', path.join('foo', 'bar')]))
        .then(() => ng(['generate', 'pipe', 'baz', '--module', path.join('foo', 'bar')]))
        .then(() => fs.readFile(modulePath, 'utf-8'))
        .then(content => {
          expect(content).matches(/import.*BazPipe.*from '..\/..\/baz.pipe';/);
          expect(content).matches(/declarations:\s+\[BazPipe]/m);
        });
    });
  });
});
