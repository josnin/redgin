
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
  return `${ (+new Date).toString(22) }`
}

export const  div = (ref: string, options?: DivOptions) => {
  const uniqId = getUniqID()
  if (options) {
    const { exp } = options;
    if (exp !== undefined) divBus[uniqId] = exp
  }
  return `<div data-id__="${uniqId}" data-bind__="${ref}"></div>` 
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
      console.log('xxxx', divBus)
      //  @ts-ignore
      el.innerHTML = Object.keys(divBus).length > 0 && el.dataset?.id__ ? divBus[el.dataset.id__].call(this) : this[prop]
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
    console.log(divBus)
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
