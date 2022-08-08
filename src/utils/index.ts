let timer: NodeJS.Timeout
export function debounce<T extends (..._: any[]) => void>(fn: T, time = 2000) {
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), time)
  }
}

export type TransUnCapitalize<T> = {
  [P in keyof T as `${Uncapitalize<string & P>}`]: Exclude<T[P], undefined> extends number | string
    ? T[P]
    : Exclude<T[P], undefined> extends Array<infer E>
    ? Array<TransUnCapitalize<E>>
    : TransUnCapitalize<T[P]>
}

export function ToUnCapitalize<T>(_: T[]): TransUnCapitalize<T>[]
export function ToUnCapitalize<T>(_: T): TransUnCapitalize<T>
export function ToUnCapitalize<T>(valueObj: T | T[]) {
  if (isArray(valueObj)) {
    return valueObj.map((v) => ToUnCapitalize(v))
  }

  if (isObject(valueObj)) {
    const entries = Object.entries(valueObj)
    const mappedEntries = entries.map(([k, v]) => [
      `${k.substr(0, 1).toLowerCase()}${k.substr(1)}`,
      ToUnCapitalize(v),
    ])
    return Object.fromEntries(mappedEntries)
  }

  return valueObj
}

function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`
}

function isObject(val: any): val is Record<any, any> {
  return val !== null && is(val, 'Object')
}

function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val)
}
