/**
 * Plugin which enables annotation functionality for charts.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { fabric } from "../../fabric/fabric.js";
import { AnnotationIcons } from "./AnnotationIcons";
import { Plugin } from "../../core/utils/Plugin";
import { IExportCustomOptions } from "../../core/export/Export";
import { ExportMenu, IExportMenuItem } from "../../core/export/ExportMenu";
import { registry } from "../../core/Registry";
import { Color, color } from "../../core/utils/Color";
import { getInteraction } from "../../core/interaction/Interaction";
import { keyboard } from "../../core/utils/Keyboard";


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * A plugin which automatically groups [[PercenSeries]] slices that are smaller
 * than certain percent into one "Other" slice.
 *
 * By pushing an instance of [[Annnotation]] into `plugin` list of
 * any [[Chart]], it automatically applies the functionality.
 *
 * Example:
 *
 * ```TypeScript
 * let annotation = chart.plugins.push(new am4plugins_annotation.Annotation());
 * ```
 * ```JavaScript
 * let annotation = chart.plugins.push(new am4plugins_annotation.Annotation());
 * ```
 * ```JSON
 * {
 *   "plugins": [{
 *     "type": "Annotation"
 *   }]
 * }
 * ```
 *
 * @since 4.5.5
 *
 * @todo resolve translations
 * @todo change mouse cursors based on context/tool
 * @todo better line selection on click
 * @todo arrow support
 * @todo undo/redo
 * @todo reposition/resize annotations on chart resize
 * @todo make annotations hold on IE (when in not annotation mode)
 */
export class Annotation extends Plugin {

	/**
	 * Indicates if Sprite is currently in annotating mode.
	 */
	private _active: boolean = false;

	/**
	 * A reference to menu item that holds annotation tools.
	 */
	private _menu: IExportMenuItem;

	/**
	 * An ID of an element that represents the currently selected tool indicator.
	 */
	private _indicatorId: string;

	/**
	 * Currently selected tool.
	 */
	private _currentTool: string = "draw";

	/**
	 * Current color in use.
	 */
	private _currentColor: Color = color("#c00");

	/**
	 * Currently selected weight/width.
	 */
	private _currentWidth: number = 2;

	/**
	 * Currently selected opacity.
	 */
	private _currentOpacity: number = 0.8;

	/**
	 * Font size.
	 */
	private _currentFontSize: number = 20;

	/**
	 * Font weight.
	 */
	private _currentFontWeight: number = 400;

	/**
	 * Color selection.
	 */
	private _colors: Array<Color> = [];

	/**
	 * Available line widths.
	 */
	private _widths: Array<number> = [];

	/**
	 * Available opacities.
	 */
	private _opacities: Array<number> = [];

	/**
	 * Available font sizes.
	 */
	private _fontSizes: Array<number> = [];

	/**
	 * Available font weights.
	 */
	private _fontWeights: Array<number> = [];

	/**
	 * A Fabric's Canvas element.
	 *
	 * @see {@link http://fabricjs.com/docs/fabric.Canvas.html}
	 */
	private _fabric: fabric.Canvas;

	/**
	 * Reference to `<g>` element that holds annotation objects.
	 */
	private _group: SVGGElement;

	private _pointerDown: boolean = false;
	private _currentLine: any;
	private _data: any;
	private _exportInited: boolean = false;

	/**
	 * List of icons to use in annotation
	 */
	public icons: Array<string> = [];

	/**
	 * Constructor
	 */
	constructor() {
		// Nothing to do here
		super();

		// Set default colors
		this._colors = [
			color("#000"),
			color("#fff"),
			color("#c00"),
			color("#0c0"),
			color("#00c")
		];

		// Set defaults
		this._widths = [1, 2, 4, 10];
		this._opacities = [0.2, 0.4, 0.6, 0.8, 1];

		// Set default font sizes
		this._fontSizes = [10, 15, 20, 30];
		this._fontWeights = [200, 300, 400, 800];

		// Add default icons
		this.icons = [
			AnnotationIcons.pin,
			AnnotationIcons.heart,
			AnnotationIcons.check,
			AnnotationIcons.like,
			AnnotationIcons.dislike,
			AnnotationIcons.tag,
			AnnotationIcons.attention,
			AnnotationIcons.smiley
		];
	}

