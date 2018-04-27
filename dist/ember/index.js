'use strict';

module.exports = {
  name: '@amcharts/amcharts4-ember',

  included(app) {
    this._super.included.apply(this, arguments);

    if (app.options.amcharts4 == null) {
      throw new Error("You must add an amcharts4 property to your EmberApp");
    }

    if (app.options.amcharts4.files == null) {
      throw new Error("You must add an amcharts4.files array to your EmberApp");
    }

    app.import('vendor/script/amcharts4/core.js');

    app.options.amcharts4.files.forEach(function (name) {
      app.import('vendor/script/amcharts4/' + name + '.js');
    });

    app.import('vendor/shims/amcharts4.js');
  }
};