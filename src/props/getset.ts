import { customPropsBehavior } from './props.js'

interface IGetSet {
  forWatch?: boolean;
}

// getset behavior
function getsetFn(this: any, prop: string, propValue: any) {
    if (propValue === undefined || propValue.name != 'getset') return // only apply for 

    const { value: val, forWatch, name } = propValue


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

customPropsBehavior.define(getsetFn)