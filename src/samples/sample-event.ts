import { RedGin, click, propReflect, watch } from "../redgin.js";


class Event extends RedGin {
  arr: any = propReflect([1, 2, 3], { type: Array })

  render() {
    return `
        ${ watch(['arr'], () => this.arr.map( (e: any) => `
                    <button ${ click( () => alert(e) )} >clickMe</button>
                  `) 
        ) }
    `
  }
 
}


customElements.define('sample-event', Event);
