// rpcmc.js - Client side RPCM functions
//  24 - Aug - 2017 KRAUSE   pr50347b - Provide view or aux in TPGL packet
//  05-DEC-2017 EVANSJA pr50577 - Support for string and numeric input in icon editor.
//  09-MAR-2018 GRASSCM pr50779 - Support for Execution Control.
//  28-MAR-2018 EVANSJA pr50814 - Physical keyboard NumLock keys and minus/dot keys do not work on legacy type screens
//  26-APR-2018 GRASSCM pr50876 - Add support for tpxensub_ext.
//  30-JUL-2018 GRASSCM pr51068 - Add support for various external submenu calls.
//  18-APR-2019 GRASSCM pr51496 - Support check control properties.
//  07-AUG-2019 GRASSCM pr51784 - Enhancements for v9.30 second release.

$.ajaxSetup({
  // Disable caching of AJAX responses */
  cache: false,
});

// Send external request to GUID task.
function rpcmc_tpextreq(
  device_id, // (in)  device_id
  request_code
) {
  // (in)  request_code
  if (!top.g_connect_id) {
    return;
  }
  $.getJSON(
    "/COMET/rpc?func=TPEXTREQ" +
      "&connect_id=" +
      top.g_connect_id +
      "&device_id=" +
      device_id +
      "&request_code=" +
      request_code +
      "&key_code=0",
    function (json) {
      if (undefined != json.FANUC.RPC) {
        if (json.FANUC.RPC[0].status != 0) {
          rpcmc_rprintf(
            "[rpcmc] tpextreq " +
              request_code +
              " failed, status " +
              json.FANUC.RPC[0].status
          );
        }
      } else {
        rpcmc_rprintf("[rpcmc] unexpected reply " + JSON.stringify(json));
      }
    }
  );
} // rpcmc_tpextreq

// Send external request to GUID task with key_code
function rpcmc_tpextreq2(
  device_id, // (in)  device_id
  request_code, // (in)  request_code
  key_code
) {
  // (in)  key_code
  if (!top.g_connect_id) {
    return;
  }
  $.getJSON(
    "/COMET/rpc?func=TPEXTREQ" +
      "&connect_id=" +
      top.g_connect_id +
      "&device_id=" +
      device_id +
      "&request_code=" +
      request_code +
      "&key_code=" +
      key_code,
    function (json) {
      if (undefined != json.FANUC.RPC) {
        if (json.FANUC.RPC[0].status != 0) {
          rpcmc_rprintf(
            "[rpcmc] tpextreq2 " +
              request_code +
              " failed, status " +
              json.FANUC.RPC[0].status
          );
        }
      } else {
        rpcmc_rprintf("[rpcmc] unexpected reply " + JSON.stringify(json));
      }
    }
  );
} // rpcmc_tpextreq2

// Send external request to GUID task with key_code and extra int
function rpcmc_tpextreq3(
  device_id, // (in)  device_id
  request_code, // (in)  request_code
  key_code, // (in)  key_code
  extra
) {
  // (in)  extra
  if (!top.g_connect_id) {
    return;
  }
  $.getJSON(
    "/COMET/rpc?func=TPEXTREQ" +
      "&connect_id=" +
      top.g_connect_id +
      "&device_id=" +
      device_id +
      "&request_code=" +
      request_code +
      "&key_code=" +
      key_code +
      "&extra=" +
      extra,
    function (json) {
      if (undefined != json.FANUC.RPC) {
        if (json.FANUC.RPC[0].status != 0) {
          rpcmc_rprintf(
            "[rpcmc] tpextreq3 " +
              request_code +
              " failed, status " +
              json.FANUC.RPC[0].status
          );
        }
      } else {
        rpcmc_rprintf("[rpcmc] unexpected reply " + JSON.stringify(json));
      }
    }
  );
} // rpcmc_tpextreq3

// Start PMON monitor for the I/O port.
function rpcmc_startIOMonitor(
  io_type, // (in)  I/O port type
  io_index
) {
  // (in)  I/O port index
  if (!top.g_connect_id) {
    return;
  }
  $.getJSON(
    "/COMET/rpc?func=PMON_START_MON" +
      "&connect_id=" +
      top.g_connect_id +
      "&type=" +
      io_type +
      "&index=" +
      io_index +
      "&cnt=1",
    function (json) {
      if (undefined != json.FANUC.RPC) {
        if (json.FANUC.RPC[0].status != 0) {
          rpcmc_rprintf(
            "[rpcmc] pmon_start_mon I/O " +
              io_type +
              "[" +
              io_index +
              "] failed, status " +
              json.FANUC.RPC[0].status
          );
        }
      } else {
        rpcmc_rprintf("[rpcmc] unexpected reply " + JSON.stringify(json));
      }
    }
  );
} // rpcmc_startIOMonitor

// Stop PMON monitor for the I/O port.
function rpcmc_stopIOMonitor(
  io_type, // (in)  I/O port type
  io_index
) {
  // (in)  I/O port index
  if (!top.g_connect_id) {
    return;
  }
  $.getJSON(
    "/COMET/rpc?func=PMON_STOP_MON" +
      "&connect_id=" +
      top.g_connect_id +
      "&type=" +
      io_type +
      "&index=" +
      io_index +
      "&cnt=1",
    function (json) {
      if (undefined != json.FANUC.RPC) {
        if (json.FANUC.RPC[0].status != 0) {
          rpcmc_rprintf(
            "[rpcmc] pmon_stop_mon I/O " +
              io_type +
              "[" +
              io_index +
              "] failed, status " +
              json.FANUC.RPC[0].status
          );
        }
      } else {
        rpcmc_rprintf("[rpcmc] unexpected reply " + JSON.stringify(json));
      }
    }
  );
} // rpcmc_stopIOMonitor

// Start PMON monitor for the device.
function rpcmc_startDeviceMonitor(device) {
  // (in)  device name
  if (!top.g_connect_id) {
    return;
  }
  $.getJSON(
    "/COMET/rpc?func=PMON_START_MON" +
      "&connect_id=" +
      top.g_connect_id +
      "&mon_type=" +
      PMON_MON_DEVICE_C +
      "&device=" +
      device,
    function (json) {
      if (undefined != json.FANUC.RPC) {
        if (json.FANUC.RPC[0].status != 0) {
          rpcmc_rprintf(
            "[rpcmc] pmon_start_mon device " +
              device +
              " failed, status " +
              json.FANUC.RPC[0].status
          );
        }
      } else {
        rpcmc_rprintf("[rpcmc] unexpected reply " + JSON.stringify(json));
      }
    }
  );
} // rpcmc_startDeviceMonitor

