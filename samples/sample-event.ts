import { 
  RedGin, 
  event, 
  propReflect, 
  watch,
  html
 } from "../src/redgin";


class Event extends RedGin {
  // typescript sample
  arr = propReflect<number[]>([1, 2, 3])

  static observedAttributes = ['arr']

  render() {
    return html`
        ${ watch(['arr'], () => this.arr.map( (e: number ) => html`
                    <button ${ event('click', () => alert(e) )} >clickMe</button>
                  `).join('')
        ) }
    `
  }
 
}


customElements.define('sample-event', Event);
