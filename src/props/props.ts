
export function applyPropsBehavior(this: any, prop: string, propValue: string, observedAttributes: any) {
    for (const p of customPropsBehavior.reg) {
        p.call(this, prop, propValue, observedAttributes)
    }
}

export class customPropsBehavior {

    static reg: any = [];

    static define(p: any) {
      customPropsBehavior.reg.push(p)
    }

}