import { RedGin, watch, propReflect } from "../redgin.js";

class Binding extends RedGin {
  arr: any = propReflect('Hello world!', { type: String })

  static observedAttributes = ['arr']

  render() {
    return `${ watch(['arr'], () => this.arr )}` 
  }
 
}


customElements.define('sample-binding', Binding);
