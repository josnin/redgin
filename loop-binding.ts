import { RedGin, div, t } from "./red-gin.js";



class LoopBinding extends RedGin {
 
  arr:any = []
  
  static get observedAttributes() {
    return ['arr'];
  }
  
  render() {       
    return t`
        <div>Test Loop Binding<div/>
        <div>
           <!-- re render when value change -->                   
          ${ div('arr', () => this.arr.map( 
                 (e: any) => t`<button>first ${e} button</button>` })  
            )}    
      `
  }
  
  onMounted() {
      this.arr = [1, 2, 3]
  } 
 
}


customElements.define('loop-binding', LoopBinding);
