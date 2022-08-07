// Sets the variable.
function ihmi_setVar(
  prog_name, // (in)  program name
  var_name, // (in)  variable name
  value
) {
  // (in)  value
  $.getJSON(
    "/COMET/rpc?func=VMIP_WRITEVA" +
      "&prog_name=" +
      prog_name +
      "&var_name=" +
      var_name +
      "&value=" +
      value,
    function (json) {}
  );
} // ihmi_setVar

// Read a variable and return the string using a callback routine (with 2 arguments)
function ihmi_getVar(
  prog_name, // (in)  program name
  var_name, // (in)  variable name
  callback, // (in)  callback function when data received
  callbackarg1, // (in)  argument for callback function
  callbackarg2
) {
  // (in)  argument for callback function
  $.getJSON(
    "/COMET/rpc?func=VMIP_READVA" +
      "&prog_name=" +
      prog_name +
      "&var_name=" +
      var_name,
    function (json) {
      try {
        if (undefined != json.FANUC.RPC) {
          if (json.FANUC.RPC[0].status == 0) {
            var type_code = json.FANUC.RPC[0].type_code;
            var str = json.FANUC.RPC[0].value;
            callback(
              prog_name,
              var_name,
              type_code,
              str,
              callbackarg1,
              callbackarg2
            );
          }
        }
      } catch (err) {
        /* nop */
      }
    }
  );
} // ihmi_getVar

// Sets the I/O value.
function ihmi_iovalset(
  iotype, // (in)  I/O type
  index, // (in)  I/O index
  value
) {
  // (in)  value
  $.getJSON(
    "/COMET/rpc?func=IOVALSET" +
      "&type=" +
      iotype +
      "&index=" +
      index +
      "&value=" +
      value,
    function (json) {}
  );
} // ihmi_iovalset

// Read an I/O port and return the string using a callback routine (with 2 arguments)
function ihmi_iovalrd(
  iotype, // (in)  I/O type
  index, // (in)  I/O index
  callback, // (in)  callback function when data received
  callbackarg1, // (in)  argument for callback function
  callbackarg2
) {
  // (in)  argument for callback function
  $.getJSON(
    "/COMET/rpc?func=IOVALRD" + "&type=" + iotype + "&index=" + index,
    function (json) {
      try {
        if (undefined != json.FANUC.RPC) {
          if (json.FANUC.RPC[0].status == 0) {
            var str = json.FANUC.RPC[0].value;
            callback(iotype, index, str, callbackarg1, callbackarg2);
          }
        }
      } catch (err) {
        /* nop */
      }
    }
  );
} // ihmi_iovalrd

// Sets the variable.
function ihmi_setVar2(
  prog_name, // (in)  program name
  var_name, // (in)  variable name
  value, // (in)  value
  callback, // (in)  call back function when data received
  callbackarg1, // (in) argument for callback function
  callbackarg2
) {
  //(in) argument for callback function

  var chk_status = 0;

  $.getJSON(
    "/COMET/rpc?func=VMIP_WRITEVA" +
      "&prog_name=" +
      prog_name +
      "&var_name=" +
      var_name +
      "&value=" +
      value,
    function (json) {
      if (undefined != json.FANUC.RPC) {
        chk_status = json.FANUC.RPC[0].status;
        callback(
          prog_name,
          var_name,
          value,
          chk_status,
          callbackarg1,
          callbackarg2
        );
      }
    }
  );
} // ihmi_setVar2

function ihmi_getVar2(
  prog_name, // (in)  program name
  var_name, // (in)  variable name
  callback, // (in)  callback function when data received
  callbackarg1, // (in)  argument for callback function
  callbackarg2
) {
  // (in)  argument for callback function

  var type_code = null;
  var str = null;
  var chk_status = 0;

  $.getJSON(
    "/COMET/rpc?func=VMIP_READVA" +
      "&prog_name=" +
      prog_name +
      "&var_name=" +
      var_name,
    function (json) {
      try {
        if (undefined != json.FANUC.RPC) {
          if (json.FANUC.RPC[0].status == 0) {
            type_code = json.FANUC.RPC[0].type_code;
            str = json.FANUC.RPC[0].value;
          }
          chk_status = json.FANUC.RPC[0].status;
          callback(
            prog_name,
            var_name,
            type_code,
            str,
            chk_status,
            callbackarg1,
            callbackarg2
          );
        }
      } catch (err) {
        /* nop */
      }
    }
  );
} // ihmi_getVar2

// Sets the I/O value.
function ihmi_iovalset2(
  iotype, // (in)  I/O type
  index, // (in)  I/O index
  value, // (in)  value
  callback, // (in) callback function when data received
  callbackarg1, // (in)  argument for callback function
  callbackarg2
) {
  // (in)  argument for callback function

  var chk_status = 0;

  $.getJSON(
    "/COMET/rpc?func=IOVALSET" +
      "&type=" +
      iotype +
      "&index=" +
      index +
      "&value=" +
      value,
    function (json) {
      if (undefined != json.FANUC.RPC) {
        chk_status = json.FANUC.RPC[0].status;
        callback(iotype, index, value, chk_status, callbackarg1, callbackarg2);
      }
    }
  );
} // ihmi_iovalset2

function ihmi_iovalrd2(
  iotype, // (in)  I/O type
  index, // (in)  I/O index
  callback, // (in)  callback function when data received
  callbackarg1, // (in)  argument for callback function
  callbackarg2
) {
  // (in)  argument for callback function

  var str = null;
  var chk_status = 0;

  $.getJSON(
    "/COMET/rpc?func=IOVALRD" + "&type=" + iotype + "&index=" + index,
    function (json) {
      try {
        if (undefined != json.FANUC.RPC) {
          if (json.FANUC.RPC[0].status == 0) {
            var str = json.FANUC.RPC[0].value;
          }
          chk_status = json.FANUC.RPC[0].status;
          callback(iotype, index, str, chk_status, callbackarg1, callbackarg2);
        }
      } catch (err) {
        /* nop */
      }
    }
  );
} // ihmi_iovalrd2

// Responds whether the editor is displaying.
function ihmi_isEditor() {
  return mainfrm.prim.location.href.indexOf("/ihmieditor_dummy.htm") > -1;
} // ihmi_isEditor
