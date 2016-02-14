# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning][].

## [0.3.0][] - 2016-02-14

### Adds
- Integration with Travis CI
- Basic test specifications for attributes.
- Ability to toggle and configure styles for extended grammar.
- Match rules for macros grammar.
- Parameter matching for `where` clauses.

### Changes

- Parameter and lifetime matching to be more robust.

## [0.2.0][] - 2016-02-06

### Adds
- Match rules for hexadecimal, octal and binary literals.
- A project change log.

### Changes
- Attribute matching to be more flexible.
- Byte, character and string literal matching to be more flexible and to
  also mark invalid values.
- Auto-indentation settings to be more user friendly.

### Fixes
- Incorrect matching of namespace paths as function parameters.

## 0.1.0 - 2016-01-31

### Adds
- Initial project files.

[0.3.0]: https://github.com/miqid/atom-language-rust/compare/0.2.0...0.3.0
[0.2.0]: https://github.com/miqid/atom-language-rust/compare/0.1.0...0.2.0
[Semantic Versioning]: http://semver.org/
