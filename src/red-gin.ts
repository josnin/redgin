
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
  ignorePropReflection = ['class', 'style', 'className', 
  'classList', 'id', 'dataset', '^data-', '^aria-']

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

    const withUpdate = this.updateContents(prop, JSON.parse(newValue))
    if (withUpdate) this._onUpdated() //call when dom change

  }

  disconnectedCallback() {
    this.processEventListeners(EventListenType.REMOVE)
  }

  private isValidAttr(attr: string) {
    let isValid = true
    for (const regexPattern of this.ignorePropReflection) {
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
  
  private updateContents(prop: any, newValue: any) {
    //element binding
    //const el = this.shadowRoot.querySelectorAll(`[data-bind__=${prop}]`)
    //let withUpdate = false
    //for (const e of el) {
    //  //  @ts-ignore      
    //  e.innerHTML = divBus[e.dataset.id__] ? divBus[e.dataset.id__].call(this) : newValue
    //  withUpdate = true

    //}
    //let withUpdate = false
    //for (const id of Object.keys(divBus)) {
    //  let el = this.shadowRoot.getElementById(id) // @todo: to use querySelector???
    //  el.innerHTML = divBus[id] ? divBus[id].call(this) : newValue
    //  withUpdate = true
    //}
    
    let withUpdate = false
    if (Object.hasOwn(watchRef, prop)) {
        for (const uniqId of Object.keys(watchRef[prop])) {
          if (this.shadowRoot) {
            let el = this.shadowRoot.querySelector(`[data-id__="${uniqId}"]`) 
            if (el) {
              el.innerHTML = watchRef[prop][uniqId] ? watchRef[prop][uniqId].call(this) : newValue
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
      // @ts-ignore
      const withUpdate = this.updateContents(prop, this[prop])
      if (withUpdate) this._onUpdated() //call when dom change
    }
    // do Change on the html

    this.onDoUpdate() 

    // moved @ last so it will only trigger when no more actions
    // so wont interfer w. props default or onInit value
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
