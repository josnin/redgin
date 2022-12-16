import { RedGin, div, t, click } from "./red-gin.js";



class LoopBinding extends RedGin {
  arr:any = [1, 2]

 
  
  static get observedAttributes() {
    return ['arr'];
  }

  onMounted(): void {
    this.arr = [1, 2]
  }
  
  render() {       
    return t`
        <div>Test Loop Binding<div/>
        <div>
           <!-- re render when value change -->                   
          ${ div('arr', () => this.arr.map( 
                 (e: any) => t`<button ${ click(() => alert(e) ) } >first ${e} button</button>` )  
           ) }    
        </div>
        <div>
           <!-- re render when value change -->                   
          ${ div('arr', () => this.arr.map( 
                 (e: any) => t`<button ${ click(() => alert(e) ) } >first ${e} button</button>` )  
           ) }    
        </div>

        <div>
           <!-- re render when value change -->                   
          ${ div('arr', () => this.arr.map( 
                 (e: any) => t`<button ${ click(() => alert(e) ) } >first ${e} button</button>` )  
           ) }    
        </div>
        <div>
           <!-- re render when value change -->                   
          ${ div('arr', () => this.arr.map( 
                 (e: any) => t`<button ${ click(() => alert(e) ) } >first ${e} button</button>` )  
           ) }    
        </div>
        <div>
           <!-- re render when value change -->                   
          ${ div('arr', () => this.arr.map( 
                 (e: any) => t`<button ${ click(() => alert(e) ) } >first ${e} button</button>` )  
           ) }    
        </div>
        <div>
           <!-- re render when value change -->                   
          ${ div('arr', () => this.arr.map( 
                 (e: any) => t`<button ${ click(() => alert(e) ) } >first ${e} button</button>` )  
           ) }    
        </div>
        <div>
           <!-- re render when value change -->                   
          ${ div('arr', () => this.arr.map( 
                 (e: any) => t`<button ${ click(() => alert(e) ) } >first ${e} button</button>` )  
           ) }    
        </div>
        <div>
           <!-- re render when value change -->                   
          ${ div('arr', () => this.arr.map( 
                 (e: any) => t`<button ${ click(() => alert(e) ) } >first ${e} button</button>` )  
           ) }    
        </div>
        <div>
           <!-- re render when value change -->                   
          ${ div('arr', () => this.arr.map( 
                 (e: any) => t`<button ${ click(() => alert(e) ) } >first ${e} button</button>` )  
           ) }    
        </div>
        <div>
           <!-- re render when value change -->                   
          ${ div('arr', () => this.arr.map( 
                 (e: any) => t`<button ${ click(() => alert(e) ) } >first ${e} button</button>` )  
           ) }    
        </div>
        <div>
           <!-- re render when value change -->                   
          ${ div('arr', () => this.arr.map( 
                 (e: any) => t`<button ${ click(() => alert(e) ) } >first ${e} button</button>` )  
           ) }    
        </div>
      `
  }
  
 
}


customElements.define('loop-binding', LoopBinding);
