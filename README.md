[![NPM](https://nodei.co/npm/redgin.svg?style=flat&data=v,d&color=red)](https://nodei.co/npm/redgin/)

# RedGin

A lightweight (~5.3kb) library that solves the pain points of native Web Components. RedGin offers fine-grained reactivity, surgical updates, and intuitive APIs - making Web Components actually enjoyable to build.

## Why RedGin?

Native Web Components are powerful but come with friction:

| Pain Point | Native Web Components | RedGin |
|------------|----------------------|--------|
| **Boilerplate** | Manual lifecycle callbacks, attributeChangedCallback, getters/setters | Zero boilerplate with `getset` and `propReflect` |
| **Reactivity** | Manual observation with `attributeChangedCallback` | Automatic reactivity with `watch`, `s()`, and fine-grained updates |
| **Template Updates** | Manual DOM manipulation | Surgical updates - only changed parts re-render |
| **Attribute Reflection** | Manual sync between properties and attributes | Automatic with `propReflect` |
| **Event Binding** | `addEventListener` boilerplate | Inline events with `on()` |
| **Style Sharing** | Duplicated styles per component | Global `shareStyle` injection |
| **Performance** | Full re-renders on any change | Only changed elements update |
| **TypeScript** | Complex typing for custom elements | First-class TypeScript support |

## Core Philosophy

RedGin is built around **surgical updates** - only the elements that need to change, change. No virtual DOM, no heavy diffing, just precise, targeted updates to your components.

## Key Features

- **🎯 Surgical Rendering**: Update only what changes - perfect for large lists
- **📝 Template Literals**: Write components using familiar JS template syntax
- **⚡️ Fine-grained Reactivity**: Multiple reactivity patterns (`watch`, `s()`, `getset`, `propReflect`)
- **🔗 Attribute Binding**: Smart `attr()` helper for dynamic attributes
- **🔄 Property Reflection**: Sync properties with attributes using `propReflect`
- **📊 Reactive Getters/Setters**: Create reactive state with `getset`
- **🎨 Style Management**: Global style injection with `shareStyle` and scoped styles with `css`
- **📘 TypeScript Ready**: Full type safety and IntelliSense

## Installation

### Via npm
```bash
npm i redgin
```

## Via CDN

```js
<script type="module" src="https://cdn.jsdelivr.net/npm/redgin@latest/dist/redgin.min.js"></script>
```


## Quick Start

```js
import { RedGin, getset, on, html } from 'redgin';

class Counter extends RedGin {
  count = getset(0);

  render() {
    return html`
      <button ${on('click', () => this.count++)}>
        Count: ${this.count}
      </button>
    `;
  }
}

customElements.define('my-counter', Counter);
```

## API Reference


### Core Helpers

| Helper | Purpose | Example |
| :--- | :--- | :--- |
| `getset(initial)` | Creates reactive property with getter/setter | `count = getset(0)` |
| `propReflect(initial)` | Reactive property that reflects to attribute | `theme = propReflect('light')` |
| `watch(deps, callback)` | Fine-grained control - rerenders when specified dependencies change | `${watch(['count', 'theme'], () => html`<div>...</div>`)}` |
| `s(callback)` | Shorthand for reactive value binding | `${s(() => this.count)}` |
| `attr(name, callback)` | Surgical attribute binding | `${attr('disabled', () => !this.editable)}` |
| `on(event, handler)` | Event listener binding | `${on('click', () => this.save())}` |
| `html` | Template literal tag for HTML | `html`<div>Hello</div>`` |

### Style Helpers

| Helper | Purpose | Example |
| :--- | :--- | :--- |
| `css` | Template literal tag for component-scoped styles | `styles = [css`.card { padding: 1rem; }`]` |
| `shareStyle(styles)` | Injects global styles across all components | `shareStyle(css:host { --brand: blue; })` |


## Lifecycle Methods

* onInit() - After first render
* onDoUpdate() - After data sync
* onUpdated() - After every attribute change/requestUpdate

## Style Management Examples

### Global Design System with shareStyle
import { RedGin, shareStyle, css, html } from 'redgin';

// Share Bootstrap globally (injected once, used everywhere)
shareStyle('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">')

// Share design tokens across all components
```js
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
`);

class ProductCard extends RedGin {
  // Component-specific styles (merged with shared styles)
  styles = [css`
    .local-price { color: var(--brand-success); font-weight: bold; }
  `]

  render() {
    // Bootstrap classes work without local import!
    return html`
      <div class="rg-card p-3">
        <div class="local-price">$120.00</div>
        <button class="btn btn-primary">Buy Now</button>
      </div>
    `;
  }
}
```

## Reactivity Patterns: watch vs s()

### RedGin offers two complementary reactivity patterns:

## s() - Smart Auto-detection
```js
// Automatically tracks dependencies
render() {
  return html`
    <div>${s(() => this.count)}</div>
    <div>${s(() => this.theme)}</div>
  `;
}
```

## watch - Explicit Control
```js
// Fine-grained control over dependencies
render() {
  return html`
    ${watch(['count', 'theme'], () => html`
      <div class="${this.theme}">
        Count: ${this.count}
      </div>
    `)}
  `;
}
```


## Examples

Check out these live examples demonstrating RedGin's capabilities:

### Basic Examples
* [Simple Counter](https://github.com/josnin/redgin/tree/Dev/samples) - Getting started with RedGin
* [Two-way Data Binding](https://github.com/josnin/redgin/tree/Dev/samples) - Using getset and events
* [Todo App](https://github.com/josnin/redgin/tree/Dev/samples) - Classic todo example


### Style Examples

* [Bootstrap Integration](https://github.com/josnin/redgin/tree/Dev/samples) - Using shareStyle with CSS frameworks
* [Design Tokens](https://github.com/josnin/redgin/tree/Dev/samples) - Global theme variables
* [Scoped Styles](https://github.com/josnin/redgin/tree/Dev/samples) - Component-specific CSS


### Advanced Patterns
* [Surgical List Updates (1,000+ items)](https://github.com/josnin/redgin/tree/Dev/samples) - Only updated rows re-render
* [E-commerce Application](https://github.com/josnin/redgin/tree/Dev/samples) - Cart, checkout, and async operations
* [CRM Dashboard](https://github.com/josnin/redgin/tree/Dev/samples) - Multi-view with modals and pipeline
* [Parent-Child Communication](https://github.com/josnin/redgin/tree/Dev/samples) - Custom events and props

### Integration Examples

* [TypeScript Support](https://github.com/josnin/redgin/tree/Dev/samples) - Full type safety
* [With Bootstrap](https://github.com/josnin/redgin/tree/Dev/samples) - Using CSS frameworks
* [Property Reflection](https://github.com/josnin/redgin/tree/Dev/samples) - Syncing props with attributes

## Performance

* Surgical Updates: Only changed elements re-render
* Bundle Size: ~5.3kb minified + gzipped
* Memory: Zero virtual DOM overhead
* Style Injection: Global styles shared once, not duplicated per component

## Contributing

We welcome contributions!
```
git clone https://github.com/josnin/redgin.git
cd redgin
npm install
npm run dev
```

## Reference
https://web.dev/custom-elements-best-practices/

https://web.dev/shadowdom-v1/


## Help

Need help? Open an issue in: [ISSUES](https://github.com/josnin/redgin/issues)


## Contributing
Want to improve and add feature? Fork the repo, add your changes and send a pull request.


