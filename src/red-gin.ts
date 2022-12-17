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
  }  

  connectedCallback() {    
    this._onBeforeMount()
    this._onMounted()
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
    //const a = Object.getOwnPropertyNames(this)
//    console.log(Object.getOwnPropertyNames(this), this[a])
    if (!observedAttributes) return
    for (const e of observedAttributes) {
      Object.defineProperty(this, e, {
        configurable: true,
        set (value) {
          this.setAttribute(e, JSON.stringify(value) )
        },
        get () { return JSON.parse(this.getAttribute(e)) }
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


  private _onBeforeMount() {
    // @todo which life cycle
    // @ts-ignore
    this.processObserveAttributes(this.constructor.observedAttributes)

    this.shadowRoot.innerHTML = this.render()

    this.onBeforeMount()
  }

  private _onMounted() { 
    // set default variable
    //const subProps = Object.getOwnPropertyNames(this) // subclass properties
    //console.log(subProps)
    //// @ts-ignore
    //for (const p of subProps) {
    //  // @ts-ignore
    //  const val = Object.getOwnPropertyDescriptor(this.constructor, p);

    //  console.log(val)
    //}
    // @ts-ignore
    this.onMounted() 
    this.processEventListeners(EventListenType.ADD)
  }
  private _onBeforeUpdate() { this.onBeforeUpdate() }
  private _onUpdated() {
    this.processEventListeners(EventListenType.ADD)
    this.onUpdated()
  }
  private _onError() { this.onError() }
  
  onBeforeMount() {}
  onMounted() {}
  onBeforeUpdate() {}
  onUpdated() {}
  onError() {}
  render() {}


}
