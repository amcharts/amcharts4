/**
 * Provides functionality used to build scrollbars.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */

import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../Container";
import { IRange } from "../defs/IRange";
import { Sprite, ISpriteEvents, AMEvent } from "../Sprite";
import { Orientation } from "../defs/Orientation";
import { ResizeButton } from "../elements/ResizeButton";
import { Button } from "../elements/Button";
import { getInteraction } from "../interaction/Interaction";
import { MouseCursorStyle } from "../interaction/Mouse";
import { RoundedRectangle } from "../elements/RoundedRectangle";
import { IPoint } from "../defs/IPoint";
import { Animation } from "../utils/Animation";
import { IDisposer } from "../utils/Disposer";
import { registry } from "../Registry";
import { keyboard } from "../utils/Keyboard";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import { percent, Percent } from "../utils/Percent";
import * as $math from "../utils/Math";
import * as $ease from "../utils/Ease";
import * as $type from "../utils/Type";
import * as $utils from "../utils/Utils";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[Scrollbar]].
 */
export interface IScrollbarProperties extends IContainerProperties {

	/**
	 * Duration in milliseconds of Scrollbar animation.
	 *
	 * This affects how fast Scrollbar elements move/resize. For example when
	 * chart zooms or pans, Scrollbar elements' positions need to be adjusted
	 * as well. This setting will affect whether they will be relocated
	 * instantenously (0), or will animte gradually.
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/animations/} for more info about animations
	 */
	animationDuration?: number;

	/**
	 * An easing function to use when animating (moving/sizing) Scrollbar
	 * elements.
	 */
	animationEasing?: (value: number) => number;

	/**
	 * Orientation of a scrollbar
	 */
	orientation?: Orientation;
}

/**
 * Defines events for [[Scrollbar]].
 */
export interface IScrollbarEvents extends IContainerEvents {

	/**
	 * Invoked when range of scrollbar selection changes.
	 */
	rangechanged: {};

}

/**
 * Defines adapters for [[Scrollbar]].
 */
export interface IScrollbarAdapters extends IContainerAdapters, IScrollbarProperties {

	/**
	 * Applied to a position value when it is retrieved.
	 */
	positionValue: {
		value: any,
		position: number
	}

};


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Scrollbar is a generic control allowing to select a range of values or pan
 * the selection.
 *
 * @see {@link IScrollbarEvents} for a list of available events
 * @see {@link IScrollbarAdapters} for a list of available Adapters
 */
export class Scrollbar extends Container {

	/**
	 * Defines available properties.
	 */
	public _properties!: IScrollbarProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IScrollbarAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IScrollbarEvents;

	/**
	 * Holds a reference to a draggable rectangle that fills the space between
	 * two selection grips. It can be used to pan the selection maintaining the
	 * distance between start and end grips.
	 */
	protected _thumb: $type.Optional<Button>;

	/**
	 * Orientation of the scrollbar.
	 */
	protected _orientation: Orientation;

	/**
	 * A button (grip) instance to be used to select lower range value.
	 */
	protected _startGrip!: ResizeButton;

	/**
	 * A button (grip) instance to be used to select upper range value.
	 */
	protected _endGrip!: ResizeButton;

	/**
	 * Currently selected lower (start) value.
	 */
	protected _start!: number;

	/**
	 * Currently selected upper (end) value.
	 */
	protected _end!: number;

	/**
	 * Previously selected lower (start) value.
	 */
	protected _previousStart: $type.Optional<number> = 0;

	/**
	 * Previously selected upper (end) value.
	 */
	protected _previousEnd: $type.Optional<number> = 1;

	/**
	 * An [[Animation]] instance that moves "thumb".
	 */
	protected _thumbAnimation: $type.Optional<Animation>;

	/**
	 * An [[Animation]] instance that moves zoom grip buttons.
	 */
	protected _zoomAnimation: $type.Optional<Animation>;

	/**
	 * A value of previously selected lower value, used for doubleclick function.
	 */
	protected _prevStart: number = 0;

