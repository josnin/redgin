import { 
  RedGin, 
  on, 
  propReflect, 
  watch,
  html
} from "../src/redgin";

class Event extends RedGin {
  // Reflect 'arr' attribute for 10k list support
  arr = propReflect<number[]>([1, 2, 3])

  static observedAttributes = ['arr']

  render() {
    return html`
      <!-- Wrapper for the list -->
      <div class="button-list">
        
        ${ watch(['arr'], () => this.arr.map( (num: number) => html`
          
          <button 
            class="btn btn-primary m-1"
            ${ on('click', () => alert(`Value: ${num}`)) }
          >
            Click ${num}
          </button>

        `).join('')) }

      </div>
    `
  }
}

customElements.define('sample-event', Event);
