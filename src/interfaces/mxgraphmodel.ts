
import {Rectangle} from "./shape";
import {mxCell} from "./mxcell";

export interface mxGraphModel {
    _dx: string;
    _dy: string;
    _grid: string;
    _gridSize:string;
    _guides: string;
    _tooltips: string;
    _connect: string;
    _arrows: string;
    _fold: string;
    _page: string;
    _pageScale: string;
    _pageWidth: string;
    _pageHeight: string;
    _background: string;
    _math: string;
    _shadow: string;
    root: {
      mxCell: mxCell[];
    }
}

export function isMxGraphModel( mxgm: any ) : mxgm is mxGraphModel {
  if( mxgm && mxgm.root && mxgm.prototype.mxCell ){
    return true;
  }
  return false;
}