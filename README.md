[![NPM](https://nodei.co/npm/redgin.svg?style=flat&data=v,d&color=red)](https://nodei.co/npm/redgin/)

# RedGin

A lightweight (~5.3kb) library for building high-performance Web Components with surgical precision. RedGin offers fine-grained reactivity, attribute binding, and intelligent rendering - perfect for building anything from simple components to complex enterprise applications.

## Core Philosophy

RedGin is built around **surgical updates** - only the elements that need to change, change. No virtual DOM, no heavy diffing, just precise, targeted updates to your components.

## Key Features

- **🎯 Surgical Rendering**: Update only what changes - perfect for large lists (1000+ items)
- **📝 Template Literals**: Write components using familiar JS template syntax
- **⚡️ Fine-grained Reactivity**: Multiple reactivity patterns for different use cases
- **🔗 Attribute Binding**: Smart `attr()` helper for dynamic attributes
- **🔄 Property Reflection**: Sync properties with attributes using `propReflect`
- **📊 Reactive Getters/Setters**: Create reactive state with `getset`
- **🎨 Scoped Styles**: Component-scoped CSS with template literal support
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
| `s(callback)` | Shorthand for reactive value binding | `${s(() => this.count)}` |
| `attr(name, callback)` | Surgical attribute binding | `${attr('disabled', () => !this.editable)}` |
| `on(event, handler)` | Event listener binding | `${on('click', () => this.save())}` |
| `html` | Template literal tag for HTML | `html`<div>Hello</div>`` |
| `css` | Template literal tag for styles | `css` .card { padding: 1rem; } `` |


## Lifecycle Methods

* onInit() - After first render
* onDoUpdate() - After data sync
* onUpdated() - After every attribute change/requestUpdate

## Examples

Check out these live examples demonstrating RedGin's capabilities:

### Basic Examples
* [Simple Counter](https://github.com/josnin/redgin/tree/Dev/samples) - Getting started with RedGin
* [Two-way Data Binding](https://github.com/josnin/redgin/tree/Dev/samples) - Using getset and events
* [Todo App](https://github.com/josnin/redgin/tree/Dev/samples) - Classic todo example


### Advanced Patterns
* [Surgical List Updates (1,000+ items)](https://github.com/josnin/redgin/tree/Dev/samples) - Only updated rows re-render
* [E-commerce Application](https://github.com/josnin/redgin/tree/Dev/samples) - Cart, checkout, and async operations
* [CRM Dashboard](https://github.com/josnin/redgin/tree/Dev/samples) - Multi-view with modals and pipeline
* Parent-Child Communication - Custom events and props

### Integration Examples

* TypeScript Support - Full type safety
* With Bootstrap - Using CSS frameworks
* Property Reflection - Syncing props with attributes

## Performance

* List Rendering: 10,000 items in < 50ms
* Surgical Updates: Single row update in < 1ms (regardless of list size)
* Bundle Size: ~5.3kb minified + gzipped
* Memory: Zero virtual DOM overhead


## When to Use RedGin

#### ✅ Perfect for:

* Large lists with frequent updates
* Complex SPAs with multiple views
* Component libraries
* Performance-critical applications
* Micro-frontends

#### ❌ Consider alternatives if:

* You need IE11 support
* You prefer JSX syntax
* You want a full-featured framework with built-in routing/state management


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


