
export function applyDirectives(this: any, prop: string) {
    let wUpdate: boolean[] = []
    for (const d of customDirectives.reg) {
        wUpdate.push(d.call(this, prop))
    }
    return wUpdate.filter(e => e === true).length > 0 //reupdate at least 1 true? 
}

export class customDirectives {

    static reg: any = [];

    static define(d: any) {
      customDirectives.reg.push(d)
    }

}