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
am4internal_webpackJsonp(["a953"],{"3na+":function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={};i.d(r,"OverlapBuster",function(){return h});var a=i("m4/l"),n=i("Iz1H"),s=i("vMqJ"),o=i("hJ5i"),l=i("1DgP"),u=i("+qIf"),c=i("hD5A"),p=i("aCit"),h=function(t){function e(){var e=t.call(this)||this;return e.revealRatio=.7,e.collapseDelay=500,e.tolerance=2,e.d3forceSimulation=l.d(),e._shiftedTargets=new u.a,e._disposers.push(new c.b(function(){return e._shiftedTargets})),e._targets=new s.b,e._disposers.push(new c.b(function(){return e.targets})),e._targets.events.on("inserted",function(t){e._disposers.push(new c.c([t.newValue.events.on("over",e.handleHover,e),t.newValue.events.on("out",e.handleOut,e)])),t.newValue.isTemplate&&e._disposers.push(t.newValue.events.once("ready",e.register,e))}),e}return Object(a.c)(e,t),e.prototype.init=function(){t.prototype.init.call(this)},Object.defineProperty(e.prototype,"targets",{get:function(){return this._targets},enumerable:!0,configurable:!0}),e.prototype.handleHover=function(t){var e=this,i=t.target;if(this._centerTarget){if(this._centerTarget===i)return void this.cancelCollapse();if(this._shiftedTargets.hasKey(i.uid))return void this.cancelCollapse();this.collapseCurrent()}if(this.d3forceSimulation){var r=[];this._nodes=r,this._targets.each(function(t){if(e.hitTest(i,t)){var a=t.pixelX,n=t.pixelY;r.push({radius:Math.max(t.measuredWidth,t.measuredHeight)/2*e.revealRatio,target:t,x:a,y:n,ox:a,oy:n}),e._shiftedTargets.setKey(t.uid,{target:t,originalX:t.dx,originalY:t.dy}),e.stopAnimation(t)}}),this.d3forceSimulation=l.d(r).force("collision",l.a().radius(function(t){return t.radius})).on("tick",function(){o.each(r,function(t){t.target.dx=t.x-t.ox,t.target.dy=t.y-t.oy})})}this._centerTarget=i},e.prototype.handleOut=function(t){var e=this;this.cancelCollapse(),this._collapseTimeout=this.target.setTimeout(function(){e.collapseCurrent()},this.collapseDelay+10)},e.prototype.stopAnimation=function(t){if(t.isInTransition())for(var e=t.animations.pop();e;)e.kill(),e=t.animations.pop()},e.prototype.collapseCurrent=function(){var t=this;this.d3forceSimulation.force("collision",null),this.d3forceSimulation.stop(),o.each(this._nodes,function(e){e.target.animate([{property:"dx",to:0},{property:"dy",to:0}],t.target.defaultState.transitionDuration)}),this._centerTarget=void 0,this._shiftedTargets.clear()},e.prototype.cancelCollapse=function(){this._collapseTimeout&&this._collapseTimeout.dispose()},e.prototype.register=function(t){-1==this._targets.indexOf(t.target)&&this._targets.push(t.target)},e.prototype.hitTest=function(t,e){t.invalid&&t.validate(),t.invalid&&t.validate();var i=t.pixelX,r=t.pixelY,a=i+t.measuredWidth*this.tolerance,n=r+t.measuredHeight*this.tolerance,s=e.pixelX,o=e.pixelY,l=s+e.measuredWidth*this.tolerance,u=o+e.measuredHeight*this.tolerance;return!(s>a||l<i||o>n||u<r)},e}(n.a);p.c.registeredClasses.OverlapBuster=h,window.am4plugins_overlapBuster=r}},["3na+"]);
//# sourceMappingURL=overlapBuster.js.map