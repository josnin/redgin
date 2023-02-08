# RedGin
# ~5.3kb Simplified library for building [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components), works on Vanilla JS / all JS framework

* Use Javascript [Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) for Template syntax
* Rerender element with [`watch`](https://stackblitz.com/edit/typescript-t3fqo8?file=sampleWatch.ts)  
* Create getter/setters with [`getset`](https://stackblitz.com/edit/typescript-t3fqo8?file=sampleWatch.ts)   
* Create Property reflection with [`propReflect`](https://stackblitz.com/edit/typescript-hlms7u?file=index.html)
* Create Inline Events with [`event`](https://stackblitz.com/edit/typescript-t3fqo8?file=sampleWatch.ts)   
* Create custom events with [`emit`](https://stackblitz.com/edit/redgin-childtoparent?file=index.ts) 
* Inject Global Styles with [`injectStyles`](https://stackblitz.com/edit/redgin-bootstrap?file=index.ts)
* [Support Typescript](https://stackblitz.com/edit/typescript-ue61k6?file=index.ts)


## Install

### Plug & Play, Import directly from cdn

```js
// latest 
import { Redgin } from 'https://cdn.jsdelivr.net/gh/josnin/redgin@main/dist/redgin.min.js'

// or specific version
import { RedGin } from 'https://cdn.jsdelivr.net/gh/josnin/redgin@v0.1.15/dist/redgin.min.js'
```

### Or Install using NPM

```js
npm i redgin   
```

#### then import the library, helpers

```js
import { Redgin, propReflect, getset, watch, event, emit, html, css } from 'redgin'
```


## How to use?
### Inline Events
it uses <code>event</code> directive to create event listener behind the scene and automatically clear once the component is remove from DOM
```js
class Event extends RedGin { 
  render() {
    return html`<button 
                  ${ event('click', () => alert('Click Me') )} 
                >Submit</button>`
  } 
}
customElements.define('sample-event', Event);
```

### List Render (Reactive) 
* its uses <code>propReflect</code> to dynamically create reactive props reflection define in observedAttributes()
* its uses <code>watch</code> directives to rerender inside html when value change
```js
class Loop extends RedGin {
  arr = propReflect([1, 2, 3])
  static observedAttributes = ['arr'] 

  render() {    
    return html`<ul> ${ watch(['arr'], () => 
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
class If extends RedGin {
  isDisable = propReflect(false)
  static observedAttributes = ['is-disable']

  render() {
    return `
        ${ watch(['isDisable'], () => html`
                <button
                    ${ this.isDisable ?? `disable`}
                > Submit</button>`
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
 }) //for complex just define a setter/getter manually?

  
render() {       
  return `${ watch(['obj'], () => 
              html`<div>${ this.obj.id }</div>
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
               html`<span>ID:${e.id} Name:${e.name}</span>`)
            ) }`
}
```

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