	/**
	 * A value of previously selected upper value, used for doubleclick function.
	 */
	protected _prevEnd: number = 1;

	/**
	 * Indicates if the Scrollbar is currently "busy" (animating and or
	 * performing zoom by user interaction).
	 */
	protected _isBusy: boolean = false;

	/**
	 * [_skipRangeEvents description]
	 *
	 * @todo Description
	 */
	protected _skipRangeEvents: boolean = false;

	/**
	 * Holds timeout reference that resets "busy" status.
	 */
	protected _unbusyTimeout: $type.Optional<IDisposer>;

	/**
	 * [undefined description]
	 *
	 * @todo Description
	 */
	protected _usingGrip: "start" | "end" | undefined;

	/**
	 * Sets the type of the element to use as background.
	 */
	public _background: RoundedRectangle;

	/**
	 * Hide grips when not hovered over scrollbar?
	 *
	 * @default false
	 */
	protected _hideGrips!: boolean;

	/**
	 * A disposer for the hover event.
	 */
	protected _overDisposer: $type.Optional<IDisposer>;

	/**
	 * A disposer for the out event.
	 */
	protected _outDisposer: $type.Optional<IDisposer>;

	/**
	 * Update the selection when dragging the grips.
	 *
	 * If set to `false` selection will be updated only when the grip is
	 * released.
	 *
	 * @default true
	 */
	public updateWhileMoving: boolean = true;

	/**
	 * Construtor
	 */
	constructor() {
		super();

		this.className = "Scrollbar";

		this.minHeight = 12;
		this.minWidth = 12;

		this.animationDuration = 0;
		this.animationEasing = $ease.cubicOut;

		this.margin(10, 10, 10, 10);

		let interfaceColors = new InterfaceColorSet();

		// background is also container as it might contain graphs, grid, etc
		let background: RoundedRectangle = this.background;
		background.cornerRadius(10, 10, 10, 10);
		background.fill = interfaceColors.getFor("fill");
		background.fillOpacity = 0.5;

		// Make system tooltips appear by default
		this.showSystemTooltip = true;

		this.startGrip = new ResizeButton();
		this.endGrip = new ResizeButton();

		// Default orientation...
		// ... is set in `applyInternalDefaults()` because it accesses `language`
		// and should only be started to access when parent is set

		// Set events
		this.events.on("transformed", this.updateThumb, this, false);

		// Initial positions
		this.start = 0;
		this.end = 1;

		// Set roles
		this.role = "scrollbar";
		this.thumb.role = "slider";
		this.thumb.readerLive = "polite";
		this.startGrip.role = "slider";
		this.endGrip.role = "slider";

		// otherwise range changed wont' be registered
		this.events.once("inited", () => {
			this._previousStart = undefined;
			this.dispatchRangeChange();
		}, undefined, false)


		this.hideGrips = false;

		this.orientation = "horizontal";

		// Min/max values for accessibility
		this.setSVGAttribute({ "aria-valuemin": "0" });
		this.setSVGAttribute({ "aria-valuemax": "100" });

		this.applyTheme();
	}