	public init() {
		super.init();
		this.initExporting();
		if (this._data) {
			this.loadData();
		}
	}

	/**
	 * Initializes menus for the annotation.
	 *
	 * Will try to use existing [[ExportMenu]] if present.
	 */
	protected initExporting(): void {
		const target = this.target;

		// Create an export menu if it does not yet exist
		if (!target.exporting.menu) {
			target.exporting.menu = new ExportMenu();
			target.exporting.menu.items[0].menu = [];
		}
		else {
			target.exporting.menu.invalidate();
		}

		// Create DEL key handler
		getInteraction().body.events.on("keyup", (ev) => {
			if (this.active && keyboard.isKey(ev.event, "del")) {
				this.deleteSelected();
			}
		});

		// Update indicator when menu is created
		target.exporting.events.once("menucreated", this.updateIndicator);

		// Update/show SVG annotation if currently in annotation mode and user
		// triggers export.
		target.exporting.events.on("exportstarted", (ev) => {
			if (this.active) {
				this.updateSVG();
				(<any>this).fabric.wrapperEl.style.display = "none";
				this._group.style.display = "";
			}
		});

		target.exporting.events.on("exportfinished", (ev) => {
			if (this.active) {
				this._group.style.display = "none";
				(<any>this).fabric.wrapperEl.style.display = "block";
			}
		});

		// Generate a unique id for indicator
		this._indicatorId = registry.getUniqueId();

		// Add annotation menu
		target.exporting.menu.items[0].menu.push({
			label: target.language.translateAny("Annotate"),
			type: "custom",
			options: {
				callback: this.handleClick,
				callbackTarget: this
			}
		});

		// Color list
		let colors: Array<IExportMenuItem> = [];
		for (let i = 0; i < this.colors.length; i++) {
			colors.push({
				type: "custom",
				svg: AnnotationIcons.ok,
				color: this.colors[i],
				options: {
					callback: () => {
						this.setColor(this.colors[i])
					}
				}
			});
		}

		// Width list
		let widths: Array<IExportMenuItem> = [];
		for (let i = 0; i < this.widths.length; i++) {
			widths.push({
				type: "custom",
				label: this.widths[i] + "px",
				options: {
					callback: () => {
						this.setWidth(this.widths[i])
					}
				}
			});
		}

		// Opacity list
		let opacities: Array<IExportMenuItem> = [];
		for (let i = 0; i < this.opacities.length; i++) {
			opacities.push({
				type: "custom",
				label: "<span style=\"opacity: " + this.opacities[i] + "\">" + (this.opacities[i] * 100) + "%</span>",
				options: {
					callback: () => {
						this.setOpacity(this.opacities[i])
					}
				}
			});
		}

		// Font sizes
		let fontSizes: Array<IExportMenuItem> = [];
		for (let i = 0; i < this.fontSizes.length; i++) {
			fontSizes.push({
				type: "custom",
				label: "" + this.fontSizes[i],
				options: {
					callback: () => {
						this.setFontSize(this.fontSizes[i])
					}
				}
			});
		}

		// Font weights
		let fontWeights: Array<IExportMenuItem> = [];
		for (let i = 0; i < this.fontWeights.length; i++) {
			fontWeights.push({
				type: "custom",
				label: "" + this.fontWeights[i],
				options: {
					callback: () => {
						this.setFontWeight(this.fontWeights[i])
					}
				}
			});
		}

		// Icons
		let icons: Array<IExportMenuItem> = [];
		for (let i = 0; i < this.icons.length; i++) {
			icons.push({
				type: "custom",
				svg: this.icons[i],
				options: {
					callback: () => {
						this.addIcon(this.icons[i])
					}
				}
			});
		}

		// Construct main menu item
		const id = this._indicatorId;
		//let mainitem = this.target.exporting.menu.createSvgElement(0, "custom", AnnotationIcons.select).outerHTML;
		let mainitem = "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1\" viewBox=\"0 0 24 24\"></svg>";
		mainitem += "<span class=\"" + id + "_color\" style=\"display: block; background-color: " + this.currentColor.hex + "; width: 1.2em; height: 1.2em; margin: 0.2em auto 0.4em auto;\"></span>";

		// Add annotation tools menu
		this._menu = {
			hidden: !this.active,
			// icon: AnnotationIcons.select,
			label: mainitem,
			id: this._indicatorId,
			menu: [{
				type: "custom",
				svg: AnnotationIcons.tools,
				label: target.language.translateAny("Tools"),
				menu: [{
					type: "custom",
					svg: AnnotationIcons.select,
					label: target.language.translateAny("Select"),
					options: {
						callback: this.select,
						callbackTarget: this
					}
				}, {
					type: "custom",
					svg: AnnotationIcons.draw,
					label: target.language.translateAny("Draw"),
					options: {
						callback: this.draw,
						callbackTarget: this
					}
				}, {
					type: "custom",
					svg: AnnotationIcons.line,
					label: target.language.translateAny("Line"),
					options: {
						callback: this.line,
						callbackTarget: this
					}
				}/*, {
						type: "custom",
						svg: AnnotationIcons.arrow,
						label: target.language.translateAny("Arrow"),
						options: {
							callback: this.underConstruction,
							callbackTarget: this
						}
					}*/, {
					type: "custom",
					svg: AnnotationIcons.width,
					label: target.language.translateAny("Weight"),
					menu: widths
				}, {
					type: "custom",
					svg: AnnotationIcons.delete,
					label: target.language.translateAny("Delete"),
					options: {
						callback: this.delete,
						callbackTarget: this
					}
				}]
			}, {
				type: "custom",
				svg: AnnotationIcons.text,
				label: target.language.translateAny("Text"),
				menu: [{
					type: "custom",
					svg: AnnotationIcons.textAdd,
					label: target.language.translateAny("Add"),
					options: {
						callback: this.addText,
						callbackTarget: this
					}
				}, {
					type: "custom",
					svg: AnnotationIcons.textWeight,
					label: target.language.translateAny("Weight"),
					menu: fontWeights
				}, {
					type: "custom",
					svg: AnnotationIcons.textSize,
					label: target.language.translateAny("Size"),
					menu: fontSizes
				}]
			}, {
				type: "custom",
				svg: AnnotationIcons.colors,
				label: target.language.translateAny("Color"),
				menu: colors
			}, {
				type: "custom",
				svg: AnnotationIcons.opacity,
				label: target.language.translateAny("Opacity"),
				menu: opacities
			}, {
				type: "custom",
				svg: AnnotationIcons.icon,
				label: target.language.translateAny("Icon"),
				menu: icons
			}, {
				type: "custom",
				svg: AnnotationIcons.more,
				label: target.language.translateAny("More"),
				menu: [/*{
						type: "custom",
						svg: AnnotationIcons.undo,
						label: target.language.translateAny("Undo"),
						options: {
							callback: this.underConstruction,
							callbackTarget: this
						}
					}, {
						type: "custom",
						svg: AnnotationIcons.redo,
						label: target.language.translateAny("Redo"),
						options: {
							callback: this.underConstruction,
							callbackTarget: this
						}
					}, */{
						type: "custom",
						svg: AnnotationIcons.done,
						label: target.language.translateAny("Done"),
						options: {
							callback: this.deactivate,
							callbackTarget: this
						}
					}, {
						type: "custom",
						svg: AnnotationIcons.discard,
						label: target.language.translateAny("Discard"),
						options: {
							callback: this.discard,
							callbackTarget: this
						}
					}]
			}]
		};
		target.exporting.menu.items.push(this._menu);

		this._exportInited = true;

	}

