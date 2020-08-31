export interface ShapeCommand {}

export interface Point {
  x: number | string;
  y: number | string;
}

export interface Rectangle extends Point {
  width?: number | string;
  height?: number | string;
}

export interface move extends Point, ShapeCommand {}

export interface curve extends Rectangle, ShapeCommand {
  x1: number | string;
  y1: number | string;
  x2: number | string;
  y2: number | string;
  x3: number | string;
  y3: number | string;
}

export interface quad extends ShapeCommand {
  x1: number | string;
  y1: number | string;
  x2: number | string;
  y2: number | string;
  width?: number | string;
  height?: number | string;
}

export interface emptyParam {}
export interface pointParam { 
  _x: number;
  _y: number;
}
export interface quadParam { 
  _x1: number;
  _y1: number;
  _x2: number;
  _y2: number;
}

/**
  * 
 * Implements a canvas to be used with <mxImageExport>. This canvas writes all
 * calls as child nodes to the given root XML node.
 * 
 * (code)
 * scale           scale       sl
 * translate       translate   tr
 * rotate			rotate		rt
 * save            save        sv
 * restore         restore     rs
 * setDashed       dashed      ds
 * setDashPattern  dashpattern dp
 * setFontSize     fontsize    sz
 * setFontFamily   fontfamily  fm
 * setFontStyle    fontstyle   st
 * setFontColor    fontcolor   cl
 * setFillColor    fillcolor   fc
 * setStrokeColor  strokecolor sc
 * setStrokeWidth  strokewidth sw
 * setGradient     gradient    gr
 * setGlassGradient glass		gl
 * setAlpha        alpha       al
 * image           image       i
 * moveTo          move        m
 * lineTo          line        l
 * quadTo          quad        q
 * curveTo         curve       c
 * arcTo			arc			ar
 * rect            rect        r
 * roundrect       roundrect   rr
 * ellipse         ellipse     e
 * begin           begin       bg
 * end             end         en
 * close           close       cs
 * fill            fill        f
 * stroke          stroke      s
 * clip            clip        cp
 * fillAndStroke   fillstroke  fs
 * shadow          shadow      sh
 * text            text        t
 * (end)
 * 
 * TODO type all operations
 */
export interface CanvasCommand {
  move: pointParam;
  quad : quadParam;
  close : emptyParam;
  start : emptyParam;
  [command:string] : any;
}

export interface Background {
  path: {
    __elements: CanvasCommand[];
  }
}

export interface Foreground {
  path: {
    __elements: CanvasCommand[];
  }
}


/**
 * Example shape:
 * <shape name="or" aspect="variable">
 * 	<background>
 * 		<path>
 * 			<move x="0" y="0"/>
 * 			<quad x1="100" y1="0" x2="100" y2="50"/>
 * 			<quad x1="100" y1="100" x2="0" y2="100"/>
 * 			<close/>
 * 		</path>
 * 	</background>
 * 	<foreground>
 * 		<fillstroke/>
 * 	</foreground>
 * </shape>
 */
export interface Shape {
  _name?: string;
  _aspect?: string;
  background?:Background;
  foreground?:Foreground;
  points?: any[];
  fill?: any;
  stroke?: any;
  strokewidth?: number | string;
  arrowWidth?: number | string;
  spacing?: number | string;
  endSize?: number | string;
}

export interface Shapes {
  shape: Shape[];
}

export function isShapes(mxs: any): mxs is Shapes {
  if (mxs && mxs.shape) {
    return true;
  }
  return false;
}