// Stop PMON monitor for the device.
function rpcmc_stopDeviceMonitor(device) {
  // (in)  device name
  if (!top.g_connect_id) {
    return;
  }
  $.getJSON(
    "/COMET/rpc?func=PMON_STOP_MON" +
      "&connect_id=" +
      top.g_connect_id +
      "&mon_type=" +
      PMON_MON_DEVICE_C +
      "&device=" +
      device,
    function (json) {
      if (undefined != json.FANUC.RPC) {
        if (json.FANUC.RPC[0].status != 0) {
          rpcmc_rprintf(
            "[rpcmc] pmon_stop_mon device " +
              device +
              " failed, status " +
              json.FANUC.RPC[0].status
          );
        }
      } else {
        rpcmc_rprintf("[rpcmc] unexpected reply " + JSON.stringify(json));
      }
    }
  );
} // rpcmc_stopDeviceMonitor

// Start PMON monitor for the variable.
function rpcmc_startVarMonitor(
  prog_name, // (in)  program name
  var_name, // (in)  var name
  interval
) {
  // (in)  interval
  if (!top.g_connect_id) {
    return;
  }
  $.getJSON(
    "/COMET/rpc?func=PMON_START_MON" +
      "&connect_id=" +
      top.g_connect_id +
      "&mon_type=" +
      PMON_MON_VAR_C +
      "&prog=" +
      prog_name +
      "&var=" +
      var_name +
      "&latency=" +
      interval,
    function (json) {
      if (undefined != json.FANUC.RPC) {
        if (json.FANUC.RPC[0].status != 0) {
          rpcmc_rprintf(
            "[rpcmc] pmon_start_mon_var [" +
              prog_name +
              "]" +
              var_name +
              " failed, status " +
              json.FANUC.RPC[0].status
          );
        }
      } else {
        rpcmc_rprintf("[rpcmc] unexpected reply " + JSON.stringify(json));
      }
    }
  );
} // rpcmc_startVarMonitor

// Stop PMON monitor for the variable.
function rpcmc_stopVarMonitor(
  prog_name, // (in)  program name
  var_name, // (in)  var name
  interval
) {
  // (in)  interval
  if (!top.g_connect_id) {
    return;
  }
  $.getJSON(
    "/COMET/rpc?func=PMON_STOP_MON" +
      "&connect_id=" +
      top.g_connect_id +
      "&mon_type=" +
      PMON_MON_VAR_C +
      "&prog=" +
      prog_name +
      "&var=" +
      var_name +
      "&latency=" +
      interval,
    function (json) {
      if (undefined != json.FANUC.RPC) {
        if (json.FANUC.RPC[0].status != 0) {
          rpcmc_rprintf(
            "[rpcmc] pmon_stop_mon_var [" +
              prog_name +
              "]" +
              var_name +
              " failed, status " +
              json.FANUC.RPC[0].status
          );
        }
      } else {
        rpcmc_rprintf("[rpcmc] unexpected reply " + JSON.stringify(json));
      }
    }
  );
} // rpcmc_stopVarMonitor

// Start PMON monitor for curpos.
function rpcmc_startCurposMonitor(
  monType, // (in)  monitor type
  interval
) {
  // (in)  interval
  if (!top.g_connect_id) {
    return;
  }
  $.getJSON(
    "/COMET/rpc?func=PMON_START_MON" +
      "&connect_id=" +
      top.g_connect_id +
      "&mon_type=" +
      monType +
      "&latency=" +
      interval,
    function (json) {
      if (undefined != json.FANUC.RPC) {
        if (json.FANUC.RPC[0].status != 0) {
          rpcmc_rprintf(
            "[rpcmc] pmon_start_mon_curpos " +
              monType +
              " failed, status " +
              json.FANUC.RPC[0].status
          );
        }
      } else {
        rpcmc_rprintf("[rpcmc] unexpected reply " + JSON.stringify(json));
      }
    }
  );
} // rpcmc_startCurposMonitor

// Stop PMON monitor for curpos.
function rpcmc_stopCurposMonitor(
  monType, // (in)  monitor type
  interval
) {
  // (in)  interval
  if (!top.g_connect_id) {
    return;
  }
  $.getJSON(
    "/COMET/rpc?func=PMON_STOP_MON" +
      "&connect_id=" +
      top.g_connect_id +
      "&mon_type=" +
      monType +
      "&latency=" +
      interval,
    function (json) {
      if (undefined != json.FANUC.RPC) {
        if (json.FANUC.RPC[0].status != 0) {
          rpcmc_rprintf(
            "[rpcmc] pmon_stop_mon_curpos " +
              monType +
              " failed, status " +
              json.FANUC.RPC[0].status
          );
        }
      } else {
        rpcmc_rprintf("[rpcmc] unexpected reply " + JSON.stringify(json));
      }
    }
  );
} // rpcmc_stopCurposMonitor

// Start PMON monitor for the pipe.
function rpcmc_startPipeMonitor(
  file_name, // (in)  file name
  interval
) {
  // (in)  interval
  if (!top.g_connect_id) {
    return;
  }
  $.getJSON(
    "/COMET/rpc?func=PMON_START_MON" +
      "&connect_id=" +
      top.g_connect_id +
      "&mon_type=" +
      PMON_MON_PIPE_C +
      "&file=" +
      file_name +
      "&latency=" +
      interval,
    function (json) {
      if (undefined != json.FANUC.RPC) {
        if (json.FANUC.RPC[0].status != 0) {
          rpcmc_rprintf(
            "[rpcmc] pmon_start_mon_file " +
              file_name +
              " failed, status " +
              json.FANUC.RPC[0].status
          );
        }
      } else {
        rpcmc_rprintf("[rpcmc] unexpected reply " + JSON.stringify(json));
      }
    }
  );
} // rpcmc_startPipeMonitor

// Stop PMON monitor for the pipe.
function rpcmc_stopPipeMonitor(
  file_name, // (in)  file name
  interval
) {
  // (in)  interval
  if (!top.g_connect_id) {
    return;
  }
  $.getJSON(
    "/COMET/rpc?func=PMON_STOP_MON" +
      "&connect_id=" +
      top.g_connect_id +
      "&mon_type=" +
      PMON_MON_PIPE_C +
      "&file=" +
      file_name +
      "&latency=" +
      interval,
    function (json) {
      if (undefined != json.FANUC.RPC) {
        if (json.FANUC.RPC[0].status != 0) {
          rpcmc_rprintf(
            "[rpcmc] pmon_stop_mon_file " +
              file_name +
              " failed, status " +
              json.FANUC.RPC[0].status
          );
        }
      } else {
        rpcmc_rprintf("[rpcmc] unexpected reply " + JSON.stringify(json));
      }
    }
  );
} // rpcmc_stopPipeMonitor

