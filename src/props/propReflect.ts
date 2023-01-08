import { getUniqID, kebabToCamel, camelToKebab } from '../utils.js'
import { customPropsBehavior } from './props.js'


interface IPropReflect<T = any> {
  serializerFn?: (this: any , prop: string, type: any, _default: T) => T 
  deserializerFn?: (this: any, prop: string, type: any, _default: T, value: T) => void
  type?: any
  name?: string
}

/*
* accepts list of regex
* all "aria" attributes have a corresponding props (aria-*)
* equivalent of "class" attribute in properties are "className" & "classList", 
* adding in observedAttributes can overwrite the existing props.
* same with id, dataset attr
* anything else?
*/
const IGNORE_PROP_REFLECTION = ['class', 'style', 'className', 
  'classList', 'id', 'dataset', '^data-', '^aria-']

/* 
* treat as a HTML standard boolean attrs
* presence of attr is true
* absence of attr is false
*/
const  BOOLEAN_ATTRIBUTES = ['disabled']

const isValidAttr = (attr: string) => {
    let isValid = true
    for (const regexPattern of IGNORE_PROP_REFLECTION) {
      const regex = new RegExp(regexPattern, 'g')
      if (attr.match(regex)) {
        isValid = false
        console.error(
          `Please remove attribute '${attr}' in the observedAttributes, 
          DOM already provided built-in props reflection for this attribute.`
        )
        break 
      }
    }
    return isValid
  }


// propReflect behavior
// this doesnt work in arrow func
function propReflectFn(this: any, _prop: string, propValue: any) {
    if (propValue === undefined || propValue.name != 'propReflect') return {id: 1, name: ''} // only apply for 

    const { type, value: _default, serializerFn, deserializerFn } = propValue
    // @ts-ignore
    const observedAttributes = this.constructor.observedAttributes
    const propCamel = kebabToCamel(_prop) 
    const prop = camelToKebab(_prop)
    
    if (observedAttributes === undefined || !observedAttributes.includes( prop )) {
      console.error(
        `Unable to apply propReflect '${propCamel}' for attribute '${prop}', 
        Please add '${prop}' in the observedAttributes of ${this.constructor.name} component`
      )
      return _default
    } 


    if (!isValidAttr(prop) === true) return _default



    // @todo need to organize attri setter/ getter?
    Object.defineProperty(this, propCamel, {
    configurable: true,
    set (value) {

        /* 
         * use deserialize fn if define
         */
        if (deserializerFn) {
          return deserializerFn.call(this, prop, type, _default, value)
        }

        if ( ( type === Boolean || typeof value === 'boolean' 
          || BOOLEAN_ATTRIBUTES.includes(prop) ) && value === true) {
          this.setAttribute(prop , '') 
        } else if ( ( type === Boolean 
          || BOOLEAN_ATTRIBUTES.includes(prop) ) && value === false) {
         this.removeAttribute(prop)
        } else if ( ( [Object, Array].includes(type) 
          || ['object', 'array'].includes(typeof value) ) && value) {
          this.setAttribute(prop , JSON.stringify(value) )
        } else if ( ([String, Number].includes(type) 
          || ['string', 'number'].includes(typeof value) ) && value) {
          this.setAttribute(prop , value)
        } else {
          this.removeAttribute(prop)
        }
    },
    get () { 

        /* 
         * use serialize function if define
         */
        if (serializerFn) {
          return serializerFn.call(this, prop, type, _default)
        }


        if (prop in BOOLEAN_ATTRIBUTES 
          || type === Boolean || typeof _default === 'boolean' ) {
          return this.hasAttribute(prop)
        } else {
          if ( ( [ String, Array, Object].includes(type) 
            || ['string', 'array', 'object'].includes(typeof _default) )  
            && !this.hasAttribute(prop)) {
              return _default
          } else if ( ( type === String || typeof _default === 'string' ) 
            && this.hasAttribute(prop)) {
              return this.getAttribute(prop)
          } else if ( (type === Number || typeof _default === 'number' ) 
            && this.hasAttribute(prop)) {
              return Number(this.getAttribute(prop))
          } else if ( ([Array, Object].includes(type) 
            || ['array', 'object'].includes(typeof _default) ) 
            && this.hasAttribute(prop)) {
              return JSON.parse(this.getAttribute(prop))
          }
        }

    }
    })  
}
  
export function propReflect<T>(value: T, options?: IPropReflect<T>): T 
export function propReflect(value: any, options?: IPropReflect) {
  return { value, ...options, name: 'propReflect' }
}

customPropsBehavior.define(propReflectFn)