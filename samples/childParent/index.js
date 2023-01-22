//import { RedGin, event, emit, injectStyles } from "../../redgin.js";
import { RedGin, event, emit } from "https://cdn.jsdelivr.net/gh/josnin/libweb@main/dist/redgin.min.js";
class Child extends RedGin {
    render() {
        return `
        <button 
          ${event('click', () => emit.call(this, 'newItem', 'added New Item?'))}>
            <slot>Add to parent's list</slot>
        </button>
    `;
    }
}
class Parent extends RedGin {
    render() {
        return `
        <child-comp 
          ${event('newItem', (e) => console.log(`Get child data > ${e.detail}`))}>
            Get Child Data?
        </child-comp>
    `;
    }
}
customElements.define('child-comp', Child);
customElements.define('parent-comp', Parent);
