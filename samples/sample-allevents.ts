import { 
  RedGin, 
  on, 
  propReflect, 
  watch,
  html,
  css
} from "../src/redgin";

class AllEvents extends RedGin {
  // Reactive logs to show events working in real-time
  status = propReflect<string>('Waiting for interaction...')
  inputValue = propReflect<string>('')

  static observedAttributes = ['status', 'input-value']

  styles = [
    css`
      :host { display: block; padding: 20px; border: 1px solid #ddd; }
      .event-box { 
        padding: 20px; background: #f8f9fa; border: 2px dashed #ccc; 
        text-align: center; cursor: pointer; transition: all 0.2s;
      }
      .event-box.active { background: #e2e3e5; border-color: #0d6efd; }
      .log { font-family: monospace; color: #d63384; font-weight: bold; }
    `
  ]

  render() {
    return html`
      <div class="container">
        <h4>JS Event Kitchen Sink</h4>
        <p>Current Status: <span class="log">${ watch(['status'], () => this.status) }</span></p>

        <!-- 1. MOUSE EVENTS -->
        <div class="event-box mb-3"
          ${ on('mouseenter', () => this.status = 'Mouse Entered! (mouseenter)') }
          ${ on('mouseleave', () => this.status = 'Mouse Left! (mouseleave)') }
          ${ on('mousedown', () => this.status = 'Mouse Down! (mousedown)') }
          ${ on('mouseup', () => this.status = 'Mouse Up! (mouseup)') }
          ${ on('contextmenu', (e: Event) => { 
              e.preventDefault(); 
              this.status = 'Right Click! (contextmenu)'; 
          }) }
        >
          Hover, Click, or Right-Click Me
        </div>

        <!-- 2. KEYBOARD & INPUT EVENTS -->
        <div class="mb-3">
          <label>Type something:</label>
          <input type="text" class="form-control"
            placeholder="Focus, blur, or type..."
            ${ on('focus', () => this.status = 'Input Focused (focus)') }
            ${ on('blur', () => this.status = 'Input Blurred (blur)') }
            ${ on('input', (e: any) => {
                this.inputValue = e.target.value;
                this.status = `Typing... Current value: ${this.inputValue}`;
            }) }
            ${ on('keydown', (e: any) => {
                if (e.key === 'Enter') this.status = 'You pressed ENTER!';
            }) }
          >
        </div>

        <!-- 3. TOUCH EVENTS (For Mobile Stress Test) -->
        <div class="p-3 bg-warning text-dark mb-3 text-center"
          ${ on('touchstart', () => this.status = 'Touch Start! (touchstart)') }
          ${ on('touchend', () => this.status = 'Touch End! (touchend)') }
        >
          Mobile Touch Test Area
        </div>

        <!-- 4. WINDOW/GLOBAL STYLE EVENT -->
        <button class="btn btn-danger"
          ${ on('dblclick', () => {
              this.status = 'DOUBLE CLICKED!';
              alert('Double click detected!');
          }) }
        >
          Double Click Me
        </button>
      </div>
    `
  }
}

customElements.define('sample-allevents', AllEvents);
