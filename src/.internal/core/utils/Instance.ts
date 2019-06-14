/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { system } from "../System";
import { registry } from "../Registry";
import { Sprite } from "../Sprite";
import { Container } from "../Container";
import { Paper } from "../rendering/Paper";
import { SVGContainer, svgContainers } from "../rendering/SVGContainer";
import { FocusFilter } from "../rendering/filters/FocusFilter";
import { Preloader } from "../elements/Preloader";
import { AmChartsLogo } from "../elements/AmChartsLogo";
import { ITheme } from "../../themes/ITheme";
import { Tooltip } from "../elements/Tooltip";
import { Disposer } from "../utils/Disposer";
import { percent } from "./Percent";
import { options } from "../Options";
import * as $array from "./Array";
import * as $type from "./Type";
import * as $dom from "./DOM";
import * as $utils from "./Utils";

/**
 * ============================================================================
 * INSTANTIATION FUNCTIONS
 * ============================================================================
 * @hidden
 */

/**
 * Creates all HTML and SVG containers needed for the chart instance, as well
 * as the new [[Sprite]] (as specified in `classType` parameter).
 *
 * @param htmlElement  A container to creat elements in
 * @param classType    A class definition of the new element to create
 * @return Newly-created Sprite object
 */
function createChild<T extends Sprite>(htmlElement: $type.Optional<HTMLElement | string>, classType: { new(): T; }): T {
	let htmlContainer = $dom.getElement(htmlElement);

	if (htmlContainer) {

		htmlContainer.innerHTML = "";
		//htmlContainer.style.overflow = "hidden";

		let svgDiv = new SVGContainer(htmlContainer);
		let paper = new Paper(svgDiv.SVGContainer, "svg-" + (svgContainers.length - 1));

		// the approach with masks is chosen because overflow:visible is set on SVG element in order tooltips could go outside
		// svg area - this is often needed when working with small charts.

		// main container which holds content container and tooltips container
		let container = new Container();
		container.htmlContainer = htmlContainer;
		container.svgContainer = svgDiv;
		container.width = percent(100);
		container.height = percent(100);
		container.background.fillOpacity = 0;
		container.paper = paper;
		paper.append(container.group);

		// this is set from parent container, but this one doesn't have, so do it manually.
		container.relativeWidth = 1;
		container.relativeHeight = 1;

		svgDiv.container = container;

		// creating classType instance
		let sprite = container.createChild(classType);
		sprite.topParent = container;
		let uid = sprite.uid;

		registry.invalidSprites[uid] = [];
		registry.invalidDatas[uid] = [];
		registry.invalidPositions[uid] = [];
		registry.invalidLayouts[uid] = [];

		container.baseId = uid;

		sprite.isBaseSprite = true;
		sprite.focusFilter = new FocusFilter();
		registry.baseSprites.push(sprite);
		registry.baseSpritesByUid[uid] = sprite;
		sprite.maskRectangle = { x: 0, y: 0, width: svgDiv.width, height: svgDiv.height };

		// this solves issues with display:none, as all children are measured as 0x0
		container.events.on("maxsizechanged", (event) => {
			if (event.previousWidth == 0 || event.previousHeight == 0) {
				container.deepInvalidate();
			}
			if(sprite.maskRectangle){
				sprite.maskRectangle = { x: 0, y: 0, width: svgDiv.width, height: svgDiv.height };
			}
		})

		sprite.addDisposer(new Disposer(() => {
			$array.remove(registry.baseSprites, sprite);
			registry.baseSpritesByUid[sprite.uid] = undefined;
		}));

		// TODO figure out a better way of doing this
		sprite.addDisposer(container);

		// tooltip container
		let tooltipContainer: Container = container.createChild(Container);
		tooltipContainer.topParent = container;
		tooltipContainer.width = percent(100);
		tooltipContainer.height = percent(100);
		tooltipContainer.isMeasured = false;
		container.tooltipContainer = tooltipContainer;

		sprite.tooltip = new Tooltip();
		sprite.tooltip.hide(0);
		sprite.tooltip.setBounds({ x: 0, y: 0, width: tooltipContainer.maxWidth, height: tooltipContainer.maxHeight });

		tooltipContainer.events.on("maxsizechanged", () => {
			$type.getValue(sprite.tooltip).setBounds({ x: 0, y: 0, width: tooltipContainer.maxWidth, height: tooltipContainer.maxHeight });
		}, undefined, false)

		//@todo: maybe we don't need to create one by default but only on request?

		let preloader = new Preloader();
		preloader.events.on("inited", () => {
			preloader.__disabled = true;
		}, undefined, false);
		container.preloader = preloader;

		if (!options.commercialLicense) {
			let logo = tooltipContainer.createChild(AmChartsLogo);
			tooltipContainer.events.on("maxsizechanged", (ev) => {
				if ((tooltipContainer.maxWidth <= 100) || (tooltipContainer.maxHeight <= 50)) {
					logo.hide();
				}
				else if (logo.isHidden || logo.isHiding) {
					logo.show();
				}
			}, undefined, false);
			sprite.logo = logo;
			logo.align = "left";
			logo.valign = "bottom";
		}

		$utils.used(sprite.numberFormatter); // need to create one.

		// Set this as an autonomouse instance
		// Controls like Preloader, Export will use this.
		container.isStandaloneInstance = true;

		return sprite;
	}
	else {
		system.log("html container not found");
		throw new Error("html container not found");
	}
}

