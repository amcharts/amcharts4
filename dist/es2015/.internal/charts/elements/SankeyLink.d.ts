/**
 * SankeyLink module
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite } from "../../core/Sprite";
import { Container, IContainerProperties, IContainerEvents, IContainerAdapters } from "../../core/Container";
import { SankeyDiagramDataItem } from "../types/SankeyDiagram";
import { LinearGradient } from "../../core/rendering/fills/LinearGradient";
import { RadialGradient } from "../../core/rendering/fills/RadialGradient";
import { Pattern } from "../../core/rendering/fills/Pattern";
import { Bullet } from "../elements/Bullet";
import { Color } from "../../core/utils/Color";
import { ListTemplate } from "../../core/utils/List";
import { Polyspline } from "../../core/elements/Polyspline";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[SankeyLink]].
 */
export interface ISankeyLinkProperties extends IContainerProperties {
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
    controlPointDistance?: number;
    maskBullets?: boolean;
    tooltipLocation?: number;
}
/**
 * Defines events for [[SankeyLink]].
 */
export interface ISankeyLinkEvents extends IContainerEvents {
}
/**
 * Defines adapters for [[SankeyLink]].
 *
 * @see {@link Adapter}
 */
export interface ISankeyLinkAdapters extends IContainerAdapters, ISankeyLinkProperties {
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
export declare class SankeyLink extends Container {
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
     * Defines available events.
     *
     * @type {ISankeyLinkEvents}
     * @ignore Exclude from docs
     */
    _events: ISankeyLinkEvents;
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
    protected _bullets: ListTemplate<Bullet>;
    /**
     * Link sprite
     *
     * @type {Sprite}
     */
    link: Sprite;
    /**
     * Bullets mask spite
     * @type Sprite
     */
    bulletsMask: Sprite;
    /**
     * Bullets container
     * @type Container
     */
    bulletsContainer: Container;
    /**
     * Spline which goes through the middle of a link, used to calculate bullet and tooltip positions, invisible by default
     * @type Polyspline
     */
    middleSpline: Polyspline;
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
    protected positionBullets(): void;
    positionBullet(bullet: Bullet): void;
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
     * @return {boolean} mask bullets value
     */
    /**
     * Should link bullets be masked or not
     *
     * @param {boolean}  value
     * @default false;
     */
    maskBullets: boolean;
    /**
     * @return {number} relative control point distance
     */
    /**
     * Distance of control point of a link, defines relative distance from a node at which linke should bend
     * @default 0.2
     * @param {number}  value
     */
    controlPointDistance: number;
    /**
     * @return {number} tension value
     */
    /**
     * Tension of a spline, 1 would make the link to have sharp edges
     * @default 0.8
     * @param {number} value
     */
    tension: number;
    /**
     * @type {number} tooltip location value
     */
    /**
     * Relative location of a tooltip.
     * @default 0.5
     *
     * @param {number} value
     */
    tooltipLocation: number;
    /**
     * Adds color steps in the link gradient.
     *
     * @param {Color | Pattern | LinearGradient | RadialGradient}  value  Fill option
     */
    protected setFill(value: Color | Pattern | LinearGradient | RadialGradient): void;
    /**
     * Updates bounding box based on element dimension settings.
     *
     * @ignore Exclude from docs
     */
    measureElement(): void;
    /**
     * List of bullets
     *
     * @return {ListTemplate<Bullet>} [description]
     */
    readonly bullets: ListTemplate<Bullet>;
    copyFrom(source: this): void;
    /**
     * @ignore Exclude from docs
     * @return {number} Tooltip X (px)
     */
    getTooltipX(): number;
    /**
     * @ignore Exclude from docs
     * @return {number} Tooltip Y (px)
     */
    getTooltipY(): number;
}
