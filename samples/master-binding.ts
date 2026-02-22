import { RedGin, s, attr, getset, propReflect, on, html, css } from "../src/redgin";

class MasterBinding extends RedGin {
  theme = propReflect<'light' | 'dark'>('light')
  isEditable = getset<boolean>(false)
  tags = getset<string[]>(['Tech', 'RedGin', 'Fast'])
  username = getset<string>('Admin_User')

  static observedAttributes = ['theme']

  styles = [css`
    :host { display: block; font-family: sans-serif; transition: 0.3s; }
    .dark-mode { background: #333; color: white; padding: 20px; }
    .light-mode { background: #fff; color: #333; padding: 20px; border: 1px solid #ddd; }
    .tag { display: inline-block; padding: 2px 8px; margin: 2px; background: #e0e0e0; color: #333; border-radius: 4px; font-size: 12px; }
  `]

  render() {
    return html`
      <div ${ attr('class', () => this.theme === 'dark' ? 'dark-mode' : 'light-mode') }>
        
        <!-- SHORTHAND BINDING: watch(['username']) resolves to this.username automatically -->
        <h3>Welcome, ${ s(() => this.username) }!</h3>

        <div class="mb-3">
          <!-- SURGICAL ATTRIBUTE: Using the new 'attr' helper for the input state -->
          <input type="text" 
            ${ attr('disabled', () => !this.isEditable) } 
            value="${this.username}"
            ${ on('input', (e: any) => this.username = e.target.value) }
          >
          
          <small>
            ${ s(() => this.isEditable ? '🔓 Editing' : '🔒 Locked') }
          </small>
        </div>

        <div class="tags-container">
          <strong>Labels:</strong>
          <!-- LIST BINDING: Surgical child generation -->
          ${ s(() => this.tags.map(tag => html`
            <span class="tag">${tag}</span>
          `)) }
        </div>

        <hr>

        <div class="controls">
          <button ${ on('click', () => this.theme = this.theme === 'light' ? 'dark' : 'light') }>
            Toggle Theme
          </button>
          
          <button ${ on('click', () => this.isEditable = !this.isEditable) }>
            Toggle Edit Mode
          </button>

          <button ${ on('click', () => this.tags = [...this.tags, 'New Tag']) }>
            Add Tag
          </button>
        </div>

        <!-- EXTERNAL COMPONENT SYNC: Passing data surgically to a child via attr -->
        <div class="mt-4">
          <user-badge ${ attr('name', () => this.username) }></user-badge>
        </div>
      </div>
    `
  }
}

customElements.define('master-binding', MasterBinding);
