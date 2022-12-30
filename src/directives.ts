import { getUniqID } from './utils.js'
import { IElOptions, IPropReflect } from './interface.js'
import { profReflectRef, eventBus, divBus } from './state.js'



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


const buildElement = (ref: string[], type: any, exp: any, options?: IElOptions) => {
  const el = document.createElement(type)
  const uniqId = getUniqID()
  //divBus[uniqId] = exp ? exp : undefined
  for (const prop of ref) {
    if (!Object.hasOwn(divBus, prop))  divBus[prop] = {}
    divBus[prop][uniqId] = exp
  }

  if (options) {
    const { id, style, class: cls } = options;
    if (id) el.setAttribute('id', id)
    if (cls) el.setAttribute('class', cls)
    if (style) el.setAttribute('style', style)
  }

  //el.id = uniqId
  //el.dataset.bind__ = ref
  el.dataset.id__ = uniqId

  return el;

}

export const tags: any = {}

// @todo any way to get all element tags?
const HTML_TAGS = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b',
'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption',
'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 
'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure',
'footer', 'form', 'h1', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img',
'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 
'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 
'p', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 
'section', 'select', 'slot', 'small', 'source', 'span', 'strong', 'style', 'sub', 
'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th',
'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr' ];
for (const t of HTML_TAGS) {
  tags[t] = (ref: string[], exp: any, options?: IElOptions) => {
    return buildElement(ref, t, exp, options).outerHTML
  }
}

//export const propReflect = (value: any, options?: IPropReflect) => {
//  // propReflectRef
//  return { value, ...options, what: 'propReflect' }
//
//}


