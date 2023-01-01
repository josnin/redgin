
import { RedGin, watch,  getset } from "../redgin.js";


class FetchApi extends RedGin {
  ready: any = getset(false)
  todos: any

  onInit() {
    fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then(response => response.json())
      .then(json => {
        this.todos = json
        this.ready = true
      })
    //setTimeout( () => {
    //    this.ready = true
    //}, 500)
  }
  
  render() {       
    return ` ${ watch(['ready'], 
                () => this.ready ? JSON.stringify(this.todos) : `Loading...` ) 
        }` 
  }
  
 
}


customElements.define('fetch-api', FetchApi);
