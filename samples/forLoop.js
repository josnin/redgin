import { RedGin, watch, getset, propReflect } from "../redgin.js";
class ForLoop extends RedGin {
    // typescript sample
    obj = getset([
        { id: 1, name: 'John' },
        { id: 2, name: 'John 2' },
    ]);
    foo = propReflect('hello');
    hidden = propReflect(true);
    static observedAttributes = ['foo', 'hidden'];
    render() {
        console.log(this.hidden);
        return ` 
      <style>
        :host {
          height:400px;
          border:1px solid red;
        }
          /*:host([hidden]) {
            display:none;
          }*/
          :host:not(:defined) {
            display: none;
          }
      </style>
        <ul>
      ${watch(['hidden', 'obj'], () => this.obj.map((e) => `<li>${e.id} - ${e.name}</li> ${this.hidden}`).join(''))}
        </ul>
      <button type="button" class="btn">Basic</button>
<button type="button" class="btn btn-default">Default</button>
<button type="button" class="btn btn-primary">Primary</button>
<button type="button" class="btn btn-success">Success</button>
<button type="button" class="btn btn-info">Info</button>
<button type="button" class="btn btn-warning">Warning</button>
<button type="button" class="btn btn-danger">Danger</button>
<button type="button" class="btn btn-link">Link</button>
      `;
    }
}
customElements.define('for-loop', ForLoop);