// Send key to controller.
function rpcmc_sendKeyCode(key_code) {
  // (in)  keycode
  if (!top.g_connect_id) {
    return;
  }
  if (key_code >= 96 && key_code <= 105) {
    // Numpad keys
    key_code -= 48;
  } else if (key_code == 106) {
    key_code = "*".charCodeAt(0);
  } else if (key_code == 107) {
    key_code = "+".charCodeAt(0);
  } else if (key_code == 109 || key_code == 189) {
    key_code = "-".charCodeAt(0);
  } else if (key_code == 110 || key_code == 190) {
    key_code = ".".charCodeAt(0);
  } else if (key_code == 111) {
    key_code = "/".charCodeAt(0);
  }
  // Convert keycode to hex number and use URL encoding, such as %20 for space
  var keystr = "";
  if (key_code < 16) {
    keystr = "0";
  }
  keystr += key_code.toString(16);
  $.getJSON(
    "/COMET/rpc?func=EXEC_TXCMND" +
      "&connect_id=" +
      top.g_connect_id +
      "&cmnd=1" +
      "&page=%" +
      keystr,
    function (json) {
      if (undefined != json.FANUC.RPC) {
        if (json.FANUC.RPC[0].status != 0) {
          rpcmc_rprintf(
            "[rpcmc] sendKeyCode " +
              key_code +
              "failed, status " +
              json.FANUC.RPC[0].status
          );
        }
      } else {
        rpcmc_rprintf("[rpcmc] unexpected reply " + JSON.stringify(json));
      }
    }
  );
} // rpcmc_sendKeyCode

// Send TXCMND to controller.
function rpcmc_sendTXCMND(
  cmnd, // (in)  command
  buf
) {
  // (in)  buffer
  if (!top.g_connect_id) {
    return;
  }
  $.getJSON(
    "/COMET/rpc?func=EXEC_TXCMND" +
      "&connect_id=" +
      top.g_connect_id +
      "&cmnd=" +
      cmnd +
      "&page=" +
      buf,
    function (json) {
      if (undefined != json.FANUC.RPC) {
        if (json.FANUC.RPC[0].status != 0) {
          rpcmc_rprintf(
            "[rpcmc] rpcmc_sendTXCMND " +
              cmnd +
              " failed, status " +
              json.FANUC.RPC[0].status
          );
        }
      } else {
        rpcmc_rprintf("[rpcmc] unexpected reply " + JSON.stringify(json));
      }
    }
  );
} // rpcmc_sendTXCMND

// Force the controller's PMON task to break its client connection with the PMON Server.
function rpcmc_pmon_disconnect() {
  if (!top.g_connect_id) {
    return;
  }
  $.getJSON(
    "/COMET/rpc?func=PMON_DISCONNECT" + "&connect_id=" + top.g_connect_id,
    function (json) {}
  );
} // rpcmc_pmon_disconnect

// Write string to console log.
function rpcmc_rprintf(str) {
  $.getJSON("/COMET/rpc?func=RPRINTF&=" + str, function (json) {});
} // rpcmc_rprintf

// Send new url to controller.
function rpcmc_tplink_new_url(
  device_id, // (in)  device_id
  newurl, // (in)  new url
  newfrm
) {
  // (in)  new frame
  if (!top.g_connect_id) {
    return;
  }
  $.getJSON(
    "/COMET/rpc?func=TPLINK_NEW_URL" +
      "&connect_id=" +
      top.g_connect_id +
      "&device_id=" +
      device_id +
      "&newurl=" +
      newurl +
      "&newfrm=" +
      newfrm,
    function (json) {
      if (undefined != json.FANUC.RPC) {
        if (json.FANUC.RPC[0].status != 0) {
          rpcmc_rprintf(
            "[rpcmc] tplink_new_url failed, status " + json.FANUC.RPC[0].status
          );
        }
      } else {
        rpcmc_rprintf("[rpcmc] unexpected reply " + JSON.stringify(json));
      }
    }
  );
} // rpcmc_tplink_new_url

// Request disposal of execution control
function rpcmc_tplink_disconnect(device_id) {
  if (!top.g_connect_id) {
    return;
  }
  $.getJSON(
    "/COMET/rpc?func=TPLINK_DISCONNECT" +
      "&device_id=" +
      device_id +
      "&connect_id=" +
      top.g_connect_id,
    function (json) {
      if (undefined != json.FANUC.RPC) {
        if (json.FANUC.RPC[0].status != 0) {
          rpcmc_rprintf(
            "[rpcmc] tplink_disconnect failed, status" +
              json.FANUC.RPC[0].status
          );
        }
      } else {
        rpcmc_rprintf("[rpcmc] unexpected reply " + JSON.stringify(json));
      }
    }
  );
} // rpcmc_tplink_disconnect

// Send cross browser url to controller.
function rpcmc_cross_url(url) {
  // (in)  url
  // IE8 & 9 only cross domain request
  if ("XDomainRequest" in window && window.XDomainRequest !== null) {
    var xdr = new XDomainRequest(); // Use Microsoft XDR
    xdr.open("get", url);
    xdr.send();
  } else {
    // Others allow jsonp requests to be cross domain
    // If the URL includes callback=?, then jQuery will treat it as a JSONP request
    $.getJSON(url + "&callback=?", function (json) {});
  }
} // rpcmc_cross_url

// Read a dictionary element and return the string using a callback routine
// Usage:
//   rpcmc_dpread("SRVO", 1, dpread_callback);
//   function dpread_callback(dict_name, ele_no, dict_str) {
//     $("#button1").text(dict_str);
//   }
function rpcmc_dpread(
  dict_name, // (in)  dictionary name
  ele_no, // (in)  element number
  callback
) {
  // (in)  callback function when data received
  $.getJSON(
    "/COMET/rpc?func=DPREAD" + "&dict_name=" + dict_name + "&ele_no=" + ele_no,
    function (json) {
      try {
        if (undefined != json.FANUC.RPC) {
          if (json.FANUC.RPC[0].status != 0) {
            rpcmc_rprintf(
              "[rpcmc] dpread " +
                dict_name +
                "[" +
                ele_no +
                "] failed, status " +
                json.FANUC.RPC[0].status
            );
          } else {
            var str = json.FANUC.RPC[0].value;
            callback(dict_name, ele_no, str);
          }
        }
      } catch (err) {
        /* nop */
      }
    }
  );
} // rpcmc_dpread

// Read a dictionary element and return the string using a callback routine (with argument)
// Usage:
//   rpcmc_dpread2(dict_name, ele_no, HandleDictCallback, data); // Read dictionary element
//   function HandleDictCallback(dict_name, ele_no, str, data) {
//     ...
//   } // HandleDictCallback
function rpcmc_dpread2(
  dict_name, // (in)  dictionary name
  ele_no, // (in)  element number
  callback, // (in)  callback function when data received
  callbackarg
) {
  // (in) argument for callback function
  $.getJSON(
    "/COMET/rpc?func=DPREAD" + "&dict_name=" + dict_name + "&ele_no=" + ele_no,
    function (json) {
      try {
        if (undefined != json.FANUC.RPC) {
          if (json.FANUC.RPC[0].status != 0) {
            rpcmc_rprintf(
              "[rpcmc] dpread " +
                dict_name +
                "[" +
                ele_no +
                "] failed, status " +
                json.FANUC.RPC[0].status
            );
          } else {
            var str = json.FANUC.RPC[0].value;
            callback(dict_name, ele_no, str, callbackarg);
          }
        }
      } catch (err) {
        /* nop */
      }
    }
  );
} // rpcmc_dpread2

