

export interface ShapeCommand  {
}

export interface Point {
  x : number|string;
  y : number|string;
}

export interface Rectangle extends Point {
  width? : number|string;
  height? : number|string;
}

export interface move extends Point, ShapeCommand {
}

export interface curve extends Rectangle, ShapeCommand {
  x1  : number|string;
  y1 : number|string;
  x2  : number|string;
  y2 : number|string;
  x3  : number|string;
  y3 : number|string;
}

export interface quad extends ShapeCommand {
  x1  : number|string;
  y1 : number|string;
  x2  : number|string;
  y2 : number|string;
  width? : number|string;
  height? : number|string;
}

export interface Path extends ShapeCommand {

}

export interface Background {

}

export interface Foreground {
  
}

export interface Shape {
  name?:string;
  aspect?: string;
  points?: any[];
  fill?: any;
  stroke?: any;
  strokewidth?: number|string;
  arrowWidth?: number|string;
  spacing?: number|string;
  endSize?: number|string;
}

export interface Shapes {
  shape: Shape[];
}

export function isShapes( mxs: any ) : mxs is Shapes {
  if( mxs && mxs.shape ){
    return true;
  }
  return false;
}