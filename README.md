# RedGin
# ~5.3kb Simplified library for building [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components), works on Vanilla JS / all JS framework

* Use Javascript [Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) for Template syntax
* Rerender element with [<code>watch</code>](https://stackblitz.com/edit/typescript-t3fqo8?file=sampleWatch.ts)  
* Create getter/setters with [<code>getset</code>](https://stackblitz.com/edit/typescript-t3fqo8?file=sampleWatch.ts)   
* Create Property reflection with [<code>propReflect</code>](https://stackblitz.com/edit/typescript-hlms7u?file=index.html)
* Create Inline Events with [<code>event</code>](https://stackblitz.com/edit/typescript-t3fqo8?file=sampleWatch.ts)   
* Create custom events with [<code>emit</code>](https://stackblitz.com/edit/redgin-childtoparent?file=index.ts) 
* Inject Global Styles with [<code>injectStyles</code>](https://stackblitz.com/edit/redgin-bootstrap?file=index.ts)
* [Support Typescript](https://stackblitz.com/edit/typescript-ue61k6?file=index.ts)


## Install

### Plug & Play, Import directly from cdn

```js
import { RedGin } from 'https://cdn.jsdelivr.net/gh/josnin/redgin@v0.1.9/dist/redgin.min.js'
 
```

### Or Install using NPM

```js
npm i redgin   
```

#### then import the library, helpers

```js
import { Redgin } from 'redgin'
```


## How to use?
### Inline Events
it uses <code>event</code> directive to create event listener behind the scene and automatically clear once the component is remove from DOM
```js
import { RedGin, event } from 'redgin'

class Event extends RedGin { 
  render() {
    return `<button ${ event('click', () => alert('Click Me') )} >Submit</button>`
  } 
}

customElements.define('sample-event', Event);

```

### List Render (Reactive) 
* its uses <code>propReflect</code> to dynamically create reactive props reflection define in observedAttributes()
* its uses <code>watch</code> directives to rerender inside html when value change
```js
import { RedGin, watch, propReflect } from 'redgin';

class Loop extends RedGin {

  arr = propReflect([1, 2, 3])
  static get observedAttributes() { return ['arr'] } 
  
  render() {    
    return `<ul> ${ watch(['arr'], () => 
                        this.arr.map( e => `Number: ${e}`) 
                       ).join('') 
                  } 
            </ul>`
    } 
}

customElements.define('sample-loop', Loop);

```

### IF condition (Reactive)
* its uses <code>propReflect</code> to dynamically create reactive props reflection define in observedAttributes()
* its uses <code>watch</code> directives to rerender inside html when value change
```js
import { RedGin, watch, propReflect } from 'redgin'

class If extends RedGin {
  isDisable = propReflect(false)
  static get observedAttributes() { return ['is-disable']; } 

  render() {
    return `
        ${ watch(['isDisable'], () => 
            <button
                ${ this.isDisable ? `disable`: ``}
            > Submit
            </button>
         )
        }
    `
  }
 
}

customElements.define('sample-if', If);
```

### Render Obj (Reactive)
* recommend to use watch directive when rendering obj
```js

obj = getset({
    id:1, 
    name:'John Doe'
 }, { forWatch: false } ) // forWatch default is true, for complex just define a setter/getter manually?

  
render() {       
  return `${ watch(['obj'], () => 
              `<div>${ this.obj.id }</div>
               <div>${ this.obj.name }</div>` 
           ) }`
}
```

### Render List of Obj (Reactive)
```js
onInit() {
  this.obj = [{id:1, name:'John Doe'}]
}
  
render() {       
  return `${ watch(['obj'], () => this.obj.map( (e: any) => 
               `<span>ID:${e.id} Name:${e.name}</span>`)
            ) }`
}
```

## For VSCode Syntax Highlight template literals

### Install VSCode extension [inline-html](https://marketplace.visualstudio.com/items?itemName=pushqrdx.inline-html)

```js
    render() {
      return /*html*/`<div>with syntax highlighted</div>`
    }
```


### Or [lit-html](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html)

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

