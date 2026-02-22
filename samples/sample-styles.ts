import { RedGin, shareStyle, css, html } from "../src/redgin";

/**
 * 1. SHARE EXTERNAL CSS (e.g., Bootstrap)
 * We fetch it once, and RedGin distributes it to every 10k component's ShadowRoot.
 */
shareStyle('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">')

/**
 * 2. SHARE DESIGN SYSTEM TOKENS
 * Define your brand colors and spacing here.
 */
shareStyle(css`
  :host {
    --brand-primary: #007bff;
    --brand-success: #28a745;
    --card-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
  .rg-card {
    border-radius: 8px;
    box-shadow: var(--card-shadow);
    transition: transform 0.2s;
  }
  .rg-card:hover { transform: translateY(-5px); }
`);

class ProductCard extends RedGin {
  // Component-specific styles (merged with shared styles)
  styles = [css`
    .local-price { color: var(--brand-success); font-weight: bold; }
  `]

  render() {
    // Notice we use 'btn' and 'btn-primary' from Bootstrap 
    // even though we didn't import it inside this file!
    return html`
      <div class="rg-card p-3 m-2">
        <h6 class="text-muted">ID: #402</h6>
        <div class="local-price">$120.00</div>
        <button class="btn btn-primary btn-sm mt-2">Buy Now</button>
      </div>
    `;
  }
}

customElements.define('sample-styles', ProductCard);
