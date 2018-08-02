/**
 * FlowDiagramLink module
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite } from "../../core/Sprite";
import { Container, IContainerProperties, IContainerEvents, IContainerAdapters } from "../../core/Container";
import { FlowDiagramDataItem } from "../types/FlowDiagram";
import { LinearGradient } from "../../core/rendering/fills/LinearGradient";
import { RadialGradient } from "../../core/rendering/fills/RadialGradient";
import { Pattern } from "../../core/rendering/fills/Pattern";
import { Bullet } from "../elements/Bullet";
import { Color } from "../../core/utils/Color";
import { ListTemplate } from "../../core/utils/List";
import { Polyline } from "../../core/elements/Polyline";
import { Line } from "../../core/elements/Line";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[FlowDiagramLink]].
 */
export interface IFlowDiagramLinkProperties extends IContainerProperties {
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
     * Should link be filled with a solid color, color of from node, color of toNode or gradient between node colors.
     *
     * @type {"solid" | "gradient" | "fromNode" | "toNode"}
     */
    colorMode?: "solid" | "gradient" | "fromNode" | "toNode";
    /**
     * [controlPointDistance description]
     *
     * @todo Description
     * @type {number}
     */
    controlPointDistance?: number;
    /**
     * [maskBullets description]
     *
     * @todo Description
     * @type {boolean}
     */
    maskBullets?: boolean;
    /**
     * [tooltipLocation description]
     *
     * @todo Description
     * @type {number}
     */
    tooltipLocation?: number;
}
/**
 * Defines events for [[FlowDiagramLink]].
 */
export interface IFlowDiagramLinkEvents extends IContainerEvents {
}
/**
 * Defines adapters for [[FlowDiagramLink]].
 *
 * @see {@link Adapter}
 */
export interface IFlowDiagramLinkAdapters extends IContainerAdapters, IFlowDiagramLinkProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * This class creates a link (waved color-filled line) between two nodes in a
 * Flow Diagram.
 *
 * @see {@link IFlowDiagramLinkEvents} for a list of available events
 * @see {@link IFlowDiagramLinkAdapters} for a list of available Adapters
 * @important
 */
export declare class FlowDiagramLink extends Container {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IFlowDiagramLinkProperties}
     */
    _properties: IFlowDiagramLinkProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IFlowDiagramLinkAdapters}
     */
    _adapter: IFlowDiagramLinkAdapters;
    /**
     * Defines available events.
     *
     * @type {IFlowDiagramLinkEvents}
     * @ignore Exclude from docs
     */
    _events: IFlowDiagramLinkEvents;
    /**
     * Defines a type of data item used by this class.
     *
     * @ignore Exclude from docs
     * @type {FlowDiagramDataItem}
     */
    _dataItem: FlowDiagramDataItem;
    /**
     * A gradiend instance that is used to provided colored gradient fills for
     * the Flow link.
     *
     * @type {LinearGradient}
     */
    protected _gradient: LinearGradient;
    /**
     * List of bullets
     * @ignore
     */
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
    protected _bulletsMask: Sprite;
    /**
     * Bullets container
     * @type Container
     */
    protected _bulletsContainer: Container;
    /**
     * Spline which goes through the middle of a link, used to calculate bullet and tooltip positions, invisible by default
     * @type Polyspline
     */
    middleLine: Line | Polyline;
    /**
     * Constructor
     */
    constructor();
    /**
     * Positions bullets
     * @ignore
     */
    protected positionBullets(): void;
    /**
     * Bullets container
     * @type Container
     */
    readonly bulletsContainer: Container;
    /**
     * Bullets mask spite
     * @type Sprite
     */
    readonly bulletsMask: Sprite;
    /**
     * Positions bullets at relative bullet.locationX position on the link.
     * @ignore
     */
    protected positionBullet(bullet: Bullet): void;
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
     * @type {"solid" | "gradient"} Fill mode
     */
    /**
     * Should link be filled with a solid color, color of from node, color of toNode or gradient between node colors.
     * Some of the links, like ChordLink does not support gradiens well.
     *
     * @param {"solid" | "gradient" | "fromNode" | "toNode"}  value  Fill mode
     */
    colorMode: "solid" | "gradient" | "fromNode" | "toNode";
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
    /**
     * Copies properties from another [[FlowDiagramLink]].
     *
     * @param {FlowDiagramLink}  source  Source link
     */
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
    /**
     * A gradiend instance that is used to provided colored gradient fills for
     * the Flow link.
     *
     * @type {LinearGradient}
     */
    readonly gradient: LinearGradient;
}
