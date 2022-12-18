
export const getUniqID = () => {
  return crypto.randomUUID().split('-')[0]
}

export const camelToSnake = (str: string) => str.replace(/[A-Z]/g, (out_str: string) => `-${out_str.toLowerCase()}`);

export const snakeToCamel = (str: string) =>
  str.toLowerCase().replace(/([-_][a-z])/g, (out_str: string) =>
    out_str.toUpperCase().replace('-', '')
  );