// Read a dictionary element and return the string using a callback routine (with 2 arguments)
// Usage:
//   rpcmc_dpread3(dict_name, ele_no, HandleDictCallback2, p_ind, data); // Read dictionary element
//   function HandleDictCallback2(dict_name, ele_no, str, p_ind, data) {
//     ...
//   } // HandleDictCallback2
function rpcmc_dpread3(
  dict_name, // (in)  dictionary name
  ele_no, // (in)  element number
  callback, // (in)  callback function when data received
  callbackarg1, // (in)  argument for callback function
  callbackarg2
) {
  // (in)  argument for callback function
  $.getJSON(
    "/COMET/rpc?func=DPREAD" + "&dict_name=" + dict_name + "&ele_no=" + ele_no,
    function (json) {
      try {
        if (undefined != json.FANUC.RPC) {
          if (json.FANUC.RPC[0].status != 0) {
            rpcmc_rprintf(
              "[rpcmc] dpread " +
                dict_name +
                "[" +
                ele_no +
                "] failed, status " +
                json.FANUC.RPC[0].status
            );
          } else {
            var str = json.FANUC.RPC[0].value;
            callback(dict_name, ele_no, str, callbackarg1, callbackarg2);
          }
        }
      } catch (err) {
        /* nop */
      }
    }
  );
} // rpcmc_dpread3

// Returns the Task Index for this connection/device.
// Usage:
//    rpcmc_getTaskIdx(device_id, function(taskIdx) {
//      rpcmc_setVar(SYSNAME_C, "$UI_PANEDATA[" + taskIdx + "].$HELPURL", data.PageName);
//    });
function rpcmc_getTaskIdx(
  device_id, // (in)  device_id
  callback
) {
  // (in)  callback function when data received
  if (!top.g_connect_id) {
    return;
  }
  $.getJSON(
    "/COMET/rpc?func=TPMULTI_TASKIDX" +
      "&connect_id=" +
      top.g_connect_id +
      "&device_id=" +
      device_id,
    function (json) {
      try {
        if (undefined != json.FANUC.RPC) {
          if (json.FANUC.RPC[0].status != 0) {
            rpcmc_rprintf(
              "[rpcmc] tpmulti_taskidx " +
                device_id +
                " failed, status " +
                json.FANUC.RPC[0].status
            );
          } else {
            var taskIdx = json.FANUC.RPC[0].value;
            callback(taskIdx);
          }
        }
      } catch (err) {
        /* nop */
      }
    }
  );
} // rpcmc_getTaskIdx

// Displays enumerated types in a sub-window and allows user to select one.
// Usage:
// rpcmc_tpxensub(data.fDeviceId, data.DictName, data.DictEle, sub_idx,
//                DialogOpen, data);
function rpcmc_tpxensub(
  device_id, // (in) Device ID
  dict_name, // (in) Dictionary Name
  ele_no, // (in) Element Number
  sub_idx, // (in) Index to highlight upon entry
  callback, // (in) Callback to manage dialog box
  callbackarg1
) {
  // (in) Argument for callback function
  $.getJSON(
    "/COMET/RPC?func=TPXENSUB_EXT" +
      "&connect_id=" +
      top.g_connect_id +
      "&device_id=" +
      device_id +
      "&dict_name=" +
      dict_name +
      "&ele_no=" +
      ele_no +
      "&sub_idx=" +
      sub_idx,
    function (json) {
      if (undefined != json.FANUC.RPC) {
        if (json.FANUC.RPC[0].status != 0) {
          rpcmc_rprintf(
            "[rpcmc_tpxensub] failed, status " + json.FANUC.RPC[0].status
          );
        }
        callback(parseInt(json.FANUC.RPC[0].status), callbackarg1);
      } else {
        rpcmc_rprintf(
          "[rpcmc_tpxensub] unexpected reply " + JSON.stringify(json)
        );
      }
    }
  );
} // rpcmc_tpxensub

// Display sub-window enumerated types from variables, allow user to select.
// Usage:
// rpcmc_tpxensbv_krl_ext(data.fDeviceId, data.varinfo[1].prognam,
//                        data.varinfo[1].progvar, sub_idx, DialogOpen, data);
function rpcmc_tpxensbv_krl_ext(
  device_id, // (in) Device ID
  prog_nam, // (in) Program Name
  prog_var, // (in) Program Variable
  sub_idx, // (in) Index to highlight upon entry
  callback, // (in) Callback function to handle dialog box
  callbackarg1
) {
  // (in) Argument for callback function
  $.getJSON(
    "/COMET/RPC?func=TPXENSBV_KRL_EXT" +
      "&connect_id=" +
      top.g_connect_id +
      "&device_id=" +
      device_id +
      "&prog_nam=" +
      prog_nam +
      "&prog_var=" +
      prog_var +
      "&sub_idx=" +
      sub_idx,
    function (json) {
      if (undefined != json.FANUC.RPC) {
        if (json.FANUC.RPC[0].status != 0) {
          rpcmc_rprintf(
            "[rpcmc_tpxensbv_krl_ext] failed, status " +
              json.FANUC.RPC[0].status
          );
        }
        callback(parseInt(json.FANUC.RPC[0].status), callbackarg1);
      } else {
        rpcmc_rprintf(
          "[rpcmc_tpxensbv_krl_ext] unexpected reply " + JSON.stringify(json)
        );
      }
    }
  );
} // rpcmc_tpxensbv_krl_ext

// Get text value selected from tpxensbv_krl
// Usage:
// rpcmc_tpxensbv_ext_text(data.fDeviceId, data.varinfo[1].prognam,
//                         data.varinfo[1].progvar, sub_idx);
function rpcmc_tpxensbv_krl_text(
  device_id, // (in) Device ID
  prog_nam, // (in) Program Name
  prog_var, // (in) Program Variable
  sub_idx, // (in) Selected index
  callback, // (in) Callback function
  callbackarg1
) {
  // (in) Argument for callback function
  $.getJSON(
    "/COMET/RPC?func=TPXENSBV_KRL_TEXT" +
      "&connect_id=" +
      top.g_connect_id +
      "&device_id=" +
      device_id +
      "&prog_nam=" +
      prog_nam +
      "&prog_var=" +
      prog_var +
      "&sub_idx=" +
      sub_idx,
    function (json) {
      if (undefined != json.FANUC.RPC) {
        if (json.FANUC.RPC[0].status != 0) {
          rpcmc_rprintf(
            "[rpcmc_tpxensbv_krl_text] failed, status " +
              json.FANUC.RPC[0].status
          );
        } else {
          callback(
            prog_nam,
            prog_var,
            json.FANUC.RPC[0].rpc,
            json.FANUC.RPC[0].value,
            -1,
            callbackarg1
          );
        }
      } else {
        rpcmc_rprintf(
          "[rpcmc_tpxensbv_krl_text] unexpected reply " +
            json.FANUC.RPC[0].status
        );
      }
    }
  );
} // rpcmc_tpxensbv_krl_text

