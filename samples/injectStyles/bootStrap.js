import { RedGin, html } from '../../src/redgin';
class BootStrap extends RedGin {
    //styles = [
    //  css`
    //    :host {
    //      background-color:blue;
    //    }
    //  `
    //]
    render() {
        return html ` 
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
