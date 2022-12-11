import { RedGin, div } from "./red-gin.js";



class LoopBinding extends RedGin {
  #arr: any = [1, 2, 3]

  //set arr(val) {
  //   this.#arr = val
  //   this.bind('forLoop1')
  //   this.shadowRoot.getElementById('forLoop1').innerHTML = this.forLoop1()  // how to auto generate every setter?
  //}
 
  render() {
       
    return `
        ${ div({ ref: 'title', exp: this.forLoop() }) }
      `
  }

  forLoop(){
    // forLoop{n} function html
    // how about forloop inside forloop ??
    return  `${ this.arr.map( (e: any) => {
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
