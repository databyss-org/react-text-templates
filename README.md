# react-text-templates

A simple library for rendering plaintext templates to React elements.

## Getting started

Install the library and import it:

```sh
yarn add react-text-templates
```

```js
import renderTemplate from 'react-text-templates'
renderTemplate(template, tokens)
```

### Basic example

Render a component inline in some text:

```js
import renderTemplate from 'react-text-templates'

const Link = ({ href, children }) => <a href={href}>{children}</a>

const template = 'We found {COUNT} instances of the term {TERM} in the article.'

const tokens = {
  COUNT: 4,
  TERM: <Link href="/term/presence">Presence</Link>,
}

export default () => <p>{renderTemplate(template, tokens)}</p>
```

If you rendered the exported component, it would produce the following DOM:

```html
<p>
  We found 42 instances of the term
  <Link href="/term/presence">Presence</Link>
  in the article.
</p>
```

### Why is this useful?

Many times, the `template` string in the example above would come from an external data store, like a database or CMS. With this library, we can define tokens of mixed type (string and jsx) and inject them into these external templates as if we were dealing with simple strings.
