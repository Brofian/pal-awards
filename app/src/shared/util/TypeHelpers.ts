/**
 * Create a Type with the same keys and values as T, but every key is prefixed with P.
 */
type PrefixKeys<P extends string, T> = {
    [K in keyof T as K extends string ? `${P}${K}` : K]: T[K]
};
export {type PrefixKeys};

/**
 * TypeScript does not infer from string concatenations. Use this function to add the typing assertion to the concatenation.
 */
export function concatString<A extends string, B extends string>(first: A, second: B): `${A}${B}` {
    return `${first}${second}`;
}



/**
 * Create a Type with the same keys as T, but with values of type A and an additional property "data", that
 * contains the original values of T.
 */
type WrapValues<T, A> = {
    [K in keyof T]: A & {
    data: T[K];
};
};
export {type WrapValues};