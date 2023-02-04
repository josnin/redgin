import { RedGin, event, emit } from '../../src/redgin';

class Child extends RedGin {

  render() {       
    return /*html*/`
        <button 
          ${ event('click', () => emit.call(this, 'newItem', 'added New Item?') ) }>
            <slot>Add to parent's list</slot>
        </button>
    `
  }
 
}


class Parent extends RedGin {

  render() {       
    return /*html*/`
        <child-comp 
          ${ event('newItem',  (e: CustomEvent) => console.log(`Get child data > ${e.detail}`)  ) }>
            Get Child Data?
        </child-comp>
    `
  }
 
}


customElements.define('child-comp', Child);
customElements.define('parent-comp', Parent);
