/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { AxisFill, IAxisFillProperties, IAxisFillAdapters, IAxisFillEvents } from "./AxisFill";
import { Axis } from "./Axis";
import { Percent, percent } from "../../core/utils/Percent";
import { AxisRendererCircular } from "./AxisRendererCircular";
import { registry } from "../../core/Registry";
import * as $type from "../../core/utils/Type";

/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[AxisFillCircular]].
 */
export interface IAxisFillCircularProperties extends IAxisFillProperties {

	/**
	 * Inner radius. Relative ir absolute.
	 */
	innerRadius?: number | Percent;

	/**
	 * Outer radius. Relative or absolute.
	 */
	radius?: number | Percent;

	/**
	 * Corner radius for the fill. In pixels.
	 */
	cornerRadius?: number;

}

/**
 * Defines events for [[AxisFillCircular]].
 */
export interface IAxisFillCircularEvents extends IAxisFillEvents { }

/**
 * Defines adapters for [[AxisFillCircular]].
 *
 * @see {@link Adapter}
 */
export interface IAxisFillCircularAdapters extends IAxisFillAdapters, IAxisFillCircularProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Provides fill element functionality for circular Axes.
 *
 * @see {@link IAxisFillCircularEvents} for a list of available events
 * @see {@link IAxisFillCircularAdapters} for a list of available Adapters
 * @todo Needs description
 */
export class AxisFillCircular extends AxisFill {

	/**
	 * Defines available properties.
	 */
	public _properties!: IAxisFillCircularProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IAxisFillCircularAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IAxisFillCircularEvents;

	/**
	 * An SVG path, used to draw fill shape.
	 *
	 * @ignore Exclude from docs
	 * @todo Description (review)
	 */
	public fillPath: string;

	/**
	 * Constructor.
	 *
	 * @param axis Axis
	 */
	constructor(axis: Axis) {
		super(axis);

		this.className = "AxisFillCircular";

		this.element = this.paper.add("path");

		this.radius = percent(100);

		this.applyTheme();
	}

	/**
	 * Draws the fill element.
	 *
	 * @ignore Exclude from docs
	 */
	public draw(): void {
		super.draw();

		if(this.__disabled || this.disabled){
			return;
		}
		
		if (this.axis) {
			let renderer: AxisRendererCircular = <AxisRendererCircular>this.axis.renderer;
			this.fillPath = renderer.getPositionRangePath(this.startPosition, this.endPosition, this.radius, $type.hasValue(this.innerRadius) ? this.innerRadius : renderer.innerRadius, this.cornerRadius);
			this.path = this.fillPath;
		}
	}

	/**
	 * Inner radius of the fill. Relative ([[Percent]]) or absolute (pixels).
	 *
	 * @param value  Inner radius
	 */
	public set innerRadius(value: number | Percent) {
		this.setPercentProperty("innerRadius", value, true, false, 10, false);
	}

	/**
	 * @return Inner radius
	 */
	public get innerRadius(): number | Percent {
		return this.getPropertyValue("innerRadius");
	}

	/**
	 * Outer radius of the fill. Relative ([[Percent]]) or absolute (pixels).
	 *
	 * @param value  Outer radius
	 */
	public set radius(value: number | Percent) {
		this.setPercentProperty("radius", value, true, false, 10, false);
	}

	/**
	 * @return Outer radius
	 */
	public get radius(): number | Percent {
		return this.getPropertyValue("radius");
	}

	/**
	 * Corner radius for the fill. In pixels.
	 *
	 * @param value  Corner radius (px)
	 */
	public set cornerRadius(value: number) {
		this.setPropertyValue("cornerRadius", value, true);
	}

	/**
	 * @return Corner radius (px)
	 */
	public get cornerRadius(): number {
		return this.getPropertyValue("cornerRadius");
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["AxisFillCircular"] = AxisFillCircular;