	/**
	 * Toggles annotation mode on click of the related menu item.
	 *
	 * @ignore
	 * @param  options  Options
	 */
	public handleClick(options: IExportCustomOptions): void {
		this.active = !this.active;
	}

	/**
	 * Returns an instance of Fabric's `Canvas`.
	 * @return Canvas
	 */
	public get fabric(): fabric.Canvas {
		// Init canvas if not yet done
		if (!this._fabric) {

			// Creae <canvas> element
			let canvas = document.createElement("canvas");
			canvas.width = this.target.pixelWidth;
			canvas.height = this.target.pixelHeight;
			canvas.style.position = "absolute";
			canvas.style.top = "0";
			canvas.style.left = "0";
			this.target.svgContainer.SVGContainer.appendChild(canvas);

			// Create Fabric representation of the canvas
			this._fabric = new fabric.Canvas(canvas, {
				//isDrawingMode: true,
				containerClass: "am4plugins_annotation_canvas_container"
			});
			(<any>this).fabric.wrapperEl.style.position = "absolute";
			(<any>this).fabric.wrapperEl.style.top = "0";
			(<any>this).fabric.wrapperEl.style.left = "0";

			// Set up events for deletion
			this.fabric.on("selection:created", (ev) => {
				if (this.currentTool == "delete") {
					this.deleteSelected();
				}
			});

			// Set up events for drawing lines
			this._fabric.on("mouse:down", (ev) => {
				if (this.currentTool != "line") {
					return;
				}
				this._pointerDown = true;
				let pointer = this._fabric.getPointer(ev.e);
				let points = [pointer.x, pointer.y, pointer.x, pointer.y];

				this._currentLine = new fabric.Line(points, {
					strokeWidth: this.currentWidth,
					fill: this.currentColor.hex,
					stroke: this.currentColor.hex,
					opacity: this.currentOpacity,
					originX: "center",
					originY: "center"
				});
				this._fabric.add(this._currentLine);
			});

			this._fabric.on("mouse:move", (ev) => {
				if (!this._pointerDown || this.currentTool != "line") {
					return;
				}
				let pointer = this._fabric.getPointer(ev.e);
				this._currentLine.set({ x2: pointer.x, y2: pointer.y });
				this._fabric.renderAll();
			});

			this._fabric.on("mouse:up", (ev) => {
				this._pointerDown = false;
			});

			// Load data if necessary
			if (this._data) {
				this.loadData();
			}
		}

		return this._fabric;
	}

