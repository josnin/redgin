
export function applyPropsBehavior(this: any, prop: string, propValue: string) {
    for (const p of customPropsBehavior.reg) {
        p.call(this, prop, propValue)
    }
}

export class customPropsBehavior {

    static reg: any = [];

    static define(p: any) {
      customPropsBehavior.reg.push(p)
    }

}