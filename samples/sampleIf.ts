import { 
  RedGin, 
  propReflect, 
  watch,
  html
} from "../src/redgin";


class If extends RedGin {
  // typescript sample
  isDisable = propReflect<boolean>(false) 

  static  observedAttributes = ['is-disable']; 

  render() {
    return html`
        ${ watch(['isDisable'], () => 
            html`<button  
                ${ this.isDisable ? `disabled`: ``}
                > clickMe
            </button>`
         )
        }
    `
  }
 
}

customElements.define('sample-if', If);
