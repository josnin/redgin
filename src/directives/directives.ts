
export function applyDirectives(this: any, prop: string): boolean {
    for (const directive of customDirectives.reg) {
        if (directive.call(this, prop)) {
            return true; // Early exit as soon as we find true
        }
    }
    return false;
}


export class customDirectives {

    static reg: any = [];

    static define(d: any) {
      customDirectives.reg.push(d)
    }

}