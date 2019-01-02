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
import { EventDispatcher, AMEvent } from "../utils/EventDispatcher";
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
	 *
	 * @type {function}
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
	 *
	 * @type {function}
	 */
	state(target: Sprite, stateId: string): Optional<SpriteState<ISpriteProperties, ISpriteAdapters>>;

	/**
	 * ID of the rule.
	 *
	 * @type {string}
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
		 *
		 * @type {IResponsiveRule}
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
	 *
	 * @type {boolean}
	 */
	enabled: boolean;

	/**
	 * Use default rules?
	 *
	 * If this is set `false`, only user-defined rules will be applied.
	 *
	 * @type {boolean}
	 */
	useDefault: boolean;

	/**
	 * A list of user-defined rules.
	 *
	 * @type {List<IResponsiveRule>}
	 */
	rules: List<IResponsiveRule>;

	/**
	 * A list of default rules.
	 *
	 * @type {List<IResponsiveRule>}
	 */
	defaultRules: List<IResponsiveRule>;

	/**
	 * A list of **all** rules - user-defined and default combined.
	 *
	 * @type {List<IResponsiveRule>}
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
	 *
	 * @type {List<IResponsiveRule>}
	 */
	protected _rules = new List<IResponsiveRule>();

	/**
	 * Holds the list of the default responsive rules.
	 *
	 * @type {List<IResponsiveRule>}
	 */
	protected _defaultRules = new List<IResponsiveRule>();

	/**
	 * Holds the list of currently applied rules.
	 *
	 * @type {object}
	 */
	protected _appliedRules: { [index: string]: boolean } = {};

	/**
	 * Use default rules in addition to the user-defined ones?
	 *
	 * @type {Boolean}
	 */
	protected _useDefault = true;

	/**
	 * A target object responsive rules apply to.
	 *
	 * @type {Component}
	 */
	protected _component: $type.Optional<Component>;

	/**
	 * Defines available events.
	 *
	 * @type {IResponsiveEvents}
	 */
	public _events!: IResponsiveEvents;

	/**
	 * Defines available adapters.
	 *
	 * @type {IExportAdapters}
	 */
	public _adapter!: IResponsiveAdapters;

	/**
	 * Adapter.
	 *
	 * @type {Adapter<Responsive, IResponsiveAdapters>}
	 */
	public adapter = new Adapter<this, IResponsiveAdapters>(this);

	/**
	 * Indicates of responsive rules application is enabled.
	 *
	 * @type {Boolean}
	 */
	protected _enabled = false;

	/**
	 * Holds a disposer for size events.
	 *
	 * @type {IDisposer}
	 */
	private _sizeEventDisposer: $type.Optional<IDisposer>;

	/**
	 * Collection of objects and state ids that do not have any properties set.
	 *
	 * @type {string[]}
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
	 * @param {Optional<Component>}  value  Target object
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
	 * @return {Optional<Component>} Target object
	 */
	public get component(): $type.Optional<Component> {
		return this._component;
	}

	/**
	 * Should responsive rules be checked against and applied?
	 *
	 * @default false
	 * @param {boolean}  value  Apply responsive rules?
	 */
	public set enabled(value: boolean) {
		if (this._enabled != value) {
			this._enabled = value;

			// Run `applyRules` so that any currently applied rules can be reset
			this.applyRules();
		}
	}

	/**
	 * @return {boolean} Apply responsive rules?
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
	 * @param {boolean}  value  Use default rules?
	 */
	public set useDefault(value: boolean) {
		if (this._useDefault != value) {
			this._useDefault = true;

			// Run `applyRules` so that any currently applied rules can be reset
			this.applyRules();
		}
	}

	/**
	 * @return {boolean} Use default rules?
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
	 * @param {List<IResponsiveRule>}  value  User-defined rules
	 */
	public set rules(value: List<IResponsiveRule>) {
		this._rules = value;
		this._enabled = true;
		this.applyRules();
	}

	/**
	 * @return {List<IResponsiveRule>} User-defined rules
	 */
	public get rules(): List<IResponsiveRule> {
		return this.adapter.apply("rules", this._rules);
	}

	/**
	 * Default responsive rules.
	 *
	 * @readonly
	 * @return {List<IResponsiveRule>} List of responsive rules
	 */
	public get defaultRules(): List<IResponsiveRule> {
		return this.adapter.apply("defaultRules", this._defaultRules);
	}

	/**
	 * Returns all rules: default rules (if not disabled) combined with
	 * user-defined ones.
	 *
	 * @readonly
	 * @return {List<IResponsiveRule>} List of all applicable rules
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
	 * @param  {string}   ruleId  Rule ID
	 * @return {boolean}          Is currently applied?
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

		// Check if default rules need to be loaded
		// If needed, we wait until it's loaded and then call `checkRules` again
		if (this.useDefault && this.defaultRules.length == 0) {
			this.loadDefaultRules().then((res) => {
				this._defaultRules.setAll(res.default);
				this.checkRules();
			});
			return;
		}

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
			this.applyRules();
		}

	}

	/**
	 * Applies current rules to the object.
	 *
	 * @ignore Exclude from docs
	 * @param {any} target Target object
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
						//console.log("Applying default state to " + newTarget.className + " (" + newTarget.uid + "): " + JSON.stringify(newTarget.defaultState.properties));
						newTarget.applyCurrentState(0);
						defaultStateApplied = true;
					}

					// Is this rule currently applied?
					if (this.isApplied($type.getValue(rule.id))) {
						// Yes. Apply the responsive state
						//console.log("Applying state to " + newTarget.className + " (" + newTarget.uid + "): " + JSON.stringify(state.properties));
						newTarget.setState(state);
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
	 * @param {IResponsiveRule}  rule    Responsive rule
	 * @param {any}              target  Target element
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
	 * @param  {IResponsiveRule}  rule    [description]
	 * @param  {any}              target  [description]
	 * @return {Optional}                 [description]
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
	 * @param  {any}     target    Target object
	 * @param  {string}  property  Property
	 * @return {any}               Property value
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

	/**
	 * Loads default responsive rules.
	 *
	 * @ignore Exclude from docs
	 * @return {Promise<any>} Responsive rules
	 */
	public loadDefaultRules(): Promise<any> {
		return import(/* webpackChunkName: "responsivedefaults" */ "./ResponsiveDefaults");
	}

}
