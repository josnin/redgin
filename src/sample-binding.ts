import { RedGin, div, t } from "./red-gin.js";


class Binding extends RedGin {
  title: string = 'Hello world!'

  render() {
    return t`
          
          <!--  This will also generate a setter  -->
          ${ div('title') } 
               
        
    `
  }
  
 
}


customElements.define('sample-binding', Binding);
