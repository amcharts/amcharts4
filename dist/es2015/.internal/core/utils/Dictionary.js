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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Disposer } from "./Disposer";
import { EventDispatcher } from "./EventDispatcher";
import * as $object from "./Object";
import * as $iter from "./Iterator";
import * as $string from "./String";
/**
 * A disposable dictionary, which when disposed itself will call `dispose()`
 * method on all its items.
 */
var DictionaryDisposer = /** @class */ (function (_super) {
    __extends(DictionaryDisposer, _super);
    function DictionaryDisposer(dict) {
        var _this = this;
        var disposer = dict.events.on("remove", function (x) {
            x.oldValue.dispose();
        });
        _this = _super.call(this, function () {
            disposer.dispose();
            // TODO clear the dictionary ?
            $iter.each(dict.iterator(), function (a) {
                var v = a[1];
                v.dispose();
            });
        }) || this;
        return _this;
    }
    return DictionaryDisposer;
}(Disposer));
export { DictionaryDisposer };
/**
 * A Dictionary is collection where values of some type can be mapped to
 * string keys.
 *
 * You might call it an "associative list" or "associative array".
 */
var Dictionary = /** @class */ (function () {
    /**
     * Constructor
     */
    function Dictionary() {
        /**
         * Event dispatcher.
         *
         * @type {EventDispatcher<AMEvent<Dictionary<Key, T>, IDictionaryEvents<Key, T>>>}
         */
        this.events = new EventDispatcher();
        this._dictionary = {};
    }
    /**
     * Returns `true` if key exists in Dictionary.
     *
     * @param  {Key}      key  The key to search for
     * @return {boolean}       `true` if key exists, `false` if it doesn't
     */
    Dictionary.prototype.hasKey = function (key) {
        return $object.hasKey(this._dictionary, key);
    };
    /**
     * Returns the value for a specific key.
     *
     * @param  {Key}          key  The key to search for
     * @return {Optional<T>}       Value for the key, or `undefined` if it doesn't exist
     */
    Dictionary.prototype.getKey = function (key) {
        return this._dictionary[key];
    };
    /**
     * Inserts value at specific key.
     *
     * Will thrown an exception if the key already exists in the dictionary.
     *
     * @param {Key}  key    Key
     * @param {T}    value  Value
     */
    Dictionary.prototype.insertKey = function (key, value) {
        if ($object.hasKey(this._dictionary, key)) {
            throw new Error("Key " + key + " already exists in dictionary");
        }
        else {
            this._dictionary[key] = value;
            if (this.events.isEnabled("insertKey")) {
                this.events.dispatchImmediately("insertKey", {
                    type: "insertKey",
                    target: this,
                    key: key,
                    newValue: value
                });
            }
        }
    };
    /**
     * Adds or updates key/value into dictionary.
     *
     * If the key already exists, the old value will be overwritten.
     *
     * @param  {Key}  key    Key
     * @param  {T}    value  Value
     */
    Dictionary.prototype.setKey = function (key, value) {
        if ($object.hasKey(this._dictionary, key)) {
            var oldValue = this._dictionary[key];
            this._dictionary[key] = value;
            if (this.events.isEnabled("setKey")) {
                this.events.dispatchImmediately("setKey", {
                    type: "setKey",
                    target: this,
                    key: key,
                    oldValue: oldValue,
                    newValue: value
                });
            }
            if (this.events.isEnabled("remove")) {
                this.events.dispatchImmediately("remove", {
                    type: "remove",
                    target: this,
                    oldValue: oldValue
                });
            }
        }
        else {
            this._dictionary[key] = value;
            if (this.events.isEnabled("insertKey")) {
                this.events.dispatchImmediately("insertKey", {
                    type: "insertKey",
                    target: this,
                    key: key,
                    newValue: value
                });
            }
        }
    };
    /**
     * Updates the value at specific `key` using custom function.
     *
     * Passes in current value into the function, and uses its output as a new
     * value.
     *
     * @ignore Exclude from docs
     * @param {Key}       key  Key
     * @param {function}  fn   Function to transform the value
     */
    Dictionary.prototype.updateKey = function (key, fn) {
        if ($object.hasKey(this._dictionary, key)) {
            var oldValue = this._dictionary[key];
            var newValue = fn(oldValue);
            this._dictionary[key] = newValue;
            if (this.events.isEnabled("setKey")) {
                this.events.dispatchImmediately("setKey", {
                    type: "setKey",
                    target: this,
                    key: key,
                    oldValue: oldValue,
                    newValue: newValue
                });
            }
            if (this.events.isEnabled("remove")) {
                this.events.dispatchImmediately("remove", {
                    type: "remove",
                    target: this,
                    oldValue: oldValue
                });
            }
        }
        else {
            throw new Error("Key " + key + " doesn't exist in dictionary");
        }
    };
    /**
     * Removes value at specific `key` from dictionary.
     *
     * @param {Key}  key  Key to remove
     */
    Dictionary.prototype.removeKey = function (key) {
        if ($object.hasKey(this._dictionary, key)) {
            var oldValue = this._dictionary[key];
            delete this._dictionary[key];
            if (this.events.isEnabled("removeKey")) {
                this.events.dispatchImmediately("removeKey", {
                    type: "removeKey",
                    target: this,
                    key: key,
                    oldValue: oldValue
                });
            }
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
     * [insertKeyIfEmpty description]
     *
     * @ignore Exclude from docs
     * @todo description
     * @param  {Key}       key      [description]
     * @param  {function}  ifEmpty  [description]
     * @return {T}                  [description]
     */
    Dictionary.prototype.insertKeyIfEmpty = function (key, ifEmpty) {
        if (!this.hasKey(key)) {
            this.insertKey(key, ifEmpty());
        }
        return this.getKey(key);
    };
    /**
     * Removes all items from the dictionary.
     */
    Dictionary.prototype.clear = function () {
        var _this = this;
        // TODO dispatch this after clear
        if (this.events.isEnabled("remove")) {
            $object.each(this._dictionary, function (key, value) {
                _this.events.dispatchImmediately("remove", {
                    type: "remove",
                    target: _this,
                    oldValue: value
                });
            });
        }
        this._dictionary = {};
        if (this.events.isEnabled("clear")) {
            this.events.dispatchImmediately("clear", {
                type: "clear",
                target: this
            });
        }
    };
    /**
     * Copies items from another Dictionary.
     *
     * @param {Dictionary<Key, T>}  source  A Dictionary to copy items from
     */
    Dictionary.prototype.copyFrom = function (source) {
        var _this = this;
        $iter.each(source.iterator(), function (a) {
            // TODO fix this type cast
            _this.setKey(a[0], a[1]);
        });
    };
    /**
     * Returns an interator that can be used to iterate through all items in
     * the dictionary.
     *
     * @return {Iterator} Iterator
     */
    Dictionary.prototype.iterator = function () {
        // @todo fix this type after the Iterator bug is fixed
        // https://github.com/Microsoft/TypeScript/issues/16730
        return $object.entries(this._dictionary);
    };
    /**
     * Returns an ES6 iterator for the keys/values of the dictionary.
     */
    Dictionary.prototype[Symbol.iterator] = function () {
        var _a, _b, _i, key;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = [];
                    for (_b in this._dictionary)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    key = _a[_i];
                    if (!$object.hasKey(this._dictionary, key)) return [3 /*break*/, 3];
                    return [4 /*yield*/, [key, this._dictionary[key]]];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    };
    /**
     * Calls `f` for each key/value in the dictionary.
     */
    Dictionary.prototype.each = function (f) {
        $iter.each(this.iterator(), function (_a) {
            var _b = __read(_a, 2), key = _b[0], value = _b[1];
            return f(key, value);
        });
    };
    /**
     * Returns an iterator that can be used to iterate through all items in
     * the dictionary, ordered by key.
     *
     * @ignore Exclude from docs
     * @return {Iterator} Iterator
     */
    Dictionary.prototype.sortedIterator = function () {
        return $iter.sort(this.iterator(), function (x, y) { return $string.order(x[0], y[0]); });
    };
    return Dictionary;
}());
export { Dictionary };
/**
 * A version of a [[Dictionary]] that has a "template".
 *
 * A template is an instance of an object, that can be used to create new
 * elements in the list without actually needing to create instances for those.
 *
 * When new element is created in the list, e.g. by calling its `create()`
 * method, an exact copy of the element is created (including properties and
 * other attributes), inserted into the list and returned.
 */
var DictionaryTemplate = /** @class */ (function (_super) {
    __extends(DictionaryTemplate, _super);
    /**
     * Constructor
     *
     * @param {T} t Template object
     */
    function DictionaryTemplate(t) {
        var _this = _super.call(this) || this;
        _this.template = t;
        return _this;
    }
    Object.defineProperty(DictionaryTemplate.prototype, "template", {
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
     * Copies all elements from other dictionary.
     *
     * @param {DictionaryTemplate}  source  Source dictionary
     */
    DictionaryTemplate.prototype.copyFrom = function (source) {
        var _this = this;
        $iter.each(source.iterator(), function (a) {
            // TODO fix this type cast
            // TODO why does this need to clone ?
            _this.setKey(a[0], a[1].clone());
        });
    };
    /**
     * Instantiates a new object of the specified type, adds it to specified
     * `key` in the dictionary, and returns it.
     *
     * @param make  Item type to use. Will use the default type for the dictionary if not specified.
     * @return      Newly created item
     */
    DictionaryTemplate.prototype.create = function (key) {
        var _this = this;
        return this.insertKeyIfEmpty(key, function () { return _this.template.clone(); });
    };
    return DictionaryTemplate;
}(Dictionary));
export { DictionaryTemplate };
//# sourceMappingURL=Dictionary.js.map