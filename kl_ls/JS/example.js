//  * Read Position Register Value.
//  * (IN) grp_num  : Group Number
//  * (IN) index  : Reg Index
//  * (IN) callback : callback function when data received
//  * (IN) callbackarg : callback arugment
//  */
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
