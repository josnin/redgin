# RedGin
# ~5.3kb Simplified library for building [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components), works on Vanilla JS / all JS framework

* Use Javascript [Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) for Template syntax
* Rerender element with <code>watch</code>  
* Create getter/setters with <code>getset</code> 
* Create Property reflection with <code>propReflect</code>
* Create Inline Events with <code>event</code> 
* Create custom events with <code>emit</code> 
* Inject Global Styles with <code>injectStyles</code>
* Support Typescript



## Use directly in browser

```html 

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RedGin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
</head>
<body>


    <script type="module">

        /* to handle flicker add spinner?? */
        document.body.innerHTML = `
            <div class="spinner-grow" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        `

         import("https://josnin.sgp1.cdn.digitaloceanspaces.com/redgin/redgin.min.js")
            .then( ({ injectStyles }) => {
                /* 
                 * inject global styles to all components 
                 */
                injectStyles.push('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">')

                /* load components */
                import('./bootStrap.js')

               /* to handle flicker */
               document.body.innerHTML = `
                    <btn-bootstrap></btn-bootstrap>
                `

            })
            .catch((err) => console.log(err))

    </script> 
    
</body>
</html>

```


## How to?
### Inline Events
it uses events tag ( click ) to create event listener behind the scene and automatically clear once the component is remove from DOM
```js
import { RedGin, click } from 'https://josnin.sgp1.cdn.digitaloceanspaces.com/redgin/redgin.min.js';

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
import { RedGin, watch } from 'https://josnin.sgp1.cdn.digitaloceanspaces.com/redgin/redgin.min.js';

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
import { RedGin } from 'https://josnin.sgp1.cdn.digitaloceanspaces.com/redgin/redgin.min.js';

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
import { RedGin, watch } from "https://josnin.sgp1.cdn.digitaloceanspaces.com/redgin/redgin.min.js";

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
onInit(): void {
  this.obj = [{id:1, name:'John Doe'}]
}
  
render() {       
  return `${ watch(['obj'], () => this.obj.map( (e: any) => 
               `<span>ID:${e.id} Name:${e.name}</span>`)
            ) }`
}
```



### PropReflect Custom
Can only define single variable to each attr
IF define , auto creation of attr props is ignored
```js
msg = propReflect('Hello?', {  type: String } ) 
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
npm run dev
```

## Help

Need help? Open an issue in: [ISSUES](https://github.com/josnin/redgin/issues)


## Contributing
Want to improve and add feature? Fork the repo, add your changes and send a pull request.

