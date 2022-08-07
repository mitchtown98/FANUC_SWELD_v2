//---------------V A R I A B L E S------------------------
//---------------------V E R S v.1.80---------------------
const KAREL_NAME = "IPL_FANUC_SWELD_CFG";
const KAREL_URL = "/KARELCMD/IPL_FANUC_SWELD_SERVER?index=";
const COMMA = ",";
const MODAL = document.getElementById("modal");
const WELDSTART = 0;
const WELDEND = 1;
const WELDLEN = 2;
const WELDPITCH = 3;
const WELDPROCEDURE = 4;
const WELDSCHEDULE = 5;
const WELDSPEED = 6;
const SPEEDUNIT = 7;
const TPPNAME = 8;
//---------------------------------------

class WeldArgs {
  constructor(start, end, len, pitch, procedure, schedule, speed, unit, name) {
    this.start = start;
    this.end = end;
    this.len = len;
    this.pitch = pitch;
    this.procedure = procedure;
    this.schedule = schedule;
    this.speed = speed;
    this.unit = unit;
    this.name = name;
  }
}

const detailWeldClass = new WeldArgs(
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "EMPTY"
);
var paramString = "";
var lastSpeedValue;
var lastSpeedUnit;
var instructionParamString = "";

//(Start PR, End PR, Length, Pitch, Procedure, Sched, Speed, SpeedUnit, TP Name)
function initArgParam(valStr) {
  instructionParamString = "1,2,6.3,3,1,1,25,1" + valStr;
  //parent.setInstructionParam(instructionParamString);
}

