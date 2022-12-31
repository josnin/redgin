
import { 
  applyDirectives, 
  applyEventListeners, 
  removeEventListeners,
  tags } from './directives/index.js';
import { applyPropsBehavior } from './props/index.js'

export * from './directives/index.js'
export * from './props/index.js'

// export most used tags only else use tags.div?
export const { a, b, strong, br, div, h1, i, img, ol, 
  ul, li, p, span, option, select } = tags


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
    removeEventListeners.call(this)
  }

  
  private updateContents(prop: any) {

    const withUpdate = applyDirectives.call(this, prop);
    
    return withUpdate

  }

  private setEventListeners() {
    applyEventListeners.call(this)
  }

  private setPropsBehavior() {
    let props = Object.getOwnPropertyNames(this)
    for (const prop of props) {
      // @ts-ignore
      const propValue = this[prop]

      applyPropsBehavior.call(this, prop, propValue)

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

    this.setEventListeners()
    this.onUpdated()

  }

  onInit() {}
  onDoUpdate() {}
  onUpdated() {}
  render(): string { return `` }


}
