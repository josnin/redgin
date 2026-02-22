import { RedGin, s, propReflect, attr, getset, on, html, css } from "../src/redgin";

// --- CHILD: APP MODAL ---
class AppModal extends RedGin {
  isOpen = propReflect(false);

  static observedAttributes = ['is-open']

  onUpdated() {
    const d = this.shadowRoot?.querySelector('dialog');
    if (d) this.isOpen ? d.showModal() : d.close();
  }
  render() {
    return html`
      <dialog class="p-4 rounded shadow border-0" style="width: 400px">
        <slot></slot>
        <div class="text-end mt-3">
          <button class="btn btn-light" ${on('click', () => this.isOpen = false)}>Close</button>
        </div>
      </dialog>
    `;
  }
}
customElements.define('app-modal', AppModal);

// --- MAIN APP: CRM PRO ---
class CRMPro extends RedGin {
  // CORE DATA
  view = getset<'dash' | 'pipeline' | 'contacts'>('dash');
  leads = getset<any[]>([
    { id: 1, name: 'Acme Corp', value: 5000, stage: 'Qualified', contact: 'John Doe' },
    { id: 2, name: 'Globex', value: 12000, stage: 'Negotiation', contact: 'Jane Smith' },
    { id: 3, name: 'Initech', value: 2500, stage: 'Lead', contact: 'Bill Lumbergh' }
  ]);
  
  // UI STATE
  isModalOpen = getset(false);
  activeLead = getset<any>(null);

  styles = [css`
    :host { display: block; background: #f4f7f6; min-height: 100vh; font-family: sans-serif; }
    .sidebar { width: 240px; background: #2c3e50; color: white; height: 100vh; position: fixed; }
    .main { margin-left: 240px; padding: 30px; }
    .nav-item { padding: 12px 20px; cursor: pointer; transition: 0.2s; }
    .nav-item:hover, .active { background: #34495e; border-left: 4px solid #3498db; }
    .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
    .pipeline-col { background: #ebedef; border-radius: 8px; padding: 10px; min-height: 400px; width: 250px; }
    .deal-card { background: white; padding: 15px; border-radius: 6px; margin-bottom: 10px; cursor: pointer; border-bottom: 2px solid #ddd; }
  `];

  // LOGIC
  moveStage(id: number, next: string) {
    this.leads = this.leads.map(l => l.id === id ? { ...l, stage: next } : l);
  }

  openEdit(lead: any) {
    this.activeLead = lead;
    this.isModalOpen = true;
  }

  render() {
    return html`
      <div class="sidebar shadow">
        <div class="p-4"><h3>RedGin CRM</h3></div>
        
        <!-- SURGICAL CLASS TOGGLE: No more manual string concatenation -->
        <div class="nav-item" 
          ${ attr('class', () => `nav-item ${this.view === 'dash' ? 'active' : ''}`) } 
          ${ on('click', () => this.view = 'dash') }
        >📊 Dashboard</div>

        <div class="nav-item" 
          ${ attr('class', () => `nav-item ${this.view === 'pipeline' ? 'active' : ''}`) } 
          ${ on('click', () => this.view = 'pipeline') }
        >📑 Sales Pipeline</div>

        <div class="nav-item" 
          ${ attr('class', () => `nav-item ${this.view === 'contacts' ? 'active' : ''}`) } 
          ${ on('click', () => this.view = 'contacts') }
        >👤 Contacts</div>
      </div>


      <div class="main">
        <!-- VIEW 1: DASHBOARD -->
        ${s(() => this.view === 'dash' ? html`
          <div class="row g-3">
            <div class="col-md-4"><div class="stat-card"><h5>Total Deals</h5><h2>${this.leads.length}</h2></div></div>
            <div class="col-md-4"><div class="stat-card"><h5>Pipeline Value</h5><h2>$${this.leads.reduce((a,b) => a + b.value, 0).toLocaleString()}</h2></div></div>
            <div class="col-md-4"><div class="stat-card"><h5>Avg Deal Size</h5><h2>$${(this.leads.reduce((a,b) => a + b.value, 0) / this.leads.length).toFixed(0)}</h2></div></div>
          </div>
        ` : '')}

        <!-- VIEW 2: PIPELINE (KANBAN) -->
        ${s(() => this.view === 'pipeline' ? html`
          <div class="d-flex gap-3 mt-4">
            ${['Lead', 'Qualified', 'Negotiation'].map(stage => html`
              <div class="pipeline-col">
                <h6 class="text-uppercase text-muted mb-3">${stage}</h6>
                ${this.leads.filter(l => l.stage === stage).map(l => html`
                  <div class="deal-card shadow-sm" ${on('click', () => this.openEdit(l))}>
                    <strong>${l.name}</strong>
                    <div class="text-primary small">$${l.value}</div>
                  </div>
                `)}
              </div>
            `)}
          </div>
        ` : '')}

        <!-- VIEW 3: CONTACTS -->
        ${s(() => this.view === 'contacts' ? html`
          <div class="bg-white rounded shadow-sm p-4">
            <table class="table">
              <thead><tr><th>Name</th><th>Primary Contact</th><th>Stage</th></tr></thead>
              <tbody>
                ${this.leads.map(l => html`
                  <tr><td>${l.name}</td><td>${l.contact}</td><td><span class="badge bg-secondary">${l.stage}</span></td></tr>
                `)}
              </tbody>
            </table>
          </div>
        ` : '')}

        <!-- SURGICAL MODAL INTEGRATION -->
        <app-modal ${attr('is-open', () => this.isModalOpen)}>
          ${s(() => this.activeLead ? html`
            <h4>Edit Deal: ${this.activeLead.name}</h4>
            <div class="mt-3">
              <label class="form-label">Update Stage</label>
              <select class="form-select" ${on('change', (e: any) => {
                this.moveStage(this.activeLead.id, e.target.value);
                this.isModalOpen = false;
              })}>
                <option value="Lead" ${this.activeLead.stage === 'Lead' ? 'selected' : ''}>Lead</option>
                <option value="Qualified" ${this.activeLead.stage === 'Qualified' ? 'selected' : ''}>Qualified</option>
                <option value="Negotiation" ${this.activeLead.stage === 'Negotiation' ? 'selected' : ''}>Negotiation</option>
              </select>
            </div>
          ` : '')}
        </app-modal>
      </div>
    `;
  }
}
customElements.define('crm-app', CRMPro);
