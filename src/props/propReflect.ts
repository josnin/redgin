import { getUniqID, kebabToCamel, camelToKebab } from '../utils'
import { customPropsBehavior } from './props'

/**
 * Interface for propReflect options.
 * Allows custom conversion logic and explicit type declarations.
 */
interface IPropReflect<T = any> {
  // Custom function to transform an attribute value back into a JS property
  serializerFn?: (this: any, prop: string, type: any, _default: T) => T
  // Custom function to transform a JS property into a DOM attribute
  deserializerFn?: (this: any, prop: string, type: any, _default: T, value: T) => void
  type?: any     // Explicit constructor (Boolean, Object, String, etc.)
  name?: string  // Internal identifier for the behavior
}

/* -----------------------------
 * Built-in attribute ignore list
 * ----------------------------- */
// Prevents RedGin from overriding standard browser behaviors or causing infinite loops 
// with sensitive attributes like 'id' or 'class'.
const IGNORE_PROP_REFLECTION = [
  '^class$', '^style$', '^className$', '^classList$', '^dataset$', '^data-', '^aria-',
  '^hidden$', '^tabindex$', '^slot$', '^contenteditable$', '^draggable$', '^spellcheck$'
]
const IGNORE_REGEX = IGNORE_PROP_REFLECTION.map(p => new RegExp(p))

// Standard HTML boolean attributes that don't require "true"/"false" strings, just presence/absence.
const BOOLEAN_ATTRIBUTES = new Set(['disabled', 'hidden', 'checked', 'selected', 'readonly', 'multiple'])

/**
 * Validates if an attribute is safe to reflect.
 * Shows a warning if the developer tries to override global HTML attributes.
 */
const isValidAttr = (attr: string) => {
  for (const r of IGNORE_REGEX) {
    if (r.test(attr)) {
      console.error(
        `Please remove attribute '${attr}' from observedAttributes; browser already provides built-in reflection.`
      )
      return false
    }
  }
  return true
}

/* -----------------------------
 * propReflect behavior
 * ----------------------------- */
/**
 * Core directive for property-to-attribute synchronization.
 * This runs during the component setup phase.
 */
function propReflectFn(this: any, _prop: string, propValue: any) {
  // Guard: Only process properties explicitly marked with propReflect()
  if (!propValue || propValue.name !== 'propReflect') return

  const { type, value: _default, serializerFn, deserializerFn } = propValue
  
  // Reflection requires the property to be listed in the Web Component's observedAttributes
  // @ts-ignore
  const observedAttributes = this.constructor.observedAttributes
  const propCamel = kebabToCamel(_prop) // JS Name: myProp
  const prop = camelToKebab(_prop)     // HTML Name: my-prop

  // Ensure the developer didn't forget to observe the attribute
  if (!observedAttributes?.includes(prop)) {
    console.error(
      `propReflect '${propCamel}' cannot map to '${prop}'. Add '${prop}' to observedAttributes of ${this.constructor.name}.`
    )
    return
  }

  if (!isValidAttr(prop)) return

  /**
   * DATA TYPE DETECTION
   * Determines how to stringify/parse values based on the default value or explicit type.
   */
  const isBoolean = type === Boolean || BOOLEAN_ATTRIBUTES.has(prop) || typeof _default === 'boolean'
  const isObjectLike = type === Object || type === Array || ['object', 'array'].includes(typeof _default)
  const isStringOrNumber = type === String || type === Number || ['string', 'number'].includes(typeof _default)

  /**
   * PROPERTY INTERCEPTION
   * Redefines the property on the instance so that setting 'this.myProp = val' 
   * automatically triggers 'this.setAttribute("my-prop", val)'.
   */
  Object.defineProperty(this, propCamel, {
    configurable: true,
    
    // Setter: JS -> DOM (Attribute)
    set(value: any) {
      // Use custom logic if provided
      if (deserializerFn) return deserializerFn.call(this, prop, type, _default, value)
      
      if (isBoolean) {
        // Boolean reflection: attribute exists = true, removed = false
        value ? this.setAttribute(prop, '') : this.removeAttribute(prop)
      } else if (isObjectLike && value != null) {
        // Object reflection: Stringify to JSON
        this.setAttribute(prop, JSON.stringify(value))
      } else if (isStringOrNumber && value != null) {
        // Primitive reflection: Direct set
        this.setAttribute(prop, value)
      } else {
        // Null/Undefined: Remove the attribute entirely
        this.removeAttribute(prop)
      }
    },
    
    // Getter: DOM (Attribute) -> JS
    get() {
      // Use custom logic if provided
      if (serializerFn) return serializerFn.call(this, prop, type, _default)
      
      if (isBoolean) return this.hasAttribute(prop)
      
      // If attribute is missing, always return the original default value
      if (!this.hasAttribute(prop)) return _default
      
      if (isObjectLike) {
        try {
          return JSON.parse(this.getAttribute(prop)!)
        } catch (e) {
          return _default // Return default if JSON parsing fails
        }
      }
      
      if (isStringOrNumber) {
        const attrVal = this.getAttribute(prop)
        return type === Number ? Number(attrVal) : attrVal
      }
      
      return this.getAttribute(prop)
    }
  })
}

/* -----------------------------
 * Factory function
 * ----------------------------- */
/**
 * Marks a property for reflection.
 * Usage: myProp = propReflect(false)
 */
export function propReflect<T>(value: T, options?: IPropReflect<T>): T
export function propReflect(value: any, options?: IPropReflect) {
  // Returns a descriptor object that the RedGin core uses to set up the defineProperty logic
  return { value, ...options, name: 'propReflect' }
}

// Register the behavior globally for the RedGin core to pick up
customPropsBehavior.define(propReflectFn)
