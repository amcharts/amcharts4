/**
 * AmChartsLogo module.
 *
 * AmChartsLogo shows amCharts logo for non-commercial users of a library.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../Container";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import { Polyspline } from "./Polyspline";
import { color } from "../utils/Color";
import { LinearGradient } from "../rendering/fills/LinearGradient";
import { DesaturateFilter } from "../rendering/filters/DesaturateFilter";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[AmChartsLogo]].
 * @ignore Exclude from docs
 */
export interface IAmChartsLogoProperties extends IContainerProperties { }

/**
 * Defines events for [[AmChartsLogo]].
 * @ignore Exclude from docs
 */
export interface IAmChartsLogoEvents extends IContainerEvents { }

/**
 * Defines adapters for [[AmChartsLogo]].
 *
 * @see {@link Adapter}
 * @ignore Exclude from docs
 */
export interface IAmChartsLogoAdapters extends IContainerAdapters, IAmChartsLogoProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * A class used to draw and display progress indicator.
 *
 * @see {@link IAmChartsLogoEvents} for a list of available events
 * @see {@link IAmChartsLogoAdapters} for a list of available Adapters
 * @ignore Exclude from docs
 */
export class AmChartsLogo extends Container {

	/**
	 * Defines available properties.
	 */
	public _properties!: IAmChartsLogoProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IAmChartsLogoAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IAmChartsLogoEvents;


	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "AmChartsLogo";

		this.valign = "bottom";

		let d = 0.3;
		this.opacity = 0.3;
		this.defaultState.properties.opacity = 0.4;
		this.url = "https://www.amcharts.com/";
		this.urlTarget = "_blank";

		this.showSystemTooltip = true;
		this.readerTitle = "Chart created using amCharts library";
		this.width = 220 * d;
		this.height = 70 * d;
		this.background.opacity = 0;

		let aColor = color("#474758");
		if (new InterfaceColorSet().getFor("background").alternative.hex == "#ffffff") {
			aColor = color("#ffffff");
		}

		let aGradient = new LinearGradient();

		aGradient.addColor(aColor);
		aGradient.addColor(aColor, 1, 0.75);
		aGradient.addColor(color("#3cabff"), 1, 0.755);
		aGradient.rotation = -10;

		let aStroke = aGradient;

		let m = this.createChild(Polyspline)
		m.shouldClone = false;
		m.isMeasured = false;
		m.segments = [[{ x: 50 * d, y: 50 * d }, { x: 90 * d, y: 50 * d }, { x: 120 * d, y: 20 * d }, { x: 135 * d, y: 35 * d }, { x: 150 * d, y: 20 * d }, { x: 180 * d, y: 50 * d }, { x: 200 * d, y: 50 * d }]]
		m.strokeWidth = 6 * d;
		m.tensionX = 0.8;
		m.tensionY = 1;

		m.stroke = color("#3cabff");

		let a = this.createChild(Polyspline);
		a.shouldClone = false;
		a.isMeasured = false;
		a.segments = [[{ x: 20 * d, y: 50 * d }, { x: 50 * d, y: 50 * d }, { x: 90 * d, y: 12 * d }, { x: 133 * d, y: 50 * d }, { x: 170 * d, y: 50 * d }, { x: 200 * d, y: 50 * d }]]
		a.strokeWidth = 6 * d;
		a.tensionX = 0.75;
		a.tensionY = 1;
		a.stroke = aStroke;

		this._disposers.push(a);

		let desaturateFilter = new DesaturateFilter();
		this.filters.push(desaturateFilter);

		let desaturateFilterHover = new DesaturateFilter();
		desaturateFilterHover.saturation = 1;

		let hoverState = this.states.create("hover");
		hoverState.properties.opacity = 1;
		hoverState.filters.push(desaturateFilterHover);

		// Apply theme
		this.applyTheme();
	}

}
