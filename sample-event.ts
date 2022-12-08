import { Gin, click, h } from "./gin.js";

// can h remove `this` ?

class Event extends Gin {
  shadowRoot: any;
  arr: any = [1, 2, 3]

  clickMe(e: any) {
    alert(e)
  }

  render() {
    const { clickMe, arr } = this
    
    return h`
        ${ arr.map( (e: any) => {
          return `
            <button 
              ${ click( () => clickMe(e) ) }
              >
                first ${e} button
                This is just a test??
            </button>`
        }) }
    `
  }
 
}


customElements.define('sample-event', Event);