// Display sub-window selected program types
// Usage:
// rpcmc_tpxprgsb_ext(data.fDeviceId, data.IOType, sub_idx, DialogOpen, data);
function rpcmc_tpxprgsb_ext(
  device_id, // (in) Device ID
  prog_type, // (in) Program list type
  sub_idx, // (in) Index to highlight upon entry
  callback, // (in) Callback function
  callbackarg1
) {
  // (in) Argument for callback function
  $.getJSON(
    "/COMET/RPC?func=TPXPRGSB_EXT" +
      "&connect_id=" +
      top.g_connect_id +
      "&device_id=" +
      device_id +
      "&prog_type=" +
      prog_type +
      "&sub_idx=" +
      sub_idx,
    function (json) {
      if (undefined != json.FANUC.RPC) {
        if (json.FANUC.RPC[0].status != 0) {
          rpcmc_rprintf(
            "[rpcmc_tpxprgsb_ext] failed, status " + json.FANUC.RPC[0].status
          );
        }
        callback(parseInt(json.FANUC.RPC[0].status), callbackarg1);
      } else {
        rpcmc_rprintf(
          "[rpcmc_tpxprgsb_ext] unexpected reply " + json.FANUC.RPC[0].status
        );
      }
    }
  );
} // rpcmc_tpxprgsb_ext

// Display sub-window selected file types
// Usage:
// rpcmc_tpxfilsb_ext(data.fDeviceId, data.DataSource, sub_idx, DialogOpen, data);
function rpcmc_tpxfilsb_ext(
  device_id, // (in) Device ID
  file_type, // (in) File types to display
  sub_idx, // (in) Index to highlight upon entry
  callback, // (in) Callback function
  callbackarg1
) {
  // (in) Argument for callback function
  $.getJSON(
    "/COMET/RPC?func=TPXFILSB_EXT" +
      "&connect_id=" +
      top.g_connect_id +
      "&device_id=" +
      device_id +
      "&file_type=" +
      file_type +
      "&sub_idx=" +
      sub_idx,
    function (json) {
      if (undefined != json.FANUC.RPC) {
        if (json.FANUC.RPC[0].status != 0) {
          rpcmc_rprintf(
            "[rpcmc_tpxfilsb_ext] failed, status " + json.FANUC.RPC[0].status
          );
        }
        callback(parseInt(json.FANUC.RPC[0].status), callbackarg1);
      } else {
        rpcmc_rprintf(
          "[rpcmc_tpxfilsb_ext] unexpected reply " + json.FANUC.RPC[0].status
        );
      }
    }
  );
} // rpcmc_tpxfilsb_ext

// Sets the variable.
function rpcmc_setVar(
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
    function (json) {
      if (undefined != json.FANUC.RPC) {
        if (json.FANUC.RPC[0].status != 0) {
          rpcmc_rprintf(
            "[rpcmc] vmip_writeva [" +
              prog_name +
              "]" +
              var_name +
              " failed, status " +
              json.FANUC.RPC[0].status
          );
        }
      } else {
        rpcmc_rprintf("[rpcmc] unexpected reply " + JSON.stringify(json));
      }
    }
  );
} // rpcmc_setVar

// Read a variable and return the string using a callback routine (with 2 arguments)
function rpcmc_getVar(
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
          if (json.FANUC.RPC[0].status != 0) {
            rpcmc_rprintf(
              "[rpcmc] vmip_readva [" +
                prog_name +
                "]" +
                var_name +
                " failed, status " +
                json.FANUC.RPC[0].status
            );
          } else {
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
} // rpcmc_getVar

// Sets the I/O value.
function rpcmc_iovalset(
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
    function (json) {
      if (undefined != json.FANUC.RPC) {
        if (json.FANUC.RPC[0].status != 0) {
          rpcmc_rprintf(
            "[rpcmc] iovalset " +
              iotype +
              "[" +
              index +
              "] failed, status " +
              json.FANUC.RPC[0].status
          );
        }
      } else {
        rpcmc_rprintf("[rpcmc] unexpected reply " + JSON.stringify(json));
      }
    }
  );
} // rpcmc_iovalset

// Simulate the I/O port.
function rpcmc_iosim(
  iotype, // (in)  I/O type
  index
) {
  // (in)  I/O index
  $.getJSON(
    "/COMET/rpc?func=IOSIM" + "&type=" + iotype + "&index=" + index,
    function (json) {
      if (undefined != json.FANUC.RPC) {
        if (json.FANUC.RPC[0].status != 0) {
          rpcmc_rprintf(
            "[rpcmc] iosim " +
              iotype +
              "[" +
              index +
              "] failed, status " +
              json.FANUC.RPC[0].status
          );
        }
      } else {
        rpcmc_rprintf("[rpcmc] unexpected reply " + JSON.stringify(json));
      }
    }
  );
} // rpcmc_iosim

// Unsimulate the I/O port.
function rpcmc_iounsim(
  iotype, // (in)  I/O type
  index
) {
  // (in)  I/O index
  $.getJSON(
    "/COMET/rpc?func=IOUNSIM" + "&type=" + iotype + "&index=" + index,
    function (json) {
      if (undefined != json.FANUC.RPC) {
        if (json.FANUC.RPC[0].status != 0) {
          rpcmc_rprintf(
            "[rpcmc] iounsim " +
              iotype +
              "[" +
              index +
              "] failed, status " +
              json.FANUC.RPC[0].status
          );
        }
      } else {
        rpcmc_rprintf("[rpcmc] unexpected reply " + JSON.stringify(json));
      }
    }
  );
} // rpcmc_iounsim

// Read an I/O port and return the string using a callback routine (with 2 arguments)
function rpcmc_iovalrd(
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
          if (json.FANUC.RPC[0].status != 0) {
            rpcmc_rprintf(
              "[rpcmc] iovalrd " +
                iotype +
                "[" +
                index +
                "] failed, status " +
                json.FANUC.RPC[0].status
            );
          } else {
            var str = json.FANUC.RPC[0].value;
            callback(iotype, index, str, callbackarg1, callbackarg2);
          }
        }
      } catch (err) {
        /* nop */
      }
    }
  );
} // rpcmc_iovalrd

// Checks the simulation status and return the string using a callback routine (with 2 arguments)
function rpcmc_iocksim(
  iotype, // (in)  I/O type
  index, // (in)  I/O index
  callback, // (in)  callback function when data received
  callbackarg1, // (in)  argument for callback function
  callbackarg2
) {
  // (in)  argument for callback function
  $.getJSON(
    "/COMET/rpc?func=IOCKSIM" + "&type=" + iotype + "&index=" + index,
    function (json) {
      try {
        if (undefined != json.FANUC.RPC) {
          if (json.FANUC.RPC[0].status != 0) {
            rpcmc_rprintf(
              "[rpcmc] iocksim " +
                iotype +
                "[" +
                index +
                "] failed, status " +
                json.FANUC.RPC[0].status
            );
          } else {
            var str = json.FANUC.RPC[0].value;
            callback(iotype, index, str, callbackarg1, callbackarg2);
          }
        }
      } catch (err) {
        /* nop */
      }
    }
  );
} // rpcmc_iocksim

