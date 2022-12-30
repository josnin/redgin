import { getUniqID } from '../utils.js'
import { customDirectives } from './directives.js'

var watchRef: any = {}

class InWatch extends HTMLElement { }
customElements.define('in-watch', InWatch);

/*
 * watch element here
*/
export const watch = (ref: string[], exp: any) => {
  const el = document.createElement('in-watch')
  const uniqId = getUniqID()
  for (const prop of ref) {
    if (!Object.hasOwn(watchRef, prop))  watchRef[prop] = {}
    watchRef[prop][uniqId] = exp
  }

  el.dataset.id__ = uniqId

  return el.outerHTML;

}

/*
 * watch behavior here
*/
export const watchFn = (prop: string, _this: any) => {
    let withUpdate = false
    if (Object.hasOwn(watchRef, prop)) {
        for (const uniqId of Object.keys(watchRef[prop])) {
          if (_this.shadowRoot) {
            let el = _this.shadowRoot.querySelector(`[data-id__="${uniqId}"]`) 
            if (el) {
              el.innerHTML = watchRef[prop][uniqId] ? watchRef[prop][uniqId].call(_this) : _this[prop as keyof typeof _this]
              withUpdate = true
            }  
          }
      }
    }
    return withUpdate
}

// add watch behavior at core updateContent
customDirectives.define(watchFn)
