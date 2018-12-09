# atom-language-rust

[![apm][apm-badge]][apm]
[![ci][ci-badge]][ci]

An [Atom][] package that provides [Rust][] language grammar to facilitate
semantic syntax highlighting for a better code writing experience.

## Notice

[Atom 1.33][] bundles a new code parsing system for Rust which no longer
relies on TextMate-like grammar definitions. It also addresses shortcomings
with grammar scopes that cannot be easily defined because they are
contextually sensitive.

As such, I recommend disabling the `atom-language-rust` package in favour for
the enhanced syntax highlighting capabilities that this new parser provides.
However, the grammar this package provides could still be useful to other
text editors which use such a format. I will endeavour to keep it updated for
any noteworthy changes in the Rust language so long as they would not require
a complete rewrite of the existing grammar.

Thank you to everyone who has supported this package.

[apm]: https://atom.io/packages/atom-language-rust
[apm-badge]: https://img.shields.io/apm/v/atom-language-rust.svg?style=flat-square
[atom]: https://atom.io/
[atom 1.33]: https://blog.atom.io/2018/11/28/atom-1-33.html
[ci]: https://travis-ci.org/miqh/atom-language-rust
[ci-badge]: https://img.shields.io/travis/miqh/atom-language-rust/master.svg?style=flat-square
[rust]: https://www.rust-lang.org/
