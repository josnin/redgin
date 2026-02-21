import { 
  RedGin, 
  propReflect, 
  s,
  on, // Using the new 'on' alias we created
  html
} from "../src/redgin";

class SubmitButton extends RedGin {
  // Reflect 'is-loading' attribute to disable button during async tasks
  isLoading = propReflect<boolean>(false) 

  static observedAttributes = ['is-loading']; 

  /**
   * Simulate an API call
   */
  async handleSubmit() {
    //if (this.isLoading) return;

    this.isLoading = true; // Button disables automatically via propReflect
    
    console.log("Saving data...");
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
    
    this.isLoading = false;
    alert("Data Saved Successfully!");
  }

  render() {
    return html`
      <div class="p-3">
        ${ s(() => html`
            <button 
              class="btn ${this.isLoading ? 'btn-secondary' : 'btn-primary'}"
              ${ this.isLoading ? 'disabled' : '' }
              ${ on('click', () => this.handleSubmit()) }
            >
              ${ this.isLoading ? 'Saving...' : 'Submit Post' }
            </button>
            
            <p class="mt-2 text-muted">
               Status: ${this.isLoading ? 'Processing request...' : 'Ready to send'}
            </p>
        `) }
      </div>
    `
  }
}

customElements.define('sample-if', SubmitButton);
