
interface IGetSet {
  forWatch?: boolean;
}

// getset behavior
export function getsetFn(this: any, prop: string, forWatch: boolean, value: any) {

    this[`#${prop}`] = value

    Object.defineProperty(this, prop, {
      configurable: true,
      set (value) {
          // create a value placeholder 
          this[`#${prop}`] = value
          this.updateContents(prop)
      },
      get () { return this[`#${prop}`]  }
    })  
}

// getset placeholder
export const getset = (value: any, options?: IGetSet) => {
  return { value, ...options, name: 'getset' }

}