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
'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'];
for (const t of HTML_TAGS) {
  tags[t] = (ref: string, exp?: any, options?: IElOptions) => {
    return buildElement(ref, t, exp, options).outerHTML
  }
}



export const t = (strings: TemplateStringsArray, ...keys: any)  => {
  const res = [strings[0]]
  for (const [idx, key] of keys.entries() ) {
    // @todo how to join map??
    res.push(key, strings[idx + 1])
  }
  return res.join('');
}
