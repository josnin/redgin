import { RedGin, getset, watch, on, html } from "../src/redgin";

class XssSandbox extends RedGin {
  // User-controlled state (Potentially Malicious)
  comment = getset<string>('Hello! <script>alert("Hacked")</script>')

  render() {
    return html`
      <div class="p-4 border shadow-sm">
        <h4>🛡️ RedGin Security Sandbox</h4>
        <p class="text-muted">Type HTML/Scripts below to test the sanitizer.</p>

        <!-- 1. THE ATTACK VECTOR (Input) -->
        <div class="mb-3">
          <label>Enter Comment:</label>
          <input type="text" class="form-control" 
            value="${this.comment}" 
            ${ on('input', (e: any) => this.comment = e.target.value) }
            placeholder="e.inline: <img src=x onerror=alert(1)>"
          >
        </div>

        <div class="row">
          <!-- 2. THE PROTECTED OUTPUT -->
          <div class="col-md-6">
            <div class="card bg-light p-3">
              <h6>Sanitized Output (Safe):</h6>
              <div class="border p-2 bg-white text-danger fw-bold">
                <!-- 
                   Even if 'comment' has <script>, the watch tag itself 
                   is NOT sanitized, but the 'this.comment' string inside IS.
                -->
                ${ watch(['comment'], () => this.comment) }
              </div>
              <small class="mt-2">Check the DOM: You'll see <code>&lt;script&gt;</code> as text.</small>
            </div>
          </div>

          <!-- 3. THE REACTIVITY PROOF -->
          <div class="col-md-6">
            <div class="card p-3">
              <h6>System Status:</h6>
              <p>
                Characters: <strong>${ watch(['comment'], () => this.comment.length) }</strong>
              </p>
              <div class="badge bg-success">
                Watch Directives: ACTIVE ✅
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('xss-sandbox', XssSandbox);
