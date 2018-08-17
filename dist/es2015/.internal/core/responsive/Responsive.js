/**
 * Responsive functionality module.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { BaseObjectEvents } from "../Base";
import { List } from "../utils/List";
import { Adapter } from "../utils/Adapter";
import { registry } from "../Registry";
import * as $iter from "../utils/Iterator";
import * as $array from "../utils/Array";
import * as $type from "../utils/Type";
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
var Responsive = /** @class */ (function (_super) {
    tslib_1.__extends(Responsive, _super);
    /**
     * Constructor
     */
    function Responsive() {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * Holds a list of responsive rules organized by object type.
         *
         * @type {List<IResponsiveRule>}
         */
        _this._rules = new List();
        /**
         * Holds the list of the default responsive rules.
         *
         * @type {List<IResponsiveRule>}
         */
        _this._defaultRules = new List();
        /**
         * Holds the list of currently applied rules.
         *
         * @type {object}
         */
        _this._appliedRules = {};
        /**
         * Use default rules in addition to the user-defined ones?
         *
         * @type {Boolean}
         */
        _this._useDefault = true;
        /**
         * Adapter.
         *
         * @type {Adapter<Responsive, IResponsiveAdapters>}
         */
        _this.adapter = new Adapter(_this);
        /**
         * Indicates of responsive rules application is enabled.
         *
         * @type {Boolean}
         */
        _this._enabled = false;
        /**
         * Collection of objects and state ids that do not have any properties set.
         *
         * @type {string[]}
         */
        _this._noStates = [];
        _this.className = "Responsive";
        // Set up rules list events
        _this.rules.events.on("inserted", _this.checkRules, true);
        _this.rules.events.on("removed", _this.checkRules, true);
        _this._disposers.push(_this.rules.events);
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(Responsive.prototype, "component", {
        /**
         * @return {Optional<Component>} Target object
         */
        get: function () {
            return this._component;
        },
        /**
         * A target object that responsive rules will need to be applied to.
         *
         * @param {Optional<Component>}  value  Target object
         */
        set: function (value) {
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Responsive.prototype, "enabled", {
        /**
         * @return {boolean} Apply responsive rules?
         */
        get: function () {
            return this.adapter.apply("enabled", this._enabled);
        },
        /**
         * Should responsive rules be checked against and applied?
         *
         * @default false
         * @param {boolean}  value  Apply responsive rules?
         */
        set: function (value) {
            if (this._enabled != value) {
                this._enabled = value;
                // Run `applyRules` so that any currently applied rules can be reset
                this.applyRules();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Responsive.prototype, "useDefault", {
        /**
         * @return {boolean} Use default rules?
         */
        get: function () {
            return this.adapter.apply("useDefault", this._useDefault);
        },
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
        set: function (value) {
            if (this._useDefault != value) {
                this._useDefault = true;
                // Run `applyRules` so that any currently applied rules can be reset
                this.applyRules();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Responsive.prototype, "rules", {
        /**
         * @return {List<IResponsiveRule>} User-defined rules
         */
        get: function () {
            return this.adapter.apply("rules", this._rules);
        },
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
        set: function (value) {
            this._rules = value;
            this._enabled = true;
            this.applyRules();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Responsive.prototype, "defaultRules", {
        /**
         * Default responsive rules.
         *
         * @readonly
         * @return {List<IResponsiveRule>} List of responsive rules
         */
        get: function () {
            return this.adapter.apply("defaultRules", this._defaultRules);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Responsive.prototype, "allRules", {
        /**
         * Returns all rules: default rules (if not disabled) combined with
         * user-defined ones.
         *
         * @readonly
         * @return {List<IResponsiveRule>} List of all applicable rules
         */
        get: function () {
            // Create empty list
            var rules = new List();
            // Add default rules if not disabled
            // A code, requesting `allRules` must ensure loading of default rules
            // by calling `loadDefaultRules()`
            if (this.useDefault) {
                rules.copyFrom(this.defaultRules);
            }
            // Add user-defined ones
            rules.copyFrom(this.rules);
            return this.adapter.apply("allRules", rules);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Checks if rule by the particular id currently applied.
     *
     * @param  {string}   ruleId  Rule ID
     * @return {boolean}          Is currently applied?
     */
    Responsive.prototype.isApplied = function (ruleId) {
        var rule = this._appliedRules[ruleId];
        return $type.hasValue(rule) ? rule : false;
    };
    /**
     * Checks which responsive rules currently satisfy their conditions and
     * should be applied, or unapplied.
     *
     * @ignore Exclude from docs
     */
    Responsive.prototype.checkRules = function () {
        var _this = this;
        // Check if default rules need to be loaded
        // If needed, we wait until it's loaded and then call `checkRules` again
        if (this.useDefault && this.defaultRules.length == 0) {
            this.loadDefaultRules().then(function (res) {
                _this._defaultRules.setAll(res.default);
                _this.checkRules();
            });
            return;
        }
        // Check if there are any rules
        var rules = this.allRules;
        if (!rules || rules.length == 0) {
            return;
        }
        // Init a list of rules to be applied
        var rulesChanged = false;
        var component = $type.getValue(this.component);
        // Check which rules match
        $iter.each(rules.iterator(), function (rule) {
            // Check if rule has an id
            if (!rule.id) {
                rule.id = registry.getUniqueId();
            }
            // Init indicator if this rule should be applied
            var apply = rule.relevant(component);
            // Let's check if this rule needs to be applied
            if ((apply && !_this.isApplied(rule.id)) || (!apply && _this.isApplied(rule.id))) {
                rulesChanged = true;
            }
            _this._appliedRules[rule.id] = apply;
        });
        // Check if we need to re-apply the rules
        if (rulesChanged) {
            this.applyRules();
        }
    };
    /**
     * Applies current rules to the object.
     *
     * @ignore Exclude from docs
     * @param {any} target Target object
     * @todo Better type check
     */
    Responsive.prototype.applyRules = function (target) {
        var _this = this;
        // If no target supplied, we assume the top-level element
        var newTarget = ($type.hasValue(target)
            ? target
            : $type.getValue(this.component));
        // Check each rule
        var defaultStateApplied = false;
        if (this.enabled) {
            $iter.each(this.allRules.iterator(), function (rule) {
                // Get relevant state
                var state = _this.getState(rule, newTarget);
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
                    if (_this.isApplied($type.getValue(rule.id))) {
                        // Yes. Apply the responsive state
                        //console.log("Applying state to " + newTarget.className + " (" + newTarget.uid + "): " + JSON.stringify(state.properties));
                        newTarget.setState(state);
                    }
                }
            });
        }
        // Apply rules to the children
        if (newTarget.children) {
            $iter.each(newTarget.children.iterator(), function (child) {
                _this.applyRules(child);
            });
        }
    };
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
    Responsive.prototype.getState = function (rule, target) {
        var stateId = "responsive-" + rule.id;
        var tmpId = target.uid + "_" + stateId;
        if ($array.indexOf(this._noStates, tmpId) !== -1) {
            return;
        }
        else if (!target.states.hasKey(stateId)) {
            var state = rule.state(target, stateId);
            if (!state) {
                this._noStates.push(tmpId);
            }
            return state;
        }
        else {
            return target.states.getKey(stateId);
        }
    };
    /**
     * Gets a value from an element.
     *
     * @ignore Exclude from docs
     * @param  {any}     target    Target object
     * @param  {string}  property  Property
     * @return {any}               Property value
     */
    Responsive.prototype.getValue = function (target, property) {
        // This is a bit hacky, first we check if the property exist.
        // If it doesn't we try accessing target's property directly
        var value = target.getPropertyValue(property);
        if (!$type.hasValue(value) && $type.hasValue(target[property])) {
            value = target[property];
        }
        return value;
    };
    /**
     * Loads default responsive rules.
     *
     * @ignore Exclude from docs
     * @return {Promise<any>} Responsive rules
     */
    Responsive.prototype.loadDefaultRules = function () {
        return import(/* webpackChunkName: "responsivedefaults" */ "./ResponsiveDefaults");
    };
    return Responsive;
}(BaseObjectEvents));
export { Responsive };
//# sourceMappingURL=Responsive.js.map