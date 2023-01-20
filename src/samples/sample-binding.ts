// @ts-ignore
import { RedGin, watch, propReflect } from "https://cdn.jsdelivr.net/gh/josnin/redgin@main/dist/redgin.js";

class Binding extends RedGin {
  // typescript sample
  msg = propReflect<string>('Hello world!')

  static observedAttributes = ['msg']

  render() {
    return `${ watch(['msg'], () => this.msg )}` 
  }
 
}


customElements.define('sample-binding', Binding);
