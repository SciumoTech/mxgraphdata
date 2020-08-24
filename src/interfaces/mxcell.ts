import {mxGeometry} from "./mxgeometry"
import {Style} from "./style";

export interface mxCell {
  _id: string;
  _value?: string;
  _style?: string | Style;

  _parent?: string;
  _vertex?: string;
  
  /**
   * If this is an edge
   */
  _source?: string;
  _target?: string;
  _edge?: string;

  edges?: mxCell[];
  children?: mxCell[];

  mxGeometry?: mxGeometry;
}