	/**
	 * A `<g>` that holds SVG representation of the annotations in chart overlay.
	 *
	 * @return  Group element
	 */
	public get group(): SVGGElement {
		if (!this._group) {
			//this.group = this.target.svgContainer.container.dom.appendChild(document.createElement("g"));
			this._group = this.target.paper.add("g").node;
			this._group.style.pointerEvents = "none";
			this._group.setAttribute("clip-path", this.target.dom.getAttribute("clip-path"));
			this.target.svgContainer.container.dom.appendChild(this._group);
		}
		return this._group;
	}

	/**
	 * Activates annotation mode.
	 */
	public activate(): void {
		this.active = true;
		this.updateTool();
		(<any>this).fabric.wrapperEl.style.display = "block";
		this.group.style.display = "none";
	}

	/**
	 * Deactivates annotation mode.
	 */
	public deactivate(): void {
		this.active = false;
		this.updateTool();
		(<any>this).fabric.wrapperEl.style.display = "none";
		this.updateSVG();
		this.group.style.display = "";
	}

	/**
	 * Updates SVG overlay to display annotations when in non-annotation mode.
	 *
	 * @todo Set contents properly (not use innerHTML)
	 */
	private updateSVG(): void {
		let svg = this.fabric.toSVG();
		const matches = svg.replace(/[\n\r]*/g, "").match(/<g.*<\/g>/g);
		if (matches) {
			this.group.innerHTML = matches[0];
		}
		else {
			this.group.innerHTML = "";
		}
	}

	/**
	 * Seting to `true` puts the chart in annotation mode.
	 *
	 * Setting to `false` returns chart to regular mode of operation.
	 *
	 * @default false
	 * @param  value  Active?
	 */
	public set active(value: boolean) {
		if (this._active != value) {
			this._active = value;
			if (value) {
				this.activate();
				this.target.exporting.menu.showBranch(this._menu);
			}
			else {
				this.deactivate();
				this.target.exporting.menu.hideBranch(this._menu);
			}
			this.updateIndicator();
		}
	}

	/**
	 * @return Active?
	 */
	public get active(): boolean {
		return this._active;
	}

	/**
	 * Currently selected color.
	 *
	 * @default #000
	 * @param  value  Color
	 */
	public set currentColor(value: Color) {
		if (this._currentColor != value) {
			this._currentColor = value;
			this.updateIndicator();
		}
	}

	/**
	 * @return Color
	 */
	public get currentColor(): Color {
		return this._currentColor;
	}

	/**
	 * List of colors to show in selection.
	 *
	 * @param  value  Colors
	 */
	public set colors(value: Array<Color>) {
		if (this._colors != value) {
			this._colors = value;
			this.updateIndicator();
			this.setColor(this._currentColor);
		}
	}

