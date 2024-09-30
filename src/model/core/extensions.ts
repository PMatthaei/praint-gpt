import colors from 'tailwindcss/colors'

export namespace Extensions {
    declare global {
        interface Array<T> {
            sample(): T;
    }
}
    export const checkNotNull = <T>(object: T | undefined | null): T => {
        if (object === undefined) {
            throw new Error("IllegalState - Object was undefined.")
        }
        return object!!
    }

    let randomColors = [
        "bg-pink-100",
        "bg-indigo-100",
        "bg-teal-100",
        "bg-blue-100",
        "bg-red-300",
        "bg-green-100",
        "bg-slate-300",
        "bg-gray-100",
        "bg-yellow-100",
        "bg-orange-100",
        "bg-purple-100",
    ]

    export const randomTailwindBackgroundColor = () => {
        console.log(randomColors.length)
        const sample = randomColors.sample();
        console.log(sample)
        randomColors = randomColors.filter(item => item !== sample)
        return sample
    }

    Array.prototype.sample = function(){
        return this[Math.floor(Math.random() * this.length)];
    }
}
