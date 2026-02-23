import { RedGin, s, attr, getset, propReflect, on, emit, html, css } from "../src/redgin";

/**
 * CHILD: task-item
 * Demonstrates: propReflect, emit, and conditional styling
 */
class TaskItem extends RedGin {
  id = propReflect<string>('');
  title = propReflect<string>('');
  completed = propReflect<boolean>(false);

  static observedAttributes = ['id', 'title', 'completed'];

  styles = [css`
    .task { display: flex; align-items: center; padding: 8px; border-bottom: 1px solid #eee; }
    .done { text-decoration: line-through; color: #888; }
    .title { flex-grow: 1; margin: 0 10px; }
  `];

  render() {
    return html`
      <div class="task">
        <input type="checkbox" 
          ${attr('checked', () => this.completed)} 
          ${on('change', (e: any) => {
            this.completed = e.target.checked;
            emit.call(this, 'status-change', { id: this.id, completed: this.completed });
          })}
        >
        <span ${attr('class', () => this.completed ? 'title done' : 'title')}>
          ${s(() => this.title)}
        </span>
        <button ${on('click', () => emit.call(this, 'remove-task', { id: this.id }))}>
          &times;
        </button>
      </div>
    `;
  }
}
customElements.define('task-item', TaskItem);

/**
 * PARENT: todo-app
 * Demonstrates: List rendering, computed count, and two-way binding
 */
class TodoApp extends RedGin {
  taskList = getset<{id: string, title: string, completed: boolean}[]>([]);
  newTaskTitle = getset<string>('');
  
  // Computed property example using s()
  get remainingCount() {
    return this.taskList.filter(t => !t.completed).length;
  }

  onInit() {
    this.shadowRoot?.getElementById('myinput')?.focus()
  }

  addTask() {
    if (!this.newTaskTitle.trim()) return;
    const newTask = { 
      id: Math.random().toString(36).substr(2, 9), 
      title: this.newTaskTitle, 
      completed: false 
    };
    this.taskList = [...this.taskList, newTask];
    this.newTaskTitle = ''; // Reset input
  }

  render() {
    return html`
      <div class="todo-container" style="max-width: 400px; margin: 2rem auto; font-family: sans-serif;">
        <h2>RedGin Tasks (${s(() => this.remainingCount)} left)</h2>
        
        <div style="display: flex; gap: 8px; margin-bottom: 20px;">
          <input type="text" 
            id="myinput"
            placeholder="What needs to be done?"
            ${attr('value', () => this.newTaskTitle)}
            ${on('input', (e: any) => this.newTaskTitle = e.target.value)}
            ${on('keyup', (e: any) => e.key === 'Enter' && this.addTask())}
          >
          <button ${on('click', () => this.addTask())}>Add</button>
        </div>

        <div class="list">
          ${s(() => this.taskList.map(task => html`
            <task-item 
              id="${task.id}" 
              title="${task.title}" 
              ${attr('completed', () => task.completed)}
              ${on('status-change', (e: any) => {
                const { id, completed } = e.detail;
                this.taskList = [...this.taskList.map(t => t.id === id ? { ...t, completed } : t)];
              })}
              ${on('remove-task', (e: any) => {
                console.log(11111)
                this.taskList = [...this.taskList.filter(t => t.id !== e.detail.id)];
              })}
            ></task-item>
          `))}
        </div>

        ${s(() => this.taskList.length === 0 ? html`<p style="color: #666;">No tasks yet!</p>` : '')}
      </div>
    `;
  }
}
customElements.define('todo-app', TodoApp);
