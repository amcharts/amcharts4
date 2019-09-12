import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4plugins_timeline from "@amcharts/amcharts4/plugins/timeline";
import am4geodata_continentsLow from "@amcharts/amcharts4-geodata/continentsLow";

am4core.useTheme(am4themes_animated);

let container = am4core.create("chartdiv", am4core.Container);
container.width = am4core.percent(100);
container.height = am4core.percent(100);

let chart = container.createChild(am4plugins_timeline.CurveChart);
chart.dateFormatter.inputDateFormat = "yyyy-MM-dd hh:mm";

chart.data = [
  {"category":"apollo", "date":"1969-07-15 16:00", "event":"Scheduled 11-hour hold at T-9 hours.", "rdate":"1969-07-15 16:00",},
  {"category":"apollo", "date":"1969-07-16 03:00", "event":"Countdown resumed at T-9 hours."},
  {"category":"apollo", "date":"1969-07-16 08:30", "event":"Scheduled 1-hour 32-minute hold at T-3 hours 30 minutes."},
  {"category":"apollo", "date":"1969-07-16 10:02", "event":"Countdown resumed at T-3 hours 30 minutes."},
  {"category":"apollo", "date":"1969-07-16 13:31", "event":"Guidance reference release."},
  {"category":"apollo", "date":"1969-07-16 13:31", "event":"S-IC engine start command."},
  {"category":"apollo", "date":"1969-07-16 13:31", "event":"S-IC engine ignition (#5)."},
  {"category":"apollo", "date":"1969-07-16 13:31", "event":"All S-IC engines thrust OK."},
  {"category":"apollo", "date":"1969-07-16 13:32", "event":"Range zero."},
  {"category":"apollo", "date":"1969-07-16 13:32", "event":"All holddown arms released (1st motion)."},
  {"category":"apollo", "date":"1969-07-16 13:32", "event":"Liftoff (umbilical disconnected) (1.07 g)."},
  {"category":"apollo", "date":"1969-07-16 13:32", "event":"Tower clearance yaw maneuver started."},
  {"category":"apollo", "date":"1969-07-16 13:32", "event":"Yaw maneuver ended."},
  {"category":"apollo", "date":"1969-07-16 13:32", "event":"Pitch and roll maneuver started."},
  {"category":"apollo", "date":"1969-07-16 13:32", "event":"Roll maneuver ended."},
  {"category":"apollo", "date":"1969-07-16 13:33", "event":"Mach 1 achieved."},
  {"category":"apollo", "date":"1969-07-16 13:33", "event":"Maximum dynamic pressure (735.17 lb/ft2)."},
  {"category":"apollo", "date":"1969-07-16 13:33", "event":"Maximum bending moment (33,200,000 lbf-in)."},
  {"category":"apollo", "date":"1969-07-16 13:34", "event":"S-IC center engine cutoff command."},
  {"category":"apollo", "date":"1969-07-16 13:34", "event":"Pitch maneuver ended."},
  {"category":"apollo", "date":"1969-07-16 13:34", "event":"S-IC outboard engine cutoff."},
  {"category":"apollo", "date":"1969-07-16 13:34", "event":"S-IC maximum total inertial acceleration (3.94 g)."},
  {"category":"apollo", "date":"1969-07-16 13:34", "event":"S-IC maximum Earth-fixed velocity. S-IC/S-II separation command."},
  {"category":"apollo", "date":"1969-07-16 13:34", "event":"S-II engine start command."},
  {"category":"apollo", "date":"1969-07-16 13:34", "event":"S-II ignition."},
  {"category":"apollo", "date":"1969-07-16 13:35", "event":"S-II aft interstage jettisoned."},
  {"category":"apollo", "date":"1969-07-16 13:35", "event":"Launch escape tower jettisoned."},
  {"category":"apollo", "date":"1969-07-16 13:35", "event":"Iterative guidance mode initiated."},
  {"category":"apollo", "date":"1969-07-16 13:36", "event":"S-IC apex."},
  {"category":"apollo", "date":"1969-07-16 13:39", "event":"S-II center engine cutoff."},
  {"category":"apollo", "date":"1969-07-16 13:39", "event":"S-II maximum total inertial acceleration (1.82 g)."},
  {"category":"apollo", "date":"1969-07-16 13:41", "event":"S-IC impact (theoretical)."},
  {"category":"apollo", "date":"1969-07-16 13:41", "event":"S-II outboard engine cutoff."},
  {"category":"apollo", "date":"1969-07-16 13:41", "event":"S-II maximum Earth-fixed velocity. S-II/S-IVB separation command."},
  {"category":"apollo", "date":"1969-07-16 13:41", "event":"S-IVB 1st burn start command."},
  {"category":"apollo", "date":"1969-07-16 13:41", "event":"S-IVB 1st burn ignition."},
  {"category":"apollo", "date":"1969-07-16 13:41", "event":"S-IVB ullage case jettisoned."},
  {"category":"apollo", "date":"1969-07-16 13:41", "event":"S-II apex."},
  {"category":"apollo", "date":"1969-07-16 13:43", "event":"S-IVB 1st burn cutoff."},
  {"category":"apollo", "date":"1969-07-16 13:43", "event":"S-IVB 1st burn maximum total inertial acceleration (0.69 g)."},
  {"category":"apollo", "date":"1969-07-16 13:43", "event":"Earth orbit insertion. S-IVB 1st burn maximum Earth-fixed velocity."},
  {"category":"apollo", "date":"1969-07-16 13:43", "event":"Maneuver to local horizontal attitude started."},
  {"category":"apollo", "date":"1969-07-16 13:45", "event":"Orbital navigation started."},
  {"category":"apollo", "date":"1969-07-16 13:52", "event":"S-II impact (theoretical)."},
  {"category":"apollo", "date":"1969-07-16 16:06", "event":"S-IVB 2nd burn restart preparation."},
  {"category":"apollo", "date":"1969-07-16 16:16", "event":"S-IVB 2nd burn restart command."},
  {"category":"apollo", "date":"1969-07-16 16:16", "event":"S-IVB 2nd burn ignition (STDV open)."},
  {"category":"apollo", "date":"1969-07-16 16:22", "event":"S-IVB 2nd burn cutoff."},
  {"category":"apollo", "date":"1969-07-16 16:22", "event":"S-IVB 2nd burn maximum total inertial acceleration (1.45 g)."},
  {"category":"apollo", "date":"1969-07-16 16:22", "event":"S-IVB 2nd burn maximum Earth-fixed velocity."},
  {"category":"apollo", "date":"1969-07-16 16:22", "event":"S-IVB safing procedures started."},
  {"category":"apollo", "date":"1969-07-16 16:22", "event":"Translunar injection."},
  {"category":"apollo", "date":"1969-07-16 16:22", "event":"Maneuver to local horizontal attitude started."},
  {"category":"apollo", "date":"1969-07-16 16:22", "event":"Orbital navigation started."},
  {"category":"apollo", "date":"1969-07-16 16:37", "event":"Maneuver to transposition and docking attitude started."},
  {"category":"apollo", "date":"1969-07-16 16:47", "event":"CSM separated from S-IVB."},
  {"category":"apollo", "date":"1969-07-16 16:49", "event":"CSM separation maneuver ignition."},
  {"category":"apollo", "date":"1969-07-16 16:49", "event":"CSM separation maneuver cutoff."},
  {"category":"apollo", "date":"1969-07-16 16:56", "event":"CSM docked with LM/S-IVB."},
  {"category":"apollo", "date":"1969-07-16 17:49", "event":"CSM/LM ejected from S-IVB."},
  {"category":"apollo", "date":"1969-07-16 18:12", "event":"CSM/LM evasive maneuver from S-IVB ignition."},
  {"category":"apollo", "date":"1969-07-16 18:12", "event":"CSM/LM evasive maneuver from S-IVB cutoff."},
  {"category":"apollo", "date":"1969-07-16 18:13", "event":"S-IVB maneuver to lunar slingshot attitude initiated."},
  {"category":"apollo", "date":"1969-07-16 18:23", "event":"S-IVB lunar slingshot maneuver - LH2 tank CVS opened."},
  {"category":"apollo", "date":"1969-07-16 18:35", "event":"S-IVB lunar slingshot maneuver - LOX dump started."},
  {"category":"apollo", "date":"1969-07-16 18:36", "event":"S-IVB lunar slingshot maneuver - LOX dump ended."},
  {"category":"apollo", "date":"1969-07-16 19:09", "event":"S-IVB lunar slingshot maneuver - APS ignition."},
  {"category":"apollo", "date":"1969-07-16 19:14", "event":"S-IVB lunar slingshot maneuver - APS cutoff."},
  {"category":"apollo", "date":"1969-07-16 19:14", "event":"S-IVB maneuver to communications attitude initiated."},
  {"category":"apollo", "date":"1969-07-17 00:04", "event":"TV transmission started (recorded at Goldstone and transmitted to Houston at 011:26)."},
  {"category":"apollo", "date":"1969-07-17 00:20", "event":"TV transmission ended."},
  {"category":"apollo", "date":"1969-07-17 16:16", "event":"Midcourse correction ignition."},
  {"category":"apollo", "date":"1969-07-17 16:17", "event":"Midcourse correction cutoff."},
  {"category":"apollo", "date":"1969-07-17 20:00", "event":"TV transmission started."},
  {"category":"apollo", "date":"1969-07-17 20:50", "event":"TV transmission ended."},
  {"category":"apollo", "date":"1969-07-17 23:31", "event":"TV transmission started."},
  {"category":"apollo", "date":"1969-07-18 00:07", "event":"TV transmission ended."},
  {"category":"apollo", "date":"1969-07-18 20:40", "event":"TV transmission started."},
  {"category":"apollo", "date":"1969-07-18 21:02", "event":"CDR and LMP entered LM for initial inspection."},
  {"category":"apollo", "date":"1969-07-18 22:16", "event":"TV transmission ended."},
  {"category":"apollo", "date":"1969-07-18 23:27", "event":"CDR and LMP entered CM."},
  {"category":"apollo", "date":"1969-07-19 03:11", "event":"Equigravisphere."},
  {"category":"apollo", "date":"1969-07-19 17:21", "event":"Lunar orbit insertion ignition."},
  {"category":"apollo", "date":"1969-07-19 17:27", "event":"Lunar orbit insertion cutoff."},
  {"category":"apollo", "date":"1969-07-19 18:45", "event":"Sighting of an illumination in the Aristarchus region. 1st time, a lunar transient event sighted by an observer in space."},
  {"category":"apollo", "date":"1969-07-19 19:52", "event":"TV transmission started."},
  {"category":"apollo", "date":"1969-07-19 20:14", "event":"S-IVB closest approach to lunar surface."},
  {"category":"apollo", "date":"1969-07-19 20:32", "event":"TV transmission ended."},
  {"category":"apollo", "date":"1969-07-19 21:43", "event":"Lunar orbit circularization ignition."},
  {"category":"apollo", "date":"1969-07-19 21:43", "event":"Lunar orbit circularization cutoff."},
  {"category":"apollo", "date":"1969-07-19 22:42", "event":"LMP entered CM for initial power-up and system checks."},
  {"category":"apollo", "date":"1969-07-20 01:07", "event":"LMP entered CM."},
  {"category":"apollo", "date":"1969-07-20 12:52", "event":"CDR and LMP entered LM for final preparations for descent."},
  {"category":"apollo", "date":"1969-07-20 14:32", "event":"LMP entered CM."},
  {"category":"apollo", "date":"1969-07-20 15:02", "event":"LMP entered LM."},
  {"category":"apollo", "date":"1969-07-20 15:17", "event":"LM system checks started."},
  {"category":"apollo", "date":"1969-07-20 17:32", "event":"LM system checks ended."},
  {"category":"apollo", "date":"1969-07-20 17:44", "event":"CSM/LM undocked."},
  {"category":"apollo", "date":"1969-07-20 18:11", "event":"CSM/LM separation maneuver ignition."},
  {"category":"apollo", "date":"1969-07-20 18:12", "event":"CSM/LM separation maneuver cutoff."},
  {"category":"apollo", "date":"1969-07-20 19:08", "event":"LM descent orbit insertion ignition (LM SPS)."},
  {"category":"apollo", "date":"1969-07-20 19:08", "event":"LM descent orbit insertion cutoff."},
  {"category":"apollo", "date":"1969-07-20 19:49", "event":"LM acquisition of data."},
  {"category":"apollo", "date":"1969-07-20 19:52", "event":"LM landing radar on."},
  {"category":"apollo", "date":"1969-07-20 19:56", "event":"LM abort guidance aligned to primary guidance."},
  {"category":"apollo", "date":"1969-07-20 19:59", "event":"LM yaw maneuver to obtain improved communications."},
  {"category":"apollo", "date":"1969-07-20 20:04", "event":"LM altitude 50,000 feet."},
  {"category":"apollo", "date":"1969-07-20 20:04", "event":"LM propellant settling firing started."},
  {"category":"apollo", "date":"1969-07-20 20:05", "event":"LM powered descent engine ignition."},
  {"category":"apollo", "date":"1969-07-20 20:05", "event":"LM fixed throttle position."},
  {"category":"apollo", "date":"1969-07-20 20:09", "event":"LM face-up maneuver completed."},
  {"category":"apollo", "date":"1969-07-20 20:10", "event":"LM 1202 alarm."},
  {"category":"apollo", "date":"1969-07-20 20:10", "event":"LM radar updates enabled."},
  {"category":"apollo", "date":"1969-07-20 20:11", "event":"LM throttle recovery."},
  {"category":"apollo", "date":"1969-07-20 20:13", "event":"LM approach phase entered."},
  {"category":"apollo", "date":"1969-07-20 20:13", "event":"LM landing radar antenna to position 2."},
  {"category":"apollo", "date":"1969-07-20 20:13", "event":"LM attitude hold mode selected (check of LM handling qualities)."},
  {"category":"apollo", "date":"1969-07-20 20:14", "event":"LM automatic guidance enabled."},
  {"category":"apollo", "date":"1969-07-20 20:14", "event":"LM 1201 alarm."},
  {"category":"apollo", "date":"1969-07-20 20:14", "event":"LM landing radar switched to low scale."},
  {"category":"apollo", "date":"1969-07-20 20:14", "event":"LM 1202 alarm."},
  {"category":"apollo", "date":"1969-07-20 20:14", "event":"LM 1202 alarm."},
  {"category":"apollo", "date":"1969-07-20 20:15", "event":"LM landing point redesignation."},
  {"category":"apollo", "date":"1969-07-20 20:15", "event":"LM altitude hold."},
  {"category":"apollo", "date":"1969-07-20 20:15", "event":"LM abort guidance attitude updated."},
  {"category":"apollo", "date":"1969-07-20 20:15", "event":"LM rate of descent landing phase entered."},
  {"category":"apollo", "date":"1969-07-20 20:16", "event":"LM landing radar data not good."},
  {"category":"apollo", "date":"1969-07-20 20:16", "event":"LM landing data good."},
  {"category":"apollo", "date":"1969-07-20 20:16", "event":"LM fuel low-level quantity light."},
  {"category":"apollo", "date":"1969-07-20 20:16", "event":"LM landing radar data not good."},
  {"category":"apollo", "date":"1969-07-20 20:17", "event":"LM landing radar data good."},
  {"category":"apollo", "date":"1969-07-20 20:16", "event":"1st evidence of surface dust disturbed by descent engine."},
  {"category":"apollo", "date":"1969-07-20 20:17", "event":"LM lunar landing."},
  {"category":"apollo", "date":"1969-07-20 20:17", "event":"LM powered descent engine cutoff."},
  {"category":"apollo", "date":"1969-07-20 22:12", "event":"Decision made to proceed with EVA prior to first rest period."},
  {"category":"apollo", "date":"1969-07-20 23:43", "event":"Preparation for EVA started."},
  {"category":"apollo", "date":"1969-07-21 02:39", "event":"EVA started (hatch open)."},
  {"category":"apollo", "date":"1969-07-21 02:51", "event":"CDR completely outside LM on porch."},
  {"category":"apollo", "date":"1969-07-21 02:53", "event":"Modular equipment stowage assembly deployed (CDR)."},
  {"category":"apollo", "date":"1969-07-21 02:54", "event":"First clear TV picture received."},
  {"category":"apollo", "date":"1969-07-21 02:55", "event":"CDR at foot of ladder (starts to report, then pauses to listen)."},
  {"category":"apollo", "date":"1969-07-21 02:55", "event":"CDR at foot of ladder and described surface as \"almost like a powder.\""},
  {"category":"apollo", "date":"1969-07-21 02:56", "event":"1st step taken lunar surface (CDR). \"That's one small step for a man…one giant leap for mankind.\""},
  {"category":"apollo", "date":"1969-07-21 02:56", "event":"CDR started surface examination and description, assessed mobility and described effects of LM descent engine."},
  {"category":"apollo", "date":"1969-07-21 02:58", "event":"CDR ended surface examination. LMP started to send down camera."},
  {"category":"apollo", "date":"1969-07-21 03:02", "event":"Camera installed on RCU bracket, LEC stored on secondary strut of LM landing gear."},
  {"category":"apollo", "date":"1969-07-21 03:02", "event":"Surface photography (CDR)."},
  {"category":"apollo", "date":"1969-07-21 03:05", "event":"Contingency sample collection started (CDR)."},
  {"category":"apollo", "date":"1969-07-21 03:09", "event":"Contingency sample collection ended (CDR)."},
  {"category":"apollo", "date":"1969-07-21 03:11", "event":"LMP started egress from LM."},
  {"category":"apollo", "date":"1969-07-21 03:13", "event":"LMP at top of ladder. Descent photographed by CDR."},
  {"category":"apollo", "date":"1969-07-21 03:15", "event":"LMP on lunar surface."},
  {"category":"apollo", "date":"1969-07-21 03:15", "event":"Surface examination and examination of landing effects on surface and on LM started (CDR, LMP)."},
  {"category":"apollo", "date":"1969-07-21 03:21", "event":"Insulation removed from modular equipment stowage assembly (CDR)."},
  {"category":"apollo", "date":"1969-07-21 03:23", "event":"TV camera focal distance adjusted (CDR)."},
  {"category":"apollo", "date":"1969-07-21 03:24", "event":"Plaque unveiled (CDR)."},
  {"category":"apollo", "date":"1969-07-21 03:24", "event":"Plaque read (CDR)."},
  {"category":"apollo", "date":"1969-07-21 03:31", "event":"TV camera redeployed. Panoramic TV view started (CDR)."},
  {"category":"apollo", "date":"1969-07-21 03:34", "event":"TV camera placed in final deployment position (CDR)."},
  {"category":"apollo", "date":"1969-07-21 03:35", "event":"Solar wind composition experiment deployed (LMP)."},
  {"category":"apollo", "date":"1969-07-21 03:41", "event":"United States flag deployed (CDR, LMP)."},
  {"category":"apollo", "date":"1969-07-21 03:45", "event":"Evaluation of surface mobility started (LMP)."},
  {"category":"apollo", "date":"1969-07-21 03:48", "event":"Evaluation of surface mobility end (LMP)."},
  {"category":"apollo", "date":"1969-07-21 03:48", "event":"Presidential message from White House and response from CDR."},
  {"category":"apollo", "date":"1969-07-21 03:50", "event":"Presidential message and CDR response ended."},
  {"category":"apollo", "date":"1969-07-21 03:52", "event":"Evaluation of trajectory of lunar soil when kicked (LMP) and bulk sample collection started (CDR)."},
  {"category":"apollo", "date":"1969-07-21 03:42", "event":"Evaluation of visibility in lunar sunlight (LMP)."},
  {"category":"apollo", "date":"1969-07-21 03:57", "event":"Evaluation of thermal effects of sun and shadow inside the suit (LMP)."},
  {"category":"apollo", "date":"1969-07-21 04:00", "event":"Evaluation of surface shadows and colors (LMP)."},
  {"category":"apollo", "date":"1969-07-21 04:06", "event":"LM landing gear inspection and photography (LMP)."},
  {"category":"apollo", "date":"1969-07-21 04:07", "event":"Bulk sample completed (CDR)."},
  {"category":"apollo", "date":"1969-07-21 04:18", "event":"LM landing gear inspection and photography (CDR, LMP)."},
  {"category":"apollo", "date":"1969-07-21 04:25", "event":"Scientific equipment bay doors opened."},
  {"category":"apollo", "date":"1969-07-21 04:27", "event":"Passive seismometer deployed."},
  {"category":"apollo", "date":"1969-07-21 04:35", "event":"Lunar ranging retroreflector deployed (CDR)."},
  {"category":"apollo", "date":"1969-07-21 04:40", "event":"1st passive seismic experiment data received on Earth."},
  {"category":"apollo", "date":"1969-07-21 04:43", "event":"Collection of documented samples started (CDR/LMP)."},
  {"category":"apollo", "date":"1969-07-21 04:52", "event":"Solar wind composition experiment retrieved (LMP) ."},
  {"category":"apollo", "date":"1969-07-21 05:01", "event":"LMP inside LM."},
  {"category":"apollo", "date":"1969-07-21 05:07", "event":"Transfer of sample containers reported complete."},
  {"category":"apollo", "date":"1969-07-21 05:09", "event":"CDR inside LM, assisted and monitored by LMP."},
  {"category":"apollo", "date":"1969-07-21 05:11", "event":"EVA ended (hatch closed)."},
  {"category":"apollo", "date":"1969-07-21 07:37", "event":"LM equipment jettisoned."},
  {"category":"apollo", "date":"1969-07-21 17:54", "event":"LM lunar liftoff ignition (LM APS)."},
  {"category":"apollo", "date":"1969-07-21 18:01", "event":"LM orbit insertion cutoff."},
  {"category":"apollo", "date":"1969-07-21 18:51", "event":"Coelliptic sequence initiation ignition."},
  {"category":"apollo", "date":"1969-07-21 18:52", "event":"Coelliptic sequence initiation cutoff."},
  {"category":"apollo", "date":"1969-07-21 19:49", "event":"Constant differential height maneuver ignition."},
  {"category":"apollo", "date":"1969-07-21 19:50", "event":"Constant differential height maneuver cutoff."},
  {"category":"apollo", "date":"1969-07-21 20:35", "event":"Terminal phase initiation ignition."},
  {"category":"apollo", "date":"1969-07-21 20:36", "event":"Terminal phase initiation cutoff."},
  {"category":"apollo", "date":"1969-07-21 20:50", "event":"LM 1st midcourse correction."},
  {"category":"apollo", "date":"1969-07-21 21:05", "event":"LM 2nd midcourse correction."},
  {"category":"apollo", "date":"1969-07-21 21:08", "event":"Braking started."},
  {"category":"apollo", "date":"1969-07-21 21:18", "event":"Terminal phase finalize ignition."},
  {"category":"apollo", "date":"1969-07-21 21:18", "event":"Terminal phase finalize cutoff."},
  {"category":"apollo", "date":"1969-07-21 21:24", "event":"Stationkeeping started."},
  {"category":"apollo", "date":"1969-07-21 21:35", "event":"CSM/LM docked."},
  {"category":"apollo", "date":"1969-07-21 22:52", "event":"CDR entered CM."},
  {"category":"apollo", "date":"1969-07-21 23:17", "event":"LMP entered CM."},
  {"category":"apollo", "date":"1969-07-21 23:41", "event":"LM ascent stage jettisoned."},
  {"category":"apollo", "date":"1969-07-22 00:02", "event":"CSM/LM final separation ignition."},
  {"category":"apollo", "date":"1969-07-22 00:02", "event":"CSM/LM final separation cutoff."},
  {"category":"apollo", "date":"1969-07-22 04:55", "event":"Transearth injection ignition (SPS)."},
  {"category":"apollo", "date":"1969-07-22 04:58", "event":"Transearth injection cutoff."},
  {"category":"apollo", "date":"1969-07-22 20:01", "event":"Midcourse correction ignition."},
  {"category":"apollo", "date":"1969-07-22 20:02", "event":"Midcourse correction cutoff."},
  {"category":"apollo", "date":"1969-07-23 01:08", "event":"TV transmission started."},
  {"category":"apollo", "date":"1969-07-23 01:26", "event":"TV transmission ended."},
  {"category":"apollo", "date":"1969-07-23 22:42", "event":"TV transmission started."},
  {"category":"apollo", "date":"1969-07-23 22:45", "event":"TV transmission ended."},
  {"category":"apollo", "date":"1969-07-23 23:04", "event":"TV transmission started."},
  {"category":"apollo", "date":"1969-07-23 23:16", "event":"TV transmission ended."},
  {"category":"apollo", "date":"1969-07-24 16:21", "event":"CM/SM separation."},
  {"category":"apollo", "date":"1969-07-24 16:35", "event":"Entry."},
  {"category":"apollo", "date":"1969-07-24 16:44", "event":"Drogue parachute deployed"},
  {"category":"apollo", "date":"1969-07-24 16:39", "event":"Visual contact with CM established by aircraft."},
  {"category":"apollo", "date":"1969-07-24 16:40", "event":"Radar contact with CM established by recovery ship."},
  {"category":"apollo", "date":"1969-07-24 16:46", "event":"VHF voice contact and recovery beacon contact established."},
  {"category":"apollo", "date":"1969-07-24 16:50", "event":"Splashdown (went to apex-down)."},
  {"category":"apollo", "date":"1969-07-24 16:58", "event":"CM returned to apex-up position."},
  {"category":"apollo", "date":"1969-07-24 17:04", "event":"Flotation collar inflated."},
  {"category":"apollo", "date":"1969-07-24 17:21", "event":"Hatch opened for crew egress."},
  {"category":"apollo", "date":"1969-07-24 17:29", "event":"Crew egress."},
  {"category":"apollo", "date":"1969-07-24 17:53", "event":"Crew aboard recovery ship."},
  {"category":"apollo", "date":"1969-07-24 17:58", "event":"Crew entered mobile quarantine facility."},
  {"category":"apollo", "date":"1969-07-24 19:50", "event":"CM lifted from water."},
  {"category":"apollo", "date":"1969-07-24 19:58", "event":"CM secured to quarantine facility."},
  {"category":"apollo", "date":"1969-07-24 20:05", "event":"CM hatch reopened."}]