// Sends a packet to controller
function rpcmc_ossndpkt_ext(
  p_type, // (in)  packet type
  r_id, // (in)  requestor_id
  s_code, // (in)  subsys_code
  r_code, // (in)  request_code
  t_id, // (in)  target_id
  p_id
) {
  // (in)  packet_id
  if (!top.g_connect_id) {
    return;
  }
  $.getJSON(
    "/COMET/rpc?func=OSSNDPKT_EXT" +
      "&connect_id=" +
      top.g_connect_id +
      "&p_type=" +
      p_type +
      "&r_id=" +
      r_id +
      "&s_code=" +
      s_code +
      "&r_code=" +
      r_code +
      "&t_id=" +
      t_id +
      "&p_id=" +
      p_id +
      "&index=" +
      index,
    function (json) {
      if (undefined != json.FANUC.RPC) {
        if (json.FANUC.RPC[0].status != 0) {
          rpcmc_rprintf(
            "[rpcmc] rpcmc_ossndpkt_ext failed, status " +
              json.FANUC.RPC[0].status
          );
        }
      } else {
        rpcmc_rprintf("[rpcmc] unexpected reply " + JSON.stringify(json));
      }
    }
  );
} // rpcmc_ossndpkt_ext

// Sends a 3D packet to controller
function rpcmc_ossndpkt_ext3d(
  p_type, // (in)  packet type
  r_id, // (in)  requestor_id
  s_code, // (in)  subsys_code
  r_code, // (in)  request_code
  t_id, // (in)  target_id
  p_id, // (in)  packet_id
  vers, // (in)  version
  pane, // (in)  pane
  subpane, // (in)  subpane
  scene,
  optional
) {
  // (in)  string containing option parameters formatted correctly
  if (!top.g_connect_id) {
    return;
  }
  if (optional == undefined) {
    optional = "";
  }
  $.getJSON(
    "/COMET/rpc?func=OSSNDPKT_EXT" +
      "&connect_id=" +
      top.g_connect_id +
      "&p_type=" +
      p_type +
      "&r_id=" +
      r_id +
      "&s_code=" +
      s_code +
      "&r_code=" +
      r_code +
      "&t_id=" +
      t_id +
      "&p_id=" +
      p_id +
      "&vers=" +
      vers +
      "&pane=" +
      pane +
      "&subpane=" +
      subpane +
      "&scene=" +
      scene +
      optional,
    function (json) {
      if (undefined != json.FANUC.RPC) {
        if (json.FANUC.RPC[0].status != 0) {
          rpcmc_rprintf(
            "[rpcmc] rpcmc_ossndpkt_ext3D failed, status " +
              json.FANUC.RPC[0].status
          );
        }
      } else {
        rpcmc_rprintf("[rpcmc] unexpected reply " + JSON.stringify(json));
      }
    }
  );
} // rpcmc_ossndpkt_ext3d

// Send a request to the web server to log in our cgtp connection.
// Call the sfdiagtp softpart in SID_HTTPEX with portno, login page, and config_mode as parameters
// fc=0x43000f is HCFC_CGTPLOGIN_C
// portno=0 uses COMET server
// ip=1 allows iPendant Control menus
// Returns ip as true or false
function rpcmc_login(config_mode, html5_only) {
  if (top.g_login) {
    // prevent infinite login attempts when error occurs during login
    return false;
  }
  top.g_login = true;
  top.g_html_only = true;
  var ip = 0;
  if (!html5_only) {
    if (navigator.userAgent.indexOf("IEMobile") >= 0) {
      ip = 1;
    } else if (top.g_msie) {
      try {
        var tgbtn = new ActiveXObject("FRIPControls.FRIPToggleButton.1");
        tgbtn = null;
        ip = 1;
        top.g_html_only = false;
      } catch (err) {
        /* nop */
      }
    }
    if (ip) {
      // Use cgtpsvr iframe to login
      return true;
    }
  }
  cgtpfrm.document.location.href =
    "/SOFTPART/SFDIAGTP?fc=0x43000f&=0&=../../frh/jcgtp/cgtpmain.htm&=" +
    config_mode +
    "&=" +
    ip +
    "&_seq=" +
    new Date().getTime();
  return false;
} // rpcmc_login

// Send a request to the web server to log out our cgtp connection.
// fc=0x430017 is HCFC_CGTPLOGOUT_C
function rpcmc_logout() {
  if (!top.g_connect_id) {
    return;
  }
  // jQuery $.get does not work here
  var connect_id = top.g_connect_id;
  top.g_connect_id = 0; // stop other events
  var request = null;
  if (window.XMLHttpRequest) {
    request = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    request = new ActiveXObject("Microsoft.XMLHTTP");
  }
  if (request) {
    // Add try/catch since controller may be dead
    try {
      request.open(
        "GET",
        "/SOFTPART/SFDIAGTP?fc=0x430017&=" +
          connect_id +
          "&_seq=" +
          new Date().getTime(),
        false
      );
      request.send();
    } catch (err) {
      /* nop */
    }
  }
} // rpcmc_logout

/**
 * Set IO comment
 * (IN) type : IO type
 * (IN) index: index of IO port
 * (IN) commet: IO comment
 * (IN) callback  : A callback function to change program.
 */
function setIOcomment(type, index, comment, callback) {
  $.getJSON(
    "/COMET/rpc?func=IODEFPN&type=" +
      type +
      "&index=" +
      index +
      "&comment=" +
      comment,
    function (json) {
      if (json.FANUC.RPC != undefined) {
        json.FANUC.RPC[0].status = json.FANUC.RPC[0].status.toLowerCase();
        if (callback != undefined) {
          callback(json.FANUC.RPC[0].status, type, index);
        }
      } else {
        rpcmc_rprintf("[rpcmc] unexpected reply " + JSON.stringify(json));
      }
    }
  );
}

/**
 * Get IO comment
 * (IN) type : IO type
 * (IN) index: index of IO port
 * (IN) callback  : A callback function to change program.
 */
function getIOcomment(type, index, callback) {
  $.getJSON(
    "/COMET/rpc?func=IOGETPN&type=" + type + "&index=" + index,
    function (json) {
      if (json.FANUC.RPC != undefined) {
        json.FANUC.RPC[0].status = json.FANUC.RPC[0].status.toLowerCase();
        var str = json.FANUC.RPC[0].value;
        if (callback != undefined) {
          callback(json.FANUC.RPC[0].status, type, index, str);
        }
      } else {
        rpcmc_rprintf("[rpcmc] unexpected reply " + JSON.stringify(json));
      }
    }
  );
}

/**
 * Read Num Register Value.
 * (IN) index  : Reg Index
 * (IN) callback : callback function when data received
 * (IN) callbackarg : callback arugment
 */
