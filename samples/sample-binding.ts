import { RedGin, s, propReflect, on, html, css } from "../src/redgin";

class Binding extends RedGin {
  msg = propReflect<string>('Hello world!')
  static observedAttributes = ['msg']

  // 1. Dedicated Reset Function
  resetMsg() {
    this.msg = 'Hello world!';
    
    // SURGICAL: Manually update the input value without re-rendering the whole DOM
    const input = this.shadowRoot?.querySelector<HTMLInputElement>('#msgInput');
    if (input) input.value = this.msg;
  }

  render() {
    return html`
      <div class="msg-container">
        
        <!-- Keep input OUTSIDE watch so it's stable (no cursor jumping) -->
        <input 
          id="msgInput"
          type="text" 
          value="${this.msg}" 
          ${ on('input', (e: any) => this.msg = e.target.value) } 
        >

        <hr>

        <!-- Only the display parts are reactive -->
        ${ s(() => html`
            <span class="text-primary">Live Data: ${this.msg}</span>
        `)}

        <button 
          type="button" 
          class="btn btn-danger btn-sm"
          ${ on('click', () => this.resetMsg()) }
        >
          Reset to Default
        </button>

      </div>
    `
  }
}

customElements.define('sample-binding', Binding);