let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
dateAxis.renderer.grid.template.location = 0;

dateAxis.renderer.points = [{x:-420.99371337890625, y:-2.442600965499878}, {x:-420.9903259277344, y:2.5572705268859863}, {x:-420.8582763671875, y:7.555384159088135}, {x:-420.59869384765625, y:12.548534393310547}, {x:-420.2126770019531, y:17.533475875854492}, {x:-419.70111083984375, y:22.507078170776367}, {x:-419.065673828125, y:27.466428756713867}, {x:-418.3077392578125, y:32.40843963623047}, {x:-417.4285583496094, y:37.33042526245117}, {x:-416.4291076660156, y:42.229461669921875}, {x:-415.3111572265625, y:47.102684020996094}, {x:-414.0760498046875, y:51.947566986083984}, {x:-412.72509765625, y:56.76150894165039}, {x:-411.2596740722656, y:61.54179763793945}, {x:-409.680908203125, y:66.28588104248047}, {x:-407.99041748046875, y:70.99140167236328}, {x:-406.1896057128906, y:75.65559387207031}, {x:-404.27972412109375, y:80.2763671875}, {x:-402.2621154785156, y:84.85110473632812}, {x:-400.137939453125, y:89.37738037109375}, {x:-397.9086608886719, y:93.85273742675781}, {x:-395.57562255859375, y:98.27493286132812}, {x:-393.1401672363281, y:102.64154815673828}, {x:-390.6036071777344, y:106.9502182006836}, {x:-387.96722412109375, y:111.19854736328125}, {x:-385.2324523925781, y:115.38423156738281}, {x:-382.4006042480469, y:119.50477600097656}, {x:-379.472900390625, y:123.55789184570312}, {x:-376.4508361816406, y:127.54106140136719}, {x:-373.33587646484375, y:131.4521026611328}, {x:-370.1295166015625, y:135.2885284423828}, {x:-366.83319091796875, y:139.04791259765625}, {x:-363.4484558105469, y:142.72793579101562}, {x:-359.9769287109375, y:146.32618713378906}, {x:-356.4202880859375, y:149.84027099609375}, {x:-352.7801513671875, y:153.267822265625}, {x:-349.05828857421875, y:156.60659790039062}, {x:-345.2567138671875, y:159.85403442382812}, {x:-341.3771667480469, y:163.00802612304688}, {x:-337.42169189453125, y:166.06625366210938}, {x:-333.392333984375, y:169.0265655517578}, {x:-329.2913513183594, y:171.88665771484375}, {x:-325.1208801269531, y:174.6445770263672}, {x:-320.8833923339844, y:177.29818725585938}, {x:-316.5810546875, y:179.845458984375}, {x:-312.216552734375, y:182.28457641601562}, {x:-307.7923583984375, y:184.61399841308594}, {x:-303.3113708496094, y:186.8319091796875}, {x:-298.7762451171875, y:188.93692016601562}, {x:-294.18951416015625, y:190.9271697998047}, {x:-289.5544128417969, y:192.80191040039062}, {x:-284.8739929199219, y:194.56008911132812}, {x:-280.1507263183594, y:196.20018005371094}, {x:-275.3880615234375, y:197.7220458984375}, {x:-270.5890197753906, y:199.12466430664062}, {x:-265.7566223144531, y:200.40780639648438}, {x:-260.8939208984375, y:201.5710906982422}, {x:-256.004150390625, y:202.6147003173828}, {x:-251.09036254882812, y:203.53805541992188}, {x:-246.15557861328125, y:204.34213256835938}, {x:-241.20286560058594, y:205.0272216796875}, {x:-236.23519897460938, y:205.59376525878906}, {x:-231.2554168701172, y:206.04244995117188}, {x:-226.26666259765625, y:206.37442016601562}, {x:-221.27142333984375, y:206.5907745361328}, {x:-216.2725830078125, y:206.69273376464844}, {x:-211.27273559570312, y:206.67965698242188}, {x:-206.2747039794922, y:206.5460205078125}, {x:-201.28125, y:206.29251098632812}, {x:-196.29515075683594, y:205.9217987060547}, {x:-191.3189697265625, y:205.43499755859375}, {x:-186.35552978515625, y:204.83248901367188}, {x:-181.4073486328125, y:204.115234375}, {x:-176.47727966308594, y:203.28318786621094}, {x:-171.5679168701172, y:202.3359832763672}, {x:-166.68234252929688, y:201.27297973632812}, {x:-161.8236846923828, y:200.09310913085938}, {x:-156.99520874023438, y:198.79501342773438}, {x:-152.2005615234375, y:197.37738037109375}, {x:-147.44349670410156, y:195.8384246826172}, {x:-142.72805786132812, y:194.17604064941406}, {x:-138.058837890625, y:192.3881072998047}, {x:-133.44068908691406, y:190.4722442626953}, {x:-128.87879943847656, y:188.42587280273438}, {x:-124.35963439941406, y:186.28636169433594}, {x:-119.84967803955078, y:184.12759399414062}, {x:-115.34774017333984, y:181.9523162841797}, {x:-110.85302734375, y:179.76185607910156}, {x:-106.36559295654297, y:177.55670166015625}, {x:-101.88459777832031, y:175.33843994140625}, {x:-97.40998840332031, y:173.10720825195312}, {x:-92.9411849975586, y:170.86451721191406}, {x:-88.47798919677734, y:168.61065673828125}, {x:-84.02005004882812, y:166.3465576171875}, {x:-79.5667953491211, y:164.0729522705078}, {x:-75.11845397949219, y:161.7901153564453}, {x:-70.6741714477539, y:159.4990234375}, {x:-66.23395538330078, y:157.2001953125}, {x:-61.797698974609375, y:154.89390563964844}, {x:-57.3650016784668, y:152.58053588867188}, {x:-52.93545913696289, y:150.26123046875}, {x:-48.50892639160156, y:147.9362030029297}, {x:-44.08517837524414, y:145.60581970214844}, {x:-39.66410446166992, y:143.27056884765625}, {x:-35.245361328125, y:140.93075561523438}, {x:-30.82889747619629, y:138.5867462158203}, {x:-26.41446304321289, y:136.2386016845703}, {x:-22.002016067504883, y:133.88717651367188}, {x:-17.59105682373047, y:131.53256225585938}, {x:-13.181621551513672, y:129.17520141601562}, {x:-8.773524284362793, y:126.8154067993164}, {x:-4.366595268249512, y:124.45344543457031}, {x:0.03934001922607422, y:122.089599609375}, {x:4.444242000579834, y:119.72386169433594}, {x:8.848639488220215, y:117.35716247558594}, {x:13.252240180969238, y:114.98912048339844}, {x:17.6553897857666, y:112.6200942993164}, {x:22.05854034423828, y:110.25106811523438}, {x:26.461688995361328, y:107.88204956054688}, {x:30.864879608154297, y:105.512939453125}, {x:35.26799011230469, y:103.14385223388672}, {x:39.671104431152344, y:100.7747573852539}, {x:44.07421875, y:98.40567016601562}, {x:48.478111267089844, y:96.03813934326172}, {x:52.882362365722656, y:93.67117309570312}, {x:57.28765106201172, y:91.30599212646484}, {x:61.693267822265625, y:88.94155883789062}, {x:66.09980010986328, y:86.57878875732422}, {x:70.50736236572266, y:84.21805572509766}, {x:74.9160385131836, y:81.85926055908203}, {x:79.32584381103516, y:79.50263214111328}, {x:83.7367935180664, y:77.14839172363281}, {x:88.1491928100586, y:74.79660034179688}, {x:92.56305694580078, y:72.44746398925781}, {x:96.97837829589844, y:70.10122680664062}, {x:101.39527130126953, y:67.75801849365234}, {x:105.8139419555664, y:65.4179458618164}, {x:110.2342758178711, y:63.08127975463867}, {x:114.65648651123047, y:60.74810791015625}, {x:119.0806884765625, y:58.418582916259766}, {x:123.50685119628906, y:56.092899322509766}, {x:127.93518829345703, y:53.77115249633789}, {x:132.36558532714844, y:51.45357894897461}, {x:136.7982177734375, y:49.14028549194336}, {x:141.2323760986328, y:46.829837799072266}, {x:145.6665496826172, y:44.519386291503906}, {x:150.1014404296875, y:42.21028518676758}, {x:154.5364227294922, y:39.90139389038086}, {x:158.9723663330078, y:37.59417724609375}, {x:163.4085235595703, y:35.28754806518555}, {x:167.84564208984375, y:32.98295974731445}, {x:172.28335571289062, y:30.679349899291992}, {x:176.7222900390625, y:28.37799072265625}, {x:181.16197204589844, y:26.07818603515625}, {x:185.60299682617188, y:23.78095054626465}, {x:190.04507446289062, y:21.485774993896484}, {x:194.4883575439453, y:19.192758560180664}, {x:198.93331909179688, y:16.90329360961914}, {x:203.37998962402344, y:14.616969108581543}, {x:207.82846069335938, y:12.33409595489502}, {x:212.2788543701172, y:10.054996490478516}, {x:216.7312774658203, y:7.780014514923096}, {x:221.18600463867188, y:5.509459018707275}, {x:225.64315795898438, y:3.243723154067993}, {x:230.10293579101562, y:0.9832214117050171}, {x:234.56573486328125, y:-1.2715939283370972}, {x:239.03175354003906, y:-3.519717216491699}, {x:243.50123596191406, y:-5.7610931396484375}, {x:247.97439575195312, y:-7.995136737823486}, {x:252.45152282714844, y:-10.221224784851074}, {x:256.9327087402344, y:-12.439037322998047}, {x:261.4189147949219, y:-14.646767616271973}, {x:265.9105224609375, y:-16.843442916870117}, {x:270.40771484375, y:-19.028751373291016}, {x:274.91143798828125, y:-21.200550079345703}, {x:279.4219970703125, y:-23.358150482177734}, {x:283.94024658203125, y:-25.499462127685547}, {x:288.46722412109375, y:-27.622243881225586}, {x:293.00390625, y:-29.72439193725586}, {x:297.55133056640625, y:-31.80284881591797}, {x:302.11126708984375, y:-33.854000091552734}, {x:306.68524169921875, y:-35.873355865478516}, {x:311.2760009765625, y:-37.85439682006836}, {x:315.8861999511719, y:-39.79006576538086}, {x:320.5196228027344, y:-41.66910934448242}, {x:325.1816711425781, y:-43.475894927978516}, {x:329.8796691894531, y:-45.18688201904297}, {x:334.6245422363281, y:-46.76271057128906}, {x:339.43353271484375, y:-48.12913513183594}, {x:344.33355712890625, y:-49.11054611206055}, {x:346.98345947265625, y:-49.308570861816406}, {x:351.9795227050781, y:-49.13803482055664}, {x:356.9500427246094, y:-48.60696792602539}, {x:361.863037109375, y:-47.68603515625}, {x:366.67913818359375, y:-46.3486213684082}, {x:371.3522644042969, y:-44.575775146484375}, {x:375.830322265625, y:-42.3563346862793}, {x:380.0588684082031, y:-39.69240951538086}, {x:383.98345947265625, y:-36.5982666015625}, {x:387.5545654296875, y:-33.10214614868164}, {x:390.72906494140625, y:-29.2423152923584}, {x:393.4737854003906, y:-25.06584358215332}, {x:395.7640380859375, y:-20.62380027770996}, {x:397.5832824707031, y:-15.968876838684082}, {x:398.9211730957031, y:-11.153425216674805}, {x:399.771728515625, y:-6.228424549102783}, {x:400.13079833984375, y:-1.2433879375457764}, {x:399.9918212890625, y:3.752509593963623}, {x:399.346923828125, y:8.70856761932373}, {x:398.203125, y:13.573765754699707}, {x:396.5711975097656, y:18.297618865966797}, {x:394.46453857421875, y:22.829687118530273}, {x:391.9007568359375, y:27.11968421936035}, {x:388.9032897949219, y:31.118677139282227}, {x:385.50244140625, y:34.780765533447266}, {x:381.73541259765625, y:38.06502151489258}, {x:377.64691162109375, y:40.939300537109375}, {x:373.2863464355469, y:43.381492614746094}, {x:368.70587158203125, y:45.38132095336914}, {x:363.9569091796875, y:46.939979553222656}, {x:359.0877380371094, y:48.06932830810547}, {x:354.14117431640625, y:48.78898239135742}, {x:349.1535949707031, y:49.123958587646484}, {x:344.1648254394531, y:48.935848236083984}, {x:339.2683410644531, y:47.93599319458008}, {x:334.4615478515625, y:46.561824798583984}, {x:329.718017578125, y:44.98176956176758}, {x:325.02081298828125, y:43.2685661315918}, {x:320.3591003417969, y:41.460845947265625}, {x:315.7258605957031, y:39.581329345703125}, {x:311.11553955078125, y:37.64619445800781}, {x:306.52459716796875, y:35.66553497314453}, {x:301.95013427734375, y:33.6470947265625}, {x:297.3897705078125, y:31.597021102905273}, {x:292.8417053222656, y:29.519723892211914}, {x:288.30450439453125, y:27.41884994506836}, {x:283.7768859863281, y:25.297399520874023}, {x:279.2579040527344, y:23.157596588134766}, {x:274.7467041015625, y:21.00141143798828}, {x:270.2423095703125, y:18.831035614013672}, {x:265.7444152832031, y:16.64728355407715}, {x:261.2520751953125, y:14.452054977416992}, {x:256.7653503417969, y:12.24538516998291}, {x:252.28326416015625, y:10.029409408569336}, {x:247.805419921875, y:7.804772853851318}, {x:243.33139038085938, y:5.572519302368164}, {x:238.8614044189453, y:3.332165241241455}, {x:234.3946533203125, y:1.0853629112243652}, {x:229.93130493164062, y:-1.168198823928833}, {x:225.4708251953125, y:-3.4274649620056152}, {x:221.01304626464844, y:-5.691975116729736}, {x:216.55770874023438, y:-7.961358547210693}, {x:212.10467529296875, y:-10.235237121582031}, {x:207.65377807617188, y:-12.513246536254883}, {x:203.20481872558594, y:-14.795079231262207}, {x:198.75804138183594, y:-17.08110809326172}, {x:194.31260681152344, y:-19.369810104370117}, {x:189.86854553222656, y:-21.66117286682129}, {x:185.426025390625, y:-23.955522537231445}, {x:180.98464965820312, y:-26.252056121826172}, {x:176.5446014404297, y:-28.551179885864258}, {x:172.10540771484375, y:-30.851943969726562}, {x:167.66738891601562, y:-33.155006408691406}, {x:163.22994995117188, y:-35.45917510986328}, {x:158.79359436035156, y:-37.76539993286133}, {x:154.3575439453125, y:-40.072242736816406}, {x:149.9224395751953, y:-42.38089370727539}, {x:145.4874725341797, y:-44.68978500366211}, {x:141.05325317382812, y:-47.00014114379883}, {x:136.6190643310547, y:-49.31051254272461}, {x:132.1866455078125, y:-51.624359130859375}, {x:127.75698852539062, y:-53.94342041015625}, {x:123.32984924316406, y:-56.267276763916016}, {x:118.90526580810547, y:-58.59603500366211}, {x:114.48291778564453, y:-60.92902755737305}, {x:110.0627212524414, y:-63.26611328125}, {x:105.6445541381836, y:-65.60702514648438}, {x:101.22830200195312, y:-67.95153045654297}, {x:96.81383514404297, y:-70.29935455322266}, {x:92.4009780883789, y:-72.65029907226562}, {x:87.98967742919922, y:-75.00408935546875}, {x:83.57994842529297, y:-77.36083984375}, {x:79.17158508300781, y:-79.72014617919922}, {x:74.76387786865234, y:-82.08068084716797}, {x:70.3576889038086, y:-84.44404602050781}, {x:65.95193481445312, y:-86.80821228027344}, {x:61.547340393066406, y:-89.17455291748047}, {x:57.1435546875, y:-91.54240417480469}, {x:52.74038314819336, y:-93.91138458251953}, {x:48.33750915527344, y:-96.28091430664062}, {x:43.93518829345703, y:-98.65148162841797}, {x:39.53300476074219, y:-101.02233123779297}, {x:35.131107330322266, y:-103.3936767578125}, {x:30.729263305664062, y:-105.76502227783203}, {x:26.327314376831055, y:-108.13636779785156}, {x:21.925241470336914, y:-110.50738525390625}, {x:17.52288055419922, y:-112.87786865234375}, {x:13.120135307312012, y:-115.24761962890625}, {x:8.716843605041504, y:-117.61641693115234}, {x:4.312950134277344, y:-119.98402404785156}, {x:-0.09170889854431152, y:-122.3502197265625}, {x:-4.497245788574219, y:-124.71476745605469}, {x:-8.903834342956543, y:-127.07746124267578}, {x:-13.311531066894531, y:-129.43801879882812}, {x:-17.720470428466797, y:-131.79617309570312}, {x:-22.130878448486328, y:-134.15171813964844}, {x:-26.54278564453125, y:-136.50430297851562}, {x:-30.956436157226562, y:-138.85372924804688}, {x:-35.37196731567383, y:-141.19969177246094}, {x:-39.78942108154297, y:-143.5418243408203}, {x:-44.20911407470703, y:-145.87989807128906}, {x:-48.6312370300293, y:-148.21322631835938}, {x:-53.055885314941406, y:-150.5419158935547}, {x:-57.483421325683594, y:-152.86500549316406}, {x:-61.913822174072266, y:-155.1826934814453}, {x:-66.34732818603516, y:-157.49440002441406}, {x:-70.78385925292969, y:-159.80027770996094}, {x:-75.224365234375, y:-162.09852600097656}, {x:-79.66877746582031, y:-164.38917541503906}, {x:-84.11698913574219, y:-166.67237854003906}, {x:-88.5699691772461, y:-168.94642639160156}, {x:-93.02754974365234, y:-171.21136474609375}, {x:-97.49011993408203, y:-173.46649169921875}, {x:-101.958251953125, y:-175.71055603027344}, {x:-106.43199920654297, y:-177.9434051513672}, {x:-110.91206359863281, y:-180.16351318359375}, {x:-115.398681640625, y:-182.37042236328125}, {x:-119.89258575439453, y:-184.5625457763672}, {x:-124.39385986328125, y:-186.73919677734375}, {x:-128.9059600830078, y:-188.89341735839844}, {x:-133.4851837158203, y:-190.9000244140625}, {x:-138.13943481445312, y:-192.72640991210938}, {x:-142.8521728515625, y:-194.3961639404297}, {x:-147.6114501953125, y:-195.92820739746094}, {x:-152.40879821777344, y:-197.3367919921875}, {x:-157.2374725341797, y:-198.63404846191406}, {x:-162.09266662597656, y:-199.82846069335938}, {x:-166.97023010253906, y:-200.92767333984375}, {x:-171.86712646484375, y:-201.93734741210938}, {x:-176.78109741210938, y:-202.8607635498047}, {x:-181.7099151611328, y:-203.7008819580078}, {x:-186.65219116210938, y:-204.45823669433594}, {x:-191.60658264160156, y:-205.1312713623047}, {x:-196.57220458984375, y:-205.71624755859375}, {x:-201.54815673828125, y:-206.20484924316406}, {x:-206.5338592529297, y:-206.5810546875}, {x:-211.5281982421875, y:-206.81265258789062}, {x:-216.5277862548828, y:-206.84188842773438}, {x:-221.52647399902344, y:-206.734130859375}, {x:-226.52139282226562, y:-206.5117645263672}, {x:-231.50985717773438, y:-206.17352294921875}, {x:-236.48895263671875, y:-205.7184295654297}, {x:-241.4559326171875, y:-205.14553833007812}, {x:-246.40774536132812, y:-204.45423889160156}, {x:-251.34152221679688, y:-203.64395141601562}, {x:-256.2541198730469, y:-202.7135467529297}, {x:-261.1424865722656, y:-201.66360473632812}, {x:-266.0035705566406, y:-200.49374389648438}, {x:-270.83416748046875, y:-199.20388793945312}, {x:-275.6313171386719, y:-197.79470825195312}, {x:-280.391845703125, y:-196.2662811279297}, {x:-285.1127014160156, y:-194.619384765625}, {x:-289.79095458984375, y:-192.85504150390625}, {x:-294.4233093261719, y:-190.97354125976562}, {x:-299.007080078125, y:-188.97669982910156}, {x:-303.5393981933594, y:-186.86561584472656}, {x:-308.017333984375, y:-184.64149475097656}, {x:-312.4381408691406, y:-182.30584716796875}, {x:-316.7991943359375, y:-179.86053466796875}, {x:-321.0980224609375, y:-177.30728149414062}, {x:-325.3320007324219, y:-174.64794921875}, {x:-329.4987487792969, y:-171.88446044921875}, {x:-333.5959167480469, y:-169.0188751220703}, {x:-337.621337890625, y:-166.0532684326172}, {x:-341.57269287109375, y:-162.9897003173828}, {x:-345.4481201171875, y:-159.83059692382812}, {x:-349.24554443359375, y:-156.5780792236328}, {x:-352.9629821777344, y:-153.2345733642578}, {x:-356.59869384765625, y:-149.80233764648438}, {x:-360.1509094238281, y:-146.2837371826172}, {x:-363.617919921875, y:-142.68112182617188}, {x:-366.998046875, y:-138.99691772460938}, {x:-370.2896728515625, y:-135.23338317871094}, {x:-373.4913024902344, y:-131.39295959472656}, {x:-376.6014099121094, y:-127.47816467285156}, {x:-379.61859130859375, y:-123.49130249023438}, {x:-382.54144287109375, y:-119.43465423583984}, {x:-385.3684997558594, y:-115.31080627441406}, {x:-388.0984191894531, y:-111.12197875976562}, {x:-390.7298889160156, y:-106.87055206298828}, {x:-393.2615051269531, y:-102.55899047851562}, {x:-395.6920471191406, y:-98.18958282470703}, {x:-398.0199279785156, y:-93.76467895507812}, {x:-400.2439270019531, y:-89.28667449951172}, {x:-402.3628234863281, y:-84.75801849365234}, {x:-404.375244140625, y:-80.18099975585938}, {x:-406.2799377441406, y:-75.55809783935547}, {x:-408.0755615234375, y:-70.89177703857422}, {x:-409.76068115234375, y:-66.18437194824219}, {x:-411.3337097167969, y:-61.43846893310547}, {x:-412.793701171875, y:-56.65644836425781}, {x:-414.1391296386719, y:-51.84101104736328}, {x:-415.36871337890625, y:-46.994754791259766}, {x:-416.48095703125, y:-42.120174407958984}, {x:-417.4743347167969, y:-37.219879150390625}, {x:-418.3478088378906, y:-32.2969970703125}, {x:-419.0999450683594, y:-27.354082107543945}, {x:-419.7294006347656, y:-22.393980026245117}, {x:-420.2345275878906, y:-17.419673919677734}, {x:-420.61444091796875, y:-12.434255599975586}, {x:-420.8678894042969, y:-7.4408369064331055}, {x:-420.99371337890625, y:-2.442600965499878}];
dateAxis.min = new Date("1969-07-15 12:00").getTime();
dateAxis.max = new Date("1969-07-25 00:00").getTime();
dateAxis.renderer.autoScale = false;

