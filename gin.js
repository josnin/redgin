
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
    this.shadowRoot.innerHTML = this.buildHTML()
    this.buildEvents()

  }

  buildEventListeners() {
    clickArgs.forEach( (e: any) => {
      let btns = this.shadowRoot.getElementById(`${e[1]}`)
      btns.addEventListener('click', e[0])
    })
    //const btns = this.shadowRoot.querySelectorAll('button')
    //btns.forEach( 
    //  (btn: any) => btn.addEventListener('click', (e: any) => this.clickMe(btn.dataset.evt1) ) 
    //)
  }

  buildHTML() {}


}
