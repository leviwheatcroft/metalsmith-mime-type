import {
  isString,
  keys
} from 'lodash'
import multimatch from 'multimatch'
import mmm from 'mmmagic'
import debug from 'debug'

const magic = new mmm.Magic(mmm.MAGIC_MIME_TYPE)
const dbg = debug('metalsmith-mime-type')

/**
 * ## default fn
 * this fn is exported as the module, designed to be called by `metalsmith#use`
 *
 * ```
 * .use(move(['*', '!*.jpg'])
 * ```
 *
 * @param {String|Array} pattern - one or more multimatch patterns
 */
export default function (pattern) {
  if (isString(pattern)) pattern = [ pattern ]
  return (files, metalsmith, done) => {
    const matches = multimatch(keys(files), pattern)
    const iterator = () => {
      const src = matches.shift()
      const meta = files[src]
      let contents = meta.contents
      if (typeof contents === 'string') {
        contents = new Buffer(contents)
      }
      if (contents instanceof Buffer) {
        magic.detect(contents, (err, mimeType) => {
          if (err) throw err
          meta.mimeType = mimeType
          dbg(`${src} > ${mimeType}`)
          if (matches.length) process.nextTick(iterator)
          else {
            done()
          }
        })
      } else {
        // dbg(meta)
        dbg(`${src} > no buffer`)
        if (matches.length) process.nextTick(iterator)
        else done()
      }
    }
    iterator()
  }
}
