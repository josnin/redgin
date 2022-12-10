import { RedGin, div, input } from "./gin.js";


class Binding extends RedGin {
  title: string = 'Hello world!'

  render() {
    return `
          <input ${ input( (e) => changeHandler(e)) } type="text"/>
          
          <!--
          This will also generate a setter
          <div id="title">${this.title}</div>
          -->
          ${ div('title') }
        
    `
  }
  
  changeHandler(e) {
    this.title = e.target.value
    //this.getElementById('title').textContent = this.title
  }
 
}


customElements.define('sample-binding', Binding);
