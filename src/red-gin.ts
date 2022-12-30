
import { applyDirectives, 
  events, eventBus, tags } from './directives/index.js';
import { propReflectFn } from './propReflect.js'
import { getsetFn } from './getset.js'

export * from './directives/index.js'
export * from './propReflect.js'
export * from './getset.js'

// export most used tags only else use tags.div?
export const { a, b, strong, br, div, h1, i, img, ol, 
  ul, li, p, span, option, select } = tags

// export most used events only else use events.click?
// both tags also have 'select' directives, when importing use events.select instead
export const { click, input, focus, blur, change, 
  submit } = events


enum EventListenType {
  ADD = 0,
  REMOVE = 1,
}


export class RedGin extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
  }  

  connectedCallback() {    
    this._onInit()
    this._onDoUpdate()
  }


  // attribute change
  attributeChangedCallback(prop: any, oldValue: any, newValue: any) {

    if (oldValue === newValue) return;

    const withUpdate = this.updateContents(prop)
    if (withUpdate) this._onUpdated() //call when dom change

  }


  disconnectedCallback() {
    this.processEventListeners(EventListenType.REMOVE)
  }

  
  private updateContents(prop: any) {

    const withUpdate = applyDirectives.call(this, prop);
    
    return withUpdate

  }

  private processEventListeners(etype: EventListenType) {
    // todo? update only with changes
    for (const e of eventBus) {
      let [evt, fn, id] = e
      if (this.shadowRoot) {
        let el = this.shadowRoot.getElementById(id)
        etype === EventListenType.ADD ? el?.addEventListener(evt, fn) : el?.removeEventListener(evt, fn)
      }
    }

  }

  private setPropsBehavior() {
    let props = Object.getOwnPropertyNames(this)
    // @ts-ignore
    const observedAttributes = this.constructor.observedAttributes
    for (const prop of props) {
      // @ts-ignore
      const propValue = this[prop]

      if (propValue.name === 'propReflect') {
        propReflectFn.call(this, prop, propValue, observedAttributes)
      } 

      if (propValue.name === 'getset') {
        getsetFn.call(this, prop, propValue)
      }

    }
  }

  private _onInit() { 

    this.setPropsBehavior()

    /* moved here instead of constructor, 
     * so class props default value can also cover in rendering
     */
    if (this.shadowRoot) this.shadowRoot.innerHTML = this.render()

    // place where u can override value defined in class props
    // fetch api
    this.onInit() 


  }

  private _onDoUpdate() {  //apply DOM change based on init 


    // do Change on the html

    // dont include built in props
    let props = Object.getOwnPropertyNames(this)
    for (const prop of props) {
      // @ts-ignore
      const withUpdate = this.updateContents(prop)
      if (withUpdate) this._onUpdated() //call when dom change
    }
    // do Change on the html

    this.onDoUpdate() 


  }

  private _onUpdated() {
    this.processEventListeners(EventListenType.ADD)
    this.onUpdated()
  }

  onInit() {}
  onDoUpdate() {}
  onUpdated() {}
  render(): string { return `` }


}
