'use babel';

describe('atom-language-rust', () => {

  let grammar = null;

  beforeEach(() => {
    waitsForPromise(() => {
      return atom.packages.activatePackage('atom-language-rust');
    });
    runs(() => {
      grammar = atom.grammars.grammarForScopeName('source.rust');
    });
  });

  it('is ready to parse Rust grammar', () => {
    expect(grammar).toBeDefined();
    expect(grammar.scopeName).toBe('source.rust');
  });

});