let bgColor = new am4core.InterfaceColorSet().getFor("background");
let altColor = new am4core.InterfaceColorSet().getFor("alternativeBackground");

dateAxis.renderer.line.disabled = true;
dateAxis.cursorTooltipEnabled = false;
dateAxis.renderer.minGridDistance = 30;
dateAxis.baseInterval = {timeUnit:"minute", count:1};
dateAxis.renderer.grid.template.disabled = true;
dateAxis.minZoomCount = 5;

let labelTemplate = dateAxis.renderer.labels.template;
labelTemplate.disabled = true;

let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
categoryAxis.tooltip.disabled = true;
categoryAxis.renderer.innerRadius = -10;
categoryAxis.renderer.radius = 15;
categoryAxis.dataFields.category = "category";
categoryAxis.renderer.labels.template.disabled = true;
categoryAxis.renderer.grid.template.strokeDasharray = "3,3";

chart.seriesContainer.zIndex = -1;

let series = chart.series.push(new am4plugins_timeline.CurveLineSeries());
series.dataFields.dateX = "date";
series.dataFields.categoryY = "category";
series.tooltip.pointerOrientation = "vertical";
series.tooltip.background.fillOpacity = 0.7;
series.strokeOpacity = 0;
series.segments.template.disabled = true;

series.tooltip.background.fillOpacity = 0.5;
series.tooltip.dy = - 15;
series.tooltip.background.stroke = altColor;
series.tooltip.label.wrap = true;
series.tooltip.label.fontSize = 9;
series.tooltip.label.maxWidth = 250;
series.tooltip.label.fill = altColor;
series.tooltip.autoTextColor = false;
series.tooltip.background.fill = bgColor;
series.tooltip.getFillFromObject = false;


