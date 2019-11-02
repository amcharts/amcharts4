/**
 * Plugin for automatically grouping small chart slices into single group.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Plugin } from "../../core/utils/Plugin";
import { PercentSeries } from "../../charts/series/PercentSeries";
import { FunnelSlice, IFunnelSliceProperties } from "../../charts/elements/FunnelSlice";
import { PercentChart } from "../../charts/types/PercentChart";
import { IDisposer } from "../../core/utils/Disposer";
import { List } from "../../core/utils/List";
import { Slice } from "../../core/elements/Slice";
import { Sprite } from "../../core/Sprite";
import { Optional } from "../../core/utils/Type";
import { registry } from "../../core/Registry";
import { ZoomOutButton } from "../../core/elements/ZoomOutButton";
import * as $object from "../../core/utils/Object";



/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * A plugin which automatically groups [[PercenSeries]] slices that are smaller
 * than certain percent into one "Other" slice.
 *
 * By pushing an instance of [[SliceGrouper]] into `plugin` list of
 * any [[PercentSeries]], it automatically applies the functionality.
 *
 * Example:
 *
 * ```TypeScript
 * let series = chart.series.push(new am4charts.PieSeries());
 * series.dataFields.valueY = "value";
 * series.dataFields.dateX = "date";
 *
 * let grouper = series.plugins.push(new am4plugins_sliceGrouper.SliceGrouper());
 * ```
 * ```JavaScript
 * var series = chart.series.push(new am4charts.PieSeries());
 * series.dataFields.valueY = "value";
 * series.dataFields.dateX = "date";
 *
 * var grouper = series.plugins.push(new am4plugins_sliceGrouper.SliceGrouper());
 * ```
 * ```JSON
 * {
 *   // ...
 *   "series": [{
 *     // ...
 *   }, {
 *     "type": "PieSeries",
 *     "dataFields": {
 *       "valueY": "value",
 *       "dateX": "date"
 *     },
 *     "plugins": [{
 *       "type": "SliceGrouper"
 *     }]
 *   }]
 * }
 * ```
 *
 * @since 4.3.11
 */
export class SliceGrouper extends Plugin {

	/**
	 * A series object that will need its slices grouped.
	 */
	public target: Optional<PercentSeries>;

	/**
	 * A reference to "Other" slice.
	 */
	public groupSlice: Sprite | Slice | FunnelSlice;

	/**
	 * A list of small slices that do not satisfy `threshold`.
	 */
	public smallSlices: List<Sprite | Slice | FunnelSlice> = new List();

	/**
	 * A list of big slices that do not satisfy `threshold`.
	 */
	public bigSlices: List<Sprite | Slice | FunnelSlice> = new List();

	/**
	 * A name to use for the "Other" slice.
	 *
	 * @default "Other"
	 */
	public groupName: string = "Other";

	/**
	 * Custom properties to apply to the "Other" slice.
	 *
	 * @since 4.5.3
	 * @type {IFunnelSliceProperties}
	 */
	public groupProperties: IFunnelSliceProperties = {};

	/**
	 * If set to `true` the legend will be synced to show currently visible
	 * slices only.
	 *
	 * @defaylt false
	 */
	public syncLegend: boolean = false;

	/**
	 * Threshold percent.
	 */
	protected _threshold: number = 5;

	/**
	 * Zoom out button. Shown when "Other" slice is broken down to zoom back
	 * out to "Other".
	 */
	protected _zoomOutButton: ZoomOutButton;

	/**
	 * Disposer for click events.
	 */
	protected _clickDisposers: Array<IDisposer> = [];

	/**
	 * What happens when "Other" slice is cicked.
	 */
	protected _clickBehavior: "none" | "break" | "zoom" = "none";

	protected _ignoreDataUpdate: boolean = false;

	/**
	 * Is group slice currently closed or expanded?
	 */
	protected _closed: boolean = true;

