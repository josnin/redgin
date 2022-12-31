import { getUniqID } from '../utils.js'

var eventRef: any = []
enum EventListenType {
  ADD = 0,
  REMOVE = 1,
}

// placeholder only?
export const events: any = {}
// @todo any way to get all event attributes?
const EVENT_ATTRS = ['afterprint', 'beforeprint', 'beforeunload', 'error', 'hashchange',
'load', 'message', 'offline', 'online', 'pagehide', 'pageshow', 'popstate', 'resize',
'storage', 'unload', 'blur', 'change', 'contextmenu', 'focus', 'input', 'invalid', 'reset',
'search', 'select', 'submit', 'keydown', 'keypress', 'keyup', 'click', 'dblclick', 'mousedown',
'mousemove', 'mouseout', 'mouseover', 'mouseup', 'mousewheel', 'wheel', 'drag', 'dragend', 
'dragenter', 'dragleave', 'dragover', 'dragstart', 'drop', 'scroll', 'copy', 'cut', 'paste',
'abort', 'canplay', 'canplaythrough', 'cuechange', 'durationchange', 'emptied', 'ended', 'loadeddata', 
'loadedmetadata', 'loadstart', 'pause', 'play', 'playing', 'progress', 'ratechange', 'seeked',
'seeking', 'onstalled', 'suspend', 'timeupdate', 'volumechange', 'waiting', 'toggle'] ;
for (const e of EVENT_ATTRS) {
  events[e] = (fn: any) => {
    const uniq = getUniqID()
    eventRef.push([e, fn, uniq])
    return `data-evt__=${uniq}`
    //return `id=${uniq}`
  }
}


function baseEvent(this: any, etype: EventListenType) {
    // todo? update only with changes
    for (const e of eventRef) {
      const [evt, fn, id] = e
      if (this.shadowRoot) {
        let el: HTMLElement = this.shadowRoot.querySelector(`[data-evt__="${id}"]`)
        //el.addEventListener(evt, fn)
        etype === EventListenType.ADD ? el.addEventListener(evt, fn) : el.removeEventListener(evt, fn)
      }
    }

}


export function applyEventListeners(this: any) {
  baseEvent.call(this, EventListenType.ADD)
}

export function removeEventListeners(this: any) {
  baseEvent.call(this, EventListenType.REMOVE)
}
