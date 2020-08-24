import {Point, Rectangle} from "./shape";

export interface Geometry {
  _as?:string;
}

export interface mxPoint extends Point, Geometry {
}

export interface mxArray extends Geometry {
  mxPoint?: mxPoint[];
}

export interface mxGeometry extends Rectangle, Geometry {
    mxPoints? : mxPoint[]
    Array?: Geometry[];
}