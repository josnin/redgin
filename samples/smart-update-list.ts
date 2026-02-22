import { RedGin, s, getset, propReflect, on, html, css } from "../src/redgin";

/**
 * 1. CHILD: smart-update-row
 * This is the 'Surgical' unit. Only THIS row reacts when its data changes.
 */
class SmartUpdateRow extends RedGin {
  rid = propReflect<number>(0)
  name = propReflect<string>('')
  
  // Track local renders to prove it's surgical
  private renderCount = 0;

  static observedAttributes = ['rid', 'name']

  styles = [
    css`
      :host { display: block; border-bottom: 1px solid #eee; }
      .row-item { display: flex; justify-content: space-between; padding: 8px; transition: background 0.3s; }
      .pulse { background-color: #d1e7dd; } /* Flash green on update */
      .badge { background: #6c757d; color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px; }
    `
  ]

  // Flash the row whenever an attribute updates
  onUpdated() {
    const el = this.shadowRoot?.querySelector('.row-item');
    if (el) {
      el.classList.remove('pulse');
      void (el as HTMLElement).offsetWidth; // Force reflow to restart animation
      el.classList.add('pulse');
    }
  }

  render() {
    this.renderCount++;
    return html`
      <div class="row-item">
        <span>
          <strong>#${ s(() => this.rid) }</strong> - 
          ${ s(() => this.name) }
        </span>
        <span class="badge">Render Count: ${this.renderCount}</span>
      </div>
    `
  }
}
customElements.define('smart-update-row', SmartUpdateRow);

/**
 * 2. PARENT: smart-update-list
 */
class SmartUpdateList extends RedGin {
  // Initial 1,000 items (can be 10,000)
  items = getset<any[]>(
    Array.from({ length: 1000 }, (_, i) => ({ id: i + 1, name: `User ${i + 1}` }))
  )

  /**
   * SURGICAL ACTION: Change only one specific row
   */
  updateRow(index: number) {
    console.time('SurgicalUpdate');
    
    // Create new array reference for RedGin reactivity
    const newItems = [...this.items];
    
    // Update the specific object at the index
    newItems[index] = { 
      ...newItems[index], 
      name: `Updated @ ${new Date().toLocaleTimeString()}` 
    };
    
    this.items = newItems; 

    console.timeEnd('SurgicalUpdate');
  }

  render() {       
    return html` 
      <div class="p-4 border rounded shadow-sm">
        <header class="d-flex justify-content-between mb-3">
          <h4>🚀 Surgical List (1,000 Rows)</h4>
          <button class="btn btn-warning btn-sm fw-bold" ${ on('click', () => this.updateRow(1)) }>
            Flash Update Row #2
          </button>
        </header>

        <div style="max-height: 400px; overflow-y: auto; border: 1px solid #ddd;">
          <!-- 
            PARENT WATCH: 
            Renders the <smart-update-row> tags ONCE.
            Subsequent 'items' updates only sync attributes to existing tags.
          -->
          ${ s(() => this.items.map( item => html`
              <smart-update-row rid="${item.id}" name="${item.name}"></smart-update-row>
          `).join('') ) }
        </div>
      </div>
    `
  }
}

customElements.define('smart-update-list', SmartUpdateList);
