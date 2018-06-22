# amCharts 4 Changelog

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).

Please note, that this project, while following numbering syntax, it DOES NOT
adhere to [Semantic Versioning](http://semver.org/spec/v2.0.0.html) rules.

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
