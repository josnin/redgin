import { RedGin, watch, getset, propReflect, on, html, css } from "../src/redgin";

class MasterBinding extends RedGin {
  // 1. Attribute Binding (Reflected)
  theme = propReflect<'light' | 'dark'>('light')
  
  // 2. State Binding (Internal)
  isEditable = getset<boolean>(false)
  
  // 3. List Binding (Array)
  tags = getset<string[]>(['Tech', 'RedGin', 'Fast'])
  
  // 4. Content Binding (Simple String)
  username = getset<string>('Admin_User')

  static observedAttributes = ['theme']

  styles = [
    css`
      :host { display: block; font-family: sans-serif; transition: all 0.3s; }
      .dark-mode { background: #333; color: white; padding: 20px; }
      .light-mode { background: #fff; color: #333; padding: 20px; border: 1px solid #ddd; }
      .tag { display: inline-block; padding: 2px 8px; margin: 2px; background: #e0e0e0; color: #333; border-radius: 4px; font-size: 12px; }
    `
  ]

  render() {
    return html`
      <!-- BINDING 1: Dynamic Class (based on 'theme') -->
      <div class="${ watch(['theme'], () => this.theme === 'dark' ? 'dark-mode' : 'light-mode') }">
        
        <!-- BINDING 2: Text Content -->
        <h3>Welcome, ${ watch(['username'], () => this.username) }!</h3>

        <!-- BINDING 3: Attribute (disabled/enabled) + Conditional Render -->
        <div class="mb-3">
          ${ watch(['isEditable'], () => html`
            <input type="text" 
              ${ !this.isEditable ? 'disabled' : '' } 
              value="${this.username}"
              ${ on('input', (e: any) => this.username = e.target.value) }
            >
            <small>${this.isEditable ? '🔓 Editing mode active' : '🔒 Read-only'}</small>
          `)}
        </div>

        <!-- BINDING 4: List Rendering (map) -->
        <div class="tags-container">
          <strong>Labels:</strong>
          ${ watch(['tags'], () => this.tags.map(tag => html`
            <span class="tag">${tag}</span>
          `).join('')) }
        </div>

        <hr>

        <!-- BINDING 5: Event Handlers (Action) -->
        <div class="controls">
          <button ${ on('click', () => this.theme = this.theme === 'light' ? 'dark' : 'light') }>
            Toggle Theme
          </button>
          
          <button ${ on('click', () => this.isEditable = !this.isEditable) }>
            Toggle Edit
          </button>

          <button ${ on('click', () => this.tags = [...this.tags, 'New']) }>
            Add Tag
          </button>
        </div>
      </div>
    `
  }
}

customElements.define('master-binding', MasterBinding);
