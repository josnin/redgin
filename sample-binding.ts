import { Gin, click } from "./gin.js";


class Binding extends Gin {
  shadowRoot: any;
  arr: any = [1, 2, 3]

  clickMe(e: any) {
    alert(e)
  }

  buildHTML() {
    return `
        ${ this.arr.map( (e: any) => {
          return `
            <button 
              ${ click( () => this.clickMe(e) ) }
              >
                first ${e} button
                This is just a test??
            </button>`
        }) }
    `
  }
 
}


customElements.define('sample-binding', Binding);
