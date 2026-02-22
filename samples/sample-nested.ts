import { 
  RedGin, 
  s, 
  getset, 
  html ,
  on
} from "../src/redgin";

class NestedBinding extends RedGin {
  // Outer state: toggles the entire container
  showContainer = getset<boolean>(true)
  
  // Inner state: the actual message
  msg = getset<string>('Hello World!')

  render() {
    return html`
      <div class="p-3">
        <button ${on('click', () => this.showContainer = !this.showContainer)}">
          Toggle Container
        </button>
        
        <button ${on('click', () => this.msg = 'Updated ' + Math.random() )}">
          Update Message
        </button>

        <hr>

        <!-- OUTER WATCH -->
        ${ s(() => this.showContainer ? html`
            <div class="alert alert-info">
              
              <!-- INNER WATCH (Nested) -->
              <!-- If outer renders, this generates a NEW <in-watch> tag -->
              <strong>Message:</strong> 
              ${ s(() => this.msg) }

            </div>
        ` : html`<p>Container hidden</p>`) }


      </div>
    `
  }
}

customElements.define('sample-nested', NestedBinding);
