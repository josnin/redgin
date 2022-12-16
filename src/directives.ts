import { getUniqID } from './utils.js'
import { IElOptions } from './interface.js'
import { divBus, eventBus } from './state.js'



export const click = (event: any) => {
  const uniq = getUniqID()
  eventBus.push(['click', event, uniq])
  return `id=${ uniq }`
}


const buildElement = (ref: string, type: any, exp: string, options?: IElOptions) => {
  const el = document.createElement(type)
  const uniqId = getUniqID()
  divBus[uniqId] = exp ? exp : undefined

  if (options) {
    const { id, style, class: cls } = options;
    if (id) el.setAttribute('id', id)
    if (cls) el.setAttribute('class', cls)
    if (style) el.setAttribute('style', style)
  }

  el.dataset.id__ = uniqId
  el.dataset.bind__ = ref

  return el;

}

const fnTags: any = {}

// most used tags?
const HTML_TAGS = ['a', 'b', 'strong', 'br', 'div', 'h1', 'i', 'img', 'ol', 
'ul', 'li', 'p', 'span', 'select', 'option'];
for (const tag of HTML_TAGS) {
  fnTags[tag] = (ref: string, exp?: any, options?: IElOptions) => {
    return buildElement(ref, tag, exp, options).outerHTML
  }
}

export const { a, b, strong, br, div, h1, i, img, ol, 
  ul, li, p, span, select, option } = fnTags


export const t = (strings: TemplateStringsArray, ...keys: any)  => {
  const res = [strings[0]]
  for (const [idx, key] of keys.entries() ) {
    // @todo how to join map??
    res.push(key, strings[idx + 1])
  }
  return res.join('');
}
