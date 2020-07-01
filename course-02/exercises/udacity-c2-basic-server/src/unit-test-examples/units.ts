// Super Simple Unit Functions

export const add = (a: number, b: number) => {
    return a + b;
};

export const divide = (a: number, b: number) => {
    if (b === 0) {
        throw new Error("div by 0");
    }

    return a / b;
};

// @TODO try creating a method "concat" to concatenate two strings
// it should take two string paramaters.
// it should return one string combining the two strings.
// it should throw an error if either of the strings are empty.
// ensure your function is exported.

export const contact = (s1: String, s2: String) => {
    if ((s1 !== undefined && s1.length === 0) || (s2 != undefined && s2.length === 0)) {
        throw new Error("Neither of two strings can be empty.");
    }

    return `${s1}${s2}`;
};
