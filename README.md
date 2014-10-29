# Padcef

> [PostCSS](https://github.com/postcss/postcss) plugin to parse and download CSS external fonts

The aim of this plugin is to avoid cache, compression and other problems of fonts provided by external servers.

## Installation

	$ npm install padcef


## Usage

```js
// dependencies
var fs = require("fs")
var postcss = require("postcss")
var padcef = require("padcef")

// css to be processed
var css = fs.readFileSync("input.css", "utf8")

// process css
var output = postcss()
  .use(padcef({
    dest: "my-fonts-folder"  // where external fonts are downloaded
  }))
  .process(css)
  .css
```

### Options

#### `dest` (default: `"external-fonts"`)

Download fonts in this folder.


## Todo

- new option: exclude
- new option: clean-dest
- new option: do not overwrite existing font files
- better tests (error handling test is missing)

## [License](LICENSE)