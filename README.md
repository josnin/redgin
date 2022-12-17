# RedGin
# Simplified library for building [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)

* Javascript Template literals for Template syntax
* Introduced Reactive Tags (div, span, ...)
* Getters/Setters is handled by RedGin
* Inline Events 
* Vanilla JS, Work on all JS framework


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



## Inline Events
### This creates event listeners behind the scene
```js
import { RedGin, click } from 'red-gin.js';

class Event extends RedGin { 
  render() {
    return `<button ${ click( () => alert('Click Me') )} >Submit</button>`
  }
 
}

customElements.define('sample-event', Event);

```

## List Render
### This creates getters/setters behind the scene to re-render
```js
import { RedGin, li } from 'red-gin.js';

class Loop extends RedGin {
  arr = [1, 2, 3]
  
  static get observedAttributes() { return ['arr'] }
  
  render() {
    
    return `<ul> ${ li('arr', () => 
                        this.arr.map( e => `Number: ${e}`) 
                       ).join('') 
                  } 
            </ul>`
    
    <!-- results
       <ul>
         <li>Number: 1</li>
         <li>Number: 2</li>
         <li>Number: 3</li>
       </ul>
    -->
  }
 
}

customElements.define('sample-event', Event);

```



## IF condition
### This creates getters/setters behind the scene to re-render
```js
import { RedGin, li } from 'red-gin.js';

class If extends RedGin {
  display = true
  
  static get observedAttributes() { return ['display'] }
  
  render() {
    return `
        <div>
             ${ this.display 
              ? `Boolean: ${this.display}` 
              : `Boolean: ${this.display} `}   
        </div>`      
  } 
}

customElements.define('sample-if', If);

```

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
