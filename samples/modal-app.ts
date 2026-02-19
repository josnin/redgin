import { RedGin, watch, getset, propReflect, on, emit, html, css } from "../src/redgin";

/**
 * CHILD: smart-modal
 * Now perfectly synced via the Light Path (onUpdated)
 */
class SmartModal extends RedGin {
  title1 = propReflect<string>('Modal Title');
  isOpen = propReflect<boolean>(false);

  static observedAttributes = ['title1', 'is-open'];

  styles = [css`
    dialog {
      border: none;
      border-radius: 12px;
      padding: 0;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      width: 450px;
    }
    dialog::backdrop {
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
    }
    .modal-content { padding: 20px; }
    .modal-footer { background: #f8f9fa; padding: 12px; text-align: right; border-top: 1px solid #eee; }
  `];

  /**
   * LIGHT PATH: Triggered by _afterUpdateNoDomChange
   * Syncs the Reactive State to the Native DOM State.
   */
  onUpdated() {
    const dialog = this.shadowRoot?.querySelector('dialog');
    if (!dialog) return;

    // Direct native API call - very fast
    if (this.isOpen) {
      if (!dialog.open) dialog.showModal(); 
    } else {
      if (dialog.open) dialog.close();
    }
  }

  render() {
    return html`
      <dialog ${on('cancel', () => this.isOpen = false)}>
        <div class="modal-content">
          <h4 class="mb-3">${watch(['title1'], () => this.title1)}</h4>
          <div class="py-2">
            <slot>Are you sure you want to proceed?</slot>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-light btn-sm me-2" ${on('click', () => this.isOpen = false)}>
            Cancel
          </button>
          <slot name="action-btn"></slot>
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
        <h1>RedGin Core Test</h1>
        <p class="text-muted">Testing surgical lifecycle for native Dialogs</p>
        
        <button class="btn btn-primary shadow" ${on('click', () => this.showConfirm = !this.showConfirm)}>
          Trigger Global Modal
        </button>

        <hr class="my-5">

        <!-- 
          The modal is STATIC in the DOM. 
          Only the 'is-open' property changes, hitting the Light Path.
        -->
        ${watch(['showConfirm'], () => `
            <smart-modal 
                title1="Confirm Action" 
                is-open="${this.showConfirm}"
                ${on('closed', () => this.showConfirm = !this.showConfirm)}
            >
            <p>The 10,000 items in the background are safe because 
                <strong>onUpdated</strong> is firing without a DOM re-scan!</p>
            
            <button slot="action-btn" class="btn btn-danger btn-sm" 
                ${on('click', () => { alert('Confirmed!'); this.showConfirm = !this.showConfirm; })}>
                Proceed
            </button>
            </smart-modal>

            `)}
      </div>
    `;
  }
}
customElements.define('modal-app', ModalApp);