let bullet = series.bullets.push(new am4charts.CircleBullet())
bullet.tooltipText = "{dateX} {event}";
bullet.circle.radius = 4;
bullet.fill = altColor;
bullet.fillOpacity = 0.5;
bullet.strokeOpacity = 0;

let hoverState = bullet.states.create("hover")
hoverState.properties.scale = 2;
hoverState.properties.fillOpacity = 1;


let rocketSeries = chart.series.push(new am4plugins_timeline.CurveLineSeries());
rocketSeries.dataFields.dateX = "rdate";
rocketSeries.dataFields.categoryY = "category";
rocketSeries.strokeOpacity = 0;
rocketSeries.segments.template.disabled = true;

let rocketBullet = rocketSeries.bullets.push(new am4charts.CircleBullet())
rocketBullet.fillOpacity = 0;
rocketBullet.strokeOpacity = 1;
rocketBullet.strokeWidth = 2;
rocketBullet.circle.radius = 10;
rocketBullet.stroke = am4core.color("#CC0000");


let image = chart.curveContainer.createChild(am4core.Image);
image.href = "moon.png";
image.isMeasured = false;
image.x = 350;
image.y = 0;
image.width = 70;
image.height = 70;
image.horizontalCenter = "middle";
image.verticalCenter = "middle";

