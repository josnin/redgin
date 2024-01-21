# RedGin

A lightweight (~5.3kb) library for building Web Components, compatible with Vanilla JS and all JavaScript frameworks. This library simplifies the creation of Web Components and offers features such as using JavaScript template literals for template syntax, rerendering elements with watch, creating getter/setters with getset, property reflection with propReflect, inline events with event, custom events with emit, injecting global styles with injectStyles, and support for TypeScript.



## Features



- **JavaScript Template Literals for Template Syntax**: Simplify the creation of templates using JavaScript template literals. [Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)



- **Rerender Element with Watch**: Easily trigger a rerender of an element by watching for changes.[`watch`](https://stackblitz.com/edit/typescript-t3fqo8?file=sampleWatch.ts)



- **Create Getter/Setters with getset**: Define getter and setter functions for your properties.[`getset`](https://stackblitz.com/edit/typescript-t3fqo8?file=sampleWatch.ts)



- **Create Property Reflection with propReflect**: Reflect property changes to corresponding attributes.[`propReflect`](https://stackblitz.com/edit/typescript-hlms7u?file=index.html)



- **Create Inline Events with event**: Attach events directly in your component's template.[`event`](https://stackblitz.com/edit/typescript-t3fqo8?file=sampleWatch.ts)



- **Create Custom Events with emit**: Emit custom events from your components.[`emit`](https://stackblitz.com/edit/redgin-childtoparent?file=index.ts)



- **Inject Global Styles with injectStyles**: Apply global styles for your components.[`injectStyles`](https://stackblitz.com/edit/redgin-bootstrap?file=index.ts)



- **Support for TypeScript**: Enjoy type safety when using Redgin with TypeScript.[Support Typescript](https://stackblitz.com/edit/typescript-ue61k6?file=index.ts)




- **Build SPAs (Single-Page Applications)**: Simplify the development of SPAs using Redgin.[Single Page Application](https://stackblitz.com/edit/typescript-ezsw6j)

## Installation



Include the RedGin library in your project.


```html
// via html
<script type="module" src="https://cdn.jsdelivr.net/npm/redgin@latest/dist/redgin.min.js"></script>

```


Or install it via npm:



```bash

npm i redgin

```
## Usage



1. **Import the Library:**



```javascript

// via js

import { RedGin, watch, getset, html } from 'https://cdn.jsdelivr.net/npm/redgin@latest/dist/redgin.min.js';



// via npm

import { RedGin, watch, getset, html } from 'redgin';

```



2. **Use the Features:**



```javascript

// FetchApiComponent.ts

// Creating a Fetch Api Component that displays Todos using Getset, Watch
class FetchApi extends RedGin {
  // Reactive properties using getset
  ready = getset<boolean>(false);
  todos: any;

  // Initialize data from the API in the onInit lifecycle method
  onInit() {
    fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then(response => response.json())
      .then(json => {
        this.todos = json;
        this.ready = true;
      });
  }
  
  // Render method for displaying the fetched data
  render() {       
    return html`
      ${watch(['ready'], 
        () => this.ready ? JSON.stringify(this.todos) : html`Loading...`
      )}`;
  }
}

// Define the custom element 'fetch-api'
customElements.define('fetch-api', FetchApi);

```


3. **Passing data from Parent to Child component**



```javascript

// ParentToChildComponents.ts

class ParentComp extends RedGin {
  currentItem: string = 'Laptop';

  // Initialize child component with data using properties or attributes
  onInit() {
    // Option 1: Send data to child component using properties     
    const child: IChild = this.shadowRoot?.querySelector('child-comp')!;
    child.item = this.currentItem;
  }

  // Render method for the parent component
  render() {       
    return html`
      <child-comp></child-comp>

      <!-- Option 2: Send data to child component using attributes -->
      <child2-comp item="${this.currentItem}"></child2-comp>
    `;
  }
}

 
```

3. **Passing data from Child to Parent component**
``` javascript

// ParentChildComponents.ts

// Child component for emitting a custom event
class ChildComp extends RedGin {
  render() {
    return html`
      <button ${event('click', () => emit.call(this, 'newItem', 'added New Item?'))}>
        <slot>Add to parent's list</slot>
      </button>
    `;
  }
}

// Parent component for receiving the custom event
class ParentComp extends RedGin {
  render() {
    return html`
      <child-comp 
        ${event('newItem', (e: CustomEvent) => console.log(`Received child data: ${e.detail}`))}>
        Get Child Data?
      </child-comp>
    `;
  }
}

```

4. Creating a Reactive button

```javascript

// ReactiveButton.ts

class ReactiveButton extends RedGin {
  // Reactive property using propReflect
  message = propReflect<string>('Hello, World!');

  // Observed attributes for the component
  static observedAttributes = ['message'];

  // Render method for the component
  render() {
    // Use watch to trigger a rerender when 'message' changes
    return html`${watch(['message'], () => html`
      <button type="button">${this.message}</button>
    `)}
    `;
  }
} 

```

5. For Loop through the list of Products
``` javascript

// ProductListRenderer.ts

// For Loop through the List of Products
class ProductListRenderer extends RedGin {
  // Reactive property using getset
  products = getset<IProduct[]>([
    { id: 1, name: 'Laptop' },
    { id: 2, name: 'Camera' },
  ]);

  // Render method for displaying the list of products
  render() {       
    return html` 
      <ul>
        ${watch(['products'], () => 
          this.products.map(product => 
            html`<li>${product.id} - ${product.name}</li>`
          )
        )}
      </ul>`;
  }
}



```
More






## For VSCode Syntax Highlight template literals

### Install extension [inline-html](https://marketplace.visualstudio.com/items?itemName=pushqrdx.inline-html)

```js
    render() {
      return html`<div>with syntax highlighted</div>`
    }
```



## Reference
https://web.dev/custom-elements-best-practices/

https://web.dev/shadowdom-v1/


## How to run development server?
```
git clone git@github.com:josnin/redgin.git
cd ~/Documents/redgin/
npm install
npm run dev
```

## Help

Need help? Open an issue in: [ISSUES](https://github.com/josnin/redgin/issues)


## Contributing
Want to improve and add feature? Fork the repo, add your changes and send a pull request.
