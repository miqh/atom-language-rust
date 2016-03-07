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
        '#[test] // foo'
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
    });
  });

  describe('when tokenizing byte literals', () => {
    it('should detect a unicode value as invalid', () => {
      let tokens = grammar.tokenizeLines(
        "b'Δ'"
      );
      expect(tokens[0][1]).toEqual({
        scopes: [
          'source.rust',
          'string.quoted.single.byte.rust',
          'invalid.illegal.rust'
        ],
        value: 'Δ'
      });
    });
    it('should detect extra characters as invalid', () => {
      let tokens = grammar.tokenizeLines(
        "b'foo'"
      );
      expect(tokens[0][1]).toEqual({
        scopes: [
          'source.rust',
          'string.quoted.single.byte.rust',
          'invalid.illegal.rust'
        ],
        value: 'oo'
      });
    });
    it('should detect an unsupported escape as invalid', () => {
      let tokens = grammar.tokenizeLines(
        "b'\\a'"
      );
      expect(tokens[0][1]).toEqual({
        scopes: [
          'source.rust',
          'string.quoted.single.byte.rust',
          'invalid.illegal.rust'
        ],
        value: '\\a'
      });
    });
    it('should detect an unescaped quote as invalid', () => {
      let tokens = grammar.tokenizeLines(
        "b'''"
      );
      expect(tokens[0][1]).toEqual({
        scopes: [
          'source.rust',
          'string.quoted.single.byte.rust',
          'invalid.illegal.rust'
        ],
        value: '\''
      });
    });
  });

  describe('when tokenizing character literals', () => {
    it('should detect bad 8-bit escapes as invalid', () => {
      let tokens = grammar.tokenizeLines(
        `'\\xff'
        '\\xyz'`
      );
      expect(tokens[0][1]).toEqual({
        scopes: [
          'source.rust',
          'string.quoted.single.character.rust',
          'invalid.illegal.rust'
        ],
        value: '\\xff'
      });
      expect(tokens[1][2]).toEqual({
        scopes: [
          'source.rust',
          'string.quoted.single.character.rust',
          'invalid.illegal.rust'
        ],
        value: '\\xyz'
      });
    });
    it('should detect bad unicode escapes as invalid', () => {
      let tokens = grammar.tokenizeLines(
        `'\\u{110000}'
        '\\u{foo}'`
      );
      expect(tokens[0][1]).toEqual({
        scopes: [
          'source.rust',
          'string.quoted.single.character.rust',
          'invalid.illegal.rust'
        ],
        value: '\\u{110000}'
      });
      expect(tokens[1][2]).toEqual({
        scopes: [
          'source.rust',
          'string.quoted.single.character.rust',
          'invalid.illegal.rust'
        ],
        value: '\\u{foo}'
      });
    });
    it('should detect extra characters as invalid', () => {
      let tokens = grammar.tokenizeLines(
        "'foo'"
      );
      expect(tokens[0][1]).toEqual({
        scopes: [
          'source.rust',
          'string.quoted.single.character.rust',
          'invalid.illegal.rust'
        ],
        value: 'oo'
      });
    });
    it('should detect an unsupported escape as invalid', () => {
      let tokens = grammar.tokenizeLines(
        "'\\a'"
      );
      expect(tokens[0][1]).toEqual({
        scopes: [
          'source.rust',
          'string.quoted.single.character.rust',
          'invalid.illegal.rust'
        ],
        value: '\\a'
      });
    });
    it('should detect an unescaped quote as invalid', () => {
      let tokens = grammar.tokenizeLines(
        "'''"
      );
      expect(tokens[0][1]).toEqual({
        scopes: [
          'source.rust',
          'string.quoted.single.character.rust',
          'invalid.illegal.rust'
        ],
        value: '\''
      });
    });
  });

  describe('when tokenizing primitive casts', () => {
    it('should detect the as keyword', () => {
      let tokens = grammar.tokenizeLines(
        'foo as u32'
      );
      expect(tokens[0][1]).toEqual({
        scopes: [
          'source.rust',
          'keyword.other.rust'
        ],
        value: 'as'
      });
    });
  });

  describe('when tokenizing use statements', () => {
    it('should detect the use keyword', () => {
      let tokens = grammar.tokenizeLines(
        'use foo;'
      );
      expect(tokens[0][0]).toEqual({
        scopes: [
          'source.rust',
          'keyword.other.rust'
        ],
        value: 'use'
      });
    });
    it('should detect the as keyword', () => {
      let tokens = grammar.tokenizeLines(
        `use foo as bar;
        use baz::{qux as quux};`
      );
      expect(tokens[0][2]).toEqual({
        scopes: [
          'source.rust',
          'keyword.other.rust'
        ],
        value: 'as'
      });
      expect(tokens[1][3]).toEqual({
        scopes: [
          'source.rust',
          'keyword.other.rust'
        ],
        value: 'as'
      });
    });
  });

});
