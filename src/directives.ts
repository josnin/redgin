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

export const  div = (ref: string, exp?: any, options?: IElOptions) => {
  return buildElement(ref, 'div', exp, options).outerHTML
}

export const  span = (ref: string, exp?: any, options?: IElOptions) => {
  return  buildElement(ref, 'span', exp, options).outerHTML
}

export const  select = (ref: string, exp?: any, options?: IElOptions) => {
  return buildElement(ref, 'select', exp, options).outerHTML
}

export const t = (strings: TemplateStringsArray, ...keys: any)  => {
  const res = [strings[0]]
  for (const [idx, key] of keys.entries() ) {
    // @todo how to join map??
    res.push(key, strings[idx + 1])
  }
  return res.join('');
}
