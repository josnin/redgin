import { getUniqID, kebabToCamel } from '../utils.js'
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
export function watchFn(this: any, _prop: string){
    const prop = kebabToCamel(_prop) // attr is kebab , props in camel case
    let withUpdate = false
    if (Object.hasOwn(watchRef, prop)) {
        for (const uniqId of Object.keys(watchRef[prop])) {
          if (this.shadowRoot) {
            let el = this.shadowRoot.querySelector(`[data-id__="${uniqId}"]`) 
            if (el) {
              el.innerHTML = watchRef[prop][uniqId] ? watchRef[prop][uniqId].call(this) : this[prop as keyof typeof this]
              withUpdate = true
            }  
          }
      }
    }
    return withUpdate
}

// add watch behavior at core updateContent
customDirectives.define(watchFn)
