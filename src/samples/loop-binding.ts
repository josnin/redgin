import { RedGin, watch,  propReflect } from "../red-gin.js";


class LoopBinding extends RedGin {
  arr = propReflect('Hello?', {  type: Boolean } ) 
  arr2 = propReflect(false, {  type: Boolean } ) 

  static observedAttributes = ['arr', 'arr2'];
  
  render() {       
    // @ts-ignore
    return ` ${ watch(['arr', 'arr2'], () => ` fsdfsd  ${this.arr} ${this.arr2}` ) }
      `
  }
  
 
}


customElements.define('loop-binding', LoopBinding);
