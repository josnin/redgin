// events.ts
import { getUniqID } from '../utils'

export type EventHandler = (this: any, e: any) => any

export const event = (type: string, fn: EventHandler) => {
  const uniq = getUniqID()
  const host = (window as any).__redgin_current_instance as any

  // store the handler in host if available
  if (host) {
    if (!host._eventRegistry) host._eventRegistry = new Map<string, [string, EventHandler]>()
    host._eventRegistry.set(uniq, [type, fn])
  }

  // returns attribute for template
  return `rg-evt__${type}="${uniq}"`
}

/**
 * Alias for 'event'. Moving forward, use 'on' for a more 
 * declarative feel (e.g., on('click', ...))
 */
export const on = event 

/*
 * emit.call(this, 'newItem', item)
 */
export function emit(this: any, customEvent: string, value: any, options?: CustomEvent){
  const defaults = {
    detail: value,
    composed: true,
  };
  //const event = new CustomEvent(customEvent, { detail: value, composed: true });
  const event = new CustomEvent(customEvent, { ...defaults, ...options });
  if (this.shadowRoot) this.shadowRoot.dispatchEvent(event);
}


/**
 * Attach all events for this component
 */
export function applyEventListeners(this: any) {
  if (!this._eventElements || !this._eventRegistry) return
  //console.log('does it goes here')
  //console.log('with eventElements?', this._evenElements)
  //console.log('w eventRegistry', this._eventRegistry)

  for (const [uniq, el] of this._eventElements) {
    const handler = this._eventRegistry.get(uniq)
    if (!handler) continue
    const [type, fn] = handler
    el.addEventListener(type, fn)
  }
}

/**
 * Remove all events for this component
 */
export function removeEventListeners(this: any) {
  if (!this._eventElements || !this._eventRegistry) return

  for (const [uniq, el] of this._eventElements) {
    const handler = this._eventRegistry.get(uniq)
    if (!handler) continue
    const [type, fn] = handler
    el.removeEventListener(type, fn)
  }
}
