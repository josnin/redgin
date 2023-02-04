import { RedGin, getset, watch, propReflect } from "../../src/redgin";

interface IChild extends HTMLElement {
  item: string
}

// configure child component
class Child extends RedGin {

  item = getset<string>('My item?')

  render() {       
    return /*html*/`<p>
        Today's item: ${ watch(['item'], () => this.item ) }
    </p>`
  }
 
}

// configure child component
class Child2 extends RedGin {

  item = propReflect<string>('My item?')

  static observedAttributes = ['item']

  render() {       
    return /*html*/`<p>
        Today's item: ${ watch(['item'], () => this.item ) }
    </p>`
  }
 
}



class Parent extends RedGin {

  currentItem: string = 'Laptop'

  onInit() {
    /*
     * send data to child component using properties
     */
    const child: IChild = this.shadowRoot?.querySelector('child-comp')!
    child.item = this.currentItem

  }

  render() {       
    return /*html*/` 
            <child-comp></child-comp>

            <!-- send data to child component using attributes -->
            <child2-comp item="${this.currentItem}"></child2-comp>
      `
  }
 
}



customElements.define('child-comp', Child);
customElements.define('child2-comp', Child2);
customElements.define('parent-comp', Parent);
