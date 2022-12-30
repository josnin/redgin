import { getUniqID } from '../utils.js'

export var eventBus: any = []

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
    eventBus.push([e, fn, uniq])
    return `id=${uniq}`
  }
}
