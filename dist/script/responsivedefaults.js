/**
 * @license
 * Copyright (c) 2018 amCharts (Antanas Marcelionis, Martynas Majeris)
 *
 * This sofware is provided under multiple licenses. Please see below for
 * links to appropriate usage.
 *
 * Free amCharts linkware license. Details and conditions:
 * https://github.com/amcharts/amcharts4/blob/master/LICENSE
 *
 * One of the amCharts commercial licenses. Details and pricing:
 * https://www.amcharts.com/online-store/
 * https://www.amcharts.com/online-store/licenses-explained/
 *
 * If in doubt, contact amCharts at contact@amcharts.com
 *
 * PLEASE DO NOT REMOVE THIS COPYRIGHT NOTICE.
 * @hidden
 */
webpackJsonp([4],{603:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=i(37),s=i(73),n=i(55),a=i(118),o=i(36),p=i(45),c=i(174),f=i(227);t.default=[{relevant:function(e){return e.pixelWidth<=100||e.pixelHeight<=100},state:function(e,t){if(e instanceof r.a){var i=e.states.create(t);return i.properties.minLabelPosition=1,i.properties.maxLabelPosition=0,i}return null}},{relevant:function(e){return e.pixelWidth<=200},state:function(e,t){var i;return e instanceof n.a?((i=e.states.create(t)).properties.inside=!0,i):e instanceof a.a?((i=e.states.create(t)).properties.inside=!0,i):e instanceof c.d?((i=e.states.create(t)).properties.disabled=!0,i):e instanceof f.d?((i=e.states.create(t)).properties.layout="vertical",i):e instanceof o.a?((i=e.states.create(t)).properties.marginLeft=0,i.properties.marginRight=0,i):e instanceof p.f&&("left"==e.position||"right"==e.position)?((i=e.states.create(t)).properties.position="bottom",i):null}},{relevant:function(e){return e.pixelHeight<=200},state:function(e,t){var i;return e instanceof s.a?((i=e.states.create(t)).properties.inside=!0,i):e instanceof a.a?((i=e.states.create(t)).properties.inside=!0,i):e instanceof c.d?((i=e.states.create(t)).properties.disabled=!0,i):e instanceof f.d?((i=e.states.create(t)).properties.layout="horizontal",i):e instanceof o.a?((i=e.states.create(t)).properties.marginTop=0,i.properties.marginBottom=0,i):e instanceof p.f&&("bottom"==e.position||"top"==e.position)?((i=e.states.create(t)).properties.position="right",i):null}},{relevant:function(e){return e.pixelWidth<=200&&e.pixelHeight<=200},state:function(e,t){var i;return e instanceof p.f?((i=e.states.create(t)).properties.disabled=!0,i):e instanceof f.d?((i=e.states.create(t)).properties.disabled=!0,i):null}}]}});
//# sourceMappingURL=responsivedefaults.js.map