import { RedGin, bind } from "./red-gin.js";

// can h remove `this` ?

class LoopBinding extends RedGin {
  #arr: any = [1, 2, 3]

  set arr(val) {
     this.#arr = val
     this.shadowRoot.getElementById('withLoop').innerHTML = this.forLoop()
  }
 
  render() {
    //const { #arr, forLoop } = this
    
    return `
        <div id="withLoop">
          ${ this.forLoop() }
        </div> ` 
  }

  forLoop(){
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
