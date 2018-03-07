/**
 * SankeyLink module
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite, ISpriteProperties, ISpriteAdapters, ISpriteEvents, SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
import { SankeyDiagramDataItem } from "../types/SankeyDiagram";
import { LinearGradient } from "../../core/rendering/fills/LinearGradient";
import { RadialGradient } from "../../core/rendering/fills/RadialGradient";
import { Pattern } from "../../core/rendering/fills/Pattern";
import { Color } from "../../core/utils/Color";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[SankeyLink]].
 */
export interface ISankeyLinkProperties extends ISpriteProperties {
    /**
     * [tension description]
     *
     * @todo Description
     * @type {number}
     */
    tension?: number;
    /**
     * [startX description]
     *
     * @todo Description
     * @type {number}
     */
    startX?: number;
    /**
     * [startY description]
     *
     * @todo Description
     * @type {number}
     */
    startY?: number;
    /**
     * [endX description]
     *
     * @todo Description
     * @type {number}
     */
    endX?: number;
    /**
     * [endY description]
     *
     * @todo Description
     * @type {number}
     */
    endY?: number;
    /**
     * [linkWidth description]
     *
     * @todo Description
     * @type {number}
     */
    linkWidth?: number;
    /**
     * [startAngle description]
     *
     * @todo Description
     * @type {number}
     */
    startAngle?: number;
    /**
     * [endAngle description]
     *
     * @todo Description
     * @type {number}
     */
    endAngle?: number;
    /**
     * Should link be filled with a solid color or gradient.
     *
     * @type {"solid" | "gradient"}
     */
    colorMode?: "solid" | "gradient";
}
/**
 * Defines events for [[SankeyLink]].
 */
export interface ISankeyLinkEvents extends ISpriteEvents {
}
/**
 * Defines adapters for [[SankeyLink]].
 *
 * @see {@link Adapter}
 */
export interface ISankeyLinkAdapters extends ISpriteAdapters, ISankeyLinkProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * This class creates a link (waved color-filled line) between two nodes in a
 * Sankey Diagram.
 *
 * @see {@link ISankeyLinkEvents} for a list of available events
 * @see {@link ISankeyLinkAdapters} for a list of available Adapters
 * @important
 */
export declare class SankeyLink extends Sprite {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {ISankeyLinkProperties}
     */
    _properties: ISankeyLinkProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {ISankeyLinkAdapters}
     */
    _adapter: ISankeyLinkAdapters;
    /**
     * Event dispatcher.
     *
     * @type {SpriteEventDispatcher<AMEvent<SankeyLink, ISankeyLinkEvents>>} Event dispatcher instance
     */
    events: SpriteEventDispatcher<AMEvent<SankeyLink, ISankeyLinkEvents>>;
    /**
     * Defines a type of data item used by this class.
     *
     * @ignore Exclude from docs
     * @type {SankeyDiagramDataItem}
     */
    _dataItem: SankeyDiagramDataItem;
    /**
     * A gradiend instance that is used to provided colored gradient fills for
     * the Sankey link.
     *
     * @type {LinearGradient}
     */
    gradient: LinearGradient;
    /**
     * Constructor
     */
    constructor();
    /**
     * (Re)validates (redraws) the link.
     *
     * @ignore Exclude from docs
     */
    validate(): void;
    /**
     * @return {number} Start angle
     */
    /**
     * [startAngle description]
     *
     * @todo Description
     * @param {number}  value  Start angle
     */
    startAngle: number;
    /**
     * @return {number} End angle
     */
    /**
     * [endAngle description]
     *
     * @todo Description
     * @param {number}  value  End angle
     */
    endAngle: number;
    /**
     * @return {number} Start X
     */
    /**
     * [startX description]
     *
     * @todo Description
     * @param {number}  value  Start X
     */
    startX: number;
    /**
     * @return {number} End X
     */
    /**
     * [endX description]
     *
     * @todo Description
     * @param {number} value  End X
     */
    endX: number;
    /**
     * @return {number} Start Y
     */
    /**
     * [startY description]
     *
     * @todo Description
     * @param {number}  value  Start Y
     */
    startY: number;
    /**
     * @return {number} End Y
     */
    /**
     * [endY description]
     *
     * @todo Description
     * @param {number} value End Y
     */
    endY: number;
    /**
     * @return {number} [description]
     */
    /**
     * [linkWidth description]
     *
     * @todo Description
     * @param {number} value [description]
     */
    linkWidth: number;
    /**
     * @type {"solid" | "gradient"} Fill mode
     */
    /**
     * Should link be filled with a solid color or gradient.
     *
     * @param {"solid" | "gradient"}  value  Fill mode
     */
    colorMode: "solid" | "gradient";
    /**
     * Adds color steps in the link gradient.
     *
     * @param {Color | Pattern | LinearGradient | RadialGradient}  value  Fill option
     */
    protected setStroke(value: Color | Pattern | LinearGradient | RadialGradient): void;
    /**
     * Updates bounding box based on element dimension settings.
     *
     * @ignore Exclude from docs
     */
    measureElement(): void;
}
