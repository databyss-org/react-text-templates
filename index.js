import React from 'react'

const escape = str =>
  typeof str === 'string'
    ? str.replace(new RegExp('"', 'g'), '&quot;')
    : str.toString()

export default (template, tokenDict) => {
  // "extract" tokens in template by splitting on token pattern
  //   so "you have {COUNT} friends in common with {NAME} "
  //   becomes ['you have', '{COUNT}', 'friends in common with', '{NAME}']
  const templateParts = template.split(/(\{.+?\})/)
  // loop over templateParts and replace tokens with corresponding values
  //   from tokenDict
  const keyRegex = /\{(.+?)\}/
  let jsxKeyCount = 0
  let foundJsx = false
  const renderedParts = templateParts.reduce((arr, part) => {
    if (!part.length) {
      return arr
    }
    if (!part.match(keyRegex)) {
      // part is plain string.
      return arr.concat(part)
    }
    const key = part.match(keyRegex)[1]
    const val = tokenDict[key]
    // if the value is not a string or number literal, we assume jsx
    if (typeof val !== 'string' && typeof val !== 'number') {
      foundJsx = true
      const jsxval = React.cloneElement(val, {
        key: jsxKeyCount,
      })
      jsxKeyCount += 1
      return arr.concat(jsxval)
    }
    // otherwise, treat it as a literal
    return arr.concat(escape(val))
  }, [])
  if (foundJsx) {
    // join consecutive string elements
    //   so ['you have ', '50', ' friends in common with', <Link href="/joe">Joe</Link>]
    //   becomes ['you have 50 friends in common with', <Link href="/joe">Joe</Link>]
    let strAccum = ''
    return renderedParts.reduce((arr, part) => {
      if (typeof part !== 'string') {
        if (!strAccum.length) {
          return arr.concat(part)
        }
        const flushedStr = strAccum
        strAccum = ''
        return arr.concat([flushedStr, part])
      }
      strAccum = strAccum.concat(part)
      return arr
    }, [])
  }
  return renderedParts.join('')
}
