function openGripper(dictionary, getValue) {
  document.getElementById("status").innerHTML = dictionary["opening"] + "...";
  document.getElementById("explanation").innerHTML = "";

  // use the provided getValue function to look up the signal type and indices
  var ioType, openIndex, closeIndex;
  if (getValue("conn_type") == 0) {
    ioType = IoType.RO;
    openIndex = RO.OPEN;
    closeIndex = RO.CLOSE;
  } else {
    ioType = IoType.DO;
    openIndex = getValue("do_open");
    closeIndex = getValue("do_close");
  }

  // clear the close signal and set the open signal
  top.ihmi_iovalset(ioType, closeIndex, "0");
  top.ihmi_iovalset(ioType, openIndex, "1");

  // setup a timer that will launch a signal status display update after STATUS_DELAY ms
  setTimeout(() => updateStatus(dictionary, getValue), STATUS_DELAY);
}

function closeGripper(dictionary, getValue) {
  document.getElementById("status").innerHTML = dictionary["closing"] + "...";
  document.getElementById("explanation").innerHTML = "";

  // use the provided getValue function to look up the signal type and indices
  var ioType, openIndex, closeIndex;
  if (getValue("conn_type") == 0) {
    ioType = IoType.RO;
    openIndex = RO.OPEN;
    closeIndex = RO.CLOSE;
  } else {
    ioType = IoType.DO;
    openIndex = getValue("do_open");
    closeIndex = getValue("do_close");
  }

  // clear the open signal and set the close signal
  top.ihmi_iovalset(ioType, openIndex, "0");
  top.ihmi_iovalset(ioType, closeIndex, "1");

  // setup a timer that will launch a signal status display update after STATUS_DELAY ms
  setTimeout(() => updateStatus(dictionary, getValue), STATUS_DELAY);
}

function getKarelVar(name) {
  // launch an asynchronous promise to query the value of a Karel variable from the iHMI system
  return new Promise((resolve, reject) => {
    top.ihmi_getVar(KAREL_NAME, name, (progName, varName, typeCode, value) =>
      resolve(value)
    );
  });
}

function setKarelVar(name, value) {
  // use the iHMI system to update the value of a Karel variable
  top.ihmi_setVar(KAREL_NAME, name, value);
}

function setLightband(color, getValue) {
  if (getValue("conn_type") == ConnectionType.WRIST) {
    throw "Light band is unsupported for wrist connections";
  }
  // set the appropriate signals for the given color. NOTE: red is indicated by both green and yellow signals being set
  top.ihmi_iovalset(
    IoType.DO,
    getValue("do_green"),
    color == LightbandColor.GREEN || color == LightbandColor.RED ? "1" : "0"
  );
  top.ihmi_iovalset(
    IoType.DO,
    getValue("do_yellow"),
    color == LightbandColor.YELLOW || color == LightbandColor.RED ? "1" : "0"
  );
}

function getSignal(ioType, index) {
  // launch an asynchronous promise to query the iHMI system for the status of a digital input
  return new Promise((resolve, reject) => {
    top.ihmi_iovalrd(ioType, index, (ioType, index, value) => resolve(value));
  });
}

function updateStatus(dictionary, getValue) {
  // use the provided function to look up the signal type and indices
  var ioType, openIndex, closedIndex;
  if (getValue("conn_type") == 0) {
    ioType = IoType.RI;
    openIndex = RI.OPEN;
    closedIndex = RI.CLOSED;
  } else {
    ioType = IoType.DI;
    openIndex = getValue("di_open");
    closedIndex = getValue("di_closed");
  }

  // return a promise to look up the signal values and to update the status display
  return new Promise(async (resolve, reject) => {
    // read the signals
    var [openValue, closedValue] = await Promise.all([
      getSignal(ioType, openIndex),
      getSignal(ioType, closedIndex),
    ]);

    // update the status display
    var signalName = (i) => (ioType == IoType.RI ? "RI[" : "DI[") + i + "]";
    document.getElementById("status").innerHTML =
      (closedValue == 1 ? dictionary["closed_status"] : "") +
      " " +
      (openValue == 1 ? dictionary["open_status"] : "");
    document.getElementById("explanation").innerHTML =
      signalName(closedIndex) +
      "=" +
      (closedValue == 1 ? dictionary["on"] : dictionary["off"]) +
      ", " +
      signalName(openIndex) +
      "=" +
      (openValue == 1 ? dictionary["on"] : dictionary["off"]);

    resolve();
  });
}

// initialize the value and callback for an iHMI list-select or select control
function initSelectElement(id, value, callback) {
  var element = document.getElementById(id);

  if (element.classList.contains("list-select")) {
    document.getElementById(id).refresh(null, value, false);
  } else if (element.classList.contains("select")) {
    document.getElementById(id).refresh([], value, null, false);
  }

  document.getElementById(id).setCallback(callback);
}

// initialize the value and callback for an iHMI numeric input control
function initNumericElement(id, value, min, max, callback) {
  document.getElementById(id).refresh(value, min, max, false);
  document.getElementById(id).setCallback(callback);
}

// initialize the value and callback for a checkbox element
function initCheckboxElement(id, value, callback) {
  var checkmark = document.getElementById(id).querySelector("input");
  checkmark.checked = value == 1;
  checkmark.addEventListener("change", callback);
}

// expand one active panel element and shrink the others
function revealPanel(panels, panelId) {
  var revealPanel = document.getElementById(panelId);
  panels.forEach(
    (p) => (p.style.maxHeight = p == revealPanel ? p.scrollHeight + "px" : "0")
  );
}

// represents an optional parameter with a checkbox enable and numeric value
class OptionalParameter {
  constructor(
    checkboxId,
    numericId,
    checked,
    value,
    min,
    max,
    changedCallback
  ) {
    // store a reference to the checkbox and numeric elements for this optional parameter
    this._checkbox = document.getElementById(checkboxId).querySelector("input");
    this._numeric = document.getElementById(numericId);

    // set the initial value of the checkbox and setup a callback that enables/disabled the numeric element and calls the user's callback
    this._checkbox.checked = checked;
    this._checkbox.addEventListener("change", () => {
      this._numeric.refresh(this.value, min, max, !this.checked);
      changedCallback(this);
    });

    // set the initial value of the numeric element and associate the user's callback
    this._numeric.refresh(value, min, max, !checked);
    this._numeric.setCallback(() => changedCallback(this));
  }
  get checked() {
    return this._checkbox.checked;
  } // is this parameter enabled?
  get value() {
    return this._numeric.getValue();
  } // what is the numeric value of this parameter?
}

var KAREL_NAME = "ipl_schunk_egpc_cfg"; // name of the Karel program containing all relevant variables for this application
var IoType = {
  // from iHMI spec
  DI: "1",
  DO: "2",
  RI: "8",
  RO: "9",
};
var RO = {
  // robot output signal index values
  OPEN: "1",
  CLOSE: "2",
};
var RI = {
  // robot input signal index values
  OPEN: "2",
  CLOSED: "1",
};
var ConnectionType = {
  // values of the conn_type Karel variable
  WRIST: 0,
  CONTROLLER: 1,
};
var LightbandColor = {
  // values of the lightband color parameter
  OFF: 0,
  GREEN: 1,
  YELLOW: 2,
  RED: 3,
};
var STATUS_DELAY = 1000; // a delay in ms after setting gripper open/close signals before updating the input signal status display
