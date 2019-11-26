/**
 * Line series module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { XYSeries, XYSeriesDataItem, IXYSeriesProperties, IXYSeriesDataFields, IXYSeriesAdapters, IXYSeriesEvents } from "./XYSeries";
import { Sprite, visualProperties } from "../../core/Sprite";
import { Container } from "../../core/Container";
import { ListTemplate, ListDisposer } from "../../core/utils/List";
import { IPoint } from "../../core/defs/IPoint";
import { LineSeriesSegment } from "./LineSeriesSegment";
import { Axis, AxisDataItem } from "../axes/Axis";
import { ValueAxis } from "../axes/ValueAxis";
import { DateAxis } from "../axes/DateAxis";
import { CategoryAxis } from "../axes/CategoryAxis";
import { registry } from "../../core/Registry";
import { Line } from "../../core/elements/Line";
import { Label } from "../../core/elements/Label";
import { Rectangle } from "../../core/elements/Rectangle";
import * as $iter from "../../core/utils/Iterator";
import * as $object from "../../core/utils/Object";
import * as $type from "../../core/utils/Type";
import * as $array from "../../core/utils/Array";
import { LegendDataItem } from "../Legend";
import { Bullet } from "../elements/Bullet";

/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[LineSeries]].
 *
 * @see {@link DataItem}
 */
export class LineSeriesDataItem extends XYSeriesDataItem {

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: LineSeries;

	/**
	 * Point of line series data item
	 */
	public point: IPoint;

	/**
	 * A reference to a segment object, used for getting proper colors for tooltips
	 */
	public segment: LineSeriesSegment;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "LineSeriesDataItem";
	}

	// @todo: minimums/maximums

}


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines data fields for [[LineSeries]].
 */
export interface ILineSeriesDataFields extends IXYSeriesDataFields { }

/**
 * Defines properties for [[LineSeries]].
 */
export interface ILineSeriesProperties extends IXYSeriesProperties {

	/**
	 * Horizontal tension setting of the line (0-1).
	 *
	 * Used for smoothed lines.
	 *
	 * @default 1
	 */
	tensionX?: number;

	/**
	 * Vertical tension setting of the line (0-1).
	 *
	 * Used for smoothed lines.
	 *
	 * @default 1
	 */
	tensionY?: number;

	/**
	 * Connect the lines over empty data points?
	 *
	 * @default true
	 */
	connect?: boolean;

	/**
	 * If `connect = false` and distance between two data points is bigger
	 * than `baseInterval * autoGapCount`, a line will break automatically.
	 *
	 * @default 1.1
	 */
	autoGapCount?: number;
}

/**
 * Defines events for [[LineSeries]].
 */
export interface ILineSeriesEvents extends IXYSeriesEvents { }

/**
 * Defines adapters for [[LineSeries]].
 *
 * @see {@link Adapter}
 */
