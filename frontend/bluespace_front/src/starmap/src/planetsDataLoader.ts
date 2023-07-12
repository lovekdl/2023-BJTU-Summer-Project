import Papa from 'papaparse'
import planetsDataUrl from "../../assets/exoplanets-output_simplified_by_YXHXianYu.csv?url"

class PlanetsDataLoader {
    private data: any = undefined
    private constructor() {}
    private static instance: PlanetsDataLoader = new PlanetsDataLoader()
    private haveSetup: boolean = false
    
    public static getInstance() {
        return this.instance
    }

    async setup() {
        const that = this
        await new Promise(//create one promise
            (resolve,reject) => Papa.parse(planetsDataUrl, {
                header: true,
                download: true,
                skipEmptyLines: true,
                complete: resolve,//resolve the promise when complete
                error: reject//reject the promise if there is an error
            })
        ).then(function (results) {
            console.log("Planets Data: ", results) // log result from file 0
            that.data = results
            that.haveSetup = true
        }).catch(//log the error
            err=>console.warn("Something went wrong:",err)
        )
    }

    query(row: number): any {
        if(!this.haveSetup) {
            throw new Error("PlanetsDataLoader have no setup.")
        }
        if(row >= this.data.data.length) {
            throw new Error("Row exceed data's length")
        }
        return this.data.data[row]
    }

    length(): number {
        if(!this.haveSetup) {
            throw new Error("PlanetsDataLoader have no setup.")
        }
        return this.data.data.length
    }
}

export { PlanetsDataLoader }