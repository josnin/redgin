import { RedGin, div, propReflect } from "../red-gin.js";

class Binding extends RedGin {
  msg: any = propReflect('Hello world!', { type: String })

  static observedAttributes = ['title']

  render() {
    return `${ div('msg')}` 
  }
 
}


customElements.define('sample-binding', Binding);