let titleLabel = chart.curveContainer.createChild(am4core.Label);
titleLabel.isMeasured = false;
titleLabel.y = 0;
titleLabel.horizontalCenter = "middle";
titleLabel.verticalCenter = "middle";
titleLabel.text = "Apollo 11 timeline";
titleLabel.fontSize = 10;

titleLabel.events.on("validated", ()=>{
    titleLabel.path = dateAxis.renderer.line.path;
    titleLabel.locationOnPath = 0.29;
});

let slider = container.createChild(am4core.Slider);
slider.width = 600;
slider.align = "center";
slider.y = am4core.percent(90);

let nearestDataItem;
let currentNearestBullet;

slider.events.on("rangechanged", ()=>{
    let value = dateAxis.min + slider.start * (dateAxis.max - dateAxis.min);    
    let difference = Infinity;

    series.dataItems.each((dataItem)=>{
        let newDiff = Math.abs(dataItem.dateX.getTime() - value);
        if(newDiff < difference){
            nearestDataItem = dataItem;
            difference = newDiff;
        }
    })

    rocketSeries.dataItems.getIndex(0).setWorkingValue("dateX", nearestDataItem.dateX.getTime());

    let nearestBullet = nearestDataItem.bullets.getKey(bullet.uid);
    if(nearestBullet){
        
        if(currentNearestBullet && currentNearestBullet != nearestBullet){
            currentNearestBullet.isHover = false;
        }

        nearestBullet.isHover = true;

        currentNearestBullet = nearestBullet;
    }

    mapChart.deltaLongitude = 360 * slider.start;
})


