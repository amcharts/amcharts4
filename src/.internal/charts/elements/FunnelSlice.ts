/**
 * Module that defines everything related to building Funnel slices.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../../core/Container";
import { Sprite } from "../../core/Sprite";
import { registry } from "../../core/Registry";
import { percent, Percent } from "../../core/utils/Percent";
import * as $utils from "../../core/utils/Utils";
import { Orientation } from "../../core/defs/Orientation";
import { IPoint } from "../../core/defs/IPoint";
import * as $path from "../../core/rendering/Path";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[FunnelSlice]].
 */
export interface IFunnelSliceProperties extends IContainerProperties {

	/**
	 * Width of the top edge of the slice.
	 */
	topWidth?: number | Percent;

	/**
	 * Width of the bottom edge of the slice.
	 */
	bottomWidth?: number | Percent;

	/**
	 * A relative distance slice's sides should be bent to.
	 *
	 * @default 0
	 */
	expandDistance?: number;

	/**
	 * Orientation of the slice.
	 */
	orientation?: Orientation;
}

/**
 * Defines events for [[FunnelSlice]].
 */
export interface IFunnelSliceEvents extends IContainerEvents { }

/**
 * Defines adapters for [[FunnelSlice]].
 *
 * @see {@link Adapter}
 */
export interface IFunnelSliceAdapters extends IContainerAdapters, IFunnelSliceProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Class used to create [[FunnelSlice]] elements.
 *
 * @see {@link IFunnelSliceEvents} for a list of available events
 * @see {@link IFunnelSliceAdapters} for a list of available adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/sliced-chart/} for documentation
 * @important
 */
export class FunnelSlice extends Container {

	/**
	 * Defines available properties.
	 */
	public _properties!: IFunnelSliceProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IFunnelSliceAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IFunnelSliceEvents;

	/**
	 * Main slice element.
	 */
	public slice: Sprite;

	/**
	 * Am anchor point the slice tick line is pointing to.
	 *
	 * @ignore Exclude from docs
	 * @readonly
	 */
	public tickPoint: IPoint;

	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.slice = this.createChild(Sprite);
		this.slice.shouldClone = false;
		this.slice.setElement(this.paper.add("path"));
		this.slice.isMeasured = false;

		this.orientation = "vertical";
		this.bottomWidth = percent(100);
		this.topWidth = percent(100);
		this.isMeasured = false;

		this.width = 10;
		this.height = 10;

		this.expandDistance = 0;

		this.className = "FunnelSlice";

