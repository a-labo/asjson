/**
 * Covert into json files
 * @function asjson
 * @param {string} pattern - Glob file name pattern
 * @param {Object} [options] - Optional settings
 * @param {string} [options.cwd] - Current working directory path
 * @param {string} [options.out] - Output directory path
 * @returns {Promise}
 */
'use strict'

const co = require('co')
const aglob = require('aglob')
const writeout = require('writeout')
const path = require('path')

/** @lends asjson */
function asjson (pattern, options = {}) {
  let {
    cwd = process.cwd(),
    out = process.cwd(),
    indent = 2,
    ignore = []
  } = options

  return co(function * () {
    let filenames = yield aglob(pattern, { cwd, ignore })
    let generated = {}
    for (let filename of filenames) {
      let src = path.resolve(cwd, filename)
      let data = require(src)
      let dest = path.resolve(out, filename.replace(/\.js$/, '')) + '.json'
      let { skipped } = yield writeout(dest, JSON.stringify(data, null, indent), {
        mkdirp: true,
        skipIfIdentical: true
      })
      if (!skipped) {
        generated[ dest ] = data
      }
    }
    return generated
  })
}

module.exports = asjson
