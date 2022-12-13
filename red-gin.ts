
let eventArgs: any = []

export const click = (event: any) => {
  console.log('evt', event)
  let uniq = `id${ eventArgs.length }`
  eventArgs.push(['click', event, uniq])
  return `id=${ uniq }`
}

interface DivOptions {
  id?: string;
  cls?: string;
  exp?: any;
}

const getUniqID = () => {
  return crypto.randomUUID().split('-')[0]
}

const buildElement = (ref: string, type: any, exp: string, options?: DivOptions) => {
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

export const  div = (ref: string, exp?: any, options?: DivOptions) => {
  return buildElement(ref, 'div', exp, options).outerHTML
}

export const  span = (ref: string, exp?: any, options?: DivOptions) => {
  return  buildElement(ref, 'span', exp, options).outerHTML
}

export const  select = (ref: string, exp?: any, options?: DivOptions) => {
  return buildElement(ref, 'select', exp, options).outerHTML
}

export const t = (strings: TemplateStringsArray, ...keys: any)  => {
  const res = [strings[0]]
  keys.forEach( (key: any, idx: number) => {
    // @todo how to join map??
    //res.push(key.join(''), strings[idx + 1])
    res.push(key, strings[idx + 1])
  })
  return res.join('');
}
export class RedGin extends HTMLElement {
  shadowRoot: any;
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
  }  

  connectedCallback() {    
   
    this.shadowRoot.innerHTML = this.render()
    this.afterRender()
    
    // @todo which life cycle
    // @ts-ignore
    this.processObserveAttributes(this.constructor.observedAttributes)
    this.onMounted()

  }
  
  processObserveAttributes(observedAttributes: any) {
    observedAttributes?.forEach( (e: any) => {
      Object.defineProperty(this, e, {
        configurable: true,
        set (value) {
          this.setAttribute(e, JSON.stringify(value) )
        },
        get () { return JSON.parse(this.getAttribute(e)) }
      })  
    })
  }
  
  updateContents(prop: any) {
    //element binding
    //  @ts-ignore
    const binds = this.shadowRoot.querySelectorAll(`[data-bind__=${prop}]`)
    let withUpdate = false
    binds.forEach( (el:any) => {
      
      //  @ts-ignore      
      el.innerHTML = divBus[el.dataset.id__] ? divBus[el.dataset.id__].call(this) : this[prop]
      withUpdate = true
    })
    
    if (withUpdate) this.onUpdated() //call when dom change

  }

  // attribute change
  attributeChangedCallback(prop: any, oldValue: any, newValue: any) {

    if (oldValue === newValue) return;

    this.onBeforeUpdate()

    console.log('newValue', newValue)

    //  @ts-ignore
    this[ prop ] = JSON.parse(newValue);
    
    this.updateContents(prop)

  }

  afterRender() {
    eventArgs.forEach( (e: any) => {
      let [evt, fn, id] = e
      let btn = this.shadowRoot.getElementById(id)
      btn?.addEventListener(evt, fn)
    })
   
   
   
    //const btns = this.shadowRoot.querySelectorAll('button')
    //btns.forEach( 
    //  (btn: any) => btn.addEventListener('click', (e: any) => this.clickMe(btn.dataset.evt1) ) 
    //) 


   
  }

  render() {}
  
  onMounted() {}
  onBeforeUpdate() {}
  onUpdated() {}


}
