# RedGin
# Simplified library for building [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)

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

## Installation 
```
npm install
```

## How to run development server? 
```
cd ~/Documents/libweb/
npm run build
npm start
```