export interface ILineSeriesAdapters extends IXYSeriesAdapters, ILineSeriesProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Defines [[Series]] for a line graph.
 *
 * @see {@link ILineSeriesEvents} for a list of available Events
 * @see {@link ILineSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
export class LineSeries extends XYSeries {

	/**
	 * Defines the type of data fields used for the series.
	 */
	public _dataFields: ILineSeriesDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: ILineSeriesProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ILineSeriesAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ILineSeriesEvents;

	/**
	 * Defines the type of data item.
	 */
	public _dataItem: LineSeriesDataItem;

	/**
	 * A list of line series segments.
	 *
	 * Segments are used in two cases:
	 *
	 * * When we want to change the appearance of a part of the line series;
	 * * When we have an axis range.
	 */
	public segments: ListTemplate<this["_segment"]>;

	/**
	 * Defines type for segment.
	 */
	public _segment: LineSeriesSegment;

	/**
	 * A container for segment elements.
	 *
	 * @ignore Exclude from docs
	 */
	public segmentsContainer: Container;

	/**
	 * Minimum distance in pixels between two adjacent points.
	 *
	 * If the distance is less than this setting, a point is skipped.
	 *
	 * This allows acceptable performance with huge amounts of data points.
	 *
	 * @default 0.5
	 */
	public minDistance: number = 0.5;

	/**
	 * Iterator for segments.
	 */
	protected _segmentsIterator: $iter.ListIterator<this["_segment"]>;

	protected _adjustedStartIndex: number;

	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.segments = new ListTemplate<LineSeriesSegment>(this.createSegment());
		this.segments.template.applyOnClones = true;

		this._disposers.push(new ListDisposer(this.segments));
		this._disposers.push(this.segments.template);

		this._segmentsIterator = new $iter.ListIterator<LineSeriesSegment>(this.segments, () => this.segments.create());
		this._segmentsIterator.createNewItems = true;

		this.className = "LineSeries";

		this.strokeOpacity = 1;
		this.fillOpacity = 0;

		this.connect = true;

		this.tensionX = 1;
		this.tensionY = 1;

		this.autoGapCount = 1.1;

		this.segmentsContainer = this.mainContainer.createChild(Container);
		this.segmentsContainer.isMeasured = false;

		// line series might have multiple segments and it has a separate sprite for fill and stroke for each segment. So we need to observe all the changes on series and set them on the segments
		// todo: we need list here, otherwise everything will be redrawn event on change of properties like tooltipX or similar.
		// this.addEventListener(SpriteEvent.PROPERTY_CHANGED, this.validateDataElements, false, this);

		this.bulletsContainer.toFront();

		this.applyTheme();
	}

	/**
	 * Sets defaults that instantiate some objects that rely on parent, so they
	 * cannot be set in constructor.
	 */
	protected applyInternalDefaults(): void {
		super.applyInternalDefaults();
		if (!$type.hasValue(this.readerTitle)) {
			this.readerTitle = this.language.translate("Line Series");
		}
	}

	/**
	 * @ignore
	 */
	protected createSegment(): this["_segment"] {
		return new LineSeriesSegment();
	}

	/**
	 * Returns a new/empty DataItem of the type appropriate for this object.
	 *
	 * @see {@link DataItem}
	 * @return Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new LineSeriesDataItem();
	}

	/**
	 * Inits data item's working values.
	 *
	 * @param dataItem  Data item
	 * @param index     Data item's index
	 */

	protected setInitialWorkingValues(dataItem: this["_dataItem"]): void {
		// this makes data items animate when added

		let yAxis: Axis = this._yAxis.get();
		let xAxis: Axis = this._xAxis.get();

		if (this.appeared && this.visible) {

			let previousDataItem: XYSeriesDataItem = this.dataItems.getIndex(dataItem.index - 1);

			dataItem.component = this; // as these values are set before, we don't know component yet

			if (this.baseAxis == xAxis) {
				if (yAxis instanceof ValueAxis) {
					let initialY: number = yAxis.minZoomed;
					if (previousDataItem) {
						initialY = previousDataItem.values["valueY"].workingValue;
					}

					// this makes line animate from previous point to newly added point
					dataItem.setWorkingValue("valueY", initialY, 0);
					dataItem.setWorkingValue("valueY", dataItem.values.valueY.value);

					if (xAxis instanceof DateAxis) {
						dataItem.setWorkingLocation("dateX", dataItem.locations.dateX - 1, 0); // instantly move it to previous
						dataItem.setWorkingLocation("dateX", dataItem.locations.dateX); // animate to it's location
					}
				}
			}
			if (this.baseAxis == yAxis) {
				if (xAxis instanceof ValueAxis) {
					let initialX: number = xAxis.minZoomed;
					if (previousDataItem) {
						initialX = previousDataItem.values["valueX"].workingValue;
					}

					dataItem.setWorkingValue("valueX", initialX, 0);
					dataItem.setWorkingValue("valueX", dataItem.values.valueX.value);

					if (yAxis instanceof DateAxis) {
						dataItem.setWorkingLocation("dateY", dataItem.locations.dateX - 1, 0); // instantly move it to previous
						dataItem.setWorkingLocation("dateY", dataItem.locations.dateY); // animate to it's location
					}
				}
			}
		}
		else {
			if (this.baseAxis == xAxis) {
				if (yAxis instanceof ValueAxis) {
					if (xAxis instanceof DateAxis) {
						dataItem.setWorkingLocation("dateX", dataItem.locations.dateX);
					}
					if (xAxis instanceof CategoryAxis) {
						dataItem.setWorkingLocation("categoryX", dataItem.locations.categoryX);
					}
				}
			}
			if (this.baseAxis == yAxis) {
				if (xAxis instanceof ValueAxis) {
					if (yAxis instanceof DateAxis) {
						dataItem.setWorkingLocation("dateY", dataItem.locations.dateY);
					}
					if (yAxis instanceof CategoryAxis) {
						dataItem.setWorkingLocation("categoryY", dataItem.locations.categoryY);
					}
				}
			}
		}
	}


	/**
	 * Updates corresponding legend data item with current values.
	 *
	 * @ignore Exclude from docs
	 * @param dataItem  Data item
	 */
	public updateLegendValue(dataItem?: this["_dataItem"], notRange?: boolean) {
		super.updateLegendValue(dataItem, notRange);
		//This is hack to save some methos, used to set tooltip color source only
		if (dataItem && dataItem.segment) {
			this.tooltipColorSource = dataItem.segment;
		}
	}

	/**
	 * (Re)validates the whole series, effectively causing it to redraw.
	 *
	 * @ignore Exclude from docs
	 */
	public validate(): void {

		super.validate();
		if (this.xAxis && this.yAxis) {
			this._segmentsIterator.reset();

			this.openSegmentWrapper(this._adjustedStartIndex);

			$iter.each(this.axisRanges.iterator(), (range) => {
				this.openSegmentWrapper(this._adjustedStartIndex, range);
			});

			$iter.each(this._segmentsIterator.iterator(), (segment) => {
				segment.__disabled = true;
			});
		}
	}

	/**
	 * [sliceData description]
	 *
	 * @todo Description
	 */
	protected sliceData(): void {
		let startIndex: number = this.startIndex;
		let endIndex: number = this.endIndex;

		// we need extra one item to both sides with values for line series, otherwise the line will not continue out of bounds of the chart while scrolling
		// find first to the left
		// TODO use iterator instead
		for (let i = this.startIndex - 1; i >= 0; i--) {
			let dataItem = this.dataItems.getIndex(i);
			if (dataItem && dataItem.hasValue(this._xValueFields) && dataItem.hasValue(this._yValueFields)) {
				startIndex = i;
				break;
			}
		}
		this._adjustedStartIndex = this.findAdjustedIndex(startIndex, ["stroke", "strokeWidth", "strokeDasharray", "strokeOpacity", "fill", "fillOpacity", "opacity"]);

		// find first to the right
		// TODO use iterator instead
		for (let i = this.endIndex, len = this.dataItems.length; i < len; i++) {
			let dataItem = this.dataItems.getIndex(i);
			if (dataItem && dataItem.hasValue(this._xValueFields) && dataItem.hasValue(this._yValueFields)) {
				endIndex = i + 1;
				break;
			}
		}

		this._workingStartIndex = startIndex;
		this._workingEndIndex = endIndex;
	}

	/**
	 * @ignore
	 */
	protected findAdjustedIndex(adjustedIndex: number, properties: string[]): number {
		let propertyFields: any = this.propertyFields;
		let startIndex = adjustedIndex;

		$array.each(properties, (property) => {
			if ($type.hasValue(propertyFields[property])) {
				for (let i = startIndex; i >= 0; i--) {
					let dataItem = this.dataItems.getIndex(i);
					if (dataItem) {
						if ($type.hasValue(dataItem.properties[property])) {
							if (adjustedIndex > i) {
								adjustedIndex = i;
							}
							break;
						}
					}
				}
			}
		})
		return adjustedIndex;
	}


	/**
	 * Wraps openSegment call with iterative solution to prevent stack overflow
	 *
	 * @param openIndex  Index
	 * @param axisRange  Range
	 */
	protected openSegmentWrapper(openIndex: number, axisRange?: AxisDataItem): void {
		let params = {
			"index": openIndex,
			"axisRange": axisRange
		};
		do {
			params = this.openSegment(params.index, params.axisRange);
		} while (params)
	}

	/**
	 * [openSegment description]
	 *
	 * @todo Description
	 * @param openIndex  [description]
	 * @param axisRange  [description]
	 */
	protected openSegment(openIndex: number, axisRange?: AxisDataItem): { "index": number, "axisRange": AxisDataItem } {
		let addToClose = false;
		let points: IPoint[] = [];
		openIndex = Math.min(openIndex, this.dataItems.length);
		let endIndex: number = Math.min(this._workingEndIndex, this.dataItems.length);
		this._workingEndIndex = Math.min(this._workingEndIndex, this.dataItems.length);

		let closeIndex: number;
		let propertiesChanged: boolean = false;

		let segment: LineSeriesSegment = this._segmentsIterator.getFirst();
		segment.__disabled = false;

		if (axisRange) {
			segment.parent = axisRange.contents;
			$object.copyProperties(axisRange.contents, segment, visualProperties);
		}
		else {
			$object.copyProperties(this, segment, visualProperties);
			segment.filters.clear();
			segment.parent = this.segmentsContainer;
		}

		let connect: boolean = this.connect;
		let valuesFound: boolean = false; // some flag to avoid multiple closes if no values found

		for (let i: number = openIndex; i < endIndex; i++) {

			let dataItem: this["_dataItem"] = this.dataItems.getIndex(i);
			dataItem.segment = segment;

			if (dataItem.hasProperties) {
				// if this is first item of segment
				if (i == openIndex) {
					this.updateSegmentProperties(dataItem.properties, segment);
				}
				else {
					// this time we only need to know if properties changed, so we don't pass segment
					propertiesChanged = this.updateSegmentProperties(dataItem.properties, segment, true);
				}
			}

			if (dataItem.hasValue(this._xValueFields) && dataItem.hasValue(this._yValueFields)) {
				this.addPoints(points, dataItem, this.xField, this.yField);
				valuesFound = true;
			}
			else {
				// if no values in first data item, go to next
				if (i == openIndex) {
					continue;
				}
				else {
					// stop cycle
					if (!connect && valuesFound) {
						closeIndex = i;
						break;
					}
				}
			}

			closeIndex = i;

			if (this.baseAxis instanceof DateAxis) {
				let next = this.dataItems.getIndex(i + 1)
				if (next && this.baseAxis.makeGap(next, dataItem)) {
					addToClose = true;
					break;
				}
			}

			if (propertiesChanged) {
				break;
			}
		}
		return this.closeSegment(segment, points, openIndex, closeIndex, axisRange, addToClose);
	}

	/**
	 * [addPoints description]
	 *
	 * @todo Description
	 * @param points    [description]
	 * @param dataItem  [description]
	 * @param xField    [description]
	 * @param yField    [description]
	 * @param backwards [description]
	 */
	protected addPoints(points: IPoint[], dataItem: this["_dataItem"], xField: string, yField: string, backwards?: boolean) {
		let point = this.getPoint(dataItem, xField, yField, dataItem.workingLocations[xField], dataItem.workingLocations[yField]);
		if (!backwards) {
			dataItem.point = point;
		}
		points.push(point);
	}

	/**
	 * [closeSegment description]
	 *
	 * @todo Description
	 * @param segment    [description]
	 * @param points     [description]
	 * @param openIndex  [description]
	 * @param closeIndex [description]
	 * @param axisRange  [description]
	 */
	protected closeSegment(segment: LineSeriesSegment, points: IPoint[], openIndex: number, closeIndex: number, axisRange?: AxisDataItem, add?: boolean) {
		let closePoints: IPoint[] = [];

		if (this.dataFields[<keyof this["_dataFields"]>this._xOpenField] ||
			this.dataFields[<keyof this["_dataFields"]>this._yOpenField] ||
			this.stacked) {
			for (let i: number = closeIndex; i >= openIndex; i--) {
				let dataItem: this["_dataItem"] = this.dataItems.getIndex(i);
				if (dataItem.hasValue(this._xValueFields) && dataItem.hasValue(this._yValueFields)) { // not sure, this means that open point will only be added if value is also set for this point, but maybe it's ok.
					this.addPoints(closePoints, dataItem, this.xOpenField, this.yOpenField, true);
				}
			}
		}
		else {
			let baseAxis: Axis = this.baseAxis;
			let count: number = points.length;
			let xAxis: Axis = this.xAxis;
			let yAxis: Axis = this.yAxis;
			if (count > 0) {
				if (baseAxis == xAxis) {
					closePoints.push({ x: points[count - 1].x, y: yAxis.basePoint.y }); // last x
					closePoints.push({ x: points[0].x, y: yAxis.basePoint.y }); // first x
				}
				else {
					closePoints.push({ x: xAxis.basePoint.x, y: points[count - 1].y }); // last y
					closePoints.push({ x: xAxis.basePoint.x, y: points[0].y }); // first y
				}
			}
		}

		this.drawSegment(segment, points, closePoints);

		if (add) {
			closeIndex++;
		}

		if (closeIndex < this._workingEndIndex - 1) {
			return { "index": closeIndex, "axisRange": axisRange };
		} else {
			return null;
		}
	}

	/**
	 * Draws the line segment.
	 *
	 * @param segment     Segment
	 * @param points      Segment points
	 * @param closePoints Segment close points
	 */
	protected drawSegment(segment: LineSeriesSegment, points: IPoint[], closePoints: IPoint[]): void {
		segment.drawSegment(points, closePoints, this.tensionX, this.tensionY);
	}

	/**
	 * Segement will get its colors from `this.dataItem`, as thats how
	 * `getPropertyValue()` method works.
	 *
	 * We pass `lineSeriesDataItem.properties` as item here each time when a flag
	 * `hasProperties` is set to `true` on data item (this means it can contain
	 * some properties set).
	 *
	 * @param itemProperties  Item properties
	 * @param segment         Segment
	 * @return Properties changed?
	 */
	protected updateSegmentProperties(itemProperties: { [index: string]: any }, segment: LineSeriesSegment, checkOnly?: boolean): boolean {
		let changed: boolean = false;

		$object.each(itemProperties, (propertyName, value) => {
			// some value must be defined
			if ($type.hasValue(value)) {
				let currentValue = (<any>segment)[propertyName];
				let currentValueStr: string;
				// current value can be Color, number, anything. So we check if it has toString, otherwise just do String().
				// toString() will return hex if it's color. The only problem is that it will return lowercased hex and if we have uppercase in data, it will think that it changed
				if (currentValue) {
					if (currentValue.toString) {
						currentValueStr = currentValue.toString();
					}
					else {
						currentValueStr = currentValue; // not doing String(currentValue) as this will make all Objects the same
					}

				}
				let valueStr: string;

				if (value) {
					if (value.toString) {
						valueStr = value.toString();
					}
					else {
						valueStr = value;  // not doing String(currentValue) as this will make all Objects the same
					}
				}

				if (currentValue == value || (currentValueStr != undefined && valueStr != undefined && currentValueStr == valueStr)) {
					// void
				}
				else {
					if (!checkOnly) {
						(<any>segment)[propertyName] = value;
					}
					changed = true;
				}
			}
		});

		return changed;
	}

	/**
	 * Connect the lines over empty data points?
	 *
	 * If set to `true` the line will connect two adjacent data points by a
	 * straight line. Even if there are data points with missing values
	 * in-between.
	 *
	 * If you set this to `false`, the line will break when there are missing
	 * values.
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/chart-types/xy-chart/#Line_series_with_gaps} for more information about this feature
	 * @default true
	 * @param value  Connect?
	 */
	public set connect(value: boolean) {
		if (this.setPropertyValue("connect", value)) {
			this.invalidate();
		}
	}

	/**
	 * @return Connect?
	 */
	public get connect(): boolean {
		return this.getPropertyValue("connect");
	}

	/**
	 * Horizontal tension setting of the line (0-1).
	 *
	 * Can be used to create smoothed lines. It works like this:
	 *
	 * Accepted values are in the range between 0 and 1. The biggest value (1)
	 * will mean that the "tension" is very high, so the line is maximally
	 * attracted to the points it connects, hence the straight line.
	 *
	 * Using smaller numbers will "relax" the tension, creating some curving.
	 *
	 * The smaller the tension setting, the more relaxed the line and the more
	 * wide the curve.
	 *
	 * This setting is for horizontal tension, meaning the curve will bend in
	 * such way that it never goes below or above connecting points. To enable
	 * vertical bending as well, use `tensionY`.
	 *
	 * @default 1
	 * @param value  Horizontal tension (0-1)
	 */
	public set tensionX(value: number) {
		this.setPropertyValue("tensionX", value, true);
	}

	/**
	 * @return Horizontal tension (0-1)
	 */
	public get tensionX(): number {
		return this.getPropertyValue("tensionX");
	}

	/**
	 * Can be used to create smoothed lines. It works like this:
	 *
	 * Accepted values are in the range between 0 and 1. The biggest value (1)
	 * will mean that the "tension" is very high, so the line is maximally
	 * attracted to the points it connects, hence the straight line.
	 *
	 * Using smaller numbers will "relax" the tension, creating some curving.
	 *
	 * The smaller the tension setting, the more relaxed the line and the more
	 * wide the curve.
	 *
	 * This setting is for vertical tension, meaning the curve might bend in
	 * such way that it will go below or above connected points.
	 *
	 * Combine this setting with `tensionX` to create beautifully looking
	 * smoothed line series.
	 *
	 * @default 1
	 * @param value  Vertical tension (0-1)
	 */
	public set tensionY(value: number) {
		this.setPropertyValue("tensionY", value, true);
	}

	/**
	 * @return Vertical tension (0-1)
	 */
	public get tensionY(): number {
		return this.getPropertyValue("tensionY");
	}

	/**
	 * Creates elements in related legend container, that mimics the look of this
	 * Series.
	 *
	 * @ignore Exclude from docs
	 * @param marker  Legend item container
	 */
	public createLegendMarker(marker: Container): void {

		let w: number = marker.pixelWidth;
		let h: number = marker.pixelHeight;

		marker.disposeChildren();

		let line: Line = marker.createChild(Line);
		line.shouldClone = false;
		//line.copyFrom(<any>this); coppies events which is not good
		$object.copyProperties(this, line, visualProperties);

		line.x2 = w;
		line.y = h / 2;
		line.visible = true;

		if (this.fillOpacity > 0) {
			let fill: Rectangle = marker.createChild(Rectangle);
			//fill.copyFrom(<any>this); coppies events which is not good
			$object.copyProperties(this, fill, visualProperties);
			fill.width = w;
			fill.height = h;
			fill.y = 0;
			fill.strokeOpacity = 0;
			fill.visible = true;

			line.y = 0;
		}

		let legendDataItem = <LegendDataItem>marker.dataItem;
		legendDataItem.color = this.stroke;
		legendDataItem.colorOrig = this.fill;

		$iter.eachContinue(this.bullets.iterator(), (bullet) => {

			if ((bullet instanceof Bullet) && !bullet.copyToLegendMarker) {
				return false;
			}

			let hasLabels: boolean = false;

			if (bullet instanceof Container) {
				// do not copy bullets with labels

				$iter.each(bullet.children.iterator(), (child) => {
					if (child instanceof Label) {
						hasLabels = true;
						return true;
					}
				});
			}

			if (!hasLabels) {
				let clone: Sprite = <Sprite>bullet.clone();
				clone.parent = marker;
				clone.isMeasured = true;
				clone.tooltipText = undefined;
				clone.x = w / 2;
				if (this.fillOpacity > 0) {
					clone.y = 0;
				}
				else {
					clone.y = h / 2;
				}
				clone.visible = true;

				// otherwise will not transit to color after hiding
				if (!$type.hasValue(clone.fill)) {
					clone.fill = this.fill;
				}

				if (!$type.hasValue(clone.stroke)) {
					clone.stroke = this.stroke;
				}

				return false;
			}
		});
	}

	/**
	 * @ignore
	 */
	public disposeData() {
		super.disposeData();
		this.segments.clear();
	}

	/**
	 * If `connect = false` and distance between two data points is bigger
	 * than `baseInterval * autoGapCount`, a line will break automatically.
	 *
	 * @since 4.2.4
	 * @param  value  Gap count
	 */
	public set autoGapCount(value: number) {
		this.setPropertyValue("autoGapCount", value, true);
	}

	/**
	 * @return Gap count
	 */
	public get autoGapCount(): number {
		return this.getPropertyValue("autoGapCount");
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["LineSeries"] = LineSeries;
registry.registeredClasses["LineSeriesDataItem"] = LineSeriesDataItem;
