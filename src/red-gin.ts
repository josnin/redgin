export * from './directives.js'
import { divBus, eventArgs } from './state.js'


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
      
      //  @ts-ignore      
      el.innerHTML = divBus[el.dataset.id__] ? divBus[el.dataset.id__].call(this) : this[prop]
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
