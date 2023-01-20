// @ts-ignore
import { RedGin, watch, getset } from "https://cdn.jsdelivr.net/gh/josnin/redgin@main/dist/redgin.js";

interface IObj {
  id: number
  name: string
}


class ForLoop extends RedGin {
  // typescript sample
  obj = getset<IObj[]>([
    { id: 1, name: 'John' },
    { id: 2, name: 'John 2' },
  ])

  render() {       
    return ` 
      <ul>
        ${ watch(['obj'], () => this.obj.map( 
              (e:IObj) => `<li>${e.id} - ${e.name}</li>`).join('') 
            ) 
        }
      </ul>
      `
  }
 
}


customElements.define('for-loop', ForLoop);
