export interface Polygon {
    type: "Polygon";
    coordinates: Array<Array<[number, number]>>;
}
export interface MultiPolygon {
    type: "MultiPolygon";
    coordinates: Array<Array<Array<[number, number]>>>;
}
export interface MultiLineString {
    type: "MultiLineString";
    coordinates: Array<Array<[number, number]>>;
}
export interface Feature {
    type: "Feature";
    geometry: Polygon | MultiPolygon | MultiLineString;
    properties: object;
    id: string;
}
export interface FeatureCollection {
    type: "FeatureCollection";
    features: Array<Feature>;
}
