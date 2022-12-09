import { Gin, bindTo } from "./gin.js";


class Binding extends Gin {
  shadowRoot: any;
  title: string = 'Hello world!'

  render() {
    return `
          <input ${ bindTo('title') } type="text"/>
          <div id="title"> ${title} </div>` 
    `
  }
 
}


customElements.define('sample-binding', Binding);
