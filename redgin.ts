
let eventArgs: any = []

export const click = (event: any) => {
  console.log('evt', event)
  let uniq = `id${ eventArgs.length }`
  eventArgs.push(['click', event, uniq])
  return `id=${ uniq }`
}

export class RedGin extends HTMLElement {
  shadowRoot: any;
  constructor() {
    super();
    this.attachShadow({mode: 'open'});


  }  

  connectedCallback() {    
    const { render, afterRender } = this
    this.shadowRoot.innerHTML = render()
    afterRender()

  }

  afterRender() {
    eventArgs.forEach( (e: any) => {
      let [evt, fn, id] = e
      let btns = this.shadowRoot.getElementById(id)
      btns.addEventListener(evt, fn)
    })
   
    eventArgs = []// make sure clear after
   
    //const btns = this.shadowRoot.querySelectorAll('button')
    //btns.forEach( 
    //  (btn: any) => btn.addEventListener('click', (e: any) => this.clickMe(btn.dataset.evt1) ) 
    //)
   
  }

  render() {}


}