let mapChart = chart.curveContainer.createChild(am4maps.MapChart);
mapChart.horizontalCenter = "middle";
mapChart.verticalCenter = "middle";
mapChart.dx = -213;

// Set map definition
try {
    mapChart.geodata = am4geodata_continentsLow;
}
catch (e) {
    mapChart.raiseCriticalError(new Error("Map geodata could not be loaded. Please download the latest <a href=\"https://www.amcharts.com/download/download-v4/\">amcharts geodata</a> and extract its contents into the same directory as your amCharts files."));
}

mapChart.projection = new am4maps.projections.Orthographic();
mapChart.panBehavior = "rotateLongLat";

mapChart.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color("#ffffff");
mapChart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 0.1;

mapChart.width = 280;
mapChart.height = 280;

// Create map polygon series
var polygonSeries = mapChart.series.push(new am4maps.MapPolygonSeries());
polygonSeries.useGeodata = true;
polygonSeries.mapPolygons.template.fill = altColor;
polygonSeries.mapPolygons.template.strokeOpacity = 0;
polygonSeries.mapPolygons.template.fillOpacity = 0.2;

let graticuleSeries = mapChart.series.push(new am4maps.GraticuleSeries());
graticuleSeries.fitExtent = false;
graticuleSeries.mapLines.template.stroke = altColor;
graticuleSeries.mapLines.template.strokeOpacity = 0.1;


mapChart.panBehavior = "none";