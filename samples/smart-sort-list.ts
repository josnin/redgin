import { RedGin, s, getset, propReflect, on, html, css } from "../src/redgin";

/**
 * CHILD: smart-sort-row
 */
class SmartSortRow extends RedGin {
  rid = propReflect<number>(0)
  name = propReflect<string>('')
  score = propReflect<number>(0)
  
  private renderCount = 0;
  static observedAttributes = ['rid', 'name', 'score']

  styles = [css`
    :host { display: block; border-bottom: 1px solid #eee; background: #fff; }
    .row-item { display: grid; grid-template-columns: 80px 1fr 100px 150px; padding: 10px; align-items: center; }
    .badge { background: #6c757d; color: white; padding: 2px 8px; border-radius: 10px; font-size: 10px; }
  `]

  render() {
    this.renderCount++;
    return html`
      <div class="row-item">
        <span>#${this.rid}</span>
        <span>${this.name}</span>
        <span class="text-end">${this.score} pts</span>
        <span class="text-end"><span class="badge">Instance Render: ${this.renderCount}</span></span>
      </div>
    `
  }
}
customElements.define('smart-sort-row', SmartSortRow);

/**
 * PARENT: smart-sort-list
 */
class SmartSortList extends RedGin {
  items = getset<any[]>(
    Array.from({ length: 1000 }, (_, i) => ({ 
      id: i + 1, 
      name: `User ${Math.floor(Math.random() * 1000)}`,
      score: Math.floor(Math.random() * 1000)
    }))
  )

  // Track sort state: { key: 'name', order: 'asc' }
  sortKey = getset<string>('id');
  sortOrder = getset<'asc' | 'desc'>('asc');

  applySort(key: string) {
    console.time('MultiSort');
    
    // Toggle order if clicking the same key, otherwise default to asc
    if (this.sortKey === key) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortOrder = 'asc';
    }

    // Perform the sort
    const sorted = [...this.items].sort((a, b) => {
      const valA = a[key];
      const valB = b[key];

      if (valA === valB) return 0;
      
      const comparison = valA > valB ? 1 : -1;
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });

    this.items = sorted; 
    console.timeEnd('MultiSort');
  }

  render() {       
    return html` 
      <div class="p-4 border rounded shadow-sm">
        <header class="mb-3">
          <h4>📊 Multi-Column Smart Sort (1,000 Rows)</h4>
          <div class="btn-group w-100">
            <button class="btn btn-outline-dark btn-sm" ${on('click', () => this.applySort('id'))}>
              Sort ID ${s(() => this.sortKey === 'id' ? (this.sortOrder === 'asc' ? '↑' : '↓') : '')}
            </button>
            <button class="btn btn-outline-dark btn-sm" ${on('click', () => this.applySort('name'))}>
              Sort Name ${s(() => this.sortKey === 'name' ? (this.sortOrder === 'asc' ? '↑' : '↓') : '')}
            </button>
            <button class="btn btn-outline-dark btn-sm" ${on('click', () => this.applySort('score'))}>
              Sort Score ${s(() => this.sortKey === 'score' ? (this.sortOrder === 'asc' ? '↑' : '↓') : '')}
            </button>
          </div>
        </header>

        <div style="max-height: 400px; overflow-y: auto; border: 1px solid #ddd;">
          <!-- 
            The map creates the order. The browser's DOM diffing 
            moves existing nodes based on the new array order.
          -->
          ${s(() => this.items.map(item => html`
              <smart-sort-row rid="${item.id}" name="${item.name}" score="${item.score}"></smart-sort-row>
          `).join(''))}
        </div>
      </div>
    `
  }
}

customElements.define('smart-sort-list', SmartSortList);
