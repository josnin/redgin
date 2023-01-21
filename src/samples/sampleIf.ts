import { RedGin, propReflect, watch } from "https://cdn.jsdelivr.net/gh/josnin/libweb@main/dist/redgin.min.js";


class If extends RedGin {
  // typescript sample
  isDisable = propReflect<boolean>(false) 

  static  observedAttributes = ['is-disable']; 

  render() {
    return `
        ${ watch(['isDisable'], () => 
            `<button  
                ${ this.isDisable ? `disabled`: ``}
                > clickMe
            </button>`
         )
        }
    `
  }
 
}

customElements.define('sample-if', If);
