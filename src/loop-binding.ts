import { RedGin, div, t, click } from "./red-gin.js";



class LoopBinding extends RedGin {
 
  arr:any = []
  
  static get observedAttributes() {
    return ['arr'];
  }

  clickMe(e: any) {
    alert(e)
  }
  
  render() {       
    return t`
        <div>Test Loop Binding<div/>
        <div>
           <!-- re render when value change -->                   
          ${ div('arr', () => this.arr.map( 
                 (e: any) => t`<button ${ click(() => this.clickMe(e) ) } >first ${e} button</button>` )  
           ) }    

           ${ div('arr') }
      `
  }
  
  onMounted() {
      this.arr = [1, 2, 3]
  } 
 
}


customElements.define('loop-binding', LoopBinding);