function readRegval(index, callback) {
  $.getJSON("/COMET/rpc?func=REGVALRD&index=" + index, function (json) {
    if (json.FANUC.RPC != undefined) {
      json.FANUC.RPC[0].status = json.FANUC.RPC[0].status.toLowerCase();
      var str = json.FANUC.RPC[0].value;
      var comment = json.FANUC.RPC[0].comment;
      if (callback != undefined) {
        callback(json.FANUC.RPC[0].status, index, str, comment);
      }
    } else {
      rpcmc_rprintf("[rpcmc] unexpected reply " + JSON.stringify(json));
    }
  });
} // readRegval

/**
 * Read Position Register Value.
 * (IN) grp_num  : Group Number
 * (IN) index  : Reg Index
 * (IN) callback : callback function when data received
 * (IN) callbackarg : callback arugment
 */
function readPosRegval(grp_num, index, callback, callbackarg) {
  $.getJSON(
    "/COMET/rpc?func=POSREGVALRD&grp_num=" + grp_num + "&index=" + index,
    function (json) {
      if (json.FANUC.RPC != undefined) {
        json.FANUC.RPC[0].status = json.FANUC.RPC[0].status.toLowerCase();
        var str = json.FANUC.RPC[0].value;
        if (callback != undefined) {
          callback(json.FANUC.RPC[0].status, grp_num, index, str, callbackarg);
        }
      } else {
        rpcmc_rprintf("[rpcmc] unexpected reply " + JSON.stringify(json));
      }
    }
  );
} // readPosRegval

// Perform KCL Command
//
// Usage:
//  rpcmc_cpkcl(kcl_cmd, cgop_HandleCpkclCallback, data);
//
function rpcmc_cpkcl(
  kcl_cmd, // (in)  KCL command string
  callback, // (in)  function to callback when data received
  callbackarg1
) {
  // (in)  Usually 'data' object for callback
  $.getJSON("/COMET/rpc?func=CPKCL&kcl_cmd=" + kcl_cmd, function (json) {
    if (undefined != json.FANUC.RPC) {
      if (callback != undefined) {
        callback(json.FANUC.RPC[0].status, callbackarg1);
      }
    } else {
      rpcmc_rprintf("[rpcmc_cpkcl] unexpected reply " + JSON.stringify(json));
    }
  });
} // rpcmc_cpkcl

// Call erpost with up to 10 optional parameters.
// KINTEGER, KREAL, KSTRING are supported.
// Usage:
//  rpcmc_erpost(top.g_connect_id, XMLSTAT_USERTAG, 0, 2, KSTRING, "<MOD",
//               KSTRING, "<MOD with no id");
function rpcmc_erpost(conn_id, error_code, cause_code, num_param) {
  var idx,
    param_idx = 0;
  var param_count = 0;
  var base_length = rpcmc_erpost.length;
  var erpost_str = "";
  var scan_lim = Math.min(
    num_param * 2,
    arguments.length - base_length,
    RPMAX_PARAMS * 2
  );
  // Parse ERPOST params
  for (idx = base_length; idx < base_length + scan_lim; idx++) {
    if (!((idx - base_length) % 2)) {
      if (typeof arguments[idx] === "number") {
        switch (arguments[idx]) {
          case KINTEGER:
          case KREAL:
          case KSTRING:
            erpost_str += "&ertyp" + param_idx + "=" + arguments[idx];
            break;
          default:
            rpcmc_rprintf(
              "[rpcmc_erpost] Invalid parameter type: " +
                arguments[idx] +
                ", discarding"
            );
            idx++;
            break;
        }
      } else {
        rpcmc_rprintf(
          "[rpcmc_erpost] Expected number, received " +
            typeof arguments[idx] +
            ", discarding"
        );
        idx++;
      }
    } else {
      erpost_str += "&erdat" + param_idx + "=" + arguments[idx];
      param_idx++;
      param_count++;
    }
  }

  // Update erpost string
  erpost_str =
    "/COMET/RPC?func=ERPOST" +
    "&connect_id=" +
    conn_id +
    "&er_code=" +
    error_code +
    "&er_cause=" +
    cause_code +
    "&param_cnt=" +
    param_count +
    erpost_str;

  // We have our erpost string, make ajax GET request
  $.getJSON(erpost_str, function (json) {
    if (undefined != json.FANUC.RPC) {
      if (json.FANUC.RPC[0].status != 0) {
        rpcmc_rprintf(
          "[rpcmc_erpost] failed, status " + json.FANUC.RPC[0].status
        );
      }
    } else {
      rpcmc_rprintf("[rpcmc_erpost] unexpected reply " + JSON.stringify(json));
    }
  });
} // rpcmc_erpost

/**
 * Get Macro List
 */
function rpcmc_gtmcrlst(callback) {
  $.getJSON("/COMET/rpc?func=GTMCRLST", function (json) {
    if (json.FANUC.RPC != undefined) {
      json.FANUC.RPC[0].status = json.FANUC.RPC[0].status.toLowerCase();
      var macrolist = json.FANUC.RPC[0].macrolist;
      var n_macrolist = macrolist.length;
      if (callback != undefined) {
        callback(json.FANUC.RPC[0].status, macrolist, n_macrolist);
      }
    } else {
      rpcmc_rprintf("[rpcmc] unexpected reply " + JSON.stringify(json));
    }
  });
} // gtmcrlst

/**
 * Convert position data and return the string using a callback routine.
 * (IN) in_buf   : position data
 * (IN) callback : callback function when data received
 *          arg1 : = status
 *          arg2 : = pos_type
 *          arg3 : = Position Data
 */
function rpcmc_mnchgrep(
  in_buf, // (in)  position data
  callback, // (in)  callback function when data received
  callbackarg
) {
  // (in)  callback argument
  $.getJSON("/COMET/rpc?func=MNCHGREP&in_buf=" + in_buf, function (json) {
    if (json.FANUC.RPC != undefined) {
      json.FANUC.RPC[0].status = json.FANUC.RPC[0].status.toLowerCase();
      var status = json.FANUC.RPC[0].status;
      var str = json.FANUC.RPC[0].value;
      callback(status, str, callbackarg);
    } else {
      rpcmc_rprintf("[rpcmc] unexpected reply " + JSON.stringify(json));
    }
  });
} // rpcmc_mnchgrep