	/**
	 * Constructor
	 */
	constructor() {
		// Nothing to do here
		super();
	}

	public init() {
		super.init();
		this.processSeries();
	}

	/**
	 * Decorates series with required events and adapters used to hijack its
	 * data.
	 */
	private processSeries(): void {

		const series = this.target;
		const chart = <PercentChart>series.baseSprite;
		const dataProvider = series.data && series.data.length ? series : chart;

		// Invalidate calculated data whenever data updates
		this._disposers.push(dataProvider.events.on("datavalidated", (ev) => {

			if (this._ignoreDataUpdate) {
				this._ignoreDataUpdate = false;
				return;
			}

			this.groupSlice = undefined;
			this.smallSlices.clear();
			this.bigSlices.clear();

			// Collect and prepare small slices
			let groupValue = 0;
			let groupSliceItem;
			series.dataItems.each((item) => {
				let value = item.values.value.percent;
				if ((<any>item.dataContext).sliceGrouperOther) {
					groupSliceItem = item.dataContext;
				}
				else if (value <= this.threshold) {
					groupValue += item.value;
					item.hiddenInLegend = true;
					item.hide();
					item.hidden = true;

					// We need this in order to handle conflict with responsive
					// functionality
					item.label.events.on("transitionended", (ev) => {
						if (this._closed) {
							item.hide();
						}
					});
					
					this.smallSlices.push(item.slice);
				}
				else {
					this.bigSlices.push(item.slice);
				}
			});

			// Create "Other" slice
			if (groupValue > 0) {
				if (groupSliceItem) {
					(<any>groupSliceItem)[series.dataFields.value] = groupValue;
					this._ignoreDataUpdate = true;
					dataProvider.validateRawData();
				}
				else {
					let groupData: any = {
						sliceGrouperOther: true
					};
					groupData[series.dataFields.category] = this.groupName;
					groupData[series.dataFields.value] = groupValue;
					this._ignoreDataUpdate = true;
					dataProvider.addData(groupData);
				}
			}
		}));

		this._disposers.push(series.events.on("validated", (ev) => {
			series.slices.each((slice) => {
				if ((<any>slice.dataItem.dataContext).sliceGrouperOther) {
					if (!this.groupSlice) {
						this.groupSlice = slice;
						this.initSlices();
					}
				}
			});
		}));

	}

	/**
	 * Initializes group slice.
	 */
	private initSlices(): void {

		if (!this.groupSlice) {
			return;
		}

		// Apply custom peroperties
		$object.each(this.groupProperties, (key, val) => {
			(<any>this.groupSlice)[key] = val;
		});

		// Set up click
		if (this.clickBehavior != "none") {

			if (!this.groupSlice.events.has("hit")) {
				this._clickDisposers.push(this.groupSlice.events.on("hit", (ev) => {
					this.toggleGroupOn();
				}));
			}
		}

	}

	/**
	 * Toggles group on.
	 */
	private toggleGroupOn(): void {

		if (this.clickBehavior == "none") {
			return;
		}

		this._closed = false;

		// Hide "Other" slice
		this.groupSlice.dataItem.hide();
		if (this.syncLegend) {
			(<any>this.groupSlice.dataItem).hiddenInLegend = true;
		}

		this._clickDisposers.push(this.groupSlice.events.once("shown", (ev) => {
			this.toggleGroupOff();
		}));

		// Unhide hidden slices
		this.smallSlices.each((slice) => {
			slice.dataItem.hidden = false;
			slice.dataItem.show();
			if (this.syncLegend) {
				(<any>slice.dataItem).hiddenInLegend = false;
			}
		});


		// Maybe hide big slices
		if (this.clickBehavior == "zoom") {
			this.bigSlices.each((slice) => {
				slice.dataItem.hide();
				if (this.syncLegend) {
					(<any>slice.dataItem).hiddenInLegend = true;
				}
			});
		}

		if (this.syncLegend) {
			(<any>this.target.baseSprite).feedLegend();
		}

		// Show zoomout button
		this.zoomOutButton.show();
	}

