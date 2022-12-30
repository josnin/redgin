import { RedGin, click, propReflect, watch } from "../red-gin.js";


class Event extends RedGin {
  arr = propReflect([1, 2, 3], { type: Array })

  render() {
    return `
        ${ watch(['arr'], () => this.arr.map( e => `
                    <button ${ click( () => alert(e) )} >clickMe</button>
                  `) 
        ) }
    `
  }
 
}


customElements.define('sample-event', Event);