	/**
	 * Sets defaults that instantiate some objects that rely on parent, so they
	 * cannot be set in constructor.
	 */
	protected applyInternalDefaults(): void {
		super.applyInternalDefaults();

		// Set screen reader tetxt accordingly
		if (this.orientation === "horizontal") {
			if (!$type.hasValue(this.readerTitle)) {
				this.readerTitle = this.language.translate("Use TAB to select grip buttons or left and right arrows to change selection");
			}
			if (!$type.hasValue(this.thumb.readerDescription)) {
				this.thumb.readerDescription = this.language.translate("Use left and right arrows to move selection");
			}
			if (!$type.hasValue(this.startGrip.readerDescription)) {
				this.startGrip.readerDescription = this.language.translate("Use left and right arrows to move left selection");
			}
			if (!$type.hasValue(this.endGrip.readerDescription)) {
				this.endGrip.readerDescription = this.language.translate("Use left and right arrows to move right selection");
			}

			this.readerOrientation = "horizontal";
		}
		else {
			if (!$type.hasValue(this.readerTitle)) {
				this.readerTitle = this.language.translate("Use TAB select grip buttons or up and down arrows to change selection");
			}
			if (!$type.hasValue(this.thumb.readerDescription)) {
				this.thumb.readerDescription = this.language.translate("Use up and down arrows to move selection");
			}
			if (!$type.hasValue(this.startGrip.readerDescription)) {
				this.startGrip.readerDescription = this.language.translate("Use up and down arrows to move upper selection");
			}
			if (!$type.hasValue(this.endGrip.readerDescription)) {
				this.endGrip.readerDescription = this.language.translate("Use up and down arrows to move lower selection");
			}

			this.readerOrientation = "vertical";
		}

		this.readerControls = this.baseSprite.uidAttr();
	}

	/**
	 * Validates the layout of the scrollbar's elements.
	 *
	 * @ignore Exclude from docs
	 */
	public validateLayout(): void {
		this.updateSize();
		super.validateLayout();

		// when size changes, need to update extremes
		this.updateExtremes();
	}

	/**
	 * Update background for the scrollbar.
	 *
	 * @ignore Exclude from docs
	 */
	public processBackground(): void {
		super.processBackground();
		let background = this.background;

		background.clickable = true;
		background.events.on("hit", this.handleBgHit, this, undefined);
	}

	/**
	 * Zooms to the particular place when clicked/tapped on the scrollbar
	 * background.
	 *
	 * @ignore Exclude from docs
	 * @param event  Event
	 */
	public handleBgHit(event: ISpriteEvents["hit"]): void {
		this.makeBusy();
		let point: IPoint = event.spritePoint;
		point = $utils.spritePointToSprite(point, this.background, this);
		let thumb: Sprite = this.thumb;
		if (this.orientation == "horizontal") {
			let thumbX: number = point.x - thumb.pixelWidth / 2;
			thumbX = $math.fitToRange(thumbX, 0, this.innerWidth - thumb.pixelWidth);
			this._thumbAnimation = thumb.animate({ property: "x", to: thumbX }, this.animationDuration, this.animationEasing);
		}
		else {
			let thumbY: number = point.y - thumb.pixelHeight / 2;
			thumbY = $math.fitToRange(thumbY, 0, this.innerHeight - thumb.pixelHeight);
			this._thumbAnimation = thumb.animate({ property: "y", to: thumbY }, this.animationDuration, this.animationEasing);
		}
		if (this.animationDuration > 0) {
			this._thumbAnimation.events.on("animationended", this.makeUnbusy, this, false);
		}
		else {
			this._thumb.validate();
			this.makeUnbusy();
		}
	}

	/**
	 * Set scrollbar as busy. (currently zooming)
	 *
	 * @ignore Exclude from docs
	 */
	public makeBusy(): void {
		this._isBusy = true;
		this._skipRangeEvents = false;
		if (this._unbusyTimeout) {
			this.removeDispose(this._unbusyTimeout);
		}
		this._unbusyTimeout = undefined;
		this.stopAnimations();
	}

	/**
	 * Stops all animations, currently playing for the scrollbar.
	 *
	 * @ignore Exclude from docs
	 */
	public stopAnimations(): void {
		if (this._thumbAnimation) {
			this._thumbAnimation.stop(true);
		}
		if (this._zoomAnimation) {
			this._zoomAnimation.stop(true);
		}
	}

	/**
	 * Cancels "busy" status of the Scrollbar.
	 *
	 * @ignore Exclude from docs
	 */
	public makeUnbusy(): void {
		/**
		 * We cannot make Scrollbar not busy right after release, because then axes
		 * will take over controll and Scrollbar will start to animate.
		 * Theorethically, it's not right to set timeout by `animationDuration`,
		 * however we can not know all the durations of elements we scroll, so we
		 * assume that animation duration will be the same as
		 * `interpolationDuration` or `rangeChange` duration.
		 */
		this._unbusyTimeout = this.setTimeout(this.makeUnbusyReal.bind(this), this.animationDuration * 1.1);

	}