// -----------------------D I S P L A Y-------------------------
function dispAdvInstData(argStr) {
  if (argStr.length === 0) {
    sweldLog("argStr for dispAdvInstData length was zero.");
    return false;
  }
  //initArgParam("'FROM_DISP'");
  parent.setInstructionParam(argStr);
  var params = argStr.split(",");
  var tempPrm = params[8].replace(/'/g, "");
  params[8] = tempPrm;

  //Update arg fields
  document.getElementById("setStart").refresh(params[0], "1", "100", false);
  document.getElementById("setEnd").refresh(params[1], "1", "100", false);
  document.getElementById("setLen").refresh(params[2], "1.0", "100.0", false);
  document.getElementById("setPitch").refresh(params[3], "1", "25", false);
  document.getElementById("setProcedure").refresh(params[4], "1", "99", false);
  document.getElementById("setSched").refresh(params[5], "1", "99", false);
  document.getElementById("setSpeed").refresh(params[6], "1", "250", false);
  document.getElementById("setSpeedUnit").refresh([], params[7], null, false);
  document.getElementById("setName").refresh(params[8], "36", false);

  //Register callbacks
  document.getElementById("setStart").setCallback(callbackSetStart);
  document.getElementById("setEnd").setCallback(callbackSetEnd);
  document.getElementById("setLen").setCallback(callbackSetLen);
  document.getElementById("setPitch").setCallback(callbackSetPitch);
  document.getElementById("setProcedure").setCallback(callbackSetProcedure);
  document.getElementById("setSched").setCallback(callbackSetSched);
  document.getElementById("setSpeed").setCallback(callbackSetSpeed);
  document.getElementById("setSpeedUnit").setCallback(callbackSetSpeedUnit);
  document.getElementById("setName").setCallback(callbackSetName);

  getValuesForWeldClass();

  console.log(dispAdvInstData.name, "finished.");

  return true;
}
//-------------Functions for Modal-----------------

function callBack_touchUpModal(btn) {
  var dialogString = "";
  if (btn.id == "start-tchp") {
    //Set Index for StartPr
    $("#modalType").val(detailWeldClass.start);
    dialogString = "Ok to touchup PR[ " + detailWeldClass.start + " ]?";
  }

  if (btn.id == "end-tchp") {
    //Set Index for EndPr
    $("#modalType").val(detailWeldClass.end);

    dialogString = "Ok to touchup PR[ " + detailWeldClass.end + " ]?";
    console.log(btn.id, "Clicked");
  }
  document.getElementById("touchup-dialog").innerHTML = dialogString;
  MODAL.showModal();
}

function touchUp_Ok(btn) {
  var pridx = $("#modalType").val();
  console.log("Type Called = " + pridx);

  if (pridx != 0) {
    httpGetPrTouchup(pridx);
  }
  modalType = 0;
  MODAL.close();
}

function touchUp_Cancel(btn) {
  MODAL.close();
}
/*
 *
 * httpGetPrTouchup:
 *      SWELD_SERVER gets current position and sets PR [value]
 */
function httpGetPrTouchup(value) {
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", KAREL_URL + value, true);
  xhttp.send();
}
//--------------------End Functions for Modal--------------

function setArgStr(valStr) {
  var formatStr = "'" + valStr + "'";
  return formatStr;
}

function returnCompleteInstructionParam(inputArr) {
  inputArr[TPPNAME] = "'" + inputArr[TPPNAME] + "'";
  inputArr.join(",");
  var completeParamString = inputArr.toString();
  return completeParamString;
}

function getValuesForWeldClass() {
  detailWeldClass.start = document.getElementById("setStart").getValue();
  detailWeldClass.end = document.getElementById("setEnd").getValue();
  detailWeldClass.len = document.getElementById("setLen").getValue();
  detailWeldClass.pitch = document.getElementById("setPitch").getValue();
  detailWeldClass.procedure = document
    .getElementById("setProcedure")
    .getValue();
  detailWeldClass.schedule = document.getElementById("setSched").getValue();
  detailWeldClass.speed = document.getElementById("setSpeed").getValue();
  detailWeldClass.unit = document.getElementById("setSpeedUnit").getValue();
  detailWeldClass.name = document.getElementById("setName").getValue();
}

//1 Start PR
function callbackSetStart(id, operation, value) {
  var setUpdateOne = [];
  setUpdateOne[0] = value;
  setUpdateOne[1] = document.getElementById("setEnd").getValue();
  setUpdateOne[2] = document.getElementById("setLen").getValue();
  setUpdateOne[3] = document.getElementById("setPitch").getValue();
  setUpdateOne[4] = document.getElementById("setProcedure").getValue();
  setUpdateOne[5] = document.getElementById("setSched").getValue();
  setUpdateOne[6] = document.getElementById("setSpeed").getValue();
  setUpdateOne[7] = document.getElementById("setSpeedUnit").getValue();
  setUpdateOne[8] = document.getElementById("setName").getValue();

  // console.log(detailArray.toString());
  // $.each(argClass, function (key, value) {
  //   console.log(key, value);
  // });

  detailWeldClass.start = setUpdateOne[0];
  detailWeldClass.end = setUpdateOne[1];

  parent.setInstructionParam(returnCompleteInstructionParam(setUpdateOne));
}

//2 End PR
function callbackSetEnd(id, operation, value) {
  var setUpdateTwo = [];
  setUpdateTwo[0] = document.getElementById("setStart").getValue();
  setUpdateTwo[1] = value;
  setUpdateTwo[2] = document.getElementById("setLen").getValue();
  setUpdateTwo[3] = document.getElementById("setPitch").getValue();
  setUpdateTwo[4] = document.getElementById("setProcedure").getValue();
  setUpdateTwo[5] = document.getElementById("setSched").getValue();
  setUpdateTwo[6] = document.getElementById("setSpeed").getValue();
  setUpdateTwo[7] = document.getElementById("setSpeedUnit").getValue();
  setUpdateTwo[8] = document.getElementById("setName").getValue();

  detailWeldClass.start = setUpdateTwo[0];
  detailWeldClass.end = setUpdateTwo[1];

  parent.setInstructionParam(returnCompleteInstructionParam(setUpdateTwo));
}

//3 Weld Length
function callbackSetLen(id, operation, value) {
  var setUpdateThree = [];
  setUpdateThree[0] = document.getElementById("setStart").getValue();
  setUpdateThree[1] = document.getElementById("setEnd").getValue();
  setUpdateThree[2] = value;
  setUpdateThree[3] = document.getElementById("setProcedure").getValue();
  setUpdateThree[4] = document.getElementById("setPitch").getValue();
  setUpdateThree[5] = document.getElementById("setSched").getValue();
  setUpdateThree[6] = document.getElementById("setSpeed").getValue();
  setUpdateThree[7] = document.getElementById("setSpeedUnit").getValue();
  setUpdateThree[8] = document.getElementById("setName").getValue();

  parent.setInstructionParam(returnCompleteInstructionParam(setUpdateThree));
}

//4 Weld Pitch
function callbackSetPitch(id, operation, value) {
  var setUpdateFour = [];
  setUpdateFour[0] = document.getElementById("setStart").getValue();
  setUpdateFour[1] = document.getElementById("setEnd").getValue();
  setUpdateFour[2] = document.getElementById("setLen").getValue();
  setUpdateFour[3] = value;
  setUpdateFour[4] = document.getElementById("setProcedure").getValue();
  setUpdateFour[5] = document.getElementById("setSched").getValue();
  setUpdateFour[6] = document.getElementById("setSpeed").getValue();
  setUpdateFour[7] = document.getElementById("setSpeedUnit").getValue();
  setUpdateFour[8] = document.getElementById("setName").getValue();

  parent.setInstructionParam(returnCompleteInstructionParam(setUpdateFour));
}

//5 Weld Procedure
function callbackSetProcedure(id, operation, value) {
  var setUpdateFive = [];
  setUpdateFive[0] = document.getElementById("setStart").getValue();
  setUpdateFive[1] = document.getElementById("setEnd").getValue();
  setUpdateFive[2] = document.getElementById("setLen").getValue();
  setUpdateFive[3] = document.getElementById("setPitch").getValue();
  setUpdateFive[4] = value;
  setUpdateFive[5] = document.getElementById("setSched").getValue();
  setUpdateFive[6] = document.getElementById("setSpeed").getValue();
  setUpdateFive[7] = document.getElementById("setSpeedUnit").getValue();
  setUpdateFive[8] = document.getElementById("setName").getValue();

  parent.setInstructionParam(returnCompleteInstructionParam(setUpdateFive));
}

//6 Weld Sched
function callbackSetSched(id, operation, value) {
  var setUpdateSix = [];
  setUpdateSix[0] = document.getElementById("setStart").getValue();
  setUpdateSix[1] = document.getElementById("setEnd").getValue();
  setUpdateSix[2] = document.getElementById("setLen").getValue();
  setUpdateSix[3] = document.getElementById("setPitch").getValue();
  setUpdateSix[4] = document.getElementById("setProcedure").getValue();
  setUpdateSix[5] = value;
  setUpdateSix[6] = document.getElementById("setSpeed").getValue();
  setUpdateSix[7] = document.getElementById("setSpeedUnit").getValue();
  setUpdateSix[8] = document.getElementById("setName").getValue();

  parent.setInstructionParam(returnCompleteInstructionParam(setUpdateSix));
}

//7 Weld Speed
function callbackSetSpeed(id, operation, value) {
  var setUpdateSeven = [];
  setUpdateSeven[0] = document.getElementById("setStart").getValue();
  setUpdateSeven[1] = document.getElementById("setEnd").getValue();
  setUpdateSeven[2] = document.getElementById("setLen").getValue();
  setUpdateSeven[3] = document.getElementById("setPitch").getValue();
  setUpdateSeven[4] = document.getElementById("setProcedure").getValue();
  setUpdateSeven[5] = document.getElementById("setSched").getValue();
  setUpdateSeven[6] = value;
  setUpdateSeven[7] = document.getElementById("setSpeedUnit").getValue();
  setUpdateSeven[8] = document.getElementById("setName").getValue();

  parent.setInstructionParam(returnCompleteInstructionParam(setUpdateSeven));
}

//8 Weld Speed Unit
function callbackSetSpeedUnit(id, operation, value) {
  var setUpdateEight = [];
  setUpdateEight[0] = document.getElementById("setStart").getValue();
  setUpdateEight[1] = document.getElementById("setEnd").getValue();
  setUpdateEight[2] = document.getElementById("setLen").getValue();
  setUpdateEight[3] = document.getElementById("setPitch").getValue();
  setUpdateEight[4] = document.getElementById("setProcedure").getValue();
  setUpdateEight[5] = document.getElementById("setSched").getValue();
  setUpdateEight[6] = document.getElementById("setSpeed").getValue();
  setUpdateEight[7] = value;
  setUpdateEight[8] = document.getElementById("setName").getValue();

  parent.setInstructionParam(returnCompleteInstructionParam(setUpdateEight));
}

//9 TP Name
function callbackSetName(id, operation, value) {
  var setUpdateNine = [];
  setUpdateNine[0] = document.getElementById("setStart").getValue();
  setUpdateNine[1] = document.getElementById("setEnd").getValue();
  setUpdateNine[2] = document.getElementById("setLen").getValue();
  setUpdateNine[3] = document.getElementById("setPitch").getValue();
  setUpdateNine[4] = document.getElementById("setProcedure").getValue();
  setUpdateNine[5] = document.getElementById("setSched").getValue();
  setUpdateNine[6] = document.getElementById("setSpeed").getValue();
  setUpdateNine[7] = document.getElementById("setSpeedUnit").getValue();
  setUpdateNine[8] = value;

  parent.setInstructionParam(returnCompleteInstructionParam(setUpdateNine));
}

/*********** D O C  L O A D I N G *************** */
function sweldDetailHasLoaded() {
  console.log(document.title, "--Loaded");
}

function sweldDetailLoad(callback) {
  if (document.readyState === "complete") {
    callback();
  } else {
    window.addEventListener("load", callback);
  }
}

sweldDetailLoad(function () {
  sweldDetailHasLoaded();
});
