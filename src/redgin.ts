
import { 
  applyDirectives, 
  applyEventListeners, 
  removeEventListeners,
} from './directives/index.js';
import { applyPropsBehavior } from './props/index.js'

export * from './directives/index.js'
export * from './props/index.js'


// export most used tags only else use tags.div?
//export const { a, b, strong, br, div, h1, i, img, ol, 
//  ul, li, p, span, option, select } = tags

export const attachShadow: ShadowRootInit = {
    mode: 'open', 
    delegatesFocus: true 
}
export const injectStyles: string[] = []
export const defaultStyles: string[] = [
  ` /* Custom elements are display: inline by default, 
     * so setting their width or height will have no effect 
    */
    :host { display: block; }
  `
]


export class RedGin extends HTMLElement {

  constructor() {
    super();
    this.attachShadow(attachShadow);
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

  getStyles(styles: string[]) { 
    const styleSheets: string[] = []
    const adoptedStyleSheets: CSSStyleSheet[] = []
    const hasBrowserSupport = this.shadowRoot?.adoptedStyleSheets
    for (const s of styles) {
      if (s.startsWith('<link')) {
        styleSheets.push(s)
      } else if (s.startsWith('@import') || !hasBrowserSupport) {
        const style = document.createElement('style')
        style.innerHTML = s
        styleSheets.push(style.outerHTML)
      } else {
        const sheets = new CSSStyleSheet()
        sheets.replaceSync(s)
        adoptedStyleSheets.push(sheets)
      }
    }

    if (this.shadowRoot && adoptedStyleSheets.length > 0) this.shadowRoot.adoptedStyleSheets = adoptedStyleSheets

    return styleSheets.join('')
  }

  private _onInit() { 

    this.setPropsBehavior()

    /* moved here instead of constructor, 
     * so class props default value can also cover in rendering
     */
    if (this.shadowRoot) this.shadowRoot.innerHTML = `
      ${this.getStyles(injectStyles)} 
      ${this.getStyles(defaultStyles)} 
      ${this.getStyles(this.styles)} 
      ${this.render()}
      `

    // place where u can override value defined in class props
    // fetch api
    this.onInit() 


  }

  private _onDoUpdate() {  //apply DOM change based on init 

    // do Change on the html
    let props = Object.getOwnPropertyNames(this)
    for (const prop of props) {
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
  styles: string[] = [] 
  render(): string { return `` }

}
