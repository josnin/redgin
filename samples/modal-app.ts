import { RedGin, s, attr, getset, propReflect, on, emit, html, css } from "../src/redgin";

/**
 * CHILD: smart-modal
 * Now handles its own internal buttons and emits signals to the parent.
 */
class SmartModal extends RedGin {
  isOpen = propReflect<boolean>(false);
  static observedAttributes = ['is-open'];

  onUpdated() {
    const dialog = this.shadowRoot?.querySelector('dialog');
    if (dialog) this.isOpen ? dialog.showModal() : dialog.close();
  }

  // Helper to notify parent and close locally
  handleAction(type: 'confirm' | 'cancel') {
    emit.call(this, type, {}); // Emits 'confirm' or 'cancel' event
    this.isOpen = false; 
  }

  render() {
    return html`
      <dialog ${on('cancel', () => this.handleAction('cancel'))}>
        <div class="p-4">
          <h4>Confirm Action</h4>
          <p>Are you sure you want to proceed?</p>
          
          <div class="mt-3 text-end">
            <button class="btn btn-light me-2" ${on('click', () => this.handleAction('cancel'))}>
              No, Cancel
            </button>
            <button class="btn btn-danger" ${on('click', () => this.handleAction('confirm'))}>
              Yes, Proceed
            </button>
          </div>
        </div>
      </dialog>
    `;
  }
}
customElements.define('smart-modal', SmartModal);

/**
 * PARENT: modal-app
 */
class ModalApp extends RedGin {
  showConfirm = getset<boolean>(false);

  render() {
    return html`
      <div class="p-5 text-center">
        <button class="btn btn-primary" ${on('click', () => this.showConfirm = true)}>
          Trigger Global Modal
        </button>

        <!-- 
          CLEAN DATA FLOW:
          - Data goes DOWN via 'is-open'
          - Events come UP via 'confirm' and 'cancel'
        -->
        ${s(() => this.showConfirm)}
        <smart-modal 
          ${attr('is-open', () => this.showConfirm)}
          ${on('confirm', () => { alert('Confirmed!'); this.showConfirm = false; })}
          ${on('cancel', () => { console.log('Cancelled'); this.showConfirm = false; })}
        >
        </smart-modal>
      </div>
    `;
  }
}
customElements.define('modal-app', ModalApp);
