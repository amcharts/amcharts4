/**
 * Responsive functionality module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { BaseObjectEvents, IBaseObjectEvents } from "../Base";
import { Sprite, ISpriteProperties, ISpriteAdapters } from "../Sprite";
import { SpriteState } from "../SpriteState";
import { Container } from "../Container";
import { Component } from "../Component";
import { List } from "../utils/List";
import { Adapter } from "../utils/Adapter";
import { IDisposer } from "../utils/Disposer";
import { registry } from "../Registry";
import { Optional } from "../utils/Type";
import * as $iter from "../utils/Iterator";
import * as $array from "../utils/Array";
import * as $type from "../utils/Type";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines an interface for the responsive rule, i.e. what overrides need to
 * be applied when certain conditions are matched.
 *
 * @important
 */
export interface IResponsiveRule {

	/**
	 * A function which determines if this rule is relevant to current
	 * conditions.
	 *
	 * Whenever the chrt size changes, this function will be run to determine
	 * whether this rule needs to be applied.
	 */
	relevant(target: Container): boolean;

	/**
	 * A function which creates and returns a [[SpriteState]] that needs to be
	 * set whenever rule should be applied.
	 *
	 * This is run only once.
	 *
	 * Once state is created, it is added to the Sprite's available states and
	 * applied as necessary.
	 */
	state(target: Sprite, stateId: string): Optional<SpriteState<ISpriteProperties, ISpriteAdapters>>;

	/**
	 * ID of the rule.
	 */
	id?: string;

}

/**
 * Defines events for [[Responsive]].
 */
export interface IResponsiveEvents extends IBaseObjectEvents {

	/**
	 * Invoked when a list of applicable rules for the current resolution
	 * changes.
	 */
	ruleschanged: {},

	/**
	 * Invoked after each rule is applied to the actual element.
	 */
	ruleapplied: {

		/**
		 * A rule that was just applied.
		 */
		"rule": IResponsiveRule

	}

}

/**
 * Defines adapters for [[Responsive]] class.
 *
 * Includes both the [[Adapter]] definitions and properties.
 *
 * @see {@link Adapter}
 */
export interface IResponsiveAdapters {

	/**
	 * Are responsive features enabled?
	 */
	enabled: boolean;

	/**
	 * Use default rules?
	 *
	 * If this is set `false`, only user-defined rules will be applied.
	 */
	useDefault: boolean;

	/**
	 * A list of user-defined rules.
	 */
	rules: List<IResponsiveRule>;

	/**
	 * A list of default rules.
	 */
	defaultRules: List<IResponsiveRule>;

	/**
	 * A list of **all** rules - user-defined and default combined.
	 */
	allRules: List<IResponsiveRule>;

}


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Responsive is responsible for overriding certain properties when conditions
 * are met.
 *
 * This class is used to dynamically apply and change certain chart properties
 * based on the current values of properties.
 *
 * Mainly, this is used with [[Sprite]]'s dimensional properties, like
 * `pixelWidth` and `pixelHeight`. However, it can be used to dynamically
 * change any property, based on any other property's value.
 *
 * A default responsive rules are disabled.
 *
 * To enable, set `enabled = false`. E.g.:
 *
 * ```TypeScript
 * chart.responsive.enabled = true;
 * ```
 * ```JavaScript
 * chart.responsive.enabled = true;
 * ```
 *
 * @see {@link IResponsiveEvents} for a list of available events
 * @see {@link IResponsiveAdapters} for a list of available Adapters
 * @todo Add default rules
 * @todo Watch for rule modification
 * @important
 */
export class Responsive extends BaseObjectEvents {

	/**
	 * Holds a list of responsive rules organized by object type.
	 */
	protected _rules = new List<IResponsiveRule>();

	/**
	 * Holds the list of the default responsive rules.
	 * @deprecated
	 */
	//protected _defaultRules = new List<IResponsiveRule>();

	/**
	 * Holds the list of currently applied rules.
	 */
	protected _appliedRules: { [index: string]: boolean } = {};

	/**
	 * Used to keep track of objects that have rules applied at the moment.
	 */
	protected _appliedTargets: string[] = [];

	/**
	 * Use default rules in addition to the user-defined ones?
	 */
	protected _useDefault = true;

	/**
	 * A target object responsive rules apply to.
	 */
	protected _component: $type.Optional<Component>;

	/**
	 * Defines available events.
	 */
	public _events!: IResponsiveEvents;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IResponsiveAdapters;

	/**
	 * Adapter.
	 */
	public adapter = new Adapter<this, IResponsiveAdapters>(this);

	/**
	 * Indicates of responsive rules application is enabled.
	 */
	protected _enabled = false;

