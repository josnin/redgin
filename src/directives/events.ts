import { getUniqID } from '../utils.js'

const eventRef: any = []

enum EventListenType {
  ADD = 0,
  REMOVE = 1,
}

/*
 * placeholder 
 * <button ${ event('click', () => alert(1) ) }> ok </button>
*/
export const event = (type: string, fn: any) => {
  const uniq = getUniqID()
  eventRef.push([type, fn, uniq])
  return `data-evt__=${uniq}`
}

/*
 * emit.call(this, 'newItem', item)
 */
export function emit(this: any, customEvent: string, value: any){
  const event = new CustomEvent(customEvent, { detail: value, composed: true });
  if (this.shadowRoot) this.shadowRoot.dispatchEvent(event);
}


function baseEvent(this: any, etype: EventListenType) {
    // todo? update only with changes
    for (const e of eventRef) {
      const [evt, fn, id] = e
      if (this.shadowRoot) {
        let el: HTMLElement = this.shadowRoot.querySelector(`[data-evt__="${id}"]`)
        if (el) { // either to clear eventRef or add this?
          etype === EventListenType.ADD ? el.addEventListener(evt, fn) : el.removeEventListener(evt, fn)
        }
      }
    }

}


export function applyEventListeners(this: any) {
  baseEvent.call(this, EventListenType.ADD)
}

export function removeEventListeners(this: any) {
  baseEvent.call(this, EventListenType.REMOVE)
}