	/**
	 * [makeUnbusyReal description]
	 *
	 * @todo Description
	 * @ignore Exclude from docs
	 */
	public makeUnbusyReal(): void {
		this._usingGrip = undefined;
		this._isBusy = false;
		if (!this.updateWhileMoving) {
			this.dispatchRangeChange();
		}
	}

	/**
	 * Disptatches rangechanged event if it really changed
	 *
	 * @ignore Exclude from docs
	 */
	protected dispatchRangeChange() {
		if (this._previousEnd != this.end || this._previousStart != this.start) {
			this._previousStart = this.start;
			this._previousEnd = this.end;
			this.dispatch("rangechanged");
		}
	}


	/**
	 * Updates the "thumb" element. A draggable element between the grips.
	 */
	protected updateThumb(): void {

		if (!this.parent) {
			return;
		}

		let thumb: Sprite = this.thumb;

		let start: number = this.start;
		let end: number = this.end;

		let startGrip: ResizeButton = this.startGrip;
		let endGrip: ResizeButton = this.endGrip;

		if (this.orientation == "horizontal") {

			let innerWidth: number = this.innerWidth;

			thumb.width = innerWidth * (end - start);
			thumb.maxX = innerWidth - thumb.pixelWidth;
			thumb.x = start * innerWidth;

			startGrip.moveTo({ x: thumb.pixelX, y: 0 }, undefined, undefined, true); // overrides dragging
			endGrip.moveTo({ x: thumb.pixelX + thumb.pixelWidth, y: 0 }, undefined, undefined, true);

			startGrip.readerTitle = this.language.translate(
				"From %1",
				undefined,
				this.adapter.apply("positionValue", {
					value: Math.round(start * 100) + "%",
					position: start
				}).value
			);
			startGrip.readerValueNow = "" + Math.round(start * 100);
			startGrip.readerValueText = startGrip.readerTitle;

			endGrip.readerTitle = this.language.translate(
				"To %1",
				undefined,
				this.adapter.apply("positionValue", {
					value: Math.round(end * 100) + "%",
					position: end
				}).value
			);
			endGrip.readerValueNow = "" + Math.round(end * 100);
			endGrip.readerValueText = endGrip.readerTitle;

		}
		else {
			let innerHeight: number = this.innerHeight;

			thumb.height = innerHeight * (end - start);
			thumb.maxY = innerHeight - thumb.pixelHeight;
			thumb.y = (1 - end) * innerHeight;

			startGrip.moveTo({ x: 0, y: thumb.pixelY + thumb.pixelHeight }, undefined, undefined, true);
			endGrip.moveTo({ x: 0, y: thumb.pixelY }, undefined, undefined, true);

			startGrip.readerTitle = this.language.translate(
				"To %1",
				undefined,
				this.adapter.apply("positionValue", {
					value: Math.round((1 - start) * 100) + "%",
					position: (1 - start)
				}).value
			);
			startGrip.readerValueNow = "" + Math.round(start * 100);
			startGrip.readerValueText = startGrip.readerTitle;

			endGrip.readerTitle = this.language.translate(
				"From %1",
				undefined,
				this.adapter.apply("positionValue", {
					value: Math.round((1 - end) * 100) + "%",
					position: (1 - end)
				}).value
			);
			endGrip.readerValueNow = "" + Math.round(end * 100);
			endGrip.readerValueText = endGrip.readerTitle;
		}

		// Add accessibility
		thumb.readerTitle = this.language.translate(
			"From %1 to %2",
			undefined,
			this.adapter.apply("positionValue", {
				value: Math.round(start * 100) + "%",
				position: start
			}).value,
			this.adapter.apply("positionValue", {
				value: Math.round(end * 100) + "%",
				position: end
			}).value
		);

		thumb.readerValueNow = "" + Math.round(start * 100);
		thumb.readerValueText = thumb.readerTitle;

		this.readerValueNow = "" + Math.round(start * 100);
		this.readerValueText = thumb.readerTitle;

		if (!this._skipRangeEvents && this.updateWhileMoving) {
			this.dispatchRangeChange();
		}
	}

