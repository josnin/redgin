
const clickArgs: any = []
export const click = (event: any) => {
 
  let uniq = `id${ clickArgs.length }`
  clickArgs.push([event, uniq])
  return `id=${ uniq }`

}

export class Gin extends HTMLElement {
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
    clickArgs.forEach( (e: any) => {
      let [evt, fn, id] = e
      let btns = this.shadowRoot.getElementById(id)
      btns.addEventListener(evt, fn)
    })
   
    //const btns = this.shadowRoot.querySelectorAll('button')
    //btns.forEach( 
    //  (btn: any) => btn.addEventListener('click', (e: any) => this.clickMe(btn.dataset.evt1) ) 
    //)
   
  }

  render() {}


}
