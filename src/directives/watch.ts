import { getUniqID, kebabToCamel } from '../utils'
import { customDirectives } from './directives'
//import type { RedGin } from './redgin'

export type WatchExpression<T = any> = (this: T) => any

export const watch = (refs: string[], exp?: WatchExpression) => {
  const uniqId = getUniqID()
  const host = (window as any).__redgin_current_instance as any

  if (host) {
    for (let i = 0; i < refs.length; i++) {
      const prop = refs[i]
      let propWatchers = host._watchRegistry.get(prop)
      if (!propWatchers) {
        propWatchers = new Map()
        host._watchRegistry.set(prop, propWatchers)
      }
      propWatchers.set(uniqId, exp!)
    }
    host._idToProps.set(uniqId, refs)
  }

  return `<in-watch data-watch="${uniqId}"></in-watch>`
}

class InWatch extends HTMLElement {
  disconnectedCallback() {
    const uniqId = this.dataset.watch
    const host = this.getRootNode() as ShadowRoot
    const comp = host?.host as any
    if (uniqId && comp) comp._cleanupWatch(uniqId)
  }
}

if (!customElements.get('in-watch')) {
  customElements.define('in-watch', InWatch)
}

customDirectives.define(function watchFn(this: any, rawProp: string): boolean {
  const prop = kebabToCamel(rawProp)
  const propWatchers = this._watchRegistry.get(prop)
  if (!propWatchers || !propWatchers.size) return false

  let updated = false
  for (const [uniqId, expression] of propWatchers) {
    const el = this._watchElements.get(uniqId)
    if (!el) continue
    const value = expression ? expression.call(this) : (this as any)[prop]
    el.innerHTML = value ?? ''
    updated = true
  }
  return updated
})
