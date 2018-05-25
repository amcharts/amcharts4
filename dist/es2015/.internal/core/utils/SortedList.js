var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { EventDispatcher } from "./EventDispatcher";
import * as $array from "./Array";
import * as $iter from "./Iterator";
import * as $type from "./Type";
/**
 * Ordered list contains values of any type in an indexed array.
 */
var OrderedList = /** @class */ (function () {
    /**
     * Constructor
     *
     * @param {Array<T>}  initial  Inital list of values to add to list
     */
    function OrderedList(initial) {
        /**
         * Holds list values.
         *
         * @type {Array<T>}
         */
        this._values = [];
        /**
         * Event dispatcher.
         *
         * @type {EventDispatcher<AMEvent<OrderedList<T>, ISortedListEvents<T>>>}
         */
        this.events = new EventDispatcher();
        if (initial != null) {
            this.setAll(initial);
        }
    }
    Object.defineProperty(OrderedList.prototype, "values", {
        /**
         * All items of the list.
         *
         * Do not modify the list directly. Rather use `insert()` and `remove()`
         * methods.
         *
         * @return {Array<T>} List values
         */
        get: function () {
            return this._values;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Inserts a value into list item array.
     *
     * @param {T}  value  Value
     */
    OrderedList.prototype._insert = function (value) {
        this._values.push(value);
    };
    Object.defineProperty(OrderedList.prototype, "length", {
        /**
         * Number of items in the list.
         *
         * @readonly
         * @return {number} Length
         */
        get: function () {
            return this._values.length;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns the index of the specific `value`.
     *
     * -1 if not found.
     *
     * @param  {T}       value  Value
     * @return {number}        Index
     */
    OrderedList.prototype.indexOf = function (value) {
        return $array.indexOf(this._values, value);
    };
    /**
     * Checks if list contains the `value`.
     *
     * @param  {T}        value  Value
     * @return {boolean}         In the list?
     */
    OrderedList.prototype.contains = function (value) {
        return this.indexOf(value) !== -1;
    };
    /**
     * Returns an item at specific `index`.
     *
     * @param  {number}  index  Index
     * @return {T}              Item
     */
    OrderedList.prototype.getIndex = function (index) {
        return this._values[index];
    };
    Object.defineProperty(OrderedList.prototype, "first", {
        /**
         * First item in the list.
         *
         * @return {T} Item
         */
        get: function () {
            return this._values[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OrderedList.prototype, "last", {
        /**
         * Last item in the list.
         *
         * @return {T} Item
         */
        get: function () {
            return this._values[this._values.length - 1];
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Inserts a value into list.
     *
     * @param {T}  value  Value
     */
    OrderedList.prototype.insert = function (value) {
        this._insert(value);
        if (this.events.isEnabled("insert")) {
            this.events.dispatchImmediately("insert", {
                type: "insert",
                target: this,
                newValue: value
            });
        }
    };
    /**
     * Removes an item with the `value` from the list.
     *
     * @param {T}  value  Value
     */
    OrderedList.prototype.remove = function (value) {
        var index = this.indexOf(value);
        if (index !== -1) {
            var oldValue = this._values[index];
            $array.removeIndex(this._values, index);
            if (this.events.isEnabled("remove")) {
                this.events.dispatchImmediately("remove", {
                    type: "remove",
                    target: this,
                    oldValue: oldValue
                });
            }
        }
    };
    /**
     * Sets multiple items to the list.
     *
     * All current items are removed.
     *
     * @param {Array<T>}  newArray  New items
     */
    OrderedList.prototype.setAll = function (newArray) {
        var _this = this;
        var oldArray = $array.copy(this._values);
        this._values.length = 0;
        $array.each(newArray, function (value) {
            _this._insert(value);
        });
        if (this.events.isEnabled("remove")) {
            $array.each(oldArray, function (x) {
                _this.events.dispatchImmediately("remove", {
                    type: "remove",
                    target: _this,
                    oldValue: x
                });
            });
        }
        if (this.events.isEnabled("insert")) {
            $array.each(this._values, function (x) {
                _this.events.dispatchImmediately("insert", {
                    type: "insert",
                    target: _this,
                    newValue: x
                });
            });
        }
    };
    /**
     * Removes all items from the list.
     */
    OrderedList.prototype.clear = function () {
        this.setAll([]);
    };
    /**
     * Returns part of the list between `start` and `end` indexes, as a new
     * [[OrderedList]].
     *
     * @param  {number}          start  Start index
     * @param  {number}          end    End index
     * @return {OrderedList<T>}         Items in range
     */
    OrderedList.prototype.slice = function (start, end) {
        var out = new OrderedList();
        out._values = this._values.slice(start, end);
        return out;
    };
    /**
     * Finds a closest available index to the `value` in specified direction.
     *
     * @ignore exclude from docs
     * @param  {number}                      value      value to search for
     * @param  {function}                    fn         A callback function that returns value of the item
     * @param  {"left" | "right" |  "any" }  direction  Direciton
     * @return {number}                                 Index
     */
    OrderedList.prototype.findClosestIndex = function (value, fn, direction) {
        if (direction === void 0) { direction = "any"; }
        // Init temporary values
        var closestIndex = -1;
        var closestValue;
        var closestDifference;
        var i = 0;
        $iter.eachContinue(this.iterator(), function (element) {
            var item = fn(element);
            // Exact match?
            if (item === value) {
                // Found exact value - don't bother searching further
                closestIndex = i;
                return false;
            }
            // Calc difference
            if (direction === "any") {
                var difference = Math.abs(value - item);
                if (!$type.hasValue(closestDifference) || (closestDifference > difference)) {
                    closestIndex = i;
                    closestValue = item;
                    closestDifference = difference;
                }
            }
            else if (direction === "left" && (item < value)) {
                if (!$type.hasValue(closestValue) || (closestValue < item)) {
                    closestIndex = i;
                    closestValue = item;
                }
            }
            else if (direction === "right" && (item > value)) {
                if (!$type.hasValue(closestValue) || (closestValue > item)) {
                    closestIndex = i;
                    closestValue = item;
                }
            }
            ++i;
            return true;
        });
        // Found nothing?
        if (closestIndex === -1) {
            if (direction === "left") {
                // Use First one
                closestIndex = 0;
            }
            else if (direction === "right") {
                // Use last item
                closestIndex = this.length - 1;
            }
        }
        return closestIndex;
    };
    /**
     * Returns a list iterator.
     *
     * @return {Iterator} Iterator
     */
    OrderedList.prototype.iterator = function () {
        return $iter.fromArray(this._values);
    };
    /**
     * Returns an ES6 iterator for the list.
     */
    OrderedList.prototype[Symbol.iterator] = function () {
        var length, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    length = this._values.length;
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < length)) return [3 /*break*/, 4];
                    return [4 /*yield*/, this._values[i]];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    ++i;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    };
    /**
     * Calls `f` for each element in the list.
     */
    OrderedList.prototype.each = function (f) {
        $array.each(this._values, f);
    };
    return OrderedList;
}());
export { OrderedList };
/**
 * A list where all items are ordered according to specific ordering function,
 * which is passed in via constructor parameter, when creating an instance of
 * [[SortedList]].
 */
var SortedList = /** @class */ (function (_super) {
    __extends(SortedList, _super);
    /**
     * Constructor.
     *
     * @param {T) => Ordering}  sort  Ordering function
     */
    function SortedList(sort) {
        var _this = _super.call(this) || this;
        _this._ordering = sort;
        return _this;
    }
    /**
     * Inserts item into the list.
     *
     * @param {T}  value  Item
     */
    SortedList.prototype._insert = function (value) {
        var index = $array.getSortedIndex(this._values, this._ordering, value).index;
        $array.insertIndex(this._values, index, value);
    };
    /**
     * Returns index of the item in list if found.
     *
     * -1 if item is not in the list.
     *
     * @param  {T}       value  Item to search for
     * @return {number}         Index
     */
    SortedList.prototype.indexOf = function (value) {
        var _a = $array.getSortedIndex(this._values, this._ordering, value), found = _a.found, index = _a.index;
        if (found) {
            return index;
        }
        else {
            return -1;
        }
    };
    /**
     * [udpate description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param {T} value [description]
     */
    SortedList.prototype.update = function (value) {
        // @todo test this
        var index = $array.indexOf(this._values, value);
        // @todo throw an error if it doesn't exist ?
        if (index !== -1) {
            var last = this._values.length - 1;
            // Check if the current ordering is correct
            if (!((index === 0 || this._ordering(this._values[index - 1], value) < 0) &&
                (index === last || this._ordering(value, this._values[index + 1]) < 0))) {
                $array.removeIndex(this._values, index);
                this._insert(value);
            }
        }
    };
    return SortedList;
}(OrderedList));
export { SortedList };
/**
 * A version of a [[OrderedList]] that has a "template".
 *
 * A template is an instance of an object, that can be used to create new
 * elements in the list without actually needing to create instances for those.
 *
 * When new element is created in the list, e.g. by calling its `create()`
 * method, an exact copy of the element is created (including properties and
 * other attributes), inserted into the list and returned.
 */
var OrderedListTemplate = /** @class */ (function (_super) {
    __extends(OrderedListTemplate, _super);
    /**
     * Constructor
     *
     * @param {T} t Template object
     */
    function OrderedListTemplate(t) {
        var _this = _super.call(this) || this;
        _this.template = t;
        return _this;
    }
    Object.defineProperty(OrderedListTemplate.prototype, "template", {
        /**
         * @return {T} Template object
         */
        get: function () {
            return this._template;
        },
        /**
         * A "template" object to copy all properties from when creating new list
         * items.
         *
         * @param {T}  v  Template object
         */
        set: function (v) {
            v.isTemplate = true;
            this._template = v;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Copies all elements from other list.
     *
     * @param {OrderedListTemplate}  source  Source list
     */
    OrderedListTemplate.prototype.copyFrom = function (source) {
        var _this = this;
        $iter.each(source.iterator(), function (value) {
            _this.insert(value.clone());
        });
    };
    /**
     * Returns part of the list, starting at `start` and ending at `end` indexes,
     * as a new [[OrderedListTemplate]].
     *
     * @param  {number}                  start  Start index
     * @param  {number}                  end    End index
     * @return {OrderedListTemplate<T>}         New list
     */
    OrderedListTemplate.prototype.slice = function (start, end) {
        var out = new OrderedListTemplate(this.template);
        out._values = this._values.slice(start, end);
        return out;
    };
    OrderedListTemplate.prototype.create = function (make) {
        var clone = (make != null
            ? new make()
            : this.template.clone());
        this.insert(clone);
        return clone;
    };
    return OrderedListTemplate;
}(OrderedList));
export { OrderedListTemplate };
/**
 * A version of a [[SortedList]] that has a "template".
 *
 * A template is an instance of an object, that can be used to create new
 * elements in the list without actually needing to create instances for those.
 *
 * When new element is created in the list, e.g. by calling its `create()`
 * method, an exact copy of the element is created (including properties and
 * other attributes), inserted into the list and returned.
 */
var SortedListTemplate = /** @class */ (function (_super) {
    __extends(SortedListTemplate, _super);
    /**
     * Constructor
     *
     * @param {T}         t     Template object
     * @param {function}  sort  Ordering function
     */
    function SortedListTemplate(t, sort) {
        var _this = _super.call(this, sort) || this;
        _this.template = t;
        return _this;
    }
    Object.defineProperty(SortedListTemplate.prototype, "template", {
        /**
         * @return {T} Template object
         */
        get: function () {
            return this._template;
        },
        /**
         * A "template" object to copy all properties from when creating new list
         * items.
         *
         * @param {T}  v  Template object
         */
        set: function (v) {
            v.isTemplate = true;
            this._template = v;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Copies all elements from other list.
     *
     * @param {SortedListTemplate}  source  Source list
     */
    SortedListTemplate.prototype.copyFrom = function (source) {
        var _this = this;
        $iter.each(source.iterator(), function (value) {
            _this.insert(value.clone());
        });
    };
    SortedListTemplate.prototype.create = function (make) {
        var clone = (make != null
            ? new make()
            : this.template.clone());
        this.insert(clone);
        return clone;
    };
    return SortedListTemplate;
}(SortedList));
export { SortedListTemplate };
//# sourceMappingURL=SortedList.js.map