# ZGZG bot

[![Powered by Wechaty](https://img.shields.io/badge/Powered%20By-Wechaty-brightgreen.svg)](https://github.com/Wechaty/wechaty)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## Requirements

- OS package

  - Ubuntu: `sudo apt-get install build-essential && sudo snap install shellcheck`
  - MacOS: `xcode-select --install`

- Python

  Python enviroment point to python2.7. I.E when you type python in terminal is
  version 2.7

- Application

  - Node.js V10

## Install

```bash
git clone git@github.com:zgzgorg/zgzg-bot.git
cd zgzg-bot
npm install
```

## Run

```bash
npm start
```

## Developer

You may need to ask for `.env` file that we use. Please contact
William Chen([williamc@zgzg.io](williamc@zgzg.io)).
_We recommended use VScode for development_

### Wechaty

We use package [Wechaty](https://github.com/wechaty/wechaty)

### Git push, Commit

We have pre-push, pre-commit, and commit-msg hook powered by
[husky](https://github.com/typicode/husky) and
[lint-staged](https://github.com/okonet/lint-staged)

If you want to skip these please pass git `--no-verify` flag into.

`git push` will automatically update the package version under `packages.json`

### Commit message

We use conventional commit message to make our contributor easy understand code
changes

information： [Commitlint](https://commitlint.js.org/),
[Converntion commit](https://www.conventionalcommits.org/en/v1.0.0/)

The commit message format:

```txt
{type}(scope?): {subject}
body?
footer?
```

Refer: <https://commitlint.js.org/#/concepts-commit-conventions>

#### Commit message type

refer to `.commitlintrc.yml`

```txt
chore:    Change build process, tooling or dependencies.
ci:       Changes to our CI configuration files and scripts
          (example scopes: Travis, Circle, BrowserStack, SauceLabs)
feat:     Adds a new feature.
add:      Adds a new function, class.
fix:      Solves a bug.
docs:     Adds or alters documentation.
style:    Improves formatting, white-space.
refactor: Rewrites code without feature, performance or bug changes.
perf:     Improves performance.
test:     Adds or modifies tests.
revert:   Changes that reverting other changes.
remove:   Remove package, code unused or no longer need.
del:      Delete package, code unused or no longer need (same with remove).
```
