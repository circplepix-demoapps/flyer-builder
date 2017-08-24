import { FlyerbuilderPage } from './app.po';

describe('flyerbuilder App', () => {
  let page: FlyerbuilderPage;

  beforeEach(() => {
    page = new FlyerbuilderPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
