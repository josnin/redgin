
let eventArgs: any = []

export const click = (event: any) => {
  console.log('evt', event)
  let uniq = `id${ eventArgs.length }`
  eventArgs.push(['click', event, uniq])
  return `id=${ uniq }`
}

interface DivOptions {
  id?: string;
  cls?: string;
  ref?: string;
  exp?: any;
}

export const  div = (options: DivOptions) => {
  let { id, cls, ref, exp } = options;
  if (id == undefined) id = `${ref?.slice(1)}${ divBus.length }`
  if (exp === undefined) exp = '';
  divBus.push([id, ref, exp])
  
  return `<div id="${ id }"> ${exp}  </div>` 
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
    
    

    divBus.forEach( (e: any) => {
        let [id, ref, exp] = e;
        Object.defineProperty(this, ref.slice(1), {
          set (value) {
            this[ref] = value
            const el = this.shadowRoot.getElementById(id)
            el.innerHTML = exp ? exp.call(this) : value
          },
        })  
    })

    divBus = [];
   
  }

  render() {}


}