	/**
	 * Updates extremes of the scrollbar.
	 */
	protected updateExtremes(): void {
		let orientation = this.orientation;
		let minX: number = 0;
		let minY: number = 0;
		let maxX: number = 0;
		let maxY: number = 0;

		if (orientation == "horizontal") {
			maxX = this.innerWidth;
			minY = maxY = this.innerHeight / 2;
		}
		else {
			maxY = this.innerHeight;
			minX = maxX = this.innerWidth / 2;
		}

		let startGrip: ResizeButton = this.startGrip;
		startGrip.minX = minX;
		startGrip.maxX = maxX;
		startGrip.minY = minY;
		startGrip.maxY = maxY;

		let endGrip: ResizeButton = this.endGrip;
		endGrip.minX = minX;
		endGrip.maxX = maxX;
		endGrip.minY = minY;
		endGrip.maxY = maxY;

		let thumb = this.thumb;
		thumb.minX = minX;
		thumb.maxX = maxX;
		thumb.minY = minY;
		thumb.maxY = maxY;
	}

	/**
	 * Updates size of the scrollbar.
	 */
	protected updateSize(): void {
		let orientation = this.orientation;

		let startGrip = this.startGrip;
		if (startGrip) {
			startGrip.orientation = orientation;
		}
		if (this.endGrip) {
			this.endGrip.orientation = orientation;
		}

		let thumb: Sprite = this.thumb;
		if (thumb) {
			if (orientation == "horizontal") {
				if (!$type.isNumber(this._pixelWidth)) {
					if (!(this.width instanceof Percent)) {
						this.width = percent(100);
					}
				}
				// this teorethically might be wrong, if user indeed sets height of a horizontal scrollbar in percent
				// however without this height might be equal to 100% if previous orientation was set to horizontal
				// so this is ok solution, in case user really wants to have scrollbar height set in percent,
				// he should do this after orientation.
				if ($type.hasValue(this.percentHeight)) {
					this.height = this.minHeight;
				}

				thumb.height = this.innerHeight;

				thumb.verticalCenter = "middle";
				thumb.horizontalCenter = "left";
			}
			else {
				if (!$type.isNumber(this._pixelHeight)) {
					if (!(this.height instanceof Percent)) {
						this.height = percent(100);
					}
				}

				// same as above with percentHeight
				if ($type.hasValue(this.percentWidth)) {
					this.width = this.minWidth;
				}

				thumb.width = this.innerWidth;
				thumb.verticalCenter = "top";
				thumb.horizontalCenter = "middle";
			}
		}
	}


	/**
	 * ==========================================================================
	 * POSITIONS
	 * ==========================================================================
	 * @hidden
	 */

	/**
	 * Relative position (0-1) of the start grip.
	 *
	 * @param position  Position (0-1)
	 */
	public set start(position: number) {
		if (!this._isBusy) {
			this.__start = position;
		}
	}

	/**
	 * @return Position (0-1)
	 */
	public get start(): number {
		return Math.min(this.getPosition(this._start), this.getPosition(this._end));
	}

	/**
	 * [__start description]
	 *
	 * @todo Description
	 * @param position [description]
	 */
	protected set __start(position: number) {
		this._start = this.getPosition(position);
		this.updateThumb();
	}

	/**
	 * @return [description]
	 */
	protected get __start(): number {
		return this._start;
	}

	/**
	 * Relative position (0-1) of the end grip.
	 *
	 * @param position  Position (0-1)
	 */
	public set end(position: number) {
		if (!this._isBusy) {
			this.__end = position;
		}
	}

