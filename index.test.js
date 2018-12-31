import React from 'react'
import TestRenderer from 'react-test-renderer'
import renderTemplate from './'

// test component
const Link = ({ href, children }) => <a href={href}>{children}</a>

test('tokens are replaced', () => {
  const template = 'found {COUNT} instances of {TERM}'
  const tokenDict = { COUNT: 42, TERM: 'Presence' }
  expect(renderTemplate(template, tokenDict)).toBe(
    'found 42 instances of Presence'
  )
})
test('quotes are html-ified', () => {
  const template = 'found {COUNT} instances of {TERM}'
  const tokenDict = { COUNT: 42, TERM: '"Presence"' }
  expect(renderTemplate(template, tokenDict)).toBe(
    'found 42 instances of &quot;Presence&quot;'
  )
})

test('tokens are replaced, jsx value', () => {
  const template = 'found {COUNT} instances of {TERM} in the document'
  const tokenDict = {
    COUNT: 42,
    TERM: <Link href="/presence">Presence</Link>,
  }
  const expected = TestRenderer.create([
    'found 42 instances of ',
    <Link key={1} href="/presence">
      Presence
    </Link>,
    ' in the document',
  ])
  const result = TestRenderer.create(renderTemplate(template, tokenDict))
  expect(result.toJSON()).toEqual(expected.toJSON())
})

test('keys are added to jsx elements', () => {
  const template = 'found {COUNT} instances of {TERM}'
  const tokenDict = {
    COUNT: <Link href="/details">42</Link>,
    TERM: <Link href="/presence">Presence</Link>,
  }
  const result = TestRenderer.create(renderTemplate(template, tokenDict))
  const linkNodes = result.root.findAllByType(Link)
  expect(linkNodes.length).toBe(2)
  expect(linkNodes[0]._fiber.key).toEqual('0')
  expect(linkNodes[1]._fiber.key).toEqual('1')
})

test('handle undefined tokens', () => {
  const template = 'found {COUNT} instances of {TERM}'
  const tokenDict = { COUNT: 42 }
  expect(renderTemplate(template, tokenDict)).toBe(
    'found 42 instances of undefined'
  )
})
