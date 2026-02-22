

export function getUniqID(): string {
  return 'id-' + Math.random().toString(16).slice(2) + '-' + Date.now()
}


export const camelToKebab = (str: string) => str.replace(/[A-Z]/g, (out_str: string) => `-${out_str.toLowerCase()}`);

export const kebabToCamel = (str: string) =>
  str.replace(/-./g, x=>x[1].toUpperCase())
  //str.toLowerCase().replace(/([-_][a-z])/g, (out_str: string) =>
  //  out_str.toUpperCase().replace('-', '')
  //);
