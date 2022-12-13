import { RedGin, div } from "./red-gin.js";



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
          ${ div('arr', () => this.arr.map( (e: any) => {
                          return t`
                            <button>
                                first ${e} button
                                This is just a test??
                            </button>`
                          
                        }) 
          ) }    
      `
  }
  
  onMounted() {
      this.arr = [1, 2, 3]
  } 
 
}


customElements.define('loop-binding', LoopBinding);
