# RedGin
# Simplified library for building [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)

* Javascript [Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) for Template syntax
* Introduced Reactive Tags (div, span, ...)
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



## Inline Events
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

## List Render (Reactive) 
* its uses reactive tag ( li ) and the variable is required to add in the observedAttributes()
* auto generate element tag ```<li></li>``` that can react to value change
* getters/setters are created automatically.
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



## IF condition (Static)
```js
import { RedGin } from 'red-gin.js';

class If extends RedGin {
  display = true
  
  render() {
    return `
        <div>
             ${ this.display 
              ? `Display: ${this.display}` 
              : `Display: ${this.display} `}   
        </div>`      
  } 
}

customElements.define('sample-if', If);

```

## IF condition (Reactive)
* its uses reactive tag ( span ) and the variable is required to add in the observedAttributes()
* auto generate element tag ```<span></span>``` that can react to value change
* getters/setters are created automatically. 
```js
import { RedGin, span } from "./red-gin.js";

class If extends RedGin {
  display: boolean = true

  static get observedAttributes() { return ['display']; }

  render() {
    return `
        ${ span('display', () => 
            this.display ? 
                `Display: ${ this.display }` : 
                `Display: ${ this.display }`
            ) 
        }
    `
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