	/**
	 * @return Position (0-1)
	 */
	public get end(): number {
		return Math.max(this.getPosition(this._start), this.getPosition(this._end));
	}

	/**
	 * [__end description]
	 *
	 * @todo Description
	 * @param position [description]
	 */
	protected set __end(position: number) {
		this._end = this.getPosition(position);
		this.updateThumb();
	}

	/**
	 * @return [description]
	 */
	protected get __end(): number {
		return this._end;
	}

	/**
	 * Current selection range.
	 *
	 * @readonly
	 * @return Range
	 */
	public get range(): IRange {
		return { start: this.start, end: this.end, priority: this._usingGrip };
	}

	/**
	 * Disables range change events.
	 *
	 * @ignore Exclude from docs
	 */
	public skipRangeEvents(): void {
		if (!this._isBusy) {
			this._skipRangeEvents = true;
		}
	}

	/**
	 * [fixRange description]
	 *
	 * @todo Description
	 * @ignore Exclude from docs
	 * @param range  Range
	 */
	public fixRange(range: IRange): void {
		if (range.start != $math.round(this._start, 2) || range.end != $math.round(this._end, 2)) {
			this._start = range.start;
			this._end = range.end;

			this._skipRangeEvents = true;
			this.updateThumb();
			this._skipRangeEvents = false;
			this.thumb.validate();
			this.thumb.background.validate();
		}
	}

	/**
	 * [getPosition description]
	 *
	 * @todo Description
	 * @param position  [description]
	 * @return [description]
	 */
	protected getPosition(position: number): number {
		return $math.fitToRange($math.round(position, 4), 0, 1);
	}


	/**
	 * ==========================================================================
	 * MISC
	 * ==========================================================================
	 * @hidden
	 */

	/**
	 * Orientation of the scrollbar.
	 *
	 * Available options: "horizontal" (default) and "vertical".
	 *
	 * @default "horizontal"
	 * @param value  Orientation
	 */
	public set orientation(value: Orientation) {

		if (this.setPropertyValue("orientation", value)) {

			// Set mouse cursors and screen reader tetxt accordingly
			if (value === "horizontal") {

				// Mouse styles
				this.startGrip.cursorOverStyle = MouseCursorStyle.horizontalResize;
				this.endGrip.cursorOverStyle = MouseCursorStyle.horizontalResize;

				// Reader text
				/*this.readerTitle = this.language.translate("Use TAB to select grip buttons or left and right arrows to change selection");
				this.thumb.readerDescription = this.language.translate("Use left and right arrows to move selection");
				this.startGrip.readerDescription = this.language.translate("Use left and right arrows to move left selection");
				this.endGrip.readerDescription = this.language.translate("Use left and right arrows to move right selection");*/

			}
			else {

				// Mouse styles
				this.startGrip.cursorOverStyle = MouseCursorStyle.verticalResize;
				this.endGrip.cursorOverStyle = MouseCursorStyle.verticalResize;

				// Reader text
				/*this.readerTitle = this.language.translate("Use TAB select grip buttons or up and down arrows to change selection");
				this.thumb.readerDescription = this.language.translate("Use up and down arrows to move selection");
				this.startGrip.readerDescription = this.language.translate("Use up and down arrows to move upper selection");
				this.endGrip.readerDescription = this.language.translate("Use up and down arrows to move lower selection");*/

			}
			this.updateByOrientation();
			this.invalidate();
		}
	}

	/**
	 * @ignore
	 */
	protected updateByOrientation() {

	}


	/**
	 * @return Orientation
	 */
	public get orientation(): Orientation {
		return this.getPropertyValue("orientation");
	}


	/**
	 * ==========================================================================
	 * GRIPS
	 * ==========================================================================
	 * @hidden
	 */

	/**
	 * Start grip element. (button)
	 *
	 * @param button  Grip element
	 */
	public set startGrip(button: ResizeButton) {
		if (this._startGrip) {
			this.removeDispose(this._startGrip);
		}
		this._startGrip = button;
		this.processGrip(button);
	}

