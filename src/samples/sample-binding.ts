import { RedGin, watch, propReflect } from "../redgin.js";

class Binding extends RedGin {
  // typescript sample
  msg = propReflect<string>('Hello world!')

  static observedAttributes = ['msg']

  render() {
    return `${ watch(['msg'], () => this.msg )}` 
  }
 
}


customElements.define('sample-binding', Binding);
