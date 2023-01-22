import { RedGin, watch, propReflect } from "https://cdn.jsdelivr.net/gh/josnin/libweb@main/dist/redgin.min.js";
class Binding extends RedGin {
    // typescript sample
    msg = propReflect('Hello world!');
    static observedAttributes = ['msg'];
    render() {
        return `${watch(['msg'], () => this.msg)}
      <button type="button" class="btn btn-danger">Danger</button>
    `;
    }
}
customElements.define('sample-binding', Binding);
