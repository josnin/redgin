import { RedGin, bindTo, input } from "./gin.js";


class Binding extends RedGin {
  title: string = 'Hello world!'

  render() {
    return `
          <input ${ input( (e) => changeHandler(e)) } type="text"/>
          <div id="title"> ${title} </div>` 
    `
  }
  
  changeHandler(e) {
    this.title = e.target.value
    this.getElementById('title').textContent = this.title
  }
 
}


customElements.define('sample-binding', Binding);
