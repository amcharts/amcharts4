/**
 * Defines default Responsive rules
 * @hidden
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite, ISpriteProperties, ISpriteAdapters } from "../Sprite";
import { SpriteState } from "../SpriteState";
import { Container } from "../Container";
import { Optional } from "../utils/Type";
import { AxisRenderer } from "../../charts/axes/AxisRenderer";
import { AxisRendererX } from "../../charts/axes/AxisRendererX";
import { AxisRendererY } from "../../charts/axes/AxisRendererY";
import { AxisRendererCircular } from "../../charts/axes/AxisRendererCircular";
import { Chart } from "../../charts/Chart";
import { Legend } from "../../charts/Legend";
import { SmallMap } from "../../charts/map/SmallMap";
import { ZoomControl } from "../../charts/map/ZoomControl";


/**
 * ============================================================================
 * RULES
 * ============================================================================
 * @hidden
 */

/**
 * Default rules.
 *
 * @ignore Exclude from docs
 * @todo Do not create states for objects that do not have any overrides
 */
export default [

	/**
	 * --------------------------------------------------------------------------
	 * Microcharts and sparklines
	 * W<=100 || H<=100
	 * @todo
	 */

	{

		relevant: (container: Container): boolean => {

			if ((container.pixelWidth <= 100) || (container.pixelHeight <= 100)) {
				return true;
			}

			return false;
		},

		state: (object: Sprite, stateId: string): Optional<SpriteState<ISpriteProperties, ISpriteAdapters>> => {

			// Put vertical axis labels inside
			if (object instanceof AxisRenderer) {
				let state = object.states.create(stateId);
				state.properties.minLabelPosition = 1;
				state.properties.maxLabelPosition = 0;
				return state;
			}
		}

	},


	/**
	 * --------------------------------------------------------------------------
	 * Narrow
	 * W<=200
	 */

	{

		relevant: (container: Container): boolean => {

			if ((container.pixelWidth <= 200)) {
				return true;
			}

			return false;
		},

		state: (object: Sprite, stateId: string): Optional<SpriteState<ISpriteProperties, ISpriteAdapters>> => {

			// Put vertical axis labels inside
			if (object instanceof AxisRendererY) {
				let state = object.states.create(stateId);
				state.properties.inside = true;
				return state;
			}

			if (object instanceof AxisRendererCircular) {
				let state = object.states.create(stateId);
				state.properties.inside = true;
				return state;
			}

			if (object instanceof SmallMap) {
				let state = object.states.create(stateId);
				state.properties.disabled = true;
				return state;
			}

			/*if (object instanceof Container && object.parent instanceof ZoomControl && !(object instanceof Button)) {
				let state = object.states.create(stateId);
				state.properties.height = 0;
				return state;
			}*/

			if (object instanceof ZoomControl) {
				let state = object.states.create(stateId);
				state.properties.layout = "vertical";
				return state;
			}

			if (object instanceof Chart) {
				let state = object.states.create(stateId);
				state.properties.marginLeft = 0;
				state.properties.marginRight = 0;
				return state;
			}

			if (object instanceof Legend && (object.position == "left" || object.position == "right")) {
				let state = object.states.create(stateId);
				state.properties.position = "bottom";
				return state;
			}
		}

	},

	/**
	 * --------------------------------------------------------------------------
	 * Short
	 * H<=200
	 */

	{

		relevant: (container: Container): boolean => {

			if ((container.pixelHeight <= 200)) {
				return true;
			}

			return false;
		},

		state: (object: Sprite, stateId: string): Optional<SpriteState<ISpriteProperties, ISpriteAdapters>> => {

			// Put vertical axis labels inside
			if (object instanceof AxisRendererX) {
				let state = object.states.create(stateId);
				state.properties.inside = true;
				return state;
			}

			if (object instanceof AxisRendererCircular) {
				let state = object.states.create(stateId);
				state.properties.inside = true;
				return state;
			}

			if (object instanceof SmallMap) {
				let state = object.states.create(stateId);
				state.properties.disabled = true;
				return state;
			}

			/*if (object instanceof Container && object.parent instanceof ZoomControl && !(object instanceof Button)) {
				let state = object.states.create(stateId);
				state.properties.width = 100;
				return state;
			}*/

			if (object instanceof ZoomControl) {
				let state = object.states.create(stateId);
				state.properties.layout = "horizontal";
				return state;
			}

			if (object instanceof Chart) {
				let state = object.states.create(stateId);
				state.properties.marginTop = 0;
				state.properties.marginBottom = 0;
				return state;
			}

			if (object instanceof Legend && (object.position == "bottom" || object.position == "top")) {
				let state = object.states.create(stateId);
				state.properties.position = "right";
				return state;
			}
		}

	},


	/**
	 * --------------------------------------------------------------------------
	 * Super-small
	 * W<=200 && H<=200
	 */

	{

		relevant: (container: Container): boolean => {

			if ((container.pixelWidth <= 200) && (container.pixelHeight <= 200)) {
				return true;
			}
			return false;
		},

		state: (object: Sprite, stateId: string): Optional<SpriteState<ISpriteProperties, ISpriteAdapters>> => {

			// Hide legend
			if (object instanceof Legend) {
				let state = object.states.create(stateId);
				state.properties.disabled = true;
				return state;
			}

			if (object instanceof ZoomControl) {
				let state = object.states.create(stateId);
				state.properties.disabled = true;
				return state;
			}
		}

	}

];
