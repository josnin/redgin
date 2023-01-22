import { RedGin, propReflect, watch } from "https://cdn.jsdelivr.net/gh/josnin/libweb@main/dist/redgin.min.js";
//import { RedGin, propReflect, watch } from "../redgin";
class If extends RedGin {
    // typescript sample
    isDisable = propReflect(false);
    static observedAttributes = ['is-disable'];
    render() {
        return `
        ${watch(['isDisable'], () => `<button  
                ${this.isDisable ? `disabled` : ``}
                > clickMe
            </button>`)}
    `;
    }
}
customElements.define('sample-if', If);
