export interface Country2 {
    country: string;
    continent_code: string;
    continent: string;
    maps: Array<string>;
}
export interface Countries2 {
    [key: string]: Country2;
}
export interface Countries {
    [key: string]: Array<string>;
}