	/**
	 * @return Grip element
	 */
	public get startGrip(): ResizeButton {
		return this._startGrip;
	}

	/**
	 * End grip element. (button)
	 *
	 * @param button  Grip element
	 */
	public set endGrip(button: ResizeButton) {
		if (this._endGrip) {
			this.removeDispose(this._endGrip);
		}
		this._endGrip = button;
		this.processGrip(button);
	}

	/**
	 * @return Grip element
	 */
	public get endGrip(): ResizeButton {
		return this._endGrip;
	}

	/**
	 * Decorates the grip button with properties and events.
	 *
	 * @ignore Exclude from docs
	 * @param button Grip button
	 */
	public processGrip(button: ResizeButton) {
		button.parent = this;
		button.isMeasured = false;
		button.focusable = true;
		button.shouldClone = false;

		// Set button defaults
		//button.showSystemTooltip = true; // setting this here is not right because we break inheritance
		button.zIndex = 100;

		button.events.on("drag", this.handleGripDrag, this, false);
		button.events.on("dragstop", this.makeUnbusy, this, false);
		button.events.on("down", this.makeBusy, this, false);

		this._disposers.push(button);
	}

	/**
	 * Updates positions of related elements after grip element is dragged.
	 *
	 * @ignore Exclude from docs
	 * @param event  Event
	 */
	public handleGripDrag(event: AMEvent<ResizeButton, ISpriteEvents>["drag"]): void {
		this.makeBusy();

		if (event.target === this._startGrip) {
			this._usingGrip = "start";
		}
		else {
			this._usingGrip = "end";
		}

		if (this.orientation == "horizontal") {
			this._start = this.startGrip.pixelX / this.innerWidth;
			this._end = this.endGrip.pixelX / this.innerWidth;
		}
		else {
			this._start = 1 - this.startGrip.pixelY / this.innerHeight;
			this._end = 1 - this.endGrip.pixelY / this.innerHeight;
		}

		this.updateThumb();
	}

	/**
	 * A "thumb" element.
	 *
	 * It's a draggable square space between the grips, that can be used to
	 * pan the selection.
	 *
	 * @param thumb  Thumb element
	 */
	public set thumb(thumb: Button) {
		if (thumb) {

			if (this._thumb) {
				this.removeDispose(this._thumb);
			}

			this._thumb = thumb;
			thumb.parent = this;
			thumb.isMeasured = false;
			thumb.inert = true;
			thumb.draggable = true;
			thumb.clickable = true;
			thumb.hoverable = true;
			thumb.focusable = true;
			thumb.shouldClone = false;
			thumb.zIndex = 0;

			// TODO remove closures ?
			// Add events

			// Add cursor styles to thumb
			thumb.cursorOverStyle = MouseCursorStyle.grab;
			thumb.cursorDownStyle = MouseCursorStyle.grabbing;

			thumb.events.on("dragstart", this.makeBusy, this, false);
			thumb.events.on("dragstop", this.makeUnbusy, this, false);
			thumb.events.on("positionchanged", this.handleThumbPosition, this, false);
			thumb.events.on("sizechanged", this.handleThumbPosition, this, false);
			thumb.events.on("doublehit", this.handleDoubleClick, this, false);

			// Add event for space and ENTER to toggle full zoom out and back
			// (same as doubleclick)
			this._disposers.push(getInteraction().body.events.on("keyup", (ev) => {
				if (keyboard.isKey(ev.event, ["space", "enter"]) && this.thumb.isFocused) {
					ev.event.preventDefault();
					this.handleDoubleClick();
				}
			}));

			this._disposers.push(this._thumb);
		}
	}

	/**
	 * @return Thumb element
	 */
	public get thumb(): Button {
		if (!this._thumb) {
			// Create scrollbar controls (setters will handle adding disposers)
			let thumb = new Button();
			thumb.background.cornerRadius(10, 10, 10, 10);
			thumb.padding(0, 0, 0, 0);
			this.thumb = thumb;
		}
		return this._thumb;
	}

