import { RedGin, watch, getset } from "../redgin.js";


class ForLoop extends RedGin {
  obj: any = getset([
    { id: 1, name: 'John' },
    { id: 2, name: 'John 2' },
  ])

  render() {       
    return ` 
      <ul>
        ${ watch(['obj'], () => this.obj.map( 
              (e:any) => `<li>${e.id} - ${e.name}</li>`).join('') 
            ) 
        }
      </ul>
      `
  }
  
 
}


customElements.define('for-loop', ForLoop);
