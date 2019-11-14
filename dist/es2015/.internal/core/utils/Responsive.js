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
         */
        _this._rules = new List();
        /**
         * Holds the list of the default responsive rules.
         * @deprecated
         */
        //protected _defaultRules = new List<IResponsiveRule>();
        /**
         * Holds the list of currently applied rules.
         */
        _this._appliedRules = {};
        /**
         * Used to keep track of objects that have rules applied at the moment.
         */
        _this._appliedTargets = [];
        /**
         * Use default rules in addition to the user-defined ones?
         */
        _this._useDefault = true;
        /**
         * Adapter.
         */
        _this.adapter = new Adapter(_this);
        /**
         * Indicates of responsive rules application is enabled.
         */
        _this._enabled = false;
        /**
         * Collection of objects and state ids that do not have any properties set.
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
         * @return Target object
         */
        get: function () {
            return this._component;
        },
        /**
         * A target object that responsive rules will need to be applied to.
         *
         * @param value  Target object
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
         * @return Apply responsive rules?
         */
        get: function () {
            return this.adapter.apply("enabled", this._enabled);
        },
        /**
         * Should responsive rules be checked against and applied?
         *
         * @default false
         * @param value  Apply responsive rules?
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
         * @return Use default rules?
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
         * @param value  Use default rules?
         */
        set: function (value) {
            if (this._useDefault != value) {
                this._useDefault = value;
                // Run `applyRules` so that any currently applied rules can be reset
                this.applyRules();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Responsive.prototype, "rules", {
        /**
         * @return User-defined rules
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
         * @param value  User-defined rules
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
         * @return List of responsive rules
         */
        get: function () {
            return this.adapter.apply("defaultRules", defaultRules);
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
         * @return List of all applicable rules
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
     * @param ruleId  Rule ID
     * @return Is currently applied?
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
            if (!this.component.isReady()) {
                // The chart is not yet ready (built)
                // We will hide the chart and delay application of rules
                // until "ready" event kicks in
                //component.hide(0);
                component.hidden = true;
                component.events.once("ready", function (ev) {
                    ev.target.show(0);
                    _this.applyRules();
                });
                return;
            }
            this.dispatchImmediately("ruleschanged");
            this.applyRules();
        }
    };
    /**
     * Applies current rules to the object.
     *
     * @ignore Exclude from docs
     * @param target Target object
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
                        if ($array.indexOf(_this._appliedTargets, newTarget.uid) !== -1) {
                            // But only if this element has any rules applied, otherwise no
                            // point in setting current state
                            newTarget.applyCurrentState(0);
                        }
                        defaultStateApplied = true;
                    }
                    // Is this rule currently applied?
                    $array.remove(_this._appliedTargets, newTarget.uid);
                    if (_this.isApplied($type.getValue(rule.id))) {
                        // Yes. Apply the responsive state
                        state.transitionDuration = 0;
                        newTarget.setState(state);
                        _this.dispatchImmediately("ruleapplied", {
                            rule: rule
                        });
                        $array.replace(_this._appliedTargets, newTarget.uid);
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
     * @param target    Target object
     * @param property  Property
     * @return Property value
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
    return Responsive;
}(BaseObjectEvents));
export { Responsive };
/**
 * [defaultRules description]
 *
 * @todo description
 */
export var defaultRules = new List();
defaultRules.events.on("inserted", function (ev) {
    ev.newValue.id = registry.getUniqueId();
});
/**
 *
 * @todo description
 */
var ResponsiveBreakpoints = /** @class */ (function () {
    function ResponsiveBreakpoints() {
    }
    // Breakpoint functions (for use in `relevant` clause of the responsive rules)
    ResponsiveBreakpoints.widthXXS = function (container) {
        return container.pixelWidth <= ResponsiveBreakpoints.XXS;
    };
    ResponsiveBreakpoints.widthXS = function (container) {
        return container.pixelWidth <= ResponsiveBreakpoints.XS;
    };
    ResponsiveBreakpoints.widthS = function (container) {
        return container.pixelWidth <= ResponsiveBreakpoints.S;
    };
    ResponsiveBreakpoints.widthM = function (container) {
        return container.pixelWidth <= ResponsiveBreakpoints.M;
    };
    ResponsiveBreakpoints.widthL = function (container) {
        return container.pixelWidth <= ResponsiveBreakpoints.L;
    };
    ResponsiveBreakpoints.widthXL = function (container) {
        return container.pixelWidth <= ResponsiveBreakpoints.XL;
    };
    ResponsiveBreakpoints.widthXXL = function (container) {
        return container.pixelWidth <= ResponsiveBreakpoints.XXL;
    };
    ResponsiveBreakpoints.heightXXS = function (container) {
        return container.pixelHeight <= ResponsiveBreakpoints.XXS;
    };
    ResponsiveBreakpoints.heightXS = function (container) {
        return container.pixelHeight <= ResponsiveBreakpoints.XS;
    };
    ResponsiveBreakpoints.heightS = function (container) {
        return container.pixelHeight <= ResponsiveBreakpoints.S;
    };
    ResponsiveBreakpoints.heightM = function (container) {
        return container.pixelHeight <= ResponsiveBreakpoints.M;
    };
    ResponsiveBreakpoints.heightL = function (container) {
        return container.pixelHeight <= ResponsiveBreakpoints.L;
    };
    ResponsiveBreakpoints.heightXL = function (container) {
        return container.pixelHeight <= ResponsiveBreakpoints.XL;
    };
    ResponsiveBreakpoints.heightXXL = function (container) {
        return container.pixelHeight <= ResponsiveBreakpoints.XXL;
    };
    ResponsiveBreakpoints.isXXS = function (container) {
        return (container.pixelWidth <= ResponsiveBreakpoints.XXS) && (container.pixelHeight <= ResponsiveBreakpoints.XXS);
    };
    ResponsiveBreakpoints.isXS = function (container) {
        return (container.pixelWidth <= ResponsiveBreakpoints.XS) && (container.pixelHeight <= ResponsiveBreakpoints.XS);
    };
    ResponsiveBreakpoints.isS = function (container) {
        return (container.pixelWidth <= ResponsiveBreakpoints.S) && (container.pixelHeight <= ResponsiveBreakpoints.S);
    };
    ResponsiveBreakpoints.isM = function (container) {
        return (container.pixelWidth <= ResponsiveBreakpoints.M) && (container.pixelHeight <= ResponsiveBreakpoints.M);
    };
    ResponsiveBreakpoints.isL = function (container) {
        return (container.pixelWidth <= ResponsiveBreakpoints.L) && (container.pixelHeight <= ResponsiveBreakpoints.L);
    };
    ResponsiveBreakpoints.isXL = function (container) {
        return (container.pixelWidth <= ResponsiveBreakpoints.XL) && (container.pixelHeight <= ResponsiveBreakpoints.XL);
    };
    ResponsiveBreakpoints.isXXL = function (container) {
        return (container.pixelWidth <= ResponsiveBreakpoints.XXL) && (container.pixelHeight <= ResponsiveBreakpoints.XXL);
    };
    ResponsiveBreakpoints.maybeXXS = function (container) {
        return (container.pixelWidth <= ResponsiveBreakpoints.XXS) || (container.pixelHeight <= ResponsiveBreakpoints.XXS);
    };
    ResponsiveBreakpoints.maybeXS = function (container) {
        return (container.pixelWidth <= ResponsiveBreakpoints.XS) || (container.pixelHeight <= ResponsiveBreakpoints.XS);
    };
    ResponsiveBreakpoints.maybeS = function (container) {
        return (container.pixelWidth <= ResponsiveBreakpoints.S) || (container.pixelHeight <= ResponsiveBreakpoints.S);
    };
    ResponsiveBreakpoints.maybeM = function (container) {
        return (container.pixelWidth <= ResponsiveBreakpoints.M) || (container.pixelHeight <= ResponsiveBreakpoints.M);
    };
    ResponsiveBreakpoints.maybeL = function (container) {
        return (container.pixelWidth <= ResponsiveBreakpoints.L) || (container.pixelHeight <= ResponsiveBreakpoints.L);
    };
    ResponsiveBreakpoints.maybeXL = function (container) {
        return (container.pixelWidth <= ResponsiveBreakpoints.XL) || (container.pixelHeight <= ResponsiveBreakpoints.XL);
    };
    ResponsiveBreakpoints.maybeXXL = function (container) {
        return (container.pixelWidth <= ResponsiveBreakpoints.XXL) || (container.pixelHeight <= ResponsiveBreakpoints.XXL);
    };
    // Named pixel breakpoints
    ResponsiveBreakpoints.XXS = 100;
    ResponsiveBreakpoints.XS = 200;
    ResponsiveBreakpoints.S = 300;
    ResponsiveBreakpoints.M = 400;
    ResponsiveBreakpoints.L = 600;
    ResponsiveBreakpoints.XL = 800;
    ResponsiveBreakpoints.XXL = 1000;
    return ResponsiveBreakpoints;
}());
export { ResponsiveBreakpoints };
//# sourceMappingURL=Responsive.js.map