/******
this script draws a color wheel in the center of the screen
clicking on the wheel changes the color of the circle in the middle
clicking on the circle in the middle will end the routine
the running of this script is dependent on a working psychoJS library and the following helper functions:
arange; HSVtoRGB; nearest; deg2rad; getRandomInt;
*******/


import { PsychoJS } from './lib/core-2020.2.js';
import * as core from './lib/core-2020.2.js';
import { TrialHandler } from './lib/data-2020.2.js';
import { Scheduler } from './lib/util-2020.2.js';
import * as visual from './lib/visual-2020.2.js';
import * as sound from './lib/sound-2020.2.js';
import * as util from './lib/util-2020.2.js';
//some handy aliases as in the psychopy scripts;
const { abs, sin, cos, PI: pi, sqrt } = Math;

// init psychoJS:
const psychoJS = new PsychoJS({
  debug: true
});
// open window:
psychoJS.openWindow({
  fullscr: false,
  color: new util.Color([0,0,0]),
  units: 'pix',
  waitBlanking: true //mark
});

let expName = 'draw_wheel';
let expInfo = {};
// schedule the experiment:
psychoJS.schedule(psychoJS.gui.DlgFromDict({
  dictionary: expInfo,
  title: expName
}));
const flowScheduler = new Scheduler(psychoJS);
const dialogCancelScheduler = new Scheduler(psychoJS);
psychoJS.scheduleCondition(function() { return (psychoJS.gui.dialogComponent.button === 'OK'); }, flowScheduler, dialogCancelScheduler);

// flowScheduler
flowScheduler.add(experimentInit);
flowScheduler.add(wheelRoutineBegin());
flowScheduler.add(wheelRoutineEachFrame());
flowScheduler.add(wheelRoutineEnd());
flowScheduler.add(quitPsychoJS, '', true);
// quit if user presses Cancel in dialog box:
dialogCancelScheduler.add(quitPsychoJS, '', false);

// ---------------------- start ----------------//
psychoJS.start({
  expName: expName,
  expInfo: expInfo,
  resources: []
});

// basic design info
var frameDur;
var frames;
var globalClock;
var routineTimer;
var t;
var frameN;
var wheelClock;
var wheelSize;
var wheelRadius;
var wheelInnerRadius;
var wheelRadians;
var wheelRadiansList = [];
var linelist = [];
var shape;
var micky;

function experimentInit() {
  globalClock = new util.Clock();  // to track the time since experiment started
  routineTimer = new util.CountdownTimer();  // to track time remaining of each (non-slip) routine
  wheelClock = new util.Clock;

  for (var i in arange(0,360,0.3)) {
    linelist[i] = new visual.ShapeStim ({win: psychoJS.window, pos: [0,0], opacity:1});
  };
  shape = new visual.Polygon({win : psychoJS.window, size: 128, lineWidth: 0, edges: 200});

  // mice
  micky = new core.Mouse({win: psychoJS.window});
  micky.mouseClock = new util.Clock();

  return Scheduler.Event.NEXT;
}

var wheelComponents;
var gotValidClick;
var clicked_color;
var offset;
var arr;
function wheelRoutineBegin(snapshot) {
  return function () {
    t = 0;
    wheelClock.reset(); // clock
    frameN = -1;

    // set components
    clicked_color = [];

    wheelSize = 300;
    wheelRadius = wheelSize/2;
    wheelInnerRadius = wheelRadius * 0.8

    arr = arange(0,360,0.3);
    offset = getRandomInt(arr.length);

    for (var idx = 0; idx < arr.length; idx++) {
      var pointer = (idx + offset) % arr.length;

      wheelRadians = deg2rad(arr[idx]);
      wheelRadiansList[idx] = wheelRadians;

      linelist[idx].setVertices([[wheelInnerRadius * Math.cos(wheelRadians), wheelInnerRadius * Math.sin(wheelRadians)],
                                [wheelRadius * Math.cos(wheelRadians), wheelRadius * Math.sin(wheelRadians)]])

      var conv_col = HSVtoRGB(arr[idx]/360,1,1);

      linelist[pointer].setLineColor(new util.Color(conv_col));
    }

    shape.setFillColor(new util.Color('white'));

    // set up the mice
    micky.clicked_name = [];
    gotValidClick = false;

    // push components
    wheelComponents = [];
    wheelComponents.push(shape, micky);
    for (var i = 0; i < linelist.length; i++) {
      wheelComponents.push(linelist[i]);
    }

    for (const thisComponent of wheelComponents)
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;

    return Scheduler.Event.NEXT;
  };
}
var continueRoutine;
var prevButtonState;
function wheelRoutineEachFrame(snapshot) {
  return function () {
    let continueRoutine = true;
    t = wheelClock.getTime();
    frameN = frameN + 1;

    for (var idx in arange(0,360,0.3)) {
      linelist[idx].draw();
    }

    console.log(shape.status);
    if (t >= 0.0 && shape.status === PsychoJS.Status.NOT_STARTED) {
      shape.setAutoDraw(true);
    }

    if (t >= 0.0 && micky.status === PsychoJS.Status.NOT_STARTED) {
      micky.tStart = t;
      micky.frameNStart = frameN;
      micky.status = PsychoJS.Status.STARTED;
      micky.mouseClock.reset();
      prevButtonState = micky.getPressed();
    }
    if (micky.status === PsychoJS.Status.STARTED) {
      let buttons = micky.getPressed();
      if (!buttons.every( (e,i,) => (e == prevButtonState[i]) )) { // button state changed?
        prevButtonState = buttons;
        if (buttons.reduce( (e, acc) => (e+acc) ) > 0) { // state changed to a new click
          // check if the mouse was inside our 'clickable' objects
          gotValidClick = false;

          // get color
          const xys = micky.getPos();
          var mouse_deg = Math.atan2(xys[1] - shape.pos[1], xys[0] - shape.pos[0]);
          if (mouse_deg < 0) {
            mouse_deg = Math.PI * 2 + mouse_deg;
          }
          //console.log(mouse_deg);
          var mouse_idx = nearest(mouse_deg, wheelRadiansList);
          //var mouse_idx_offset = (mouse_idx + offset) % arr.length;
          shape.setFillColor(new util.Color(linelist[mouse_idx].lineColor));

          //console.log(clicked_color[-1]);
          for (const obj of [shape]) {
            if (obj.contains(micky)) {
              gotValidClick = true;
            }
          }

          if (gotValidClick === true) { // abort routine on response
            continueRoutine = false;
          }
        }
      }
    }


    if (!continueRoutine) {
      return Scheduler.Event.NEXT;
    }

    continueRoutine = false;
    for (const thisComponent of wheelComponents)
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
        break;
      }

    if (continueRoutine) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  };
}
function wheelRoutineEnd(snapshot) {
  return function(){
    for (const thisComponent of wheelComponents) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    }
    routineTimer.reset();
    return Scheduler.Event.NEXT;
  };
}

function quitPsychoJS(message, isCompleted) {
  // Check for and save orphaned data
  if (psychoJS.experiment.isEntryEmpty()) {
    psychoJS.experiment.nextEntry();
  }
  psychoJS.window.close();
  psychoJS.quit({message: message, isCompleted: isCompleted});

  return Scheduler.Event.QUIT;
}
