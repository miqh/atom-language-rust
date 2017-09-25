/** @babel */

import dedent from 'dedent-js';

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
        '#![plugin(foo)] #[cfg(any(bar, baz), qux)] #[inline]'
      );
      expect(tokens[0][0]).toEqual({
        scopes: ['source.rust', 'meta.attribute.rust'],
        value: '#!['
      });
      expect(tokens[0][2]).toEqual({
        scopes: ['source.rust', 'meta.attribute.rust'],
        value: ']'
      });
      expect(tokens[0][4]).toEqual({
        scopes: ['source.rust', 'meta.attribute.rust'],
        value: '#['
      });
      expect(tokens[0][6]).toEqual({
        scopes: ['source.rust', 'meta.attribute.rust'],
        value: ']'
      });
      expect(tokens[0][8]).toEqual({
        scopes: ['source.rust', 'meta.attribute.rust'],
        value: '#['
      });
      expect(tokens[0][10]).toEqual({
        scopes: ['source.rust', 'meta.attribute.rust'],
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
        scopes: ['source.rust', 'meta.attribute.rust'],
        value: '#!['
      });
      expect(tokens[2][5]).toEqual({
        scopes: ['source.rust', 'meta.attribute.rust'],
        value: ']'
      });
    });
    it('should detect trailing one-line comments', () => {
      let tokens = grammar.tokenizeLines(
        '#[test] // foo'
      );
      expect(tokens[0][0]).toEqual({
        scopes: ['source.rust', 'meta.attribute.rust'],
        value: '#['
      });
      expect(tokens[0][2]).toEqual({
        scopes: ['source.rust', 'meta.attribute.rust'],
        value: ']'
      });
      expect(tokens[0][4]).toEqual({
        scopes: ['source.rust', 'comment.line.rust'],
        value: '// foo'
      });
    });
    it('should detect literal values', () => {
      let tokens = grammar.tokenizeLines(
        '#![crate_type = "lib"]'
      );
      expect(tokens[0][0]).toEqual({
        scopes: ['source.rust', 'meta.attribute.rust'],
        value: '#!['
      });
      expect(tokens[0][3]).toEqual({
        scopes: [
          'source.rust', 'meta.attribute.rust', 'string.quoted.double.rust'
        ],
        value: 'lib'
      });
      expect(tokens[0][5]).toEqual({
        scopes: ['source.rust', 'meta.attribute.rust'],
        value: ']'
      });
    });
  });

  describe('when tokenizing byte literals', () => {
    it('should detect some valid escapes', () => {
      let tokens = grammar.tokenizeLines(
        "b'\\xff' b'\\n' b'\\0' b'\\'' b'\\\\'"
      );
      let scopes = [
        'source.rust',
        'string.quoted.single.byte.rust',
        'constant.character.escape.rust'
      ];
      expect(tokens[0][1]).toEqual({scopes, value: '\\xff'});
      expect(tokens[0][5]).toEqual({scopes, value: '\\n'});
      expect(tokens[0][9]).toEqual({scopes, value: '\\0'});
      expect(tokens[0][13]).toEqual({scopes, value: "\\'"});
      expect(tokens[0][17]).toEqual({scopes, value: '\\\\'});
    });
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
    it('should detect some valid escapes', () => {
      let tokens = grammar.tokenizeLines(
        "'\\u{10ffff}' '\\x7f' '\\n' '\\0' '\\'' '\\\\'"
      );
      let scopes = [
        'source.rust',
        'string.quoted.single.character.rust',
        'constant.character.escape.rust'
      ];
      expect(tokens[0][1]).toEqual({scopes, value: '\\u{10ffff}'});
      expect(tokens[0][5]).toEqual({scopes, value: '\\x7f'});
      expect(tokens[0][9]).toEqual({scopes, value: '\\n'});
      expect(tokens[0][13]).toEqual({scopes, value: '\\0'});
      expect(tokens[0][17]).toEqual({scopes, value: "\\'"});
      expect(tokens[0][21]).toEqual({scopes, value: '\\\\'});
    });
    it('should detect bad 8-bit escapes as invalid', () => {
      let tokens = grammar.tokenizeLines(
        "'\\xff' '\\xyz'"
      );
      let scopes = [
        'source.rust',
        'string.quoted.single.character.rust',
        'invalid.illegal.rust'
      ];
      expect(tokens[0][1]).toEqual({scopes, value: '\\xff'});
      expect(tokens[0][5]).toEqual({scopes, value: '\\xyz'});
    });
    it('should detect bad unicode escapes as invalid', () => {
      let tokens = grammar.tokenizeLines(
        "'\\u{110000}' '\\u{foo}'"
      );
      let scopes = [
        'source.rust',
        'string.quoted.single.character.rust',
        'invalid.illegal.rust'
      ];
      expect(tokens[0][1]).toEqual({scopes, value: '\\u{110000}'});
      expect(tokens[0][5]).toEqual({scopes, value: '\\u{foo}'});
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

  describe('when tokenizing comments', () => {
    it('should detect single-line nested comment blocks', () => {
      let tokens = grammar.tokenizeLines(
        '/* outer /* inner */ */'
      );
      let outerScopes = [
        'source.rust',
        'comment.block.rust'
      ];
      let innerScopes = [
        'source.rust',
        'comment.block.rust',
        'comment.block.rust'
      ];
      expect(tokens[0][0]).toEqual({scopes: outerScopes, value: '/*'});
      expect(tokens[0][2]).toEqual({scopes: innerScopes, value: '/*'});
      expect(tokens[0][4]).toEqual({scopes: innerScopes, value: '*/'});
      expect(tokens[0][6]).toEqual({scopes: outerScopes, value: '*/'});
    });
    it('should detect multi-line nested comment blocks', () => {
      let tokens = grammar.tokenizeLines(`
        /* outer
          /* inner
          */
        */
      `);
      let outerScopes = [
        'source.rust',
        'comment.block.rust'
      ];
      let innerScopes = [
        'source.rust',
        'comment.block.rust',
        'comment.block.rust'
      ];
      expect(tokens[1][1]).toEqual({scopes: outerScopes, value: '/*'});
      expect(tokens[2][1]).toEqual({scopes: innerScopes, value: '/*'});
      expect(tokens[3][1]).toEqual({scopes: innerScopes, value: '*/'});
      expect(tokens[4][1]).toEqual({scopes: outerScopes, value: '*/'});
    });
    it('should detect unclosed single-line nested comment blocks', () => {
      let tokens = grammar.tokenizeLines(
        '/* outer /* inner */code'
      );
      expect(tokens[0][5]).toEqual({
        scopes: [
          'source.rust',
          'comment.block.rust'
        ],
        value: 'code'
      });
    });
    it('should detect unclosed multi-line nested comment blocks', () => {
      let tokens = grammar.tokenizeLines(`
        /* outer
          /* inner
          */code
      `);
      expect(tokens[3][2]).toEqual({
        scopes: [
          'source.rust',
          'comment.block.rust'
        ],
        value: 'code'
      });
    });
  });

  describe('when tokenizing macro definitions', () => {
    it('should detect the name of those using brackets', () => {
      let tokens = grammar.tokenizeLines(
        'macro_rules! ok(($expr:expr) => ($expr.unwrap()));'
      );
      expect(tokens[0][0]).toEqual({
        scopes: [
          'source.rust',
          'meta.macro.rust',
          'support.other.macro.rust'
        ],
        value: 'macro_rules!'
      });
      expect(tokens[0][2]).toEqual({
        scopes: [
          'source.rust',
          'meta.macro.rust',
          'entity.name.function.rust'
        ],
        value: 'ok'
      });
    });
    it('should detect the name of those using curly braces', () => {
      let tokens = grammar.tokenizeLines(dedent`
        macro_rules! ok {
          ($expr:expr) => ($expr.unwrap()));
        }`);
      expect(tokens[0][0]).toEqual({
        scopes: [
          'source.rust',
          'meta.macro.rust',
          'support.other.macro.rust'
        ],
        value: 'macro_rules!'
      });
      expect(tokens[0][2]).toEqual({
        scopes: [
          'source.rust',
          'meta.macro.rust',
          'entity.name.function.rust'
        ],
        value: 'ok'
      });
    });
  });

  describe('when tokenizing macro invocations', () => {
    it('should not detect keywords part of expressions', () => {
      let tokens = grammar.tokenizeLines(
        'if !(a && b) {} match !(a) {_ => ()}'
      );
      expect(tokens[0][0]).toEqual({
        scopes: [
          'source.rust',
          'keyword.control.rust'
        ],
        value: 'if'
      });
      expect(tokens[0][12]).toEqual({
        scopes: [
          'source.rust',
          'keyword.control.match.rust'
        ],
        value: 'match'
      });
    });
    it('should terminate named function argument usages', () => {
      let tokens = grammar.tokenizeLines(
        'smart_macro!{ fn foo() -> bool }'
      );
      expect(tokens[0][13]).toEqual({
        scopes: ['source.rust', 'punctuation.symbol.rust'],
        value: '}'
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
      expect(tokens[1][6]).toEqual({
        scopes: [
          'source.rust',
          'keyword.other.rust'
        ],
        value: 'as'
      });
    });
  });

  describe('when tokenizing where clauses', () => {
    it('should detect those beginning on new lines', () => {
      let tokens = grammar.tokenizeLines(`
        fn foo<T>(x: T)
          where T: Clone {}
      `);
      expect(tokens[2][1]).toEqual({
        scopes: [
          'source.rust',
          'meta.function.rust',
          'keyword.other.rust'
        ],
        value: 'where'
      });
    });
  });

  describe('when tokenizing untagged unions', () => {
    const unionKeywordToken = {
      scopes: [
        'source.rust',
        'meta.union.rust',
        'storage.type.rust'
      ],
      value: 'union'
    };
    it('should only detect single line declarations', () => {
      let tokens = grammar.tokenizeLines(dedent`
        union Foo {}
      `);
      expect(tokens[0][0]).toEqual(unionKeywordToken);
      expect(tokens[0][2]).toEqual({
        scopes: [
          'source.rust',
          'meta.union.rust',
          'entity.name.type.union.rust'
        ],
        value: 'Foo'
      });
    });
    describe('for backward compatibility', () => {
      it('should not detect variable binding usages', () => {
        let tokens = grammar.tokenizeLines(dedent`
          let union = true;
        `);
        expect(tokens[0][1]).not.toEqual(unionKeywordToken);
      });
      it('should not detect name usages', () => {
        let tokens = grammar.tokenizeLines(dedent`
          union;
          union as u32;
          union();
        `);
        expect(tokens[0][0]).not.toEqual(unionKeywordToken);
        expect(tokens[1][0]).not.toEqual(unionKeywordToken);
        expect(tokens[2][0]).not.toEqual(unionKeywordToken);
      });
      it('should not detect names of other declarations', () => {
        let tokens = grammar.tokenizeLines(dedent`
          fn union() {}
          struct union {}
        `);
        expect(tokens[0][2]).not.toEqual(unionKeywordToken);
        expect(tokens[1][2]).not.toEqual(unionKeywordToken);
      });
    });
  });

  describe('when toggling comments in the editor', () => {
    it('should toggle the entire line the cursor is on', () => {
      let editor = atom.workspace.buildTextEditor();
      let buffer = editor.getBuffer();
      let text = 'comment this out';
      editor.setGrammar(grammar);
      buffer.setText(text);
      // Position cursor before the 'this' word
      editor.getLastCursor().setBufferPosition([0, 9]);
      editor.toggleLineCommentsInSelection();
      expect(buffer.getText()).toEqual('// comment this out');
      editor.toggleLineCommentsInSelection();
      expect(buffer.getText()).toEqual(text);
    });
    it('should toggle all lines with at least one character selected', () => {
      let editor = atom.workspace.buildTextEditor();
      let buffer = editor.getBuffer();
      // Multi-line strings will mess with comment indentation
      let text = 'comment this out\ncomment this out\ncomment this out';
      editor.setGrammar(grammar);
      buffer.setText(text);
      // Select all text starting at the 'this' word on the first row to the
      // 'this' word on the third row
      editor.setSelectedBufferRange([[0, 9], [2, 9]]);
      editor.toggleLineCommentsInSelection();
      expect(buffer.getText()).toEqual(
        '// comment this out\n// comment this out\n// comment this out'
      );
      editor.toggleLineCommentsInSelection();
      expect(buffer.getText()).toEqual(text);
    });
  });

});
