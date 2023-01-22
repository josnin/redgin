//import { RedGin, watch, getset } from "https://cdn.jsdelivr.net/gh/josnin/libweb@main/dist/redgin.min.js";
import { RedGin, watch, getset } from "../redgin";


class FetchApi extends RedGin {
  // typescript sample
  ready = getset<boolean>(false)
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
