import { RedGin, click, t } from "./red-gin.js";

// can h remove `this` ?

class Event extends RedGin {
  shadowRoot: any;
  _arr: any = [1, 2, 3]

  clickMe(e: any) {
    alert(e)
  }

  render() {
    //const { clickMe, arr } = this
    
    return t`
        ${ this._arr.map( (e: any) => {
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


customElements.define('sample-event', Event);
