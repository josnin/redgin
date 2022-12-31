import { customPropBehaviors } from './props.js'

interface IGetSet {
  forWatch?: boolean;
}

// getset behavior
function getsetFn(this: any, prop: string, propValue: any, observedAttributes: any) {
    const { value: val, forWatch, name } = propValue

    if (name != 'getset') return

    this[`#${prop}`] = val

    Object.defineProperty(this, prop, {
      configurable: true,
      set (value) {
          // create a value placeholder 
          this[`#${prop}`] = value
          console.log(forWatch, prop)
          if (forWatch) this.updateContents(prop)
      },
      get () { return this[`#${prop}`]  }
    })  
}

// getset placeholder
export const getset = (value: any, options?: IGetSet) => {
  const defaults = {
    forWatch: true,
  };

  return { value, ...defaults, ...options, name: 'getset' }

}

customPropBehaviors.define(getsetFn)