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

  it('should be ready to parse Rust grammar', () => {
    expect(grammar).toBeDefined();
    expect(grammar.scopeName).toBe('source.rust');
  });

  describe('when tokenizing attributes', () => {
    it('should detect more than one defined on the same line', () => {
      let tokens = grammar.tokenizeLines(
        '#![crate_type = "lib"] #![plugin(foo)] #[cfg(any(bar, baz), qux)]'
      );
      expect(tokens[0][0]).toEqual({
        scopes: ['source.rust', 'meta.attribute.inner.rust'],
        value: '#!['
      });
      expect(tokens[0][2]).toEqual({
        scopes: ['source.rust', 'meta.attribute.inner.rust'],
        value: ']'
      });
      expect(tokens[0][4]).toEqual({
        scopes: ['source.rust', 'meta.attribute.inner.rust'],
        value: '#!['
      });
      expect(tokens[0][9]).toEqual({
        scopes: ['source.rust', 'meta.attribute.inner.rust'],
        value: ']'
      });
      expect(tokens[0][11]).toEqual({
        scopes: ['source.rust', 'meta.attribute.outer.rust'],
        value: '#['
      });
      expect(tokens[0][17]).toEqual({
        scopes: ['source.rust', 'meta.attribute.outer.rust'],
        value: ']'
      });
    });
    it('should detect a single one defined across multiple lines', () => {
      let tokens = grammar.tokenizeLines(
        `#![unstable(feature = "foo",
                     reason = "bar",
                     issue = "baz")]`
      );
      expect(tokens[0][0]).toEqual({
        scopes: ['source.rust', 'meta.attribute.inner.rust'],
        value: '#!['
      });
      expect(tokens[2][5]).toEqual({
        scopes: ['source.rust', 'meta.attribute.inner.rust'],
        value: ']'
      });
    });
    it('should detect trailing one-line comments', () => {
      let tokens = grammar.tokenizeLines(
        `#[test] // foo`
      );
      expect(tokens[0][0]).toEqual({
        scopes: ['source.rust', 'meta.attribute.outer.rust'],
        value: '#['
      });
      expect(tokens[0][2]).toEqual({
        scopes: ['source.rust', 'meta.attribute.outer.rust'],
        value: ']'
      });
      expect(tokens[0][4]).toEqual({
        scopes: ['source.rust', 'comment.line.rust'],
        value: '// foo'
      });
    })
  });

});
