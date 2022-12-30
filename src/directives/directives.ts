
export function applyDirectives(this: any, prop: string) {
    let wUpdate = false
    for (const d of customDirectives.reg) {
        wUpdate = d.call(this, prop)
    }
    return true // @todo at least 1 true means true
}

export class customDirectives {

    static reg: any = [];

    static define(d: any) {
      customDirectives.reg.push(d)
    }

}