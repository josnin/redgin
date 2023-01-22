import { RedGin, getset, watch, propReflect } from "../../redgin.js";
// configure child component
class Child extends RedGin {
    item = getset('My item?');
    render() {
        return `<p>
        Today's item: ${watch(['item'], () => this.item)}
    </p>`;
    }
}
// configure child component
class Child2 extends RedGin {
    item = propReflect('My item?');
    static observedAttributes = ['item'];
    render() {
        return `<p>
        Today's item: ${watch(['item'], () => this.item)}
    </p>`;
    }
}
class Parent extends RedGin {
    currentItem = 'Laptop';
    onInit() {
        /*
         * send data to child component using properties
         */
        const child = this.shadowRoot?.querySelector('child-comp');
        child.item = this.currentItem;
    }
    render() {
        return ` 
            <child-comp></child-comp>

            <!-- send data to child component using attributes -->
            <child2-comp item="${this.currentItem}"></child2-comp>
      `;
    }
}
customElements.define('child-comp', Child);
customElements.define('child2-comp', Child2);
customElements.define('parent-comp', Parent);
