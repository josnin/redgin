import { kebabToCamel } from './utils.js'

interface IPropReflect {
  type?: any;
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
        console.error(`Unable to apply auto propReflection of '${attr}' 
        defined in observedAttributes`)
        break 
      }
    }
    return isValid
  }

// propReflect behavior
// this doesnt work in arrow func
export function propReflectFn(this: any, prop: string, type: any, val: any, observedAttributes: string ) {
  
    if (!observedAttributes.includes(prop)) {
      console.error(`Unable to apply propReflect for '${prop}', Please add '${prop}' in the observedAttributes`)
      return
    } 

    if (!isValidAttr(prop) === true) return

    Object.defineProperty(this, kebabToCamel(prop), {
    configurable: true,
    set (value) {
        // @todo to proceed check first if value change 
        if (BOOLEAN_ATTRIBUTES.includes(prop) && value === true) {
        this.setAttribute(prop, '') 
        } else if (BOOLEAN_ATTRIBUTES.includes(prop) && value === false) {
        this.removeAttribute(prop)
        } else {
        this.setAttribute(prop, value)
        }
    },
    get () { 
        if (prop in BOOLEAN_ATTRIBUTES) {
        return this.hasAttribute(prop)
        } else {
        // @todo defining variable at the top most will always overwrite by this
        // ex. arr:any = [1] 
        if ([Boolean, String, Array, Object].includes(type) && !this.hasAttribute(prop)) {
            return val
        } else if ([Boolean, Array, Object].includes(type) && this.hasAttribute(prop)) {
            return JSON.parse(this.getAttribute(prop))
        } else if ([String].includes(type) && this.hasAttribute(prop)) {
            return this.getAttribute(prop)
        }
        }
    }
    })  
}
  
// propReflect placeholder
export const propReflect = (value: any, options?: IPropReflect) => {
  return { value, ...options, name: 'propReflect' }

}