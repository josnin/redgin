import { RedGin, watch, getset, on, html } from "../src/redgin";

class TodoCatalog extends RedGin {
  // Reactive state using getset for automatic updates
  todos = getset<any[]>([]);
  isLoading = getset<boolean>(true);
  errorMessage = getset<string>('');

  /**
   * Start fetch as soon as component connects to DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.fetchTodos();
  }

  /**
   * MOCK API FETCH: Using /todos endpoint
   */
  async fetchTodos() {
    this.isLoading = true;
    this.errorMessage = ''; 
    try {
      // Fetching todos with a limit to simulate a manageable chunk
      const response = await fetch('https://jsonplaceholder.typicode.com/users/1/todos');
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      
      // Artificial delay to show the Skeleton state
      await new Promise(res => setTimeout(res, 1200));
      
      this.todos = data;
    } catch (err: any) {
      this.errorMessage = `Error: ${err.message}`;
    } finally {
      this.isLoading = false;
    }
  }

  render() {
    return html`
      <div class="p-4" style="max-width: 600px; margin: auto;">
        <header class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
          <h2 class="h4 mb-0">Task Monitor</h2>
          <button class="btn btn-primary btn-sm" ${on('click', () => this.fetchTodos())}>
            Refresh Tasks
          </button>
        </header>

        <!-- MAIN REACTIVE AREA -->
        <div class="todo-container">
          ${watch(['isLoading', 'errorMessage', 'todos'], () => {
            if (this.errorMessage) return html`<div class="alert alert-danger">${this.errorMessage}</div>`;
            if (this.isLoading) return this.renderSkeleton();
            return this.renderList();
          })}
        </div>
      </div>
    `;
  }

  /**
   * SKELETON VIEW: Prevents layout shift
   */
    renderSkeleton() {
      return html`
        <div class="skeleton-wrapper">
          ${Array.from({ length: 5 }, () => html`
            <div style="display: flex; align-items: center; padding: 15px; border-bottom: 1px solid #eee; opacity: 0.5;">
              <!-- Circle: Forced size and color -->
              <div style="width: 24px; height: 24px; border-radius: 50%; background-color: #ccc; margin-right: 15px; flex-shrink: 0;"></div>
              
              <!-- Bar: Forced height and width -->
              <div style="height: 12px; width: 70%; background-color: #ddd; border-radius: 4px;"></div>
            </div>
          `).join('') }
        </div>
      `;
  }


  /**
   * LIST VIEW: Renders the actual data
   */
  renderList() {
    if (this.todos.length === 0) return html`<p class="text-center text-muted">No tasks found.</p>`;

    return html`
      <div class="list-group list-group-flush shadow-sm border rounded">
        ${this.todos.map((todo) => html`
          <div class="list-group-item d-flex justify-content-between align-items-center py-3">
            <div class="d-flex align-items-center">
              <input type="checkbox" class="form-check-input me-3" 
                ${todo.completed ? 'checked' : ''} disabled>
              <span class="${todo.completed ? 'text-decoration-line-through text-muted' : ''}">
                ${todo.title}
              </span>
            </div>
            <span class="badge ${todo.completed ? 'bg-success' : 'bg-warning text-dark'}">
              ${todo.completed ? 'Done' : 'Pending'}
            </span>
          </div>
        `).join('')}
      </div>
    `;
  }
}

customElements.define('todo-catalog', TodoCatalog);
