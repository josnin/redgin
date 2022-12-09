import { RedGin, bind } from "./red-gin.js";

// can h remove `this` ?

class LoopBinding extends RedGin {
  #arr: any = [1, 2, 3]

  set arr(val) {
     this.#arr = val
     this.bind('forLoop1')
     this.shadowRoot.getElementById('forLoop1').innerHTML = this.forLoop1()  // how to auto generate every setter?
  }
 
  render() {
    //const { #arr, forLoop1 } = this
    
    return `
        <div id="forLoop1">
          ${ this.forLoop1() }
        </div> ` 
  }

  forLoop1(){
    // forLoop{n} function html
    // how about forloop inside forloop ??
    return  `${ this.#arr.map( (e: any) => {
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
