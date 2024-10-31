export type WebGLHeatmap = {
	readonly addPoint: (
		x: number,
		y: number,
		scale: number,
		intensity: number
	) => void;
	readonly adjustSize: ( w: number, h: number ) => void;
	readonly clear: () => void;
	readonly display: () => void;
	readonly multiply: ( factor: number ) => void;
	readonly update: () => void;
};

export declare function createWebGLHeatmap( {
	canvas: HTMLCanvasElement,
} ): WebGLHeatmap;
