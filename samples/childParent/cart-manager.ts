import { 
  RedGin, 
  on,     // Using the 'on' alias
  emit,
  getset, 
  s,
  html,
  propReflect
} from '../../src/redgin';

/**
 * CHILD: Product Card
 * Simulates an individual item in a large catalog.
 */
class ProductItem extends RedGin {
  // Product details passed via attributes/props
  productId = propReflect<number>(0)
  price = getset<number>(99.99)

  static observedAttributes = ['product-id']

  render() {       
    return html`
        <div class="card p-2 shadow-sm">
          <strong>Item #${this.productId}</strong>
          <span>$${this.price}</span>
          <button 
            class="btn btn-primary btn-sm mt-2"
            ${ on('click', () => emit.call(this, 'add-to-cart', { 
                id: this.productId, 
                price: this.price,
                timestamp: Date.now()
              })) 
            }
          >
            Add to Cart
          </button>
        </div>
    `
  }
}

/**
 * PARENT: Shopping Cart Manager
 * Aggregates data from 10,000 potential product children.
 */
class CartManager extends RedGin {
  cartItems = getset<any[]>([])
  totalPrice = getset<number>(0)

  /**
   * Handle data emitted from child
   */
  addItem(e: CustomEvent) {
    const { id, price } = e.detail;
    
    // Update parent state
    this.cartItems = [...this.cartItems, id];
    this.totalPrice = Number((this.totalPrice + price).toFixed(2));
    
    console.log(`🛒 Parent updated: Item ${id} added. Total items: ${this.cartItems.length}`);
  }

  render() {       
    return html`
        <div class="p-4 bg-light">
            <header class="d-flex justify-content-between mb-4">
              <h4>Marketplace Catalog</h4>
              <div class="bg-dark p-2">
                Cart: ${ s(() => this.cartItems.length) } items | 
                Total: $${ s(() => this.totalPrice) }
              </div>
            </header>
            
            <div class="d-flex flex-wrap gap-3">
                <!-- Simulation of multiple children -->
                ${ [1, 2, 3].map(id => html`
                    <product-item 
                      ${ on('add-to-cart', (e: CustomEvent) => this.addItem(e)) }
                      product-id="${id}"
                    >
                    </product-item>
                `).join('') }
            </div>
        </div>
    `
  }
}

customElements.define('product-item', ProductItem);
customElements.define('cart-manager', CartManager);
