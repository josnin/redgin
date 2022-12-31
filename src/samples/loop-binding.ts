import { RedGin, watch,  propReflect, getset } from "../redgin.js";


class LoopBinding extends RedGin {
  arr = propReflect('Hello?', {  type: String } ) 
  arr2 = propReflect(false, {  type: Boolean } ) 
  arr3 = getset(false, { forWatch: true }) 

  static observedAttributes = ['arr', 'arr2'];
  
  render() {       
    // @ts-ignore
    return ` ${ watch(['arr', 'arr2', 'arr3'], () => ` fsdfsd  ${this.arr} ${this.arr2} arr3: ${this.arr3}` ) }
      `
  }
  
 
}


customElements.define('loop-binding', LoopBinding);
