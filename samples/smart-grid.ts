import { RedGin, s, attr, getset, on, html, css } from "../src/redgin";

class DataRow extends RedGin {
  // Props reflected to attributes for CSS styling
  selected = getset<boolean>(false);
  isValid = getset<boolean>(true);
  val = getset<number>(0);

  static observedAttributes = ['selected', 'is-valid', 'val'];

  styles = [css`
    :host { display: block; border-bottom: 1px solid #eee; transition: 0.2s; }
    :host([selected]) { background: #e7f3ff; border-left: 4px solid #007bff; }
    :host([is-valid="false"]) { background: #fff5f5; color: #dc3545; }
    .row-content { display: flex; align-items: center; padding: 10px; gap: 15px; }
  `];

  render() {
    return html`
      <div class="row-content">
        <!-- 1. Attribute Binding: Toggle checkbox based on prop -->
        <input type="checkbox" 
          ${ attr('checked', () => this.selected) }
          ${ on('change', (e: any) => this.selected = e.target.checked) }
        >

        <!-- 2. Shorthand Stream: Price display -->
        <span class="flex-grow-1">Item Value: $${ s(() => this.val) }</span>

        <!-- 3. Conditional Attribute: Show 'Warning' badge surgically -->
        ${ s(() => !this.isValid ? html`<span class="badge bg-danger">Error</span>` : '') }
      </div>
    `;
  }
}
customElements.define('data-row', DataRow);

class SmartGrid extends RedGin {
  rows = getset<any[]>(Array.from({ length: 1 }, (_, i) => ({ id: i, value: 100 })));
  globalSelect = getset<boolean>(false);

  // Hard to do in Vanilla: Update 1,000 children's attributes surgically
  toggleAll() {
    this.globalSelect = !this.globalSelect;
    // We update the data, and RedGin pushes 'is-open' (or selected) to all 1k tags
    this.rows = this.rows.map(r => ({ ...r })); 
  }

  render() {
    return html`
      <div class="p-4">
        <header class="d-flex justify-content-between mb-3">
          <button class="btn btn-primary" ${on('click', () => this.toggleAll())}>
            ${ s(() => this.globalSelect ? 'Deselect All' : 'Select All') }
          </button>
          <span>Total Rows: ${this.rows.length}</span>
        </header>

        <div class="grid-container" style="max-height: 500px; overflow-y: auto; border: 1px solid #ddd;">
          <!-- 
            SURGICAL SYNC: 
            If globalSelect changes, we update the 'selected' attribute 
            on 1,000 custom elements WITHOUT re-parsing their inner HTML.
          -->
          ${ s(() => this.rows.map(r => html`
              <data-row 
                val="${r.value}"
                ${ attr('selected', () => this.globalSelect) }
              ></data-row>
          `) ) }
        </div>
      </div>
    `;
  }
}
customElements.define('smart-grid', SmartGrid);
