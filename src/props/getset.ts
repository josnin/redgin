import { customPropsBehavior } from './props'

interface IGetSet {
  forWatch?: boolean;
}

// getset behavior
function getsetFn(this: any, prop: string, propValue: any) {
    if (
      propValue === undefined || 
      propValue?.name != 'getset'
    ) return // only apply for 

    const { 
      value: _default, 
      forWatch
    } = propValue


    this[`#${prop}`] = _default

    Object.defineProperty(this, prop, {
      configurable: true,
      set (value) {
          // create a value placeholder 
          this[`#${prop}`] = value
          if (forWatch) {
            const withUpdate = this.updateContents(prop)
            if (withUpdate) this._onUpdated() //call when dom change
          }
      },
      get () { return this[`#${prop}`]  }
    })  
}

// getset placeholder
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

customPropsBehavior.define(getsetFn)