// Read I/O or variable for control check properties.
// Return the string using a callback routine (with 2 arguments)
// Required because rpcmc_iovalrd() and rpcmc_getVar() don't callback for errors
// IO Usage:
//  rpcmc_chkkey(io_type, io_index, null, null, HandleChkkeyCallback, data);
//
// VAR Usage:
//  rpcmc_chkkey(io_type, mor_ss_c, prog_name, var_name, HandleChkkeyCallback, data);
//
function rpcmc_chkkey(
  io_type, // (in)  I/O type
  io_index, // (in)  I/O index for var case, null otherwise
  prog_name, // (in)  program name for var case, null otherwise
  var_name, // (in)  variable name for var case, null otherwise
  callback, // (in)  callback function when data received
  callbackarg1
) {
  // (in)  argument for callback function

  var str = null;
  var chk_status = 0;

  if (io_index == mor_ss_c && prog_name && var_name) {
    $.getJSON(
      "/COMET/rpc?func=VMIP_READVA" +
        "&prog_name=" +
        prog_name +
        "&var_name=" +
        var_name,
      function (json) {
        try {
          if (undefined != json.FANUC.RPC) {
            if (json.FANUC.RPC[0].status != 0) {
              rpcmc_rprintf(
                "[rpcmc] chkkey vmip_readva [" +
                  prog_name +
                  "]" +
                  var_name +
                  " failed, status " +
                  json.FANUC.RPC[0].status
              );
            } else {
              str = json.FANUC.RPC[0].value;
            }
            chk_status = json.FANUC.RPC[0].status;
            callback(io_type, io_index, str, callbackarg1, chk_status);
          }
        } catch (err) {
          /* nop */
        }
      }
    );
  } else {
    $.getJSON(
      "/COMET/rpc?func=IOVALRD" + "&type=" + io_type + "&index=" + io_index,
      function (json) {
        try {
          if (undefined != json.FANUC.RPC) {
            if (json.FANUC.RPC[0].status != 0) {
              rpcmc_rprintf(
                "[rpcmc] chkkey iovalrd " +
                  io_type +
                  "[" +
                  io_index +
                  "] failed, status " +
                  json.FANUC.RPC[0].status
              );
            } else {
              str = json.FANUC.RPC[0].value;
            }
            chk_status = json.FANUC.RPC[0].status;
            callback(io_type, io_index, str, callbackarg1, chk_status);
          }
        } catch (err) {
          /* nop */
        }
      }
    );
  }
} // rpcmc_chkkey

// Start PMON monitor for the I/O port.
function rpcmc_startIOGroupMonitor(
  io_type, // (in)  I/O port type
  io_index, // (in)  I/O port index
  io_count
) {
  // (in)  I/O port count
  if (!top.g_connect_id) {
    return;
  }
  $.getJSON(
    "/COMET/rpc?func=PMON_START_MON" +
      "&connect_id=" +
      top.g_connect_id +
      "&type=" +
      io_type +
      "&index=" +
      io_index +
      "&cnt=" +
      io_count,
    function (json) {
      if (undefined != json.FANUC.RPC) {
        if (json.FANUC.RPC[0].status != 0) {
          rpcmc_rprintf(
            "[rpcmc] pmon_start_mon I/O " +
              io_type +
              "[" +
              io_index +
              "] failed, status " +
              json.FANUC.RPC[0].status
          );
        }
      } else {
        rpcmc_rprintf("[rpcmc] unexpected reply " + JSON.stringify(json));
      }
    }
  );
} // rpcmc_startIOMonitor

// Stop PMON monitor for the I/O port.
function rpcmc_stopIOGroupMonitor(
  io_type, // (in)  I/O port type
  io_index, // (in)  I/O port index
  io_count
) {
  // (in)  I/O port count
  if (!top.g_connect_id) {
    return;
  }
  $.getJSON(
    "/COMET/rpc?func=PMON_STOP_MON" +
      "&connect_id=" +
      top.g_connect_id +
      "&type=" +
      io_type +
      "&index=" +
      io_index +
      "&cnt=" +
      io_count,
    function (json) {
      if (undefined != json.FANUC.RPC) {
        if (json.FANUC.RPC[0].status != 0) {
          rpcmc_rprintf(
            "[rpcmc] pmon_stop_mon I/O " +
              io_type +
              "[" +
              io_index +
              "] failed, status " +
              json.FANUC.RPC[0].status
          );
        }
      } else {
        rpcmc_rprintf("[rpcmc] unexpected reply " + JSON.stringify(json));
      }
    }
  );
} // rpcmc_stopIOMonitor

// Start PMON monitor for the I/O port.
function rpcmc_startIONSGroupMonitor(
  io_type, // (in)  I/O port type
  io_index, // (in)  I/O port index
  io_count
) {
  // (in)  I/O port count
  if (!top.g_connect_id) {
    return;
  }
  $.getJSON(
    "/COMET/rpc?func=PMON_START_MON" +
      "&connect_id=" +
      top.g_connect_id +
      "&type=" +
      io_type +
      "&index=" +
      io_index +
      "&cnt=" +
      io_count +
      "&mon_type=" +
      PMON_MON_IO_NS_C,
    function (json) {
      if (undefined != json.FANUC.RPC) {
        if (json.FANUC.RPC[0].status != 0) {
          rpcmc_rprintf(
            "[rpcmc] pmon_start_mon I/O " +
              io_type +
              "[" +
              io_index +
              "] failed, status " +
              json.FANUC.RPC[0].status
          );
        }
      } else {
        rpcmc_rprintf("[rpcmc] unexpected reply " + JSON.stringify(json));
      }
    }
  );
} // rpcmc_startIOMonitor

// Stop PMON monitor for the I/O port.
function rpcmc_stopIONSGroupMonitor(
  io_type, // (in)  I/O port type
  io_index, // (in)  I/O port index
  io_count
) {
  // (in)  I/O port count
  if (!top.g_connect_id) {
    return;
  }
  $.getJSON(
    "/COMET/rpc?func=PMON_STOP_MON" +
      "&connect_id=" +
      top.g_connect_id +
      "&type=" +
      io_type +
      "&index=" +
      io_index +
      "&cnt=" +
      io_count +
      "&mon_type=" +
      PMON_MON_IO_NS_C,
    function (json) {
      if (undefined != json.FANUC.RPC) {
        if (json.FANUC.RPC[0].status != 0) {
          rpcmc_rprintf(
            "[rpcmc] pmon_stop_mon I/O " +
              io_type +
              "[" +
              io_index +
              "] failed, status " +
              json.FANUC.RPC[0].status
          );
        }
      } else {
        rpcmc_rprintf("[rpcmc] unexpected reply " + JSON.stringify(json));
      }
    }
  );
} // rpcmc_stopIOMonitor

function rpcmc_iogtall(
  iotype, // (in)  I/O type
  index, // (in)  I/O index
  count, // (in)  I/O count
  callback, // (in)  callback function when data received
  callbackarg1, // (in)  argument for callback function
  callbackarg2
) {
  // (in)  argument for callback function
  var value = null;
  var chk_status = 0;
  $.getJSON(
    "/COMET/rpc?func=IOGTALL" +
      "&type=" +
      iotype +
      "&index=" +
      index +
      "&cnt=" +
      count,
    function (json) {
      try {
        if (undefined != json.FANUC.RPC) {
          if (json.FANUC.RPC[0].status != 0) {
            rpcmc_rprintf(
              "[rpcmc] iogetall " +
                io_type +
                "[" +
                io_index +
                "] failed, status " +
                json.FANUC.RPC[0].status
            );
          } else {
            value = json.FANUC.RPC[0].value;
          }
          chk_status = json.FANUC.RPC[0].status;
          callback(
            status,
            iotype,
            index,
            count,
            value,
            callbackarg1,
            callbackarg2
          );
        }
      } catch (err) {
        /* nop */
      }
    }
  );
} // rpcmc_iogtall