	/**
	 * Zooms-in and out the selection on double-click of the thumb.
	 *
	 * @ignore Exclude from docs
	 */
	public handleDoubleClick(): void {

		this.makeBusy();

		let newStart: number = 0;
		let newEnd: number = 1;

		if (this.start != 0 || this.end != 1) {
			this._prevStart = this.start;
			this._prevEnd = this.end;
		}
		else {
			newStart = this._prevStart;
			newEnd = this._prevEnd;
		}

		let zoomAnimation = this.animate([{ property: "__start", to: newStart }, { property: "__end", to: newEnd }], this.animationDuration, this.animationEasing);

		if (zoomAnimation && !zoomAnimation.isFinished()) {
			zoomAnimation.events.on("animationended", this.makeUnbusy, this, false);
			this._zoomAnimation = zoomAnimation;
		}
		else {
			this.makeUnbusy();
		}
	}

	/**
	 * Updates positions of other elements when thumb is moved.
	 *
	 * @ignore Exclude from docs
	 */
	public handleThumbPosition(): void {
		let thumb = this.thumb;
		if (this.orientation == "horizontal") {
			let innerWidth = this.innerWidth;
			let w = thumb.innerWidth;
			let x = thumb.pixelX;

			this._start = x / innerWidth;
			this._end = (x + w) / innerWidth;
			this.updateThumb();
		}
		else {
			let innerHeight = this.innerHeight;
			let h = thumb.innerHeight;
			let y = thumb.pixelY;

			this._start = 1 - (y + h) / innerHeight;
			this._end = 1 - y / innerHeight;
			this.updateThumb();
		}
	}

	/**
	 * Creates a background element for the scrollbar.
	 *
	 * @ignore Exclude from docs
	 * @return Background
	 */
	public createBackground(): this["_background"] {
		return new RoundedRectangle();
	}

	/**
	 * Use this property to set whether grips should be always visible (`false`),
	 * or they should just appear on scrollbar hover (`true`).
	 *
	 * @param value  Show only on hover?
	 */
	public set hideGrips(value: boolean) {

		this._hideGrips = value;

		if (this._overDisposer) {
			this.removeDispose(this._overDisposer);
		}
		if (this._outDisposer) {
			this.removeDispose(this._outDisposer);
		}

		if (value) {
			this._overDisposer = this.events.on("over", () => {
				this.startGrip.show();
				this.endGrip.show();
			}, undefined, false)
			this._outDisposer = this.events.on("out", () => {
				this.startGrip.hide();
				this.endGrip.hide();
			}, undefined, false)
			this.startGrip.hide();
			this.endGrip.hide();
		}
		else {
			this.startGrip.show();
			this.endGrip.show();
		}
	}

	/**
	 * @return Show only on hover?
	 */
	public get hideGrips(): boolean {
		return this._hideGrips;
	}


	/**
	 * Duration in milliseconds of scrollbar animation (happens when user clicks on a background of a scrollbar)
	 * @default 0
	 * @param value number
	 */
	public set animationDuration(value: number) {
		this.setPropertyValue("animationDuration", value);
	}

	/**
	 * @return Orientation
	 */
	public get animationDuration(): number {
		return this.getPropertyValue("animationDuration");
	}

	/**
	 * Animation easing function.
	 * @todo: review description and default
	 * @default $ease.cubicOut
	 * @param value (value: number) => number
	 */
	public set animationEasing(value: (value: number) => number) {
		this.setPropertyValue("animationEasing", value);
	}

	/**
	 * @return {Function}
	 */
	public get animationEasing(): (value: number) => number {
		return this.getPropertyValue("animationEasing");
	}

	/**
	 * Adds easing functions to "function" fields.
	 *
	 * @param field  Field name
	 * @return Assign as function?
	 */
	protected asFunction(field: string): boolean {
		return field == "animationEasing" || super.asIs(field);
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Scrollbar"] = Scrollbar;