	/**
	 * @return Colors
	 */
	public get colors(): Array<Color> {
		return this._colors;
	}

	/**
	 * Currently selected width.
	 *
	 * @default 1
	 * @param  value  Width
	 */
	public set currentWidth(value: number) {
		if (this._currentWidth != value) {
			this._currentWidth = value;
			this.updateIndicator();
			this.setWidth(this._currentWidth);
		}
	}

	/**
	 * @return Width
	 */
	public get currentWidth(): number {
		return this._currentWidth;
	}

	/**
	 * List of widths in pixels for line and free-draw tool.
	 *
	 * @param  value  Widths
	 */
	public set widths(value: Array<number>) {
		if (this._widths != value) {
			this._widths = value;
			this.updateIndicator();
		}
	}

	/**
	 * @return Widths
	 */
	public get widths(): Array<number> {
		return this._widths;
	}

	/**
	 * Currently selected opacity.
	 *
	 * @default 1
	 * @param  value  Opacity
	 */
	public set currentOpacity(value: number) {
		if (this._currentOpacity != value) {
			this._currentOpacity = value;
			this.updateIndicator();
			this.setOpacity(this._currentOpacity);
		}
	}

	/**
	 * @return Opacity
	 */
	public get currentOpacity(): number {
		return this._currentOpacity;
	}

	/**
	 * List of opacities available for selection.
	 *
	 * @param  value  Opacities
	 */
	public set opacities(value: Array<number>) {
		if (this._opacities != value) {
			this._opacities = value;
			this.updateIndicator();
		}
	}

	/**
	 * @return Opacities
	 */
	public get opacities(): Array<number> {
		return this._opacities;
	}

	/**
	 * Currently selected font size.
	 *
	 * @default 10
	 * @param  value  Font size
	 */
	public set currentFontSize(value: number) {
		if (this._currentFontSize != value) {
			this._currentFontSize = value;
			this.updateIndicator();
			this.setFontSize(this._currentFontSize);
		}
	}

	/**
	 * @return Font size
	 */
	public get currentFontSize(): number {
		return this._currentFontSize;
	}

	/**
	 * List of available font sizes.
	 *
	 * @param  value  Font sizes
	 */
	public set fontSizes(value: Array<number>) {
		if (this._fontSizes != value) {
			this._fontSizes = value;
			this.updateIndicator();
		}
	}

	/**
	 * @return Font sizes
	 */
	public get fontSizes(): Array<number> {
		return this._fontSizes;
	}

	/**
	 * Currently selected font weight.
	 *
	 * @default 400
	 * @param  value  Font weight
	 */
	public set currentFontWeight(value: number) {
		if (this._currentFontWeight != value) {
			this._currentFontWeight = value;
			this.updateIndicator();
			//this.setFontWeight(this._currentFontWeight);
		}
	}

	/**
	 * @return Font weight
	 */
	public get currentFontWeight(): number {
		return this._currentFontWeight;
	}

	/**
	 * List of available font weights.
	 *
	 * @param  value  Font weights
	 */
	public set fontWeights(value: Array<number>) {
		if (this._fontWeights != value) {
			this._fontWeights = value;
			this.updateIndicator();
		}
	}

	/**
	 * @return Font weights
	 */
	public get fontWeights(): Array<number> {
		return this._fontWeights;
	}

	/**
	 * Currently selected tool.
	 *
	 * @default select
	 * @param  value  Tool
	 */
	public set currentTool(value: string) {
		if (this._currentTool != value) {
			this._currentTool = value;
			this.updateTool();
			this.updateIndicator();
		}
	}

	/**
	 * @return Tool
	 */
	public get currentTool(): string {
		return this._currentTool;
	}

	/**
	 * Initiates tool.
	 */
	private updateTool(): void {
		switch (this.currentTool) {
			case "select":
				this.select();
				break;
			case "draw":
				this.draw();
				break;
			case "delete":
				this.delete();
				break;
		}
	}

	/**
	 * Updates currently selected tool/color indicator.
	 */
	private updateIndicator(): void {
		if (this.indicator) {

			// Update tool icon
			let container = this.indicator.getElementsByTagName("a")[0];
			let newicon = this.target.exporting.menu.createSvgElement(0, "custom", (<any>AnnotationIcons)[this.currentTool]);
			let oldicon = this.indicator.getElementsByTagName("svg")[0];
			container.insertBefore(newicon, oldicon);
			container.removeChild(oldicon);

			// Update color
			(<any>this.indicator.getElementsByClassName(this._indicatorId + "_color"))[0].style.backgroundColor = this.currentColor.hex;
		}
	}

