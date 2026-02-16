import { customPropsBehavior } from './props'

/**
 * Options for the getset behavior.
 * forWatch: determines if changing this property should trigger a DOM update.
 */
interface IGetSet {
  forWatch?: boolean;
}

/**
 * Core directive for internal state management.
 * Intercepts property access to trigger the RedGin update lifecycle.
 */
function getsetFn(this: any, prop: string, propValue: any) {
    // Only apply to properties initialized with getset()
    if (
      propValue === undefined || 
      propValue?.name != 'getset'
    ) return 

    const { 
      value: _default, 
      forWatch
    } = propValue

    // Use a private-like symbol or prefix to store the actual value
    const internalKey = `#${prop}`
    this[internalKey] = _default

    Object.defineProperty(this, prop, {
      configurable: true,
      /**
       * Setter: Updates the internal value and notifies the core to 
       * schedule a re-render if forWatch is true.
       */
      set(value) {
          const oldVal = this[internalKey]
          if (oldVal === value) return // Dirty check: skip if value is identical

          this[internalKey] = value
          
          if (forWatch) {
            /**
             * UPDATED FOR NEW CORE:
             * requestUpdate(prop) adds the property to the _changed Set 
             * and schedules a _flush() via queueMicrotask.
             */
            this.requestUpdate(prop)
          }
      },
      /**
       * Getter: Simply returns the internal value.
       */
      get() { 
        return this[internalKey] 
      }
    })  
}

/**
 * Factory function to mark a property as reactive state.
 * Usage: myData = getset(0)
 */
export function getset<T>(value: T, options?: IGetSet): T 
export function getset(value: any, options?: IGetSet) {
  const defaults = {
    forWatch: true,
  };

  return { 
    value, 
    ...defaults, 
    ...options, 
    name: 'getset' 
  }
}

// Register with the Props behavior engine
customPropsBehavior.define(getsetFn)
