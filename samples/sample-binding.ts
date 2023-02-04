import { 
  RedGin, 
  watch, 
  propReflect,
  html
} from "../src/redgin";

class Binding extends RedGin {
  // typescript sample
  msg = propReflect<string>('Hello world!')

  static observedAttributes = ['msg']

  render() {
    return html`${ watch(['msg'], () => this.msg )}
      <button type="button" class="btn btn-danger">Danger</button>
    `
  }
 
}


customElements.define('sample-binding', Binding);
