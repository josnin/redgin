import { RedGin, s, watch, getset, propReflect, on, html, css } from "../src/redgin";

/**
 * CHILD: smart-page-row
 * These 10 instances stay in the DOM forever. 
 * We just swap their 'rid' and 'name' attributes.
 */
class SmartPageRow extends RedGin {
  rid = propReflect<number>(0)
  name = propReflect<string>('')
  
  private renderCount = 0;
  static observedAttributes = ['rid', 'name']

  styles = [css`
    :host { display: block; border-bottom: 1px solid #eee; background: #fff; }
    .row-item { display: flex; justify-content: space-between; padding: 12px; align-items: center; }
    .badge { background: #198754; color: white; padding: 2px 8px; border-radius: 10px; font-size: 10px; }
  `]

  render() {
    this.renderCount++; // Proves the component is REUSED, not recreated
    return html`
      <div class="row-item">
        <span><strong>#${s(() => this.rid)}</strong> - ${s(() => this.name)}</span>
        <span class="badge">Instance Lifetime Render: ${this.renderCount}</span>
      </div>
    `
  }
}
customElements.define('smart-page-row', SmartPageRow);

/**
 * PARENT: smart-pagination-list
 */
class SmartPaginationList extends RedGin {
  // 10,000 Rows of raw data in memory
  allData = Array.from({ length: 10000 }, (_, i) => ({ 
    id: i + 1, 
    name: `User ${Math.floor(Math.random() * 100000)}` 
  }));

  pageSize = 10;
  currentPage = getset<number>(1);

  // Computed: Get only the items for the current page
  get pagedItems() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.allData.slice(start, start + this.pageSize);
  }

  render() {       
    return html` 
      <div class="p-4 border rounded shadow-sm">
        <header class="d-flex justify-content-between mb-3 align-items-center">
          <h4>📑 Smart Pagination (10k Total)</h4>
          <div class="btn-group">
            <button class="btn btn-outline-dark btn-sm" 
              ${on('click', () => this.currentPage > 1 && this.currentPage--)}>Prev</button>
            <span class="px-3 align-self-center fw-bold">
              Page ${s(() => this.currentPage)}
            </span>
            <button class="btn btn-outline-dark btn-sm" 
              ${on('click', () => this.currentPage++)}>Next</button>
          </div>
        </header>

        <div class="border rounded">
          <!-- 
            Because the list length (10) never changes, 
            RedGin just updates the attributes of the 10 <smart-page-row> elements.
            Look at 'Instance Lifetime Render' - it stays at 1 even when paging!
          -->
          ${watch(['currentPage'], () => this.pagedItems.map(item => html`
              <smart-page-row rid="${item.id}" name="${item.name}"></smart-page-row>
          `) )}
        </div>
      </div>
    `
  }
}

customElements.define('smart-pagination-list', SmartPaginationList);
