export * from './directives.js'
import { divBus, eventBus } from './state.js'


export class RedGin extends HTMLElement {
  shadowRoot: any;
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
  }  

  connectedCallback() {    
    this.onBeforeMount()
    this.onBeforeUpdate()
    this.onMounted()
    this.onUpdated()
  }
  
  processObserveAttributes(observedAttributes: any) {
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
  
  updateContents(prop: any, newValue: any) {
    //element binding
    //  @ts-ignore
    const binds = this.shadowRoot.querySelectorAll(`[data-bind__=${prop}]`)
    let withUpdate = false
    for (const el of binds) {
      //  @ts-ignore      
      el.innerHTML = divBus[el.dataset.id__] ? divBus[el.dataset.id__].call(this) : newValue
      withUpdate = true

    }
    
    if (withUpdate) this.onUpdated() //call when dom change

  }

  // attribute change
  attributeChangedCallback(prop: any, oldValue: any, newValue: any) {

    if (oldValue === newValue) return;

    this.onBeforeUpdate()

    console.log('newValue', newValue)

    //  @ts-ignore
    //this[ prop ] = JSON.parse(newValue);
    
    this.updateContents(prop, JSON.parse(newValue))

  }

  buildEventListeners() {
    // todo? update only with changes
    for (const e of eventBus) {
      let [evt, fn, id] = e
      let el = this.shadowRoot.getElementById(id)
      el?.addEventListener(evt, fn)
    }
  }

  render() {}
  
  onBeforeMount() {
    this.shadowRoot.innerHTML = this.render()
    
    // @todo which life cycle
    // @ts-ignore
    this.processObserveAttributes(this.constructor.observedAttributes)

  }

  onMounted() {}
  onBeforeUpdate() {}
  onUpdated() {
    this.buildEventListeners()
  }


}
