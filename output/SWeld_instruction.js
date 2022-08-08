/**
 * Handles User input and logic for passing agruments to the Main Karel routing
 * for creating segments of a weld
 * @file SWeld_instruction.js
 * @version {K_VERS} Constant for storing version number
 */
// Constanst for keeping the code readable
const INSTR_NAME = "IPL_FANUC_SWELD";
const KAREL_NAME = "IPL_FANUC_SWELD_CFG";
const KAREL_URL = "/KARELCMD/IPL_FANUC_SWELD_SERVER?index=";
const MODAL = document.getElementById("modal");
const ERR_MODAL = document.getElementById("modal-err");
const HELP_MODAL = document.getElementById("modal-help");
const SPEED_COEFFICIENT = 2.3622;
const MIN_IDX = "1";
const MAX_IDX = "100";
const MIN_WLEN = "1.0";
const MAX_WLEN = "100.0";
const MIN_PITCH = "1";
const MAX_PITCH = "25";
const MAX_SPEED_MM = "251";
const MAX_SPEED_INCH = "590.5";
const MIN_SPEED = "1";
const MAX_TPNAME_LEN = "8";
const MIN_TPNAME_LEN = "2";
const MM_SEC = "0";
const INCH_MIN = "3";
const DEFAULT_SPEED_MM = "25";
const DEFAULT_SPEED_INCH = "60";
const K_VERS = "v1.80";

var err = {
  errName: "",
  errCause: "",
  errAction: "",
};

//===============================================================================
/**
 * Creates an object for holding user paramters for the Instruction
 * @class
 * @constructor Supply all data for members.
 */
//===============================================================================
class WeldArgs {
  static SPEEDUNIT = 7;
  static TPPNAME = 8;

  /**
   * @constructs WeldArgs
   */

  /**
   * @param {integer} start
   * @param {integer} end
   * @param {float} length
   * @param {integer} pitch
   * @param {integer} procedure
   * @param {integer} schedule
   * @param {float} speed
   * @param {integer} speedunit
   * @param {string} tpname
   */
  constructor(
    start,
    end,
    length,
    pitch,
    procedure,
    schedule,
    speed,
    speedunit,
    tpname
  ) {
    this.start = start;
    this.end = end;
    this.wlength = length;
    this.wpitch = pitch;
    this.wprocedure = procedure;
    this.wschedule = schedule;
    this.speed = speed;
    this.speedunit = speedunit;
    this.tpname = tpname;
  }

  /**
   * This can be used to update the argument object for display.
   * @param {array} paramArr Member data needs to be passed as an array.
   */
  updateParams(paramArr) {
    this.start = paramArr[0];
    this.end = paramArr[1];
    this.wlength = paramArr[2];
    this.wpitch = paramArr[3];
    this.wprocedure = paramArr[4];
    this.wschedule = paramArr[5];
    this.speed = paramArr[6];
    this.speedunit = paramArr[7];
    this.tpname = paramArr[8];
  }
}

//===============================================================================
/**
 * Instantiates WeldArgs Object.
 * @constant {WeldArgs} param This is the main object for the instruction.
 */
//===============================================================================
const param = new WeldArgs("0", "0", "0.0", "0", "0", "0", "0", "0", "empty");

/*============================E V E N T S============================*/
document.getElementById("setStart").addEventListener("change", callBackStartPR);
document.getElementById("setEnd").addEventListener("change", callBackEndPR);
document
  .getElementById("setLen")
  .addEventListener("change", callBackWeldLength);
document
  .getElementById("setPitch")
  .addEventListener("change", callBackWeldPitch);
document
  .getElementById("setProcedure")
  .addEventListener("change", callBackWeldProcedure);
document
  .getElementById("setSched")
  .addEventListener("change", callBackWeldSchedule);
document.getElementById("setSpeed").addEventListener("change", callBackSpeed);
document
  .getElementById("speedSelect")
  .addEventListener("change", callBackSpeedSelect);
document.getElementById("setName").addEventListener("change", callBackTpName);

//===============================================================================
/** Ensures the user supplied string does not start with a Number.
 * @function checkvalidTpName
 * @param {string} str Input user supplied TPP Name.
 * @returns {boolean} True if the string is a Valid TPP Name.
 */
//===============================================================================
function checkValidTpName(str) {
  let regexPattern = /^[0-9]/;
  let invalid = regexPattern.test(str);

  if (invalid) {
    return false;
  } else {
    return true;
  }
}
//=========================================================
/**
 * Parses Int or Float User input.
 * @param {number} inputValue
 * @returns {boolean} use the boolean for validation.
 */