	/**
	 * Current tool/color indicator element.
	 *
	 * @return  Indicator
	 */
	public get indicator(): HTMLElement {
		return document.getElementById(this._indicatorId);
	}

	/**
	 * Sets color.
	 *
	 * @param  value  Color
	 */
	public setColor(value: Color): void {
		this.currentColor = value;

		let brushColor = color(value);
		brushColor.alpha = this.currentOpacity;
		this.fabric.freeDrawingBrush.color = brushColor.rgba;

		// Update selected objects
		let selected = this.fabric.getActiveObjects();
		for (let i = 0; i < selected.length; i++) {
			if ((<any>selected[i]).isType("textbox") || ((<any>selected[i]).isType("path") && selected[i].fill)) {
				selected[i].set("fill", value.hex);
			}
			else if ((<any>selected[i]).getSrc) {
				this.setIconFill(<fabric.Image>selected[i]);
			}
			else {
				selected[i].set("stroke", value.hex);
			}
		}
		this.fabric.requestRenderAll();
	}

	/**
	 * Sets line width.
	 *
	 * @param  value  Width
	 */
	public setWidth(value: number): void {
		this.currentWidth = value;
		this.fabric.freeDrawingBrush.width = value;

		// Update selected objects
		let selected = this.fabric.getActiveObjects();
		for (let i = 0; i < selected.length; i++) {
			selected[i].set("strokeWidth", value);
		}
		this.fabric.requestRenderAll();
	}

	/**
	 * Sets opacity.
	 *
	 * @param  value  Opacity
	 */
	public setOpacity(value: number): void {
		this.currentOpacity = value;

		let brushColor = color(this.currentColor);
		brushColor.alpha = this.currentOpacity;
		this.fabric.freeDrawingBrush.color = brushColor.rgba;

		// Update selected objects
		let selected = this.fabric.getActiveObjects();
		for (let i = 0; i < selected.length; i++) {
			if (selected[i].isType("path")) {
				selected[i].set("stroke", this.currentColor.hex);
			}
			selected[i].set("opacity", value);
		}
		this.fabric.requestRenderAll();
	}

	/**
	 * Sets font size.
	 *
	 * @param  value  Font size
	 */
	public setFontSize(value: number): void {
		this.currentFontSize = value;

		// Update selected objects
		let selected = this.fabric.getActiveObjects();
		for (let i = 0; i < selected.length; i++) {
			if ((<any>selected[i]).text) {
				(<any>selected[i]).set("fontSize", value);
			}
		}
		this.fabric.requestRenderAll();
	}

	/**
	 * Sets font weight.
	 *
	 * @param  value  Font weight
	 */
	public setFontWeight(value: number): void {
		this.currentFontWeight = value;

		// Update selected objects
		let selected = this.fabric.getActiveObjects();
		for (let i = 0; i < selected.length; i++) {
			if ((<any>selected[i]).text) {
				(<any>selected[i]).set("fontWeight", value);
			}
		}
		this.fabric.requestRenderAll();
	}

	/**
	 * Does nothing.
	 */
	public underConstruction(): void {
		alert("This feature is not yet implemented");
	}

	/**
	 * Puts annotator in object selection mode.
	 */
	public select(): void {
		this.currentTool = "select";
		this.fabric.isDrawingMode = false;
		this.fabric.selection = true;
	}

	/**
	 * Puts annotator in free-drawing mode.
	 */
	public draw(): void {
		this.currentTool = "draw";
		this.fabric.isDrawingMode = true;
		this.fabric.selection = false;

		let brushColor = color(this.currentColor);
		brushColor.alpha = this.currentOpacity;
		this.fabric.freeDrawingBrush.color = brushColor.rgba;
		this.fabric.freeDrawingBrush.width = this.currentWidth;
	}

	/**
	 * Puts annotator in line drawing mode.
	 */
	public line(): void {
		this.currentTool = "line";
		this.fabric.isDrawingMode = false;
		this.fabric.selection = false;
	}

