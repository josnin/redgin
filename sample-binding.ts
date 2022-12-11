import { RedGin, div, input } from "./gin.js";


class Binding extends RedGin {
  _title: string = 'Hello world!'

  render() {
    return `
          <input ${ input( (e) => changeHandler(e)) } type="text"/>
          
          <!--
          This will also generate a setter
          <div id="title1">${this.#title}</div>
          -->
          ${ div({ ref: '_title' }) } 
               
        
    `
  }
  
  changeHandler(e) {
    this.title = e.target.value
    //this.getElementById('title').textContent = this.title
  }
 
}


customElements.define('sample-binding', Binding);
