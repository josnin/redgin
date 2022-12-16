import { RedGin, div, t } from "./red-gin.js";
import './loop-binding.js'


class Binding extends RedGin {
  title: string = 'Hello world!' // bug this value is not initialized??

  static get observedAttributes() {
    return ['title'];
  }

  onMounted(): void {
    this.title = 'Hello'
    
  }

  render() {
    return t`
          
          <!--  This will also generate a setter  -->

          ${ div('title') }
          <loop-binding></loop-binding>
               
        
    `
  }
  
 
}


customElements.define('sample-binding', Binding);
