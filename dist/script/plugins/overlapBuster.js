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
am4internal_webpackJsonp(["a953"],{"3na+":function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r={};i.d(r,"OverlapBuster",function(){return h});var a=i("m4/l"),n=i("Iz1H"),s=i("vMqJ"),o=i("hJ5i"),l=i("1DgP"),u=i("+qIf"),c=i("hD5A"),p=i("aCit"),h=function(e){function t(){var t=e.call(this)||this;return t.revealRatio=.7,t.collapseDelay=500,t.tolerance=2,t.d3forceSimulation=l.d(),t._shiftedTargets=new u.a,t._disposers.push(new c.b(function(){return t._shiftedTargets})),t._targets=new s.b,t._disposers.push(new c.b(function(){return t.targets})),t._targets.events.on("inserted",function(e){t._disposers.push(new c.c([e.newValue.events.on("over",t.handleHover,t),e.newValue.events.on("out",t.handleOut,t)])),e.newValue.isTemplate&&t._disposers.push(e.newValue.events.once("ready",t.register,t))}),t}return Object(a.c)(t,e),t.prototype.init=function(){e.prototype.init.call(this)},Object.defineProperty(t.prototype,"targets",{get:function(){return this._targets},enumerable:!0,configurable:!0}),t.prototype.handleHover=function(e){var t=this,i=e.target;if(this._centerTarget){if(this._centerTarget===i)return void this.cancelCollapse();if(this._shiftedTargets.hasKey(i.uid))return void this.cancelCollapse();this.collapseCurrent()}if(this.d3forceSimulation){var r=[];this._nodes=r,this._targets.each(function(e){if(t.hitTest(i,e)){var a=e.pixelX,n=e.pixelY;r.push({radius:Math.max(e.measuredWidth,e.measuredHeight)/2*t.revealRatio,target:e,x:a,y:n,ox:a,oy:n}),t._shiftedTargets.setKey(e.uid,{target:e,originalX:e.dx,originalY:e.dy}),t.stopAnimation(e)}}),this.d3forceSimulation=l.d(r).force("collision",l.a().radius(function(e){return e.radius})).on("tick",function(){o.each(r,function(e){e.target.dx=e.x-e.ox,e.target.dy=e.y-e.oy})})}this._centerTarget=i},t.prototype.handleOut=function(e){var t=this;this.cancelCollapse(),this._collapseTimeout=this.target.setTimeout(function(){t.collapseCurrent()},this.collapseDelay+10)},t.prototype.stopAnimation=function(e){if(e.isInTransition())for(var t=e.animations.pop();t;)t.kill(),t=e.animations.pop()},t.prototype.collapseCurrent=function(){var e=this;this.d3forceSimulation.force("collision",null),this.d3forceSimulation.stop(),o.each(this._nodes,function(t){t.target.animate([{property:"dx",to:0},{property:"dy",to:0}],e.target.defaultState.transitionDuration)}),this._centerTarget=void 0,this._shiftedTargets.clear()},t.prototype.cancelCollapse=function(){this._collapseTimeout&&this._collapseTimeout.dispose()},t.prototype.register=function(e){-1==this._targets.indexOf(e.target)&&this._targets.push(e.target)},t.prototype.hitTest=function(e,t){e.invalid&&e.validate(),e.invalid&&e.validate(),0==e.measuredWidth&&e.measure(),0==t.measuredWidth&&t.measure();var i=e.pixelX,r=e.pixelY,a=i+e.measuredWidth*this.tolerance,n=r+e.measuredHeight*this.tolerance,s=t.pixelX,o=t.pixelY,l=s+t.measuredWidth*this.tolerance,u=o+t.measuredHeight*this.tolerance;return!(s>a||l<i||o>n||u<r)},t}(n.a);p.c.registeredClasses.OverlapBuster=h,window.am4plugins_overlapBuster=r}},["3na+"]);
//# sourceMappingURL=overlapBuster.js.map