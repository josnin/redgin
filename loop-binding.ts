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
           This will loop thru the array
            ${ div('arr', { exp: this.forLoop }) }
         </div>       
      `
  }
  
  onMounted() {
      this.arr = [1, 2, 3]
  }

  forLoop(){
    // forLoop{n} function html
    // how about forloop inside forloop ??
    return  `${ this._arr.map( (e: any) => {
                  return `
                    <button>
                        first ${e} button
                        This is just a test??
                    </button>`
                  
                }) }
           `
  }
 
}


customElements.define('loop-binding', LoopBinding);