	/**
	 * Holds a disposer for size events.
	 */
	private _sizeEventDisposer: $type.Optional<IDisposer>;

	/**
	 * Collection of objects and state ids that do not have any properties set.
	 */
	private _noStates: string[] = [];

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "Responsive";

		// Set up rules list events
		this.rules.events.on("inserted", this.checkRules, true);
		this.rules.events.on("removed", this.checkRules, true);
		this._disposers.push(this.rules.events);

		// Apply theme
		this.applyTheme();

	}

	/**
	 * A target object that responsive rules will need to be applied to.
	 *
	 * @param value  Target object
	 */
	public set component(value: $type.Optional<Component>) {

		// Check if it's the same
		if (value == this._component) {
			return;
		}

		// Check if we already have a set up component and remove its events
		if (this._sizeEventDisposer) {
			this.removeDispose(this._sizeEventDisposer);
		}

		// Set
		this._component = value;

		// Set up resize monitoring events
		this._sizeEventDisposer = $type.getValue(this.component).events.on("sizechanged", this.checkRules, this);
		this._disposers.push(this._sizeEventDisposer);

		// Enable resoponsive
		this.enabled = true;

	}

	/**
	 * @return Target object
	 */
	public get component(): $type.Optional<Component> {
		return this._component;
	}

	/**
	 * Should responsive rules be checked against and applied?
	 *
	 * @default false
	 * @param value  Apply responsive rules?
	 */
	public set enabled(value: boolean) {
		if (this._enabled != value) {
			this._enabled = value;

			// Run `applyRules` so that any currently applied rules can be reset
			this.applyRules();
		}
	}

	/**
	 * @return Apply responsive rules?
	 */
	public get enabled(): boolean {
		return this.adapter.apply("enabled", this._enabled);
	}

	/**
	 * Should default responsive rules be applied in addition to user-defined
	 * ones.
	 *
	 * User-defined rules will take precedence over default rules whenever they
	 * produce conflicting settings.
	 *
	 * @default true
	 * @param value  Use default rules?
	 */
	public set useDefault(value: boolean) {
		if (this._useDefault != value) {
			this._useDefault = value;

			// Run `applyRules` so that any currently applied rules can be reset
			this.applyRules();
		}
	}

	/**
	 * @return Use default rules?
	 */
	public get useDefault(): boolean {
		return this.adapter.apply("useDefault", this._useDefault);
	}

	/**
	 * User-defined responsive rules.
	 *
	 * User-defined rules will take precedence over default rules whenever they
	 * produce conflicting settings.
	 *
	 * Use `allRules` to get all applicable rules including default and
	 * user-defined ones.
	 *
	 * @param value  User-defined rules
	 */
	public set rules(value: List<IResponsiveRule>) {
		this._rules = value;
		this._enabled = true;
		this.applyRules();
	}

	/**
	 * @return User-defined rules
	 */
	public get rules(): List<IResponsiveRule> {
		return this.adapter.apply("rules", this._rules);
	}

	/**
	 * Default responsive rules.
	 *
	 * @readonly
	 * @return List of responsive rules
	 */
	public get defaultRules(): List<IResponsiveRule> {
		return this.adapter.apply("defaultRules", defaultRules);
	}

	/**
	 * Returns all rules: default rules (if not disabled) combined with
	 * user-defined ones.
	 *
	 * @readonly
	 * @return List of all applicable rules
	 */
	public get allRules(): List<IResponsiveRule> {

		// Create empty list
		let rules = new List<IResponsiveRule>();

		// Add default rules if not disabled
		// A code, requesting `allRules` must ensure loading of default rules
		// by calling `loadDefaultRules()`
		if (this.useDefault) {
			rules.copyFrom(this.defaultRules);
		}

		// Add user-defined ones
		rules.copyFrom(this.rules);

		return this.adapter.apply("allRules", rules);
	}

	/**
	 * Checks if rule by the particular id currently applied.
	 *
	 * @param ruleId  Rule ID
	 * @return Is currently applied?
	 */
	protected isApplied(ruleId: string): boolean {
		const rule = this._appliedRules[ruleId];
		return $type.hasValue(rule) ? rule : false;
	}

	/**
	 * Checks which responsive rules currently satisfy their conditions and
	 * should be applied, or unapplied.
	 *
	 * @ignore Exclude from docs
	 */
	public checkRules(): void {

		// Check if there are any rules
		let rules = this.allRules;
		if (!rules || rules.length == 0) {
			return;
		}


		// Init a list of rules to be applied
		let rulesChanged: boolean = false;

		const component = $type.getValue(this.component);

		// Check which rules match
		$iter.each(rules.iterator(), (rule) => {

			// Check if rule has an id
			if (!rule.id) {
				rule.id = registry.getUniqueId();
			}

			// Init indicator if this rule should be applied
			let apply = rule.relevant(component);

			// Let's check if this rule needs to be applied
			if ((apply && !this.isApplied(rule.id)) || (!apply && this.isApplied(rule.id))) {
				rulesChanged = true;
			}
			this._appliedRules[rule.id] = apply;
		});

		// Check if we need to re-apply the rules
		if (rulesChanged) {

			if (!this.component.isReady()) {
				// The chart is not yet ready (built)
				// We will hide the chart and delay application of rules
				// until "ready" event kicks in
				//component.hide(0);
				component.hidden = true;
				component.events.once("ready", (ev) => {
					ev.target.show(0);
					this.applyRules();
				});
				return;
			}
			this.dispatchImmediately("ruleschanged");
			this.applyRules();
		}

	}

	/**
	 * Applies current rules to the object.
	 *
	 * @ignore Exclude from docs
	 * @param target Target object
	 * @todo Better type check
	 */
	public applyRules(target?: Container): void {
		// If no target supplied, we assume the top-level element
		const newTarget = ($type.hasValue(target)
			? target
			: $type.getValue(this.component));

		// Check each rule
		let defaultStateApplied = false;
		if (this.enabled) {
			$iter.each(this.allRules.iterator(), (rule) => {

				// Get relevant state
				let state = this.getState(rule, newTarget);

				// If there's a state, it means it needs to be applied
				if (state) {

					// Check if default state was already applied to this element.
					// We don't want to go resetting default states to ALL element,
					// if they don't have responsive states.
					if (!defaultStateApplied) {
						// Nope, reset states (instantly).
						if ($array.indexOf(this._appliedTargets, newTarget.uid) !== -1) {
							// But only if this element has any rules applied, otherwise no
							// point in setting current state
							newTarget.applyCurrentState(0);
						}
						defaultStateApplied = true;
					}

					// Is this rule currently applied?
					$array.remove(this._appliedTargets, newTarget.uid);
					if (this.isApplied($type.getValue(rule.id))) {
						// Yes. Apply the responsive state
						state.transitionDuration = 0;
						newTarget.setState(state);
						this.dispatchImmediately("ruleapplied", {
							rule: rule
						});
						$array.replace(this._appliedTargets, newTarget.uid);
					}

				}
			});
		}

		// Apply rules to the children
		if (newTarget.children) {
			$iter.each(newTarget.children.iterator(), (child) => {
				this.applyRules(child as Container);
			});
		}

	}

	/**
	 * Applies specific oresponsive overrides to the element.
	 *
	 * @ignore Exclude from docs
	 * @param rule    Responsive rule
	 * @param target  Target element
	 * @deprecated
	 * @hidden
	 */
	/*	public applyRule(rule: IResponsiveRule, target: any): void {

			// Construct state id
			//let stateId = "responsive-" + rule.id;

			// Check if we need to create a state for the element
			let state = this.getState(rule, target);

			// Apply the state
			if (state) {
				//if (target.className == "Container" && target.parent.className == "ZoomControl") {
				console.log("Applying state to " + target.className + " (" + target.uid + "): " + JSON.stringify(state.properties));
				//}
				target.setState(state);
			}

		}*/

	/**
	 * Returns a relative state for the rule/target, or `undefined` if no state is
	 * needed.
	 *
	 * @param rule    [description]
	 * @param target  [description]
	 * @return [description]
	 */
	protected getState(rule: IResponsiveRule, target: any): Optional<SpriteState<any, any>> {
		let stateId = "responsive-" + rule.id;
		let tmpId = target.uid + "_" + stateId;
		if ($array.indexOf(this._noStates, tmpId) !== -1) {
			return;
		}
		else if (!target.states.hasKey(stateId)) {
			let state = rule.state(target, stateId);
			if (!state) {
				this._noStates.push(tmpId);
			}
			return state;
		}
		else {
			return target.states.getKey(stateId);
		}
	}

	/**
	 * Gets a value from an element.
	 *
	 * @ignore Exclude from docs
	 * @param target    Target object
	 * @param property  Property
	 * @return Property value
	 */
	public getValue(target: any, property: string): any {
		// This is a bit hacky, first we check if the property exist.
		// If it doesn't we try accessing target's property directly
		let value: any = target.getPropertyValue(property);
		if (!$type.hasValue(value) && $type.hasValue(target[property])) {
			value = target[property];
		}
		return value;
	}

}

