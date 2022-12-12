import { RedGin, div } from "./red-gin.js";



class LoopBinding extends RedGin {
 
  arr: any = []
  
  static get observedAttributes() {
    return ['arr'];
  }
  
  render() {       
    return `
        <div>Test Loop Binding<div/>
        <div>
           <!-- re render when value change -->
            ${ div('arr', { exp: this.reRender }) }
            
            ${ div('arr', 
                   ${ this.arr.map( (e: any) => {
                       return `
                              <button>
                                  first ${e} button
                                  This is just a test??
                              </button>`    
                   }) }    
            }
            
         </div>       
      `
  }
 
  reRender() { // when value change
    return  `${ this.arr.map( (e: any) => {
                  return `
                    <button>
                        first ${e} button
                        This is just a test??
                    </button>`
                  
                }) }
           `  
  }
  
  onMounted() {
      this.arr = [1, 2, 3]
  } 
 
}


customElements.define('loop-binding', LoopBinding);
