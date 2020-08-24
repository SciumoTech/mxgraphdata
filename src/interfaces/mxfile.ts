import {diagram} from "./diagram";

export interface mxfile {
  _host?: string;
  _modified?: string;
  _agent?: string;
  _tag?: string;
  _version:string;
  _type?:string;
  /**
   * diagram may be compressed
   */
  diagram: diagram;  
}


export function isMxFile( mxf: any ) : mxf is mxfile {
  if( mxf && mxf._version && mxf.diagram ){
    return true;
  }
  return false;
}
