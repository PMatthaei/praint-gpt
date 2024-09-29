export namespace Extensions {

   export const checkNotNull = <T>(object: T | undefined | null) : T=> {
        if(object === undefined){
            throw new Error("IllegalState - Object was undefined.")
        }
        return object!!
    }
}
