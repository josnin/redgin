
export const getUniqID = () => {
  return crypto.randomUUID().split('-')[0]
}