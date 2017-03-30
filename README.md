# atom-language-rust

[![apm][apm-badge]][apm]
[![ci][ci-badge]][ci]

An [Atom][] package that provides [Rust][] language grammar to facilitate
semantic syntax highlighting for a better code writing experience.

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

### Package Settings

Once this package is installed, use the _Settings_ button to access its
configuration options.

Use the _Additional Styles_ option to enable or disable the styles provided
by this package. If you wish to override the default colours provided for
any of the Rust language constructs listed, simply provide a colour value.
It is worthwhile noting that colour values can be in CSS format.

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

See [CONTRIBUTING].

## Q&A

- [Why is ... not given a grammar scope for styling?][Q1]
- [Why are the styles set through this package not taking effect?][Q2]
- [Why does this grammar package even offer styling?][Q3]

[Q1]: #why-is--not-given-a-grammar-scope-for-styling
[Q2]: #why-are-the-styles-set-through-this-package-not-taking-effect
[Q3]: #why-does-this-grammar-package-even-offer-styling

### Why is ... not given a grammar scope for styling?

If the item in question is being highlighted in one pattern of code and not in
another then it is likely a bug. I would very much appreciate these being
reported so that they can be fixed up.

For those not familiar with how most language grammar packages work in Atom,
they leverage the [`first-mate`][first-mate] package in order to provide
grammar scopes for syntax themes to use. In a nutshell, this package simply
takes a whole bunch of grammar match rules (i.e. regular expressions) and
applies it to a source file. I must stress that this is not the same as a
native language parser. As such, there are some things that are extremely
difficult (or quite plainly impossible in my opinion) to write match rules for.
An example of this would be highlighting the names of all user-defined traits,
wherever they occur. Without a Rust language parser module, such a task would
be madness.

### Why are the styles set through this package not taking effect?

This package is at the mercy of any other package in the Atom ecosystem that
decides to hijack grammar styles. I surmise the majority of these offenders
would be syntax theme packages.

At present, there is not any option to force precedence of the styles contained
in this package, but I may have a work around which might be rolled into a
future release.

### Why does this grammar package even offer styling?

In short, convenience.

As far as I am aware, Atom offers no guidance on scope names that grammar
packages are allowed to define. Consequently, this makes the lives of syntax
theme package creators difficult. The onus is on them to ensure their package
styles cover all custom scope names defined by a particular language grammar.

By providing styles along with this package, syntax theme packages that do not
explicitly style all provided scope names will still have syntax highlighting
for Rust language constructs not covered. This is the aforementioned
convenience. I do not expect every syntax theme package out there to account
for the Rust language.

Styles included in this package are enabled by default. If your syntax theme
package of choice covers the grammar of this package, you can opt out of
the included styles by disabling them via package settings.

[apm]: https://atom.io/packages/atom-language-rust
[apm-badge]: https://img.shields.io/apm/v/atom-language-rust.svg?style=flat-square
[atom]: https://atom.io/
[changelog]: CHANGELOG.md
[contributing]: CONTRIBUTING.md
[ci]: https://travis-ci.org/miqid/atom-language-rust
[ci-badge]: https://img.shields.io/travis/miqid/atom-language-rust/master.svg?style=flat-square
[first-mate]: https://atom.github.io/first-mate/
[rust]: https://www.rust-lang.org/
[rust documentation]: https://doc.rust-lang.org/book/documentation.html