		this.applyTheme();
	}

	/**
	 * Draws the element.
	 */
	protected draw(): void {
		super.draw();

		let pt = this.pixelPaddingTop;
		let pb = this.pixelPaddingBottom;
		let pr = this.pixelPaddingRight;
		let pl = this.pixelPaddingLeft;

		let w = this.pixelWidth - pr - pl;
		let h = this.pixelHeight - pt - pb;

		let ed = this.expandDistance;

		let path = "";


		if (this.orientation == "vertical") {
			let tw = $utils.relativeToValue(this.topWidth, w);
			let bw = $utils.relativeToValue(this.bottomWidth, w);

			let tl = { x: (w - tw) / 2 + pl, y: pt };
			let tr = { x: (w + tw) / 2 + pl, y: pt };

			let br = { x: (w + bw) / 2 + pl, y: pt + h };
			let bl = { x: (w - bw) / 2 + pl, y: pt + h };

			let cpr = { x: tr.x + (br.x - tr.x) / 2 + ed * h, y: tr.y + 0.5 * h };
			let cpl = { x: tl.x + (bl.x - tl.x) / 2 - ed * h, y: tl.y + 0.5 * h };

			let qp1 = $path.lineTo(br);
			let qp2 = "";

			if(ed != 0){
				qp1 = $path.quadraticCurveTo(br, cpr);
				qp2 = $path.quadraticCurveTo(tl, cpl);
			}

			path = $path.moveTo(tl) + $path.lineTo(tr) + qp1 + $path.lineTo(bl) + qp2;

			this.tickPoint = { x: tr.x + (br.x - tr.x) / 2, y: tr.y + (br.y - tr.y) / 2 };
		}
		else {
			let tw = $utils.relativeToValue(this.topWidth, h);
			let bw = $utils.relativeToValue(this.bottomWidth, h);

			let tt = { x: pl, y: (h - tw) / 2 + pt };
			let tb = { x: pl, y: (h + tw) / 2 + pt };

			let bt = { x: pl + w, y: (h - bw) / 2 + pt };
			let bb = { x: pl + w, y: (h + bw) / 2 + pt };

			let cpr = { y: tt.y + (bt.y - tt.y) / 2 - ed * w, x: tt.x + 0.5 * w };
			let cpl = { y: tb.y + (bb.y - tb.y) / 2 + ed * w, x: tb.x + 0.5 * w };

			let qp1 = $path.lineTo(bt);
			let qp2 = ""
			if(ed != 0){
				qp1 = $path.quadraticCurveTo(bt, cpr);
				qp2 = $path.quadraticCurveTo(tb, cpl);
			}

			path = $path.moveTo(tb) + $path.lineTo(tt) + qp1 + $path.lineTo(bb) + qp2;

			this.tickPoint = { y: tb.y + (bb.y - tb.y) / 2, x: tb.x + (bb.x - tb.x) / 2 };
		}

		this.slice.path = path;
		this.invalidateLayout();
	}


	getPoint(locationX:number, locationY:number):IPoint{

		let pt = this.pixelPaddingTop;
		let pb = this.pixelPaddingBottom;
		let pr = this.pixelPaddingRight;
		let pl = this.pixelPaddingLeft;

		let w = this.pixelWidth - pr - pl;
		let h = this.pixelHeight - pt - pb;

		if (this.orientation == "vertical") {
			let tw = $utils.relativeToValue(this.topWidth, w);
			let bw = $utils.relativeToValue(this.bottomWidth, w);

			let tl = { x: (w - tw) / 2 + pl, y: pt };
			let tr = { x: (w + tw) / 2 + pl, y: pt };

			let br = { x: (w + bw) / 2 + pl, y: pt + h };
			let bl = { x: (w - bw) / 2 + pl, y: pt + h };

			let mlx = tl.x + (bl.x - tl.x) * locationY;
			let mrx = tr.x + (br.x - tr.x) * locationY;

			return { x: mlx + (mrx - mlx) * locationX, y: tr.y + (br.y - tr.y) * locationY };
		}
		else {
			let tw = $utils.relativeToValue(this.topWidth, h);
			let bw = $utils.relativeToValue(this.bottomWidth, h);

			let tt = { x: pl, y: (h - tw) / 2 + pt };
			let tb = { x: pl, y: (h + tw) / 2 + pt };

			let bt = { x: pl + w, y: (h - bw) / 2 + pt };
			let bb = { x: pl + w, y: (h + bw) / 2 + pt };

			let mty = tt.y + (bt.y - tt.y) * locationX;
			let mby = tb.y + (bb.y - tb.y) * locationX;

			return { y: mty + (mby - mty) * locationY, x: tt.x + (bt.x - tt.x) * locationX };
		}

	}


	/**
	 * Bottom width in pixels or percent.
	 *
	 * IMPORTANT: this setting might be used to set dimensions if you use slice
	 * as a standalone element. If it's a part of [[FunnelSeries]] this setting
	 * becomes read-only as it will be automatically reset by series.
	 *
	 * @param value  Bottom width
	 */
	public set bottomWidth(value: number | Percent) {
		this.setPercentProperty("bottomWidth", value, true, false, 10, false);
	}

	/**
	 * @return bottom width
	 */
	public get bottomWidth(): number | Percent {
		return this.getPropertyValue("bottomWidth");
	}

	/**
	 * Top width in pixels or percent.
	 *
	 * IMPORTANT: this setting might be used to set dimensions if you use slice
	 * as a standalone element. If it's a part of [[FunnelSeries]] this setting
	 * becomes read-only as it will be automatically reset by series.
	 *
	 * @param value  Top width
	 */
	public set topWidth(value: number | Percent) {
		this.setPercentProperty("topWidth", value, true, false, 10, false);
	}

	/**
	 * @return Top width
	 */
	public get topWidth(): number | Percent {
		return this.getPropertyValue("topWidth");
	}

	/**
	 * Orientation of the funnel slice: "horizontal" or "vertical".
	 *
	 * IMPORTANT: this setting might be used to set orintation if you use slice
	 * as a standalone element. If it's a part of [[FunnelSeries]] this setting
	 * becomes read-only as it will be automatically reset by series.
	 *
	 * @param value  Orientation
	 */
	public set orientation(value: Orientation) {
		this.setPropertyValue("orientation", value, true);
	}

	/**
	 * @return Orientation
	 */
	public get orientation(): Orientation {
		return this.getPropertyValue("orientation");
	}

	/**
	 * A relative distance slice's sides should be bent to. It's relative to the
	 * height of the slice.
	 *
	 * Zero (default) will mean the sides will be perfectly straight.
	 *
	 * Positive value will make them bend outwards, resulting in "puffed" slices.
	 *
	 * Negative values will make them bend inwards.
	 *
	 * @default 0
	 * @param {number}
	 */
	public set expandDistance(value: number) {
		this.setPropertyValue("expandDistance", value, true);
	}

	/**
	 * @return expandDistance
	 */
	public get expandDistance(): number {
		return this.getPropertyValue("expandDistance");
	}

	/**
	 * Copies all parameters from another [[Sprite]].
	 *
	 * @param source Source Sprite
	 */
	public copyFrom(source :this) {
		super.copyFrom(source);
		if (this.slice) {
			this.slice.copyFrom(source.slice);
		}
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["FunnelSlice"] = FunnelSlice;
