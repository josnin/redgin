import { 
  RedGin, 
  watch, 
  getset, 
  propReflect, 
  on,
  emit, // added for deletion
  html 
} from "../src/redgin";

/**
 * 1. CHILD COMPONENT: smart-row
 */
class SmartRow extends RedGin {
  rid = propReflect<number>(0)
  name = propReflect<string>('')
  
  static observedAttributes = ['rid', 'name']

  render() {
    return html`
      <li class="d-flex justify-content-between align-items-center p-2 border-bottom">
        <div>
          <strong>#${ watch(['rid'], () => this.rid) }</strong> - 
          ${ watch(['name'], () => this.name) }
        </div>
        <!-- Emit the ID back to the parent for deletion -->
        <button class="btn btn-sm btn-outline-danger" 
          ${ on('click', () => emit.call(this, 'remove-item', { id: this.rid } )) }>
          Delete
        </button>
      </li>
    `
  }
}
customElements.define('smart-row', SmartRow);

/**
 * 2. PARENT COMPONENT: smart-list
 */
class SmartList extends RedGin {
  obj = getset<any[]>(
    Array.from({ length: 1000 }, (_, i) => ({ id: i + 1, name: `User ${i + 1}` }))
  )

  handleRemove(e: CustomEvent) {
    const { id } = e.detail;
    // Surgical update: Filter out the item
    console.log(`Removed item ${id}. Remaining: ${this.obj.length}`);

    // 1. SURGICAL FILTER: Create a brand new array reference
    // This is what triggers the 'set' in getset
    this.obj = [...this.obj.filter(item => item.id != id)];
  }

  render() {       
    return html` 
      <div class="p-4 shadow-sm border rounded">
        <h3>🚀 Smart List (1,000 Rows)</h3>
        
        <ul class="list-unstyled mt-3" 
            style="max-height: 500px; overflow-y: auto;"
        >
          ${ watch(['obj'], () => this.obj.map( (e) => html`
              <smart-row 
                ${ on('remove-item', (e: CustomEvent) => this.handleRemove(e)) }
                rid="${e.id}" 
                name="${e.name}">
              </smart-row>
          `).join('') ) }
        </ul>
      </div>
    `
  }
}

customElements.define('smart-list', SmartList);
