import { RedGin, s, watch, attr, getset, on, html, css, emit, propReflect } from "../src/redgin";

/**
 * CHILD: crm-lead-row
 * Encapsulated row component to ensure "Local Reactivity".
 * When this component updates, it doesn't affect the Parent's DOM.
 */
class LeadRow extends RedGin {
  id1 = propReflect(0);
  name = propReflect('');
  val = propReflect(0);
  stage = propReflect('');
  selected = propReflect(false);

  static observedAttributes = ['id1', 'name', 'val', 'stage', 'selected'];

  styles = [css`
    :host { 
      display: grid; 
      grid-template-columns: 50px 2fr 1fr 1fr; 
      padding: 10px; 
      border-bottom: 1px solid #eee; 
      align-items: center;
      background: white;
    }
    /* Surgical Styling: Toggled via host attribute [selected] */
    :host([selected]) { background: #e7f3ff; }
    .badge { font-size: 0.75rem; padding: 2px 8px; border-radius: 10px; background: #1058a0; color: white; border: 1px solid #ddd; }
  `];

  render() {
    return html`
      <div class="text-center">
        <input type="checkbox" 
          ${attr('checked', () => this.selected)} 
          ${on('change', (e: any) => {
            // 1. Update local state for immediate UI feedback
            this.selected = e.target.checked;
            // 2. Bubble event to Parent for data synchronization
            emit.call(this, 'toggle', {
                id1: this.id1,
                selected: this.selected
            })
          })}
        >
      </div>
      <strong>${this.name}</strong>
      <span>$${this.val.toLocaleString()}</span>
      <div><span class="badge">${this.stage}</span></div>
    `;
  }
}
customElements.define('crm-lead-row', LeadRow);

/**
 * PARENT: crm-pro
 */
class CRMPro extends RedGin {
  // DATA PATH: Leads array is the single source of truth
  leads = getset<any[]>(Array.from({ length: 20 }, (_, i) => ({
    id1: i, name: `Enterprise ${i + 1}`, val: Math.floor(Math.random() * 50000), stage: 'Lead', selected: false
  })));

  view = getset<'dash' | 'list'>('list');
  search = getset('');

  styles = [css`
    :host { display: block; font-family: sans-serif; background: #f4f7f6; min-height: 100vh; }
    .crm-card { background: white; margin: 20px; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    .grid-header { 
      display: grid; grid-template-columns: 50px 2fr 1fr 1fr; 
      padding: 12px; background: #f8f9fa; font-weight: bold; border-bottom: 2px solid #dee2e6; 
    }
    .viewport { max-height: 500px; overflow-y: auto; }
    .nav { background: #212529; padding: 10px 20px; display: flex; gap: 15px; }
    .nav-btn { color: #999; cursor: pointer; }
    .nav-btn[active] { color: white; border-bottom: 2px solid #0d6efd; }
  `];

  /**
   * DATA SYNC: toggleSelect
   * Updates the array immutably. 
   * Note: Because the 'crm-lead-row' tag in renderList() uses ternary string injection
   * for the 'selected' attribute, this update will trigger a partial list re-render.
   */
  toggleSelect(id1: any, selected: boolean) {
    const targetId = Number(id1);
    this.leads = [...this.leads.map(l => 
        l.id1 === targetId ? { ...l, selected: !!selected } : l
    )];
    console.log('Syncing Data:', targetId, this.leads);
  }

  deleteSelected() {
    if(confirm(`Delete ${this.leads.filter(l => l.selected).length} items?`)) {
      // STRUCTURAL PATH: Removing items forces a full list re-render
      this.leads = [...this.leads.filter(l => !l.selected)];
    }
  }

  render() {
    return html`
      <div class="nav">
        <span class="nav-btn" ${attr('active', () => this.view === 'list')} ${on('click', () => this.view = 'list')}>Leads</span>
        <span class="nav-btn" ${attr('active', () => this.view === 'dash')} ${on('click', () => this.view = 'dash')}>Dash</span>
      </div>

      <div class="container-fluid">
        ${watch(['view'], () => {
          if (this.view !== 'list') return  html`<div class="p-5 text-center text-muted"><h4>Dashboard Metrics Placeholder</h4></div>`;

          return html`
            <div class="crm-card">
              <div class="p-3 border-bottom d-flex justify-content-between align-items-center">
                <input type="text" placeholder="Search..." class="form-control w-25" ${on('input', (e: any) => this.search = e.target.value)}>
                <button class="btn btn-danger btn-sm" 
                  ${attr('disabled', () => !this.leads.some(l => l.selected))}
                  ${on('click', () => this.deleteSelected())}>
                  Delete (${s(() => this.leads.filter(l => l.selected).length)})
                </button>
              </div>

              <div class="grid-header">
                <span></span><span>Company</span><span>Value</span><span>Stage</span>
              </div>

              <div class="viewport">
                  ${s(() => this.leads
                      // 1. SURGICAL FILTER: This auto-tracks 'this.search' and 'this.leads'
                      .filter(l => 
                          this.search === '' || 
                          l.name.toLowerCase().includes(this.search.toLowerCase())
                      )
                      // 2. MAP: Only generates rows for matches
                      .map(l => html`
                          <crm-lead-row 
                              id1="${l.id1}" 
                              name="${l.name}" 
                              val="${l.val}" 
                              stage="${l.stage}"
                              ${l.selected ? 'selected' : ''}
                              ${on('toggle', (e: CustomEvent) => this.toggleSelect(e.detail.id1, e.detail.selected))}
                          ></crm-lead-row>
                          `)
                  )}
                  </div>


            </div>
          `;


        })}
      </div>
    `;
  }
}
customElements.define('check-search-list', CRMPro);
