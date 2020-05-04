export const resolveValueOrFunction = (valueOrFunction, ...params) =>
  typeof valueOrFunction === 'function'
    ? valueOrFunction(...params)
    : valueOrFunction
