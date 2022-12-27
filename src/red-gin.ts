
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

  /*
   * accepts list of regex
   * all "aria" attributes have a corresponding props (aria-*)
   * equivalent of "class" attribute in properties are "className" & "classList", 
   * adding in observedAttributes can overwrite the existing props.
   * same with id, dataset attr
   * anything else?
   */
  IGNORE_PROP_REFLECTION = ['class', 'style', 'className', 
  'classList', 'id', 'dataset', '^data-', '^aria-']

  /* 
   * treat as a HTML standard boolean attrs
   * presence of attr is true
   * absence of attr is false
   */
  BOOLEAN_ATTRIBUTES = ['disabled']

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
  
  private propReflect(observedAttributes: any) {
    if (!observedAttributes) return
    for (const e of observedAttributes) {

      if (!this.isValidAttr(e) === true) continue

      Object.defineProperty(this, kebabToCamel(e), {
        configurable: true,
        set (value) {
          // @todo to proceed check first if value change 
          if (this.BOOLEAN_ATTRIBUTES.includes(e) && Boolean(value) === true) {
            this.setAttribute(e, '') 
          } else if (this.BOOLEAN_ATTRIBUTES.includes(e) && Boolean(value) === false) {
            this.removeAttribute(e)
          } else {
            this.setAttribute(e, value)
          }
        },
        get () { 
          if (e in this.BOOLEAN_ATTRIBUTES) {
            return this.hasAttribute(e)
          } else {
            // @todo defining variable at the top most will always overwrite by this
            // ex. arr:any = [1] 
            return JSON.parse(this.getAttribute(e)) 
          }
        }
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
    // @ts-ignore
    this.propReflect(this.constructor.observedAttributes)

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
    const propsToExclude = ['BOOLEAN_ATTRIBUTES', 'IGNORE_PROP_REFLECTION'] 
    let props = Object.getOwnPropertyNames(this).filter( (e: any) => !propsToExclude.includes(e))
    for (const prop of props) {
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
