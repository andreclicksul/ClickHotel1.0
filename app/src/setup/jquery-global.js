import jquery from 'jquery'

const globalObject = typeof globalThis !== 'undefined'
  ? globalThis
  : typeof window !== 'undefined'
    ? window
    : undefined

if (globalObject) {
  globalObject.$ = jquery
  globalObject.jQuery = jquery
}

export default jquery
