import { RedGin, propReflect, watch } from '../redgin.js'


class If extends RedGin {
  isDisable = propReflect(false, { type: Boolean }) 

  static  observedAttributes = ['is-disable']; 

  render() {
    return `
        ${ watch(['isDisable'], () => 
            `<button  
                ${ this.isDisable ? `disable`: ``}
                > clickMe
            </button>`
         )
        }
    `
  }
 
}

customElements.define('sample-if', If);