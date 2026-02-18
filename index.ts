import { shareStyle, css } from "./src/redgin"
import './samples/sample-styles'
import './samples/sample-binding'
import './samples/sampleIf'
import './samples/sample-nested'
import './samples/sample-allevents'
import './samples/ecommerce-app'
import './samples/todo-catalog'
import './samples/smart-list'
import './samples/smart-update-list'
import './samples/smart-pagination-list'
import './samples/smart-sort-list'
import './samples/xss-sandbox'
import './samples/parentChild/parentChild'
import './samples/childParent/cart-manager'

shareStyle('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">')
shareStyle(css`
       :host {
           --btn-color: blue;
       }
    `)

const count = 1;

// Create 1000 instances of the component
const sampleBindings = Array.from({ length: count }, (_, i) => 
    `<smart-pagination-list></smart-pagination-list>`
).join('');

// Benchmark the initial render
console.time('Initial Render');

document.getElementById('app')!.innerHTML = `
    <div id="container">
        ${sampleBindings}
    </div>
`;

console.timeEnd('Initial Render');

/**
 * Performance Stress Test
 * Updates a property on all 1000 components simultaneously 
 * to trigger your watchFn logic.
 */
(window as any).stressTest = () => {
    console.time('Update 1000 Components');
    
    // Assuming sample-binding has a 'count' or similar observed property
    document.querySelectorAll('sample-binding').forEach((el: any) => {
        el.setAttribute('msg', (Math.random() * 100).toFixed(0));
    });

    // Use requestAnimationFrame to measure when the browser actually finishes painting
    requestAnimationFrame(() => {
        console.timeEnd('Update 1000 Components');
    });
};

// Global Debugger: Put this in your main entry file
window.addEventListener('load', () => {
  // Find all elements that are NOT yet defined in the customElements registry
  const undefinedElements = document.querySelectorAll(':not(:defined)');

  undefinedElements.forEach(el => {
    // Custom elements MUST have a hyphen in their name
    if (el.localName.includes('-')) {
      console.warn(
        `%c RedGin Caution %c <${el.localName}> is in your HTML but was never imported! %c\n Make sure you have: import './path/to/${el.localName}.ts'`,
        "background: #ffcc00; color: #000; font-weight: bold; padding: 2px 5px; border-radius: 2px;",
        "color: #ffcc00; font-weight: bold;",
        "color: #888;"
      );
      
    }
  });
});