	/**
	 * Toggles group off.
	 */
	private toggleGroupOff(): void {

		if (this.clickBehavior == "none") {
			return;
		}

		this._closed = true;

		// Toggle "Other" slice back on
		this.groupSlice.events.disableType("shown")
		this.groupSlice.dataItem.show();
		this.groupSlice.events.enableType("shown");
		if (this.syncLegend) {
			(<any>this.groupSlice.dataItem).hiddenInLegend = false;
		}


		// Maybe unhide big slices
		if (this.clickBehavior == "zoom") {
			this.bigSlices.each((slice) => {
				slice.dataItem.hidden = false;
				slice.dataItem.show();
				if (this.syncLegend) {
					(<any>slice.dataItem).hiddenInLegend = false;
				}
			});
		}

		// Hide small slices
		this.smallSlices.each((slice) => {
			slice.dataItem.hide();
			if (this.syncLegend) {
				(<any>slice.dataItem).hiddenInLegend = true;
			}
		});

		if (this.syncLegend) {
			(<any>this.target.baseSprite).feedLegend();
		}

		// Hide zoomout button
		this.zoomOutButton.hide();
	}

	/**
	 * Percent threshold which slices to group. If a slice is less than
	 * `threshold` percent, it will be moved into "Other" group.
	 *
	 * @default 5
	 * @param  value  Threshold
	 */
	public set threshold(value: number) {
		if (this._threshold != value) {
			this._threshold = value;
		}
	}

	/**
	 * @return Threshold
	 */
	public get threshold(): number {
		return this._threshold;
	}

	/**
	 * An instance of [[ZoomOutButton]] that is shown when "Other" slice is
	 * broken down, to get back to grouped state.
	 * 
	 * @param  value  Button
	 */
	public set zoomOutButton(value: ZoomOutButton) {
		this._zoomOutButton = value;
	}

	/**
	 * @return Button
	 */
	public get zoomOutButton(): ZoomOutButton {
		if (!this._zoomOutButton) {
			const chart = <PercentChart>this.target.baseSprite;
			let zoomOutButton = chart.tooltipContainer.createChild(ZoomOutButton);
			zoomOutButton.shouldClone = false;
			zoomOutButton.align = "right";
			zoomOutButton.valign = "top";
			zoomOutButton.zIndex = Number.MAX_SAFE_INTEGER;
			zoomOutButton.marginTop = 5;
			zoomOutButton.marginRight = 5;

			zoomOutButton.hide(0);
			this.zoomOutButton = zoomOutButton;
			this._disposers.push(this._zoomOutButton);

			zoomOutButton.events.on("hit", () => {
				this.toggleGroupOff();
			}, this);
		}
		return this._zoomOutButton;
	}

	/**
	 * What happens when "Other" slice is clicked/tapped:
	 *
	 * * "none": nothing (default)
	 * * "break": the slice is broken down into actual slices it consists of
	 * * "zoom": actual small slices are shown and the rest of the slices are hidden
	 * 
	 * @param  value  Click behavior
	 */
	public set clickBehavior(value: "none" | "break" | "zoom") {
		if (this._clickBehavior != value) {
			this._clickBehavior = value;
			this.initSlices();
		}
	}

	/**
	 * @returns Click behavior
	 */
	public get clickBehavior(): "none" | "break" | "zoom" {
		return this._clickBehavior;
	}

	/**
	 * Disposes the element
	 */
	public dispose(): void {
		this.disposeClickEvents();
		this.groupSlice = undefined;
		this.smallSlices.clear();
		this.bigSlices.clear();
		super.dispose();
	}

	private disposeClickEvents(): void {
		const a = this._clickDisposers;
		this._clickDisposers = <any>null;
		while (a.length !== 0) {
			const disposer = a.shift();
			disposer.dispose();
		}
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["SliceGrouper"] = SliceGrouper;
