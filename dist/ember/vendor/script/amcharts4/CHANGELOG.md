# amCharts 4 Changelog

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).

Please note, that this project, while following numbering syntax, it DOES NOT
adhere to [Semantic Versioning](http://semver.org/spec/v2.0.0.html) rules.

## [4.0.0-beta.49] - 2018-09-05

### Added
- JSON config: added `callback` property, which if it holds a reference to function will call it within the scope of the object being prepared.
- Adapters for `url` and `urlTarget` properties.
- Chart can now be panned or zoomed using mouse wheel. To set what it does use `mouseWheelBehavior` on `XYChart` (see next point)
- [`mouseWheelBehavior`](https://www.amcharts.com/docs/v4/reference/xychart/#mouseWheelBehavior_property) added to `XYChart`. Options: `"zoomX"` (default), `"zoomY"`, `"zoomXY"`, `"panX"`, `"panY"`, `"panXY"`, `"none"`.
- [`mouseWheelBehavior`](https://www.amcharts.com/docs/v4/reference/mapchart/#mouseWheelBehavior_property) added to `MapChart`. Options: `"zoom"` (default), `"none"`.

### Changed
- Second parameter to `Cursor`'s [`triggerMove()`](https://www.amcharts.com/docs/v4/reference/cursor/#triggerMove_method) method was changed from boolean to enumeration of "stickiness" level: `"hard"`, `"soft"`, `"none"` (default).

### Fixed
- Error fixed when `Popup` object was being disposed.
- Over-panning of an `XYChart` did not disappear after mouse button was released outside chart.
- Multiple memory leaks fixed.
- `MapChart` was rounding lat/long coordinates too much which was resulting in pixelated maps for small-area maps.


## [4.0.0-beta.48] - 2018-08-31

### Added
- `useWebFonts` setting in `Export`. Allows disabling of download of web fonts when exporting.
- `useRetina` setting in `Export`. Images are now exported scaled up on retina displays by default. Set `useRetina = false` to disable.

### Changed
- Export fallback mechanism for older browsers changed from FabricJS to canvg, which is much lighter and has better text formatting support.
- On retina displays images will now export supersized in order not to lose quality. Set `useRetina = false` to disable.
- amCharts logo will now auto-hide on supersmall chart sizes.

### Fixed
- Cursor was zooming the chart even if drag motion was performed on an external element positioned over the chart.
- Cursor was not hidden when it was no longer hovering the chart area if chart had no padding.
- `urlTarget` was not carried over from `ListTemplate` template to new items.
- Cursor could cause chart to freeze up on a DateAxis with empty cells in the axis' beginning or end.
- Export will now correctly handle web fonts, such as Google Fonts. Please note that FontAwesome is not supported, since they forbit any kind of usage, except inclusion via CSS.


## [4.0.0-beta.47] - 2018-08-24

### Added
- New series type: `OHLCSeries`.
- `goHome()` method added to `MapChart`. Calling it will reset map to `homeZoomLevel` and `homeGeoPoint`.
- `homeGeoPoint` added to `MapChart`. Allows setting initial `geoPoint` at which map will be centered.
- `homeZoomLevel` added to `MapChart`. Allows setting initial `zoomLevel`.
- `maxPanOut` property added to `MapChart`, with default value `0.7`. It prevents map to be dragged out of the chart area.
- `noRisers` property added to `StepLineSeries`. It allows step line chart without vertical (or horizontal, depending on orientation) lines.
- Step line without risers now allows making Waterfall chart. Example added.
- `startLocation` and `endLocation` added to `StepLineSeries`, that allow controling locations at which step should start/end.
- `maxPrecision` added for `ValueAxis`. Use it to restrict Value axis to show value labels with less than desired precision (set 0 if you only want integers).
- Portugese (Portugal) translation added.

### Changed
- `Cursor` will now not move if there's some element obstructing the chart's plot area, e.g. a popup or some other element outside the chart.

### Fixed
- Series' and axes' tooltips will now correctly inherit formatters.
- Errors when hovering mouse cursor over open Modal.
- JSON: `children` property of `Container`-type objects was not being processed correctly.
- Popup/Modal now sets `aria-label` automatically if title is set.
- Removing bullet template from series or disposing it will remove/dispose all the bullets created from it.
- Tooltips were overlapping each other, fixed for the most part, but might still be some situations where they overlap.
- Changing data for `MapImageSeries` and `MapLineSeries` used to result runtime error.


## [4.0.0-beta.46] - 2018-08-19

### Fixed
- `TreeMap.homeText` was not working.
- `TreeMap` used to display upper level bullets/labels when drilled-down.
- `TreeMap` had issues with hiding items using legend (when not using animated state).
- Chart cursor was not visible if data was set directly on axis/series but not on chart.


## [4.0.0-beta.45] - 2018-08-17

### Added
- New hardcoded `Sprite` state name added `"hoverActive"` which (if defined) is applied on active elements on hover. This state is applied last in the chain.
- New property on `DataSource`: `keepCount`. If set to `true` incremental updates will remove data items from the beginning of the current dataset, when adding the newly-loaded ones.
- New property on `DataSource`: `incrementalParams`. It's an object whose key/value pairs will be added to URL as parameters when DataSource is making an incremental load request.
- `Popup` (and `Modal`) now have an event dispatcher (`events`) with two events: `"opened"` and `"closed"`. ([more info](https://www.amcharts.com/docs/v4/concepts/popups-and-modals/#Event_handlers))

### Changed
- Legend now respects `itemContainers.template.togglable = false`, which disables default functionality of toggling items when clicked in legend, allowing users to attach their own funcitonality to legend item clicks.
- Toggling of items in Legend can now be disabled by setting `chart.legend.itemContainers.template.togglable = false`.
- In `XYChart` with a `DateAxis`, cursor and data at irregular intervals will now display a Tooltip for nearest available series' data item.
- `zoomToCategories` method of `CategoryAxis` now zooms to the end of the "to" category.
- Default `urlTarget` of amCharts logo is now `"_blank"`.

### Fixed
- In `DataSource` the formatters `inputDateFormat` was ignored.
- Incremental data load via `DataSource` was not working.
- Tooltip used to flicker ar 0,0 position in some cases when hovering over elements.
- Fixed issue which caused chart to gradually shrink to invisibility under some conditions.
- Fixed rendering errors for charts that were initialized in hidden containers.
- `XYCursor` lines and axis tooltips were not shown if chart did not have any data (data was set directly on axis/series).


## [4.0.0-beta.44] - 2018-08-14

### Added
- `TreeMap` now supports legend. Legend will be displayed if a) `TreeMap` data is at least two levels deep (legend displays items from a second level); b) `chart.maxLevels` is set to `2` (without setting it no second-level series are created so legend does not have anything to build itself from). [More info](https://www.amcharts.com/docs/v4/chart-types/treemap/#Legend).
- Swedish translation.

### Changed
- `DateFormatter` will now automatically capitalize month/weekday name if it's the first (or only) word in resulting formatted date. This can be turned off by setting formatter's [`capitalize`](https://www.amcharts.com/docs/v4/reference/dateformatter/#capitalize_property) to `false`.

### Fixed
- Removed `@deprecated` commented out methods/properties that were confusing tslint.
- Issue that caused the chart to shrink was fixed.


## [4.0.0-beta.43] - 2018-08-12

### Changed
- `$net.load()` options parameter now supports `responseType`. If set to `"blob"` will return response as `Blob` object in `result.blob`.

### Fixed
- Value axis min/max calculation algorithm adjusted. Fixed an issue with `strictMinMax = true` and issue with min/max when axis size was very small.
- Export now correctly uses external fonts included via `@import`, such as Google Fonts.
- Non-clickable columns in `ColumnSeries` will no longer gain focus on click/tap, unless its `hitOptions.noFocus` is set to `false`.
- Noon was incorrectly formatted as "AM", instead of "PM".
- `TextFormatter` was producing invalid `style` value on empty formatting blocks (`"[]"`).
- `parent` was not being set for a `Sprite` that was pushed directly to `Container.children`.
- If axis labels were disabled, ranges labels were not visible.
- Axis used to reset some of the user-set values when initing renderer, e.g. `dateAxis.renderer.grid.template.location = 0.5` was not working.
- `XYChart` with category axis + date axis was not working properly.
- Stacked chart with logarithmic axis was not working properly.
- JSON: local formatter instances were not being instantiated properly, so all children objects were reusing chart's main formatters.
- JSON: Patterns are now supported.


## [4.0.0-beta.42] - 2018-08-05

### Fixed
- Updated default Popup CSS to eliminate a rare scrollbar flashing issue.
- Fixed an error with PDF exporting.

## [4.0.0-beta.41] - 2018-08-03

### Added
- `MapSeries` now has `geodata` and `geodataSource`. This allows setting separate maps to each separate map series, which no longer rely on single chart-wide `geodata`. Also, setting `geodata` for `MapSeries` will automatically set `useGeodata = true`, so no need to set it manually.

### Changed
- Removed unused `boldUnitChange` from `DateAxis`.
- Labels on `DateAxis` will now pay attention to `label.location` if label represents full time period between grids. It no longer will force labels to be in the middle.
- `label.currentText` is now public.

### Fixed
- Fixed parsing of string dates in ISO format (`"i"`).
- Legend marker was not aligned with the text (when marker was smaller).
- Solved legend error which happens if you show/hide series after series was added/removed.
- Dynamically adding series was not automatically adjusting axis scales.
- Vertical `CategoryAxis` was not paying attention to `grid.location`.
- Map issues at `minZoomLevel < 1` fixed.


## [4.0.0-beta.40] - 2018-08-02

### Added
- German translation. (de_DE)

### Changed
- [`XYChart.getUpdatedRange()`](https://www.amcharts.com/docs/v4/reference/xychart/#getUpdatedRange_method) method is now public so you can use it to recalculate absolute axis range into a relative that takes current zoom and inversion into account.
- `Language` now supports `null` in translations which means an empty string.
- Interface `iColorSetStepOptions` was renamed to `IColorSetStepOptions` to maintain consistency.
- Interface `ColorPurpose` was renamed to `IColorPurpose` to maintain consistency.
- `FlowDiagramNode` `value` property renamed to `total`, added `totalIncoming` and `totalOutgoing` properties which hold sum of all incoming/outgoing links.
- Removed aliases `startCategory`, `startValue`, and `startDate` from Axes data items. (use `category`, `value`, and `date` respectively)

### Fixed
- Improved performance of Sankey/Chord Diagrams.
- Elements of `TreeMapChart` were not respecting locale.
- Fixed-height bars were drawn incorrectly.
- Pre-hidden series were not taken into account when calculating min/max of value axes in some cases.
- Setting chart data with less data items then there were before resulted in an error.


## [4.0.0-beta.39] - 2018-07-27

### Added
- `useChartAngles` added to `AxisRendererCircular`. If set to `false` allows to set `startAngle`/`endAngle` to each circular axis individually.

### Fixed
- Fixed problem with custom `Legend` data and initial visibility, you can now use `visible: false` to pre-hide custom legend items.
- Grid Layout fixed, affects Legend.


## [4.0.0-beta.38] - 2018-07-26

### Fixed
- Using `PieSeries` data field `"visible"` was not graying out Legend's marker.


## [4.0.0-beta.37] - 2018-07-26

### Added
- You can now make series initially to be hidden by setting `series.visible = false`.
- `visible` added to `PieSeries.dataFields`. It allows making some of the slices initially hidden.

### Changed
- Sankey/Chord diagrams has now toggling nodes enabled by default. To disable, set `chart.nodes.template.togglable = false`.

### Fixed
- Text formatter now correctly escapes double square/curly brackets, as well as empty formatting blocks `[]`.
- Setting `series.visible = false` or `series.hide()` wasn't toggling off related item in Legend.
- Setting `isActive` did not affect `Container`'s background (assuming it had `"active"` state).


## [4.0.0-beta.36] - 2018-07-25

### Added
- `elements` property in `Popup`. Returns an object consisting of references to various elements of the Popup, like content block, close button, etc.

### Changed
- `am4core.getSystem()` has been changed to `am4core.system`

### Fixed
- Fixed double "amcharts" in Popup's class names.
- Fixed dragging on of absolute-positioned Popups.
- Escaping square brackets in text (by repeating them twice) was not working.
- Fixed a lot of disposer leaks.
- Fixed an issue that caused runtime errors with Rollup.


## [4.0.0-beta.35] - 2018-07-23

### Added
- New adapter on `Component` (and everything that inherits it including charts and series): `"data"`.
- New adapter on `Popup`: `"closable"`.

### Changed
- `showModal()` and `hideModal()` methods were renamed to `openModal()` and `closeModal()` respectively.
- `show()` and `hide()` methods on `Popup`/`Modal` were renamed to `open()` and `close()` respectively.

### Fixed
- More performance-related improvements, especially with `CategoryAxis`.
- Changing `interactionsEnabled` from `false` to `true` was not working properly in IE.
- Setting `axisRenderer.inside = true` after chart was already built didn't work.
- `zoomlevelchanged` event of `MapChart` was being fired even if zoom level did not change.
- Setting `MapChart.deltaLongitude` was ignored if it was set before projection was set.
- Map tooltip bounds were not being updated when map container's size changed.


## [4.0.0-beta.34] - 2018-07-22

### Fixed
- Dramatic performance improvements!


## [4.0.0-beta.33] - 2018-07-19

### Added
- `calculatePercent` flag added to `Series`. Default value is `false`, except for `PieSeries`. Series will not calculate percent values of each data item if this is not explicitly set to `true`. Since it wasn't been used anywhere but Pie chart, this should improve performance of initial data parsing.

### Fixed
- Performance improvements. Especially when zooming/scrolling chart with a lot of data.
- `lineSeries` was not paying attention to `propertyField` values set in data.
- Radar and Gauge charts were not centered properly when resizing window.
- Container's background properties were not copied when cloning container.


## [4.0.0-beta.32] - 2018-07-17

### Important (potentially breaking changes)
- To maintain event-naming consistency, events `"insert"` and `"remove"` were renamed to `"inserted"` and `"removed"` respectively in `List` and its inheriting classes. [#132]
- To maintain event-naming consistency, events `"clear"` and `"remove"` were renamed to `"cleared"` and `"removed"` respectively in `Dictionary` and its inheriting classes.

### Fixed
- Significant performance improvements were made.
- JSON config: Filters could not be used.
- Some properties were not being copied when cloning objects, e.g. `segments` in `LineSeries`. (`interactionsEnabled` and some others)
- Circular axis was not properly drawing grid lines if `radius` was < `percent(100)`.
- `Button` label was "stealing" interactions from the button itself.
- `Tooltip` was sometimes drawn without pointer if "animated" theme was not enabled.
- Fixed label alignment of Y axis.

### Changed
- Improved `contentAlign` (when content size is bigger than actual size of a container).

### Added
- Two new adapters added to `Label`: `"textOutput"` and `"htmlOutput"`. Both are applied **after** label contents (text or HTML respectively) are populated with data.
- Added `"custom"` option to export menu types, which now allows creating clickable custom items in the `ExportMenu`.
- `Legend` now accepts "raw" data, enabling creating custom items: `legend.data = [{name:"name 1", fill:"#ff0000"}, {name:"name 2", fill:"#00ff00"}]`. Important: a legend with custom items must be added to some chart container manually (e.g. `chart.chartContainer`). Assigning it to `chart.legend` will overwrite its data.

## [4.0.0-beta.31] - 2018-07-06

### Important
- Layouting mechanism was revamped to make it more consistent and intuitive. If you see some layout issues with your chart, please let us know!

### Added
- New chart type: [`ChordDiagram`](https://www.amcharts.com/docs/v4/chart-types/chord-diagram/).

### Changed
- The `Adapter` `keys` property is now a 0-argument function and not a property.
- `Adapter` callback now has third parameter `key`, which is a string indentifier of the adapter being applied.
- `ChordDiagram`, same as `SankeyDiagram` now extend `FlowDiagram` class. `FlowDiagram` can not be instantiated alone, it's a base class for those two.
- `minWidth`/`minHeight` is now set to some small amount on a `PieChart` so that it remains visible even, if the oversized legend does not fit into container.
- `heatRules` no longer override properties if they are set using `propertyFields`.

### Fixed
- Printing in Firefox was broken after latest updates in export/print.
- Re-enabled data export on legacy IEs.
- If a legend was initially disabled, it did not show up after enabling it later.
- Series tooltip was not disposed when series was disposed. This could result in tooltips hanging and not hidin in such charts as `TreeMap` after data was changed.
- `Tooltip` was sometimes flickeing at 0,0 position when first hovered on columns of a series.
- When all values were 0, `XYChart` was not displayed properly.
- When all values were equal and less than 0, `XYChart` was not displayed properly.
- Zero-value slices were shown as black rectangles in the pie chart legend.
- Labels were not showing tooltips.
- `LineSeries` was not displayed properly if colors were set in data. (using `propertyFields`)
- Tooltips were shown with white background when first hovered over slices/columns/etc.
- Setting `interactionsEnabled = true` did not if it was set to `false` previously.
- `axisFill` was not showing `innerRadius` correctly if it was set as `Percent`.
- Data update on `SankyDiagram` was resulting in error.

## [4.0.0-beta.30] - 2018-06-22

### Fixed
- JSON config: `heatRules` can now refer to bullets in `tartget` using syntax `"bullets.0.property"`, e.g. `"bullets.0.circle"`. (meaning use "circle" property of the first bullet as heat rule target)
- Export: fixed SVG export on Firefox.
- Export: fixed SVG/CSV/JSON export for Edge/IE.
- Export: fixed sheet name limitations for Excel export.
- Export: print option was printing the whole page instead of just chart on IEs.
- Export: fixed bitmap image export on IEs.
- [Issue 65.](https://github.com/amcharts/amcharts4/issues/65)

### Changed
- `class` attribute is no longer applied to elements by default. To enable it use new setting `am4core.options.autoSetClassName`.
- `class` attributes now will contain the whole inheritance chain, e.g. `"amcharts-Sprite amcharts-Container amcharts-Button"`. Class names are no longer lowercased.
- The `svgContainer` property is now an `SVGContainer`, not an `HTMLElement`.

### Added
- New global option `am4core.options.autoSetClassName` (default `false`). If set to `true` will set `class` attribute of all elements that reflect class element was created in, including inheritance, e.g. `"amcharts-Sprite amcharts-Container amcharts-Button"`.

### Removed
- Element-level `classNamePrefix` is no longer available. Use global `am4core.options.autoSetClassName` instead.

## [4.0.0-beta.29] - 2018-06-16

### Fixed
- Wrong `Cursor` behavior in Edge browser on hybrid touch screens.
- Malfunctioning colors in IE9.
- Console errors, triggered by mouse hover in IE9.
- A bunch of errors and bugs on Popup/Modal in IE9.
- Enabling `ExportMenu` on IEs was breaking the chart.
- `"dragstop"` event was not being triggered on touch and hybrid devices.

### Changed
- Dramatically improved performance of dragging of Popup.
- The `dataItem` of the tooltip is now set sooner, which enables it to be used in its various adapters.

### Added
- `Sprite` now has [`hoverOptions`](https://www.amcharts.com/docs/v4/reference/sprite/#hoverOptions_property) which can be used to set up how touch "hovering" works.

## [4.0.0-beta.28] - 2018-06-05

### Fixed
- Using chart `Cursor` now prevents default browser gestures on touch and hybrid displays.
- Disabling elements (e.g. Legend or Axis labels) will now make other elements take up vacant space automatically.
- Tooltips on `XYSeries` data items with zero value were not being shown.
- Sometimes `XYSeries` tooltips were messed up and shown in incorrect position.
- Updating chart data with stacked series could result incorrect min/max values on `ValueAxis`.
- `Treemap` was not showing all the required levels on zoom-out unless animated theme was being used.
- Sometimes unpredictable behavior of labels on a logarithmic value axis was fixed.
- `DateAxis` with `skipEmptyPeriods = true` was showing axis tooltip at incorrect positions in some cases.

### Changed
- `Sprite.mouseEnabled` was renamed to `interactionsEnabled`.
- An option `"mouse"` for `tooltipPosition` was renamed to `"pointer"`.

## [4.0.0-beta.27] - 2018-06-01

### Fixed
- Issue with `Label` text truncation.
- Huge performance improvements, especially on initial chart load.
- `Animation.resume()` was not working.

### Changed
- Default `tooltipLocation` on `SankeyLink` is now `0.5`.
- Default value of `series.hiddenState.opacity` is now `0` (was `1`). Animated theme sets it to `1`, because it animates stuff by interpolation, rather than fade.

### Added
- `pt_BR` and `en_CA` locales.
- `fullWords` property on `Label`. Works only when `truncate = true`. Setting to `false` will force non-fitting label to be truncated in the middle of the word.

## [4.0.0-beta.26] - 2018-05-30

### Fixed
- Error with `EventDispatcher is disposed`.
- Having "stray" axis objects (not attached to any chart) was resulting in critical error.
- Zooming was broken on `RadarCursor` since last update.
- `PieSeries.legendSettings` were being ingored.
- `Cursor` was incorrectly doing `panY` (inverted).
- Date axis tooltip was not rounding dates to `baseDuration`.
- Date axis was not working properly with `min`/`max` values set.

### Changed
- Redone chart print functionality. Now printing is done via `<iframe>` by default. An alternative CSS option is also available.
- If series' bullets have hover state set, it will be applied whenever chart cursor is over position, even if not directly hovering over bullet.
- `XYSeries` used hidden/default state `transitionDuration` for interpolating values when showing/hiding series. Now they use `series.interpolationDuration`.
- ZoomOut button was under the cursor lines making it impossible to click.
- `easing` renamed to `transitionEasing` in SpriteState, for consistency.
- When setting `width`/`height` for an element in pixels, `minWidth` and `maxWidth` is also set to the same values.
- If `interpolationDuration` is 0 and `hiddenState.transitionDuration > 0`, the series will transit to hidden state first and then instantly interpolate values to 0.

### Added
- Finished cursor updates to support cursor syncing.

## [4.0.0-beta.25] - 2018-05-25

### Fixed
- Using `tooltipHTML` was very buggy.
- Text formatting with two adjacent formatting blocks (`[...][...]`) was broken.
- `DateFormatter` was ignoring `utc` setting when formatting dates.
- Popup no longer obstructs the chart around it.
- Popup/Modal and Export Menu now temporarily disable all interactivity behind it.

### Added
- `DataSource` now has property [`requestOptions`](https://www.amcharts.com/docs/v4/reference/datasource/#requestOptions_property) which you can use to add custom request headers to HTTP(S) requests.
- `Popup.title` property.
- `Popup.draggable` property (boolean). Default `true`. Makes popups draggable.
- `ru_RU` (Russian) and `nl_NL` (Dutch) translations.
- `Dictionary`, `DictionaryTemplate`, `List`, `ListTemplate`, `OrderedList`, `OrderedListTemplate`, `SortedList`, and `SortedListTemplate` have these new methods:
- `each` (which calls a function for each element in the data structure)
- `Symbol.iterator` (which is used for the ES6 iterator protocol)
- New `Cursor` event: `"behaviorcanceled"`. (called when zoom/pan/select operation is abandoned)
- New `Cursor` methods: [`triggerMove()`](https://www.amcharts.com/docs/v4/reference/cursor/#triggerMove_method), [`triggerDown()`](https://www.amcharts.com/docs/v4/reference/cursor/#triggerDown_method), and [`triggerUp()`](https://www.amcharts.com/docs/v4/reference/cursor/#triggerUp_method) for improving cursor syncing and manual placement.
- Support for `Series.heatRules` in JSON chart config.
- JSON config now supports arrays in `events` and `adapter`.

### Changed
- HTML labels now take `fill` (color) parameter into account by translating it into `color` CSS property of the style.
- Now when data loader gracefully handles CORS and other critical load errors.
- `Chart.openPopup()` now does not ignore second parameter. (title)
- Changed default International English time with seconds format to `"HH:mm:ss"`.
- Date format on `DateAxis` tooltip will now use axis' `minPeriod` rather than current label period.
- `EventDispatacher.has()` function's second parameter (callback) is now optional. If it's not specified it will check whether **any** event handlers are present for this particular event type.

## [4.0.0-beta.24] - 2018-05-16
### Fixed
- Mouse/touch-related functionality was preventing text selection on the whole document.

### Added
- Added examples in JSON format. (available in JS-oriented packages and GitHub only)
- New events on `ExportMenu`: `"branchselected"`, `"branunselected"`, `"closed"`.
- Added [`Sprite.hoverOnFocus`](https://www.amcharts.com/docs/v4/reference/sprite/#hoverOnFocus_property) boolean setting. If set to `true` element will also trigger hover events on it when it gains focus, e.g. display tooltip. (accessibility feature)

## [4.0.0-beta.23] - 2018-05-13
### Fixed
- Various internal things were not properly disposed.

## [4.0.0-beta.22] - 2018-05-13
### Fixed
- Heights of vertical `HeatLegend`'s gradient band and value axis (labels) were different.
- `HeatLegend` without its `series` set was resulting in critical error.
- `HeatLegend` did not respect `dataField` setting in `Series.heatRules`.

### Removed
- `newStack` from Series which was redundant.

## [4.0.0-beta.21] - 2018-05-10
### Added
- New element class [`Popup`](https://www.amcharts.com/docs/v4/reference/popup/).
- New way to display pop-ups on charts via [`Sprite.popups`](https://www.amcharts.com/docs/v4/reference/sprite/#popups_property) and [`Sprite.openPopup`](https://www.amcharts.com/docs/v4/reference/sprite/#openPopup_method).
- New example "adding-live-data".
- Added this `CHANGELOG.md`.

### Fixed
- Fixed automatically-calculated RadarChart radius on non-full-circle chart setups.
- Improved incremental data updates.

## [4.0.0-beta.20] - 2018-05-09
- Internal maintenance release

## [4.0.0-beta.19] - 2018-05-09
- Internal maintenance release

## [4.0.0-beta.18] - 2018-05-09
- Internal maintenance release

## [4.0.0-beta.17] - 2018-05-09
- Internal maintenance release

## [4.0.0-beta.16] - 2018-05-09
- Internal maintenance release

## [4.0.0-beta.15] - 2018-05-09
### Fixed
- `createFromConfig()` was not working properly if chart type was passed as a class reference.
- In JSON-based config, axes properties were not being set.
- In JSON-based config, referring to Series in `XYChartScrollbar` was giving an error.
- One-ended `SankeyLink` was not being drawn correctly.

## [4.0.0-beta.14] - 2018-05-0
- Internal maintenance release

## [4.0.0-beta.13] - 2018-05-04
- Internal maintenance release

## [4.0.0-beta.12] - 2018-05-04
- Internal maintenance release

## [4.0.0-beta.11] - 2018-05-03
### Added
- Added ability to automatically load geodata via `MapChart.geodataSource`. ([more info](https://www.amcharts.com/docs/v4/chart-types/map/#Loading_external_maps))

### Changed
- `DateAxis.baseInterval` now defaults to 1.

### Fixed
- Fixed bad tooltip behavior on the right-side axis.
- Fixed `DateAxis.skipEmptyTimeUnits` which was not working properly.