/**
 * [defaultRules description]
 * 
 * @todo description
 */
export let defaultRules = new List<IResponsiveRule>();
defaultRules.events.on("inserted", (ev) => {
	ev.newValue.id = registry.getUniqueId();
});

/**
 * 
 * @todo description
 */
export class ResponsiveBreakpoints {

	// Named pixel breakpoints
	static XXS = 100;
	static XS = 200;
	static S = 300;
	static M = 400;
	static L = 600;
	static XL = 800;
	static XXL = 1000;

	// Breakpoint functions (for use in `relevant` clause of the responsive rules)

	static widthXXS(container: Container): boolean {
		return container.pixelWidth <= ResponsiveBreakpoints.XXS;
	}

	static widthXS(container: Container): boolean {
		return container.pixelWidth <= ResponsiveBreakpoints.XS;
	}

	static widthS(container: Container): boolean {
		return container.pixelWidth <= ResponsiveBreakpoints.S;
	}

	static widthM(container: Container): boolean {
		return container.pixelWidth <= ResponsiveBreakpoints.M;
	}

	static widthL(container: Container): boolean {
		return container.pixelWidth <= ResponsiveBreakpoints.L;
	}

	static widthXL(container: Container): boolean {
		return container.pixelWidth <= ResponsiveBreakpoints.XL;
	}

