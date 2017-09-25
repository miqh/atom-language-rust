/** @babel */

import { CompositeDisposable } from 'atom';
import fs from 'fs';
import path from 'path';

const PACKAGE_NAME = 'atom-language-rust';
const CONFIG = {
  STYLES: PACKAGE_NAME + '.styles',
  COLORS: PACKAGE_NAME + '.colors'
};
const STYLES_REGEX = {
  ATTRIBUTE: /(@syntax-color-attribute:\s+)[^;]+/,
  DOCUMENTATION: /(@syntax-color-documentation:\s+)[^;]+/,
  LIFETIME: /(@syntax-color-lifetime:\s+)[^;]+/,
  MACRO: /(@syntax-color-macro:\s+)[^;]+/,
  PARAMETER: /(@syntax-color-parameter:\s+)[^;]+/,
  TOKEN: /(@syntax-color-token:\s+)[^;]+/g
};

class Rust {
  constructor() {
    this.config = {
      styles: {
        title: 'Additional Styles',
        description:
          `Provides additional styles to assist with distinguishing between
          Rust language constructs. This is made possible by taking advantage
          of non-standard scope names defined by the grammar in this package.`,
        type: 'boolean',
        default: true,
        order: 0
      },
      colors: {
        title: 'Custom Colors',
        type: 'object',
        properties: {
          attribute: {
            title: 'Attributes',
            type: 'string',
            default: ''
          },
          documentation: {
            title: 'Documentation',
            description:
              `Base color used by documentation blocks. The color of each
              supported Markdown construct is derived from it.`,
            type: 'string',
            default: ''
          },
          lifetime: {
            title: 'Lifetimes',
            type: 'string',
            default: ''
          },
          macro: {
            title: 'Macros',
            type: 'string',
            default: ''
          },
          parameter: {
            title: 'Parameters',
            type: 'string',
            default: ''
          },
          token: {
            title: 'Tokens',
            description: 'Base color applied to all symbols and operators.',
            type: 'string',
            default: ''
          }
        },
        order: 1
      }
    };
  }
  activate() {
    this.styles = this.loadStylesFile();
    this.readDefaultColors();
    this.subscriptions = new CompositeDisposable;
    this.subscriptions.add(
      atom.config.observe(CONFIG.STYLES, (this.onToggleStyles).bind(this)),
      atom.config.observe(CONFIG.COLORS, (this.onEditColors).bind(this))
    );
  }
  deactivate() {
    this.subscriptions.dispose();
    this.subscriptions = null;
  }
  onEditColors(colors) {
    // Block style reloading attempts if additional styles is disabled
    if (!atom.config.get(CONFIG.STYLES)) return;
    this.reloadStyles(colors);
  }
  onToggleStyles(enabled) {
    if (!enabled) {
      let styleElement = atom.styles.styleElementsBySourcePath[this.stylesPath];
      atom.styles.removeStyleElement(styleElement);
      if (!styleElement) {
        atom.notifications.addWarning(
          PACKAGE_NAME + ' could not find its package styles to remove'
        );
      }
      return;
    }
    this.reloadStyles(atom.config.get(CONFIG.COLORS));
  }
  loadStylesFile() {
    let pkg = atom.packages.getLoadedPackage(PACKAGE_NAME);
    if (!pkg) {
      atom.notifications.addFatalError(
        PACKAGE_NAME + ' failed to locate its own package instance'
      );
      return;
    }
    this.stylesPath = [pkg.path, 'styles', 'rust.less'].join(path.sep);
    let styles;
    try {
      styles = fs.readFileSync(this.stylesPath, {
        encoding: 'utf8'
      });
    } catch (e) {
      atom.notifications.addFatalError(
        PACKAGE_NAME + ' failed to read its package styles file\n' +
        e.message
      );
    }
    return styles;
  }
  readDefaultColors() {
    let styles = atom.themes.lessCache.cssForFile(this.stylesPath, this.styles);
    let colors = atom.config.getSchema(CONFIG.COLORS);
    for (let item in STYLES_REGEX) {
      item = item.toLowerCase();
      // Using a proper CSS parser here would be less brittle but overkill
      let regex = new RegExp(`syntax--${item}(?:(?!color:)[^:])+color:\\s*([^;]+)`);
      let match = styles.match(regex);
      if (!match) continue;
      colors.properties[item].default = match[1];
    }
    atom.config.setSchema(CONFIG.COLORS, colors);
  }
  reloadStyles(colors) {
    // Operate on a copy of the uncompiled base styles
    let styles = this.styles;
    for (let item in colors) {
      if (colors[item] === '') continue;
      styles = styles.replace(
        STYLES_REGEX[item.toUpperCase()], '$1' + colors[item]
      );
    }
    try {
      styles = atom.themes.lessCache.cssForFile(this.stylesPath, styles);
    } catch (e) {
      // Suppress errors that might be caused by trying to compile invalid
      // input color values and return immediately without updating styles
      return;
    }
    atom.styles.addStyleSheet(styles, {
      priority: 0,
      sourcePath: this.stylesPath
    });
  }
}

export default Rust;
