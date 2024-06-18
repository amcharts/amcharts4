# amCharts 4 Changelog

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).

Please note, that this project, while following numbering syntax, it DOES NOT
adhere to [Semantic Versioning](http://semver.org/spec/v2.0.0.html) rules.

## [4.10.39] - 2024-06-18

### Changed
- Upgraded versions of xlsx and pdfmake.

### Fixed
- Year of week ("YYYY") code in date formats was not being resolved properly.


## [4.10.38] - 2023-08-21

### Fixed
- Fixed issue with PDF export.


## [4.10.37] - 2023-08-04

### Fixed
- Horizontal cylinders in some cases were not being drawn properly.
- Fixed and issue with mutating ES6 module.


## [4.10.36] - 2023-05-18

### Added
- New locale: Faroese (fo_FO). Thanks Martin Puge.

### Changed
- A link object that was created with `linkWith` for `ForceDirectedNode` is pushed to the child node's data items `childLinks` array and also `node.linksWith` list.
- Removed `xlsx` package (with vulnerability) from dependencies in favor of a bundled hard copy (version 0.19.3) due to their decision not to publish to NPM. ([Issue 4261](https://github.com/amcharts/amcharts4/issues/4261)).

### Fixed
- In some cases, when a series was removed from a `SerialChart` it was not disposing one of the listeners and could remain in the memory.
- Grip rollover labels of a vertical `Scrollbar` were showing opposite values.
- Fixed issue with mutating ES6 modules.


## [4.10.35] - 2023-03-21

### Fixed
- RTL text was not being truncated correctly.
- Removed chart producing an error on longpress on touch devices in some cases.
- In some cases, when a series was removed from a Serial chart, it was not disposing one of the listeners and could remain in the memory.


## [4.10.34] - 2023-02-09

### Fixed
- Fixed an accessibility warning `MapChart`.
- Bullet positions on a `PieSeries` was sometimes off.
- Legend with `scrollable = true` was scrolling even if scrollbar was not visible at that moment.


## [4.10.33] - 2023-01-02

### Fixed
- `DateAxis` with data grouping enabled could go into infinite loop of switching between period in some specific data setups.


## [4.10.32] - 2022-12-14

### Fixed
- Image export was broken in some cases since 4.10.31.


## [4.10.31] - 2022-12-13

### Fixed
- When exporting chart with external elements (e.g. external legend), export would leave some stray canvas elements in the DOM.
- `PieSeries`'s labels were arranged incorrectly in some cases, if `maxWidth` and `wrap` was set on the label template.


## [4.10.30] - 2022-11-14

### Changed
- Upgraded `xlsx` package to version 0.18.5.

### Fixed
- Stacked series were not being displayed correctly if it was hidden during data update.


## [4.10.29] - 2022-10-11

### Changed
- Panning an `XYChart` with a `CategoryAxis` using mouse wheel will snap to categories so that after the pan full axis cell at the beginning and end of the axis will be visible.


## [4.10.28] - 2022-09-19

### Added
- `"p"` number formatting modifier added. Works the same way as `"%"` except it treats numbers as absolute values and does not multiply them by 100.

### Changed
- `"%"` number formatting modifier will now consider locale when choosing whether percent sign goes before or after the number. At this moment only `tr_TR` (Turkish) locale is placing percent sign before number.

### Fixed
- Pressing ENTER while `PieSeries` was focused would not toggle it.
- `SankeyLink` middle line was not drawn in it was a straight line.
- Legend's scrollbar was not adjusting thumb size if the div of a chart changed its height.


## [4.10.27] - 2022-08-18

### Added
- Slovak locale/translation.

### Changed
- All D3 libraries are updated to the latest version.

### Fixed
- Fixed degrading performance with updating data on data-heavy charts with Responsive enabled.
- "Week of year" was not being calculated properly for the tunr-of-the-year week in some cases.
- Vertical `ValueAxis` was not respecting `maxZoomFactor`.
- Changes to `strokeOpacity` on `PercentSeries` elements were not propagating to legend marker.


## [4.10.26] - 2022-07-09

### Fixed
- Setting `html` on a `Label`, then resetting it, was leaving the old content.
- Updating HTML label's `fill` was not updating the color of the actual label right away.
- `SliceGroper` plugin will now handle negative values correctly.


## [4.10.25] - 2022-04-19

### Added
- `baseValue` added to `ForceDirectedSeries` (default: `0`). Used for calculating node radius.

### Fixed
- `focusFilter` property was not being cloned.
- Setting `tabindex` to a negative value was not working properly.


## [4.10.24] - 2022-02-14

### Changed
- When auto-wrapping labels, text will no longer break on dots to prevent fractional numbers from wrapping.

### Fixed
- Multiple square bracket and apostrophe escaping was not working properly.


## [4.10.23] - 2021-11-25

### Added
- New `NumberFormatter` setting: `forceLTR`. If set to `true` will force all numbers to be formatted as LTR, even if RTL is enabled.

### Changed
- Using minified version of `xlsx` library for XLSX exports.

### Fixed
- If chart queuing was enabled and chart was disposed quickly before it had a chance to initialize, it was resulting in a critical error.
- In some cases (after programmatic hover) tapping on a touch device could produce an error in `MapChart`.
- JSON config: in some cases items in `children` were not being created.
- Mouse wheel zooming was not working properly in recent versions of Firefox.
- Fixing security vulnerability ([`CVE-2021-3807`](https://nvd.nist.gov/vuln/detail/CVE-2021-3807)) with `venn.js` dependency.
- Tweaking hover styles for `ExportMenu` CSS so they do not get invoked unless hovered on chart's container.
- Reader labels were not being updated on Scrollbar elements when data in chart was updated.
- `Annotation` plugin will now not go into edit mode after `data` is set.
- In some cases wrapped and center-aligned axis labels could get a bit offset.
- In some cases toggling series on and off was not updating related value axis scale on lazy-loaded charts.


## [4.10.22] - 2021-08-20

### Changed
- `package.json` for ES2015 package was properly updated with new version dependencies.

### Fixed
- Another issue with label text with a lot of in-line formatting not wrapping properly fixed.
- ForceDirectedTree was not updating label `maxWidth` on zoom.
- Legend's `position = "absolute"` was not working.


## [4.10.21] - 2021-08-08

### Added
- Export: new setting in CSV options: `addBOM` (default `true`).

### Changed
- `userClassName` now supports multiple class names separated by space.
- Exporting CSV will now have add BOM code to exported file.
- Upgrading to `pdfmake 0.2.2` to work around security issues in older version.
- Upgrading to `xlsx 0.17.0` to work around security issues in older version.

### Fixed
- In some cases axis labels could be hidden across multiple data updates.
- Fixed issue with stacked/clustered negative values.
- `MapChart` now respects `home*` zoom/position with externally loaded geodata.
- Sizing/positioning of 3D charts with titles fixed.
- RangeSelector plugin: fixed zoom range resetting issues.
- Issue with inverted radial axis fixed.
- Axis with `snapToSeries` set was snapping to hidden series.
- Using timezone was causing `DateAxis` tooltips to show incorrect time in some cases.
- Issue with label text with a lot of in-line formatting not wrapping properly fixed.


## [4.10.20] - 2021-06-17

### Fixed
- In-line formatting of labels was triggering errors on pages with strict CSP rules.


## [4.10.19] - 2021-06-08

### Fixed
- Export: dynamic CSS `<style>` added by `Export` was not applying global `nonce` option.
- `RangeSelector` plugin: some pre-set period buttons were behaving incorrectly when there was no animated theme enabled.
- In some cases labels for `ValueAxis` were prone to a floating-point issue.
- `OverlapBuster` plugin. Was not always working properly without animated theme.
- Minor tweak to multiple series tooltip arrangements.
- JSON config: sometimes items pushed to `children` were not being created.
- Truncation of Legend's labels sometimes were being knocked off by the `XYCursor` activities.


## [4.10.18] - 2021-04-21

### Fixed
- `SliceGrouper` was not working when chart was a child of another `Container`.
- `SliceGrouper` was not updating properly when `am4core.options.queue = true` was set.
- `DateAxis` labels were showing zeros instead of proper milliseconds in IE.
- In some cases hidden link in `SankeyDiagram` could cause rollover tooltip to appear.
- Stroke of the slices in a `FunnelChart` was not being drawn complete.
- JSON config: value list of the `List` element was not being properly truncated to supplied lenght.
- JSON config: event list as array was not working properly.
- Using `timezone` setting in some timezones could offset Series' bullets.
- Absolute pixel `width` in `RadarColumn` was being ignored.


## [4.10.17] - 2021-03-19

### Added
- New setting for `Export`: `webFontFilter`. Allows it to set to a regular expression. If set only those external fonts that their URL match regular exporession will be loaded.
- New setting for `ForceDirectedSeries`: `showOnTick` (default `10`). Render series hidden until Xth tick.
- New setting for `XYCursor`: `snapOnPan` (default `true`). Indicates whether to "snap" zoom selection to equal periods when panning by cursor ends.

### Fixed
- Zooming of chart with multiple vertical axes of which one was inverted was incorrect.
- `minZoomCount` was not being taken into account when zooming with mouse wheel.
- JSON config: `exporting.dataFields` setting was being ignored.
- Creating chart before its container is ready, was resulting in extra element in DOM in some cases.


## [4.10.16] - 2021-03-03

### Fixed
- In some rare cases an critical error could happen on hoverable objects on touch-only displays.
- Zooming and drag-rotating a resized `MapChart` could throw off the map position.
- It was possible to continue zooming the chart using mouse wheel even when max zoom was reached.
- Zooming "inverted" horizontal axis was incorrect.
- Updating data on `SankeyDiagram` in some cases could result in an SO.
- `TreeMap` was showing incorrectly sized nodes with empty children array.
- Sometimes wrapping long strings were causing punctuation at the end of the word to wrap into the next line.
- Dynamically switching `logarithmic` setting for a `ValueAxis` was not updating its scale properly in some cases.
- `SliceGrouper` plugin was not updating properly when manipulating data and/or series.


## [4.10.15] - 2021-02-03

### Fixed
- Fixed issue with toggling multiple `ColumnSeries3D` (introduced in last version).


## [4.10.14] - 2021-02-02

### Added
- Exporting: all adapters related to XLSX export, will now have `xslx` property holding reference to processor, that needs to be used in order to modify actual workbooks for export.

### Fixed
- `StepLineSeries` might get "stuck" during zoom/data updates in some cases.
- `ColumnSeries3D` was not staying hidden across data updates.
- Columns on `DateAxis` were not being positioned properly when changing `firstDayOfWeek`.
- RangeSelector plugin: YTD was not working properly when data was being grouped to years.
- Disposing chart on a click of a custom `ExportMenu` item was resulting in JS errors.
- In some setups "ghost paper" (invisible div) was influencing document layout.
- In charts where Series had very small amplitude of values, related `ValueAxis` could get end up in a dead loop.
- HTML tooltips were not being sized properly in some cases.


## [4.10.13] - 2020-12-18

### Added
- Export: PDF export options now support `scale`, `minWidth`, `minHeight`, `maxWidth`, and `maxHeight` options.

### Changed
- Setting `ignoreZeroValues = true` on `PieSeries`/`PyramidSeries` will now hide `null`-value slices, too.

### Fixed
- Inserting a new bullet into an initialized Series will now invalidate it cause the new bullet to appear immediately.
- Using `timezone` might shift axis label values by one day in some cases.
- `"i"` input date format was not properly parsing formats with no milliseconds and with timezone offset, e.g. (`"...+10:30"`).
- Export: `normalizeSVG()` method was producing wrong SVG width/height in output if scale parameter was not being passed in.
- RangeSelector plugin: "YTD" pre-defined period was not working properly with some data-grouping setups.


## [4.10.12] - 2020-11-26

### Changed
- `DateAxis` setting `timezone` is being deprecated. Please consider setting `timezone` on chart or axis `dateFormatter`. `DateAxis` will now properly place grid in time zones that use non-whole hour fractions, e.g. ("Australia/Adelaide").
- Accessibility: Roles and tabindexes in `ExportMenu` elements has been altered to better comply with ARIA standards.

### Fixed
- Scrollbar could act funky when repeatedly clicking on its grips.
- A minor conflict with Google Charts lib on IE fixed.
- Improved performance of `ValueAxis` scale calculation.
- Setting `min` and `max` on a `DateAxis` could result in excessive overzoom and an empty grid in some cases.
- Overzooming `DateAxis` coul dresult in some extra space shown on it.
- Legend was dynamically adding items on a Treemap chart when drilling-down.
- When Legend's labels' `width` were set in percent, they were not being properly sized.


## [4.10.11] - 2020-11-13

### Added
- New setting `reverseGeodata` (default: `false`) on `MapChart` and `MapSeries`. amCharts requires polygon coordinates to be in clockwise order. Some map data have them in counter-clockwise. If your custom map appears garbled, try setting this to `true`.
- New global option: `am4core.options.pixelPerfectPrecision` (default: `0`). Precision (number of decimal points) to be used when rounding point x/y for elements that have `pixelPerfect = true` set.

### Fixed
- `XYChartScrollbar` was not inheriting `inputDateFormat` from the chart properly.
- Clicking on a chart on mobile devices could sometimes make them document scroll a bit.
- Accessibility: pressing ENTER while there is a focused element with `showTooltipOn = "hit"` will not display its tooltip.
- RangeSelector (plugin) was not properly removing its elements after `dispose()` it will now auto-dispose when related axis is disposed.
- In some cases a console error could be displayed when using `XYCursor` over chart when data was being updated.
- Very long labels with `wrap = true` may have been wrapping incorrectly in some cases.
- JSON config: `rgb(...)` and `rgba(...)` syntax was not recongnised in `ColorSet`'s `baseColor`.


## [4.10.10] - 2020-11-03

### Changed
- License check for `MapChart` was not working. If you are using commercial `MapChart`, make sure you use `addLicense()` for both Charts and Maps products.

### Fixed
- Better dispose check for delayed `"out"` event.
- Applying accessibility to some labels with only numeric information was resulting in error.
- Chart could result in an SO in some rare cases.
- Using `strictMinMax` with `includeRangesInMinMax` sometimes could caulse wrong zooms.
- In some cases Legend's item labels were being truncated when cahrt container was shrinking, but were not being restored to their full width once it was enlarged back.


## [4.10.9] - 2020-10-23

### Changed
- Export: API functions like `getCSV`, `getSVG`, `getJSON`, `getExcel` will not error out if no opeionts or format identifier is passed in.

### Fixed
- Better invalidation of charts with `am4core.options.queue = true` enabled.
- A slice in `PieSeries` remained enlarged (as hovered) after subsequent taps on it on a touch device.
- In some rare cases, on mobile devices a JS error could be invoked when disposing series/axes.
- Vertical `ValueAxis` was not auto-zooming in some cases.


## [4.10.8] - 2020-10-19

### Added
- New `Tooltip` property `ignoreBounds` (default `false`). If set to `true`, will not try to contain tooltips within the boundaries of the chart.

### Fixed
- Export: Invoking export's `getSVG()` method without passing in options as a second parameter was resulting in error.
- Series' actual value was not being properly updated in all cases when used with `gropuDataItem` adapter.
- Series with with extremely small value range could result in an SO.
- Resetting data to an empty data set on an `XYSeries` witth bullets and a data grouping enabled, could result in bullets being left on the screen.


## [4.10.7] - 2020-10-10

### Fixed
- `numberFormatter` inheritance was broken for `XYSeries` elements like bullets since last version.
- Chart with a `CategoryAxis` and `XYCursor` was erroring when number-based categories were used in data.


## [4.10.6] - 2020-10-09

### Added
- SVG export options now support `scale`, `minWidth`, `minHeight`, `maxWidth`, and `maxHeight`.
- New `ExportMenu` property: `element` (a reference to menu's top element).

### Fixed
- `readerTitle` and `readerDescription` were not being properly populated with data on Map objects.
- Setting `includeRangesInMinMax = true` on `ValueAxis` in some cases was messing up the chart.
- Export: Printing via iframe in IE11 was distorting the chart aspect ratio.
- Export: Exporting in IE11 was leaving behind a stray `<canvas>` element afterwards.
- Auto-zoom on `ValueAxis` was not working properly with multiple series with incomplete data.


## [4.10.5] - 2020-10-02

### Changed
- Inline curly-bracket data placeholders now support dot-separated data context names as literal strings, e.g. `"my.custom.property"`.
- A bunch of dependencies were updated to latest versions.

### Fixed
- Toggling `rtl` value on an existing `Label` was (still) not working properly.
- `showSystemTooltip` was being ignored since last version (4.10.4).
- `chart.cursor.snapToSeries` was not causing cursor to snap in wrong place if `groupData` was enabled.
- Bullet tooltip was being hidden even if it had to stay when cursor moved out of the plot area.


## [4.10.4] - 2020-09-22

### Changed
- Accessibility: `ExportMenu` top item has now role `menubar` rather than `menu`.
- Accessibility: `ExportMenu` will now set `aria-expanded` attributes for selected menu items/branches.

### Fixed
- Enabling `groupData` was causing some series not to appear in some cases (since 4.10.3).
- Toggling a legend item was adding a hidden element outside chart container area, which was sometimes causing scrollbars to appear on the web page.
- Toggling `rtl` value on an existing `Label` was not working properly.
- Accessibility: setting `rederTitle` or `itemReaderTitle` was not setting `aria-label` but rather adding `<desc>` tag and `aria-describedby` attirubute. It now will use `aria-label` for `readerTitle` and `<desc>` for `readerDescription`.
- Accessibility: there was no way to override hard-coded `role` of the slices or columns in series.
- Accessibility: navigating `ExportMenu` with arrow keys will not scroll web page anymore.


## [4.10.3] - 2020-09-19

### Added
- RangeSelector plugin: a new event `periodselected` added to `DateAxisRangeSelector`.
- `DateFormatter` now supports quarter format (code: `"q"`).

### Changed
- More prompt translations to Indonesian locale (`id_ID`).

### Fixed
- JSON config: Some axis' `title` property was being overwritten if it wasn't last option in the properties list.
- SliceGrouper plugin was sometimes not functioning properly when used with `options.queue = true`.
- Scrollable legend was not resetting back to top if its height changed.
- `TreeMap` with `binaryTree` algorithm was producing a JS error if no initial data was set on chart.
- If data grouping on `DateAxis` was enabled and there were more than one series in the chart, the second and other series were rendered with data ungrouped in the background before rendering them correctly and thiswas causing performance issues.
- Vertical `CurvedColumnSeries` with non-inversed `CategoryAxi`s were not positioned properly.


## [4.10.2] - 2020-09-08

### Fixed
- Some `SankeyDiagram` charts were broken after last release.
- `4.10.0` caused some bullet adapters to kick in earlier which in turn was resulting in critical errors if those adapters relied on `dataItem` to be present without checking.


## [4.10.1] - 2020-09-07

### Added
- New `DateAxis` property: `timezone`. Allows setting timezone to recalculate data in, e.g. `"Australia/Sydney"`. Make sure not to set this on both axis and date formatter.
- New `DateFormatter` property: `timezone`. Allows setting timezone to recalculate date objects to before applying the format, e.g. `"Australia/Sydney"`.
- New global option: `am4core.options.disableHoverOnTransform` (`"never"` (default), `"touch"`, `always`)). Allows disabling all hover activity when some element is being dragged or resized. [More info](https://www.amcharts.com/docs/v4/concepts/touch/#Hover_functionality).

### Changed
- Now `SankeyLink` that points "backwards" will be applied `"backwards"` state (if created) so you can style it differently than regular links.

### Fixed
- Accessibility: data placeholder population was not working on bullets if Animated theme was not enabled.
- Tapping on a chart with `Cursor` was triggering an on-screen keyboard on some mobiles devices.
- Some TypeScript warnings were fixed.
- A chart with `DateAxis` and `groupData = true` could result a JS error if a series had bullets and a lots of data points.
- In a chart with `DateAxis` and `groupData = true`, if a series was hidden when zoomed-in, then zoomed-out, and then unhidden, the related  `ValueAxis` was not updating it's min/max to available value range.
- In some cases a heat rule could result in infinity value which would lead to drawing errors.
- Errors when cloning a `RadarChart` from a template fixed.
- `SankeyDiagram` used to produce stack owerflow error if data contained backward links. Now it will correctly draw a link.


## [4.10.0] - 2020-09-01

### Added
- New `LineSeries` property: `smoothing` (`"bezier"` (default), `"monotoneX"`, and `"monotoneY"`) - indicates algorithm to use for smoothing the lines. Monotone algos are better suited for irregularly-spaced data. [More info](https://www.amcharts.com/docs/v4/chart-types/xy-chart/#Alternate_smoothing_algorithm).
- `ForcedDirectedTree`: new property `zoomable` (default: `false`). If set to `true`, the chart will be zoomable/draggable using mouse, touch, or API. [More information](https://www.amcharts.com/docs/v4/chart-types/force-directed/#Zooming).
- `ForcedDirectedTree`: zoom related properties added. `mouseWheelBehavior` (`"zoom"`, `"none"`) - controls what happens when mouse wheel is used over chart; `zoomStep` (default: `2`) - step to increase zoom level my each zoom in; `zoomOutButton` - an instance of button which is shown when chart is zoomed in.
- `ForcedDirectedTree`: new zoom-related methods: `zoomToPoint(point, level, center)` and `zoomToDataItem(dataItem, level, center)`;
- New global function: `am4core.createDeferred(callback, scope, ...parameters)`. Can be used to create multiple charts in a truly safe daisy-chain (next chart starts to be instantiated only when previous triggers a `ready` event). Returns a `Promise` with chart instance. [More information](https://www.amcharts.com/docs/v4/concepts/performance/#Deferred_daisy_chained_instantiation);
- New global option: `am4core.options.deferredDelay` (default `100`). Specifies time-gap in milliseconds between deferred chart instantiations.

### Changed
- Added date ordinal translations for Chinese locales.

### Fixed
- Accessibility: `readerTitle` was not being properly populated with data on `Label`.
- Accessibility: `readerDescription` was not being populated with data.
- Now works with Angular Universal SSR. Please refer to our [Angular doc](https://www.amcharts.com/docs/v4/getting-started/integrations/using-angular2/) for instructions on how to structure your app for SSR to work properly.
- When `MapChart` was panned with inertia and a polygon with `zoomToObject()` hit event was clicked when the map was still moving, the map was zooming into a wrong position.


## [4.9.37] - 2020-08-21

### Fixed
- Colors for markers in Legend with `useDefaultMarkers = true` were broken since last release.


## [4.9.36] - 2020-08-20

### Added
- New adapter on `XYSeries`: `groupDataitem`. When data grouping occurs, each aggregate data item will be passed through this adapter, where you can modify its aggregate value. [More info](https://www.amcharts.com/docs/v4/tutorials/using-custom-functions-for-data-item-grouping/).
- Two new `MapPolygonSeries` properties: `sortPolygonsBy` ( `"area"` (default), `"name"`, `"longitude"`, `"latitude"`, `"id"`, and `"none"`) and `sortPolygonsReversed` (default `false`).

### Fixed
- Export: `fontSize` option was being ignored when exporting data in PDF.
- Better format object type checks in `DateFormatter` and `NumberFormatter`.
- Older (non-Chromium) EDGE browser was not showing patterns in the legend markers.
- If a stacked series was hidden with data item grouping enabled and then axis zoomed in or zoomed out so that group perdiod changes, series were stacked on the wrong position.
- `CircularAxis` line was flickering while start/end angle was animating.


## [4.9.35] - 2020-08-12

### Added
- New adapter on `XYSeries`: `groupValue`. It's now possible to apply custom aggregate value calculation functions for grouped data items. [More info](https://www.amcharts.com/docs/v4/tutorials/using-custom-functions-for-data-item-grouping/).
- New adapter on `Cursor`: `cursorPoint`. Use it to custom-position chart cursor using your own logic.

### Changed
- Accessibility: Now if ENTER is pressed when object with an enabled `"hit"` event is focused, that event will be triggered automatically.
- Clicking anywhere on the plot area with `XYCursor` will now trigger blur on any focused element on the page (consistent to clicking anywhere else on the document).

### Fixed
- RangeSelector plugin was not properly inheriting chart's locale.
- `"x"` (timestamp) in `inputDateFormat` was not working properly.
- If all values of `SankeyDiagram` were `0` (zero), nodes were not being arranged and their rectangles were not being displayed.
- First `CategoryAxis` label was not visible if `minGridDistance` was set to `0` (zero).
- Old series bullets of an `XYSeries` remained visible when data was updated and data grouping was enabled on related `DateAxis`.
- `Utils.random()` function was not returning value in proper from/to range.
- Stacking now works only between series of the same type. Previously a `LineSeries` between two stacked `ColumnSeries` could mess up stacking for the latter.
- Zooming in on a part of `LineSeries` which had `strokeDashArray` enabled via `propertyFields` was making the whole line dashed.
- On a chart with `XYCursor` hovering on category with a null value for some series, used to display a tooltip for a different category in some cases.


## [4.9.34] - 2020-07-31

### Added
- New bullet `ShapeBullet` in `Bullets` plugin. Please refer to [this documentation article](https://www.amcharts.com/docs/v4/tutorials/plugin-bullets/) for more info.
- `treatZeroAs` added to `ValueAxis`. Use it to work around zero-value restriction on a logarithmic scale.
- `stackToNegative` (default: `true`) added to `XYSeries`. Determines whether negative values in a stack will stack in relation to base (zero) line (`true`; default) or in relation to the previous value in the stack (`false`).

### Changed
- [xlsx](https://www.npmjs.com/package/xlsx) dependency was updated from `0.15.4` to `0.16.4`.
- Tooltip snapping on `DateAxis` now takes Series' location into account.

### Fixed
- Regression plugin: `reorder` option was not working properly.
- `snapToSeries` was not working properly if there was a hidden Series with exactly the same value as the other visible Series.
- `TreeMap` and `ForceDirectedTree` with a single data item and no children were not working properly with chart legend.
- Horizontal (X) Axis tooltip in a very small document was sometimes positioned with an offset.
- `zoomToRectangle()` method of `MapChart` with `deltaLongitude` was not working properly if a rectangle crossed the 180 meridian.


## [4.9.33] - 2020-07-23

### Fixed
- If an item from a chart with `CategoryAxis` was removed and then a new item with the same category name was added, chart was not rendering the new item.
- A chart with multiple series starting/ending not at the same position could result in wrong zoom on `ValueAxis`
- Last bullet/column from `XYSeries` could disappear if end date was not exact as last data items date.
- `LineSeries` could skip a point in case distance between data points was very small, resulting in incorrect line series.


## [4.9.32] - 2020-07-23

- Nothing here. Version number snafu.


## [4.9.31] - 2020-07-21

### Changed
- Global adapters are being deprecated due to performance reasons. They will still work on some properties, but may be turned off at some future version. If you are using `am4core.globalAdapter`, please consider refactoring your code in some other way.
- If `groupInterval` is manually set, `DateAxis` now prepares all intervals. Normally, the chart does not prepare data sets for time intervals longer than the span of dates in the data. This causes problem in case user sets these intervals manually using `groupInterval`. Note, the groupInterval must be set initially, before data parsing in order data to be grouped into all groupIntervals.

### Fixed
- "Year of week" (`YYYY`) was not being calculated correctly by `DateFormatter`.
- Regression plugin was not working correctly in an all-`ValueAxis` scenarios.
- `ColumnSeries` were not working with `dropFromPreviousState`.
- If data was changed on a chart which was zoomed and there were less data items in the new data than there was before, a JS error was triggered.
- Sometimes a chart with `XYChartScrollbar` with series in it could produce a JS error if series has its `fillOpacity > 0`.
- Series in an `XYChartScrollbar` was not being shown if `options.onlyShowOnViewport = true`.
- `zoomToRectangle()` call was resulting in an error if called after the `MapChart` was rotated.
- `CurvedColumnSeries` columns were not being filled with proper color (black was being used instead).
- A chart with multiple series starting/ending not at the same position could result in wrong zoom on `ValueAxis`.
- `DateAxis` with millisecond `baseInterval` sometimes could show one millisecond less than actual data point in its tooltip.


## [4.9.30] - 2020-07-10

### Added
- `am4core.options.suppressWarnings` global option added (default: `false`). If set to `true`, the charts won't output any warnings into console (e.g. "Chart was not disposed").

### Fixed
- Drill-down map with `geodataSource` problem fixed (since last release only).
- Issues with cursor/tooltip and other element positioning fixed, when chart was being initialized outside of DOM (no container on init).


## [4.9.29] - 2020-07-09

### Changed
- Export: data exported as HTML will now have `<thead>` and `<tbody>` tags.
- `XYChart.getClosest()` method is now public.
- Accessibility: Now pressing ENTER while there's a `MapChart` element focused (using TAB key) will invoke its `hit` event, if set.

### Fixed
- JSON: heat rules referring to series' bullets were not working, e.g. `target: "bullet[0].circle"`.
- IE: More fixes to polyfill overriding.
- `ColorSet` method `next()` would fail if `currentStep` was bigger than `minColors`, affecting `SliceGrouper` plugin setups with a lot of slices in particular.
- On `MapChart` settings `minZoomLevel` and `maxZoomLevel` were being ignored when pinch-zooming.
- Syncing of axes improved, especially when series of one axis were hidden/shown.
- If a `MapSeries` had its geodata loaded via `geodataSource`, the map used to disappear after div size changed.
- Legend had a `maxWidth` set to `200` and this could result labels to be truncated even if there was enough space for them to fit in.
- Ticks/grid could disappear if `ValueAxis` had `min`/`max` set and data of a chart changed.


## [4.9.28] - 2020-06-29

### Added
- New adapter `xlsxWorkbook` in `Export`. Will allow decorating a Workbook object before it is exported.
- `chart.exporting` text-based API functions (`getSVG()`, `getCSV()`, `getJSON()`, `getHTML()`) now have third parameter (boolean). If set to `false` they will return a raw output, rather than data:uri.
- `zoomable` property added to all axes (default: `true`). Setting it to `false` will make axis not react to zoom events from scrollbar/cursor.

### Changed
- Removed `focusable` from map chart background series.
- Polyfills in `.js` file will now only load on-demand, making it with some frameworks that override default objects.

### Fixed
- Regression plugin: the regression line was not being drawn correctly on a chart with horizontal `ValueAxis`.
- Export: images exported on zoomed-out pages sometimes were showing visual artifacts.
- If a chart cursor was visible (because of soft or hard `triggerMove()` calls) but the real mouse was out of the plot area, the cursor used to react to clicks even though it shouldn't have.
- `ForceDirectedNode`'s `fill` and `stroke` adapters were not working properly if nodes were initially collapsed.
- `Sprite.hitTest()` method was not working properly with `nonScaling = true`.
- If a `MapChart` had geodata loaded via `geodataSource.url`, the map used to disappear after div size changed.
- If a legend of a `MapChart` was disposed, a JS error might happen in some cases.


## [4.9.27] - 2020-06-18

### Added
- `ExportMenu` item definition can now have `title` property. If set, it will be added to item's `title` property, which should show a system tooltip on hover.

### Changed
- Hex color parser now supports RGBA format which includes alpha value, e.g. `"#FF000080"` will produce a 50% transparent red.

### Fixed
- Fixed performance issue with a logarithmic `ValueAxis` with `strictMinMax` set to `true`.
- Calculated value of `sum` in the selection of an `XYChart` could include one extra data item, not visible in the selection.
- Pie slices with 0 values were sorted incorrectly in FF.


## [4.9.26] - 2020-06-07

### Fixed
- Series with `showOnInit = false` were not shown on a chart initially (since last release only).


## [4.9.25] - 2020-06-06

### Added
- Global option `am4core.options.autoDispose` added (default `false`). If set to `true`, when chart is being created in a container that has already existing chart, instead of "Chart was not disposed" warning in console, the chart being overwritten will be disposed.
- New plugin: [Range Selector](https://www.amcharts.com/docs/v4/tutorials/plugin-range-selector/). Collection of controls for adding alternative zoom controls for axes.

### Changed
- Disabled callbacks will now carry over to a clone when cloning an Adapter.

### Fixed
- Export: Sometimes background was improperly clipped when upscaling exported image.
- Export: If chart's `data` was updated open `ExportMenu` was forcibly being closed.
- `"Z"` and `"ZZ"` indicators in `inputDateFormat` were being ignored.
- If series had `sequencedInterpolation = true` set and it was hidden via legend, its legend item lost disabled color when chart was resized.
- `bullet.locationX` and `bullet.locationY` was being ignored on a `ColumnSeries` with `CategoryAxis`.
- If a chart's Legend was disposed, it could result in JS errors if chart had an `XYCursor` enabled.


## [4.9.24] - 2020-05-29

### Added
- Export: New image export options: `minWidth`, `minHeight`, `maxWidth`, and `maxHeight`. Control minimum and maximum dimensions of the target image.
- Chart can now be initialized without target container (`am4core.create(undefined, ...)`) then, when needed placed into container using `chart.moveHtmlContainer(target)` (where `target` can either be id or a reference of DOM element).
- `groupInterval` property added to `DateAxis`. You can use it to force certain grouping internal when `groupData = true` instead of one chosen dynamically.

### Changed
- `stroke`/`fill` settings will now accept values as RGB objects (e.g.: `{ r: 255, g: 0, b: 0 }`).
- Export: `scale` now scales source SVG before converting to image, instead of resampling target image.
- Chart will no longer error out if target container by supplied id is not available at the moment of chart's instantiation. It will still error if such container is not available when DOM is ready. This allows placing chart code before actual chart target markup.
- If Axis has `syncWithAxis = true` set, it is excluded from common zoom range for better syncing.

### Fixed
- Sometimes responsive rules were not being applied on chart load in Angular apps.
- `XYCursor` setting `snapToSeries` now uses better precision in placing cursor lines/axis tooltips.


## [4.9.23] - 2020-05-19

### Added
- `removedfromqueue` event added to `Sprite`. It is invoked when `am4core.options.queue = true` or `am4core.options.onlyShowOnViewport = true` and the Sprite (chart) is removed from queue (appears on the screen).
- `groupperiodchanged` event added to `DateAxis`. It is invoked when data grouping is on and grouping period is changed.

### Fixed
- JSON: Array value in `snapToSeries` on `XYCursor` was resulting in error.
- `RadarChart` was resulting in an error if used as a column or bullet template in some other chart.
- `AxisRendererRadial.innerRadius` was ignored if set in percent and `RadarChart.innerRadius` was not set.
- Wide charts were being cut off in the middle when printing.


## [4.9.22] - 2020-05-14

### Changed
- Export: Now using forked version of `canvg` until underlying issues are fixed in source library.

### Fixed
- `queue` and `onlyShowOnViewport` were not working properly on regular `Container` instances.
- Export: Garbled IE image exports fixed.
- Some tooltips were reappearing on `MapChart` after their `showToolipOn` was reset back to `"hover"` from `"always"`.


## [4.9.21] - 2020-05-13

### Fixed
- Latest version of `canvg` was causing issues in some Angular setups. Downgraded to `3.0.0`.
- The legend marker for `LineSeries` with circle bullet was not properly centered.


## [4.9.20] - 2020-05-11

### Changed
- `hit` and `up` events on nested objects will now respect correct bubbling up order.
- If `rtl` is not set directly on the `Label`, it will now take `rtl` value not from its parent but from `baseSprite` (performance enhancement).
- `<desc>` element with amCharts attribution removed from generated SVG.

### Fixed
- Export: PDF export will now fallback to regular fonts if bold fonts don't exist.
- Export: Advanced PDF exports with extra content were broken since last release.
- Export: Image export was essentially broken in IEs.
- `options.nonce` was not working properly on EDGE.
- Event `selectedned` was not dispatched by `Cursor` if released outside the chart div and behavior was set to `select*`.
- If all series were removed and then added quickly to the chart with a legend it could result a JS error.
- Setting `data` directly on a series not right after it was created could result `series.data` array to be shown as empty.
- It was impossible to set `SwitchButton` as active initially.
- Fixed snapping cursor to series when data was missing: if series had gaps in data and `cursor.snapToSeries` was set, the snapping was not working properly.
- When adding data to `XYSeries` which was `XYCharScrollbar`'s series, the raw data was incorrectly modified.


## [4.9.19] - 2020-04-30

### Added
- Export: Two new PDF export options added: `font` and `extraFonts` which enable specifying non-default font to use when exporting PDF. [More info](https://www.amcharts.com/docs/v4/concepts/exporting/#PDF_and_non_Latin_languages).

### Changed
- Third party resize sensor replaced with a home-brewed, which is faster and more reliable.
- `svgContainer.resizeSensor` replaced with a dummy object. Make sure you remove all references to it in your code. Calling it's `reset()` method will now generate a warning in console.

### Fixed
- Inline text formatting blocks now accept quote-enclosed values, e.g. `[font-family: 'Segoe UI']`.
- Fills for columns in `RadarColumnSeries` were black (since last release).
- With Chrome 81 disposing the chart in with DevTools open was very slow.
- Performance optimizations when showing/hiding series with a lot of data.
- Tooltip was flickering at 0,0 position if animated theme was not enabled.


## [4.9.18] - 2020-04-28

### Added
- Heatmaps can now be logarithmic (set `logarithmic = true` in the heat rule config).

### Fixed
- Preloader label was misaligned when RTL was enabled.
- Double "hit" event invocation on `MapPolygon` fixed.
- Regression plugin: "processed" event was triggered twice on initial chart load.
- SliceGrouper plugin: if slice templats had any "hit" events set, `clickBehavior = "break"` was not working.
- IE was not displaying series in `XYChartScrollbar`. On IE now gray fill/stroke is used instead of desaturate filter.
- IE was not displaying series with filters. Remnoved filters if IE.
- Fixed issue with zero-value nodes drill-down `SankeyDiagram`.
- When animations were disabled through options, showing `XYSeries` and `FunnelSeries` after it was hidden was not working.
- It was not possible to add `MapImages` to `MapImageSeries` directly from the GeoJSON geodata.
- `maxWidth` set on Legend's label was being ignored.
- Layout was not being redrawn when `minGridDistance` was set after chart initialization.
- If `sprite.showTooltipOn = "hit"` and no animated theme was used, tooltip used to flicker at old position before shown in the correct one.
- EDGE was not showing `ColumnSeries` gradients if gradient was set on series, not on directly on column template.


## [4.9.17] - 2020-04-20

### Added
- Global option `am4core.options.nonce` added. If set, amCharts will use this as a nonce-parameter for all dynamically created stylesheets, so it can be addressed in `Content-Security-Policy` headers.
- New `Popup` property: `dynamicResize`. If set to `true` (default) and contents contains unloaded images it will resize itself when those finish loading.
- `gradientUnits` added to `LinearGradient`. If you're setting gradient on a perfectly straight line, set it to `userSpaceOnUse`.
- `filterUnits` added to `Filter`. If you're setting gradient on a perfectly straight line, set it to `userSpaceOnUse`.
- `startLocation` and `endLocation` added to `CategoryAxisBreak`. Can use to indicate where exactly within category break should start and end.

### Changed
- `Popup` now will size itself to accommodate images inside it as they are being loaded. To disable, set `Popup`'s `dynamicResize = false`. Also make sure you enable `maxWidth`/`maxHeight` in your CSS to avoid unreasonably large popups for unsized images.

### Fixed
- Week number in date format (`"ww"`) was not accounting for daylight saving.
- Pressing ENTER on a focused Legend item will no longer toggle related series if legend's item containers are sett to be not togglable.
- Exporting to SVG no longer breaks if chart contains `foreignObject` elements with SVG's in them.
- Line smoothing (`tensionX` / `tensionY`) now drops out duplicate points to avoid weird loops on overlapping data items.
- Chart was zooming incorrectly, when data was added directly to stacked series and one of the series was hidden.
- Some performance issues with `XYCursor` and a lot of series fixed.
- `LinearGradient` fill was not working on `LineSeries` under EDGE.


## [4.9.16] - 2020-04-14

### Fixed
- Fixed error when compiling Angular app (since 4.9.14).


## [4.9.15] - 2020-04-13

### Fixed
- Straightening of `RadarChart` was not working properly after last update.


## [4.9.14] - 2020-04-13

### Added
- Global options setting added `am4core.options.animationsEnabled` (default `true`). Set it to `false` to **disable all animations on all charts**. Can be used to toggle animations on and off dynamically.
- `SliceGrouper` plugin: new setting `limit` added. If set to a number, will ignore `threshold` but will show only first X slices and will group the rest.
- New PDF format option for `Export`: `align`. Available options: `"left"` (default), `"center"`, and `"right"`.
- New `ValueAxis` property: `adjustLabelPrecision` (default: `true`). `true` means that **all** labels on `ValueAxis` (except zero) will maintain the same number of decimals, e.g. `1.0`, `1.5`, `2.0` versus `1`, `1.5`, `2`. Enabling it will ignore number of active decimals set via `numberFormat`.
- `DateFormatter` is now exposing list of various named time units: `months`, `monthsShort`, `weekdays`, and `weekdaysShort`. You can now resolve numeric value to an English name (e.g. `chart.dateFormatter.weekdaysShort[2]`) or to your active locale (`chart.dateFormatter.language.translate(chart.dateFormatter.weekdaysShort[1])`).

### Changed
- New property `adjustLabelPrecision` hsa a default of `true`, which means that all labels will now have same number of decimals on `ValueAxis`. Set `adjustLabelPrecision = false`, to disable and revert behavior to how it was before this update (`1`, `1.5`, `2`).
- `am4core.options.viewportTarget` now accepts array of references if you have multiple scrollable containers holding charts and have `onlyShowOnViewport` enabled.
- Default `DateAxis.periodChangeDateFormats` for `"hour"` changed from `"_date_hour"` to `"_date_day"` so that the format would differ for midnight (hour 00:00).

### Fixed
- Parsing short month names (`"MMM"`) from string-based dates was failing on May.
- When exporting chart to PDF, on narrow charts, sometimes the whole chart would go to the next page.
- Having `null` values in data was causing `maxTooltipDistance == -1` to show multiple tooltips instead of one.
- It was impossible to have individual `innerRadius` for `AxisRendererRadial` and `AxisRendererCircular` - the `RadarChart`'s `innerRadius` was overriding them.
- Removing axis ranges from an axis could result in a JS error.
- In some cases, when `DateAxis` properties `startLocation` and `endLocation` were not defaults (0 and 1), the chart might flicker from one grouped data period to another continously. It was only happening with some particular `groupCount` values and data item counts, though.


## [4.9.13] - 2020-04-05

### Added
- Global options setting added `am4core.options.suppressErrors` (default `false`). Set it to `true` to disable error-invoked modal display.

### Fixed
- Setting `locale` as string (e.g. `locale: "fr_FR"`) in JSON config was not working.
- `ValueAxis.min` and `ValueAxis.max` now accept `undefined`.
- `NumberFormatter` and `DateFormatter` will not longer critically fail if invalid `Intl` data is passed to them. Instead they will return `"Invalid"` string.
- Responsive: Sometimes objects were being revealed after coming back from responsive mode when thet shouldn't.
- `locations` setting of the `SeriesDataItem` were not being copied to grouped data items (when `DateAxis.groupData = true`).
- Shadow DOM: Made some changes to eliminate errors in IE11.
- Shadow DOM: `ExportMenu` and `Popup`/`Modal` CSS was not being properly applied causing those elements to lose styling and positioning.


## [4.9.12] - 2020-03-26

### Added
- New mouse cursor style added: `am4core.MouseCursorStyle.text`.
- Export `formatOptions` now accessible via public property, e.g. `chart.exporting.formatOptions.getKey("csv").disabled = true`.

### Changed
- Using date format `"i"` to parse ISO dates now supports unlimited number of milliseconds. It was failing before if more than three digits were used for milliseconds.

### Fixed
- If `Label` had its interactions disabled then re-enabled, its `selectable` property was being ignored.
- `Modal` with `closable = false` could still be closed via curtain click.
- `openModal()` ignored title (second parameter).
- Pushing child elements in `Label` which has `textValign` set was resulting in error.
- `cursor.snapToSeries` was not working properly with `CategoryAxis`.
- Firefox was not measuring labels properly if a chart was lazy-loaded using `onlyShowOnViewport`.


## [4.9.11] - 2020-03-24

### Added
- Export: Added `disabled` property to all format options so you can disable each particular export format easily, e.g.: `chart.exporting.getFormatOptions("csv").disabled = true`.
- New property on all `Sprite` elements: `userClassName`. If set, will also set element's `class` accordingly. Works directly, and via `propertyFields`.

### Fixed
- Fixed error with Angular Server Side Rendering (Angular Universal).
- Accessibility: minor role issue fixed for items in `ExportMenu`.
- It was impossible to change heat rule's min and max values after the rule was added.
- Changing category of axisRange after it was alrady added to axis was not working.


## [4.9.10] - 2020-03-19

## Added
- `SwitchButton` class added.
- `width` field and adapter added to `ColumnSeriesDataItem`. Allows having variable column width via data binding.


## [4.9.9] - 2020-03-16

### Fixed
- Fixed again: if chart had stacked axes and series with bullets, the bullets were not masked properly. Now you can set `series.maskBullets = true` to solve this.
- `TimeLine` series bullets were not updating position when Y axis was zoomed.
- Tooltips of `TimeLine`/`RadarChart` series were hidden on some parts of the chart (sice 4.9.7).


## [4.9.8] - 2020-03-14

### Fixed
- Bullets on `RadarChart` were being masked incorrectly (since 4.9.7).
- Background on `TimeLine` axis could be filled incorrectly in some cases (since 4.9.7).
- `TimeLine` could error out in some cases (since 4.9.7).


## [4.9.7] - 2020-03-14

### Added
- Export has now additional setting `dataFieldsOrder`. It's an array. Push field names into it and exported data will try to maintain field order like this.
- A read-only property `tooltipDate` added to `DateAxis`. Will holde `Date` object of the last shown axis tooltip.

### Fixed
- In charts with series loading their own external data with responsive features enabled, they were starting as pre-hidden.
- Axes in `XYChartScrollbar` (both value and date) were not reseting min/max if series of the chart changed. This could result scrollbar's series incorrectly displayed.
- `PyramidSeries` and `FunnelSeries` with very small values were not animating properly on chart init.
- `PyramidSeries` and `FunnelSeries` with data items with `value = 0` could show small rectangle at top/left corner.
- `PyramidSeries` with data items with `value = 0` was not rendered properly.
- Tooltip on a horizontal axis was "shaking" when cursor was very near plot area.
- Performance improved of adding series to an already build `XYChart`.
- Map was not drawn with certain initial `deltaLongitude` values (e.g. 30, 60, etc).
- Removing series with a lot of data, `DateAxis` with grouping enabled, and zoomed-in chart could cause a stack overflow.
- Removing series could cause error (if removed while initial animation was still playing out).
- Sometimes, if a series was added after chart was inited and data grouping of `DateAxis` was enabled, the `ValueAxis` was not fully zoomed out.
- A newly added series after the chart was inited was not showing initial animation.
- Violating logarithmic axis scale no longer results in critical / chart-stopping error. The modal can be closed and chart recovered.
- If chart had stacked axes and series with bullets, the bullets were not masked properly. Now you can set `series.maskBullets = true` to solve this.
- Series tooltip is no longer shown if data item is outside plot area.
- Perfectly straight line series in `XYChartScrollbar` were not displayed.


## [4.9.6] - 2020-03-05

### Changed
- Setting `maxTooltipDistance` to `-1` on `XYCursor` will force only one tooltip to always be displayed, even if there are multiple data items in exact same spot.

### Fixed
- Responsive: changing data on a chart with active responsive rules was causing for those rules not to be re-applied when chart was updated.
- If Legend item was clicked or tapped, subsequently pressing ENTER anywhere on the page was toggling it.
- Series of `MapChart` and their children were inherinting main locale.
- `ExportMenu` was freezing the whole chart is hovered (since `4.9.5`).


## [4.9.5] - 2020-03-03

### Added
- Third paramterer - `force` - added to `ChartCursor.triggerMove`. If set to `true` it will trigger all actions associated with the move even if the cursor is already at the same coordinates.

### Fixed
- Exporting from ExportMenu will now prevent cursor (and releated tooltips) from appearing just before export so they are not included in exported image.
- Panning on a `MapChart` with `panBehavior = "rotateLongLat"` was not working properly since `4.9.3`.
- Disposed series was not being properly removed from `XYChartScrollbar` if it was used there.
- Sprites with `dx`/`dy` set and `rotation != 0` were not displaying fixed-position tooltip in correct position.
- Changing `tooltipText` was causing the tooltip to hide if it was already visible and `tooltipPosition` was set to `"pointer"`.
- `XYChart` with legend positioned to right/left was not positioning `valueLabels` properly (if aligned to right).
- `TreeMap` legend was not functioning properly.


## [4.9.4] - 2020-02-26

### Fixed
- `MapChart` was erroring out if `homeGeoPoint` was set.
- Bullets hovered by `XYCursor` were not being reset back if cursor left plot area.


## [4.9.3] - 2020-02-25

### Changed
- `MapChart` will not perform its pan behavior (e.g. drag) if some other interactive element is being currently dragged. Good if you have a Scrollbar on top of the map for example.

### Fixed
- Fixed issue with `snapToSeries`.


## [4.9.2] - 2020-02-25

### Added
- Accessibility: New method for chart's `svgContainer`: `readereAlert(text)`. When called, will force screen reader to read out certain text.
- `velocityDecay` added to `ForceDirectedSeries`. Increase the number to slow down node dynamics.

### Changed
- Accessibility: If screen reader is enabled, it will notify user when a) legend item is triggered; b) `MapChart` zoom level changes.
- `XYCursor.snapToSeries` now accepts an array of series and will snap to most close data point from any series present in the array.

### Fixed
- Now charts will properly disengage dragged elements when mouse cursor leaves iframe.
- Fixed a typos in French, Portuguese translations.
- Added more translated prompts to Korean translation.
- When series which was being used in an `XYChartScrollbar` local data was being updated, the clone used in Scrollbar was not being updated.
- `Series.autoDispose` setting was being ignored.
- Fixed "The precision is out of range" errors on some browsers (Safari, IE) when very small numbers are used.
- Accessibility: Setting of `tabindex` value was basically not working.
- Funnel slice with `null` values showed small black rectangle at the top/left corner and legend item was not showing a marker.
- Syncing between multiple `ValueAxis` improved.


## [4.9.1] - 2020-02-14

### Added
- `precision` added to `MapLine` (default `0.1`). If line has `shortestDistance = true` set, it will be bent according to to projection. If `precision` is larger than the distance (degrees) between line's end points, no such bending will occur. Set it to large number for perfectly straight lines.
- `precision` added to `MapPolygon` (default `0.5`). Polygon's side lines are bent according to to projection. If `precision` is larger than the distance (degrees) between side's end points, no such bending will occur. Set it to large number for perfectly straight lines.

### Fixed
- JSON config: referring to a `parent` by id is now not dependent on order of elements.
- Series elements (e.g. columns) were not dispatching "over" event when `XYCursor` was being used.
- When `Legend` was triggering hover over `PieSeries` slice (or other `PercentSeries`), the slice did not dispatch `"over"` event.
- Hidden `ForceDirectedNode` (if hidden using API) was not showing if legend item was clicked to show it again.
- `path` adapter was not working on `Sprite`.
- Adding `data` to a `XYChart` with an `XYChartScrollbar` with a series was sometimes resulting JS error (if some data was missing).
- Adding `AxisBreak` to `CategoryAxis` could result JS error.
- `groupFields` were not copied to series in `XYChartScrollbar`, or any other cloned series.
- If a bullet was already disabled when `disabled` property field was set, that bullet did not update correctly after data change.


## [4.9.0] - 2020-02-09

### Added
- New plugin: [Venn Diagram](https://www.amcharts.com/docs/v4/chart-types/venn/).
- `ForceDirectedSeries.dragFixedNodes` property added (default `false`).
- `ForceDirectedSeriesDataItem.percent` getter added.

### Fixed
- Mouse interactions were not working properly in very old (pre-59) FireFox.
- Dynamically changing `ForceDirectedSeriesDataItem.fixed` was not working.
- `CirclePattern` was not being globally exported.
- Setting `expoirtable = false` on some elements that are invisible sometimes caused them to become visible after export.


## [4.8.9] - 2020-02-07

### Added
- Scrollbar.isBusy getter added, which is true when user interacts with Scrollbar.
- RadarColumnSeries now support two category axes.
- angleToPosition(angle) added to AxisRendererCircular.
- currentPosition getter added to ClockHand.

### Fixed
- Export on IE (and other setups with `simplifiedExport = false`) was broken since upgrading canvg version.
- When DateAxis had grouped set to true, in some cases the value axis was zoomed incorrectly after Data update.
- In some specific cases XYScrollbar with series could produce JS error when adding data to the chart.
- Funnel Series sliceLink could loose it's color after data update.


## [4.8.8] - 2020-02-05

### Fixed
- When zooming `CategoryAxis` with sorted columns, some columns were not being displayed.


## [4.8.7] - 2020-02-05

### Added
- `sortBySeries` property added to `CategoryAxis`. If you set it to an instance of a `ColumnSeries`, the axis will automatically sort its categories by actual series' values.

### Fixed
- Labels with extra line breaks at the end could sometimes inherit content from previous version of multi-text, e.g. in dynamically updated tooltips.


## [4.8.6] - 2020-01-31

### Fixed
- Tree map with data items with value = 0 resulted error
- ZoomToDates of DateAxis with grouped data was not always working properly.
- colors ColorSet of PercentSeries were not cloneed when clonging series so clonned series used single Colorset which resulted different colors.
- dateAxis.timezoneOffset was not working properly with value 0. Default value changed from 0 to undefined.

### Added
cloneTooltip flag (default value true) added to Sprite. When cloning a sprite, if the template has it's own tooltip assigned, this tooltip is also cloned by default. This is not good
for cpu and sometimes you might only need one single tooltip for all clones. Set cloneTooltip to false in order not to clone tooltip.


## [4.8.5] - 2020-01-29

### Fixed
- Reverted old behavior of DateFormatter.timezoneOffset, because the fix introduced in 4.8.3 was not correct. Use dateAxis.timezoneOffset instead.
- it was possible to make fixed only nodes of the first level of ForceDirectedSeries.
- when series is added/removed to a Serial chart, it adds/removes items only the specific item to/from the legend (if available), previously it used to invalidate entire legend which was not good for performance.

### Added
- timezoneOffset property added to DateAxis. Us it instead of DateFormatter.timezoneOffset if your dates are timestamps in your data and you want the chart to display the same dates no matter at which timezone the chart viewer is.

- If `ValueAxis` has its `calculateTotals = true` set, the axis will calculate not only `total` and `totalPercent` for related series' data items but also `sum` which is mathematical sum of source the values, rather than their absolute values.


## [4.8.4] - 2020-01-25

### Fixed
- Downgraded to TypeScript 3.6 to avoid the [breaking change](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#class-field-mitigations) in troduced in TS 3.7.


## [4.8.3] - 2020-01-24

### Added
- New `ValueAxis` setting: `extraTooltipPrecision`. Set it to a number of extra decimal places to use for numbers in axis tooltip on top of current axis label precision. Default is `0`.

### Fixed
- Syncing of `ValueAxis` grid improved.
- Using `timezoneOffset` was incorrectly affecting labels of `DateAxis`.
- If `MapChart` was initialized in a hidden container, subsequent `zoomToMapObject()` calls were zooming incorrectly.


## [4.8.2] - 2020-01-23

### Added
- `TreeMap.homeDataItem` getter added.

### Fixed
- Sometimes labels were not being truncated properly.
- `ValueAxis` with values <1 might not display labels (since `4.8.1` only).
- Axis syncing was not working on initial view if no animated theme was used.
- Sometimes undefined variables were being restored with default state where they shouldn't. This was introduced in `4.8.1`.


## [4.8.1] - 2020-01-22

### Added
- New setting `syncWithAxis` added to `ValueAxis`. Use it to sync grid between two or more axes. Set it to a reference of another `ValueAxis`, the one you need to sync grid with. [More info](https://www.amcharts.com/docs/v4/concepts/axes/value-axis/#Synchronizing_grid).

### Changed
- When default state is restored it will not set properties with `undefined` values as well. It used to ignore those.
- `XYCursor` will now take its `behavior` logic into account when calculating if it has moved or not. For example, if `behavior == "zoomX"` it will only measure horizontal distance when determining if cursor has moved or not.

### Fixed
- `Annotation` plugin: setting `currentTool` property was not working for `"line"` and `"arrow"`.
- Sometimes element properties were not being restored to their original values when responsive rules were applied.
- Sometimes some bullets on a `TreeMap` were not being shown back on after drilling bacup to top level.
- Setting `fontSize` on a `ValueAxis` was resulting in an error.


## [4.8.0] - 2020-01-16

### Added
- `scrollable` (default: `false`) property added to `Legend`. If the legend is positioned left/right and items do not fit in the available height, the scrollbar will appear automatically. In case legend is positioned at the top/bottom, you must set `maxHeight` for the legend and if items do not fit in this height, the scrollbar will appear.
- `Annotation` plugin: added new property `useMenu`. If set to `false`, plugin will not add any items to or create export menu. It means that annotation functionality will be available only via its API.
- `Annotation` plugin: added arrow tool support.

### Changed
- Layout algorithm of `Legend`'s' item changed and made better. Labels are properly truncated if they do not fit. Alignment of value works fine.
- When `Legend`'s position is `"left"` or `"right"` it no longer fixes its width at 200px width, but sets `maxWidth` to 220. This means that legend will take only as much width as it is necessary to accommodate its contents, which usually results in more space for chart itself. Set `maxWidth` to `undefined` if you want all the labels to be displayed and not to be truncated if they don't fit.
- When `Legend`'s position is `"left"` or `"right"` it automatically sets `maxColumns` to `1` (one) so that legend items would be arranged in one column only. You can change this setting if you need more columns (you should do this after the position is set).
- Setting `focusable = true` on an element will now automatically set `tabindex = 0`. This is required for some browsers (FF) for elements to be focusable. This means that a bunch of elements that are focusable by default (legend items, grips, buttons, etc.) will now have `tabindex` set automatically as well.
- Default for `Label.ellipsis` (used when truncating texts) was changed from "..." (three dots) to "…" (
Unicode Character 'HORIZONTAL ELLIPSIS'; U+2026).
- `Label` wrapping will now try not to split strings on dots where there are no whitespace afterwards, e.g. "55.5%".

### Fixed
- Axis fills were not measured properly after chart was resized and this could result in a tooltip to be displayed in an incorrect position.
- `valueLabels` of a `Legend` were not displayed if set directly on `valueLabels.template.text`. They were dispalyed only if set on `series.legendSettings.itemValueText`.


## [4.7.21] - 2020-01-10

### Added
- `updateStacking()` method added to `XYSeries`. Must be called if some stacking properties are changed by `stacked` stays at `true`.
- `"hidden"` added to `SunburstChart`'s `dataFields` to enable pre-hiding certain slices.

### Fixed
- Disabled series' legend marker was being reset to default view if related series visual settings changed.
- Changing data on chart with hidden stacked series was resulting in incorrect stacking.
- `XYChart` was not updating value axis' `min`/`max` if series was removed.
- If a cursor was moved via API using `"hard"` sticking option, the cursor could animate to some wrong position if clicked outside plot area.
- Animating from `Percent` to number or vice versa was not working at all, e.g. when state was being applied. It will now just flip to the final value without animation.


## [4.7.20] - 2020-01-08

### Fixed
- Changing data for a chart with `DateAxis` and `groupData = true` and custom `baseInterval` was resulting the grouping not to working.
- Changing colors and some other visual properties of a series after the chart was inited was not affecting `LineSeries` and `ColumnSeries`, as well as their legend markers.
- Sometimes the active tooltip of the chart was hidden even though it should remain visible (if some other sprite was hidden at the moment).


## [4.7.19] - 2020-01-07

### Added
- `Annotation` plugin: Added experimental setting `autoSize` (default: `false`). If set to `true`, it will try to relocated annotations relatively to chart size when it changes.

### Fixed
- Changing `fill`/`stroke` property with a `Color` with non-integer alpha was resulting in either fully opaque or fully transparent color.
- Sometimes ordering of columns of `ColumnSeries3D` was off.
- `XYSeries` on super-wide/tall charts (more than 100K pixels) were being distorted.
- `Regression` plugin: Updating data directly for regression series was not being properly invalidating it.
- Toggling `groupData` on `DateAxis` from initial `false` to `true` after the chart was inited was not working.
- Toggling `groupData` on `DateAxis` from initial `false` to `true` was resulting in icorrect `ValueAxis` scale.
- A tooltip used to remain visible after disposing sprite, if it had a tooltip shown because of `alwaysShowTooltip = true`.
- Events `datavalidated` and `beforedatavalidated` were not being fired if data was being updated to an empty array.
- Toggling `stacked` from `true` to `false` on `XYSeries` was not working properly.
- `Component.removeData()` was causing all the data to be invalidated which caused some wrong behavior.
- If some format changed (number formatter) you must now call `invalidateLabels()` in order for the new format to be applied.
- `DurationAxis` now animates newly added data in the same way as `DateAxis` does.
- Adding/removing multiple series at once to/from `XYChartScrollbar` could result error.


## [4.7.18] - 2019-12-24

### Added
- New property `maxTooltipDistance` added to `XYCursor`. Set it to a numeric value to limit display of tooltips from closest series only.

### Fixed
- Tooltips were not displayed on non-measured sprites.


## [4.7.17] - 2019-12-22

### Added
- `maskBullets` added to `XYSeries` for a possibility to set it on individual series rather on all chart.

### Changed
- Changed `am4core.type.is` to `am4core.is`. This fixes a circular dependency issue.
- `centerMapOnZoomOut` of `MapChart` will kick in on `zoomLevel < 1.5` for a better UX.

### Fixed
- Mouse wheel behavior on `XYChart` improved.
- Stacked series of a chart with multiple `ValueAxis` were not properly sorted.
- Some issues with hiding tooltips while chart is zooming fixed.
- Chart with rotated axis labels of Y axis could go into SO in some rare cases.
- `SankeyDiagram` with a single level and animated theme was not displaying links.
- Some min/max issues with grouped data on `DateAxis` fixed.


## [4.7.16] - 2019-12-18

### Added
- `hideTooltipWhileZooming` (default `true`) property added to `XYSeries` and `Axis`. It will hide respective tooltips while chart zoom animation is playing.
- `customValue` data field added to `XYSeries`. Useful if you want to show (in a tooltip for example) some custom value when data is grouped and you need an aggregated numeric value that is not other than one of the Series' data fields.
- All the custom fields from chart's raw data are copied into grouped data item's `dataContext`. This allows referencing to custom fields via text placeholders even in aggregate data items when data grouping is enabled.

### Changed
- Accessibility: Default `role` for chart changed to `region`.

### Fixed
- Accessibility: `Scrollbar` and its elements now set required attributes like `aria-orientation`, `aria-controls`, `aria-valuenow`, `aria-valuetext`, `aria-valuemin`, and `aria-valuemax`.
- Annotation plugin: The elements that went outside of the chart area were not being properly clipped.
- `XYChartScrollbar` was not inheriting locale from parent chart.
- Sometimes grid lines (and some other lines) were blurry.
- Tooltips of an `XYChart` with stacked axes could be positioned incorrectly.


## [4.7.15] - 2019-12-16

### Added
- `notAllowed` added to [`MouseCursorStyle`](https://www.amcharts.com/docs/v4/reference/mousecursorstyle/).
- `PieSeries`, `FunnelSerries`, `PyramidSeries`, and `PictorialStackedSeries` will now use absolute values for their slices (good if you have negative values).
- [`positionToCoordinate()`](https://www.amcharts.com/docs/v4/reference/axis/#positionToCoordinate_method) method added to `Axis`.
- Added `index` as second parameter to [`List.each()`](https://www.amcharts.com/docs/v4/reference/list/#each_method) method.
- `min` and `max` adapters added to `ValueAxis`.

### Changed
- Icons in `ExportMenu` now have `box-sizing: border-box` set in default CSS to make icons play nice(er) with external CSS.
- Popup now has a tiny strip on top of it which can be used to drag it (much like regular windows in your OS), instead of the whole body of popup being draggable.
- Popup will now use theme colors for backgrounds/text.

### Fixed
- The `List.each` method was missing an `index` argument for the callback.
- Links and other interactive elements in popups are now clickable.
- Labels in `PieSeries` could sometimes overlap if animated theme was not used.
- `DateAxis` with `groupData = true` and `"average"` as group field was now shown properly if data had gaps.
- `AxisRendererRadial` (`RadarChart` uses it) was not paying attention to `tick.location` property.


## [4.7.14] - 2019-12-10

### Fixed
- valueAxis could be shown zoomed-in if series were added later in some rare cases.
- strokeLinecap and strokeLinejoin was not copied to Legend markers from Series.
- Some charts were not displaying after css-element-queries dependency update, temporary downgraded css-element-queries.
- Sometimes if using imagesToConnect with MapLine of MapLineSeries, the lines were not drawn if the imagesToConnect was set initially and not after the series initialized.

### Added
- A possibility to set individual startAngle and endAngle on Pie Series added.
- You can now use baseValue adapter on ValueAxis.

## [4.7.13] - 2019-12-07

### Fixed
- Since last release only - min and max were not updated when scrolling chart with CategoryAxis.
- Map could zoom to incorrect rectangle when using chart.zoomToRectangle() method.
- DateAxis with groupData = true could hide series when zoomed in (when using big count of baseInterval, a very rare scenario).
- Tooltips of stacked series could show up in incorrect order in FireFox.
- Horizontal cone series could cut off part of the cone.
- If series were prehidden initially and shown later, the min/max was not adjusted.
- Grid/fills of the axis set as above were in wrong positions on stacked axes charts.
- ForceDirectedSeries now behaves better when nodes are hidden.
- In some cases connect = false set on StepLineSeries resulted error.
- If zoom-out button was initially disabled and enabled later, it was not shown.

### Added
- FunnelSeries ticks now will have horizontal part, consistent with PieSeries.
- heatLegend now supports reversedOrder = true.
- You can now set custom tooltipText on CategoryAxis.


## [4.7.12] - 2019-12-04

### Fixed
- Export menu was still shown data download options for HTML and PDF even if chart had no data.
- 3D columns with horizontally or vertically stacked axes were not positioned properly.
- Setting tooltipText on MapLine resulted stack overflow when hovered over line.
- Force-directed links were not showing tooltips.
- coordinateToPosition of AxisRendererY was not working properly if axis was zoomed-in.
- Value axes of a XY chart might appear zoomed-in after chart.invalidateData() was called or after series were added to the chart after init.

### Added
- horizontalMouseWheelBehavior with options "zoomX" | "zoomY" | "zoomXY" | "panX" | "panY" | "panXY" | "none" added to XYChart. Will work with both horizontal scrollers (if available) and two finger-horizontal swipe on the touchpad.
- centerMapOnZoomOut added to MapChart, with default value true.


## [4.7.11] - 2019-11-26

### Fixed
- Visual glitch with `ColumnSeries3D` used in a stacked axis scenario fixed.
- `PercentSeries` was sometimes jumping over 2 colors in `ColorSet`.
- Fixed possible compilation issues with some configurations.


## [4.7.10] - 2019-11-15

### Added
- Global method `am4core.system.softInvalidate(chart)` added. Call this method if you update data or config of a chart that is in hidden container, after revealing the container, so that labels and possibly other elements can correctly arrange themselves.

### Fixed
- JSON config `MapChart` was breaking on geodata parsing since last release (4.7.9).
- Sometimes `MapChart` used to zoom to a wrong position when using `zoomToMapObject()` method (happened if pan inert animation was not finished at the moment of the function call).
- `Container`'s "grid" layout was incorrectly positioning items if one of its children was disabled.
- Creating a standalone series object (without assigning it to a chart) was resultin in a JS error.


## [4.7.9] - 2019-11-14

### Added
- New `Sprite` property: `showTooltipOn`. Available options: `"hover"` (default), `"hit"`, and `"always"`.
- `ignoreZeroValues` added to `PercentSeries` (default: `false`). If set to `true` it will not show slices with zero values.

### Changed
- `Sprite` property `alwaysShowTooltip` is now being deprecated in favor of `showTooltipOn = "always"`.
- In `WordCloud` words connected with a dash without spaces will not be treated as a single word, e.g. "76-ers" is now a single word rather than two separate words "76" and "ers".
- JSON config based charts will now fail with a critical error if there's incorrect `type` specified for one of the objects.

### Fixed
- Initial chart responsive rules were sometimes not being applied.
- When `MapChart` was zoomed/panned, "always-on" tooltip were remaining in the same place.
- HTML labels with `maxWidth` and `wrap` set were not being sized correctly.
- Sides of `Column3D` were not being colored properly when `fill` was being set via `propertyFields` and string-based hex color codes were used in data.
- After click on chart with `XYCursor` that `behavior = "select*"` its `xRange` and `yRange` was not being reset and could show ranges from previous selection.
- `XYCursor` will now respect order of series when showing their tooltips if they share the same value.
- Tooltip position of rotated and/or scaled sprites was incorrect.
- Changing series of `XYChartScrollbar` was not working properly (old series could remain or new series were not appearing).
- `PictorialSeries`, and `PyramidSeries` were not working properly with slices with `<= 0` values.
- When removing data from a chart using `addData(data, removeCount)`, chart was rmeoving data items from series which had data set explicitly.
- Bullets on a `RadarChart` could be displayed in wrong positions when zooming/hiding series.
- When minimizing series they could animate to incorrect minimum values and adjust min/max values.


## [4.7.8] - 2019-11-05

### Added
- `itemIndex` added to `AxisDataItem`. Shows current index of data item on the axis.

### Changed
- `extremeschanged` is now dispatched by `DateAxis` when the `min`/`max` are animating.

### Fixed
- Setting `maskBullets` on an `XYChart` will toggle on or off bullet masking dynamically.
- In some particular cases some Sankey nodes were drawn out of bounds.
- `behaviorcanceled` event of `ChartCursor` was not being fired.
- Regression plugin was failing when added to Series object that was not yet attached to a Chart.
- JSON config was failing where Label's `text` or `html` properties were being set to percent value.
- Toggling of `DateAxis.skipEmptyPeriods` was not working after the chart was already inited.


## [4.7.7] - 2019-11-02

### Added
- `NumberFormatter` now supports `numberFormat` in [Intl.DateTimeFormatOptions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat) objects. E.g. `chart.numberFormatter.numberFormat = { style: "decimal", minimumFractionDigits: 3 }`. [More info](https://www.amcharts.com/docs/v4/tutorials/formatting-date-time-and-numbers-using-intl-object/).
- New built-in pattern: `CirclePattern`.
- `PictorialStackedSeries` now supports `align`/`valign` settings, allowing controlling its position inside chart container.

### Changed
- Default pattern list in `PatternSet` is expanded and revamped for better look and increased contrast.
- Pattern elements are now centered, so they work better with `rotation`.
- `MapChart` now will shift zoom towards center gradually when zooming out.

### Fixed
- `getIndex()` method of `PatternSet` was always returning current pattern, not particular index.
- Sometimes Export's user-added `"data"` adapter was kicking in before amCharts built-in adapter, causing data edits to be overwritten.
- Built-in adapters (e.g. for export `"data"`) sometimes were being added multiple times.
- Export no longer errors out on pages with missing external CSS files.
- Using `addData()` on `PercentChart` was reusing colors from the beginning for the newly added slices.
- `SliceGrouped` on `PercentSeries` when used on a chart with responsive fetures enabled, could display labels of the hidden slices after chart resize.
- Issue with zooming `DateAxis` with single data item fixed (the single item used to disappear in certain cases).


## [4.7.6] - 2019-10-29

### Added
- Added more pre-set patterns to `PatternSet`, including one with circles.

### Changed
- Using `patterns` theme will no longer reset Series' colors.
- Using `patterns` theme now respects series' `fillOpacity` setting to set pattern background transparency.

### Fixed
- Formatted strings were being cut off at specific `\]]` character combination.
- `LineSeries` with `RectPattern` for a fill was failing on chart with a legend.


## [4.7.5] - 2019-10-26

### Added
- New theme: `microchart`. Automatically adapts all charts for very small containers.
- New theme: `patterns`. Automatically fills `ColumnSeries` and `PercentSeries` with distinctive patterns.
- New object `PatternSet` used in conjunction with `XYChart` or `PercentSeries` to auto-assign distinctive pattern fills.
- New property `patterns` on `XYChart` and `PercentSeries`.

### Changed
- `tooltipX` and `tooltipY` properties now can be set in `Percent` for relative positioning.

### Fixed
- Cursor on all-`ValueAxis` setups and behavior set to "zoomXY" was not working properly.


## [4.7.4] - 2019-10-22

## Added
- New global option: `am4core.options.viewportTarget`. If you are placing charts into a scrollable container and using `onlyShowOnViewport`, set this option to a reference to the container. The system will monitor both window and individual scroll of the container to know where to reveal the lazy-loaded chart.
- New `MapChart` property: `geodataNames`. It can now be used to automatically translate country names into multiple languages. Check out [usage instructions](https://www.amcharts.com/docs/v4/tutorials/using-map-country-name-translations/).
- `hideParentColumns` property added to `TreeMap`. If set to `true` columns of the parent series will be hidden when user drills-down into deeper levels.

### Fixed
- `ColorSet` was starting to generate grayscale colors at some point.
- Accessibility: Series that has items with roles "menuitem" will now have its role set to "menu" automatically.
- Series bullets were dislocated on `XYChart` with `DateAxis` and `dateFormatter.utc = true`.
- In some specific cases 3D columns used incorrect `zIndex`.
- Index of dataItem of `PercentSeries` could be `-`1 after first render.
- `yRange` of `XYCursor` was inversed.


## [4.7.3] - 2019-10-18

### Fixed
- `ColumnSeries` with `simplifiedProcessing = true` setting was sometimes producing visual glitches.


## [4.7.2] - 2019-10-18

### Added
- `RadarColumn` now supports `width` adapter (the adapter should return `Percent` object).

### Changed
- `minWidth`/`minHeight` set on Axis to 0.0001 to avoid ready event to be not called on super small divs.

### Fixed
- A link between two fixed `ForcedDirectedTree` nodes was not visible.
- If `maxZoomCount` was set on a series which was used for `XYChartScrollbar`, scrollbar series was zoomed-in.
- `PercentChart`'s legend, if placed to an external div could loose text formatting after data update.
- `gridType = "polygons"` of `RadialAxis` was not working.
- Label of `PinBullet` was not being cloned.
- `rangeChangeEasing` function was not being passed to `ValueAxis` min/max animation which resulted in some unwanted animation effects when min/max of the axis changed.


## [4.7.1] - 2019-10-16

### Added
- Two additional auto-calculated values (used in `valueXShow` and `valueYShow` data fields) added: `startChange` and `startChangePercent`. Shows change from starting value of the first data item in series.

### Changed
- Animated theme: Default values for `rangeChangeDuration` and `interpolationDuration` changed to `500` (was `700`). Makes zooming animations more snappy.

### Fixed
- Data item grouping was sometimes producing visual anomalies when multiple data sets were being loaded /set to chart/series asynchronously.


## [4.7.0] - 2019-10-14

### Added
- Dynamic data item grouping capabilities added to `XYSeries` in `DateAxis` + `ValueAxis` setups. [More details](https://www.amcharts.com/docs/v4/concepts/axes/date-axis/#Dynamic_data_item_grouping).
- Export: Two new data export options "HTML" and "PDF" (exports data as a table in PDF).
- Export: Ability to include data table into PDF export (`addData` option in PDF options).

### Fixed
- Regression plugin: Plugin was not generating proper regression lines if data was loaded via `dataSource`.
- Fixed number formatting for data exports on non-default-locale charts.
- `min`/`max` of `ValueAxis` was not always correct when series showed not actual but calculated values using `valueYShow`/`valueXShow` data fields like `"sum"`, `"change"`, or `"changePercent"`.


## [4.6.9] - 2019-10-08

### Fixed
- Accessibility: `itemReaderText` on `XYSeries` (and all inheriting series types) now respects value set from user code.
- Accessibility: Default `role` for chart changed to `widget`.
- Accessibility: `Axis` has now `readerHidden = true` set by default, to prevent screen readers from reading out useless numbers.
- Accessibility: `readerTitle` was not being populated by data item data via curly bracket data placeholders.
- Accessibility: Bullets were ignoring Series' `skipFocusThreshold` setting.


## [4.6.8] - 2019-10-07

### Added
- New `Export` property: [`validateSprites`](https://www.amcharts.com/docs/v4/reference/export/#validateSprites_property). It's an array you can push any `Sprite` to it. When export starts, it will check if those elements are not invalid and will await for them to be ready. This is useful if you need to do any modifications to your chart for export.
- New option for CSV and XSLX export options: `pivot`. If set to `true`, will "pivot" the data so that firsst column is field names with values lined up horizontally in rows.
- New property on `NumberFormatter`: `smallNumberThreshold` (default `1`). You can now set what is considered a "small number" when applying small number prefixes if `"a"` format modifier is used.

### Fixed
- If `ForceDirectedTree` was used with `am4core.options.onlyShowOnViewport = true`, the forces on links were not being calculated properly, resulting in incorrect layout.
- JSON: String dates will now be correctly parsed using `DateFormatter` in axis ranges' `date` and `endDate` properties.
- `WordCloud` was not properly parsing Korean text.
- If `MapChart` was zoomed in while still playing pan inertia animation, it produced a jerky effect.


## [4.6.7] - 2019-10-05

### Added
- `paddingRadius` added to `ForceDirectedNode`. Allows having some extra free space around bubbles.
- New event on all `Sprite` elements: `parentset`. Triggers whenever element's `parent` is set.

### Fixed
- `MapChart` background was not being updated if map projection was changed after init.
- Axis' tooltip was not changed if user rolled over the axis, rolled out and then rolled over it again on the same axis item.


## [4.6.6] - 2019-10-04

### Fixed
- Language setting was being ignored in `DateAxis` after previous release.


## [4.6.5] - 2019-10-02

### Fixed
- Position of the bullets of a series with date-based axis could be incorrect in some sepecific cases.
- Some minor performance improvements.
- Map polygon was not updated if `mapPolygon.multiGeoPolygon` was changed after the series was already inited.
- Some minor issue with `XYCursor` panning fixed.


## [4.6.4] - 2019-09-29

### Added
- Ukrainian translation (uk_UA).
- `DataSource` now supports binary loading using `responseType = "blob"`.

### Fixed
- Setting `exporting.dateFormat` resulted in "Invalid date" as a column name for date/time columns when exporting to XLSX.
- Performance improved, especially data-parsing.
- When panning `XYChart`, the chart will round selections respecting `startLocation` and `endLocation` values of the Axis.
- First bullet of a series with `CategoryAxis` could be positioned incorrectly.
- Conflict between Annotation plugin and amCharts 3 Export plugin fixed.


## [4.6.3] - 2019-09-26

### Fixed
- `ColorSet` was now skipping the first (base) color if no theme or list of colors was specified.
- Setting axis `title` to a new `Label` object will now remove the previous title label.


## [4.6.2] - 2019-09-25

### Added
- New plugin: [OverlapBuster](https://www.amcharts.com/docs/v4/tutorials/plugin-overlap-buster/). Allows automatically "exploding" overlapping items such as bullets or markers for easier access to them.
- New property: `maxZoomCount` on `Component`. Use it to limit how many items such as categories or base intervals on axes can be shown at the same time.
- Added `riseFromOpenState`, `riseFromPreviousState`, `dropFromOpenState`, and `dropFromPreviousState` setters to `ColumnSeries`. You can use them to set states to `undefined` if you don't want them to be used.
- A possibility to make "fixed" `ForceDirectedTree` nodes added (via `dataFields.fixed`). Also it is possible to set `x` and `y` of such nodes using `series.nodes.template.propertyField.x` and `y`. [More info](https://www.amcharts.com/docs/v4/chart-types/force-directed/#Fixed_nodes).

### Changed
- Removed "GIF" option from the Export menu. Browsers don't know how to convert canvas to GIF, so it was falling back to exporting as PNG, making GIF option redundant.

### Fixed
- If chart's data source was initialized (which would happen by only accessing chart's `dataSource` property) and its `url` was not set, it was still trying to load and resulting in error.
- Formatting number with "b" modifier, was causing all numbers up to 1024 become zero.
- `ColorSet` with default (no) theme was generating colors from second in the list from `4.6.1`.
- Bullet positions were incorrect on `ValueAxis` with `baseValue` set to other than zero.
- Bullet positions with `DateAxis` could be incorrect in some cases.
- Title position of a cloned Axis was nor being positioned properly.
- Cursor was flickering if axis of a cursor had some padding set.
- Tooltip position of `MapImage` elements with `nonScaling = true` could be incorrect in some specific cases.
- Vertical axis break's fill might get out of sync with break lines if the width of a break was small.
- `RadarCursor` could show incorrect label if the chart had `CategoryAxis` with only 3 categories.
- Series was not redrawing properly if its axis range value changed.
- `PieChart` could show some labels out of chart area in some specific cases.


## [4.6.1] - 2019-09-18

### Added
- New property `unselectedOverlay` added to `XYChartScrollbar`. It contains a reference to `Sprite` element used as a "curtain" on unselected areas of the scrollbar. Use it to control dimming effect by using its `fill` and `fillOpacity` properties.
- Export: New option `crop` (default: `false`) added to `extraSprices` interface `IExportCanvas`. If set to `true`, it will crop extra elements to match height/width of the main chart being exported.
- Wherever "date format" can be set it now accepts in [Intl.DateTimeFormatOptions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat) format. E.g. `chart.dateFormatter.dateFormat = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }`.
- New property `intlLocales` on `DateFormatter`. Specifies list of locales to use if date formates are specified as `IntlDateTimeFormatOptions`.
- JSON: You can now set `parent` property of the elements by their `id` in JSON configs. E.g.: `scrollbarX: { parent: "aa1" }`.
- JSON: You can now set easing functions as strings in JSON config, e.g. `transitionEasing: "ease.cubicInOut"`.

### Fixed
- `TreeMapSeries` and `SunburstSeries` were not inheriting `numberFormatter` propertly from the chart.
- Removed a leftover `console.log()` call.
- Exporting no longer temporarily modifies the site's styles.


## [4.6.0] - 2019-09-12

### Added
- New plugin: [Timeline](https://www.amcharts.com/docs/v4/chart-types/timeline/). Please note it's a commercial plugin, which will need a separate license purchase if you want to remove the branding link on it, even if you have amCharts 4 license.

### Fixed
- `chart.svgContainer.autoResize = false` was being ignored.
- If data of chart with `CategoryAxis` had data items without a category value, the chart used to create one extra empty "category".


## [4.5.16] - 2019-09-04

### Fixed
- Data sources were not being disposed properly when chart was disposed.
- Adding series to an already inited chart was not showing the series.
- Fixed `StepLineSeries` glitch where base axis was not `CategoryAxis`/`DateAxis`.
- Title of a cloned X axis was being drawn above the axis labels.
- If all values of a `ValueAxis` data wehere the same and negative, the chart zoomed in incorrectly after init.
- Center-alignment of axis labels was not working.
- `maxWidth`/`maxHeight` set on column template of a `ColumnSeries` was not working properly if the size of a cell was less than `maxWidth`/`maxHeight`.


## [4.5.15] - 2019-08-23

### Added
- `hideSeriesTooltipsOnSelection` added to `XYCursor`. If set to `true` it will automatically hide cursor-initiated series tooltips when selecting with cursor (e.g. for a zoom).
- Properties `numberFields`, `numberFormatter`, and `numberFormat` properties to `Export`. Allows forcing certain number format for values listed in `numberFields` effectively converting them into strings.
- `snapToSeries` now supports `XYChart` setups where both X and Y axes are `ValueAxis`.

### Changed
- `ZoomControl`'s plus and minus button will not be exported to images anymore.

### Fixed
- When the chart with external data source and reload frequency set was disposed, the data source kept reloading the data.
- When Tooltip's `keepTargetHover` was enabled and hover moved from an element with tooltip content to an element without one, an empty tooltip was being shown.
- `SankeySiagram` with a lot of nodes was performing poorly on initial load.
- `TreeMap` could show bullets of multiple levels which could result overapping of bullets/labels.
- `MapLineSeries` with `imagesToConnect` were not updating if images changed their positions.


## [4.5.14] - 2019-08-11

### Added
- `mouseOptions` added to `Interactions`. For now it contains only wheel sensitivity setting, e.g. `mapChart.interactions.mouseOptions.sensitivity = 0.4`.
- `getPositionX()` and `getPositionY()` methods added to all axes. Returns relative position of a series data item on axis.

### Changed
- Series with `DateAxis` not as a base axis of a series (like gantt) will now animate similar to other charts.
- `SlicedChart` hidden labels arrangements adjusted.

### Fixed
- `ValueAxis` was incorrectly choosing min/max values for the data with very small values.
- `StepLineSeries` with `connect = false` and `autoGapCount > 1` was showing regular line series, not a step series.
- Chart with `DateAxis` which was not a base axis of a series and dates older than Unix Epoch (January 1st, 1970 at UTC) was incorrectly showing base of a series.
- `DateAxis` was not animating smoothly when adding more data.
- `ValueAxis` pre-zoom (on `ready` event) was not working properly.
- `fullWidth` cursor line was not reverting back if set to `true` and then back to `false`.


## [4.5.13] - 2019-08-06

### Fixed
- Sometimes `requestAnimationFrame` was being invoked even if all charts were disposed.
- Base grid was not displayed if `axis.renderer.inside = true`.
- Last tooltip might not be shown on `DateAxis` if it had multiple series and some of the series did not have data at the last date.
- Legend values were showing value of the pervious hovered data item on the dates which did not have any data.
- Changing base value of `ValueAxis` was not making the series to be redrawn.
- Sometimes `ValueAxis` was not adjusting `min`/`max` when a part of the `DateAxis` with series having no data at the selected period was selected.
- Sometimes columns or step line series could overlap if `baseInterval.unit = "day"` and `baseInterval.count > 1`.
- `XYChartScrollbar` axes were not handling changes of `min`/`max` of chart axes.
- Panning of `CategoryAxis` could result incorrect zoom in some cases.
- FireFox issue with multiple `PictorialStackedSeries` on the same chart solved.
- Cursor selection was disappearing when mouse was released (with `selectX`/`selectY`/`selectXY` cursor behavior).
- Tooltip of clustered columns was positioned incorrectly (always showing in the middle of a cell).


## [4.5.12] - 2019-08-02

### Added
- Now prints a warning if you do not dispose of the chart properly.
- New `am4core.disposeAllCharts` function.

### Changed
- JSON: Config processor will not overwrite target object if the `type` of the object set in config and one already existing matches.

### Fixed
- Fixing "Could not find root" error.
- JSON: declaring `hands` array before `axes` on a `GaugeChart` will not result in error anymore. This relates to JSON config only. In object-based setups, clock hands must still be defined **after** axes.


## [4.5.11] - 2019-07-31

### Added
- New `AxisDataItem` properties: `minPosition` and `maxPosition`. Enable controlling visibility of associated axis element (e.g. label, tick, grid). Overrides `minLabelPosition` and `maxLabelPosition`.

### Fixed
- `NumberFormatter` was sometimes susceptable to floating-point error when formatting percent formats (`#%`);
- Cursor hover was not working with shadow DOM.
- `DateFormatter` could sometimes parse string-based dates wrong when in UTC mode.


## [4.5.10] - 2019-07-29

### Fixed
- Sometimes setting `fill`/`stroke` to a non-opaque `Color`, alpha setting was being ignored.
- `PinBullet` (from Bullets plugin) was distorted if used with image since last release.
- Fabric dependency was causing errors on installation under some setups.


## [4.5.9] - 2019-07-24

### Added
- `above` property added to `AxisTick`, `Grid`, and `AxisFill`. Allows putting individual elements on top of the series even if all the other grids/ticks/axis fills are below them.
- `bullet` property added to `AxisDataItem`. Allows adding bullets to the axes. You can have both `AxisBullet` (new class) or a simple `Sprite` there.
- New element class `AxisBullet`. Use `AxisBullet` which is a container with a `location` property in case you want to adjust bullet location within cell.

### Fixed
- JSON: Series-bound axis ranges were breaking whole chart in JSON-based setups.
- In some rare cases `NumberFormatter` was suffering from floating point number precision issue when calculating big number prefixes.
- Updating data was causing Annotation menu item to duplicate.
- Exporting `extraSprites` with different positions didn't work.
- Responsive rules were not always kicking in on first load if there were multiple charts on the same page.


## [4.5.8] - 2019-07-19

### Added
- `wavedRight`, `wavedLeft`, `wavedTop`, and `wavedBottom` properties added to `WavedRectangle`. Allows to specify which sides of rectangle should be waved.

### Changed
- You can now avoid creating unused bullet for each data item of a series by setting `bullet.disabled = true` and then specifying `bullet.propertyFields.disabled = "fieldName"` where `fieldName` would be a field in your data specifying which bullets should not be disabled (`false` value).

### Fixed
- `FlagBullet` was overriding colors inside its class.
- `FlagBullet` now supports negative `poleHeight` (turns the flag upside down).
- Background of a `Container` did not have access to Container's data item so it was impossible to define background properties via `propertyFields`.


## [4.5.7] - 2019-07-18

### Added
- New plugin: [Bullets](https://www.amcharts.com/docs/v4/tutorials/plugin-bullets/). It's a collection of configurable shapes (stars, pins, flags, etc.) that you can use as chart bullets, map markers, and anywhere else.
- New `Tooltip` property: `showInViewport` (default `false`). if set to `true` it will not hide tooltips that point to an off-viewport location. It will be glued to the closes viewport edge instead.

### Changed
- Tooltip for `MapPolygonSeries` now has `showInViewport = true` set by default.

### Fixed
- Exporting to CSV with `dateFormat` set was causing "Invalid date" to appear instead of date column names (since 4.5.6).
- When `MapPolygonSeries` had only one item set in its `include` array, it was causing map to come up as empty in some cases.
- Charts were not accounting for their container padding/borders when measuring their own size, causing bigger charts then necessary.


## [4.5.6] - 2019-07-16

### Added
- New property on `Annotation` plugin: `data`. Allows getting serialized annotation data object, as well as setting it back to load annotations.

### Changed
- Annotation plugin will not create full Export menu if it wasn't explicitly created before.
- Tweaked CSS for `ExportMenu` to protect from icons getting small becuase of the page-wide CSS.
- When exporting data on chart with `exporting.dateFormat` set, the date/time fields in data will be formatted according to the set format.

### Fixed
- `XYChartScrollbar` with series attached to different `ValueAxis` were using same axis scale in the scrollbar.
- Using `wrap = true` on horizontal axis labels was resulting weird behavior when zooming in some cases.
- Export was not prioritizing menu item's specific options over generic format options.
- Auto-wrapped text was not retaining square bracket escaping (double bracket) for each subsequent line.


## [4.5.5] - 2019-07-12

### Added
- New property `updateCurrentData` added to `DataSource`. If set to `true` it will try to overwrite values (resulting in smooth animations) in current data rather than overwriting whole data set.
- Feature added back: Support of queued chart initialization. If enabled (`am4core.options.queue = true`) the chart will not start initializing until previous chart finishes.
- Feature added back: Support for delayed rendering. If enabled (`am4core.options.onlyShowOnViewport = true`) the chart will start rendering itself only when scrolled into view.
- New plugin: [Annotation](https://www.amcharts.com/docs/v4/tutorials/plugin-annotation/). Allows annotating charts using UI.

### Fixed
- Accessibility: The screen reader description for column/bullet/slice was not being added properly every time.
- On `RadarChart` data updates sometimes `ValueAxis` scale was not being calculated corrently.
- `alwaysShowTooltip` was not working properly in some cases.


## [4.5.4] - 2019-07-08

### Added
- `alwaysShowTooltip` property added to `Sprite`. Allows tooltip to be shown without the need for hovering/selecting an element.
- `NumberFormatter` now supports `"!"` modifier which works in conjunction with `"a"` and `"b"` modifiers. If used, formatter will force application of a prefix/suffix for values that do not fit into any of the defined prefix lists. This is useful in cases you want to format all of the values using same prefix, e.g. "B" and want even small values to be formatted as such (`500,000` formatted as `"0.5B"`).

### Fixed
- `CategoryAxis` tooltip could show incorrect category if its `renderer.tooltipLocation` was set to `0`.
- Memory leak which happened when disposing a chart with `XYChartScrollbar` with series added to it fixed.
- Some series stacking issues fixed.
- Issue with `baseDuration.timeUnit = "yyyy"` and `StepLineSeries` fixed.
- In some cases `DateAxis` tooltips would show empty near edge of the plot area.
- `CategoryAxis.indexToPosition` adjusted to work better with no default `startLocation` and `endLocation` values.
- `WordCloud` could go into stackoverflow if `minWordLenght` was set to a number which resulted in no words to appear at all.
- `ForceDirectedSeries` were resulting in JS error if inited in a hidden container.
- If an axis range was made invisible by setting its `visible = false`, and then visibility was set back to `true` again, axis range was not shown.
- JSON: entries of type `OrderedListTemplate` or `SortedListTemplate` was not being processed correctly as templated lists.
- Legend items were still focusable/togglable via keyboard even if `clickable`/`focusable` on their respective containers were set to to `false`.


## [4.5.3] - 2019-06-18

### Added
- `"up"`, `"down"`, `"left"` and `"right"` options added to `Tooltip.pointerOrientation`. Allows forcing constant position/orientation of the Tooltip. Note, the tooltip might go out of div/screen boundaries when using these new orientations.
- New property added to `SliceGrouper`: `groupProperties`. It's an object comprising by key/value pairs to apply to a "group slice", e.g. `grouper.groupProperties.fill = am4core.color("red")`.
- It was impossible to reuse single pattern for multiple `Sprite` elements, as disposing one was resulting in pattern to be disposed as well.

### Fixed
- `hideOversized` was being ignored for HTML-based labels.
- `PieChart` series' `legendSettings` were shared across all series; it was impossible to set different `valueText`.
- `CategoryAxis` with HTML labels could in result excessive white space at the bottom of the chart.
- In some cases patterns set as `Sprite`'s fills using `fill` adapter were not displayed.
- When calculating totals on a Series with all zero values, `percent` was not being calculated. It will now have a zero.


## [4.5.2] - 2019-06-14

### Changed
- Deferred/queued chart initialization functionality is disabled completely for now as it's causing issues in some setups. Functionality will be re-introduced at some later version.


## [4.5.1] - 2019-06-14

### Changed
- Initial animations for charts with deferred initialization (`am4core.options.onlyShowOnViewport = true`) will not be played for now. Another fix is coming.

### Fixed
- In some HTML configurations layout of the labels might be off since last update.


## [4.5.0] - 2019-06-14

### Added
- Support of queued chart initialization. If enabled (`am4core.options.queue = true`) the chart will not start initializing until previous chart finishes.
- Support for delayed rendering. If enabled (`am4core.options.onlyShowOnViewport = true`) the chart will start rendering itself only when scrolled into view.

### Changed
- Default CSS for a `Popup` now has text color set to ensure it is visible on default background.

### Fixed
- `dataContext` of `ForceDirectedNodeDataItem` was not being populated correctly.
- `MapPolygonSeries` was not being displayed properly if GeoJSON contained a single very small polygon.
- Tooltips now work correctly when a chart is contained within the shadow DOM.
- `rtl` inheritance was not working properly on some elements, e.g. axis tooltips.
- None of the `Responsive` events were being triggered.
- JSON: It was not possible to set `XYSeries.baseAxis` using axis' `id`.
- `LineSeries` was being cut off if div of a chart was more than 20K pixels width/height.
- When axis was disabled (`axis.disabled = true`) its ticks and grid remained visible.
- If a chart had series with bullets and `minBulletDistance` set and the chart was resized so that bullets had to be hidden, some of the bullets remained visible.
- `openCategoryX` and `openCategoryY` data fields were not working properly on `XYSeries`.
- If `XYChart` had stacked series and series had both possitive and negative numbers, series were stacked incorrectly if some of the series were hidden.
- `MapChart` was not adjusting its size to the container in some specific cases.
- Some performance improvements with `series.connect = false` and a lot of missing values.
- `Rectangle3D` was not copying side's properties when cloning.
- `ForceDirectedLink`'s data item was not properly set. It is set to target's data item now.
- `MapChart` was not displaying maps of very small countries properly.


## [4.4.10] - 2019-05-28

### Fixed
- Disposing top-most stacked series was causing a JS error.
- If `TreeMap` top level had one node only, zoom-out button was not shown after drill-down.
- Bullets were not shown on series on initial render if no animated theme was used (since last release only).


## [4.4.9] - 2019-05-28

### Added
- `startIndex` property added to `ColorSet`. This allows to specify from which color charts like `PieChart` should start when picking colors for slices.
- `excludeFromTotal` property added to `XYSeries` (default: `false`). Allows excluding values of particular series when caluclating totals.
- `includeRangesInMinMax` property added to `ValueAxis`.

### Changed
- The chart will now error out if trying to instantiate generic classes like  (`Chart`, `Axis`, `Series`).
- Legend in `TreeMap` was completely revamped. Previously it used series as data, but as series were not always created, it failed to render items in some cases. Now it uses `TreeMapDataItem` of `TreeMap`.
- `TreeMap` legend will now show items of first level which has more than one data item.
- `dataContext` of `ForceDirectedNodeDataItem` will now have the same object as target node's.

### Fixed
- `responsive.useDefault = false` was being ignored.
- `DateAxis` with hourly-based data could render some of the labels using date formatter of a changed period even if the period didn't actually change.
- In some cases `MapChart` could interfere with event objects of other charts on the same page, even when not directly interacting with it.
- If `baseInterval` of `DateAxis` didn't have `count` set, the chart failed to render.
- Setting data on hidden Series resulted tooltips on invisible bullets to be shown.
- `WordCloudSeries` with single label or several labels with the same values was displaying labels using `minFontSize`.
- `axis.createSeriesRange()` was not working with `RadarColumnSeries`.
- When data was added to a chart, series could flicker at incorrect position before rendering properly. Also the same could happen when zooming chart (it was only visible if animated theme was not in use).


## [4.4.8] - 2019-05-23

### Added

- `linkWithStrength` added to `ForceDirectedSeries`.
- `linkWith(node, strength)` method added to `ForceDirectedNode`. Allows adding links without revalidating whole data.
- `unlinkWith(node)` method added to `ForceDirectedNode`.
- `expandAll` property added to `ForceDirectedNode` (default: `true`). If set to `false`, only a single level of children will be expanded on click/tap.

### Fixed
- Links created using `linkWith` data field were not using any strength setting, affecting the layout.
- Some problems with `maxLevels` on `ForceDirectedSeries` solved.


## [4.4.7] - 2019-05-21

### Changed
- Export: Children columns on hierarchical charts (`TreeMap`, `Sunburst`, `ForceDirectedTree`) are no longer exported to "flat" formats (CSV, XLSX).


### Fixed
- `keepTargetHover` was hiding tooltip when transiting hover from one `Sprite` to another.
- Firefox was not displaying texts along paths on a page with `base href` set, due to Firefox [bug](https://bugzilla.mozilla.org/show_bug.cgi?id=455986).
- `SunburstSeries` with 0 values were producing a JS error.
- Width (or height if vertical) of `Scrollbar`/`Slider` was always 100%, even if it was set to less than 100%.
- `WordCloud` with long labels that did not fit into container could get into infinite loop and never get drawn.
- If a lot of `GaugeChart` instances with axis bands were rendered on a single page, stack owerflow error could happen.
- Adding data to a chart with `XYChartScrollbar` and series in the scrollbar forced full-redraw of scrollbar chart which was making it blink.
- Z-indexing of `ColumnSeries3D` columns was incorrect in some cases.
- Tooltip of a 3D slice was not in the center of a slice.
- Changing of Series' name was not propagating to legend.


## [4.4.6] - 2019-05-14

### Fixed
- Vertical/horizontal bullet positions on `ColumnSeries` were broken since `4.4.5`.


## [4.4.5] - 2019-05-13

### Changed
- Exporting chart data to JSON format now respects `dataFields` setting.

### Fixed
- Setting `showSystemTooltip = false` on a `Scrollbar` now correctly disables tooltips on its thumb and grips.
- When data for `ForceDirectedSeries` was changed for the second time, the old links remained visible.
- Initial scatter of `ForceDirectedSeries` nodes reduced. Results in a better initial animation.
- Adding data using `addData()` method to a chart with `XYChartScrollbar` was resulting data to be added twice.
- With some special combination of axes config `XYChart` sometimes could fall into infinite loop.
- Some JS error when converting coordinates out of bounds of AlbersUSA projection fixed.
- Tooltip bounds were not being copied when cloning a `Tooltip`.


## [4.4.4] - 2019-05-08

### Fixed
- When data for `ForceDirectedSeries` was changed the old links remained visible.
- Legend with custom data was causing a JS error.
- Changing data during `rangechangeended` with `skipEmptyPeriods` enabled was triggering "Cannot read property 'getTime[ of undefined" exception.
- Slices of `SunburstSeries`, and columns of `TreeMapSeries` were not taking `propertyFields`/`configField` from data.


## [4.4.3] - 2019-05-06

### Added
- `Regression` plugin: two new settings - `simplify` (simplifies output data for faster performance) and `reorder` (orders data in a horizontal linear fashion for scatter plots).
- `arrangestarted`, `arrangeended`, and `arrangeprogress` events added to `WordCloudSeries`. Allows showing preloader while building the chart.

### Changed
- `keepSelection` behavior extended. Now it will keep `ValueAxis` selection while scrolling a perpendicular `DateAxis` or `CategoryAxis`.

### Fixed
- `Regression` plugin: fixed issue with gaps in data.
- Panning chart with `CategoryAxis` out of range, the axis could pan back with one less category in the range when released.
- In some cases labels with `bent = true` on `AxisLabelCircular` were positioned incorrectly on `RadarChart`'s Axis ranges.
- Safari was not displaying base grid of Y axis in some cases.
- Chart could freeze if there was a very small difference between minimum and maximum values of `ValueAxis` (less than 0.00000001).
- If `WordCloud` was hidden while arranging words, and then unhidden, the words would overlap in some cases. Arranging of words now stops if container is hidden during the process and resumes when it is unhidden.
- 3D columns were cut off on IE if the size of Chart container changed after the chart was already build.
- In some setups with `<base href>` some elements were being drawn incorrectly.


## [4.4.2] - 2019-05-02

### Added
- New property for `Label`: `baseLineRatio` (default `-0.27`) controls how "base line" for a label is calculated, and affects positioning of text. The default might not work for all fonts, so this setting can be used to adjust it for precise positioning.
- New event for `Sprite`: `"dragged"`. It kicks in right after `"drag"` and can be used to manipulate or correct element's position, which might not be possible using `"drag"` which has built-in position-altering handlers.

### Fixed
- Export to SVG was not working on Firefox.
- Some touch issues wit iOS Safari fixed.
- `ValueAxis` could display non-rounded numbers (caused by floating point problem) sometimes.
- `maxPanOut` of `MapChart` was being ignored.
- Chart scrollbar was not being zoomed out when data of a chart changed.
- `RadarChart` with multiple `RadarColumnSeries` with Y as base axis was displaying columns of a 2nd+ series from wrong position.
- `chart.dispose()` with a lot of data was very slow. Now it's super fast.
- Zoom with mouse wheel was buggy when zooming already zoomed-in `XYChart`.
- Gant chart was not updating columns when `chart.invalidateRawData()` was called.
- Issue with some `propertyFields` set on a `LineSeries` with no data fixed.
- Reseting `relativeRotation` of `AxisLabelCircular` to `undefined` didn't work.


## [4.4.1] - 2019-04-22

### Changed
- Now when using `CSVParsing` for parsing external data, `skipRows` will kick in first, removing X rows from the beginning of data, then `useColumnNames` will use the first row of what's left.

### Fixed
- JSON: Specifying language locale as string (i.e. "fr_FR") now works in JS setups, provided appropriate language file is loaded.
- Grab/Grabbing cursor was not appearing on Scrollbars on Firefox.
- `MapChart` used to pan itself when it was zoomed in, `tapToActivate` enabled, and was tapped.
- Hovering mouse cursor over an `XYChart` while it was initializing could sometimes result in a JS error.
- Issue with `DateAxis` and `Series` not having dates at certain data items fixed. It was cousing problems with multiple date axes mostly.


## [4.4.0] - 2019-04-17

### Added
- Charts now have new property - `tapToActivate` (default: `false`). If set to `true` it will not react to touch drag gestures until user taps on the chart. [More info](https://www.amcharts.com/docs/v4/concepts/touch/).
- New element on charts: `dragGrip`. It's a grip that, when enabled, will allow scrolling the page even if the chart functionality does not permit it, e.g. with chart cursor or `MapChart`. [More info](https://www.amcharts.com/docs/v4/concepts/touch/).

### Fixed
- `NumberFormatter` in charts was ignoring locale settings.
- `TreeMap` could crash across data update.
- In some situations `XYCursor` with `"panX"` behavior would not allow panning the chart completely to the edge of data.


## [4.3.15] - 2019-04-16

### Added
- `startendchanged` event added to `Component`. Fired when `start` or `end` is changed. Unlike `startchanged`/`endchanged` this event is fired not immediately but at the end of a cycle.

### Changed
- `Sunburst` chart's defaalt `radius` set to `95%`.

### Fixed
- `TreeMap` could produce a JS error if data was changed during interaction with the map.
- If `Component.addData()` called before chart was initialized, error happened.
- 3D columns with reversed base axis had wrong z-indexes.
- `DateAxis`-based chart with single data item got into infinite loop if `startLocation` and `endLocation` were set to `0.5` or `strictMinMax` was set to `true`.
- Tooltips of series could overlap if series used different `DateAxis` axes.
- Chart with multiple `DateAxis` and no animated theme was not properly zooming with scrollbar.
- Implemented a workaround for MSIE which was not updating series masks on chart resize.
- Disposing `XYCursor` will now remove series/axes tooltips that might be currently displayed because of it.


## [4.3.14] - 2019-04-13

### Added
- New `SliceGrouper` setting: `syncLegend` (default `false`). If set to `true` the legend will be updated dynamically to show only those slices that are currently visible.
- Plugin `Regression`: new property `result` will store all the results including formula and caculated points.
- Plugin `Regression`: plugin now has `events` which can be used to attach event handlers such as `"processed"`.

### Fixed
- `Animation` was failing when source value was string (i.e. "auto") and target value was number (i.e. 10).
- JSON: Object entries in a `List` were not being their properties set.
- `MapChart` sometimes could place Map images at incorrect positions.


## [4.3.13] - 2019-04-10

### Fixed
- Using `propertyFields.url` was forcing pointer cursor on all objects from the same template, even if they did not have url set.
- Memory leak with dynamic changes of data on `TreeMap`.
- `getPoint()` method of `XYSeries` is now public.
- Setting `startAngle`/`endAngle` before adding `PieSeries` was causing it to not be drawn.
- Performance tweaks to 3D columns.


## [4.3.12] - 2019-04-09

### Changed
- Series' `bullets` now accepts objects that are simple `Sprite` elements, not just `Bullet` types. This means you can add `Circle` as bullet (or any other element), to dramatically improve performance on bullet-heavy charts.
- Default value of `hideOversized` for `LabelBullet` changed to `false`.

### Fixed
- Dramatically improved performace of `CategoryAxis`.
- `SliceGrouper` plugin will now not add "Other" slice if there are no slices below threshold or no data at all.
- `SliceGrouper` now supports dynamic data updates.
- `ColorSet.reuse = true` was working incorrectly for `PercentSeries`.
- `timezoneOffset` property of the Date Formatter was causing all minutes to be formatted as zeroes.


## [4.3.11] -2019-04-08

### Added
- New plugin: `SliceGrouper` (allows automatically grouping small slices on any `PercentSeries`, e.g. Pie, Funnel, Pyramid, or Pictorial Stacked). [More info](https://www.amcharts.com/docs/v4/tutorials/plugin-slice-grouper/).

### Changed
- Changed `centerStrength` default was changed to `0.8` in `ForceDirectedSeries`.

### Fixed
- Zero-value 3D columns were not visible on `DateAxis`.
- `FunnelSeries`'' labels were out of bounds sometimes.
- `Regression` plugin was not working when data was set directly on Series.


## [4.3.10] - 2019-04-08

### Changed
- Corner radius is not supported anymore on 3D slices. A sacrifice towards performance.

### Fixed
- Performance of `PieChart3D` improved dramatically.


## [4.3.9] - 2019-04-06

### Added
- `ForedDirectedSeries` properties `minRadius` and `maxRadius` can now be set in `Percent`.

### Changed
- Default value of `ForceDirectedLink.strength` changed to `1` to avoid initial shaking.
- Default value of `ForceDirectedSeries.manyBodyStrength` changed to `-15`.
- Default values of `ForceDirectedSeries` properties `minRadius` and `maxRadius` changed to `1%` and `8%` respectively.

### Fixed
- In `ForedDirectedSeries` the same color was being reused for top-level node and first child node.
- It was impossible to set colors of `ForedDirectedSeries` data items via data.
- `ColorSet` setting `reuse = true` was acting incorrectly.

## [4.3.8] - 2019-04-05

### Added
- New chart type plugin: `ForceDirectedTree`. [More info](https://www.amcharts.com/docs/v4/chart-types/force-directed/). Also check bundled examples: `force-directed-tree`, `force-directed-tree-expandable`, and `force-directed-network`.
- New `CategoryAxis` property: `positionToCategory(position)`.


## [4.3.7] - 2019-04-04

### Fixed
- `TreeMap` was erroring out since `4.3.6` unless "animated" theme was enabled.
- On `TreeMap`'s legend with default markers `valueLabels` was not working on first load.


## [4.3.6] - 2019-04-04

### Added
- New `DateFormatter` property: `timezoneOffset`. Set it to a number of minutes (to UTC) to recalculate all date/time to a specific time zone.

### Changed
- `DateFormatter` will now use locale information for its default date format set in `dateFormat`. Format in default "International English" locale did not change, and remains at `"yyyy-MM-dd"`. Other locales might or might not produce different date formats.
- Improved `ValueAxis` scale calculation algorithm when `min`/`max` is set.
- `"hit"` event is now added on `FlowDiagramNode` template instead of the class itself. This allows disabling default toggle/drag behavior and replacing with own events.

### Fixed
- Themes were not properly being applied to bullets.
- `Popup.draggable` was being ignored.
- `Series.legendSettings.itemValueText` was being ignored when `cursorTooltipEnabled = false`. #1141
- Mouse events over `LineSeries` segments where happening at wrong position.
- `legend.valueLabels` on `TreeMap` did not work.
- Changing Map projection with `panBehavior = "rotateLongLat"` could cause a JS error.
- Changing `TreeMap` data after chart size changed could cause zoom-out button to appear.
- Solved flickering of stacked columns when raw data was invalidated.
- Updating data of a `TreeMap` when animation was playing could result in a JS error.


## [4.3.5] - 2019-03-29

### Added
- New properties `strokeLinejoin` ("miter" | "round" | "bevel") and `strokeLinecap` ("butt" | "square" | "round") added to `Sprite`. [More info](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Fills_and_Strokes#Stroke).

### Fixed
- In some rare cases EDGE/IE could generate an "Unspecied error".
- `MapChart` method `zoomToMapObject()` was not functioning properly since `4.3.4`.
- `LineSeries` with bullet and `hidden = false` in init was causing the whole chart to break.


## [4.3.4] - 2019-03-28

### Fixed
- Issue with JSON setups for `MapChart` fixed.


## [4.3.3] - 2019-03-27

### Fixed
- `MapPolygonSeries.geodataSource` was not working.
- `MapChart` was not showing data if `geodata` was set later than data on series.
- When there were multiple data items with identical timestamps on `DateAxis`, the first ones could have been ignored.
- Even if `legend.itemContainer.template.togglable` was set to `false`, Legend item was stil togglable.
- Extra graticules (grid) was shown in `GraticuleSeries` unders some conditions.
- Tooltips on a logarithmic `ValueAxis` were showing wrong values.
- Value label for "0" could sometimes appear on top of logarithmic `ValueAxis`.
- `MapChart` position was not correct if padding was set.


## [4.3.2] - 2019-03-26

### Fixed
- `MapChart` dispose error fixed.


## [4.3.1] - 2019-03-26

### Fixed
- Bug with live data updates fixed.


## [4.3.0] - 2019-03-26

### Added
- `MapChart` can now use any projection supported by [d3-geo](https://www.npmjs.com/package/d3-geo). `Projection.d3Projection` property added and you can set any d3-geo projection using it, like: `mapChart.projection.d3Projection = am4maps.d3geo.geoConicEquidistant();`.
- Albers, AlbersUsa, AzimuthalEqualArea, EqualEarth, NaturalEarth1, Stereographic projection classes added (use them regularly like: `mapChart.projection = new EqualEarth()`).
- `deltaLatitude`, `deltaGamma` added to `MapChart`. Together with already existing `deltaLongitude` allows rotating maps in any possible direction.
- `panBehavior` property added to `MapChart`. Values: "move" (default), "rotateLat", "rotateLong", "rotateLongLat". Indicate what should happen when map is dragged.
- `ignoreBounds` added to `MapSeries`. Specifies if this series must be included when calculating bounds of the map.
- `calculateVisualCenter` added to `MapPolygonSeries`. Specifies if map polygons should calculate their visual center. Visual center is good for placing labels.
- `visualLongitude` and `visualLatitude` getters added to `MapPolygon`. They return coordinates if `calculateVisualCenter` of series is set to `true`. You can also set them manually.
- `getCircle()` and `getBackground()` methods added to `MapUtils`.
- `Graticule` and `GraticuleSeries` classed added. Those allow creating graticules (map grid).
- `backgroundSeries` added to MapChart. Allows creating a map-shaped background fill.

### Changed
- Engine behind rendering of maps was changed to use [d3-geo](https://www.npmjs.com/package/d3-geo).While the change should be backwards compatible, beware of and report any issues.
- `day-night-map` and `morphing-countries` demos we changed to work properly with new version.
- When adding a `HeatLegend` to `MapChart` its `valign = "bottom"` is no longer set by default. Set it explicitly if you need legend to bottom-aligned.

### Fixed
- `rtl` setting was not being inherited properly.
- Fixed RTL behavior for labels.
- Disposing a hovered chart with scroll pan enabled used to leave whole document with disabled wheel scroll.


## [4.2.6] - 2019-03-21

### Fixed
- `CategoryAxis` was breaking down after dynamic data update since 4.2.4.


## [4.2.5] - 2019-03-21

### Added
- New property `minPolylinestep` added to global `am4core.options`. Setting to bigger value (default: `0.5`) allows simplification of multi-point lines.
- Export: new setting `useSimplifiedExport` (default: `true`). Setting to `false` will force use of external library (canvg) for all exports.

### Fixed
- `XYCursor` with pan behavior used to remain in "grabbing" mode after click on zoom out button.
- Export: Menu was not working properly on Mobile Safari.
- Export: Menu was not working properly on Android Chrome.
- Export: Exporting of PDF/XSLX is now supported on Mobile Safari.
- Export: Exporting images in IE9 was broken.
- Stacks with pre-hidden series were showing incorrectly.
- `DateAxis` no longer ignores `renderer.tooltipLocation`.


## [4.2.4] - 2019-03-19

### Added
- `autoGapCount` added to `LineSeries`. If `connect = false` and distance between two data points is bigger than `baseInterval * autoGapCount`, a line will break automatically.

### Fixed
- `IPlugin` now accepts `Optional<Sprite>`.
- `XYCursor` will not longer obstruct page scroll if its `behavior` is set to `"none"`.
- JSON config: setting `geodata` by name (e.g. "worldLow") directly in `MapSeries` was not working.
- JSON config: Instantiating new `ColorSet` objects was not working properly.
- `DateFormatter` was not parsing dates like "20180101" (no separators) correctly.
- An issue with `DateAxis` and milliseconds fixed.
- `dataItem.locations.dateX` on `LineSeries` was not working properly.


## [4.2.3] - 2019-03-14

### Fixed
- Exporting via API from a chart that did not have `ExportMenu` set, was resulting in error.
- Fixed tooltip flickering that were set directly on series objects (columns/bullets).
- Because of daylight saving, sometimes `DateAxis` could mistake yearly data for monthly data if `baseInterval` was not set explicitly.
- Sometimes Sankey nodes did not perfectly fit into chart area.
- Tick `location` on Y axis was being ignored.
- Ticks were positioned incorrectly when multiple axes were on the same side of the `XYChart`.
- Issue with `strictMinMax` and single data item fixed.
- `valueY` (or any other value) wasn't working in `legendSettings.itemLabelText`.


## [4.2.2] - 2019-03-13

### Added
- `cursorHoverEnabled` added to `XYSeries`. Controls whether to trigger hover state on columns/bullets of the all series under hovered category/date.
- A new `plugins` property on all `Sprite`. [More info](https://www.amcharts.com/docs/v4/concepts/plugins/).
- New plugin: Regression. [More info](https://www.amcharts.com/docs/v4/tutorials/regression-trend-lines/).
- New `ExportMenu` setting: `closeOnClick` (default `true`). Will force export menu to close when export is initiated.

### Changed
- `DateFormat` will now parse even partial dates, e.g. format `"yyyy-MM-dd"` will parse `"2018"` correctly, and will assume Jan 1st.

### Fixed
- Export: `getImage()`/`getSVG()` will now correctly omit `exportable = false` elements.
- Export: Data export was not taking in additional columns after data updates.
- Some chart cloning issues fixed.
- Inccorrect behavior of Series' tooltip with `minBulletDistance` set fixed.
- Sometimes, when series had only one data item, chart used to zoom-in right after the init.
- In-line date formatting will now use `DateFormatter`'s parsing functions for string-based dates.
- `DateAxis` issues with certain timezones fixed.


## [4.2.1] - 2019-03-08

### Fixed
- Various graphical issues when using `<base>` tag (mostly affects Angular).
- `NumberFormatter` did not have a public accessor to set `negativeBase`.


## [4.2.0] - 2019-03-06

### Added
- Added read-only property of `CategoryAxis`: `frequency`. Indicates every X label is shown.
- Added JSON example of Candle stick chart (json/candlestick-series).
- New `Export` property: `extraSprites`. May contain a list of references to other `Sprites` (e.g. external legend or even other chart) to attach to exported image. [More info](https://www.amcharts.com/docs/v4/concepts/exporting/#Including_external_elements).
- Experimental responsive features and default rules are now active. [More info](https://www.amcharts.com/docs/v4/concepts/responsive/).

### Changed
- Accessibility: Default role of the Legend's item containers was changed to "switch".

### Fixed
- Accessibility: Legend's containers when toggling items were setting value of `aria-checked` incorrectly.


## [4.1.14] - 2019-03-01

### Changed
- Hiding or showing an element will now automatically set its `readerHidden` attribute accordingly.

### Fixed
- JSON: Using `children` with an array value was duplicating elements.
- Working around a bug with Angular's dead code elimination in `--prod` mode.
- Fixed `ValueAxis` issue with animation when there's only single data item.


## [4.1.13] - 2019-02-26

### Added
- New `Tooltip` proprety: `keepTargetHover` - will make target element hovered as long as its tooltip is hovered, good for bullets and map images.
- New `Tooltip` proprety: `targetSprite` - contains reference to element this tooltip is displayed for, if any.
- New `PictorialStackedSeries` properties: `startLocation` and `endLocation` - allow setting relative start and end positions of the shape to fill.
- New `FunnelSeries`/`PyramidSeries`/`PictorialStackedSeries` property: `labelsOpposite` - allows controlling which side of the series to show labels when `alignLabels = true`.

### Fixed
- Sometimes axis ticks on a chart with a lot of data/series were not positioned properly.


## [4.1.12] - 2019-02-25

### Changed
- On `MapPolygon` default value of `nonScalingStroke` is now set to `true` (as `false`).
- When calculating font size for a word on a `WordCloud` chart it now uses smaller side of the series area instead of height.
- `Tooltip`'s label `paddingBottom` default value changed from `6` to `4` pixels for better centering of text.

### Fixed
- Sometimes `baseInterval = "year"` on a `DateAxis` could cause stack overflow.


## [4.1.11] - 2019-02-25

### Changed
- Default value of `minFontSize` in `WordCloudSeries` to `2%`.
- Default value of `maxFontSize` in `WordCloudSeries` to `20%`.
- Label sizing algorithm updated in `WordCloudSeries`.


## [4.1.10] - 2019-02-24

### Added
- New chart type: [WordCloud](https://www.amcharts.com/docs/v4/chart-types/wordcloud/).

### Changed
- Rotated axis labels (`rotation != 0`) of the vertical and horizontal axes no longer have their `verticalCenter` and `horizontalCenter` overridden by renderer. This gives more freedom for positioning rotated labels.

### Fixed
- `exportable = false` was not working when set on various Series item templates.
- On Gantt chart date axis tooltip was snapping randomly when moving mouse.
- Export: For very large data sets (2MB and up) data export was failing silently in Chrome.


## [4.1.9] - 2019-02-20

### Added
- New `Sprite` property: `baseSprite`. On objects, even deep in hierarchy it will contain a reference to the main chart object.

### Changed
- Axis `min`/`max` calculation algorightm updated.

### Fixed
- On a chart with `DateAxis` and multiple series with same-date data items, bullets could sometimes disappear while scrolling the chart.
- On `DateAxis` with yearly granularity could sometimes show wrong year.
- Updating chart `data` with less data points was sometimes resulting in JavaScript error.
- `DateAxis` labels/ticks/grid was not placed in the correct position if `baseInterval.count > 1` and `location > 0`.
- Dynamically changing `ZoomControl` value of `layout` was not working correctly.


## [4.1.8] - 2019-02-15

### Added
- JSON: You can now specify both list of items and template settings for `ListTemplate`, e.g.: `titles: { template: { ... }, values: [{ ... }] }`. Specifying it the old way will still work.

### Changed
- `DateAxis` will now pay attention to `dateFormatter.firstDayOfWeek` when grid is in "weekly" mode.

### Fixed
- Using `proprtyFields` on a `LineSeries` sometimes could result in an error. (fix by @AndiLi99)
- French locale (fr_FR) updated for correct decimal/thousands separators.
- Export: `scale` in image export options was being ignored.
- JSON: `cursor.snapToSeries` was not working in JSON configs.
- Selection was acting funky when zooming `DateAxis` and cursor moved out of plot area.
- An infinite error message loop fixed which was happening if series was added and there was no X or Y axes defined.
- Tooltip on the last available data item was left visible even if cursor moved to the date where the series had no data points.
- When `snapToSeries` was enabled in `XYCursor`, vertical line was not shown.
- [Issue 933.](https://github.com/amcharts/amcharts4/issues/933)


## [4.1.7] - 2019-02-14

### Fixed
- `DateAxis` sometimes could show date/time in UTC even if not explicitly enabled.


## [4.1.6] - 2019-02-12

### Added
- New plugin chart type: [`Sunburst`](https://www.amcharts.com/docs/v4/chart-types/sunburst/)!
- New `Sprite` adapter: `criticalError`. Takes `Error` object as an argument. Modify it's `message` property.

### Fixed
- Export was somewhat broken in Angular apps or pages with `<base>` since 4.1.5.
- `DateAxis` was not positioning elements properly when spanning switch to/from daylight savings time.
- `valign` property of the horizontal axis labels now work properly.


## [4.1.5] - 2019-02-11

### Added
- New property `contextMenuDisabled` (default `false`) added to `Sprite`. If set to `true` it will prevent context menu (such as one displayed on right click) from displayed.

### Changed
- Setting `data` on `ColorSet` will now automatically reset iterator.

### Fixed
- `"rightclick"` event was essentially not working.
- Angular with router enabled were breaking charts in Safari and older Firefox.


## [4.1.4] - 2019-02-08

### Added
- `DateAxis.gridInterval` accessor added. Returns current grid interval.

### Fixed
- Calling `useTheme()` with the same theme multiple times used to cause that theme applied multiple times as well.
- Sometimes `ValueAxis` would not zoom-out to show new selected range when data was updated.
- Sometimes axis fills were not visible after zoom-in / zoom-out.
- `totalPercent` was not properly calculated with negative values.


## [4.1.3] - 2019-02-06

### Fixed
- `ExportMenu` items will be revalidated if data of the chart is updated. This helps avoid missing "Data" export items in menu if data is loaded later than the chart itself.
- In stacked axes setup axis tooltips were shown in wrong positions.
- Preloader was not always shown when needed.
- JavaScript error when hovering cursor over missing data items fixed.
- `TreeMap` data change performance improved.
- Horizontal `ZoomControl` (`layout = "horizontal"`) button text vertical align fix.
- Accellerated panning of zoomed-in axis problem fixed.


## [4.1.2] - 2019-02-05

### Added
- New `Sprite` property `strokeDashoffset` added. Can be used in conjunction with `strokeDasharray`.
- `Label` has two new properties: `path` and `locationOnPath`. If set, will layout the SVG text along a curvature of the SVG path. HTML and multi-line text is not supported.
- `AxisLabelCircular` new property `bent` added. If set to `true`, the label will be bent to follow the curvature of the circle. Distance from the circle can be adjusted using `radius` and `label.paddingBottom`. For `PieSeries` the alignLabels need to to be set to `false` for this feature to work.

### Fixed
- JSON: Having property values with both percent and minus signs in them, was resulting in error.
- "Z" code in `DateFormatter` was not taking UTC setting into account.
- Exporting SVG with Unicode characters in Edge/IE was resulting in invalid SVG.
- Fixed JavaScript error which used happen when disposing chart/changing data in some cases.
- Gantt chart sometimes was not displaying first/last data item.
- Newly added `MapLine` elements were not respecting `nonScalingStroke = true` until zoom level changed.
- Series' tooltip was not always visible with `DateAxis`.


## [4.1.1] - 2019-01-31

### Added
- `keepSelection` added to `ValueAxis` (will work on DateAxis too). With this set to `true`, axis will keep the relative selection when data changes (is updated). This is useful for "pre-zooming" a date axis: just set it's `start` property (e.g. `axis.start = 0.8`).

### Changed
- If `ValueAxis` has `strictMinMax = true` set but `min` and `max` are not set, axis will fix the min and max and real high/low values.

### Fixed
- `cursorTooltipDisabled = true` was not working properly in some cases.
- Sometimes duplicate `MapLineObjects` used to appear on map lines.
- Some fixes made so that vertically and horizontally stacked axes on `XYChart` are now possible. Check new example in `examples/vertically-stacked-axes`.


## [4.1.0] - 2019-01-30

### Changed
- Standalone scripts were recompiled to use unique Webpack scope, to avoid conflicts with other Webpack packages. If you are using map charts, to avoid breakage, make sure you update to 4.1 version of geodata package as well.

### Fixed
- Performance optimizations of date-based charts, especially with more than one series.
- Overlapping tooltips of series with gaps in date-based data fixed.
- Bullets were not hidden when series was hidden in some cases.
- `simplifiedProcessing` moved from `ColumnSeries` to `Series`. If set to `true` (default `false`) the chart will not auto-calculate derivative values for data items, like sum, average, change, etc.
- Last grid of monthly data was not always drawn.


## [4.0.24] - 2019-01-25

### Fixed
- `nonScalingStroke` (broken in 4.0.23) fixed.
- Legend custom adapters problem (broken in 4.0.23) fixed.


## [4.0.23] - 2019-01-25

### Changed
- `PieChart3D` property `angle` is now limited to 0-90 range.

### Fixed
- `LabelBullet` was not showing text on `RadarChart` without some additional tweaking.
- Clicking and releasing on plot area without moving cursor sometimes could result in chart zooming in.
- Bullets for `PieSeries`, `FunnelSeries` were not positioned properly.
- Labels of `PieSeries3D` were not being positioned properly if `alignLabels = false` and `label.radius < 0`.
- Axis' grid was not hidden when axis was hidden.
- It was not possible to disable funnel series ticks if `alignLabels = true`.
- Adding a `MapLine` on zoomed `MapChart` ignored `nonScalinStroke = true` until zoom.
- On Gantt chart horizontal axis' labels/grid used to bleed out outside the plot area when zoomed in significantly.
- Columns of `ColumnSeries` with `strokeOpacity > 0` could leave lines at the beginning/end of the plot area when zoomed-in.
- Adapters for `fontSize`, `textDecoration` and some other `Label`-related properties were not working properly.
- Chart legend was not updated if data was set directly on `PercentSeries`.
- `MapChart` was drawing only 109 MapLines in some cases.
- `MapLine` tooltip was not being positioned properly.
- When `invalidateRawData()` was called for a chart with a `DateAxis` while it was zoomed-in, the chart was not keeping current zoom.
- If data was added to a series while it was hidden, bullets of new data items were not hidden.
- `columns` of `ColumnSeries` were not being cleared when data was updated.
- `propertyFields.fill`/`stroke` was not respected when value was outside zoom range.
- Ticks on a `PieChart3D` were misaligned.
- `Preloader` of a second and any subsequent chart on the same page was not being centered.
- `PercentChart` legend markers where black if `legend.useDefaultMarker = true`.
- `PercentChart` legend markers could blink black initially before obtaining true color.
- The color scale on a vertical `HeatLegend` with `markersCount > 2` was being drawn reversed.


## [4.0.22] - 2019-01-23

### Added
- 23 new locales: Arabic, Bosnian, Catalan, Czech, Greek, Estonian, Finnish, Hebrew, Hindi, Croatian, Hungarian, Indonesian, Japanese, Korean, Latvian, Polish, Romanian, Serbian, Thai, Turkish, Vietnamese, Chinese (simplified and traditional versions). Thanks Bjorn Svensson!

### Fixed
- It is no longer necessary to use `"strictFunctionTypes": false`, [thanks to goloveychuk for their help](https://github.com/amcharts/amcharts4/pull/645).
- Broken images were causing export to fail.
- Setting Series' `name` to a number with percent sign was resulting in breakage of the whole chart.


## [4.0.21] - 2019-01-11

### Fixed
- Issues that caused errors in Map an Percent charts on data update and dispose fixed.


## [4.0.20] - 2019-01-11

### Fixed
- Chart with `ColumnSeries` was failing with an error when `data` was updated.


## [4.0.19] - 2019-01-11

### Fixed
- `MapLineSeries` with direct `data` set were somewhat broken since last update.


## [4.0.18] - 2019-01-10

### Added
- JSON: Better id checking and error reporting.

### Fixed
- Export menu no longer shows DATA menu for `MapChart` (and other charts if data is empty).
- JSON: Some empty properties like `dummyData` were not being set properly.
- Disposing a chart or series when `Legend` was enbled was resulting in error.


## [4.0.17] - 2019-01-09

### Fixed
- Dramatically improved performance for data-heavy charts (with 10s and 100s of thousands of data points).
- `SmallMap` viewport indicator rectangle was positioned incorrectly.
- Clicking on `SmallMap` was not moving map to corthis.component.rect location.
- Lines from GeoJSON were not drawn by `MapLineSeries`.
- Issue with multiple data points on the same date fixed (not all data points were visible at the end of selection).


## [4.0.16] - 2019-01-05

### Added
- New locales: Norwegian Bokm? (np_NO), Danish (da_DK).

### Changed
- Renamed Swedish locale to `sv_SE`.

### Fixed
- Interactions on MacOS Safari was broken sincle last update.


## [4.0.15] - 2019-01-04

### Added
- `color` property added to `LegendDataItem`. Can be used for coloring `label` or `valueLabel` text like `text = "[{color}] {name}"`.
- `minZoomCount` added to `Component`.
- Export now allows formatting numberic values as durations. Use newly added `durationFields` and `durationFormat` settings.

### Changed
- Export: When exporting date to XLSX, date fields will now export as true date fields in Excel (which in turn will format them according to regional settings), unless `useLocal` is set to `false`.

### Fixed
- Charts were not working properly in FireFox Extended Support Release.
- Some computer setups were not properly registering mouse movement.
- `legendSettings` was being ignored initially if legend was in external container.
- "Week year" (format code `"YYYY"`) was not being properly calculated.


## [4.0.14] - 2019-01-02

### Added
- New setting `zoomStep` added to `MapChart`. Allows controlling zoom in/out speed.

### Fixed
- `Series.hidden` did not work as expected.
- World map did not work in Ember.
- Eliminated multiple warnings in recent version of Chrome regarding wheel events being active.
- Fixed mousewheel zoom in IEs.
- Draggable/resizable items were not working properly on some Android browsers.
- Setting `height` to a relative value for a horizontal `ColumnSeries` column template was not working propertly.


## [4.0.13] - 2018-12-26

### Fixed
- Charts were broken in IE9.


## [4.0.12] - 2018-12-24

### Fixed
- Cursor/mouse operations were somewhat broken in IE11 and lower.


## [4.0.11] - 2018-12-24

### Added
- `"disabled"` and `"enabled"` events added to `Sprite`.
- `cursorTooltipEnabled` added to `XYSeries`  If set to `false` cursor will not trigger bullet/item tooltips on series.

### Changed
- IMPORTANT (CODE-BREAKING CHANGES) For performance reasons we no longer create axis elements if they are disabled. For the same reasons we disabled by `axis.ticks` and `axis.axisFills` by default. Previously to enable them you had to set their `strokeOpacity` and/or `fillOpacity` to non-zero. This no longer will work. You will need to set `disabled` to `false` instead.
- `axisRanges` now take their default values from `dateAxis.axisRanges.template` items (`axisFill`, `grid`, `tick`, `label`). Previously they were using the defaults from `dateAxis.renderer.label` etc. This was not comfortable and counter-intuitive.

### Fixed
- `XYChartScrollbar`'s value axis was calculating `min`/`max` with a very big step.
- Ember plugin was throwing console errors.
- Fixed occasional zoom-in issue on Mobile Safari.
- `MapChart` mouse wheel zoom direction was inverted on some browsers.
- Cursor was not snapping correctly to `DateAxis` items.
- Multiple floating columns on the same category were disappearing when scrolling the chart.
- Date range fills were off when zooming on Gantt Chart.
- Overlapping tooltips problem solved.
- When `snapToSeries` was set for a tooltip, it was flickering a lot on slower browsers.
- `alignLabels = false` on a `PieSeries3D` was causing labels to be positioned incorrectly.
- `PieSeries.dataFields.radiusValue` was not accounting for `chart.innerRadius`.
- Dynamically updating `alignLabels` for `PieSeries` did not work correctly.
- Legend: `itemValueText` only worked if `valueText` was set.
- `ValueAxis` setting `maxZoomFactor = 1` was not working as expected.
- Changing values for all data items sometimes was resulting in `ValueAxis` scale going into negative.
- Some more tooltip and cursor related issues fixed.
- Axis Fill did not properly fill the whole span when axis was scaled.


## [4.0.10] - 2018-12-20

### Fixed
- In some situations, when `geodataSource` had events set, it was producing error.
- `DateAxis` was not rounding intervals properly, could display grid at `15:01`, `15:31` etc.
- Cloning an object was cloning sometimes was causing event handlers to be duplicated.
- A leftover console debug line was removed.


## [4.0.9] - 2018-12-19

### Added
- `snapToSeries` added to `XYCursor`. Allows setting series to which cursor lines should be snapped. Works if one of the axis of the series is `DateAxis` or `CategoryAxis`. Won't work if both axes are `ValueAxis`.
- New example: Pie charts in Columns using JSON config.
- Export: `emptyAs` added to both CSV and Excel export options. If set, missing values will be replaced with this value (default is empty string).
- New event `"beforedisposed"` added to `Sprite`. Kicks in right before the element starts to dismantle itself.
- Italian translation.

### Changed
- Export: if no `dataFields` specify it will now look for fields in all of the data, not just the first line.
- When creating a new state on an object, it will not automatically propagate itself on object's clones if `applyOnClones = true`.
- Setting `Container`'s `setStateOnChildren` will now propage to the new value to its existing clones if `applyOnClones = true`.
- In case `deepInvalidate()` is called on `Container`, it forces labels to redraw.
- `filters` on `SpriteState` is now `List` (was `ListTemplate`). It's better for performance which does not require creating Filter template object.

### Fixed
- Clicking a hoverable/clickable object was resultin in "over" and "out" events generated next to "hit".
- JSON: properties to existing `List` items were not being applied properly.
- Using geodata in Ember app was causing errors (Issue 672).
- Export to CSV/Excel was following first line of data values. It now respects `dataFields` setting, and will replace missing values with `emptyAs` (new options setting).
- Wheel-scrolling in MacOS Safari was very slow.
- HTML-based tooltips were too small to fit the actual contents on MaCOS Safari.
- `DateFormatter` was not parsing `"i"` format as local timezone, rather than UTC.
- Sometimes bullets with `Rectangle` element in them were not positioned properly.
- If category was named `"undefined"`, it was messing up label positions on `CategoryAxis`.
- State's property value was not being applied if current value of the property was `undefined`.
- Performance of `PieChart` and `RadarChart` improved dramatically under IEs.
- In some cases `"ready"` event was not being fired.
- `FunnelSeries` with 0 (zero) value slices was not rendered correctly.


## [4.0.8] - 2018-12-11

### Added
- `currentStep` added to `ColorSet`. Allows setting current position of the color iterator.
- Adapters added for `Sprite` properties: `inertiaOptions`, `hitOptions`, `hoverOptions`, `swipeOptions`, `keyboardOptions`, `cursorOptions`.

### Changed
- `nonScaling` of `AxisLabel` is no longer set to `true` by default, to improve performance.

### Fixed
- `ValueAxis` was not updating its scale if series was hidden and animated theme was not enabled.
- Zooming an `XYChart` with all values equal was broken.
- Series in an `XYChartScrollbar` sometimes was not visible initially.
- `ColumnSeries` was drawing 1px line for `null` value data items.
- `DateAxis`' `snapTooltip = true` was working incorrectly with `skipEmptyPeriods = true`.
- Logarithmic `ValueAxis` with axis breaks was resulting in stack overflows.
- JSON: Chaining multiple adapters in an array (e.g. `adapter: [{...}, {...}]`), was not working.
- JSON: Adding elements to `children` via array syntax was not working properly.
- JSON: `Container` elements can now be created via JSON config.
- Setting `dataFields` in `Export` was only affecting column names. Values for all data fields were still being included in export.


## [4.0.7] - 2018-12-07

### Added
- `snapTooltip` with default value `true` added to `DateAxis`. Cursor will snap to the nearest date at which series has values.

### Changed
- Default value of `showOnInit` set to `false` for `TreeMapSeries`.

### Fixed
- Solved tooltip overlapping bug.
- In `TreeMap`, when series is toggled off, remaining series will be resized to take up freed space.


## [4.0.6] - 2018-12-06

### Added
- `snapTooltip` added to `XYSeries`, with default value `false`. If set to `true`, the series will show nearest available tooltip when cursor is over plot area.
- Slovenian translation.

### Fixed
- Automatic `DateAxis` interval detection improved.


## [4.0.5] - 2018-12-06

### Changed
- `DateFormatter` will now automatically format "negative" year values to "BC" (era) format. So not `"-1000"`, but `"1000BC"`. These are translatable via language.
- `DropShadowFilter` of the tooltip removed. Instead it is now applied on background of tooltip. This helps to avoid text distortion.

### Fixed
- Heat rules were not working if all the values were the same. Now middle value between min and max is applied in this case.
- Updated algorithm to deal with date axes breaks. It's faster now and does not cause stackoverflow if the gaps are very big.
- Series on `HeatMap` charts were ignoring scrollbars.
- `DateAxis` was not properly placing labels if `location > 0` and grid interval was bigger than one time unit.
- `DateAxis` with very big date difference (thousands of years) displayed too many grid/labels/ticks.
- Masking of a sprite with a container updated. It now pays proper attention to container's position.
- Automatic `DateAxis` interval detection improved. Previously it detected intervals like minutes, hours, days, years. Now it will detect intervals like 15 min, 30 min, 5 days etc. This can still be set manually using axis' `baseInterval` property.


## [4.0.4] - 2018-12-03

### Added
- `zoomLevel` and `zoomGeoPoint` properties added to `MapSeriesDataItem` and `IMapSeriesDataFields`. If set, these settings instead of automatically-calculated will be used when `zoomToMapObject()` method is invoked.

### Changed
- `verticalCenter` and `horizontalCenter` is no longer applied to rotated axis labels. If you are setting `rotation` on axis labels, make sure to adjust these settings as well as per your requirement.

### Fixed
- Setting `axis.renderer.inside` was ignored if set after chart was already initialized.
- Changing `align` of the a sprite was ignored if set after it was already initialized.
- Top level `TreeMap` segment tooltip was positioned incorrectly after drilling down and back up.
- `min`/`max` of `ValueAxis` was not being updated after `invalidateRawData()` call, and series were stacked.
- Tooltip sometimes was pointing outside chart container.
- `ChordLink` bullets were not properly positioned on init.
- `DateAxis` was not working well if `baseInterval.count > 1`.


## [4.0.3] - 2018-11-30

### Added
- Ability to set default locale via `am4core.options.defaultLocale`. When set, all new charts will automatically assume that locale, freeing you from setting locale for each chart individually.
- `reverseOrder` added to `Container`. Allows reversing order of its `children`.

### Changed
- Moved `Legend` of a `MapChart` from `chartAndLegendContainer` to `chartContainer`. In order to position legend on map chart, use `legend.align` / `legend.valign` properties.
- Default value of `showOnInit` on any `Series` is now `false`. Except if you are using "animated" theme, which sets it to `true` by default.

### Fixed
- JSON: Using `type: "Sprite"` in JSON config was not creating elements properly.
- Initial chart rendering optimized Charts should build faster.
- Some more performance optimizations.
- Setting `hiddenInLegend` on `Series` after chart was already built had no effect.


## [4.0.2] - 2018-11-28

### Added
- New method `setInterval()` on all base objects added. Works exactly like JS's `setInterval` but is automatically killed when target object is disposed.
- Added array utilities to `am4core`.

### Changed
- Removed unused `"label"` adapter from `Axis`.

### Fixed
- [Issue 588.](https://github.com/amcharts/amcharts4/issues/588)
- Fixed mouse wheel and zoom control zooming of a map which does not occupies all the div size.
- Fixed map scaling issues of a map which does not occupies all the div size.
- Sometimes axis labels were not formatted using number or other formatters.
- Adapters of data items were not being copied to clones.
- `text` property of `AxisDataItem` was not being copied to clones.


## [4.0.1] - 2018-11-24

### Fixed
- Issues with stacked series and `min`/`max` of `ValueAxis` fixed.
- Chart cursor now dispatches `"panning"` event only if moved by at least 3 pixels. This solves problem with panning on click.
- If `extraMin`/`extraMax` were set on `ValueAxis`, some unnecessary zoom used to happen.


## [4.0.0] - 2018-11-22

### Changed
- Droping BETA tag!
- `DropShadowFilter` will now always use balck by default instead of `"alternativeBackground"` from the theme.

### Fixed
- Setting `hiddenInLegend = true` on Series was causing the chart to hang.


## [4.0.0-beta.87] - 2018-11-22

### Added
- Full source code for amCharts 4 is now included under `/src/`.

### Changed
- Full language files are now under `/src/lang/`. If you need to make a translation, do a PR on those files/dir.


## [4.0.0-beta.86] - 2018-11-20

### Fixed
- In some situations waiting for `"ready"` event was producing unnecessary frame requests.


## [4.0.0-beta.85] - 2018-11-20

### Added
- `"ready"` event added to `Sprite`. Sprite fires it right after `"init"` event. `Container` fires it when all of its children are ready.
- `system.isPaused` property added. Setting it to `true` will effectively pause any chart activity, making them completely static.
- `ErrorBullet` class added. Allows drawing error charts. (Check `error-chart` and `xy-error-chart` examples for code samples)
- JSON: String-based `cursorOverStyle` and `cursorDownStyle` are not supported.

### Fixed
- JSON: Setting `ColorSet` properties `baseColor` or `list`  was not working properly.
- Accessibility: Legend item was not properly referring to a Series via `labelled-by`.
- `Label.wrap` was breaking lines mid-word even if there where words that would fit into alotted space.
- Memory leak fixed.
- Sometimes `Animation` was not firing `"animationended"` event (when elastic easing was used).


## [4.0.0-beta.84] - 2018-11-18

### Added
- `exportable` (default `true`) property added to `Sprite`. If set to `true` this element will not appear in the exported image of the chart.

### Changed
- `exportable` is now set to `false` by default on `Scrollbar` grips, zoom out button.

### Fixed
- JSON: `dateFormats` was being ignored.


## [4.0.0-beta.83] - 2018-11-15

### Added
- [`hideOverflow`](https://www.amcharts.com/docs/v4/reference/svgcontainer/#hideOverflow_property) added to `SVGContainer` class. If set to `true` it will apply `overflow: hidden` to chart container so that all chart elements are contained within. Default is `false`, except on `MapChart`, which has it at `true`.

### Fixed
- Some adjustments and fixes to animations associated with `hide()`/`show()` functions.
- If a legend was initially disabled, it was not appearing when enabled later.
- `chart.addData()` was not adding data to `XYChart` scrollbar series.


## [4.0.0-beta.82] - 2018-11-14

### Added
- JSON: `forceCreate` property added. If found in an item of an array, it will force creation of the new object, even if object with same index already exists in target `List`.
- French locale.

### Changed
- Adjusted animation durations in "animated" theme.

### Fixed
- JSON: String-based percent and color values were not being parsed correctly in some cases.
- JSON: `HeatLegend` was erroring if its `series` property was referencing to Series by id.
- Disposing an item with a custom `id` set was not clearing it from id map properly resulting in errors if item with the same id was being added later.
- `SankeyDiagram` was not taking chart's padding into account when sizing itself.
- Axis ticks were not being positioned properly after data update.
- Map using `deltaLongitude` was being positioned incorrectly.
- 3D columns z-indexing was sometimes incorrect.
- `PieChart` label placement with custom `startAngle`/`endAngle` was sometimes off.
- Label bullets on columns were not being restored from truncated state when width of the columns was increasing.
- Series `show()`/`hide()` were using `interpolationDuration` setting instead of `defaultState`/`hiddenState` transition duration when showing/hiding.


## [4.0.0-beta.81] - 2018-11-13

### Fixed
- `chart.hiddenState.properties.opacity` is no longer set to `1` by default. Removed this in order it to be `0` so that charts using animated theme would always fade-in.
- Better initial rendering of `ValueAxis` (removed unneeded animations).
- Sometimes map was not positioning itself at `homeGeoPoint`.
- Map with Eckert6 projection in some cases was not displayed properly.


## [4.0.0-beta.80] - 2018-11-13

### Fixed
- Legend in external container was resulting in infinite loop.
- Rendering an arrow on a `MapLine` with same source and destination point was resulting in error.

## [4.0.0-beta.79] - 2018-11-12

### Fixed
- `goHome()` on `MapChart` was not working properly.
- `projection` change on `MapChart` was not working properly.


## [4.0.0-beta.78] - 2018-11-11

### Changed
- `DataParser` property `type` was renamed to `contentType` in order not to conincide with JSON-based config built-in keyword `type`.

### Fixed
- Some rendering issues fixed.


## [4.0.0-beta.77] - 2018-11-10

### Fixed
- Removed console debug (yes, again).


## [4.0.0-beta.76] - 2018-11-10

### Fixed
- Removed console debug.


## [4.0.0-beta.75] - 2018-11-10

### Added
- You can now use `"{percent}"` placeholder in `tooltipText` of `HeatMapSeries` items.

### Fixed
- Draggable/trackable areas of the chart were intercepting all mouse buttons, including right and back/forward.
- Fixed `MapChart` issue with dragging map by touch on hybrid devices.


## [4.0.0-beta.74] - 2018-11-08

### Fixed
- `ColumnSeries3D` were broken since last release.


## [4.0.0-beta.73] - 2018-11-07

### Changed
- `axisFills.template.interactionsEnabled` is now set to `false` by default. If you need to attach events on an axis fill, you will need to set it to `true`.

### Added
- `autoDispose` property added to `Series` and `Axis` classes with default value `true`. This means that series/axis will be automatically disposed when removed from chart's `series`, `xAxes`, or `yAxes` lists.
- It is now possible to have 3D stacked columns (by setting `clustered = false` on series).

### Fixed
- If chart container was moved in DOM tree, it stopped sensing resize and was not updating its size anymore.
- Sometimes `ValueAxis` could show zero label with a minus sign.
- Arrows on `MapLine` were not drawn.
- It was not possible to change the text color of the tooltip on `TreeMap` diagram.
- `axis.tooltipPosition = "pointer"` was not working as it should - always follow the mouse/pointer.
- If series had `data` set directly, it was still using chart's global `data`, resulting in combined datasets and potentially visual anomalies.
- Setting `cellStartLocation` did not have any effect on an already inited chart.
- Line series could be cut off in the beginning (when zoomed-in closely).
- Vertical axis ticks were not being positioned properly if axis had a title.
- 3D columns were not using chart's `depth`/`angle`.


## [4.0.0-beta.72] - 2018-11-03

### Changed
- For any `XYSeries` if the `itemReaderText` is not set explicitly, it will automatically try to fill with values from `dataFields`, so that each series element, like a Column has at least rudimentary screen-reader text.

### Fixed
- Added in TypeScript 3.x support.
- `ColumnSeries` with two category axes anomaly fixed.


## [4.0.0-beta.71] - 2018-11-01

### Fixed
- Calling `dispose()` on a `TreeMap` was causing an error.
- Legend items were being duplicated every time its disabled property was reset back to `false`.


## [4.0.0-beta.70] - 2018-10-31

### Fixed
- Keyboard dragging of elements such as scrollbar grips was not working.
- "hoverable" elements were not staying "hovered" after tap in Mobile Safari.
- `addData()` with more than one data item added was not working well.
- Zoomout button was visible on initial animation.
- Dynamically changing `Legend.position` was not updating its layout properly.
- Vertical axis tick position with rotated labels was incorrect.


## [4.0.0-beta.69] - 2018-10-30

### Fixed
- Some charts were not properly displayed if initialized in a hidden (`display: none`) container, then revealed (`display: block`).
- Last slice of the `PyramidSeries` was not visible for certain widths.
- Adding `Legend` to a chart that had series with bullets using heatrules was causing an error.
- Label rotation was being ignored on `SlicedChart`.
- Labels of `PyramidSeries` were not centered (when `alignLabels = false`).
- Animation of labels for horizontal `PictorialSeries` was very jumpy.
- `position` and `rotation` of labels in `PyramidSeries` was not working properly.
- An error was occurring if chart's with a category axis data was updated and it contained less data points than before.


## [4.0.0-beta.68] - 2018-10-30

### Changed
- `tooltip.defaultState.transitionDuration` and `tooltip.hiddenState.transitionDuration` default values of animated theme set to `400`.

### Fixed
- Chart was not being drawn properly when instantiated in a hiden container.


## [4.0.0-beta.67] - 2018-10-29

### Fixed
- Chart `Cursor` was preventing hovers on series' elements like columns or bullets.
- Mouse cursor's down styles (like on scrollbar) were not being reset back properly in some cases.


## [4.0.0-beta.66] - 2018-10-28

### Fixed
- Axis glitches in `XYChart3D`.
- `XYCursor` movement issues.


## [4.0.0-beta.65] - 2018-10-28

### Changed
- `tooltip.hiddenState.transtionDuration` and `tooltip.defaultState.transitionDuration` are now set to 1 (on non-animated theme) to avoid some tooltip flickering.
- Individual legend items (label, value label, and marker) now have their  `interactionsEnabled = false` set by default to avoid double events. If you need to add events to these particular elements (as opposed to the whole legend item), you will need to set `interactionsEnabled = true` on that element.

### Fixed
- Calling `show()` on a `MapSeries` object was resulting in an error.
- 3D columns were not visible if their value was zero.
- Bullets are now hidden if `minBulletDistance` is set.


## [4.0.0-beta.64] - 2018-10-27

### Added
- `shouldClone` flag added to `EventDispatcher`'s `on` and `once` methods. Can be used to restrict cloning of events when object itself is cloned.
- [`showOnInit`](https://www.amcharts.com/docs/v4/reference/sprite/#showOnInit_property) property added to `Sprite`. If this is set to `true`, the `Sprite`, when inited will be instantly hidden ("hidden" state applied) and then shown (animate properties form "hidden" state to "default" state). Animation will take `defaultState.transitionDuration`. `Series`, `Chart` classes has this set to `true`, so that they would perform initial animations. If you want a sprite (chart, series) not to be shown initially, you can set Sprite's [`hidden`](https://www.amcharts.com/docs/v4/reference/sprite/#hidden_property) to `true`. (`setting sprite.visible = true` won't work as expected anymore).

### Changed
- If chart rendering takes too long, it now is split into chunks, which makes the browser/page remain responsive even if you have a lot of charts to build.
- Changed how pre-hiding Series works. If you want series to be initially hidden, use `series.hidden = true` instead of `series.visible = false`.
- Removed `"hold"` and `"rotate"` interaction events and releated options and functionality, since they weren't used anywhere.
- Removed `"delayFirstHit"` option from `Sprite.hitOptions`.
- `chart.defaultState.transitionDuration` is set to `1`. This allows the chart to appear one frame after init and helps to avoid various flickers that happen while chart is building. Animated theme has this value set to `2000`.

### Fixed
- Performance enhancements.
- Non-draggable/trackable but otherwise interactive elements of the chart no longer prevent scrolling and other gestures on touch screens.
- `PieSeries` labels sometimes were positioned incorrectly (using non-default start/end angles).
- Slices (also columns of `RadarChart`) were not drawn if `radius <= 0` (even if `innerRadius > 0`). This resulted in radar columns not rendered in some cases.
- `MapChart` was not resizing properly when div size changed.
- `PictorialStackedSeries`, while `containerdiv` was resized did flicker a lot.
- If a Tooltip is visible while its Sprite changes size/position, it updates its position as well.
- Setting `chart.data = []` was not clearing data properly.


## [4.0.0-beta.63] - 2018-10-20

### Fixed
- In some cases a `PieChart` could overlap its legend.
- `PieChart` flicker after `invalidateData` fixed.
- An error was occurring when data was updated on chart with series with bullet while hovering it with cursor.


## [4.0.0-beta.62] - 2018-10-19

### Fixed
- Tooltip issue fixed.

## [4.0.0-beta.61] - 2018-10-19

### Changed
- If element has `url` set, when clicked, it will now parse for data placeholders in curcly brackets, e.g. `"{category}"` allowing have dynamic data-driven URLs. Note, the elements are not url-encoded so you need to specify encoding manually, e.g.: `series.columns.template.url = "https://www.google.com/search?q={category.urlEncode()}";`.

### Fixed
- `Label.fullWords = false` was not working properly.
- `AxisLabelCircular` was positioning labels incorrectly, if label.radius was negative (since 59).
- `"grid"` layout in `Container` was incorrectly layouting elements if their `width` was set in percent.
- [IE] Multi-line truncated labels were not working properly on IE.
- [IE] was incorrectly zIndexing elemens (since version 56).
- [IE] tooltip initial flicker solved.
- [IE] was incorrectly sorting multiple series tooltips (if `Cursor` was used).


## [4.0.0-beta.60] - 2018-10-18

### Changed
- `"hidden"` data field added to series' `dataFields`. Removed `"visible"` data field from `PercentSeries`. You should use `"hidden"` data field to set which slices/columns/etc. are hidden initally.
- `AxisLabelCircular`'s `radius` can now be set in `Percent`. `PieChart`'s label radius default value was set to `5%`.

### Fixed
- Multi-line labels were not being aligned properly in IEs.
- In some cases, `fillModifier` was not applied if set after `fill`.
- In some cases, a chart with `seriesContainer` disabled, or when `seriesContainer`'s height/width was 0, could produce a JS error.
- Some performance tuneups, especially for charts with axes and more data.


## [4.0.0-beta.59] - 2018-10-17

### Added
- [`widthRatio`](https://www.amcharts.com/docs/v4/reference/image/#widthRatio_property) and [`heightRatio`](https://www.amcharts.com/docs/v4/reference/image/#heightRatio_property) properties on `Image`.

### Fixed
- Some adapters for Axis elements were being applied twice.


## [4.0.0-beta.58] - 2018-10-17

### Added
- `ExportMenu`'s "custom" items can now have `"callback"` which is a function to call when clicked on such custom item.

### Changed
- Slice labels on a `PieChart` now move with the slice (if `alignLables = false`).

### Fixed
- `requestAnimationFrame` now is called only when needed. This reduces idle CPU usage.
- Fixed `m4core.color()` result caching issue.
- Charts were broken in IEs since beta.57.
- `Tooltip` on `LineSeries` was not updating color if segment changed color.
- `MapChart` without any series was displaying an error in console.
- Axis tooltip was trimmed when `renderer.inside = true`.
- `StepLineSeries` `startLocation`/`endLocation` bug fixed.
- `"hover"` state was not being applied to series' bullet if it did not hav `tooltipText` set.
- `bulletLocation` for horizontal `ColumnSeries` fixed.
- Value labels of `Legend` were not in correct positions if `Legend` was positioned at the top or bottom (too close to legend label).


## [4.0.0-beta.57] - 2018-10-15

### Changed
- All charts (that inherit from `Chart`) now will apply "hidden" state right after they are validated, then immediately "default" state. This allows creating initial animations such as fade-in (if using animated theme). All you need to do is set: `chart.hiddenState.properties.opacity = 0;`.

### Fixed
- Mouse wheel zoom was broken since beta.56 on `MapChart`.
- Pushing `Sprite` to `Container.children` directly (instead of setting parent) used to produce a JS error.


## [4.0.0-beta.56] - 2018-10-12

### Added
- New `Sprite` adapter: `"populateString"`. Applied to strings after `Sprite` replaces data binders with real values, but before any formatting by `Label` kicks in.
- New `Label` property: [`ignoreFormatting`](https://www.amcharts.com/docs/v4/reference/label/#ignoreFormatting_property). If set to `true` will treat formatting blocks in square brackes (e.g. `"[red bold]"`) as regular text and will display them as such.

### Changed
- Default big, small, and byte suffixes in `NumberFormatter` are now translatable via locale files.
- The suffix for thousands "kilo", was changed to lowercase "k", as per [standards](https://en.wikipedia.org/wiki/International_System_of_Units#Prefixes).
- On `XYChart`, default for [`mouseWheelBehavior`](https://www.amcharts.com/docs/v4/reference/xychart/#mouseWheelBehavior_property) changed to `"none"` (was `"zoomX"`).

### Fixed
- Improved performance! All charts types are now noticably, some drastically are faster. Some memory leakages fixed as well.
- Now `MapPolygonSeries` will not inherit chart's global `geodata` if it has own `geodataSource` set.
- `DateFormatter` was not parsing all AM/PM string dates correctly.
- `DateFormatter` was not parsing `MMM` (short month names like "Jan", "Feb") propertly.
- In-line date formatter was not working correctly in some cases, e.g. `"{dateX.formatDate()}"`.
- Setting `chart.mouseWheelBehavior = "none"` did not release wheel scrolling of the web page when hovering over chart.
- `DataSource`'s' `"done"` event was being called if parsing of loaded data failed. Not anymore. `"done"` is called only on successful load. To catch any load (including one that ended in http or parse error) use `"ended"`.
- `DataSource`'s' `reloadFrequency` was broken if error occurred during one of the loads. This has been fixed. Even if error occurrs, loader will try to reload data in the next reload slot.
- JSON: `heatRules` did not work properly with their target set to a list template, e.g. `mapPolygons.template`.
- Auto-calculated `DateAxis.baseInterval` was not being carried over to the `XYChartScrollbar`.
- `DurationAxis` scale sometimes was dropping to negative values, even there were no negative values in data.
- `PieChart` and `Legend` were not working properly with `chart.zoom()` or `legend.zoom()` methods.


## [4.0.0-beta.55] - 2018-09-26

### Added
- New series type suitable for `SlicedChart`: `PictorialStackedSeries`. (check `pictorial-stacked-chart` and `pictorial-stacked-chart-horizontal` demos)
- New themes: "dataviz", "moorisekingdom", "frozen", "spiritedaway".
- New Chart property: `logo`. If you are using amCharts with a free license, it holds reference to amCharts logo. Use it to position logo with `align` and `valign` properties.
- New `FunnelTick` properties: `locationX` and `locationY`. Allow specifying a relative location within target element where tick is pointing to.

### Changed
- `FunnelChart` was renamed to `SlicedChart`. The previous name did not correctly represent capabilities of the chart type that can display not only funnel series, but also pyramids and stacked pictorial series. `FunnelSeries` remains as it was before.

### Fixed
- Mouse wheel zoom was extremely slow in FireFox.
- Sometimes colors duplicate colors were generated by `ColorSet`.
- HTML-based labels were not accounting for "pixel ratio" on Retina displays, making tooltips larger then they are supposed to be.


## [4.0.0-beta.54] - 2018-09-22

### Fixed
- Chart Cursor was working only for the first chart on the same page.
- `CSVParser` was not parsing `dateFields` and `numberFields` correctly.
- Issues with labels rendering in incorrect position fixed.
- `LinearGradientModifier` was not copying gradient properties to clones (since last version only).
- `FunnelSlice` sometimes rendered slice edges with no anti-aliasing.
- When calculating area of the Pyramid slices height of `sliceConnector` was not being taken into account.
- Reset `label.renderingFrequency` back to `1` to solve some unwanted label flickering.
- `MapImage` items were not showing if added via `series.data` (since last version only).


## [4.0.0-beta.53] - 2018-09-21

### Added
- New property `durationFormat` on `DurationFormatter`. If set, it will force this format to be used, instead of one determined by `baseUnit`.


## [4.0.0-beta.52] - 2018-09-21

### Added
- `CurvedColumnSeries` added. Allows having columns as curves or as triangles. Check `curved-column-chart` and `triangle-column-chart` in examples folder.
- `RadialGradientModifier` class added. Allows building more donut-like pie charts. Check `semi-circle-donut-chart` in examples.
- New chart type: `FunnelChart`, which can show regular FunnelSeries and PyramidSeries.
- New axis type: `DurationAxis`. Values on it are treated and formatted like time durations.
- `extraMin` and `extraMax` properties added to `ValueAxis`. Can be used to relatively adjust calculated minimum and maximum scale values.
- Two new read-only properties added to `Container`: `contentWidth` and `contentHeight`. Will hold width/height in pixels of the actual dimensions of elements in Container.

### Changed
- `DurationFormatter` now uses `TimeUnit` for its `baseUnit`, rather than arbitrary codes.
- `durationFormat` property was removed from `DurationFormatter`. Use [`getFormat()`](https://www.amcharts.com/docs/v4/reference/durationformatter/#getFormat_method) method to get correct format instead, then pass in to `format()`.
- Series will not show a tooltip (if one axis is `CategoryAxis`) if there is no value for this category (used to show tooltip if it had some extra text).

### Fixed
- Legend `valueLabel` values were not shown on chart initial render.
- 3D pie slices were not showing full stroke, only on the upper part of a slice.
- Sometimes `XYChart` did some additional animation even after all series finished animating, causing zoom-out flashing briefly.
- `XYChartScrollbar` was not showing series if data to the original series was added later (or changed).
- Chrome was not showing line series in `XYChartScrollbar` if all values were equal.
- Creating an empty line (without `multiGeoLine` set) was resulting in critical error.


## [4.0.0-beta.51] - 2018-09-13

### Changed
- Changed `Label.renderingFrequency` to `2`, for better performance.

### Fixed
- Performance tweaking.
- `DateAxis.baseInterval` was ignored in JSON-based configs.
- `"hoverActive"` state was not always being correctly applied.
- Better handling of cursor zoom and pan when outside chart area.
- Fixed occasional error when formatting dates or numbers.
- Line chart starts new segement only if properties (like `stroke`, `fill`, `strokeDashArray`, etc.) in data have changed. It used to start new segment if properties in data were defined resulting in reduced performance and disabled smoothed lines.
- Labels were not updating their position if their `fontSize` changed.
- `Sprite.nonScalingStroke = true` was ignored if set after `Sprite.strokeWidth`.
- `LineSeries` could leave some garbage lines while zooming.
- `ColumnSeries` could leave some garbage columns while zooming.
- `DateAxis` with one date only in chart data was not rendered properly.
- The chart was not zooming out after data validation.
- Added `ghostLabel` to `Axis` which is an invisible label and it helps to avoid unwanted changes of axis widht/height when the scale changes, e.g. on zoom.
- `zoomToMapObject`, if used with `MapPolygon` and custom `zoomLevel` was not working properly.
- `"hidden"` event of Series was called on initial chart initialization.


## [4.0.0-beta.50] - 2018-09-10

### Added
- `am4core.unuseAllThemes()` method added. Any chart created after this method call will not have any theme applied to it.
- New property `am4core.registry.baseSprites` will now hold all active (non-disposed) instances of top-level elements, such as charts.
- `startLocation`/`endLocation` properties added to `CategoryAxis` (previously available on `DateAxis` only). Allows to specify location the first and last cells of the axis should start on respectively.
- `innerRadius` of a Slice can now be set as `Percent` (e.g. `am4core.percent(50)`).
- You can now set custom radii (`radius` property) on Pie series (if you have more than one, you might want one to be larger and another smaller).

### Changed
- [`MapLine.imagesToConnect`](https://www.amcharts.com/docs/v4/reference/mapline/#imagesToConnect_property) now accepts an array of string IDs that can reference images by their `id` property.
- Changed `tooltip` inheritance so that it checks for `virtualParent` rather than direct `parent`. E.g. series' bullets use series' tooltip and not chart tooltip as it was before.

### Fixed
- Map polygon stroke thickness could be rendered incorrectly when zooming quickly. (Issue #175)
- Calling `addData()` more than once before data was validated resulted only last data item to be added. (Issue #222)
- `DateAxis.baseInterval` was ignored if data was set directly on series.
- `MapLine` was not paying attention to the properties set on template.
- `HeatLegend` was not updating its label count after its size changed. This could have been resulting in very few labels if initial container (div) size was small.
- The map portion of `MapChart` was incorrectly positioned after container (div) resize.
- Object properties, like `"name"` in GeoJSON were overriding same properties in `MapSeries` data. Now, the values specified in data are used over ones in GeoJSON. (Issue #307)
- Axis ranges used to reset `axisRange.label.text`. (Issue #308)
- Fixed issues with disposing series and charts.
- Updated to [canvg 1.5.3](https://github.com/canvg/canvg/releases/tag/v1.5.3) to fix em/rem text issue for epoxrt fallbacks.


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
