import { RedGin, bindTo, input } from "./gin.js";


class Binding extends RedGin {
  title: string = 'Hello world!'

  render() {
    return `
          <input ${ input( (e) => changeHandler(e)) } type="text"/>
          <div> ${bind(this.title)} </div> <!--result: <div> <red-gin id="title"> Hello world</red-gin> </div>` --> 
    `
  }
  
  changeHandler(e) {
    this.title = e.target.value
    this.getElementById('title').textContent = this.title
  }
 
}


customElements.define('sample-binding', Binding);