//=========================================================
function parameterCheck(inputValue) {
  let actualValue, minValue, maxValue;

  let regexPattern = /^-?[0-9]+$/;
  let result = regexPattern.test(inputValue.value);

  if (result) {
    actualValue = parseInt(inputValue.value);
    minValue = parseInt(inputValue.min);
    maxValue = parseInt(inputValue.max);
    console.log("Number was an Integer");
  } else {
    actualValue = parseFloat(inputValue.value);
    minValue = parseFloat(inputValue.min);
    maxValue = parseFloat(inputValue.max);
    console.log("Number was a Float");
  }
  var inrange = true;
  //check range
  if (actualValue < minValue || actualValue > maxValue) {
    inrange = false;
    inputValue.value = inputValue.oldvalue;
  }
  console.log("check = ", inrange);
  return inrange;
}

//===============================================================================
/**
 * Called when users drags the instruction into the timeline.
 * @param {string} argStr The initial parameters are parsed in from the instruction XML.
 * @returns boolean
 */
//===============================================================================
function dropAdvInstData(argStr) {
  if (argStr.length === 0) {
    return false;
  }
  var params = argStr.split(",");
  var tempPrm = params[8].replace(/'/g, "");
  params[8] = tempPrm;

  top.ihmi_setVar(KAREL_NAME, "version", K_VERS);

  param.updateParams(params);

  updateDisplay();

  return true;
}

//===============================================================================
/**
 * This function is the interface for displaying intuction details.
 *
 * @param {string} argStr Current parameters passed as args to the instruction.
 * @returns boolean
 */
//===============================================================================
function dispAdvInstData(argStr) {
  if (argStr.length === 0) {
    console.log("argStr for dispAdvInstData length was zero.");
    return false;
  }
  console.log(dispAdvInstData.name, "finished.");

  return true;
}

/*============================C A L L   B A C K S============================*/
function updateDisplay() {
  // Update Display Screen Input
  $("#setStart").val(param.start);
  $("#setEnd").val(param.end);
  $("#setLen").val(param.wlength);
  $("#setPitch").val(param.wpitch);
  $("#setProcedure").val(param.wprocedure);
  $("#setSched").val(param.wschedule);
  $("#setSpeed").val(param.speed);
  $("#speedSelect").val(param.speedunit);
  $("#setName").val(param.tpname);
  callBackUpdateInstrParam();
}

function callBackErrorModal(name, cause, action) {
  $("#error-header").html(name);
  $("#error-cause").html(cause);
  $("#error-action").html(action);
  ERR_MODAL.showModal();
}

function callBackModalOk(btn) {
  ERR_MODAL.close();
}

function callBackHelpModalOk(btn) {
  HELP_MODAL.close();
}
/*
 =========================================================================
 @Touch Up Modal Functions  : callBackTouchUpModal(btn) - btn id sets Start or End
                            : touchUpOk(btn)            - Ok calls HTTP request to Karel, 
                                                          closes modal                            
                            : httpGetPrTouchup          - GET request using PR index to Karel,
                                                          gets CURRPOS and sets PR
                            : touchUpCancel(btn)        - Closes Modal
 =========================================================================
*/

function callBackTouchUpModal(btn) {
  var dialogString = "";
  if (btn.id == "start-tchp") {
    $("#modalType").val(param.start);
    dialogString = "Ok to touchup PR[ " + param.start + " ]?";
  }

  if (btn.id == "end-tchp") {
    $("#modalType").val(param.end);

    dialogString = "Ok to touchup PR[ " + param.end + " ]?";
    console.log(btn.id, "Clicked");
  }
  document.getElementById("touchup-dialog").innerHTML = dialogString;
  MODAL.showModal();
}

function touchUpOk(btn) {
  var pridx = $("#modalType").val();
  console.log("Type Called = " + pridx);

  if (pridx != 0) {
    httpGetPrTouchup(pridx);
  }
  modalType = 0;
  MODAL.close();
}

function touchUpCancel(btn) {
  MODAL.close();
}

//===============================================================================
/**
 * HTTP Request to a Karel routine.  It get's the current position,
 * and records to the PR[value].
 * @param {integer} value Index of the PR to touchup.
 */
//===============================================================================
function httpGetPrTouchup(value) {
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", KAREL_URL + value, true);
  xhttp.send();
}

//===============================================================================
/**
 * This uses the latest parameters and creates one argument string for the Instruction.
 * @param {WeldArgs} argsObject This object holds the current parameters set by the Instruction display.
 */
//===============================================================================
function callBackUpdateInstrParam(argsObject) {
  var paramstring = JSON.parse(JSON.stringify(Object.values(argsObject)));

  paramstring[WeldArgs.TPPNAME] = "'" + paramstring[WeldArgs.TPPNAME] + "'";
  console.log(paramstring);

  paramstring.join(",");

  let statusString = INSTR_NAME + "(" + paramstring.toString() + ")";
  $("#statusBox").html(statusString);

  parent.setInstructionParam(paramstring.toString());
}

/*
 =========================================================================
 @function name        : callBackStartPR
 @argument[targetElm]  : 
 @description          : Update PR index and set instruction param
 @return               : none
 =========================================================================
*/
function callBackStartPR() {
  let success = parameterCheck(this);

  if (!success) {
    err.errName = "Starting PR Index";
    err.errCause = "Index not Valid.";
    err.errAction = "Enter an integer between 1 and 100.";

    callBackErrorModal(err.errName, err.errCause, err.errAction);
    return;
  } else {
    param.start = this.value;
    callBackUpdateInstrParam();
  }
}

/*
 =========================================================================
 @function name        : callBackEndPR
 @argument[targetElm]  : 
 @description          : Update PR index and set instruction param
 @return               : none
 =========================================================================
*/
function callBackEndPR() {
  let success = parameterCheck(this);
  if (!success) {
    err.errName = "Ending PR Index";
    err.errCause = "Index not Valid.";
    err.errAction = "Enter an integer between 1 and 100.";

    callBackErrorModal(err.errName, err.errCause, err.errAction);
    return;
  } else {
    param.end = this.value;
    callBackUpdateInstrParam();
  }
}

/*
 =========================================================================
 @function name        : callBackWeldLength
 @argument[targetElm]  : 
 @description          : Update Weld length and set instruction param
 @return               : none
 =========================================================================
*/
function callBackWeldLength() {
  let success = parameterCheck(this);

  if (!success) {
    err.errName = "Weld Length";
    err.errCause = "Length not Valid.";
    err.errAction = "Enter an integer between " + this.min + " and" + this.max;

    callBackErrorModal(err.errName, err.errCause, err.errAction);
  } else {
    param.wlength = this.value;
    callBackUpdateInstrParam();
  }
}

/*
 =========================================================================
 @function name        : callBackWeldPitch
 @argument[targetElm]  : 
 @description          : Update Weld Pitch and set instruction param
 @return               : none
 =========================================================================
*/
function callBackWeldPitch() {
  let success = parameterCheck(this);

  if (!success) {
    err.errName = "Weld Pitch";
    err.errCause = "Pitch number not Valid.";
    err.errAction = "Enter an integer between ${MIN_PITCH} and ${MAX_PITCH}";

    callBackErrorModal(err.errName, err.errCause, err.errAction);

    return;
  } else {
    param.wpitch = this.value;
    callBackUpdateInstrParam();
  }
}

/*
 =========================================================================
 @function name        : callBackWeldProcedure
 @argument[targetElm]  : 
 @description          : Update Weld Procedure and set instruction param
 @return               : none
 =========================================================================
*/
function callBackWeldProcedure() {
  let success = parameterCheck(this);
  if (!success) {
    err.errName = "Weld Pitch";
    err.errCause = "Pitch number not Valid.";
    err.errAction = "Enter an integer between ${MIN_PITCH} and ${MAX_PITCH}";

    callBackErrorModal(err.errName, err.errCause, err.errAction);
    return;
  } else {
    param.wprocedure = this.value;
    callBackUpdateInstrParam();
  }
}

/*
 =========================================================================
 @function name        : callBackWeldSchedule
 @argument[targetElm]  : 
 @description          : Update Weld Schedule and set instruction param
 @return               : none
 =========================================================================
*/
function callBackWeldSchedule() {
  if (this.value < 1 || this.value > 96) {
    err.errName = "Weld Pitch";
    err.errCause = "Pitch number not Valid.";
    err.errAction = "Enter an integer between ${MIN_PITCH} and ${MAX_PITCH}";

    $("#setSched").val(1);
    callBackErrorModal(err.errName, err.errCause, err.errAction);

    return;
  } else {
    param.wschedule = this.value;
    callBackUpdateInstrParam();
  }
}

/*
 =========================================================================
 @function name        : callBackSpeed
 @argument[targetElm]  : 
 @description          : Update speed value and set instruction param
 @return               : none
 =========================================================================
*/
function callBackSpeed() {
  if (param.speedunit === MM_SEC) {
    if (this.value <= MIN_SPEED || this.value >= MAX_SPEED_MM) {
      err.errName = "Speed Instruction";
      err.errCause = "The mm/sec Value is too large.";
      err.errAction = "Enter an integer between 1 and 250.";

      $("#setSpeed").val(DEFAULT_SPEED_MM);
      callBackErrorModal(err.errName, err.errCause, err.errAction);
      return;
    }
  }

  if (param.speedunit === INCH_MIN) {
    if (this.value <= MIN_SPEED || this.value >= MAX_SPEED_INCH) {
      err.errName = "Speed Instruction";
      err.errCause = "The inch/min Value is too large.";
      err.errAction = "Enter an integer between 1 and 590.5.";

      $("#setSpeed").val(DEFAULT_SPEED_INCH);
      callBackErrorModal(err.errName, err.errCause, err.errAction);
      return;
    }
  } else {
    param.speed = this.value;
    callBackUpdateInstrParam();
  }
}

/*
 =========================================================================
 @function name        : callBackSpeedSelect
 @argument[targetElm]  : 
 @description          : Update speed unit, cacl speed unit and set instruction param
 @return               : none
 =========================================================================
*/
function callBackSpeedSelect() {
  let speed = param.speed;

  if (this.value === "0") {
    speed = speed / SPEED_COEFFICIENT;
    param.speed = speed.toFixed(1);
  }

  if (this.value === "3") {
    speed = speed * SPEED_COEFFICIENT;
    param.speed = speed.toFixed(1);
  }

  if (this.value === "4") {
    param.speed = Math.trunc(speed);
  }

  $("#setSpeed").val(param.speed);

  param.speedunit = this.value;
  callBackUpdateInstrParam();
}

/*
 =========================================================================
 @function name        : callBackTpName
 @argument[targetElm]  : 
 @description          : Update string for TPP name and set instruction param
 @return               : none
 =========================================================================
*/
function callBackTpName() {
  //let result = parameterCheck(this);
  let string = this.value;
  let stringLen = string.length;
  err.errName = "TPP Name";

  let success = checkValidTpName(string);

  if (!success) {
    err.errCause = "TPP Name cannot start with a number.";
    err.errAction = "Start the TPP name with a letter.";
    this.value = this.oldvalue;

    callBackErrorModal(err.errName, err.errCause, err.errAction);
    return;
  }

  if (stringLen <= MIN_TPNAME_LEN) {
    err.errCause = "TPP Name is too short.";
    err.errAction = "Enter more than 2 Characters.";
    this.value = this.oldvalue;

    callBackErrorModal(err.errName, err.errCause, err.errAction);
    return;
  }

  if (stringLen >= MAX_TPNAME_LEN) {
    err.errCause = "TPP Name is too long.";
    err.errAction = "Enter less than 36 Characters.";
    this.value = this.oldvalue;

    callBackErrorModal(err.errName, err.errCause, err.errAction);
    return;
  } else {
    param.tpname = this.value;
    callBackUpdateInstrParam();
  }

  err.errName = "none";
  err.errAction = "none";

  return;
}

/*
 =========================================================================
 @function name        : callBackHelp
 @argument[targetElm]  : 
 @description          : Creates and displays an iFrame with help content
 @return               : none
 =========================================================================
*/
function callBackHelp() {
  $("#help-header").html(INSTR_NAME);

  HELP_MODAL.showModal();
  // var doc;
  // var parentNode;
  // var div;
  // var iframe;
  // doc = window.parent.document;
  // parentNode = doc.body;
  // div = doc.createElement("div");
  // div.className = "pop-frame";
  // div.style.cssText = "z-index: 1;";
  // iframe = doc.createElement("iframe");
  // iframe.src = "SWeld_help.htm";
  // iframe.scrolling = "no";
  // iframe.frameBorder = "0";
  // iframe.height = "850px";
  // iframe.width = "740px;";
  // div.appendChild(iframe);
  // insertBeforeTabEnd(parentNode, div);
  // var initialize = function (iframe) {
  //   var frame = iframe.contentWindow;
  //   var buttonHandle = function (id, operation) {
  //     var div = iframe.parentNode;
  //     iframe.contentWindow.close();
  //     iframe.src = "";
  //     div.removeChild(iframe);
  //     div.parentNode.removeChild(div);
  //   };
  //   frame.document
  //     .getElementById("closeBtn")
  //     .addEventListener("click", buttonHandle);
  // };
  // iframe.onload = function () {
  //   initialize(iframe);
  // };
}

function insertBeforeTabEnd(parentNode, childNode) {
  var divTabEnd = null;
  if (parentNode.tagName === "BODY") {
    divTabEnd = parentNode.ownerDocument.getElementById("divTabEnd");
  }
  if (divTabEnd !== null) {
    parentNode.insertBefore(childNode, divTabEnd);
  } else {
    parentNode.appendChild(childNode);
  }
}

/*============================D O C  L O A D I N G============================*/
function pageHasLoaded() {
  console.log(document.title, "--Loaded");
  //dropAdvInstData("10,20,6.3,3,96,1,25,0,'DroppedIn'"); // U S E D  F O R  T E S T I N G
}

function pageLoad(callback) {
  if (document.readyState === "complete") {
    callback();
  } else {
    window.addEventListener("load", callback);
  }
}

pageLoad(function () {
  pageHasLoaded();
});
