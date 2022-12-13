import { RedGin, div, input } from "./gin.js";


class Binding extends RedGin {
  title: string = 'Hello world!'

  render() {
    return `
          <input ${ input( (e) => changeHandler(e)) } type="text"/>
          
          <!--
          This will also generate a setter       
          shorter: ${ div('title') }
          -->
          ${ div('title', () => this.title ) } 
               
        
    `
  }
  
  changeHandler(e) {
    this.title = e.target.value
    //this.getElementById('title').textContent = this.title
  }
 
}


customElements.define('sample-binding', Binding);