	static widthXXL(container: Container): boolean {
		return container.pixelWidth <= ResponsiveBreakpoints.XXL;
	}


	static heightXXS(container: Container): boolean {
		return container.pixelHeight <= ResponsiveBreakpoints.XXS;
	}

	static heightXS(container: Container): boolean {
		return container.pixelHeight <= ResponsiveBreakpoints.XS;
	}

	static heightS(container: Container): boolean {
		return container.pixelHeight <= ResponsiveBreakpoints.S;
	}

	static heightM(container: Container): boolean {
		return container.pixelHeight <= ResponsiveBreakpoints.M;
	}

	static heightL(container: Container): boolean {
		return container.pixelHeight <= ResponsiveBreakpoints.L;
	}

	static heightXL(container: Container): boolean {
		return container.pixelHeight <= ResponsiveBreakpoints.XL;
	}

	static heightXXL(container: Container): boolean {
		return container.pixelHeight <= ResponsiveBreakpoints.XXL;
	}


	static isXXS(container: Container): boolean {
		return (container.pixelWidth <= ResponsiveBreakpoints.XXS) && (container.pixelHeight <= ResponsiveBreakpoints.XXS);
	}

	static isXS(container: Container): boolean {
		return (container.pixelWidth <= ResponsiveBreakpoints.XS) && (container.pixelHeight <= ResponsiveBreakpoints.XS);
	}

	static isS(container: Container): boolean {
		return (container.pixelWidth <= ResponsiveBreakpoints.S) && (container.pixelHeight <= ResponsiveBreakpoints.S);
	}

	static isM(container: Container): boolean {
		return (container.pixelWidth <= ResponsiveBreakpoints.M) && (container.pixelHeight <= ResponsiveBreakpoints.M);
	}

	static isL(container: Container): boolean {
		return (container.pixelWidth <= ResponsiveBreakpoints.L) && (container.pixelHeight <= ResponsiveBreakpoints.L);
	}

	static isXL(container: Container): boolean {
		return (container.pixelWidth <= ResponsiveBreakpoints.XL) && (container.pixelHeight <= ResponsiveBreakpoints.XL);
	}

	static isXXL(container: Container): boolean {
		return (container.pixelWidth <= ResponsiveBreakpoints.XXL) && (container.pixelHeight <= ResponsiveBreakpoints.XXL);
	}


	static maybeXXS(container: Container): boolean {
		return (container.pixelWidth <= ResponsiveBreakpoints.XXS) || (container.pixelHeight <= ResponsiveBreakpoints.XXS);
	}

	static maybeXS(container: Container): boolean {
		return (container.pixelWidth <= ResponsiveBreakpoints.XS) || (container.pixelHeight <= ResponsiveBreakpoints.XS);
	}

	static maybeS(container: Container): boolean {
		return (container.pixelWidth <= ResponsiveBreakpoints.S) || (container.pixelHeight <= ResponsiveBreakpoints.S);
	}

	static maybeM(container: Container): boolean {
		return (container.pixelWidth <= ResponsiveBreakpoints.M) || (container.pixelHeight <= ResponsiveBreakpoints.M);
	}

	static maybeL(container: Container): boolean {
		return (container.pixelWidth <= ResponsiveBreakpoints.L) || (container.pixelHeight <= ResponsiveBreakpoints.L);
	}

	static maybeXL(container: Container): boolean {
		return (container.pixelWidth <= ResponsiveBreakpoints.XL) || (container.pixelHeight <= ResponsiveBreakpoints.XL);
	}

	static maybeXXL(container: Container): boolean {
		return (container.pixelWidth <= ResponsiveBreakpoints.XXL) || (container.pixelHeight <= ResponsiveBreakpoints.XXL);
	}
}