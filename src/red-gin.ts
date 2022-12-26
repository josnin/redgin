
import { kebabToCamel,  } from './utils.js'
import { tags, events,  } from './directives.js';
import { divBus, eventBus, watchRef } from './state.js'

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

  /* - accepts list of regex
     - all "aria" attributes have a corresponding props (aria-*)
     - equivalent of "class" attribute in properties are "className" & "classList", 
       adding in observedAttributes can overwrite the existing props.
     - same with id, dataset attr
     - anything else?
  */
  IGNORE_PROP_REFLECTION = ['class', 'style', 'className', 
  'classList', 'id', 'dataset', '^data-', '^aria-']

  /* 
    - treat as a HTML standard boolean attrs
    - presence of attr is true
    - absence of attr is false
  */
  BOOLEAN_ATTRIBUTES = []

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

    /* - if (oldValue === newValue) return; will help to handle infinite call 
       - initializing value from attributes 
    */
    this[prop as keyof typeof this] = JSON.parse(newValue); 


    const withUpdate = this.updateContents(prop)
    if (withUpdate) this._onUpdated() //call when dom change

  }

  disconnectedCallback() {
    this.processEventListeners(EventListenType.REMOVE)
  }

  private isValidAttr(attr: string) {
    let isValid = true
    for (const regexPattern of this.IGNORE_PROP_REFLECTION) {
      const regex = new RegExp(regexPattern, 'g')
      if (attr.match(regex)) {
        isValid = false
        console.warn(`Unable to apply auto propReflection of ${attr} 
        defined in observedAttributes`)
        break 
      }
    }
    return isValid
  }
  
  private processObserveAttributes(observedAttributes: any) {
    if (!observedAttributes) return
    for (const e of observedAttributes) {

      if (!this.isValidAttr(e) === true) continue

      Object.defineProperty(this, kebabToCamel(e), {
        configurable: true,
        set (value) {
          this.setAttribute(e, JSON.stringify(value)) 
        },
        get () { return JSON.parse(this.getAttribute(e)) }
      })  
    }
  }
  
  private updateContents(prop: any) {
    
    let withUpdate = false
    if (Object.hasOwn(watchRef, prop)) {
        for (const uniqId of Object.keys(watchRef[prop])) {
          if (this.shadowRoot) {
            let el = this.shadowRoot.querySelector(`[data-id__="${uniqId}"]`) 
            if (el) {
              el.innerHTML = watchRef[prop][uniqId] ? watchRef[prop][uniqId].call(this) : this[prop as keyof typeof this]
              withUpdate = true
            }  
          }
      }
    }
    
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

  private _onInit() { 

    // moved here instead of constructor, 
    // so class props default value can also cover in rendering
    if (this.shadowRoot) this.shadowRoot.innerHTML = this.render()

    // place where u can override value defined in class props
    // fetch api
    this.onInit() 


  }

  private _onDoUpdate() {  //apply DOM change based on init 

    // do Change on the html
    const props = Object.getOwnPropertyNames(this)
    for (const prop of props) {
      const withUpdate = this.updateContents(prop)
      if (withUpdate) this._onUpdated() //call when dom change
    }
    // do Change on the html

    this.onDoUpdate() 

    /* - moved @ last so it will only trigger when no more actions
     so wont interfer w. props default or onInit value
    */
    // @ts-ignore
    this.processObserveAttributes(this.constructor.observedAttributes)


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
