'use babel';

import { CompositeDisposable } from 'atom';
import fs from 'fs';
import path from 'path';

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
        default: true
      }
    };
    this.package = atom.packages.getLoadedPackage('atom-language-rust');
    this.stylesPath = [
      this.package ? this.package.path : '', 'styles', 'rust.less'
    ].join(path.sep);
    this.subscriptions = new CompositeDisposable;
  }
  activate(state) {
    this.subscriptions.add(
      atom.config.observe(
        'atom-language-rust.styles', (this.onToggleStyles).bind(this)
      )
    );
  }
  deactivate() {
    this.subscriptions.dispose();
    this.subscriptions = null;
  }
  onToggleStyles(enabled) {
    if (!enabled) {
      let styleElement;
      atom.styles.getStyleElements().some(el => {
        if (el.sourcePath.indexOf(this.stylesPath) === -1) return false;
        styleElement = el;
        return true;
      });
      if (styleElement) {
        atom.styles.removeStyleElement(styleElement);
      } else {
        atom.notifications.addWarning(
          'atom-language-rust could not find its package styles to remove'
        );
      }
      return;
    }
    let styles;
    try {
      styles = fs.readFileSync(this.stylesPath);
    } catch (e) {
      atom.notifications.addFatalError(
        'atom-language-rust failed to read its package styles file\n' +
        e.message
      );
    }
    atom.styles.addStyleSheet(styles, {
      priority: 0,
      sourcePath: this.stylesPath
    });
    this.package.reloadStylesheets();
  }
}

export default Rust;
