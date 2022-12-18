import { snakeToCamel } from './utils.js'
import { tags, events } from './directives.js';
import { divBus, eventBus } from './state.js'

export * from './directives.js'

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
  shadowRoot: any;
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    // @ts-ignore
    this.processObserveAttributes(this.constructor.observedAttributes)
  }  

  connectedCallback() {    
    this._onRendered()
    this._onBeforeUpdate()
  }

  // attribute change
  attributeChangedCallback(prop: any, oldValue: any, newValue: any) {

    if (oldValue === newValue) return;

    this._onBeforeUpdate()

    const withUpdate = this.updateContents(prop, JSON.parse(newValue))
    if (withUpdate) this._onUpdated() //call when dom change

  }

  disconnectedCallback() {
    this.processEventListeners(EventListenType.REMOVE)
    //this._onError()
  }
  
  private processObserveAttributes(observedAttributes: any) {
    if (!observedAttributes) return
    for (const e of observedAttributes) {
      Object.defineProperty(this, snakeToCamel(e), {
        configurable: true,
        set (value) {
          this.setAttribute(e, JSON.stringify(value) )
        },
        get () { return JSON.parse(this.getAttribute(e))  }
      })  
    }
  }
  
  private updateContents(prop: any, newValue: any) {
    //element binding
    //  @ts-ignore
    const el = this.shadowRoot.querySelectorAll(`[data-bind__=${prop}]`)
    let withUpdate = false
    for (const e of el) {
      //  @ts-ignore      
      e.innerHTML = divBus[e.dataset.id__] ? divBus[e.dataset.id__].call(this) : newValue
      withUpdate = true

    }
    
    return withUpdate

  }

  private processEventListeners(etype: EventListenType) {
    // todo? update only with changes
    for (const e of eventBus) {
      let [evt, fn, id] = e
      let el = this.shadowRoot.getElementById(id)
      etype === EventListenType.ADD ? el?.addEventListener(evt, fn) : el?.removeEventListener(evt, fn)
    }

  }

  private _onRendered() { 
    this.shadowRoot.innerHTML = this.render()

    this.onRendered()  // to change value after render?? reactive


  }

  private _onBeforeUpdate() { 
    this.onBeforeUpdate() 

    // do Change on the html
    const props = Object.getOwnPropertyNames(this)
    for (const prop of props) {
      // @ts-ignore
      const withUpdate = this.updateContents(prop, this[prop])
      if (withUpdate) this._onUpdated() //call when dom change
    }
    // do Change on the html

  }

  private _onUpdated() {
    this.processEventListeners(EventListenType.ADD)
    this.onUpdated()
  }

  onRendered() {}
  onBeforeUpdate() {}
  onUpdated() {}
  render() {}


}
