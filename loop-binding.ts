import { RedGin, div } from "./red-gin.js";



class LoopBinding extends RedGin {
  _arr: any = []
  arr: any = []

  //set arr(val) {
  //   this.#arr = val
  //   this.bind('forLoop1')
  //   this.shadowRoot.getElementById('forLoop1').innerHTML = this.forLoop1()  // how to auto generate every setter?
  //}
 
  render() {
       
    return `
        <div>Test Loop Binding<div/>
        <div>
           This will loop thru the array
            ${ div({ ref: '_arr', exp: this.forLoop }) }
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
