import _ from 'lodash'

export function argmax(a:number[]) {
return +(_.maxBy(Object.entries(a), o => o[1])?.[0])
}