/**
 * A shortcut to creating a chart instance.
 *
 * The first argument is either a reference to or an id of a DOM element to be
 * used as a container for the chart.
 *
 * The second argument is the type reference of the chart type. (for plain
 * JavaScript users this can also be a string indicating chart type)
 *
 * ```TypeScript
 * let chart = am4core.create("chartdiv", am4charts.PieChart);
 * ```
 * ```JavaScript
 * // Can pass in chart type reference like this:
 * var chart = am4core.create("chartdiv", am4charts.PieChart);
 *
 * // ... or chart class type as a string:
 * var chart = am4core.create("chartdiv", "PieChart");
 * ```
 *
 * @param htmlElement  Reference or id of the target container element
 * @param classType    Class type of the target chart type
 * @return Chart instance
 */
export function create<T extends Sprite>(htmlElement: $type.Optional<HTMLElement | string>, classType: { new(): T; }): T {

	// This is a nasty hack for the benefit of vanilla JS users, who do not
	// enjoy benefits of type-check anyway.
	// We're allowing passing in a name of the class rather than type reference
	// itself.
	let classError: $type.Optional<Error>;
	if ($type.isString(classType)) {
		if ($type.hasValue(registry.registeredClasses[classType])) {
			classType = registry.registeredClasses[classType];
		}
		else {
			classType = registry.registeredClasses["Container"];
			classError = new Error("Class [" + classType + "] is not loaded.");
		}
	}

	// Create the chart
	let chart = createChild(htmlElement, classType);

	// Error?
	if (classError) {
		chart.raiseCriticalError(classError);
	}

	return chart;

}

/**
 * A shortcut to creating a chart from a config object.
 *
 * Example:
 *
 * ```TypeScript
 * let chart am4core.createFromConfig({ ... }, "chartdiv", am4charts.XYChart );
 * ```
 * ```JavaScript
 * var chart am4core.createFromConfig({ ... }, "chartdiv", "XYChart" );
 * ```
 *
 * If `chartType` parameter is not supplied it must be set in a config object,
 * via reference to chart type, e.g.:
 *
 * ```TypeScript
 * {
 *   "type": am4charts.XYChart,
 *   // ...
 * }
 * ```
 * ```JavaScript
 * {
 *   "type": am4charts.XYChart,
 *   // ...
 * }
 * ```
 *
 * Or via string: (if you are using JavaScript)
 *
 * ```TypeScript
 * {
 *   "type": "XYChart",
 *   // ...
 * }
 * ```
 * ```JavaScript
 * {
 *   "type": "XYChart",
 *   // ...
 * }
 * ```
 *
 * A `container` can either be a reference to an HTML container to put chart
 * in, or it's unique id.
 *
 * If `container` is not specified, it must be included in the config object:
 *
 * ```TypeScript
 * {
 *   "type": "XYChart",
 *   "container": "chartdiv",
 *   // ...
 * }
 * ```
 * ```JavaScript
 * {
 *   "type": "XYChart",
 *   "container": "chartdiv",
 *   // ...
 * }
 * ```
 *
 * @param config       Config object in property/value pairs
 * @param htmlElement  Container reference or ID
 * @param objectType   Chart type
 * @return A newly created chart instance
 * @todo Throw exception if type is not correct
 */
export function createFromConfig(config: { [index: string]: any }, htmlElement?: string | HTMLElement, classType?: { new(): Sprite; } | string): Sprite {

	// Extract chart type from config if necessary
	if (!$type.hasValue(classType)) {
		classType = config.type;
		delete config.type;
	}

	// Extract element from config if necessary
	if (!$type.hasValue(htmlElement)) {
		htmlElement = config.container;
		delete config.container;
	}

	// Check if we need to extract actual type reference
	let finalType;
	let classError: $type.Optional<Error>;
	if ($type.isString(classType) && $type.hasValue(registry.registeredClasses[classType])) {
		finalType = registry.registeredClasses[classType];
	}
	else if (typeof classType !== "function") {
		finalType = Container;
		classError = new Error("Class [" + classType + "] is not loaded.");
	}
	else {
		finalType = classType;
	}

	// Create the chart
	let chart = createChild(htmlElement, finalType);

	// Set config
	if (classError) {
		chart.raiseCriticalError(classError);
	}
	else {
		chart.config = config;
	}

	return chart;

}

/**
 * Applies a theme to System, and subsequently all chart instances created
 * from that point forward.
 *
 * amCharts supports multiple themes. Calling `useTheme` multiple times will
 * make the System apply multiple themes, rather than overwrite previously
 * set one.
 *
 * This enables combining features from multiple themes on the same chart.
 * E.g.:
 *
 * ```TypeScript
 * am4core.useTheme(am4themes.material);
 * am4core.useTheme(am4themes.animated);
 * ```
 * ```JavaScript
 * am4core.useTheme(am4themes.material);
 * am4core.useTheme(am4themes.animated);
 * ```
 *
 * The above will apply both the Material color and animation options to all
 * charts created.
 *
 * @param value  A reference to a theme
 */
export function useTheme(value: ITheme): void {
	if (registry.themes.indexOf(value) === -1) {
		registry.themes.push(value);
	}
}

/**
 * Removes a theme from "active themes" list, so it won't get applied to any
 * charts created subsequently.
 *
 * @param value  A reference to a theme
 */
export function unuseTheme(value: ITheme): void {
	$array.remove(registry.themes, value);
}

/**
 * Removes all "active" themes. Any charts created subsequently will not have
 * any theme applied to them.
 */
export function unuseAllThemes(): void {
	registry.themes = [];
}