	/**
	 * Adds an editable text object to canvas.
	 */
	public addText(): void {
		this.fabric.isDrawingMode = false;
		this.fabric.selection = true;
		this.select();
		let text = new fabric.Textbox(this.target.language.translateAny("Type..."), {
			//left: this.target.pixelWidth / 2,
			//top: this.target.pixelHeight / 2,
			fontSize: this.currentFontSize,
			fontWeight: this.currentFontWeight,
			fill: this.currentColor.hex,
			opacity: this.currentOpacity
		});
		this.fabric.add(text);
		this.fabric.centerObject(text);
		text.enterEditing();
		text.selectAll();
		this.fabric.setActiveObject(text);
	}

	/**
	 * Adds an image to canvas.
	 */
	public addIcon(url: string): void {
		this.fabric.isDrawingMode = false;
		this.fabric.selection = true;
		this.select();

		fabric.loadSVGFromString(url, (res) => {
			for (let i = 0; i < res.length; i++) {
				this.fabric.add(res[i]);
				this.fabric.centerObject(res[i]);
				this.fabric.setActiveObject(res[i]);
				this.fabric.setActiveObject(res[i]);
				res[i].opacity = this.currentOpacity;
				res[i].fill = this.currentColor.hex;
			}
		});

		// fabric.Image.fromElement(element, (img: any) => {
		// 	console.log(img)
		// 	this.fabric.add(img);
		// 	this.fabric.centerObject(img);
		// 	this.fabric.setActiveObject(img);
		// 	// img.fill = this.currentColor.hex;
		// 	//this.fabric.requestRenderAll();
		// 	img.opacity = this.currentOpacity;
		// 	this.setIconFill(img);
		// });
	}

	/**
	 * Attemps to set a fill to the SVG icon.
	 * @param  img  Fabric image reference
	 */
	public setIconFill(img: fabric.Image): void {
		let src = img.getSrc();
		let svg = "";
		if (src.match(/;base64\,/)) {
			try {
				svg = atob(src.replace(/^.*;base64\,/g, ""));
				svg = svg.replace(/fill="[^"]+"/, "");
				svg = svg.replace(/\/>/g, " fill=\"" + this.currentColor.hex + "\" \/>");
				src = src.replace(/(^.*;base64\,).*$/, "$1") + btoa(svg);
				img.setSrc(src);
			}
			catch (e) {
				return;
			}
		}
		else if (src.match(/^data:/)) {
			svg = src.replace(/^data:[^,]*\,/, "");
			svg = svg.replace(/fill="[^"]+"/, "");
			svg = svg.replace(/\/>/g, " fill=\"" + this.currentColor.hex + "\" \/>");
			src = src.replace(/(^.*;base64\,).*$/, "$1") + svg;
			img.setSrc(src);
		}
	}

	/**
	 * Puts annotator in object deletion mode
	 */
	public delete(): void {
		this.currentTool = "delete";
		this.fabric.isDrawingMode = false;
	}

	/**
	 * Clears all annotations.
	 */
	public clear(): void {
		this.fabric.clear();
	}

	/**
	 * Clears all annotations and exits annotation mode.
	 */
	public discard(): void {
		this.fabric.clear();
		this.updateSVG();
		this.deactivate();
	}

	/**
	 * Deletes selected objects
	 */
	public deleteSelected(): void {
		let selected = this.fabric.getActiveObjects();
		for (let i = 0; i < selected.length; i++) {
			this.fabric.remove(selected[i]);
		}
		this.fabric.requestRenderAll();
	}

	/**
	 * Set or get annotation data.
	 *
	 * @since 4.5.6
	 * @param  value  Data
	 */
	public set data(value: any) {
		this._data = value;
		if (this._fabric || this._exportInited) {
			// Canvas is ready, update now
			this.loadData();
		}
		else {
			// Canvas is not yeat ready, just save data for later
		}
	}

	/**
	 * @return Data
	 */
	public get data(): any {
		if (this._fabric) {
			return this.fabric.toObject();
		}
		else {
			return this._data;
		}
	}

	/**
	 * Loads data onto canvas.
	 */
	private loadData(): void {
		this.fabric.loadFromJSON(this._data, (e: any) => {
			this.updateSVG();
			this._data = undefined;
		});
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Annotation"] = Annotation;
