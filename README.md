# RedGin
# Simplified library for building [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)

* Javascript [Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) for Template syntax
* Introduced Reactive Tags, Directives (watch, div, span, ...)
* Getters/Setters is handled by RedGin
* Inline Events 
* Vanilla JS, Works on all JS framework


## Use directly in browser

```html 

<!DOCTYPE html>
<html lang="en">
<head>       
    <script src="https://josnin.sgp1.digitaloceanspaces.com/redgin/dist/redgin.js"></script>
</head>
<body>
   <app-root></app-root>
    
   <script type="module">     
     class AppRoot extends RedGin {  
       render() { 
         return ` This is app root! `
       }
     }
     customElements.define('app-root', AppRoot);
   </script> 
    
</body>
</html>

```


## How to?
### Inline Events
it uses events tag ( click ) to create event listener behind the scene and automatically clear once the component is remove from DOM
```js
import { RedGin, click } from 'red-gin.js';

class Event extends RedGin { 
  render() {
    return `<button ${ click( () => alert('Click Me') )} >Submit</button>`
  }
 
}

customElements.define('sample-event', Event);

```

### List Render (Reactive) 
* dynamically create reactive props define in observedAttributes()
* its uses watch directives to rerender inside html when value change
```js
import { RedGin, watch } from 'red-gin.js';

class Loop extends RedGin {

  static get observedAttributes() { return ['arr'] } // dynamically create reactive props this.arr
  
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
#### results
```html

       <ul>
         <li>Number: 1</li>
         <li>Number: 2</li>
         <li>Number: 3</li>
       </ul>

```



### IF condition (Static)
```js
import { RedGin } from 'red-gin.js';

class If extends RedGin {
  isDisabled = true
  
  render() {
    return `<button 
                ${ this.isDisabled ? `disabled` : ``}
              > Submit
             </button>    
  } 
}

customElements.define('sample-if', If);

```

### IF condition (Reactive)
* dynamically create reactive props define in observedAttributes()
* its uses directive watch to rerender inside html when value change
```js
import { RedGin, watch } from "./red-gin.js";

class If extends RedGin {

  static get observedAttributes() { return ['is-disable']; } 
  // dynamically create camelCase props. ie. this.isDisable

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

obj = setget({
    id:1, 
    name:'John Doe'
 })

  
render() {       
  return `${ watch(['obj'], () => 
              `<div>${ this.obj.id }</div>
               <div>${ this.obj.name }</div>` 
           ) }`
}
```

### Render List of Obj (Reactive)
```js
onInit(): void {
  this.obj = [{id:1, name:'John Doe'}]
}
  
render() {       
  return `${ watch(['obj'], () => this.obj.map( (e: any) => 
               `<span>ID:${e.id} Name:${e.name}</span>`)
            ) }`
}
```

### Render with Simplified tag (Reactive)
* recommend to use div (span, etc.) directives for simple display of value
```js
onInit(): void {
  this.id = 1;
  this.name = 'Joh Doe'
}
  
render() {       
  return `
    ${ div('id') }
    ${ div('name') }`
  }
```

## Reference
https://web.dev/custom-elements-best-practices/

https://web.dev/shadowdom-v1/

## Installation 
```
npm install
```

## How to run development server? 
```
cd ~/Documents/redgin/
npm run build
npm start
```

## Help

Need help? Open an issue in: [ISSUES](https://github.com/josnin/redgin/issues)


## Contributing
Want to improve and add feature? Fork the repo, add your changes and send a pull request.

