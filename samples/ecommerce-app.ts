import { RedGin, watch, getset, on, html } from "../src/redgin";

class EcommerceApp extends RedGin {
  // State variables using getset for automatic requestUpdate()
  view = getset<'shop' | 'checkout'>('shop');
  cart = getset<number>(0);
  isProcessing = getset<boolean>(false);

  /**
   * MOCK PAYMENT: Simulates network latency
   */
  async processPayment() {
    if (this.cart === 0) return;
    this.isProcessing = true;
    
    // Simulate 2-second API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert(`Payment of $${(this.cart * 125).toFixed(2)} successful!`);
    
    this.cart = 0;
    this.isProcessing = false;
    this.view = 'shop'; 
  }

  render() {
    return html`
      <div class="ecommerce-shell p-4">
        <!-- HEADER: Uses a combined watch to ensure it updates when view OR cart changes -->
        <header class="d-flex justify-content-between border-bottom pb-3 mb-4">
          <h2>RedGin Market</h2>
          <div>
            ${watch(['view', 'cart'], () => this.view === 'shop' ? html`
              <button class="btn btn-outline-primary" ${on('click', () => this.view = 'checkout')}>
                🛒 Cart: <strong>${this.cart}</strong> items
              </button>
            ` : html`
              <button class="btn btn-link" ${on('click', () => this.view = 'shop')}>← Back to Shop</button>
            `)}
          </div>
        </header>

        <!-- MAIN VIEW SWITCHER -->
        <main>
          ${watch(['view'], () => this.view === 'shop' ? this.renderCatalog() : this.renderCheckout())}
        </main>
      </div>
    `;
  }

  /**
   * CATALOG: Stress test with 10,000 Product items
   * We use a nested watch on 'cart' so the buttons can update their own state if needed.
   */
  renderCatalog() {
    return html`
      <div class="product-grid d-flex flex-wrap gap-3">
        ${Array.from({ length: 100 }).map((_, i) => html`
          <div class="card shadow-sm" style="width: 14rem;">
            <div class="card-body text-center">
              <h6 class="card-title">Pro Item #${i}</h6>
              <p class="text-success fw-bold">$125.00</p>
              
              <!-- Every 'on' call here depends on the __redgin_current_instance 
                   being set inside your watchFn core logic! -->
              <button class="btn btn-sm btn-primary w-100" 
                ${on('click', () => this.cart++)}
              >
                + Add to Cart
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  /**
   * CHECKOUT: Payment logic with disabled state
   */
  renderCheckout() {
    this.requestUpdate("isProcessing") // triggger force Update
    return html`
      <div class="checkout-card mx-auto p-4 border rounded shadow-sm" style="max-width: 400px;">
        <h3 class="mb-4">Finalise Order ${this.cart}</h3>
        
        <div class="alert alert-secondary py-2">
          <!-- Nested watch ensures total price updates live -->
          Total Items: <strong>${this.cart}</strong>
          Total Price: <strong>$${(this.cart * 125).toFixed(2)}</strong>
        </div>


        ${watch(['isProcessing'], () => `
          <button 
            class="btn btn-success btn-lg w-100"
            ${this.isProcessing || this.cart === 0 ? 'disabled' : ''}
            ${on('click', () => this.processPayment())}
          >
            ${this.isProcessing ? '🔒 Processing...' : '💳 Authorise Payment'}
          </button>
          
          `)}
        
      </div>
    `;
  }
}

customElements.define('ecommerce-app', EcommerceApp);
