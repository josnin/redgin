import { RedGin } from "https://cdn.jsdelivr.net/gh/josnin/libweb@main/dist/redgin.min.js";
const styles = [
    `
        :host {
          background-color:blue;
        }
      `,
    `
        :host {
          color:green;
        }
      `
];
class BootStrap extends RedGin {
    render() {
        return ` 
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
customElements.define('btn-bootstrap', BootStrap);
