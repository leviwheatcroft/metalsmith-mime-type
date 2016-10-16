'use strict'
const _           = require('lodash')
const multimatch  = require('multimatch')
const async       = require('async')
const mmm         = require('mmmagic')
const debug       = require('debug')('mimeType')


/**
 * getPlugin
 *
 * this fn is exported as the module, designed to be called by `metalsmith#use`
 *
 * ```
 * .use(move('*.html')
 * ```
 *
 * @param {String|Object} Options - if string, will be used as file mask
 * @param {String} Options.src - if provided, will be used as file mask
 */
let getPlugin = function(src) {
  if (_.isObject(src) && _.has(src, 'src')) src = src.src

  let magic = new mmm.Magic(mmm.MAGIC_MIME_TYPE)

  return (files, metalsmith, done) => {

    async.eachSeries(multimatch(_.keys(files), src), (path, done) => {
      magic.detect(files[path].contents, (err, result) => {
        if (err) throw err
        files[path].mimeType = result
        debug(path + ' > ' + result)
        done()
      })
    })

    done()
  }
}


// export
module.exports = getPlugin
