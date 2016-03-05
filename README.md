# atom-language-rust

[![apm][apm-badge]][apm]
[![ci][ci-badge]][ci]

An [Atom][] package that provides [Rust][] language grammar to facilitate
custom syntax highlighting for a better code writing experience.

## Usage

With Atom open, this package can be easily installed by opening up
_Settings View_, clicking on the _Install_ tab that appears, searching for
this package name (i.e. `atom-language-rust`) and clicking the _Install_
button in the corresponding package result.

If you prefer installation via console, enter the following command:

```
apm install atom-language-rust
```

Remember to stay updated with the latest version, which might contain fixes
or even new shinier features.

## Motivation

Development of this package started due to lack of updates and fixes being
contributed to another package I was originally using to write Rust code in
Atom. As Rust is still a flourishing language, I endeavour to keep this
package updated with any notable changes to the language.

## Features

- **Custom Syntax Highlighting:** There are many additional language constructs
  in Rust that are not semantically covered by standard grammar scopes for
  styling various pieces of syntax. Consequently, a limited colour palette
  makes it difficult for easily distinguishing between language constructs.
  This package adds a whole bunch of custom grammar scopes, which provides
  the option of assigning custom colours to functionally similar groups of
  language constructs. The best part is that colour configurations should be
  reflected immediately and do not require Atom to be restarted!
- **Markdown:** Since [Rust documentation] blocks are written in Markdown,
  this package also includes custom grammar scopes, based loosely off GitHub
  flavoured Markdown, to style Markdown constructs. This is an attempt to make
  documentation appearing alongside code more pleasant to read.

See [CHANGELOG] for more information.

## Contributing

Details to follow once the source for this package reaches a stable state.

[apm]: https://atom.io/packages/atom-language-rust
[apm-badge]: https://img.shields.io/apm/v/atom-language-rust.svg?style=flat-square
[atom]: https://atom.io/
[changelog]: CHANGELOG.md
[ci]: https://travis-ci.org/miqid/atom-language-rust
[ci-badge]: https://img.shields.io/travis/miqid/atom-language-rust/master.svg?style=flat-square
[rust]: https://www.rust-lang.org/
[rust documentation]: https://doc.rust-lang.org/book/documentation.html
