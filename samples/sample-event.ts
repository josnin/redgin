import { RedGin, event, propReflect, watch } from "https://cdn.jsdelivr.net/gh/josnin/libweb@main/dist/redgin.min.js";


class Event extends RedGin {
  // typescript sample
  arr = propReflect<number[]>([1, 2, 3])

  static observedAttributes = ['arr']

  render() {
    return `
        ${ watch(['arr'], () => this.arr.map( (e: number ) => `
                    <button ${ event('click', () => alert(e) )} >clickMe</button>
                  `).join('')
        ) }
    `
  }
 
}


customElements.define('sample-event', Event);
