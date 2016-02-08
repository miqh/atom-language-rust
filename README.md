# atom-language-rust

[![apm][apm-badge]][apm]
[![ci][ci-badge]][ci]

A package for [Atom][] that provides rudimentary lexing of source code
written in the [Rust][] programming language to support syntax highlighting.

## Motivation

I created this package due to the lack of updates and overall robustness of
another package with a similar aim of providing Rust grammar support.

At this time of writing, I'm still fairly green at Rust, which means developing
this package doubles up as an educational experience for me. I endeavour to
keep all grammar rules used by this package up to date with the latest stable
version of Rust!

## Roadmap

Things to expect:

- [x] Add ability to disable included styles
- [ ] Add some useful snippets
- [ ] Add grammar tests
- [ ] Add a list of all available scopes (for third-party styling purposes)

## Contributing

Details to follow once the source for this package reaches a stable state.

[apm]: https://atom.io/packages/atom-language-rust
[apm-badge]: https://img.shields.io/apm/v/atom-language-rust.svg?style=flat-square
[atom]: https://atom.io/
[ci]: https://travis-ci.org/miqid/atom-language-rust
[ci-badge]: https://img.shields.io/travis/miqid/atom-language-rust/master.svg?style=flat-square
[rust]: https://www.rust-lang.org/
