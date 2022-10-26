export function missingParameters(params) {
    //check if a parameter is missing
    for (const key in params) {
        if (!params[key]) {
            return [true, key];
        }
    }

    return [false, ""];
}