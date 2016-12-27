import Metalsmith from 'metalsmith'
import assert from 'assert'
import mimeType from '../lib'
import lint from 'mocha-eslint'

lint(['lib/index.js'])

describe('metalsmith-mime-type', () => {
  it('should be able to detect mime types', (done) => {
    Metalsmith('test/fixtures')
    .use(mimeType('*'))
    .build((err, files) => {
      if (err) return done(err)
      assert.equal(files['one.html'].mimeType, 'text/html')
      assert.equal(files['287.jpg'].mimeType, 'image/jpeg')
      done()
    })
  })
})
