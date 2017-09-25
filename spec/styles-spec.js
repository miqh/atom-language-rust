/** @babel */

describe('atom-language-rust', () => {

  const PACKAGE_NAME = 'atom-language-rust';
  const COLORS_CONFIG = `${PACKAGE_NAME}.colors`;
  const SCOPE_CASES = {
    attribute: '#[test]',
    documentation: '/// doc',
    lifetime: '\'static',
    macro: 'panic!()',
    parameter: 'fn foo(bar: i32) {}'
  };

  let textEditor = null;

  beforeEach(() => {
    waitsForPromise(() => atom.packages.activatePackage(PACKAGE_NAME));
    waitsForPromise(() => atom.workspace.open());
    runs(() => {
      const grammar = atom.grammars.grammarForScopeName('source.rust');
      textEditor = atom.workspace.getActiveTextEditor();
      textEditor.setGrammar(grammar);
    });
  });

  describe('when no custom colours are specified', () => {
    it('should apply the default colour', () => {
      for (let scope in SCOPE_CASES) {
        const color = atom.config.getSchema(`${COLORS_CONFIG}.${scope}`);
        textEditor.setText(SCOPE_CASES[scope]);
        jasmine.attachToDOM(textEditor.element);
        const lineElement = textEditor.element.querySelector(`.syntax--${scope}`);
        const computedColor = getComputedColor(lineElement);
        const defaultColor = hexToRgb(color.default);
        expect(computedColor).toEqual(defaultColor);
      }
    });
  });

  describe('when custom colours are specified', () => {
    const customColor = 'rgb(0, 0, 0)';
    beforeEach(() => {
      for (let scope in SCOPE_CASES) {
        atom.config.set(`${COLORS_CONFIG}.${scope}`, customColor);
      }
    });
    it('should apply the custom colour', () => {
      for (let scope in SCOPE_CASES) {
        textEditor.setText(SCOPE_CASES[scope]);
        jasmine.attachToDOM(textEditor.element);
        const lineElement = textEditor.element.querySelector(`.syntax--${scope}`);
        const computedColor = getComputedColor(lineElement);
        expect(computedColor).toEqual(customColor);
      }
    });
  });

});

/**
 * Helper function to return the `color` CSS property on a DOM element.
 */
function getComputedColor(element) {
  return window.getComputedStyle(element).getPropertyValue('color');
}

/**
 * Crude conversion of hexidecimal CSS colour values into a RGB format.
 *
 * Provided because retrieved computed colours in Atom are in RGB format.
 *
 * @param {string} hex Hexidecimal CSS colour value.
 * @return Input colour value in a RGB format (e.g. "rgb(1, 2, 3)").
 */
function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.replace(/(.)/g, '$1$1');
  }
  var i = parseInt(hex, 16);
  var r = (i >> 16) & 255;
  var g = (i >> 8) & 255;
  var b = i & 255;
  return `rgb(${r}, ${g}, ${b})`;
}
