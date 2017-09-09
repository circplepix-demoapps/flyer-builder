// tslint:disable:max-line-length
import { mkdirsSync, pathExistsSync, readFile, readFileSync } from 'fs-extra';
import { expect } from 'chai';
import * as path from 'path';

const ng = require('../helpers/ng');
const tmp = require('../helpers/tmp');
const SilentError = require('silent-error');

const root = process.cwd();


describe('Acceptance: ng generate component', function () {
  beforeEach(function () {
    this.timeout(10000);
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

  it('my-comp', function () {
    const testPath = path.join(root, 'tmp/foo/src/app/my-comp/my-comp.component.ts');
    const appModule = path.join(root, 'tmp/foo/src/app/app.module.ts');
    return ng(['generate', 'component', 'my-comp'])
      .then(() => expect(pathExistsSync(testPath)).to.equal(true))
      .then(() => readFile(appModule, 'utf-8'))
      .then(content => {
        // Expect that the app.module contains a reference to my-comp and its import.
        expect(content).matches(/import.*MyCompComponent.*from '.\/my-comp\/my-comp.component';/);
        expect(content).matches(/declarations:\s*\[[^\]]+?,\r?\n\s+MyCompComponent\r?\n/m);
      });
  });

  it('generating my-comp twice does not add two declarations to module', function () {
    const appModule = path.join(root, 'tmp/foo/src/app/app.module.ts');
    return ng(['generate', 'component', 'my-comp'])
      .then(() => ng(['generate', 'component', 'my-comp']))
      .then(() => readFile(appModule, 'utf-8'))
      .then(content => {
        expect(content)
          .matches(/declarations:\s+\[\r?\n\s+AppComponent,\r?\n\s+MyCompComponent\r?\n\s+\]/m);
      });
  });

  it('test' + path.sep + 'my-comp', function () {
    mkdirsSync(path.join(root, 'tmp', 'foo', 'src', 'app', 'test'));
    return ng(['generate', 'component', 'test' + path.sep + 'my-comp']).then(() => {
      const testPath =
        path.join(root, 'tmp', 'foo', 'src', 'app', 'test', 'my-comp', 'my-comp.component.ts');
      expect(pathExistsSync(testPath)).to.equal(true);
    });
  });

  it('test' + path.sep + '..' + path.sep + 'my-comp', function () {
    return ng(['generate', 'component', 'test' + path.sep + '..' + path.sep + 'my-comp'])
      .then(() => {
        const testPath =
          path.join(root, 'tmp', 'foo', 'src', 'app', 'my-comp', 'my-comp.component.ts');
        expect(pathExistsSync(testPath)).to.equal(true);
      });
  });

  it('my-comp from a child dir', () => {
    mkdirsSync(path.join(root, 'tmp', 'foo', 'src', 'app', '1'));
    return new Promise(function (resolve) {
      process.chdir('./src');
      resolve();
    })
      .then(() => process.chdir('./app'))
      .then(() => process.chdir('./1'))
      .then(() => {
        return ng(['generate', 'component', 'my-comp']);
      })
      .then(() => {
        const testPath =
          path.join(root, 'tmp', 'foo', 'src', 'app', '1', 'my-comp', 'my-comp.component.ts');
        expect(pathExistsSync(testPath)).to.equal(true);
      });
  });

  it('child-dir' + path.sep + 'my-comp from a child dir', () => {
    mkdirsSync(path.join(root, 'tmp', 'foo', 'src', 'app', '1', 'child-dir'));
    return new Promise(function (resolve) {
      process.chdir('./src');
      resolve();
    })
      .then(() => process.chdir('./app'))
      .then(() => process.chdir('./1'))
      .then(() => {
        return ng(['generate', 'component', 'child-dir' + path.sep + 'my-comp']);
      })
      .then(() => {
        const testPath = path.join(
          root, 'tmp', 'foo', 'src', 'app', '1', 'child-dir', 'my-comp', 'my-comp.component.ts');
        expect(pathExistsSync(testPath)).to.equal(true);
      });
  });

  it('child-dir' + path.sep + '..' + path.sep + 'my-comp from a child dir', () => {
    mkdirsSync(path.join(root, 'tmp', 'foo', 'src', 'app', '1'));
    return Promise.resolve()
      .then(() => process.chdir(path.normalize('./src/app/1')))
      .then(() => {
        return ng([
          'generate', 'component', 'child-dir' + path.sep + '..' + path.sep + 'my-comp'
        ]);
      })
      .then(() => {
        const testPath =
          path.join(root, 'tmp', 'foo', 'src', 'app', '1', 'my-comp', 'my-comp.component.ts');
        expect(pathExistsSync(testPath)).to.equal(true);
      });
  });

  it(path.sep + 'my-comp from a child dir, gens under ' + path.join('src', 'app'), () => {
    mkdirsSync(path.join(root, 'tmp', 'foo', 'src', 'app', '1'));
    return Promise.resolve()
      .then(() => process.chdir(path.normalize('./src/app/1')))
      .then(() => {
        return ng(['generate', 'component', path.sep + 'my-comp']);
      })
      .then(() => {
        const testPath =
          path.join(root, 'tmp', 'foo', 'src', 'app', 'my-comp', 'my-comp.component.ts');
        expect(pathExistsSync(testPath)).to.equal(true);
      });
  });

  it('..' + path.sep + 'my-comp from root dir will fail', () => {
    return ng(['generate', 'component', '..' + path.sep + 'my-comp']).then(() => {
      throw new SilentError(`ng generate component ..${path.sep}my-comp from root dir should fail.`);
    }, (err) => {
      expect(err).to.equal(`Invalid path: "..${path.sep}my-comp" cannot be above the "src${path.sep}app" directory`);
    });
  });

  it('mycomp will prefix selector', () => {
    return ng(['generate', 'component', 'mycomp'])
      .then(() => {
        const testPath =
          path.join(root, 'tmp', 'foo', 'src', 'app', 'mycomp', 'mycomp.component.ts');
        expect(pathExistsSync(testPath)).to.equal(true);
        const contents = readFileSync(testPath, 'utf8');
        expect(contents.indexOf('selector: \'app-mycomp\'') === -1).to.equal(false);
      });
  });

  it('mycomp --no-prefix will not prefix selector', () => {
    return ng(['generate', 'component', 'mycomp', '--no-prefix'])
      .then(() => {
        const testPath =
          path.join(root, 'tmp', 'foo', 'src', 'app', 'mycomp', 'mycomp.component.ts');
        expect(pathExistsSync(testPath)).to.equal(true);
        const contents = readFileSync(testPath, 'utf8');
        expect(contents.indexOf('selector: \'mycomp\'') === -1).to.equal(false);
      });
  });

  it('mycomp --prefix= will not prefix selector', () => {
    return ng(['generate', 'component', 'mycomp', '--prefix='])
      .then(() => {
        const testPath =
          path.join(root, 'tmp', 'foo', 'src', 'app', 'mycomp', 'mycomp.component.ts');
        expect(pathExistsSync(testPath)).to.equal(true);
        const contents = readFileSync(testPath, 'utf8');
        expect(contents.indexOf('selector: \'mycomp\'') === -1).to.equal(false);
      });
  });

  it('mycomp --prefix=test will prefix selector with \'test-\'', () => {
    return ng(['generate', 'component', 'mycomp', '--prefix=test'])
      .then(() => {
        const testPath =
          path.join(root, 'tmp', 'foo', 'src', 'app', 'mycomp', 'mycomp.component.ts');
        expect(pathExistsSync(testPath)).to.equal(true);
        const contents = readFileSync(testPath, 'utf8');
        expect(contents.indexOf('selector: \'test-mycomp\'') === -1).to.equal(false);
      });
  });

  it('myComp will succeed', () => {
    return ng(['generate', 'component', 'myComp'])
      .then(() => {
        const testPath =
          path.join(root, 'tmp', 'foo', 'src', 'app', 'my-comp', 'my-comp.component.ts');
        expect(pathExistsSync(testPath)).to.equal(true);
      });
  });

  it(`non${path.sep}existing${path.sep}dir${path.sep}myComp will create dir and succeed`, () => {
    const testPath =
      path.join(root, 'tmp', 'foo', 'src', 'app', 'non', 'existing', 'dir', 'my-comp', 'my-comp.component.ts');
    const appModule = path.join(root, 'tmp', 'foo', 'src', 'app', 'app.module.ts');
    return ng(['generate', 'component', `non${path.sep}existing${path.sep}dir${path.sep}myComp`])
      .then(() => expect(pathExistsSync(testPath)).to.equal(true))
      .then(() => readFile(appModule, 'utf-8'))
      .then(content => {
        // Expect that the app.module contains a reference to my-comp and its import.
        expect(content)
          .matches(/import.*MyCompComponent.*from '.\/non\/existing\/dir\/my-comp\/my-comp.component';/);
      });
  });

  it('my-comp --inline-template', function () {
    return ng(['generate', 'component', 'my-comp', '--inline-template']).then(() => {
      const testPath =
        path.join(root, 'tmp', 'foo', 'src', 'app', 'my-comp', 'my-comp.component.html');
      expect(pathExistsSync(testPath)).to.equal(false);
    });
  });

  it('my-comp --inline-style', function () {
    return ng(['generate', 'component', 'my-comp', '--inline-style']).then(() => {
      const testPath =
        path.join(root, 'tmp', 'foo', 'src', 'app', 'my-comp', 'my-comp.component.css');
      expect(pathExistsSync(testPath)).to.equal(false);
    });
  });

  it('my-comp --no-spec', function () {
    return ng(['generate', 'component', 'my-comp', '--no-spec']).then(() => {
      const testPath =
        path.join(root, 'tmp', 'foo', 'src', 'app', 'my-comp', 'my-comp.component.spec.ts');
      expect(pathExistsSync(testPath)).to.equal(false);
    });
  });

  it('should error out when given an incorrect module path', () => {
    return Promise.resolve()
      .then(() => ng(['generate', 'component', 'baz', '--module', 'foo']))
      .catch((error) => {
        expect(error).to.equal('Specified module does not exist');
      });
  });

  describe('should import and add to declaration list', () => {
    it('when given a root level module with module.ts suffix', () => {
      const appRoot = path.join(root, 'tmp/foo');
      const modulePath = path.join(appRoot, 'src/app/app.module.ts');

      return Promise.resolve()
        .then(() => ng(['generate', 'component', 'baz', '--module', 'app.module.ts']))
        .then(() => readFile(modulePath, 'utf-8'))
        .then(content => {
          expect(content).matches(/import.*BazComponent.*from '.\/baz\/baz.component';/);
          expect(content).matches(/declarations:\s+\[\r?\n\s+AppComponent,\r?\n\s+BazComponent\r?\n\s+\]/m);
        });
    });

    it('when given a root level module with missing module.ts suffix', () => {
      const appRoot = path.join(root, 'tmp/foo');
      const modulePath = path.join(appRoot, 'src/app/app.module.ts');

      return Promise.resolve()
        .then(() => ng(['generate', 'component', 'baz', '--module', 'app']))
        .then(() => readFile(modulePath, 'utf-8'))
        .then(content => {
          expect(content).matches(/import.*BazComponent.*from '.\/baz\/baz.component';/);
          expect(content).matches(/declarations:\s+\[\r?\n\s+AppComponent,\r?\n\s+BazComponent\r?\n\s+\]/m);
        });
    });

    it('when given a submodule with module.ts suffix', () => {
      const appRoot = path.join(root, 'tmp/foo');
      const modulePath = path.join(appRoot, 'src/app/foo/foo.module.ts');

      return Promise.resolve()
        .then(() => ng(['generate', 'module', 'foo']))
        .then(() => ng(['generate', 'component', 'baz', '--module', path.join('foo', 'foo.module.ts')]))
        .then(() => readFile(modulePath, 'utf-8'))
        .then(content => {
          expect(content).matches(/import.*BazComponent.*from '..\/baz\/baz.component';/);
          expect(content).matches(/declarations:\s+\[BazComponent]/m);
        });
    });

    it('when given a submodule with missing module.ts suffix', () => {
      const appRoot = path.join(root, 'tmp/foo');
      const modulePath = path.join(appRoot, 'src/app/foo/foo.module.ts');

      return Promise.resolve()
        .then(() => ng(['generate', 'module', 'foo']))
        .then(() => ng(['generate', 'component', 'baz', '--module', path.join('foo', 'foo')]))
        .then(() => readFile(modulePath, 'utf-8'))
        .then(content => {
          expect(content).matches(/import.*BazComponent.*from '..\/baz\/baz.component';/);
          expect(content).matches(/declarations:\s+\[BazComponent]/m);
        });
    });

    it('when given a submodule folder', () => {
      const appRoot = path.join(root, 'tmp/foo');
      const modulePath = path.join(appRoot, 'src/app/foo/foo.module.ts');

      return Promise.resolve()
        .then(() => ng(['generate', 'module', 'foo']))
        .then(() => ng(['generate', 'component', 'baz', '--module', 'foo']))
        .then(() => readFile(modulePath, 'utf-8'))
        .then(content => {
          expect(content).matches(/import.*BazComponent.*from '..\/baz\/baz.component';/);
          expect(content).matches(/declarations:\s+\[BazComponent]/m);
        });
    });

    it('when given deep submodule folder with missing module.ts suffix', () => {
      const appRoot = path.join(root, 'tmp/foo');
      const modulePath = path.join(appRoot, 'src/app/foo/bar/bar.module.ts');

      return Promise.resolve()
        .then(() => ng(['generate', 'module', 'foo']))
        .then(() => ng(['generate', 'module', path.join('foo', 'bar')]))
        .then(() => ng(['generate', 'component', 'baz', '--module', path.join('foo', 'bar')]))
        .then(() => readFile(modulePath, 'utf-8'))
        .then(content => {
          expect(content).matches(/import.*BazComponent.*from '..\/..\/baz\/baz.component';/);
          expect(content).matches(/declarations:\s+\[BazComponent]/m);
        });
    });
  });
});
