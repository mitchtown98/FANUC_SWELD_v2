// Use jQuery
/*
 * jQuery JavaScript Library
 * https://jquery.com/
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 */
// Use jQuery
/*
 * jQuery JavaScript Library
 * https://jquery.com/
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 */
//=============================================================================
// define
//=============================================================================

//-----/frh/irprog/ihmieditor/js/ihmieditor_detail.js

//=============================================================================
// Global variable
//=============================================================================
var addProg = [];
var dropProgNum;
var dropProgEndNum;
var addDropTarget = "";
var voffsetArg = {
  vreg: "-1",
  posKind: parent.POS_KIND_POSNUM,
};
/*
 =========================================================================
 @function name        : detailTab_disp
 @argument[targetElm]  : 
 @description          : Detailed tab display switching when icon is selected
 @return               : none
 =========================================================================
*/
function detailTab_disp(targetElm) {
  /* Switch to details tab */
  $("#progTab_1").removeClass("progTab_active");
  $("#progArea_1").css({ display: "none" });
  $("#progTab_2").addClass("progTab_active");
  $("#progArea_2").css({ display: "block" });

  /* Switching display items according to icon type */
  $(".detail_actSet").removeClass("active_disp");
  document.getElementById("detail_version").classList.add("hide");

  var params = [];
  var tmp_param = [];
  var frm_id = get_detail_frm_id(targetElm.id);
  document.getElementById("detail_act").classList.add("active");
  $("#" + frm_id).off();
  if (document.getElementById(frm_id) == null) {
    if (typeof g_program_data[targetElm.id].iconNo === "number") {
      /* Add display element */
      append_detailhtml(detailId[g_program_data[targetElm.id].iconNo].actSetId);
    } else {
      /* Add display element */
      append_detailhtml_addinst(g_program_data[targetElm.id].iconNo);
    }
    if (frm_id) {
      $("#" + frm_id).on("load", detail_load);
      lateralResizeFunc();
    }
  } else {
    lateralResizeFunc();
    document.getElementById(frm_id).parentElement.classList.add("active_disp");
    detail_load();
  }
}

/*
 =========================================================================
 @function name      : get_detail_frm_id
 @argument[actElmId] : 
 @description        : Get the iframe ID of the details screen.
 @return             : detail_frm id
 =========================================================================
*/
function get_detail_frm_id(actElmId) {
  var frm_id = "";
  if (g_program_data[actElmId] != undefined) {
    var tblIndex = get_iconTbl_iconNumIndex(g_program_data[actElmId].iconNo);
    frm_id = "detail_frm_" + tblIndex;
  }

  return frm_id;
}

/*
 =========================================================================
 @function name   : detail_load
 @argument[event] : onload event
 @description     : Function execution and input value setting when reading the details tab.
 @return          : none
 =========================================================================
*/
var g_labelNumList = [];
var g_labelNumList_bkup = [];
function detail_load(event) {
  if (MODE_ACTION === MODE_STANDALONE) {
    return false;
  }
  var skFlg = true;
  var dtfrm = document.getElementById(
    get_detail_frm_id(activeTarget)
  ).contentWindow;
  // Set functions and values required for each process.
  switch (g_program_data[activeTarget].iconNo) {
    case ICON_NO_STRAIGHT:
      titleIns(langResource.ihmieditor_title_linermotion_c);
      detail_load_straight(dtfrm);
      break;
    case ICON_NO_KAKUJIKU:
      titleIns(langResource.ihmieditor_title_jointmotion_c);
      detail_load_kakujiku(dtfrm);
      break;
    case ICON_NO_CIRCULAR:
      titleIns(langResource.ihmieditor_title_curve);
      detail_load_circular(dtfrm);
      break;
    case ICON_NO_MACRO:
      titleIns(langResource.ihmieditor_title_macro_c);
      if (g_program_data[activeTarget].param == "") {
        var param = "";
      } else {
        var param = g_program_data[activeTarget].param;
      }
      dtfrm.document
        .getElementById("macro_name")
        .refresh(macro_list, param, null, false);
      dtfrm.document
        .getElementById("macro_name")
        .setCallback(dtfrm.callbackSelect);
      break;
    case ICON_NO_CALL:
      titleIns(langResource.ihmieditor_title_call_c);
      if (g_karel_enbl == null) {
        getKarelEnbl(event);
        return;
      } else {
        detail_load_call();
      }
      break;
    case ICON_NO_WAIT:
      titleIns(langResource.ihmieditor_title_wait_c);
      detail_load_wait(dtfrm);
      break;
    case ICON_NO_IF:
      titleIns(langResource.ihmieditor_title_if_c);
      detail_load_if(dtfrm);
      break;
    case ICON_NO_REGI:
      titleIns(langResource.ihmieditor_title_register_c);
      detail_load_regi(dtfrm);
      break;
    case ICON_NO_FOR:
      titleIns(langResource.ihmieditor_title_for_c);
      detail_load_for(dtfrm);
      break;
    case ICON_NO_COMMENT:
      titleIns(langResource.ihmieditor_title_comment_c);
      dtfrm.document
        .getElementById("comment")
        .setConfig(
          dtfrm.inputFilter.filter,
          dtfrm.inputFilter.validate,
          dtfrm.inputFilter.minLen
        );
      dtfrm.document
        .getElementById("comment")
        .refresh(g_program_data[activeTarget].param, 32, false);
      dtfrm.document
        .getElementById("comment")
        .setCallback(dtfrm.textboxCallback);
      break;
    case ICON_NO_NOSUPPORT:
      titleIns(langResource.ihmieditor_title_text_code_c);
      dtfrm.document
        .getElementById("text_form")
        .setConfig(
          dtfrm.inputFilter.filter,
          dtfrm.inputFilter.validate,
          dtfrm.inputFilter.minLen
        );
      dtfrm.document
        .getElementById("text_form")
        .refresh(langConvEng(g_program_data[activeTarget].param), 255, false);
      dtfrm.document
        .getElementById("text_form")
        .setCallback(dtfrm.textboxCallback);
      break;
    case ICON_NO_VSN_LINE:
      var selType = "";
      titleIns(langResource.ihmieditor_title_linermotion_v_c);
      detail_load_straight(dtfrm);
      dtfrm.document
        .getElementById("accordionSet")
        .classList.remove("position-folding-bg-desc");
      dtfrm.document
        .getElementById("accordionSet")
        .classList.add("position-folding-bg-asc");
      dtfrm.document.getElementById("accordionSetOpen").classList.add("hide");

      for (var cnt in dtfrm.VRIndirectOrder) {
        dtfrm.VRIndirectOrder[cnt][4] = "0";
      }

      var voffsetVRStr = ORDER_VOFFSET + "," + ORDER_VR;
      var indirect = null;
      var vrChk = g_program_data[activeTarget].addMotion.filter(function (
        data
      ) {
        return data.indexOf(voffsetVRStr) != -1;
      });
      if (vrChk.length > 0) {
        var replaceStr = new RegExp("(" + voffsetVRStr + "\\[|\\]$)", "g");
        var vrPrm = vrChk[0].replace(replaceStr, "");
        var rStr = new RegExp(ORDER_REGI + "\\[");
        var arStr = new RegExp(ORDER_ARGUMENT + "\\[");
        if (vrPrm.match(arStr)) {
          indirect = vrPrm.replace(arStr, "").replace(/\]$/, "");
          vrPrm = dtfrm.POS_VREG_INDIRECT_AR;
        } else if (vrPrm.match(rStr)) {
          indirect = vrPrm.replace(rStr, "").replace(/\]$/, "");
          vrPrm = dtfrm.POS_VREG_INDIRECT_R;
        }
        voffsetArg.vreg = vrPrm;
      } else {
        voffsetArg.vreg = dtfrm.POS_VREG_UNDEFINE;
      }
      selType =
        voffsetArg.vreg === dtfrm.POS_VREG_UNDEFINE
          ? dtfrm.POS_VREG_UNDEFINE
          : "0";
      top.IHMIComponents.cf.turnOnOffClass(
        dtfrm.document.getElementById("savedNo"),
        "hide",
        voffsetArg.vreg === dtfrm.POS_VREG_UNDEFINE
      );
      dtfrm.document.getElementById("selType").refresh(null, selType, false);
      dtfrm.document
        .getElementById("selType")
        .setCallback(dtfrm.callBackSelectTypeReg);
      dtfrm.document
        .getElementById("selVRIndex")
        .setCallback(dtfrm.callBackSelectVisReg);
      dtfrm.getRegisterInfo(voffsetArg.vreg, indirect);
      break;
    case ICON_NO_VSN_JOINT:
      var selType = "";
      titleIns(langResource.ihmieditor_title_jointmotion_v_c);
      detail_load_kakujiku(dtfrm);
      dtfrm.document
        .getElementById("accordionSet")
        .classList.remove("position-folding-bg-desc");
      dtfrm.document
        .getElementById("accordionSet")
        .classList.add("position-folding-bg-asc");
      dtfrm.document.getElementById("accordionSetOpen").classList.add("hide");

      for (var cnt in dtfrm.VRIndirectOrder) {
        dtfrm.VRIndirectOrder[cnt][4] = "0";
      }

      var indirect = null;
      var voffsetVRStr = ORDER_VOFFSET + "," + ORDER_VR;
      var vrChk = g_program_data[activeTarget].addMotion.filter(function (
        data
      ) {
        return data.indexOf(voffsetVRStr) != -1;
      });
      if (vrChk.length > 0) {
        var replaceStr = new RegExp("(" + voffsetVRStr + "\\[|\\]$)", "g");
        var vrPrm = vrChk[0].replace(replaceStr, "");
        var rStr = new RegExp(ORDER_REGI + "\\[");
        var arStr = new RegExp(ORDER_ARGUMENT + "\\[");
        if (vrPrm.match(arStr)) {
          indirect = vrPrm.replace(arStr, "").replace(/\]$/, "");
          vrPrm = dtfrm.POS_VREG_INDIRECT_AR;
        } else if (vrPrm.match(rStr)) {
          indirect = vrPrm.replace(rStr, "").replace(/\]$/, "");
          vrPrm = dtfrm.POS_VREG_INDIRECT_R;
        }
        voffsetArg.vreg = vrPrm;
      } else {
        voffsetArg.vreg = dtfrm.POS_VREG_UNDEFINE;
      }
      selType =
        voffsetArg.vreg === dtfrm.POS_VREG_UNDEFINE
          ? dtfrm.POS_VREG_UNDEFINE
          : "0";
      top.IHMIComponents.cf.turnOnOffClass(
        dtfrm.document.getElementById("savedNo"),
        "hide",
        voffsetArg.vreg === dtfrm.POS_VREG_UNDEFINE
      );
      dtfrm.document.getElementById("selType").refresh(null, selType, false);
      dtfrm.document
        .getElementById("selType")
        .setCallback(dtfrm.callBackSelectTypeReg);
      dtfrm.document
        .getElementById("selVRIndex")
        .setCallback(dtfrm.callBackSelectVisReg);
      dtfrm.getRegisterInfo(voffsetArg.vreg, indirect);
      break;
    case ICON_NO_ARC_LINE:
      titleIns(langResource.ihmieditor_title_linermotion_a_c);
      /* Position information */
      var initArgs = loadParam_posCmp_initArg(
        g_program_data[activeTarget].position[0].number,
        g_program_data[activeTarget].position[0].kind,
        dtfrm.document.getElementById("robotPos")
      );
      if (
        !unredo_flg ||
        g_RO_flg ||
        !g_TPenbl_flg ||
        $("#viewchange")[0].classList.contains("vrtclview")
      ) {
        initArgs.fold = false;
      }
      dtfrm.document.getElementById("robotPos").refresh(initArgs);
      dtfrm.document
        .getElementById("robotPos")
        .setCallback(dtfrm.callBackPosition);
      dtfrm.document
        .getElementById("robotPos")
        .setIdListCallback(getProgramPositionIdList);

      break;
    case ICON_NO_ARC_CIRCLE:
      titleIns(langResource.ihmieditor_title_circlemotion_a_c);
      /* Position information */
      var initArgs = loadParam_posCmp_initArg(
        g_program_data[activeTarget].position[0].number,
        g_program_data[activeTarget].position[0].kind,
        dtfrm.document.getElementById("robotPos1")
      );
      var initArgs2 = loadParam_posCmp_initArg(
        g_program_data[activeTarget].position[1].number,
        g_program_data[activeTarget].position[1].kind,
        dtfrm.document.getElementById("robotPos2")
      );
      if (
        !unredo_flg ||
        g_RO_flg ||
        !g_TPenbl_flg ||
        $("#viewchange")[0].classList.contains("vrtclview")
      ) {
        initArgs.fold = false;
        initArgs2.fold = false;
      }

      dtfrm.document.getElementById("robotPos1").refresh(initArgs);
      dtfrm.document
        .getElementById("robotPos1")
        .setCallback(dtfrm.callBackPosition);
      dtfrm.document
        .getElementById("robotPos1")
        .setIdListCallback(getProgramPositionIdList);
      dtfrm.document.getElementById("robotPos2").refresh(initArgs2);
      dtfrm.document
        .getElementById("robotPos2")
        .setCallback(dtfrm.callBackPosition);
      dtfrm.document
        .getElementById("robotPos2")
        .setIdListCallback(getProgramPositionIdList);
      break;

    case ICON_NO_JUMP:
      titleIns(langResource.ihmieditor_title_jump_label_c);
      // dtfrm.document.getElementById('jump_dmycondi').setConfig(dtfrm.inputFilter.filter, dtfrm.inputFilter.validate, dtfrm.inputFilter.minLen);
      var tmpStr = g_program_data[activeTarget].param.split(",");
      var jump_str = new RegExp(ORDER_JUMP);
      var label_str = new RegExp(ORDER_LABEL);
      for (var jmpcnt = 0; jmpcnt < tmpStr.length; jmpcnt++) {
        if (tmpStr[jmpcnt].match(jump_str)) {
          var tmpJmpStr = tmpStr[jmpcnt].split(" ");
          for (var lblCnt = 0; lblCnt < tmpJmpStr.length; lblCnt++) {
            if (tmpJmpStr[lblCnt].match(label_str)) {
              var array = [];
              for (var listCnt in g_labelNumList) {
                array[listCnt] = g_labelNumList[listCnt].toString(10);
              }
              var setNumStr = detail_valReplace_chk(
                tmpJmpStr[lblCnt].replace(/[^0-9]/g, "")
              );
              dtfrm.document
                .getElementById("jump_select")
                .refresh(array, setNumStr, null, false);
              dtfrm.document
                .getElementById("jump_select")
                .setCallback(dtfrm.callbackSelect);
              break;
            }
          }
        }
      }
      break;
    case ICON_NO_LABEL:
      titleIns(langResource.ihmieditor_title_label_c);
      var labelNum =
        g_program_data[activeTarget].param !== "" &&
        g_program_data[activeTarget].param != undefined
          ? g_program_data[activeTarget].param.replace(/[^0-9]/g, "")
          : "0";
      dtfrm.document
        .getElementById("label_text")
        .refresh(labelNum, "1", "32766", false);
      dtfrm.document
        .getElementById("label_text")
        .setCallback(dtfrm.textboxCallback);
      dtfrm.document.getElementById("setreq_str").style.display = "";
      var rmv_str = new RegExp(ORDER_LABEL + "\\[", "g");
      var cpChk = g_program_data[activeTarget].param.replace(rmv_str, "");
      if (cpChk[0] === "*" || cpChk[0] === "0") {
        dtfrm.document.getElementById("setreq_str").style.display = "block";
        var cgInput = dtfrm.document.getElementsByTagName("INPUT");
        if (cpChk[0] === "*" && cgInput.length != 0) {
          for (var cnt = 0; cnt < cgInput.length; cnt++) {
            cgInput[cnt].style.color = "rgb(230, 0, 18)";
          }
        }
      }
      break;
    case ICON_NO_PAYLOAD:
      titleIns(langResource.ihmieditor_title_payload_setup_c);
      var replaceStr = new RegExp("^" + ORDER_PAYLOAD + "\\[|\\]$", "g");
      var chkStr = outputComment_del(
        g_program_data[activeTarget].param
      ).replace(replaceStr, "");
      var setNum = detail_valReplace_chk(chkStr.replace(/[^0-9]/g, ""));
      var regiStr = new RegExp("^" + ORDER_REGI + "\\[");
      if (chkStr.match(regiStr) == null) {
        dtfrm.document
          .getElementById("payload_select")
          .refresh(dtfrm.selectPayloadList, "0", null, false);
        dtfrm.document.getElementById("indexarea").style.display = "none";
        dtfrm.document.getElementById("constarea").style.display = "block";
        dtfrm.document
          .getElementById("payload_const")
          .refresh(setNum, "1", g_payload_schnum.toString(10), false);
        dtfrm.document
          .getElementById("payload_index")
          .refresh(
            "1",
            g_regIOlimit_val[ORDER_REGI].min.toString(10),
            g_regIOlimit_val[ORDER_REGI].max.toString(10),
            false
          );
      } else {
        dtfrm.document
          .getElementById("payload_select")
          .refresh(dtfrm.selectPayloadList, "1", null, false);
        dtfrm.document.getElementById("indexarea").style.display = "block";
        dtfrm.document.getElementById("constarea").style.display = "none";
        dtfrm.document
          .getElementById("payload_index")
          .refresh(
            setNum,
            g_regIOlimit_val[ORDER_REGI].min.toString(10),
            g_regIOlimit_val[ORDER_REGI].max.toString(10),
            false
          );
        dtfrm.document
          .getElementById("payload_const")
          .refresh("1", "1", g_payload_schnum.toString(10), false);
      }
      break;

    case ICON_NO_OUTPUT:
      titleIns(langResource.ihmieditor_title_externaloutoput_c);
      detail_load_output(dtfrm);
      break;
    case ICON_NO_NOCONNECT:
      titleIns(langResource.ihmieditor_title_noconnect_c);
      break;
    case ICON_NO_LASER_PRE:
    case ICON_NO_LASER_K_PRE:
      if (g_program_data[activeTarget].iconNo == ICON_NO_LASER_PRE) {
        detail_load_straight_laser(dtfrm);
      } else if (g_program_data[activeTarget].iconNo == ICON_NO_LASER_K_PRE) {
        detail_load_kakujiku_laser(dtfrm);
      }
      dtfrm.document.getElementById("pre_ls_tab").click();
      dtfrm.document.getElementById("positon_view").style.display = "none";
      dtfrm.document.getElementById("pre_ls_area").style.display = "block";
      detail_laser_load(
        dtfrm,
        g_program_data[activeTarget].iconNo,
        g_program_data[activeTarget].addMotion
      );
      break;
    case ICON_NO_LASER_PRE_SI:
      dtfrm.document.getElementById("pre_ls_area").style.display = "block";
      detail_laser_load(
        dtfrm,
        g_program_data[activeTarget].iconNo,
        g_program_data[activeTarget].param
      );
      break;
    case ICON_NO_LASER_LS:
    case ICON_NO_LASER_K_LS:
      var params = g_program_data[activeTarget].param;
      if (g_program_data[activeTarget].iconNo == ICON_NO_LASER_LS) {
        detail_load_straight_laser(dtfrm);
      } else if (g_program_data[activeTarget].iconNo == ICON_NO_LASER_K_LS) {
        detail_load_kakujiku_laser(dtfrm);
      }
      dtfrm.document.getElementById("ls_tab").click();
      detail_laser_load(
        dtfrm,
        g_program_data[activeTarget].iconNo,
        g_program_data[activeTarget].addMotion
      );
      break;
    case ICON_NO_LASER_LS_SI:
      detail_laser_load(
        dtfrm,
        g_program_data[activeTarget].iconNo,
        g_program_data[activeTarget].param
      );
      break;
    case ICON_NO_LASER_LE:
    case ICON_NO_LASER_K_LE:
      var params = g_program_data[activeTarget].param;
      if (g_program_data[activeTarget].iconNo == ICON_NO_LASER_LE) {
        detail_load_straight_laser(dtfrm);
      } else if (g_program_data[activeTarget].iconNo == ICON_NO_LASER_K_LE) {
        detail_load_kakujiku_laser(dtfrm);
      }
      dtfrm.document.getElementById("le_tab").click();
      detail_laser_load(
        dtfrm,
        g_program_data[activeTarget].iconNo,
        g_program_data[activeTarget].addMotion
      );
      break;
    case ICON_NO_LASER_LE_SI:
      var params = g_program_data[activeTarget].param;
      detail_laser_load(dtfrm, g_program_data[activeTarget].iconNo, params);
      break;
    case ICON_NO_LASER_PWC:
      detail_laser_load(
        dtfrm,
        g_program_data[activeTarget].iconNo,
        g_program_data[activeTarget].param
      );
      break;
    case ICON_NO_LASER_WIRC:
      detail_laser_load(
        dtfrm,
        g_program_data[activeTarget].iconNo,
        g_program_data[activeTarget].param
      );
      break;
    case ICON_NO_WELD_START_MO:
      titleIns(langResource.ihmieditor_title_arcstartml_c);
      detail_load_straight(dtfrm);
      var weldArgs = [];
      var delStr = new RegExp(
        "(^" + langResource.ihmieditor_order_weldstart_c + "\\[|\\]$)",
        "g"
      );
      var chkStr = new RegExp(
        "(" +
          langResource.ihmieditor_order_regi_c +
          "\\[(?<regiValue>\\d+|\\.\\.\\.)\\]|(?<directValue>\\d+(?:\\.\\d+)?|\\.\\.\\.))(?<units>[\\w%]+)?"
      );

      var params = g_program_data[activeTarget].addMotion.slice();
      for (var i in params) {
        if (
          params[i].indexOf(langResource.ihmieditor_order_weldstart_c) != -1
        ) {
          var replaceResult = params[i].replace(delStr, "");
          var splitResult = replaceResult.split(",");
          for (var i = 0; i < splitResult.length; i++) {
            var matchResult = splitResult[i].match(chkStr);
            var argObj = {};
            argObj.regi = matchResult.groups.regiValue ? true : false;
            argObj.value = matchResult.groups.regiValue
              ? matchResult.groups.regiValue
              : matchResult.groups.directValue;
            argObj.value = argObj.value == "..." ? "" : argObj.value;
            argObj.units = matchResult.groups.units
              ? matchResult.groups.units
              : "";
            weldArgs.push(argObj);
          }
        }
      }
      dtfrm.initDisp(weldArgs);
      break;
    case ICON_NO_ARC_STOP_MO:
      titleIns(langResource.ihmieditor_title_arcstopml_c);
      detail_load_straight(dtfrm);
      var weldArgs = [];
      var delStr = new RegExp(
        "(^" + langResource.ihmieditor_order_weldend_c + "\\[|\\]$)",
        "g"
      );
      var chkStr = new RegExp(
        "(" +
          langResource.ihmieditor_order_regi_c +
          "\\[(?<regiValue>\\d+|\\.\\.\\.)\\]|(?<directValue>\\d+(?:\\.\\d+)?|\\.\\.\\.))(?<units>[\\w%]+)?"
      );

      var params = g_program_data[activeTarget].addMotion.slice();
      for (var i in params) {
        if (params[i].indexOf(langResource.ihmieditor_order_weldend_c) != -1) {
          var replaceResult = params[i].replace(delStr, "");
          var splitResult = replaceResult.split(",");
          for (var i = 0; i < splitResult.length; i++) {
            var matchResult = splitResult[i].match(chkStr);
            var argObj = {};
            argObj.regi = matchResult.groups.regiValue ? true : false;
            argObj.value = matchResult.groups.regiValue
              ? matchResult.groups.regiValue
              : matchResult.groups.directValue;
            argObj.value = argObj.value == "..." ? "" : argObj.value;
            argObj.units = matchResult.groups.units
              ? matchResult.groups.units
              : "";
            weldArgs.push(argObj);
          }
        }
      }
      dtfrm.initDisp(weldArgs);
      break;
    case ICON_NO_WELD_START_AL:
      titleIns(langResource.ihmieditor_title_arcstartal_c);
      var weldArgs = [];
      var delStr = new RegExp(
        "(^" + langResource.ihmieditor_order_weldstart_c + "\\[|\\]$)",
        "g"
      );
      var chkStr = new RegExp(
        "(" +
          langResource.ihmieditor_order_regi_c +
          "\\[(?<regiValue>\\d+|\\.\\.\\.)\\]|(?<directValue>\\d+(?:\\.\\d+)?|\\.\\.\\.))(?<units>[\\w%]+)?"
      );

      var params = split_OptionParam();
      for (var i in params) {
        if (
          params[i].indexOf(langResource.ihmieditor_order_weldstart_c) != -1
        ) {
          var replaceResult = params[i].replace(delStr, "");
          var splitResult = replaceResult.split(",");
          for (var i = 0; i < splitResult.length; i++) {
            var matchResult = splitResult[i].match(chkStr);
            var argObj = {};
            argObj.regi = matchResult.groups.regiValue ? true : false;
            argObj.value = matchResult.groups.regiValue
              ? matchResult.groups.regiValue
              : matchResult.groups.directValue;
            argObj.value = argObj.value == "..." ? "" : argObj.value;
            argObj.units = matchResult.groups.units
              ? matchResult.groups.units
              : "";
            weldArgs.push(argObj);
          }
        }
      }
      dtfrm.initDisp(weldArgs);
      break;
    case ICON_NO_ARC_STOP_AL:
      titleIns(langResource.ihmieditor_title_arcstopal_c);
      var weldArgs = [];
      var delStr = new RegExp(
        "(^" + langResource.ihmieditor_order_weldend_c + "\\[|\\]$)",
        "g"
      );
      var chkStr = new RegExp(
        "(" +
          langResource.ihmieditor_order_regi_c +
          "\\[(?<regiValue>\\d+|\\.\\.\\.)\\]|(?<directValue>\\d+(?:\\.\\d+)?|\\.\\.\\.))(?<units>[\\w%]+)?"
      );

      var params = split_OptionParam();
      for (var i in params) {
        if (params[i].indexOf(langResource.ihmieditor_order_weldend_c) != -1) {
          var replaceResult = params[i].replace(delStr, "");
          var splitResult = replaceResult.split(",");
          for (var i = 0; i < splitResult.length; i++) {
            var matchResult = splitResult[i].match(chkStr);
            var argObj = {};
            argObj.regi = matchResult.groups.regiValue ? true : false;
            argObj.value = matchResult.groups.regiValue
              ? matchResult.groups.regiValue
              : matchResult.groups.directValue;
            argObj.value = argObj.value == "..." ? "" : argObj.value;
            argObj.units = matchResult.groups.units
              ? matchResult.groups.units
              : "";
            weldArgs.push(argObj);
          }
        }
      }
      dtfrm.initDisp(weldArgs);
      break;
    case ICON_NO_SET_UFRAME:
      titleIns(langResource.ihmieditor_title_set_uframe_c);
      var param = g_program_data[activeTarget].param.split("=");
      detail_load_frame_judgeVal("SET", dtfrm, "uframe", param[0]);
      detail_load_frame_judgeVal("SET", dtfrm, "posReg", param[1]);
      break;
    case ICON_NO_SET_UTOOL:
      titleIns(langResource.ihmieditor_title_set_utool_c);
      var param = g_program_data[activeTarget].param.split("=");
      detail_load_frame_judgeVal("SET", dtfrm, "utool", param[0]);
      detail_load_frame_judgeVal("SET", dtfrm, "posReg", param[1]);
      break;
    case ICON_NO_SEL_UFRAME:
      titleIns(langResource.ihmieditor_title_sel_uframe_c);
      detail_load_frame_judgeVal(
        "SEL",
        dtfrm,
        "uframe",
        g_program_data[activeTarget].param
      );
      break;
    case ICON_NO_SEL_UTOOL:
      titleIns(langResource.ihmieditor_title_sel_utool_c);
      detail_load_frame_judgeVal(
        "SEL",
        dtfrm,
        "utool",
        g_program_data[activeTarget].param
      );
      break;
    default:
      skFlg = false;
      titleIns(g_xml_data[g_program_data[activeTarget].iconNo][1]);
      var instObj =
        g_inst_obj[g_xml_data[g_program_data[activeTarget].iconNo][2]];
      /*colonMatch = Matches colon other than in single quotes*/
      var colonMatch = /:(?=([^']*'[^']*')*[^']*$)/;
      if (g_program_data[activeTarget].param != "") {
        var params = split_param_call(g_program_data[activeTarget].param);
        if (params[0] == "") {
          var param = "";
        } else {
          var param = params[0].trim();
          if (param.match(colonMatch)) {
            param = commentParse(param);
          }
        }
        if (params[1] === undefined) {
          params[1] = "";
        } else {
          params[1] = langConvEng(params[1].replace(/(\(|\))/g, ""));
          if (params[1].match(colonMatch)) {
            params[1] = commentParse(params[1]);
          }
        }
        var drawFunc = instObj.detail.disp;

        if (typeof g_stretchOrder_data[activeTarget] != "undefined") {
          var objCnt = Object.keys(g_stretchOrder_data[activeTarget]);
          var resultcnt = objCnt.filter(function (value) {
            return !isNaN(value);
          });
          var endParams = split_param_call(
            g_program_data[
              g_stretchOrder_data[activeTarget][resultcnt.length - 1].id
            ].param
          );
          if (endParams[1] === undefined) {
            endParams[1] = "";
          } else {
            endParams[1] = langConvEng(endParams[1].replace(/(\(|\))/g, ""));
            if (endParams[1].match(colonMatch)) {
              endParams[1] = commentParse(endParams[1]);
            }
          }
          var drawPrams = langConvEng(endParams[1]);
          var bkflg = true;
        } else {
          var bkflg = false;
          var drawPrams = langConvEng(params[1]);
        }
        if (drawPrams.match(colonMatch)) {
          drawPrams = commentParse(drawPrams);
        }
        if (drawFunc !== undefined && drawFunc != "") {
          if (bkflg) {
            if (
              !eval(
                "dtfrm." +
                  drawFunc +
                  '(["' +
                  params[1] +
                  '","' +
                  endParams[1] +
                  '"])'
              )
            ) {
              errPopUp(
                g_xml_data[g_program_data[activeTarget].iconNo][2] +
                  langResource.ihmieditor_pop_adinstructionnotfile_c +
                  "<br>" +
                  langResource.ihmieditor_pop_errorcode_c +
                  "[I501]<br>" +
                  langResource.ihmieditor_pop_moveprglist_c
              );
            }
          } else {
            if (!eval("dtfrm." + drawFunc + '("' + drawPrams + '")')) {
              errPopUp(
                g_xml_data[g_program_data[activeTarget].iconNo][2] +
                  langResource.ihmieditor_pop_adinstructionnotfile_c +
                  "<br>" +
                  langResource.ihmieditor_pop_errorcode_c +
                  "[I501]<br>" +
                  langResource.ihmieditor_pop_moveprglist_c
              );
            }
          }
        }
        var robotPos = $("#" + get_detail_frm_id(activeTarget))
          .contents()
          .find(".position");
        for (
          var robotpos_cnt = 0;
          robotpos_cnt < robotPos.length;
          robotpos_cnt++
        ) {
          dtfrm.document
            .getElementById(robotPos[robotpos_cnt].id)
            .setIdListCallback(getProgramPositionIdList);
        }
      }

      break;
  }

  unredo_flg = true;
  /* When loading for the first time */
  if (event) border_slideCheck();
  dispOffWaiting();

  /* Scrollbar setting */
  var content = dtlfrm_contentchk(activeTarget);
  if (content != null) {
    content.addEventListener("click", focusout_onclick, false);

    /* Detailed display of the screen in the read-only file */
    if (
      g_RO_flg ||
      !g_TPenbl_flg ||
      $("#viewchange")[0].classList.contains("vrtclview")
    ) {
      /* Setup a layer to block editing. */
      $(".restrictContainer").css({
        display: "block",
      });
      $(".restrictContainer").scrollTop(0);
      $(".restrictContainer").scrollLeft(0);
      $("#detailRestrict").css({
        height: content.scrollHeight,
        width: content.scrollWidth,
      });
    }

    /* Set horizontal scrolling. */
    $(content).css({
      "overflow-x": "auto",
      "overflow-y": "scroll",
      "white-space": "nowrap",
      "scrollbar-width": "none",
      "-ms-overflow-style": "none",
    });
    var insStr =
      '<style type="text/css">.content::-webkit-scrollbar{display:none;}</style>';
    if (content.ownerDocument.head.innerHTML.indexOf(insStr) == -1) {
      content.ownerDocument.head.innerHTML +=
        '<style type="text/css">.content::-webkit-scrollbar{display:none;}</style>';
    }
    detail_scrlCtrl(content);

    var config = {
      attributes: true,
      attributeFilter: ["style"],
      childList: true,
      subtree: true,
    };
    dtlMutObserver.observe(content, config);
  }
  if (DEBUG_TIME_MEASURE) {
    debug_time_output("dtl_load:");
  }
}

/*
 =========================================================================
 @function name    : commentParse
 @argument[]       :
 @argument[]       :
 @description      :
 @return           : commentParseParam
 =========================================================================
*/
function commentParse(drawPrams) {
  /*colonMatch = Matches colon other than in single quotes*/
  var colonMatch = /:(?=([^']*'[^']*')*[^']*$)/;
  /*commaMatch = Matches comma other than in single quotes and [] */
  var commaMatch = /,(?=(?:[^']*'[^']*')*[^']*$)(?![^\[]*\])/g;
  var splitParam = drawPrams.split(commaMatch);
  for (var i = 0; i < splitParam.length; i++) {
    if (splitParam[i].match(colonMatch)) {
      var start = splitParam[i].indexOf(":");
      var end = splitParam[i].lastIndexOf("]");
      var param1 = splitParam[i].substr(0, start);
      var param2 = splitParam[i].substr(end);
      splitParam[i] = param1 + param2;
    }
  }
  var commentParseParam = splitParam.join();
  return commentParseParam;
}
/*
 =========================================================================
 @function name    : addLabelNumList
 @argument[addNum] : The label number to be saved.
 @argument[oldNum] : Previous number.
 @description      : Save the label numbers in ascending order.
 @return           : none
 =========================================================================
*/
function addLabelNumList(addNum, oldNum) {
  if (addNum !== "") {
    if (oldNum != null) {
      delLabelNumList(oldNum);
    }
    /* If the label number is not kept, it is saved. */
    if (g_labelNumList.indexOf(addNum) === -1) {
      g_labelNumList.push(addNum);

      g_labelNumList.sort(compare);
    }
  }
}

/*
 =========================================================================
 @function name    : delLabelNumList
 @argument[delNum] : Label number to be deleted.
 @description      : Delete the label numbers in g_labelNumList[].
 @return           : none
 =========================================================================
*/
function delLabelNumList(delNum) {
  var newArray = g_labelNumList.filter((elm) => elm !== delNum);
  g_labelNumList = Array.from(newArray);
}

/*
 =========================================================================
 @function name  : set_detail_condParam
 @argument[kind] : 
 @description    : Determine which radio button to select.
 @return         : none
 =========================================================================
*/
function set_detail_condParam(kind, param) {
  var dtfrm = document.getElementById(
    get_detail_frm_id(activeTarget)
  ).contentWindow;
  var ret = false;
  var sel1 = null,
    sel1_num = null,
    sign = null,
    sel2 = null,
    sel2_num = null;
  param[0] = outputComment_del(param[0]);
  var chkStr = "";

  var toChkStr = new RegExp(ORDER_TIMEOUT + ",");
  if (
    param.length != 3 ||
    (param[2] != undefined && param[2].match(toChkStr))
  ) {
    dtfrm.document.getElementById("time_out_option").refresh(null, "1", false);
    dtfrm.document.getElementById("time_out_detail").classList.add("show");
    dtfrm.document.getElementById("time_out_detail").classList.remove("hidden");
    dtfrm.document.getElementsByClassName("radiobtn3")[0].style.marginTop =
      "242px";

    var split_param = param[2].split(",");
    var labelnum = split_param[1].replace(/[^0-9]/g, "");
    if (labelnum === "") labelnum = "0";
    var array = [];
    for (var listCnt in g_labelNumList) {
      array[listCnt] = g_labelNumList[listCnt].toString(10);
    }
    dtfrm.document
      .getElementById("jump_select")
      .refresh(array, labelnum, null, false);
    var arg = param[2].split(/\s/)[0];
    if (arg.indexOf(":") != -1) arg = arg.substr(0, arg.indexOf(":"));
    sel2_num = detail_valReplace_chk(arg.replace(/[^0-9]/g, ""));
  }

  /* Get the type of left side. */
  for (var cnt1 in detailCondVarSel_1) {
    chkStr = new RegExp(detailCondVarSel_1[cnt1].tp + "\\[");
    if (param[0].match(chkStr)) {
      sel1 = detailCondVarSel_1[cnt1].val;
      break;
    }
  }
  sel1_num = detail_valReplace_chk(param[0].replace(/[^0-9]/g, ""));
  dtfrm.inputVal[dtfrm.IDX_LEFT][detailCondVarSel_1[cnt1].tp].val =
    Number(sel1_num);

  /* Determine the sign table. */
  var tblJdg = detailCondSelOpe_1;
  var dtfrmSelTbl = dtfrm.componentList[dtfrm.IDX_SELECT][".operator_select1"];
  var targetElm1 = dtfrm.document.getElementById(kind + ".operator_select1");
  if (parseInt(detailCondVarSel_1[cnt1].val) > 4) {
    tblJdg = detailCondSelOpe_2;
    dtfrmSelTbl = dtfrm.componentList[dtfrm.IDX_SELECT][".operator_select2"];
    targetElm1 = dtfrm.document.getElementById(kind + ".operator_select2");
  }
  for (var cnt2 in tblJdg) {
    if (param[1] === tblJdg[cnt2].tp) {
      sign = tblJdg[cnt2].val;
      break;
    }
  }

  /* Get the type of right side. */
  var targetElm2 = null;
  var targetElm3 = null;
  var callFunc = null;
  var setArray = [];
  var valRange = { min: null, max: null };
  param[2] = outputComment_del(param[2]);
  if (sel2_num == null) {
    sel2_num = detail_valReplace_chk(param[2].replace(/[^0-9]/g, ""));
  }
  if (parseInt(detailCondVarSel_1[cnt1].val) <= 4) {
    chkStr = new RegExp(detailCondVarSel_2[1].tp);
    chkArgStr = new RegExp("^" + ORDER_ARGUMENT);
    var setArray = dtfrm.componentList[dtfrm.IDX_SELECT][".value_select1"];
    callFunc = dtfrm.switchValueDisplayPattern1;
    if (!param[2].match(chkArgStr)) {
      if (param[2].match(chkStr)) {
        sel2 = detailCondVarSel_2[1].val;
        valRange.min = g_regIOlimit_val[detailCondVarSel_2[1].tp].min;
        valRange.max = g_regIOlimit_val[detailCondVarSel_2[1].tp].max;
        targetElm2 = dtfrm.document.getElementById(kind + ".value_select1");
        targetElm3 = dtfrm.document.getElementById(kind + ".value_index");

        dtfrm.inputVal[dtfrm.IDX_RIGHT][detailCondVarSel_2[1].tp].val =
          Number(sel2_num);
      } else if (
        param[2].replace(/[0-9]/g, "") == "" ||
        (param[2].replace(/[0-9]/g, "") != "" && param[2].match(toChkStr))
      ) {
        sel2 = detailCondVarSel_2[0].val;
        valRange.min =
          dtfrm.componentList[dtfrm.IDX_TEXTBOX][".value_const"].min;
        valRange.max =
          dtfrm.componentList[dtfrm.IDX_TEXTBOX][".value_const"].max;
        if (sel2_num == null) {
          sel2_num = param[2].replace(/[^0-9]/g, "");
        }
        targetElm2 = dtfrm.document.getElementById(kind + ".value_select1");
        targetElm3 = dtfrm.document.getElementById(kind + ".value_const");
      } else {
        console.log("Right side parameter not set.");
      }
    }
  } else {
    for (var cnt3 in detailCondVarSel_3) {
      chkStr = new RegExp(detailCondVarSel_3[cnt3].tp);
      if (param[2].match(chkStr)) {
        sel2 = detailCondVarSel_3[cnt3].val;
        setArray = dtfrm.componentList[dtfrm.IDX_SELECT][".value_select2"];
        /* If it is "ON" or "OFF", set "Regi" temporarily. */
        if (
          setArray[0][0] == langConvEng(detailCondVarSel_3[cnt3].tp) ||
          setArray[1][0] == langConvEng(detailCondVarSel_3[cnt3].tp)
        ) {
          var limitVal = ORDER_REGI;
        } else {
          var limitVal = detailCondVarSel_3[cnt3].tp;

          dtfrm.inputVal[dtfrm.IDX_RIGHT][limitVal].val = Number(sel2_num);
        }
        valRange.min = g_regIOlimit_val[limitVal].min;
        valRange.max = g_regIOlimit_val[limitVal].max;
        callFunc = dtfrm.switchValueDisplayPattern2;
        targetElm2 = dtfrm.document.getElementById(kind + ".value_select2");
        targetElm3 = dtfrm.document.getElementById(kind + ".value_index");
        break;
      }
    }
  }

  /* Update when all values are obtained. */
  if (
    sel1 != null &&
    sel1_num != null &&
    sign != null &&
    sel2 != null &&
    sel2_num != null
  ) {
    ret = true;
    dtfrm.switchValueSelectDisplay(sel1);
    dtfrm.document
      .getElementById(kind + ".variable_select")
      .refresh(
        dtfrm.componentList[dtfrm.IDX_SELECT][".variable_select"],
        sel1,
        null,
        false
      );
    dtfrm.document
      .getElementById(kind + ".variable_index")
      .refresh(
        sel1_num,
        g_regIOlimit_val[detailCondVarSel_1[cnt1].tp].min,
        g_regIOlimit_val[detailCondVarSel_1[cnt1].tp].max,
        false
      );
    targetElm1.refresh(dtfrmSelTbl, sign, null, false);
    callFunc(sel2);
    targetElm2.refresh(setArray, sel2, null, false);
    targetElm3.refresh(sel2_num, valRange.min, valRange.max, false);
  }

  return ret;
}

/*
 =========================================================================
 @function name      : outputComment_del
 @argument[chkParam] : 
 @description        : 
 @return             : The string after deleting the comment.
 =========================================================================
*/
function outputComment_del(chkParam) {
  var retParam = chkParam;
  var delcmtFirst = chkParam.slice(0, chkParam.indexOf(":"));
  var delcmtSecond = chkParam.slice(chkParam.indexOf("]$"));
  retParam = delcmtFirst + delcmtSecond;
  return retParam;
}

/*
 =========================================================================
 @function name   : set_regi_condParam
 @argument[param] : 
 @description     : Determine which radio button to select.
 @return          : none
 =========================================================================
*/
function set_regi_condParam(param) {
  var dtfrm = document.getElementById(
    get_detail_frm_id(activeTarget)
  ).contentWindow;
  var idx1 = null;
  var selVal = null;
  var idx2 = null;
  var chkStr = "";

  param[0] = outputComment_del(param[0]);
  param[1] = outputComment_del(param[1]);

  idx1 = detail_valReplace_chk(param[0].replace(/[^0-9]/g, ""));

  for (var cnt in dtfrm.selectRegiValList) {
    if (
      dtfrm.selectRegiValList[cnt][0] ===
      langResource.ihmieditor_detail_constant_c
    ) {
      if (param[1].replace(/[0-9]/g, "") === "") {
        selVal = dtfrm.selectRegiValList[cnt][1];
        break;
      }
    } else {
      chkStr = new RegExp("^" + dtfrm.selectRegiValList[cnt][0]);
      if (param[1].match(chkStr)) {
        selVal = dtfrm.selectRegiValList[cnt][1];
        break;
      }
    }
  }

  idx2 = detail_valReplace_chk(param[1].replace(/[^0-9]/g, ""));

  /* Update when all values are obtained. */
  if (idx1 != null && selVal != null && idx2 != null) {
    dtfrm.document
      .getElementById("regi_index")
      .refresh(
        idx1,
        g_regIOlimit_val[ORDER_REGI].min,
        g_regIOlimit_val[ORDER_REGI].max,
        false
      );
    dtfrm.document
      .getElementById("regi_val_select")
      .refresh(dtfrm.regComponent["regi_val_select"].data, selVal, null, false);
    if (selVal === "0") {
      dtfrm.document.getElementById("indexarea").style.display = "none";
      dtfrm.document.getElementById("constarea").style.display = "block";
      dtfrm.document
        .getElementById("regi_val_const")
        .refresh(
          idx2,
          dtfrm.regComponent["regi_val_const"].min,
          dtfrm.regComponent["regi_val_const"].max,
          false
        );
    } else {
      dtfrm.document.getElementById("constarea").style.display = "none";
      dtfrm.document.getElementById("indexarea").style.display = "block";
      dtfrm.document
        .getElementById("regi_val_index")
        .refresh(
          idx2,
          g_regIOlimit_val[dtfrm.selectRegiValList[cnt][0]].min,
          g_regIOlimit_val[dtfrm.selectRegiValList[cnt][0]].max,
          false
        );

      dtfrm.inputVal[dtfrm.selectRegiValList[cnt][0]].val = Number(idx2);
    }
  }
}

/*
 =========================================================================
 @function name   : detail_load_straight
 @argument[dtfrm] : Frame on the detail screen.
 @description     : Function execution and input value setting when reading the details tab.
 @return          : none
 =========================================================================
*/
//Added to support position registers.To be deleted when the position register is officially supported.
function detail_load_straight(dtfrm) {
  /* Set the common items. */
  loadParam_motionCommon(dtfrm);

  /* Position information */
  var initArgs = loadParam_posCmp_initArg(
    g_program_data[activeTarget].position[0].number,
    g_program_data[activeTarget].position[0].kind,
    dtfrm.document.getElementById("robotPos")
  );
  if (
    !unredo_flg ||
    g_RO_flg ||
    !g_TPenbl_flg ||
    $("#viewchange")[0].classList.contains("vrtclview")
  ) {
    initArgs.fold = false;
  }
  dtfrm.document.getElementById("robotPos").refresh(initArgs);
  dtfrm.document.getElementById("robotPos").setCallback(dtfrm.callBackPosition);
  dtfrm.document
    .getElementById("robotPos")
    .setIdListCallback(getProgramPositionIdList);
}

/*
 =========================================================================
 @function name   : loadParam_speed
 @argument[dtfrm] : Frame on the detail screen.
 @description     : Function execution and input value setting when reading the details tab.
 @return          : none
 =========================================================================
*/
function loadParam_speed(dtfrm) {
  /* regi[regi */
  if (
    String(g_program_data[activeTarget].speed.method).indexOf(
      ORDER_REGI + "[" + ORDER_REGI + "["
    ) != -1
  ) {
    var method = dtfrm.selectOptionListSpeedMethod[2][1];
    var refreshElm = dtfrm.document.getElementById("speed_regi_regi_index");
  } else if (
    /* regi */
    String(g_program_data[activeTarget].speed.method).indexOf(
      ORDER_REGI + "["
    ) != -1
  ) {
    var method = dtfrm.selectOptionListSpeedMethod[1][1];
    var refreshElm = dtfrm.document.getElementById("speed_regi_index");
  } else if (
    /* weld speed */
    String(g_program_data[activeTarget].speed.val).indexOf(ORDER_WELD_SPEED) !=
    -1
  ) {
    // var method = dtfrm.selectOptionListSpeedMethod?.[3]?.[1];
    var method =
      dtfrm.selectOptionListSpeedMethod[3] &&
      dtfrm.selectOptionListSpeedMethod[3][1];
  } else {
    /* constant */
    var method = dtfrm.selectOptionListSpeedMethod[0][1];
  }
  if (method == undefined) {
    method = dtfrm.selectOptionListSpeedMethod[0][1];
  }
  dtfrm.document
    .getElementById("speed_method")
    .refresh(dtfrm.selectOptionListSpeedMethod, method, null, false);
  dtfrm.selectSpeedMethod("speed_method", null, method);
  if (refreshElm != undefined && refreshElm != null) {
    var regVal = g_program_data[activeTarget].speed.val.replace(/[^0-9]/g, "");
    regVal = regVal == "" ? "0" : regVal;
    refreshElm.refresh(
      regVal,
      g_regIOlimit_val[ORDER_REGI].min,
      g_regIOlimit_val[ORDER_REGI].max,
      false
    );
  }
  // speed
  for (var cnt = 0; cnt < dtfrm.selectOptionListSpeedUnit.length; cnt++) {
    var unitVal = dtfrm.selectOptionListSpeedUnit[cnt][1];
    if (
      dtfrm.selectOptionListSpeedUnit[cnt][0] ==
      g_program_data[activeTarget].speed.unit.replace(".", "")
    ) {
      dtfrm.document
        .getElementById("unit_l")
        .refresh(dtfrm.selectOptionListSpeedUnit, unitVal, null, false);
      if (method == dtfrm.selectOptionListSpeedMethod[0][1]) {
        var spdVal =
          g_program_data[activeTarget].speed.val == "..."
            ? "0"
            : g_program_data[activeTarget].speed.val;
        dtfrm.document
          .getElementById("speed_" + unitVal)
          .refresh(
            spdVal,
            spdValMinMax[dtfrm.selectOptionListSpeedUnit[cnt][0]][0],
            spdValMinMax[dtfrm.selectOptionListSpeedUnit[cnt][0]][1],
            false
          );
      }
      dtfrm.document
        .getElementById("speedTextBoxArea" + unitVal)
        .classList.remove("hide");
    } else {
      dtfrm.document
        .getElementById("speedTextBoxArea" + unitVal)
        .classList.add("hide");
    }
  }
  if (g_program_data[activeTarget].speed.unit === "") {
    var spdTxt = dtfrm.document.getElementById("unit_l").getValue();
    if (spdTxt != "") {
      dtfrm.document
        .getElementById("speedTextBoxArea" + spdTxt)
        .classList.remove("hide");
    }
  }
}

/*
 =========================================================================
 @function name   : loadParam_route
 @argument[dtfrm] : Frame on the detail screen.
 @description     : Function execution and input value setting when reading the details tab.
 @return          : none
 =========================================================================
*/
function loadParam_route(dtfrm) {
  switch (g_program_data[activeTarget].route.stop) {
    case ORDER_CNT + " " + ORDER_REGI:
      var stop = dtfrm.selectOptionListStop[2][1];
      var elm = dtfrm.document.getElementById("nameraka_regi_index");
      break;
    case ORDER_CR:
      var stop = dtfrm.selectOptionListStop[3][1];
      var elm = dtfrm.document.getElementById("stop_cr_val");
      break;
    case ORDER_CNT:
      var stop = dtfrm.selectOptionListStop[1][1];
      var elm = dtfrm.document.getElementById("nameraka_l");
      break;
    case ORDER_FINE:
    default:
      var stop = dtfrm.selectOptionListStop[0][1];
      break;
  }
  dtfrm.document
    .getElementById("stop_l")
    .refresh(dtfrm.selectOptionListStop, stop, null, false);
  dtfrm.selectStopUnit("stop_l", null, stop);
  if (elm != undefined && elm != null) {
    switch (elm.id) {
      case "nameraka_l":
        elm.refresh(
          ["0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"],
          String(g_program_data[activeTarget].route.val),
          null,
          false
        );
        break;
      case "stop_cr_val":
        elm.refresh(
          String(g_program_data[activeTarget].route.val),
          "0",
          "1000",
          false
        );
        break;
      case "nameraka_regi_index":
        var setVal =
          g_program_data[activeTarget].route.val === ""
            ? "0"
            : String(g_program_data[activeTarget].route.val);
        elm.refresh(
          setVal,
          g_regIOlimit_val[ORDER_REGI].min,
          g_regIOlimit_val[ORDER_REGI].max,
          false
        );
        break;
      default:
        break;
    }
  }
}

/*
 =========================================================================
 @function name   : loadParam_additionalMotion
 @argument[dtfrm] : Frame on the detail screen.
 @description     : Function execution and input value setting when reading the details tab.
 @return          : none
 =========================================================================
*/
function loadParam_additionalMotion(dtfrm) {
  var visionChk =
    g_program_data[activeTarget].iconNo == ICON_NO_VSN_LINE ||
    g_program_data[activeTarget].iconNo == ICON_NO_VSN_JOINT;
  var arcChk =
    g_program_data[activeTarget].iconNo == ICON_NO_WELD_START_MO ||
    g_program_data[activeTarget].iconNo == ICON_NO_ARC_STOP_MO;
  var optStr = g_program_data[activeTarget].addMotion.slice();
  if (optStr.length > 0) {
    if (visionChk && !arcChk) {
      for (var i in optStr) {
        if (
          optStr[i].indexOf(ORDER_VOFFSET + "," + ORDER_VR) != -1 ||
          optStr[i] == ORDER_VOFFSET
        ) {
          optStr.length == 1 ? (optStr[0] = "") : optStr.splice(i, 1);
        }
      }
    }
    if (arcChk) {
      for (var i in optStr) {
        if (
          optStr[i].indexOf(langResource.ihmieditor_order_weldstart_c) != -1 ||
          optStr[i].indexOf(langResource.ihmieditor_order_weldend_c) != -1
        ) {
          optStr.length == 1 ? (optStr[0] = "") : optStr.splice(i, 1);
        }
      }
    }
    dtfrm.document
      .getElementById("option_formlist")
      .refresh(null, optStr.length - 1, null, null);

    var newList = dtfrm.document.getElementsByClassName("input-form-list-row");
    for (var cnt = 0; cnt < newList.length; cnt++) {
      var nodes = newList[cnt].getElementsByTagName("input");
      nodes[0].refresh(langConvEng(optStr[cnt]), 255, false);
      nodes[0].setCallback(dtfrm.textboxCallback);
    }
    var jointExp = new RegExp("joint", "i");
    if (jointExp.test(activeTarget)) {
      // var addMotionVoffsetSprit = addMotionCondVarSel.filter(function(value) {
      //   return value[1] != "17" && value[1] != "18";
      // });
      dtfrm.document
        .getElementById("addmotion_select_" + cnt)
        .refresh(jointAddMotionCondVarSel, 0, null, false);
    } else {
      dtfrm.document
        .getElementById("addmotion_select_" + cnt)
        .refresh(addMotionCondVarSel, 0, null, false);
    }
    dtfrm.document
      .getElementById("addmotion_select_" + cnt)
      .setCallback(dtfrm.callbackSelectAddMotion);
  }
}

/*
 =========================================================================
 @function name   : loadParam_motionCommon
 @argument[dtfrm] : Frame on the detail screen.
 @description     : Function execution and input value setting when reading the details tab.
 @return          : none
 =========================================================================
*/
function loadParam_motionCommon(dtfrm) {
  /* initialize */
  dtfrm.initPosLeft();
  dtfrm.initPosRight();
  dtfrm.initAddMotion();

  /* Speed */
  loadParam_speed(dtfrm);

  /* Route */
  loadParam_route(dtfrm);

  /* Additional motion */
  loadParam_additionalMotion(dtfrm);
}

/*
 =========================================================================
 @function name     : loadParam_posCmp_initArg
 @argument[posNum]  : Positional values
 @argument[posKind] : Type of position information
 @argument[elm]     : Position component elements
 @description       : Function execution and input value setting when reading the details tab.
 @return            : none
 =========================================================================
*/
function loadParam_posCmp_initArg(posNum, posKind, elm) {
  var initArgs = {
    initCompleteCallback: posInitCompleteCallback,
    initCompleteArgs: { posNumber: posNum, elem: elm },
    fold: true,
    disableComment: false,
    posMode: 15,
    posKind: posKind,
    behindDefaultPosRegNum: 1,
    behindDefaultPosRegRegNum: 1,
    behindDefaultPosRegArgNum: 1,
    number: posNum,
    group: null,
  };

  return initArgs;
}

/*
 =========================================================================
 @function name   : detail_load_straight_laser
 @argument[dtfrm] : Frame on the detail screen.
 @description     : Function execution and input value setting when reading the details tab.
 @return          : none
 =========================================================================
*/
//Added to support position registers.To be deleted when the position register is officially supported.
function detail_load_straight_laser(dtfrm) {
  dtfrm.initPosLeft();
  dtfrm.initPosRight();
  dtfrm.initAddMotion();

  /* Speed */
  loadParam_speed(dtfrm);

  /* Route */
  loadParam_route(dtfrm);

  var visionChk =
    activeTarget.indexOf("vsnline") != -1 ||
    activeTarget.indexOf("vsnjoint") != -1;
  var optStr = g_program_data[activeTarget].addMotion.slice();
  var laser_command = new RegExp(
    "(" +
      ORDER_PLE_LS +
      "|" +
      ORDER_LS +
      "|" +
      ORDER_LE +
      "|" +
      ORDER_SLPU +
      "|" +
      ORDER_SLPD +
      ")"
  );
  var del_opt = 1;
  var edit_opt = new Array();
  var edit_cnt = 0;

  if (optStr.length > 0) {
    if (visionChk) {
      for (var i in optStr) {
        if (
          optStr[i].indexOf(
            langResource.ihmieditor_order_voffset_c +
              "," +
              langResource.ihmieditor_order_vr_c
          ) != -1 ||
          optStr[i] == langResource.ihmieditor_order_voffset_c
        ) {
          optStr.length == 1 ? (optStr[0] = "") : optStr.splice(i, 1);
        }
      }
    }

    if (optStr.length == 1) {
      dtfrm.document
        .getElementById("option_formlist")
        .refresh(null, optStr.length - 1, null, null);
    } else {
      for (cnt = 0; cnt < optStr.length; cnt++) {
        if (laser_command.test(optStr[cnt]) == true) {
          del_opt = del_opt + 1;
        } else {
          edit_opt[edit_cnt] = optStr[cnt];
          edit_cnt = edit_cnt + 1;
        }
      }
      dtfrm.document
        .getElementById("option_formlist")
        .refresh(null, optStr.length - del_opt, null, null);
    }

    var newList = dtfrm.document.getElementsByClassName("input-form-list-row");
    var cnt = 1;
    if (optStr.length > del_opt - 1) {
      for (cnt = 0; cnt < newList.length; cnt++) {
        var nodes = newList[cnt].getElementsByTagName("input");
        var newOptStr = edit_opt[cnt] == "" ? " " : edit_opt[cnt];
        if (newOptStr != undefined) {
          nodes[0].refresh(langConvEng(newOptStr), 255, false);
          nodes[0].setCallback(dtfrm.textboxCallback);
        }
      }
    }

    dtfrm.document
      .getElementById("addmotion_select_" + cnt)
      .setCallback(dtfrm.callbackSelectAddMotion);
  }

  /* Position information */
  var initArgs = loadParam_posCmp_initArg(
    g_program_data[activeTarget].position[0].number,
    g_program_data[activeTarget].position[0].kind,
    dtfrm.document.getElementById("robotPos")
  );
  if (
    !unredo_flg ||
    g_RO_flg ||
    !g_TPenbl_flg ||
    $("#viewchange")[0].classList.contains("vrtclview")
  ) {
    initArgs.fold = false;
  }
  dtfrm.document.getElementById("robotPos").refresh(initArgs);
  dtfrm.document.getElementById("robotPos").setCallback(dtfrm.callBackPosition);
  dtfrm.document
    .getElementById("robotPos")
    .setIdListCallback(getProgramPositionIdList);
}

/*
 =========================================================================
 @function name   : detail_load_kakujiku_laser
 @argument[dtfrm] : Frame on the detail screen.
 @description     : Function execution and input value setting when reading the details tab.
 @return          : none
 =========================================================================
*/
function detail_load_kakujiku_laser(dtfrm) {
  dtfrm.initPosLeft();
  dtfrm.initPosRight();
  dtfrm.initAddMotion();

  /* Speed */
  loadParam_speed(dtfrm);

  /* Route */
  loadParam_route(dtfrm);

  var visionChk =
    activeTarget.indexOf("vsnline") != -1 ||
    activeTarget.indexOf("vsnjoint") != -1;
  var optStr = g_program_data[activeTarget].addMotion.slice();
  var laser_command = new RegExp(
    "(" + ORDER_PLE_LS + "|" + ORDER_LS + "|" + ORDER_LE + ")"
  );
  var del_opt = 1;
  var edit_opt = new Array();
  var edit_cnt = 0;

  if (optStr.length > 0) {
    if (visionChk) {
      for (var i in optStr) {
        if (
          optStr[i].indexOf(
            langResource.ihmieditor_order_voffset_c +
              "," +
              langResource.ihmieditor_order_vr_c
          ) != -1 ||
          optStr[i] == langResource.ihmieditor_order_voffset_c
        ) {
          optStr.length == 1 ? (optStr[0] = "") : optStr.splice(i, 1);
        }
      }
    }

    if (optStr.length == 1) {
      dtfrm.document
        .getElementById("option_formlist")
        .refresh(null, optStr.length - 1, null, null);
    } else {
      for (cnt = 0; cnt < optStr.length; cnt++) {
        if (laser_command.test(optStr[cnt]) == true) {
          del_opt = del_opt + 1;
        } else {
          edit_opt[edit_cnt] = optStr[cnt];
          edit_cnt = edit_cnt + 1;
        }
      }
      dtfrm.document
        .getElementById("option_formlist")
        .refresh(null, optStr.length - del_opt, null, null);
    }

    var newList = dtfrm.document.getElementsByClassName("input-form-list-row");
    var cnt = 1;
    if (optStr.length > del_opt - 1) {
      for (cnt = 0; cnt < newList.length; cnt++) {
        var nodes = newList[cnt].getElementsByTagName("input");
        var newOptStr = edit_opt[cnt] == "" ? " " : edit_opt[cnt];
        if (newOptStr != undefined) {
          nodes[0].refresh(langConvEng(newOptStr), 255, false);
          nodes[0].setCallback(dtfrm.textboxCallback);
        }
      }
    }
  }

  /* Position information */
  var initArgs = loadParam_posCmp_initArg(
    g_program_data[activeTarget].position[0].number,
    g_program_data[activeTarget].position[0].kind,
    dtfrm.document.getElementById("robotPos")
  );
  if (
    !unredo_flg ||
    g_RO_flg ||
    !g_TPenbl_flg ||
    $("#viewchange")[0].classList.contains("vrtclview")
  ) {
    initArgs.fold = false;
  }
  dtfrm.document.getElementById("robotPos").refresh(initArgs);
  dtfrm.document.getElementById("robotPos").setCallback(dtfrm.callBackPosition);
  dtfrm.document
    .getElementById("robotPos")
    .setIdListCallback(getProgramPositionIdList);
}

/*
 =========================================================================
 @function name   : detail_load_kakujiku
 @argument[dtfrm] : Frame on the detail screen.
 @description     : Function execution and input value setting when reading the details tab.
 @return          : none
 =========================================================================
*/
//Added to support position registers.To be deleted when the position register is officially supported.
function detail_load_kakujiku(dtfrm) {
  /* Set the common items. */
  loadParam_motionCommon(dtfrm);

  /* Position information */
  var initArgs = loadParam_posCmp_initArg(
    g_program_data[activeTarget].position[0].number,
    g_program_data[activeTarget].position[0].kind,
    dtfrm.document.getElementById("robotPos")
  );
  if (
    !unredo_flg ||
    g_RO_flg ||
    !g_TPenbl_flg ||
    $("#viewchange")[0].classList.contains("vrtclview")
  ) {
    initArgs.fold = false;
  }
  dtfrm.document.getElementById("robotPos").refresh(initArgs);
  dtfrm.document.getElementById("robotPos").setCallback(dtfrm.callBackPosition);
  dtfrm.document
    .getElementById("robotPos")
    .setIdListCallback(getProgramPositionIdList);
}

/*
 =========================================================================
 @function name   : detail_load_circular
 @argument[dtfrm] : Frame on the detail screen.
 @description     : Function execution and input value setting when reading the details tab.
 @return          : none
 =========================================================================
*/
//Added to support position registers.To be deleted when the position register is officially supported.
function detail_load_circular(dtfrm) {
  /* Set the common items. */
  loadParam_motionCommon(dtfrm);

  /* Position information */
  var initArgs = loadParam_posCmp_initArg(
    g_program_data[activeTarget].position[0].number,
    g_program_data[activeTarget].position[0].kind,
    dtfrm.document.getElementById("robotPos1")
  );
  var initArgs2 = loadParam_posCmp_initArg(
    g_program_data[activeTarget].position[1].number,
    g_program_data[activeTarget].position[1].kind,
    dtfrm.document.getElementById("robotPos2")
  );
  if (
    !unredo_flg ||
    g_RO_flg ||
    !g_TPenbl_flg ||
    $("#viewchange")[0].classList.contains("vrtclview")
  ) {
    initArgs.fold = false;
    initArgs2.fold = false;
  }

  dtfrm.document.getElementById("robotPos1").refresh(initArgs);
  dtfrm.document
    .getElementById("robotPos1")
    .setCallback(dtfrm.callBackPosition);
  dtfrm.document
    .getElementById("robotPos1")
    .setIdListCallback(getProgramPositionIdList);
  dtfrm.document.getElementById("robotPos2").refresh(initArgs2);
  dtfrm.document
    .getElementById("robotPos2")
    .setCallback(dtfrm.callBackPosition);
  dtfrm.document
    .getElementById("robotPos2")
    .setIdListCallback(getProgramPositionIdList);
}

/*
 =========================================================================
 @function name   : detail_load_for
 @argument[dtfrm] : Frame on the detail screen.
 @description     : Function execution and input value setting when reading the details tab.
 @return          : none
 =========================================================================
*/
function detail_load_for(dtfrm) {
  var param = split_param_for(g_program_data[activeTarget].param);

  /* loop select */
  detail_load_for_judgeVal(dtfrm, "loop", param[0].replace(/^FOR\s/, ""));

  /* init value */
  detail_load_for_judgeVal(dtfrm, "init", param[2]);

  /* count type */
  dtfrm.document
    .getElementById("to_down")
    .refresh(
      dtfrm.selectToDownList,
      param[3].indexOf("DOWNTO") != -1 ? 1 : 0,
      null,
      false
    );

  /* end value */
  detail_load_for_judgeVal(dtfrm, "end", param[4]);
}

/*
 =========================================================================
 @function name      : detail_load_for_valueJudge
 @argument[dtfrm]    : Frame on the detail screen.
 @argument[judgeStr] : String for judgment.
 @argument[val]      : Check value.
 @description        : 
 @return             : none
 =========================================================================
*/
function detail_load_for_judgeVal(dtfrm, judgeStr, val) {
  var selChkStr1 = new RegExp("^" + ORDER_REGI + "\\[");
  var selChkStr2 = new RegExp("^" + ORDER_ARGUMENT + "\\[");
  var list =
    judgeStr == "loop"
      ? dtfrm.selectLoopList["disp"]
      : dtfrm.selectOptionList["disp"];
  var cmpList = dtfrm.componentList;

  /* type */
  val = outputComment_del(val).replace(/(^\(|\)$)/g, "");
  /* Determine the array number */
  if (val.match(selChkStr1)) {
    val = val.replace(selChkStr1, "").replace(/\]$/, "");
    var num = val.match(selChkStr1) ? 2 : val.match(selChkStr2) ? 3 : 1;
    if (judgeStr == "loop") num = num - 1; // Adjust for loop counter.
  } else if (val.match(selChkStr2)) {
    val = val.replace(selChkStr2, "").replace(/\]$/, "");
    var num = val.match(selChkStr1) ? 5 : val.match(selChkStr2) ? 6 : 4;
  } else {
    var num = 0;
  }
  dtfrm.document
    .getElementById(judgeStr + "_val")
    .refresh(list, list[num][1], false);

  /* value */
  var inputId = judgeStr + "_val" + (num + 1);
  var textArea = dtfrm.document.getElementsByClassName(
    judgeStr + "TextBoxArea"
  );
  val = val.replace(/[^0-9_-]/g, "");
  if (val == "") val = 0;
  for (var init = 0; init < textArea.length; init++) {
    if (textArea[init].firstElementChild.id == inputId) {
      dtfrm.document
        .getElementById(inputId)
        .refresh(val, cmpList[inputId].min, cmpList[inputId].max, false);
      top.IHMIComponents.cf.turnOnOffClass(textArea[init], "hide", false);
    } else {
      var id = textArea[init].firstElementChild.id;
      var setVal = cmpList[id].min < 0 ? 0 : cmpList[id].min;
      dtfrm.document
        .getElementById(id)
        .refresh(setVal, cmpList[id].min, cmpList[id].max, false);
      top.IHMIComponents.cf.turnOnOffClass(textArea[init], "hide", true);
    }
  }
}
/*
=========================================================================
@function name      : detail_load_frame_judgeVal
@argument[order]    : SET or SELECT order
@argument[dtfrm]    : Frame on the detail screen.
@argument[judgeStr] : String for judgment.
@argument[param]      : Check value.
@description        : 
@return             : none
=========================================================================
*/
function detail_load_frame_judgeVal(order, dtfrm, judgeStr, param) {
  var val = "";
  var list = dtfrm.selectList["disp"];
  var progName = param;
  var cmpList = dtfrm.componentList;
  var selChkStr1 = new RegExp("^" + ORDER_REGI + "\\[");
  var selChkStr2 = new RegExp("^" + ORDER_ARGUMENT + "\\[");
  var selChkStr3 = new RegExp("^" + ORDER_UFRAME + "\\[");
  var selChkStr4 = new RegExp("^" + ORDER_UTOOL + "\\[");
  var selChkStr5 = new RegExp("^" + ORDER_POSREGI + "\\[");
  var splitProgName = "";
  switch (order) {
    case "SET":
      if (progName.indexOf("GP") != -1) {
        splitProgName = progName.split(":");
        progName = splitProgName[1];
      }
      /* type */
      progName = outputComment_del(progName).replace(/(^\(|\)$)/g, "");
      /* Determine the array number */
      if (progName.match(selChkStr3)) {
        val = progName.replace(selChkStr3, "").replace(/\]$/, "");
        var num = val.match(selChkStr1) ? 1 : val.match(selChkStr2) ? 2 : 0;
        break;
      } else if (progName.match(selChkStr4)) {
        val = progName.replace(selChkStr4, "").replace(/\]$/, "");
        var num = val.match(selChkStr1) ? 1 : val.match(selChkStr2) ? 2 : 0;
        break;
      } else if (progName.match(selChkStr5) || splitProgName != "") {
        val = progName.replace(selChkStr5, "").replace(/\]$/, "");
        var num = val.match(selChkStr1) ? 1 : val.match(selChkStr2) ? 2 : 0;
        break;
      } else {
        var num = 0;
      }
      break;
    case "SEL":
      splitProgName = progName.split("=");
      /* type */
      splitProgName[1] = outputComment_del(splitProgName[1]).replace(
        /(^\(|\)$)/g,
        ""
      );
      /* Determine the array number */
      if (splitProgName[1].match(selChkStr1)) {
        val = splitProgName[1].replace(selChkStr1, "").replace(/\]$/, "");
        var num = val.match(selChkStr1) ? 2 : val.match(selChkStr2) ? 3 : 1;
      } else if (splitProgName[1].match(selChkStr2)) {
        val = splitProgName[1].replace(selChkStr2, "").replace(/\]$/, "");
        var num = val.match(selChkStr1) ? 5 : val.match(selChkStr2) ? 6 : 4;
      } else {
        val = splitProgName[1];
        var num = 0;
      }
      break;
    default:
      break;
  }
  dtfrm.document
    .getElementById(judgeStr + "_val")
    .refresh(list, list[num][1], false);
  /* multigroup */
  var refFlag = 0;
  var groupVal = "";
  var groupArea = dtfrm.document.getElementsByClassName("multigroupArea");
  if (splitProgName != "") {
    for (var loop = 0; loop < 2; loop++) {
      if (splitProgName[loop].indexOf("GP") != -1) {
        if (splitProgName[loop].match(/[1-8]/g) != null) {
          groupVal = splitProgName[loop].match(/[1-8]/g).join(",");
        }
        dtfrm.document
          .getElementById("group_val")
          .refresh(groupVal, "20", true);
        top.IHMIComponents.cf.turnOnOffClass(groupArea[0], "hide", false);
        break;
      } else {
        if (refFlag == 0) {
          dtfrm.document.getElementById("group_val").refresh(null, "20", true);
          top.IHMIComponents.cf.turnOnOffClass(groupArea[0], "hide", true);
          refFlag = 1;
        }
      }
    }
  } else {
    if (judgeStr == "posReg") {
      dtfrm.document.getElementById("group_val").refresh(null, "20", true);
      top.IHMIComponents.cf.turnOnOffClass(groupArea[0], "hide", true);
    }
  }
  /* value */
  var inputId = judgeStr + "_val" + (num + 1);
  var textArea = dtfrm.document.getElementsByClassName(
    judgeStr + "TextboxArea"
  );
  val = val.replace(/[^0-9_-]/g, "");
  if (val == "") val = judgeStr == "posReg" ? 0 : -1;
  for (var init = 0; init < textArea.length; init++) {
    if (textArea[init].firstElementChild.id == inputId) {
      dtfrm.document
        .getElementById(inputId)
        .refresh(val, cmpList[inputId].min, cmpList[inputId].max, false);
      top.IHMIComponents.cf.turnOnOffClass(textArea[init], "hide", false);
    } else {
      var id = textArea[init].firstElementChild.id;
      var setVal = cmpList[id].min < 0 ? 0 : cmpList[id].min;
      dtfrm.document
        .getElementById(id)
        .refresh(setVal, cmpList[id].min, cmpList[id].max, false);
      top.IHMIComponents.cf.turnOnOffClass(textArea[init], "hide", true);
    }
  }
}

/*
 =========================================================================
 @function name   : detail_load_output
 @argument[dtfrm] : Frame on the detail screen.
 @description     : Function execution and input value setting when reading the details tab.
 @return          : none
 =========================================================================
*/
function detail_load_output(dtfrm) {
  var out_sel = ["do", "ro", "ao", "go", "f", "direct"];

  for (var o_cnt = 0; o_cnt < out_sel.length; o_cnt++) {
    dtfrm.document
      .getElementById(out_sel[o_cnt] + "_regi")
      .refresh(
        "1",
        dtfrm.outputComponent[o_cnt][out_sel[o_cnt] + "_regi"].min,
        dtfrm.outputComponent[o_cnt][out_sel[o_cnt] + "_regi"].max,
        false
      );
    if (out_sel[o_cnt] == "ao" || out_sel[o_cnt] == "go") {
      dtfrm.document
        .getElementById(out_sel[o_cnt] + "_ins")
        .refresh(
          "1",
          dtfrm.outputComponent[o_cnt][out_sel[o_cnt] + "_regi"].min,
          dtfrm.outputComponent[o_cnt][out_sel[o_cnt] + "_regi"].max,
          false
        );
    } else if (out_sel[o_cnt] == "direct") {
      dtfrm.document
        .getElementById("direct_regi")
        .refresh(
          "1",
          dtfrm.outputComponent[o_cnt]["direct_regi"].length,
          false
        );
      dtfrm.document
        .getElementById("direct_ins")
        .refresh(
          "OFF",
          dtfrm.outputComponent[o_cnt]["direct_ins"].length,
          false
        );
    } else {
      dtfrm.document
        .getElementById(out_sel[o_cnt] + "_ins")
        .refresh(
          dtfrm.outputComponent[o_cnt][out_sel[o_cnt] + "_ins"].data,
          1,
          null,
          false
        );
    }
  }

  /* Split the parameter into a left side and a right side. */
  var param = param_combineCheck(
    "=",
    split_param(g_program_data[activeTarget].param)
  );

  /* Get the selected position of the radio button. */
  var chkStr = new RegExp("^(DO|RO|AO|GO|F)\\[");
  var matchRes = param[0].match(chkStr);
  var o_type = matchRes[1];
  for (var listCnt in dtfrm.selectOutPutList) {
    if (dtfrm.selectOutPutList[listCnt][0] === o_type) {
      break;
    }
  }
  var judgeSel = detail_output_directCheck(listCnt, param);
  dtfrm.document.getElementById("output_list").refresh(null, judgeSel, false);
  if (judgeSel === 6) {
    o_type = out_sel[5];
    dtfrm.document
      .getElementById(o_type + "_regi")
      .refresh(
        langConvEng(param[0]),
        dtfrm.outputComponent[judgeSel - 1][o_type + "_regi"].length,
        false
      );
  } else {
    o_type = o_type.toLowerCase();
    dtfrm.document
      .getElementById(o_type + "_regi")
      .refresh(
        param[0] === "..." ? "0" : param[0],
        dtfrm.outputComponent[judgeSel - 1][o_type + "_regi"].min,
        dtfrm.outputComponent[judgeSel - 1][o_type + "_regi"].max,
        false
      );
  }

  if (param[1] == "" || param[1] == undefined) {
  } else {
    if (o_type == "ao" || o_type == "go") {
      dtfrm.document
        .getElementById(o_type + "_ins")
        .refresh(
          param[1].replace(/(^\(|\)$)/g, ""),
          dtfrm.outputComponent[judgeSel - 1][o_type + "_regi"].min,
          dtfrm.outputComponent[judgeSel - 1][o_type + "_regi"].max,
          false
        );
    } else if (o_type == "direct") {
      dtfrm.document
        .getElementById(o_type + "_ins")
        .refresh(
          langConvEng(param[1].trim()),
          dtfrm.outputComponent[judgeSel - 1]["direct_ins"].length,
          false
        );
    } else {
      var chkStr = new RegExp("(" + ORDER_ON + "|ON)");
      if (param[1].match(chkStr)) {
        dtfrm.document
          .getElementById(o_type + "_ins")
          .refresh(
            dtfrm.outputComponent[judgeSel - 1][o_type + "_ins"].data,
            "0",
            null,
            false
          );
      } else {
        dtfrm.document
          .getElementById(o_type + "_ins")
          .refresh(
            dtfrm.outputComponent[judgeSel - 1][o_type + "_ins"].data,
            "1",
            null,
            false
          );
      }
    }
  }

  radio_out_initDisp(judgeSel);
}

/*
 =========================================================================
 @function name  : detail_output_directCheck
 @argument       : 
 @description    : 
 @return         : none
 =========================================================================
*/
function detail_output_directCheck(listCnt, insParam) {
  var retVal, chkVal;
  var chkKindStr = new RegExp("(^(DO|RO|AO|GO|F)\\[|\\]$)", "g");
  var dtfrm = document.getElementById(
    get_detail_frm_id(activeTarget)
  ).contentWindow;

  insParam[0] = insParam[0].replace(chkKindStr, "");

  /* The index is specified directly. */
  if (insParam[0] === "..." || insParam[0].replace(/[0-9]/g, "") === "") {
    /* DO/RO */
    if (
      dtfrm.selectOutPutList[listCnt][1] == "0" ||
      dtfrm.selectOutPutList[listCnt][1] == "1"
    ) {
      if (
        insParam[1] === ORDER_ON ||
        insParam[1] === ORDER_OFF ||
        insParam[1] === "ON" ||
        insParam[1] === "OFF"
      ) {
        retVal = parseInt(dtfrm.selectOutPutList[listCnt][1]) + 1;
      } else {
        retVal = 6;
      }
    } else if (dtfrm.selectOutPutList[listCnt][1] == "4") {
      /* F */
      /* F */
      if (
        insParam[1] === "(" + ORDER_ON + ")" ||
        insParam[1] === "(" + ORDER_OFF + ")" ||
        insParam[1] === "(ON)" ||
        insParam[1] === "(OFF)"
      ) {
        retVal = parseInt(dtfrm.selectOutPutList[listCnt][1]) + 1;
      } else {
        retVal = 6;
      }
    } else {
      /* other(AO/GO) */
      var chkStr = new RegExp(
        "(\\.|e|" +
          ORDER_ARGUMENT +
          "|" +
          ORDER_REGI +
          "|" +
          ORDER_POSREGI +
          ")"
      );
      if (insParam[1].match(chkStr)) {
        retVal = 6;
      } else {
        var digits = insParam[1].replace(/(^\(\-|\)$)/g, "");
        var numChk = insParam[1].replace(/[0-9]/g, "");
        if (
          digits.length <= 10 &&
          (numChk === "" || insParam[1].match(/^\(\-|\-/))
        ) {
          retVal = parseInt(dtfrm.selectOutPutList[listCnt][1]) + 1;
        } else {
          retVal = 6;
        }
      }
    }
  } else {
    retVal = 6;
  }

  return retVal;
}

/*
 =========================================================================
 @function name   : getKarelEnbl
 @argument[event] : onload event.
 @description     : 
 @return          : none
 =========================================================================
*/
function getKarelEnbl(event) {
  var sysValArr = ["$KAREL_ENB"];
  getSysValXHR(sysValArr, getKarelEnbl_CB, event);
}

/*
 =========================================================================
 @function name     : getKarelEnbl_CB
 @argument[status]  : 
 @argument[getText] : 
 @argument[cbArgs]  : 
 @description       : 
 @return            : none
 =========================================================================
*/
function getKarelEnbl_CB(status, getText, cbArgs) {
  var xmlObj = getSysValXmlData(getText, "VAR");
  if (xmlObj == null) {
    return;
  } // Add error messages if needed.
  var convData = extractRcvXHRData(xmlObj, "VAR");

  g_karel_enbl = convData["$KAREL_ENB"] == "1" ? true : false;

  detail_load_call(cbArgs);
}

/*
 =========================================================================
 @function name   : detail_load_call
 @argument[event] : onload event
 @description     : Function execution and input value setting when reading the details tab.
 @return          : none
 =========================================================================
*/
function detail_load_call(event) {
  var dtfrm = document.getElementById(
    get_detail_frm_id(activeTarget)
  ).contentWindow;
  var call_list = [];
  var karel_call_list = [];

  var params = split_param_call(g_program_data[activeTarget].param);

  for (var cnt = 0; cnt < programFileList.length; cnt++) {
    call_list.push(programFileList[cnt].name);
  }
  for (var cnt = 0; cnt < karelProgramFileList.length; cnt++) {
    karel_call_list.push(karelProgramFileList[cnt].name);
  }

  if (params[0] == "") {
    var param = "";
  } else {
    var param = params[0].trim();
  }

  var argparam = "";
  if (params[1] === undefined) {
    params[1] = "";
  } else {
    params[1] = langConvEng(params[1].replace(/\)$/, ""));
    /*commaMatch = Matches comma other than in single quotes and [] */
    var commaMatch = /,(?=(?:[^']*'[^']*')*[^']*$)(?![^\[]*\])/g;
    argparam = params[1].split(commaMatch);
  }
  if (
    g_karel_enbl &&
    karel_call_list.findIndex(function (element) {
      return element === param;
    }) != -1
  ) {
    var radio_sel = 2;
    dtfrm.document
      .getElementById("call_name")
      .refresh(karel_call_list, param, null, false);
  } else {
    var radio_sel = 1;
    dtfrm.document
      .getElementById("call_name")
      .refresh(call_list, param, null, false);
  }
  dtfrm.tp_select = 0;
  dtfrm.karel_select = 0;
  dtfrm.document.getElementById("call_name").setCallback(dtfrm.callbackSelect);
  dtfrm.document.getElementById("argments_formlist").removeAllRows();
  dtfrm.document.getElementById("program_sel1").style.display = "";
  dtfrm.document.getElementById("program_sel2").style.display = "";
  if (g_karel_enbl) {
    dtfrm.document
      .getElementById("program_sel1")
      .refresh(null, radio_sel, false);
    dtfrm.document
      .getElementById("program_sel1")
      .setCallback(dtfrm.callbackRadio);
    dtfrm.document.getElementById("program_sel2").style.display = "none";
    dtfrm.document.getElementById("program_sel1").style.display = "";
  } else {
    dtfrm.document.getElementById("program_sel2").refresh(null, 1, false);
    dtfrm.document.getElementById("program_sel1").style.display = "none";
    dtfrm.document.getElementById("program_sel2").style.display = "";
  }

  if (argparam.length > 0) {
    dtfrm.document
      .getElementById("argments_formlist")
      .refresh(null, argparam.length - 1, null, null);

    var newList = dtfrm.document.getElementsByClassName("input-form-list-row");
    for (var argcnt = 0; argcnt < newList.length; argcnt++) {
      var nodes = newList[argcnt].getElementsByTagName("input");
      if (!isNaN(Number(argparam[argcnt].replace(/(^\(|\)$)/g, "")))) {
        nodes[0].refresh(
          argparam[argcnt].replace(/(^\(|\)$)/g, ""),
          255,
          false
        );
      } else {
        nodes[0].refresh(langConvEng(argparam[argcnt]), 255, false);
      }
      nodes[0].setCallback(dtfrm.textboxCallback);
    }
  } else {
    dtfrm.document.getElementById("argument_1").refresh("", 255, false);
  }
  /* Update the css in the stm as it is hidden when it is first loaded. */
  dtfrm.document.body.style.visibility = "visible";

  if (typeof event != "undefined") {
    unredo_flg = true;
    border_slideCheck();
    dispOffWaiting();

    /* Scrollbar setting */
    var content = dtlfrm_contentchk(activeTarget);
    if (content != null) {
      content.addEventListener("click", focusout_onclick, false);

      /* Detailed display of the screen in the read-only file */
      if (
        g_RO_flg ||
        !g_TPenbl_flg ||
        $("#viewchange")[0].classList.contains("vrtclview")
      ) {
        /* Setup a layer to block editing. */
        $(".restrictContainer").css({
          display: "block",
        });
        $(".restrictContainer").scrollTop(0);
        $(".restrictContainer").scrollLeft(0);
        $("#detailRestrict").css({
          height: content.scrollHeight,
          width: content.scrollWidth,
        });
      }

      /* Set horizontal scrolling. */
      $(content).css({
        "overflow-x": "auto",
        "overflow-y": "scroll",
        "white-space": "nowrap",
        "scrollbar-width": "none",
        "-ms-overflow-style": "none",
      });
      var insStr =
        '<style type="text/css">.content::-webkit-scrollbar{display:none;}</style>';
      if (content.ownerDocument.head.innerHTML.indexOf(insStr) == -1) {
        content.ownerDocument.head.innerHTML += insStr;
      }
      detail_scrlCtrl(content);

      var config = {
        attributes: true,
        attributeFilter: ["style"],
        childList: true,
        subtree: true,
      };
      dtlMutObserver.observe(content, config);
    }
    if (DEBUG_TIME_MEASURE) {
      debug_time_output("dtl_load:");
    }
  }
}

/*
 =========================================================================
 @function name   : detail_load_wait
 @argument[dtfrm] : Frame on the detail screen.
 @description     : Function execution and input value setting when reading the details tab.
 @return          : none
 =========================================================================
*/
function detail_load_wait(dtfrm) {
  /* initialize */
  dtfrm.init_inputVal();
  dtfrm.init_selectIndex("wait");
  dtfrm.switchValueSelectDisplay("0");
  dtfrm.document
    .getElementById("wait_sec")
    .refresh("0.0", "0.0", "327.67", false); //@@@ Unknown default and max
  dtfrm.document.getElementById("wait_sec").setCallback(dtfrm.textboxCallback);
  dtfrm.document.getElementById("conditionValue").refresh("1sec", 255, false);
  dtfrm.document
    .getElementById("conditionValue")
    .setCallback(dtfrm.textboxCallback);

  var array = [];
  for (var listCnt in g_labelNumList) {
    array[listCnt] = g_labelNumList[listCnt].toString(10);
  }
  dtfrm.document.getElementById("jump_select").refresh(array, "0", null, false);
  dtfrm.document
    .getElementById("jump_select")
    .setCallback(dtfrm.callbackSelect);
  dtfrm.document
    .getElementById("time_out")
    .refresh(g_timeOutVal, "0.0", "327.67", false);
  dtfrm.document.getElementById("time_out").setCallback(dtfrm.timeOutCallback);
  dtfrm.document.getElementById("time_out_option").refresh(null, "2", false);
  dtfrm.document.getElementById("time_out_detail").classList.remove("show");
  dtfrm.document.getElementById("time_out_detail").classList.add("hidden");
  dtfrm.document.getElementsByClassName("radiobtn3")[0].style.marginTop =
    "134px";
  dtfrm.document
    .getElementById("time_out_option")
    .setCallback(dtfrm.listSelectCallback);

  var param = param_combineCheck(
    "",
    split_param_wait(g_program_data[activeTarget].param)
  );
  var selChk = radio_wait_selectCheck(param);
  if (
    g_program_data[activeTarget] != undefined &&
    g_program_data[activeTarget].param !== ""
  ) {
    if (selChk === WAIT_COND_TIME) {
      dtfrm.document
        .getElementById("wait_sec")
        .refresh(
          g_program_data[activeTarget].param.replace(/\(sec\)|sec/g, ""),
          "0.0",
          "327.67",
          false
        ); //@@@ Unknown default and max
    } else if (selChk === WAIT_COND_SEL) {
      var setResult = set_detail_condParam("wait", param);
      if (!setResult) {
        selChk = WAIT_COND_DIRECT;
        dtfrm.document
          .getElementById("conditionValue")
          .refresh(langConvEng(g_program_data[activeTarget].param), 255, false);
      }
    } else {
      dtfrm.document
        .getElementById("conditionValue")
        .refresh(langConvEng(g_program_data[activeTarget].param), 255, false);
    }
  }
  dtfrm.document.getElementById("time_sel").refresh(null, selChk, false);
  radio_wait_selectDisp(null, null, selChk);
}

/*
 =========================================================================
 @function name   : detail_load_if
 @argument[dtfrm] : Frame on the detail screen.
 @description     : Function execution and input value setting when reading the details tab.
 @return          : none
 =========================================================================
*/
function detail_load_if(dtfrm) {
  /* initialize */
  dtfrm.init_inputVal();
  dtfrm.init_selectIndex("if");
  dtfrm.switchValueSelectDisplay("0");
  dtfrm.document.getElementById("conditionValue").refresh("", 255, false);
  dtfrm.document
    .getElementById("conditionValue")
    .setCallback(dtfrm.textboxCallback);

  var param = param_combineCheck(
    "",
    split_param_wait(g_program_data[activeTarget].param)
  );
  var selChk = radio_if_selectCheck(param);
  if (g_program_data[activeTarget] != undefined) {
    if (selChk === IF_COND_SEL) {
      var setResult = set_detail_condParam("if", param);
      if (!setResult) {
        selChk = IF_COND_DIRECT;
        dtfrm.document
          .getElementById("conditionValue")
          .refresh(langConvEng(g_program_data[activeTarget].param), 255, false);
      }
    } else if (selChk === IF_COND_DIRECT) {
      dtfrm.document
        .getElementById("conditionValue")
        .refresh(langConvEng(g_program_data[activeTarget].param), 255, false);
    } else {
    }
  }
  dtfrm.document.getElementById("if_list").refresh(null, selChk, false);
  radio_if_initDisp(selChk);
}

/*
 =========================================================================
 @function name   : detail_load_regi
 @argument[dtfrm] : Frame on the detail screen.
 @description     : Function execution and input value setting when reading the details tab.
 @return          : none
 =========================================================================
*/
function detail_load_regi(dtfrm) {
  /* initialize */
  dtfrm.init_inputVal();
  dtfrm.init_selectIndex();
  dtfrm.document.getElementById("regi").refresh("0", 255, false);
  dtfrm.document.getElementById("regi_val").refresh("0", 255, false);

  var param = param_combineCheck(
    "=",
    split_param(g_program_data[activeTarget].param)
  );
  var selChk = radio_regi_selectCheck(param);
  if (selChk === REGI_COND_SEL) {
    set_regi_condParam(param);
  } else if (selChk === REGI_COND_DIRECT) {
    var regiStr = new RegExp("^(" + ORDER_REGI + "|R)\\[|\\]$", "g");
    dtfrm.document
      .getElementById("regi")
      .refresh(langConvEng(param[0].replace(regiStr, "")), 255, false);
    dtfrm.document
      .getElementById("regi_val")
      .refresh(langConvEng(param[1] != " " ? param[1] : "0"), 255, false);
  } else {
  }
  dtfrm.document.getElementById("regi_list").refresh(null, selChk, false);
  dtfrm.document.getElementById("regi").setCallback(dtfrm.textboxCallback);
  dtfrm.document.getElementById("regi_val").setCallback(dtfrm.textboxCallback);
  radio_regi_initDisp(selChk);
}

/*
 =========================================================================
 @function name    : param_combineCheck
 @argument[cmbStr] : 
 @argument[param]  : 
 @description      : 
 @return           : 
 =========================================================================
*/
function param_combineCheck(cmbStr, param) {
  /* left side. */
  if (param[0].match(/\]$/) == null) {
    /* Combine them because they are split in the comment. */
    while (1) {
      if (param[1] == undefined) break;
      param[0] += cmbStr + param[1];
      param.splice(1, 1);
      if (param[0].match(/\]$/)) {
        break;
      }
    }
  }

  /* right side. */
  if (cmbStr != "") {
    if (param.length > 2) {
      /* Combine them because they are split in the comment. */
      while (1) {
        if (param[2] == undefined) break;
        param[1] += cmbStr + param[2];
        param.splice(2, 1);
      }
    }
  } else {
    if (param.length > 3) {
      /* Combine them because they are split in the comment. */
      while (1) {
        if (param[3] == undefined) break;
        param[2] += cmbStr + param[3];
        param.splice(3, 1);
      }
    }
  }

  return param;
}

/*
 =========================================================================
 @function name  : setInstParam
 @argument       : str
 @description    : Confirm button processing
 @return         : none
 =========================================================================
*/
function setInstParam(str) {
  g_adin_state.setInstTempFlg = false;
  if (g_adintarget != "") {
    var setActive = g_adintarget;
  } else {
    var setActive = activeTarget;
  }
  if (setActive == "") return;
  var record_data = {
    id: "",
    lineNum: g_program_data[setActive].array_num + 1,
    contents: g_program_data[setActive],
    param1: {},
    param2: {},
    elem: "",
  };
  if (g_adin_state.setBracketArgFlg && g_adintarget == "") {
    g_adin_state.record[0] = {};
    $.extend(true, g_adin_state.record[0], record_data);
    $.extend(true, g_adin_state.record[0].param1, g_program_data[setActive]);
  } else {
    record_data.type = OPERATION_EDIT;
    $.extend(true, record_data.param1, g_program_data[setActive]);
  }

  need_position_save_flg = false;
  var instObj = g_inst_obj[g_xml_data[g_program_data[setActive].iconNo][2]];

  if (g_program_data[setActive].option != undefined) {
    var prms = str.split(",");
    if (prms[0].match(/[(]/)) {
      var start = prms[0].indexOf("(");
      var end = prms[0].indexOf(")");
      prms[0] = prms[0].substring(start + 1, end);
    }
    if (prms[0].match(/["]*[']*/g)) {
      prms[0] = prms[0].replace(/["]*[']*/g, "");
    }
    if (g_program_data[setActive].option != prms[0]) {
      var errMess = "[I127]";
      errMess = langResource.ihmieditor_pop_errorcode_c + errMess + "<br>";
      errPopUp(
        errMess +
          langResource.ihmieditor_pop_loaderr_c +
          "<br>" +
          langResource.ihmieditor_pop_moveprglist_c
      );
    }
  }
  var setParam = "";
  var setStr = str;
  if (setStr.trim() != "") {
    setStr = setLangConvJpEng("(" + setStr + ")");
  }
  setParam = instObj.detail.appName + setStr;
  if (setParam !== null && setParam !== "") {
    if (instObj.type == "posTeach" || instObj.type == "posBracket") {
      posNumChk(setActive, setStr);
    }
    /* Store in g_program_data */
    data_before_change = JSON.parse(JSON.stringify(g_program_data[setActive]));
    if (g_adintarget != "") {
      fixDropAdinDataSave_g_program(setParam);
      write_mode = 0;
      if (addProg.length != 0 && dropProgNum != "") {
        if (!samplePrg_status.typeBracket) {
          addSampleProgTp(setActive, true);
          dropProgNum = "";
          addProg = [];
        }
      } else {
        del_unused_posno();
        dropSaveFlg = true;
        save_droptporder(
          setActive,
          write_mode,
          save_tporder_callback,
          setActive
        );
      }
    } else {
      fixDataSave_g_program(setParam);
      if (g_adin_state.setBracketArgFlg) {
        $.extend(
          true,
          g_adin_state.record[0].param2,
          g_program_data[setActive]
        );
      } else {
        $.extend(true, record_data.param2, g_program_data[setActive]);
        timeline_record.array_add(record_data);
        check_undoredo_active();
        stretchdata_record.array_add(g_stretchOrder_data);
        position_record.array_add(position);
        positionregi_record.array_add(g_position_regi);
      }

      write_mode = 0;
      del_unused_posno();
      dropSaveFlg = false;
      save_tporder(setActive, write_mode, save_tporder_callback, setActive);
    }
  }
  if (g_adintarget != "") {
    delete_detailhtml_addinst(g_adinDropList[0][2], g_adinDropList[0][0]);
    g_adinDropList.splice(0, 1);
  }

  if (typeof g_adinDropList[0] != "undefined") {
    create_detailhtml_addinst(g_adinDropList[0][2], g_adinDropList[0][0]);
    $("#adin_" + g_adinDropList[0][0]).on("load", evalFunctionCall);
    g_adintarget = g_adinDropList[0][0];
  } else {
    g_adintarget = "";
  }
}
/*
 =========================================================================
 @function name  : setParamTemp
 @argument       : str
 @description    :
 @return         : none
 =========================================================================
*/
function setParamTemp(str) {
  g_adin_state.setInstTempFlg = true;
  if (g_adintarget != "") {
    var setActive = g_adintarget;
  } else {
    var setActive = activeTarget;
  }
  var record_data = {
    id: "",
    lineNum: g_program_data[setActive].array_num + 1,
    contents: g_program_data[setActive],
    param1: {},
    param2: {},
    elem: "",
    type: OPERATION_EDIT,
  };
  $.extend(true, record_data.param1, g_program_data[setActive]);
  need_position_save_flg = false;
  var instObj = g_inst_obj[g_xml_data[g_program_data[setActive].iconNo][2]];

  if (g_program_data[setActive].option != undefined) {
    var prms = str.split(",");
    if (prms[0].match(/[(]/)) {
      var start = prms[0].indexOf("(");
      var end = prms[0].indexOf(")");
      prms[0] = prms[0].substring(start + 1, end);
    }
    if (prms[0].match(/["]*[']*/g)) {
      prms[0] = prms[0].replace(/["]*[']*/g, "");
    }
    if (g_program_data[setActive].option != prms[0]) {
      var errMess = "[I127]";
      errMess = langResource.ihmieditor_pop_errorcode_c + errMess + "<br>";
      errPopUp(
        errMess +
          langResource.ihmieditor_pop_loaderr_c +
          "<br>" +
          langResource.ihmieditor_pop_moveprglist_c
      );
    }
  }
  var setParam = "";
  var setStr = str;
  if (setStr.trim() != "") {
    setStr = setLangConvJpEng("(" + setStr + ")");
  }
  setParam = instObj.detail.appName + setStr;
  if (setParam !== null && setParam !== "") {
    if (instObj.type == "posTeach" || instObj.type == "posBracket") {
      posNumChk(setActive, setStr);
    }
    /* Store in g_program_data */
    data_before_change = JSON.parse(JSON.stringify(g_program_data[setActive]));
    if (g_adintarget != "" && dropSaveFlg) {
      fixDropAdinDataSave_g_program(setParam);
      write_mode = 0;
      if (addProg.length != 0 && dropProgNum != "") {
        if (!samplePrg_status.typeBracket) {
          addSampleProgTp(setActive, true);
          dropProgNum = "";
          addProg = [];
        }
      } else {
        del_unused_posno();
        save_droptporder(
          setActive,
          write_mode,
          save_tporder_callback,
          setActive
        );
      }
      dropSaveFlg = false;
    } else {
      fixDropAdinDataSave_g_program(setParam);
      if (g_program_data[setActive].position.length > 0) {
        updatePosTeach(setActive);
      }
      // $.extend(true, record_data.param2, g_program_data[setActive]);
      // timeline_record.array_add(record_data);
      // check_undoredo_active();
      // stretchdata_record.array_add(g_stretchOrder_data);
      position_record.array_overwrite(position);
      positionregi_record.array_overwrite(g_position_regi);
      // write_mode = 0;
      // del_unused_posno();
      save_tporder(setActive, write_mode, save_tporder_callback, setActive);
    }
  }
}

/*
 =========================================================================
 @function name     : setDropEnd
 @argument          : end dropFunction
 @description       : 
 @return            : 
 =========================================================================
*/
function setDropEnd() {
  if (
    g_adin_state.adinstAttachedFlg ||
    save_id_array.length > 0 ||
    addProg.length > 0
  ) {
    watchDropEndEvent();
    return;
  }
  g_adin_state.setInstTempFlg = false;
  if (g_adin_state.adinstAttachedFlg) {
    addprgRecord();
  }
  if (g_adintarget != "") {
    delete_detailhtml_addinst(g_adinDropList[0][2], g_adinDropList[0][0]);
    g_adinDropList.splice(0, 1);
  }
  if (typeof g_adinDropList[0] != "undefined") {
    create_detailhtml_addinst(g_adinDropList[0][2], g_adinDropList[0][0]);
    $("#adin_" + g_adinDropList[0][0]).on("load", evalFunctionCall);
    g_adintarget = g_adinDropList[0][0];
  } else {
    g_adintarget = "";
  }
  dispOffWaiting();
}
/*
 =========================================================================
 @function name   : getPosInfoList
 @argument[]      :
 @description     :
 @return          : posinfo list
 =========================================================================
*/
function getPosInfoList(id) {
  var posInfo = {
    flg: [],
    endFlg: [],
  };
  if (typeof g_program_data[id].iconNo === "number") return posInfo;
  var tpName = id.startsWith("bktend")
    ? get_stretchOrder_pairId(id, REQ_ID_KIND_LEAD, null).split(/[0-9]*$/)[0]
    : g_xml_data[g_program_data[id].iconNo][2];
  var xmlData = g_inst_obj[tpName];
  if (xmlData.detail.posinfo != "")
    posInfo.flg = xmlData.detail.posinfo.split(",");
  if (xmlData.end != undefined) {
    if (xmlData.end.posinfo != "")
      posInfo.endFlg = xmlData.end.posinfo.split(",");
  }
  return posInfo;
}
/*
 =========================================================================
 @function name     : chkPosInfo
 @argument          : elm setStr id posInfo
 @description       : check posInfoTag
 @return            : 
 =========================================================================
*/
function chkPosInfo(elm, param, id, posInfo) {
  /*type normal posInfoTag check*/
  var leadIdChk = id.startsWith("bktlead");
  var endIdChk = id.startsWith("bktend");
  var posInfoCnt = 0;
  if (!leadIdChk && !endIdChk) {
    if (!posInfo.flg.length) return;
    setPosInfo(id, elm, param, posInfo.flg, posInfoCnt);
    return;
  }
  var startId = leadIdChk
    ? id
    : get_stretchOrder_pairId(id, REQ_ID_KIND_LEAD, null);
  var startElm = leadIdChk ? elm : document.getElementById(startId);
  var startPrm = leadIdChk ? param : g_program_data[startId].param;
  /*When generating the end side icon at startup, the start side icon does not exist*/
  var setElm = elm == undefined ? startElm : elm;
  if (setElm == null) {
    setPosInfo(id, null, startPrm, posInfo.flg, posInfoCnt);
  }
  /*If there is an end icon and param is saved on the end side, the start pin is not set. */
  if (!(elm != undefined && endIdChk)) {
    if (
      posInfo.flg.length > 0 ||
      (posInfo.endFlg.length > 0 && elm == undefined)
    ) {
      posInfoCnt = setPosInfo(
        startId,
        startElm,
        startPrm,
        posInfo.flg,
        posInfoCnt
      );
    }
  }
  if (posInfo.endFlg.length > 0) {
    var endId = leadIdChk
      ? get_stretchOrder_pairId(id, REQ_ID_KIND_END, null)
      : id;
    /*g_program does not exist at the timing of setting the pin on the start side when copying */
    if (g_program_data[endId] == undefined) return;
    var endElm = leadIdChk ? document.getElementById(endId) : elm;
    var endPrm = leadIdChk ? g_program_data[endId].param : param;
    if (setElm == null) {
      /*Inside the closed bracket, no position number pin setting is done, only the parameter is updated using the ID.*/
      var setId = endElm == null ? endId : startId;
      setPosInfo(setId, null, endPrm, posInfo.flg, posInfoCnt);
      return;
    }
    if (setElm.classList.value.indexOf("stretchOrder_close") != -1) {
      if (posInfoCnt >= 4) return;
      setPosInfo(endId, setElm, endPrm, posInfo.endFlg, posInfoCnt);
    } else {
      posInfoCnt = 0;
      /*In the icon open process and the process at startup,
      the end icon does not exist, so it is not set. */
      if (leadIdChk && endElm == undefined) return;
      if (endElm.classList.value.indexOf("posTeach") == -1)
        endElm.classList.add("posTeach");
      setPosInfo(endId, endElm, endPrm, posInfo.endFlg, posInfoCnt);
    }
  }
  return;
}
/*
 =========================================================================
 @function name     : posNumChk
 @argument          : setPosTeach PIN & set poskind
 @description       : 
 @return            : 
 =========================================================================
*/
function posNumChk(activeId, setStr) {
  var elm = document.getElementById(activeId);
  var posInfo = getPosInfoList(activeId);
  if (posInfo.flg.length > 0 || posInfo.endFlg.length > 0) {
    chkPosInfo(elm, setStr, activeId, posInfo);
    return;
  }
  /* default instruction*/
  if (setStr == null) {
    $("#" + activeId)
      .find(".posContainer")
      .remove();
    $("#" + activeId)
      .find(".posOmit")
      .remove();
    var dtfrm = document.getElementById(
      get_detail_frm_id(activeId)
    ).contentWindow;
    var robotPos = $(document.getElementById(get_detail_frm_id(activeId)))
      .contents()
      .find(".position");
    for (
      var posNumCnt = 0;
      posNumCnt < g_program_data[activeId].position.length;
      posNumCnt++
    ) {
      if (typeof robotPos[posNumCnt] != "undefined") {
        var pos_data = dtfrm.document
          .getElementById(robotPos[posNumCnt].id)
          .getPosInfoCurrentKind();
        g_program_data[activeId].position[posNumCnt].kind = pos_data.posKind;
        switch (pos_data.posKind) {
          case POSKIND_POSNUM:
            g_program_data[activeId].position[posNumCnt].number = Number(
              pos_data.posNumber
            );
            if (g_program_data[activeId].position[posNumCnt].disp == "ON")
              addPosTriangle(elm, pos_data.posNumber, posNumCnt);
            break;
          case POSKIND_POSREGI:
            g_program_data[activeId].position[posNumCnt].number = Number(
              pos_data.posRegNum
            );
            if (g_program_data[activeId].position[posNumCnt].disp == "ON")
              addPosTriangle(elm, Number(pos_data.posRegNum), posNumCnt);
            break;
          case POSKIND_POSREGI_REGI:
            g_program_data[activeId].position[posNumCnt].number = Number(
              pos_data.posRegRegNum
            );
            if (g_program_data[activeId].position[posNumCnt].disp == "ON")
              addPosTriangle(elm, "R", posNumCnt);
            break;
          case POSKIND_POSREGI_AR:
            g_program_data[activeId].position[posNumCnt].number = Number(
              pos_data.posRegArgNum
            );
            if (g_program_data[activeId].position[posNumCnt].disp == "ON")
              addPosTriangle(elm, "AR", posNumCnt);
            break;
          default:
            break;
        }
      }
    }
    /* High functionality instruction*/
  } else {
    var posInfo = getPosInfoList(activeId);
    var posInfoCnt = 0;
    setPosInfo(activeId, elm, setStr, posInfo, posInfoCnt);
  }
}
/*
 =========================================================================
 @function name   : setPosInfo
 @argument[]      :
 @description     : add bracketEnd posTeach pin
 @return          :
 =========================================================================
*/
function setPosInfo(id, elm, param, posInfo, posInfoCnt) {
  if (posInfo == undefined) posInfo = [];
  if (posInfoCnt == undefined) posInfoCnt = 0;
  if (posInfoCnt == 0) {
    $("#" + id)
      .find(".posContainer")
      .remove();
    $("#" + id)
      .find(".posOmit")
      .remove();
  }
  var posCnt = 0;
  var get_posnum = function (id, cnt, prm, chkstr) {
    /* Route where drop operation & undo & redo were performed */
    if (prm.startsWith(chkstr)) {
      if (g_program_data[id].position[cnt - 1].number == 0) {
        var posnum =
          g_program_data[id].position[cnt - 1].kind == POSKIND_POSNUM
            ? posIndex_get()
            : 1;
      } else {
        var posnum = g_program_data[id].position[cnt - 1].number;
      }
    } else {
      var posnum = Number(prm.replace(/[^0-9]/g, ""));
    }
    return posnum;
  };
  var prm = commentParse(split_param_call(param)[1]).split(",");
  for (var prmCnt = 0; prmCnt < prm.length; prmCnt++) {
    if (posCheck(prm[prmCnt])) {
      posCnt++;
      if (g_program_data[id].position[posCnt - 1] != undefined) {
        if (
          judge_posKind(prm[prmCnt]) == POSKIND_POSREGI_REGI ||
          prm[prmCnt].startsWith("PR[R[")
        ) {
          g_program_data[id].position[posCnt - 1].kind = POSKIND_POSREGI_REGI;
          var posnum = get_posnum(id, posCnt, prm[prmCnt], "PR[R[N");
        } else if (
          judge_posKind(prm[prmCnt]) == POSKIND_POSREGI_AR ||
          prm[prmCnt].startsWith("PR[AR[")
        ) {
          g_program_data[id].position[posCnt - 1].kind = POSKIND_POSREGI_AR;
          var posnum = get_posnum(id, posCnt, prm[prmCnt], "PR[AR[N");
        } else if (
          judge_posKind(prm[prmCnt]) == POSKIND_POSREGI ||
          prm[prmCnt].startsWith("PR[")
        ) {
          g_program_data[id].position[posCnt - 1].kind = POSKIND_POSREGI;
          var posnum = get_posnum(id, posCnt, prm[prmCnt], "PR[N");
        } else if (
          judge_posKind(prm[prmCnt]) == POSKIND_POSNUM ||
          prm[prmCnt].startsWith("P[")
        ) {
          g_program_data[id].position[posCnt - 1].kind = POSKIND_POSNUM;
          var posnum = get_posnum(id, posCnt, prm[prmCnt], "P[N");
        }
        g_program_data[id].position[posCnt - 1].number = posnum;
      }
      if (!posInfo.length && id.startsWith("bktend")) continue;
      if (posInfo.length > 0 && posInfo[prmCnt] != "ON") continue;
      if (elm == null) continue;
      if (
        g_program_data[id].position[posCnt - 1].disp == "ON" &&
        posInfoCnt < 4
      ) {
        addPosTriangle(elm, posnum, posCnt - 1, id);
        posInfoCnt++;
      }
    }
  }
  return posInfoCnt;
}

/*
 =========================================================================
 @function name     : addInstructionPos
 @argument          : Sample programs value check
 @description       : 
 @return            : editPrg
 =========================================================================
*/
function addInstructionPos(addProg) {
  var spaceMatch = /\s+(?![^\[]*\])/g;
  var commaMatch = /,(?=(?:[^']*'[^']*')*[^']*$)/g;
  var array_string = addProg.split(spaceMatch);
  if (
    array_string[0] != ORDER_LINE &&
    array_string[0] != ORDER_JOINT &&
    array_string[0] != ORDER_CURVE &&
    array_string[0] != "L" &&
    array_string[0] != "J"
  ) {
    array_string[0] = " " + array_string[0];
  }
  for (var num = 0; num < array_string.length; num++) {
    if (array_string[num].indexOf("(") != -1) {
      var start = array_string[num].indexOf("(");
      var tpName = array_string[num].substr(0, start + 1);
      var param = array_string[num].substr(start + 1);
      var splitPrm = param.split(commaMatch);

      for (var i = 0; i < splitPrm.length; i++) {
        if (
          splitPrm[i].indexOf(ORDER_POS + "[N]") != -1 ||
          splitPrm[i].indexOf("P[N]") != -1
        ) {
          var posnum = getMinPos();
          splitPrm[i] = splitPrm[i].replace("[N]", "[" + posnum + "]");
        } else if (
          array_string[num].indexOf(
            ORDER_POSREGI + "[" + ORDER_REGI + "[N]]"
          ) != -1 ||
          array_string[num].indexOf("PR[R[N]]") != -1 ||
          array_string[num].indexOf(
            ORDER_POSREGI + "[" + ORDER_ARGUMENT + "[N]]"
          ) != -1 ||
          array_string[num].indexOf("PR[AR[N]]") != -1
        ) {
          /* The value to be replaced shall be a fixed value. */
          splitPrm[i] = splitPrm[i].replace("[N]", "[1]");
        } else if (
          splitPrm[i].indexOf(ORDER_POSREGI + "[N]") != -1 ||
          splitPrm[i].indexOf("PR[N]") != -1
        ) {
          var posnum = getMinPosreg();
          splitPrm[i] = splitPrm[i].replace("[N]", "[" + posnum + "]");
        }
      }
      array_string[num] = tpName + splitPrm.join(",");
    } else {
      if (
        array_string[num].indexOf(ORDER_POS + "[N]") != -1 ||
        array_string[num].indexOf("P[N]") != -1
      ) {
        var posnum = getMinPos();
        array_string[num] = array_string[num].replace(
          "[N]",
          "[" + posnum + "]"
        );
      } else if (
        array_string[num].indexOf(ORDER_POSREGI + "[" + ORDER_REGI + "[") !=
          -1 ||
        array_string[num].indexOf("PR[R[N]]") != -1 ||
        array_string[num].indexOf(ORDER_POSREGI + "[" + ORDER_ARGUMENT + "[") !=
          -1 ||
        array_string[num].indexOf("PR[AR[N]]") != -1
      ) {
        /* The value to be replaced shall be a fixed value. */
        array_string[num] = array_string[num].replace("[N]", "[1]");
      } else if (
        array_string[num].indexOf(ORDER_POSREGI + "[N]") != -1 ||
        array_string[num].indexOf("PR[N]") != -1
      ) {
        var posnum = getMinPosreg();
        array_string[num] = array_string[num].replace(
          "[N]",
          "[" + posnum + "]"
        );
      }
    }
    array_string[num] = setLangConvJpEng(array_string[num]);
  }
  var editProg = array_string.join(" ");
  posTemporary = [];
  posRegTemporary = [];
  return editProg;
}

/*
 =========================================================================
 @function name     : elmChangeCheck
 @argument[]        : 
 @description       : change elment advinst check
 @return            : 
 =========================================================================
*/
function elmChangeCheck() {
  var config = { childList: true };
  adinObservFlag = true;
  adinstObserver.observe(document.body, config);
}
/*
 =========================================================================
 @function name     : addInstructionbracket
 @argument[addProg] : Sample programs to add
 @description       : Receive a sample program to add. : Externally Called I/F
 @return            : none
 =========================================================================
*/

function addInstructionBracket(progList, dropNum, dropEndNum, dropFuncFlg) {
  var numCheck = /^\d*$/;
  if (dropFuncFlg == true) {
    samplePrg_status.dropFunc = true;
  }
  if (
    typeof progList == "undefined" ||
    progList.length == 0 ||
    typeof progList != "object" ||
    progList.length > 20
  ) {
    var errMess = "[I132]";
  }

  if (
    !numCheck.test(dropNum) ||
    dropNum == 0 ||
    typeof dropNum == "undefined" ||
    (progList != 0 && progList.length + 1 < dropNum)
  ) {
    var errMess = "[I133]";
  }

  if (
    !numCheck.test(dropEndNum) ||
    dropEndNum == 0 ||
    typeof dropEndNum == "undefined" ||
    (progList != 0 && progList.length + 2 < dropEndNum) ||
    dropEndNum <= dropNum
  ) {
    var errMess = "[I134]";
  }

  if (errMess) {
    errMess = langResource.ihmieditor_pop_errorcode_c + errMess + "<br>";
    errPopUp(
      errMess +
        langResource.ihmieditor_pop_loaderr_c +
        "<br>" +
        langResource.ihmieditor_pop_moveprglist_c
    );
    return;
  }
  samplePrg_status.typeBracket = true;
  addProg = progList.concat();
  dropProgNum = dropNum;
  dropProgEndNum = dropEndNum;
}
/*
 =========================================================================
 @function name     : addInstructionProg
 @argument[addProg] : Sample programs to add
 @description       : Receive a sample program to add. : Externally Called I/F
 @return            : none
 =========================================================================
*/
function addInstructionProg(progList, dropNum, dropFuncFlg) {
  var numCheck = /^\d*$/;
  if (dropFuncFlg == true) {
    samplePrg_status.dropFunc = true;
  }
  if (
    typeof progList == "undefined" ||
    progList.length == 0 ||
    typeof progList != "object" ||
    progList.length > 20
  ) {
    var errMess = "[I132]";
  }

  if (
    !numCheck.test(dropNum) ||
    dropNum == 0 ||
    typeof dropNum == "undefined" ||
    (progList != 0 && progList.length + 1 < dropNum)
  ) {
    var errMess = "[I133]";
  }
  if (errMess) {
    errMess = langResource.ihmieditor_pop_errorcode_c + errMess + "<br>";
    errPopUp(
      errMess +
        langResource.ihmieditor_pop_loaderr_c +
        "<br>" +
        langResource.ihmieditor_pop_moveprglist_c
    );
    return;
  }
  addProg = progList.concat();
  dropProgNum = dropNum;
}

/*
 =========================================================================
 @function name     : dispAddProgSave
 @argument[addProg] : Sample programs to add
 @description       : Receive a sample program to add. : Externally Called I/F
 @return            : none
 =========================================================================
*/
function dispAddProgSave(prg, dropFuncFlg) {
  if (dropFuncFlg == true) {
    samplePrg_status.dropFunc = true;
  }
  if (typeof prg == "object") {
    for (var i in prg) {
      addProg.push(prg[i]);
    }
  } else if (typeof prg != "undefined") {
    addProg.push(prg);
  }
  dropProgNum = -1;
  if (addProg.length > 0 && activeTarget != "") {
    addSampleProgTp(activeTarget, false);
  }
}

/*
 =========================================================================
 @function name     : getAddPos
 @argument[addProg] : get robot position
 @description       :
 @return            : none
 =========================================================================
*/
function updatePosData(updatePosNum) {
  if (typeof updatePosNum == "number") {
    var grpNum = 1;
    get_curpos(
      top.KXYZWPR,
      top.TXML_TP_REC_TYPE,
      grpNum,
      updatePosCallBack,
      updatePosNum
    );
  }
}
/*
 =========================================================================
 @function name     : updatePosCallBack
 @argument[addProg] : get robot position
 @description       : updatePosData callback
 @return            : none
 =========================================================================
*/
function updatePosCallBack(dataForm, posType, grpNum, posData, posNum) {
  var cbArg = {};
  cbArg.tblKind = POSTBLKIND_REGS;
  cbArg.posNo = posNum;
  if (ufutSystemValues.length == 0) {
    ufutSystemValues[0] = { grp: 1, UF: 0, UT: 1 };
  }
  var posJson = analyzeCartesianPosition(posData);
  save_icon_position_cnt = 0;
  for (var i = 0; i < position.length; i++) {
    if (position[i].posNumber == cbArg.posNo) {
      positionNo = i;
      break;
    }
  }
  var posDataIdx = 0;
  for (var j = 0; j < position[positionNo].posData.length; j++) {
    if (position[positionNo].posData[j].groupNumber == grpNum) {
      posDataIdx = j;
      break;
    }
  }
  position[positionNo].posData[posDataIdx].poskey[0] =
    posJson.posData[posDataIdx].poskey[0];
  position[positionNo].posData[posDataIdx].poskey[1] =
    posJson.posData[posDataIdx].poskey[1];
  position[positionNo].posData[posDataIdx].poskey[2] =
    posJson.posData[posDataIdx].poskey[2];
  position[positionNo].posData[posDataIdx].poskey[3] =
    posJson.posData[posDataIdx].poskey[3];
  position[positionNo].posData[posDataIdx].poskey[4] =
    posJson.posData[posDataIdx].poskey[4];
  position[positionNo].posData[posDataIdx].poskey[5] =
    posJson.posData[posDataIdx].poskey[5];
  position[positionNo].posNumber = Number(cbArg.posNo);
  position[positionNo].Comment = posJson.Comment;
  position[positionNo].posData[posDataIdx].ufVal =
    posJson.posData[posDataIdx].ufVal;
  position[positionNo].posData[posDataIdx].utVal =
    posJson.posData[posDataIdx].utVal;
  position[positionNo].posData[posDataIdx].configStr =
    posJson.posData[posDataIdx].configStr;
  updatePositionObj(positionNo);
  save_posdata(positionNo, editPosCallback);
  addProg = [];

  if (activeTarget.toUpperCase().startsWith("-INST_ARC_HANDLE_TEACH")) {
    var parentData = getNestPosition();
    if (parentData != false) {
      for (var k in parentData) {
        if (
          parentData[k].parentId
            .toUpperCase()
            .startsWith("BKTLEAD-INST_EASYAW_START")
        ) {
          var endId = get_stretchOrder_pairId(
            parentData[k].parentId,
            REQ_ID_KIND_END,
            null
          );
          var endElm = document.getElementById(endId);
          var copyId = activeTarget;
          var copyElm = document.getElementById(copyId);
          var record_data = {
            id: [copyId],
            contents: [g_program_data[copyId]],
            place1: g_program_data[copyId].array_num,
            place2: g_program_data[endId].array_num,
            type: OPERATION_SORT,
          };
          $("#" + copyElm.id).insertAfter("#" + endId);
          order_nestChk(copyElm);
          g_program_arrayNumSave();
          draw_TLscale(false);
          var pasteIndex = endElm.classList.contains("nestlineArea")
            ? 0
            : g_program_data[endId].array_num + 1;
          if (record_data.place2 > record_data.place1) {
            pasteIndex += record_data.contents.length;
          }
          var startIndex = record_data.place1 + 1;
          var endIndex = startIndex + record_data.contents.length - 1;
          save_pasteLine(
            startIndex,
            endIndex,
            pasteIndex,
            1,
            save_pasteLine_callback,
            copyId
          );

          timeline_record.array_add(record_data);
          check_undoredo_active();
          stretchdata_record.array_add(g_stretchOrder_data);
          break;
        }
      }
    }
  }
  if (MODE_ACTION >= MODE_ROBOGUIDE) {
    position_record.array_add(position);
    positionregi_record.array_add(g_position_regi);
  }
}

/*
 =========================================================================
 @function name           : addSampleProgTp
 @argument[addedId]       : Added instruction ID
 @argument[sampleProgFlg] : To be set when the sample program is added.
 @description             : When an instruction is added, the attached instruction is added.
 @return                  : none
 =========================================================================
*/

function addSampleProgTp(addedId, sampleProgFlg) {
  var tmpId = "";
  var refElmId = addedId;
  addProgElm = [];
  save_id_array = [];
  addProgElm.dropId = [];
  addProgElm.endId = [];
  if (g_lineCountOver.count + addProg.length > MAX_LINE_COUNT) {
    /* Pop-up display due to excessive number of lines. */
    popup_lineCountMax();
    addProg = [];
    return false;
  }
  if (dropProgEndNum) {
    var endId = get_stretchOrder_pairId(addedId, REQ_ID_KIND_END, null);
  }
  if (dropProgNum > 0) {
    for (var cnt = 0; cnt < dropProgNum - 1; cnt++) {
      addProg[cnt] = addInstructionPos(addProg[cnt]);
      tmpId =
        iconTab[ICON_NOSUPPORT][INDEX_ID] +
        iconTab[ICON_NOSUPPORT][INDEX_G_VAL];
      iconTab[ICON_NOSUPPORT][INDEX_G_VAL] =
        iconTab[ICON_NOSUPPORT][INDEX_G_VAL] + 1;
      g_program_data[tmpId] = set_icon_data(iconTab[ICON_NOSUPPORT][INDEX_ID]);
      if (typeof addProg[cnt] != "undefined") {
        if (cnt != Object.keys(addProg)[cnt]) {
          g_program_data[tmpId].param = "";
        } else {
          g_program_data[tmpId].param = addProg[cnt];
        }
        addProgElm[cnt] = addIcon_create(tmpId, ICON_NOSUPPORT, "");
        $("#" + addedId).before(addProgElm[cnt]);
        save_id_array.push(addProgElm[cnt].id);
      }
    }
    if (endId) {
      refElmId = endId;
    }
    if (cnt != addProg.length) {
      for (var cnt = cnt; cnt < addProg.length; cnt++) {
        addProg[cnt] = addInstructionPos(addProg[cnt]);
        tmpId =
          iconTab[ICON_NOSUPPORT][INDEX_ID] +
          iconTab[ICON_NOSUPPORT][INDEX_G_VAL];
        iconTab[ICON_NOSUPPORT][INDEX_G_VAL] =
          iconTab[ICON_NOSUPPORT][INDEX_G_VAL] + 1;
        g_program_data[tmpId] = set_icon_data(
          iconTab[ICON_NOSUPPORT][INDEX_ID]
        );
        if (typeof addProg[cnt] != "undefined") {
          if (cnt != Object.keys(addProg)[cnt]) {
            g_program_data[tmpId].param = "";
          } else {
            g_program_data[tmpId].param = addProg[cnt];
          }
          if (dropProgEndNum) {
            addProgElm[cnt] = addIcon_create(tmpId, ICON_NOSUPPORT, "");
            if (cnt + 2 < dropProgEndNum) {
              $("#" + refElmId).before(addProgElm[cnt]);
            } else {
              $("#" + refElmId).after(addProgElm[cnt]);
              refElmId = addProgElm[cnt].id;
            }
            save_id_array.push(addProgElm[cnt].id);
          } else {
            addProgElm[cnt] = addIcon_create(tmpId, ICON_NOSUPPORT, "");
            $("#" + refElmId).after(addProgElm[cnt]);
            refElmId = addProgElm[cnt].id;
            save_id_array.push(addProgElm[cnt].id);
          }
        }
      }
    }
  } else if (dropProgNum == -1) {
    for (var cnt = 0; cnt < addProg.length; cnt++) {
      addProg[cnt] = addInstructionPos(addProg[cnt]);
      tmpId =
        iconTab[ICON_NOSUPPORT][INDEX_ID] +
        iconTab[ICON_NOSUPPORT][INDEX_G_VAL];
      iconTab[ICON_NOSUPPORT][INDEX_G_VAL] =
        iconTab[ICON_NOSUPPORT][INDEX_G_VAL] + 1;

      g_program_data[tmpId] = set_icon_data(iconTab[ICON_NOSUPPORT][INDEX_ID]);
      if (typeof addProg[cnt] != "undefined") {
        if (cnt != Object.keys(addProg)[cnt]) {
          g_program_data[tmpId].param = "";
        } else {
          g_program_data[tmpId].param = addProg[cnt];
        }
        addProgElm[cnt] = addIcon_create(tmpId, ICON_NOSUPPORT, "");

        if (
          addProg[cnt].startsWith(langResource.ihmieditor_order_l_c) ||
          addProg[cnt].startsWith(
            " " +
              langResource.ihmieditor_order_call_c +
              " " +
              "-INST_EASYAW_START"
          )
        ) {
          $("#" + refElmId).before(addProgElm[cnt]);
          var scrlRefElm = addProgElm[cnt].nextElementSibling;
        } else {
          $("#" + refElmId).after(addProgElm[cnt]);
          var scrlRefElm = addProgElm[cnt];
        }
        save_id_array.push(addProgElm[cnt].id);
      }
    }
    var NEED_SCRL_VAL = 60;
    var dist = scrlRefElm.offsetLeft - scrlWrpElm.scrollLeft;
    if (scrlWrpElm.clientWidth - (dist + TL_ICON_WIDTH) < NEED_SCRL_VAL) {
      $(scrlWrpElm).animate(
        {
          scrollLeft:
            scrlWrpElm.scrollLeft +
            (NEED_SCRL_VAL - (scrlWrpElm.clientWidth - (dist + TL_ICON_WIDTH))),
        },
        500,
        function () {
          scrollboost_positionSet();
        }
      );
    }
  }
  g_program_arrayNumSave();
  save_times = save_id_array.length - 1;
  g_adin_state.adinstAttachedFlg = true;
  if (dropProgNum > 0) {
    var tlIcon = document.getElementById(addedId);
    addProgElm.splice(dropProgNum - 1, 0, tlIcon);
    addProgElm.dropId = addedId;
  } else {
    addProgElm.dropId = null;
  }
  for (var int = 0; int < save_id_array.length; int++) {
    var tlNum = g_program_data[save_id_array[int]].array_num + 1;
    var setParam =
      " " + tlNum + ":" + g_program_data[save_id_array[int]].param + " ;";
    set_program_data(setParam, save_id_array[int]);
  }
  if (endId) {
    var endIcon = document.getElementById(endId);
    addProgElm.splice(dropProgEndNum - 1, 0, endIcon);
    addProgElm.endId = endId;
  }
  check_progOrder();
  need_position_save_flg = true;
  save_id_array = add_sampleprg_data(sampleProgFlg);
  if (g_wt_longPress_state.state == "startAdding") {
    g_wt_longPress_state.addStartElmId = save_id_array[0];
  } else if (g_wt_longPress_state.state == "endAdding") {
    g_wt_longPress_state.addEndElmId = save_id_array[0];
  }
  del_unused_posno();
  if (save_id_array.length == 1) {
    save_tporder(save_id_array[0], 2, save_tporder_callback, save_id_array[0]);
  } else {
    save_tporder(
      save_id_array[0],
      2,
      save_tporder_callback,
      save_id_array.shift()
    );
  }
  addProg = [];
}

/*
 =========================================================================
 @function name  : evalFunctionCall
 @argument       : 
 @description    : Function call executed on drop.
 @return         : none
 =========================================================================
*/
function evalFunctionCall() {
  var isBracket =
    typeof g_stretchOrder_data[g_adinDropList[0][0]] != "undefined";
  if (isBracket) {
    var objCnt = Object.keys(g_stretchOrder_data[g_adinDropList[0][0]]);
    var resultcnt = objCnt.filter(function (value) {
      return !isNaN(value);
    });
    var endIdNo = resultcnt.length - 1;
    var endParam =
      g_program_data[g_stretchOrder_data[g_adinDropList[0][0]][endIdNo].id]
        .param;

    var start = endParam.indexOf("(");
    var end = endParam.lastIndexOf(")");
    endParam = endParam.substring(start + 1, end);
    endParam = langConvEng(endParam.replace(/'/g, "\\'"));
    var evalStr =
      "['" +
      langConvEng(g_adinDropList[0][1].replace(/'/g, "\\'")) +
      "','" +
      endParam +
      "']";
  } else {
    var evalStr =
      "'" + langConvEng(g_adinDropList[0][1].replace(/'/g, "\\'")) + "'";
  }
  var adinFrm = document.getElementById(
    "adin_" + g_adinDropList[0][0]
  ).contentWindow;
  var evalReturn = true;
  var evalAppName =
    g_inst_obj[g_xml_data[g_adinDropList[0][2]][2]]["detail"]["appName"];
  if (typeof adinFrm[g_xml_data[g_adinDropList[0][2]][3]] != "undefined") {
    try {
      evalReturn = eval(
        "adinFrm." + g_xml_data[g_adinDropList[0][2]][3] + "(" + evalStr + ")"
      );
    } catch (e) {
      errPopUp(
        evalAppName +
          langResource.ihmieditor_pop_adinstructionnotfile_c +
          "<br>" +
          langResource.ihmieditor_pop_errorcode_c +
          (isBracket ? "[I504]" : "[I503]") +
          "<br>" +
          langResource.ihmieditor_pop_moveprglist_c
      );
      return;
    }
  }
  if (evalReturn === false) {
    errPopUp(
      evalAppName +
        langResource.ihmieditor_pop_adinstructionnotfile_c +
        "<br>" +
        langResource.ihmieditor_pop_errorcode_c +
        "[I502]<br>" +
        langResource.ihmieditor_pop_moveprglist_c
    );
  }
}

/*
 =========================================================================
 @function name  : setEndParam
 @argument       : str
 @description    : Confirm button  processing
 @return         : none
 =========================================================================
*/
function setEndParam(str) {
  if (g_adintarget != "") {
    var setActive = g_adintarget;
  } else {
    var setActive = activeTarget;
  }
  if (setActive == "") return;
  var instObj = g_inst_obj[g_xml_data[g_program_data[setActive].iconNo][2]];
  var endId = get_stretchOrder_pairId(setActive, REQ_ID_KIND_END, null);
  var record_data = {
    id: "",
    lineNum: g_program_data[endId].array_num + 1,
    contents: g_program_data[endId],
    param1: {},
    param2: {},
    elem: "",
  };
  if (g_adin_state.setBracketArgFlg && g_adintarget == "") {
    g_adin_state.record[1] = {};
    $.extend(true, g_adin_state.record[1], record_data);
    $.extend(true, g_adin_state.record[1].param1, g_program_data[endId]);
  } else {
    record_data.type = OPERATION_EDIT;
    $.extend(true, record_data.param1, g_program_data[endId]);
  }

  need_position_save_flg = false;
  var setParam = "";
  var setStr = str;
  if (setStr.trim() != "") {
    setStr = setLangConvJpEng("(" + setStr + ")");
  }
  setParam = instObj.end.appName + setStr;

  if (setParam !== null && setParam !== "") {
    if (instObj.type == "posTeach" || instObj.type == "posBracket") {
      posNumChk(endId, setStr, true);
    }
    if (g_adintarget != "") {
      data_before_change = JSON.parse(JSON.stringify(g_program_data[endId]));
      fixDropAdinDataSave_g_program(setParam);
      write_mode = 0;
      dropSaveFlg = true;
      save_droptporder(endId, write_mode, save_tporder_callback, endId);
    } else {
      data_before_change = JSON.parse(JSON.stringify(g_program_data[endId]));
      fixDataSave_g_program(setParam, null, null, null, endId);
      if (g_adin_state.setBracketArgFlg) {
        $.extend(true, g_adin_state.record[1].param2, g_program_data[endId]);
      } else {
        $.extend(true, record_data.param2, g_program_data[endId]);
        timeline_record.array_add(record_data);
        check_undoredo_active();
        stretchdata_record.array_add(g_stretchOrder_data);
        position_record.array_add(position);
        positionregi_record.array_add(g_position_regi);
      }
      write_mode = 0;
      dropSaveFlg = false;
      save_tporder(endId, write_mode, save_tporder_callback, endId);
    }
  }
}
/*
 =========================================================================
 @function name           : setSampleTpOrder
 @argument[line]          : Added instruction ID
 @argument[order_array]   : To be set when the sample program is added.
 @description             : When an instruction is added, the attached instruction is added.
 @return                  : none
 =========================================================================
*/

function setSampleTpOrder(prgLine, order_array) {
  var tmpId = "";
  addProgElm = [];
  save_id_array = [];
  addProgElm.dropId = [];
  addProgElm.endId = [];
  var numbering_order = [];
  if (g_lineCountOver.count + order_array.length > MAX_LINE_COUNT) {
    /* Pop-up display due to excessive number of lines. */
    popup_lineCountMax();
    addProg = [];
    return false;
  }
  /*Specifying 0 or minus lines is a return*/
  if (prgLine <= 0) {
    return;
  }
  /*prgLine = g_program_data.arry_num + 1 ,The previous program line to insert = prgLine - 2*/
  var insertBeforePrgLine = prgLine - 2;
  var chkId;
  var tl = document.getElementById("TimeLineArea").children;
  var tl_data = Object.entries(tl);
  var g_data = Object.entries(g_program_data);
  if (prgLine > g_data.length + 1) {
    return;
  }
  /*Refer to the program line immediately before the program line you want to insert */
  var before_icon_data = g_data.find(
    ([_id, data]) => data.array_num == insertBeforePrgLine
  );

  for (var cnt = 0; cnt < order_array.length; cnt++) {
    numbering_order[cnt] = addInstructionPos(order_array[cnt]);
    tmpId =
      iconTab[ICON_NOSUPPORT][INDEX_ID] + iconTab[ICON_NOSUPPORT][INDEX_G_VAL];
    iconTab[ICON_NOSUPPORT][INDEX_G_VAL] =
      iconTab[ICON_NOSUPPORT][INDEX_G_VAL] + 1;

    addProgElm[cnt] = addIcon_create(tmpId, ICON_NOSUPPORT, "");
    /*Addition process to the first line */
    if (typeof before_icon_data == "undefined") {
      tl[TL_PROG_LEAD_POS - 1 + cnt].after(addProgElm[cnt]);
    } else {
      if (
        (before_icon_data[0].startsWith("bktend") ||
          before_icon_data[0].startsWith("forend") ||
          before_icon_data[0].startsWith("ifend")) &&
        typeof tl[before_icon_data[0]] == "undefined"
      ) {
        chkId = get_stretchOrder_pairId(
          before_icon_data[0],
          REQ_ID_KIND_LEAD,
          null
        );
      } else {
        chkId = before_icon_data[0];
      }
      /*The position you tried to add is in the closing parenthesis*/
      if (typeof tl[chkId] == "undefined") {
        return;
      }
      /*When trying to add after the bracket start, if the bracket is closed, do not add*/
      if (
        chkId == before_icon_data[0] &&
        tl[chkId].classList.value.indexOf("stretchOrder_close") > -1
      ) {
        return;
      }
      var insert_line = tl_data.find(([_id, data]) => data.id == chkId);
      tl[Number(insert_line[0]) + cnt].after(addProgElm[cnt]);
    }
    save_id_array.push(addProgElm[cnt].id);
    g_program_data[tmpId] = set_icon_data(iconTab[ICON_NOSUPPORT][INDEX_ID]);
    g_program_data[tmpId].param = numbering_order[cnt];
  }
  addProg = order_array;
  g_program_arrayNumSave();
  save_times = save_id_array.length - 1;
  g_adin_state.adinstAttachedFlg = true;
  addProgElm.dropId = null;
  for (var int = 0; int < save_id_array.length; int++) {
    var tlNum = g_program_data[save_id_array[int]].array_num + 1;
    var setParam =
      " " + tlNum + ":" + g_program_data[save_id_array[int]].param + " ;";
    set_program_data(setParam, save_id_array[int]);
  }
  check_progOrder();
  need_position_save_flg = true;
  save_id_array = add_sampleprg_data(false);
  del_unused_posno();
  if (save_id_array.length == 1) {
    save_tporder(save_id_array[0], 2, save_tporder_callback, save_id_array[0]);
  } else {
    save_tporder(
      save_id_array[0],
      2,
      save_tporder_callback,
      save_id_array.shift()
    );
  }
  addProg = [];
}

/*
=========================================================================
@function name  : setLangConvJpEng
@argument       : str
@description    : argument is language convert.
@return         : convert str
=========================================================================
*/
function setLangConvJpEng(str) {
  if (gcurrentLang == "jp" || gcurrentLang == "kn") {
    var singleQuote = /[']/;
    var replacePrmList = [];
    var commaMatch = /,(?=(?:[^']*'[^']*')*[^']*$)/g;
    var vOffsetPram = /VOFFSET(?=(?:[^']*'[^']*')*[^']*$)/g;
    var substrPram = /SUBSTR(?=(?:[^']*'[^']*')*[^']*$)/g;
    var findstrPram = /FINDSTR(?=(?:[^']*'[^']*')*[^']*$)/g;
    var strlenPram = /STRLEN(?=(?:[^']*'[^']*')*[^']*$)/g;
    var offsetPram = /Tool_Offset(?=(?:[^']*'[^']*')*[^']*$)/g;
    var breakPram = /BREAK(?=(?:[^']*'[^']*')*[^']*$)/g;
    var pulsePram = /PULSE(?=(?:[^']*'[^']*')*[^']*$)/g;
    var jposPram = /Jpos(?=(?:[^']*'[^']*')*[^']*$)/g;
    var LposPram = /Lpos(?=(?:[^']*'[^']*')*[^']*$)/g;
    var skipPram = /Skip(?=(?:[^']*'[^']*')*[^']*$)/g;
    var offPram = /OFF(?=(?:[^']*'[^']*')*[^']*$)/g;
    var onPram = /ON(?=(?:[^']*'[^']*')*[^']*$)/g;
    var pthPram = /PTH(?=(?:[^']*'[^']*')*[^']*$)/g;
    var andPram = /AND(?=(?:[^']*'[^']*')*[^']*$)/g;
    var orPram = /OR(?=(?:[^']*'[^']*')*[^']*$)/g;
    var incPram = /INC(?=(?:[^']*'[^']*')*[^']*$)/g;
    var accPram = /ACC(?=(?:[^']*'[^']*')*[^']*$)/g;
    var wjntPram = /Wjnt(?=(?:[^']*'[^']*')*[^']*$)/g;
    var taPram = /TA(?=(?:[^']*'[^']*')*[^']*$)/g;
    var tbPram = /Tb(?=(?:[^']*'[^']*')*[^']*$)/g;
    var prm = str.split(commaMatch);
    Object.keys(prm).forEach(function (key) {
      if (singleQuote.test(prm[key])) {
        prm[key] = prm[key].replace(
          vOffsetPram,
          langResource.ihmieditor_order_voffset_c
        );
        prm[key] = prm[key].replace(
          findstrPram,
          langResource.ihmieditor_order_findstr_c
        );
        prm[key] = prm[key].replace(
          substrPram,
          langResource.ihmieditor_order_substr_c
        );
        prm[key] = prm[key].replace(
          strlenPram,
          langResource.ihmieditor_order_strren_c
        );
        prm[key] = prm[key].replace(
          offsetPram,
          langResource.ihmieditor_order_offset_c
        );
        prm[key] = prm[key].replace(
          breakPram,
          langResource.ihmieditor_order_break_c
        );
        prm[key] = prm[key].replace(
          pulsePram,
          langResource.ihmieditor_order_pulse_c
        );
        prm[key] = prm[key].replace(
          jposPram,
          langResource.ihmieditor_order_jpos_c
        );
        prm[key] = prm[key].replace(
          LposPram,
          langResource.ihmieditor_order_lpos_c
        );
        prm[key] = prm[key].replace(
          skipPram,
          langResource.ihmieditor_order_skip_c
        );
        prm[key] = prm[key].replace(
          offPram,
          langResource.ihmieditor_order_off_c
        );
        prm[key] = prm[key].replace(onPram, langResource.ihmieditor_order_on_c);
        prm[key] = prm[key].replace(
          pthPram,
          langResource.ihmieditor_order_pth_c
        );
        prm[key] = prm[key].replace(orPram, langResource.ihmieditor_order_or_c);
        prm[key] = prm[key].replace(
          incPram,
          langResource.ihmieditor_order_inc_c
        );
        prm[key] = prm[key].replace(
          accPram,
          langResource.ihmieditor_order_acc_c
        );
        prm[key] = prm[key].replace(
          andPram,
          langResource.ihmieditor_order_and_c
        );
        prm[key] = prm[key].replace(
          wjntPram,
          langResource.ihmieditor_order_wjnt_c
        );
        prm[key] = prm[key].replace(taPram, langResource.ihmieditor_order_ta_c);
        prm[key] = prm[key].replace(tbPram, langResource.ihmieditor_order_tb_c);
      } else {
        prm[key] = prm[key].replace(
          /TIMER_OVERFLOW\[/g,
          langResource.ihmieditor_order_timeroverflow_c + "["
        );
        prm[key] = prm[key].replace(
          /Tool_Offset/g,
          langResource.ihmieditor_order_tool_offset_c
        );
        prm[key] = prm[key].replace(
          /UFRAME\[/g,
          langResource.ihmieditor_order_uframe_c + "["
        );
        prm[key] = prm[key].replace(
          /UFRAME_NUM\[/g,
          langResource.ihmieditor_order_uframe_num_c + "["
        );
        prm[key] = prm[key].replace(
          /VOFFSET/g,
          langResource.ihmieditor_order_voffset_c
        );
        prm[key] = prm[key].replace(
          /Constant/g,
          langResource.ihmieditor_order_constant_c
        );
        prm[key] = prm[key].replace(
          /UTOOL\[/g,
          langResource.ihmieditor_order_utool_c + "["
        );
        prm[key] = prm[key].replace(
          /UTOOL_NUM\[/g,
          langResource.ihmieditor_order_utool_num_c + "["
        );
        prm[key] = prm[key].replace(
          /TIMER\[/g,
          langResource.ihmieditor_order_timer_c + "["
        );
        prm[key] = prm[key].replace(
          /FINDSTR/g,
          langResource.ihmieditor_order_findstr_c
        );
        prm[key] = prm[key].replace(
          /Ind\.EV/g,
          langResource.ihmieditor_order_ind_ev_c
        );
        prm[key] = prm[key].replace(
          /STRLEN/g,
          langResource.ihmieditor_order_strren_c
        );
        prm[key] = prm[key].replace(
          /SUBSTR/g,
          langResource.ihmieditor_order_substr_c
        );
        prm[key] = prm[key].replace(
          /Offset/g,
          langResource.ihmieditor_order_offset_c
        );
        prm[key] = prm[key].replace(
          /LBL\[/g,
          langResource.ihmieditor_order_lbl_c + "["
        );
        prm[key] = prm[key].replace(
          /BREAK/g,
          langResource.ihmieditor_order_break_c
        );
        prm[key] = prm[key].replace(
          /PULSE/g,
          langResource.ihmieditor_order_pulse_c
        );
        prm[key] = prm[key].replace(
          /AR\[/g,
          langResource.ihmieditor_order_argument_c + "["
        );
        prm[key] = prm[key].replace(
          /PR\[/g,
          langResource.ihmieditor_order_posregi_c + "["
        );
        prm[key] = prm[key].replace(
          /SR\[/g,
          langResource.ihmieditor_order_strregi_c + "["
        );
        prm[key] = prm[key].replace(
          /VR\[/g,
          langResource.ihmieditor_order_vr_c + "["
        );
        prm[key] = prm[key].replace(
          /\,CALL/g,
          "," + langResource.ihmieditor_order_call_c
        );
        prm[key] = prm[key].replace(
          /Jpos/g,
          langResource.ihmieditor_order_jpos_c
        );
        prm[key] = prm[key].replace(
          /Lpos/g,
          langResource.ihmieditor_order_lpos_c
        );
        prm[key] = prm[key].replace(
          /Skip/g,
          langResource.ihmieditor_order_skip_c
        );
        prm[key] = prm[key].replace(
          /Wjnt/g,
          langResource.ihmieditor_order_wjnt_c
        );
        prm[key] = prm[key].replace(
          /R\[/g,
          langResource.ihmieditor_order_regi_c + "["
        );
        prm[key] = prm[key].replace(
          /P\[/g,
          langResource.ihmieditor_order_pos_c + "["
        );
        prm[key] = prm[key].replace(
          /ACC/g,
          langResource.ihmieditor_order_acc_c
        );
        prm[key] = prm[key].replace(
          /\sAND/g,
          " " + langResource.ihmieditor_order_and_c
        );
        prm[key] = prm[key].replace(
          /INC/g,
          langResource.ihmieditor_order_inc_c
        );
        prm[key] = prm[key].replace(
          /PTH/g,
          langResource.ihmieditor_order_pth_c
        );
        prm[key] = prm[key].replace(
          /OFF/g,
          langResource.ihmieditor_order_off_c
        );
        prm[key] = prm[key].replace(/ON/g, langResource.ihmieditor_order_on_c);
        prm[key] = prm[key].replace(
          /\sOR/g,
          " " + langResource.ihmieditor_order_or_c
        );
        prm[key] = prm[key].replace(
          /TA\s/g,
          langResource.ihmieditor_order_ta_c + " "
        );
        prm[key] = prm[key].replace(
          /TB\s/g,
          langResource.ihmieditor_order_tb_c + " "
        );
        prm[key] = prm[key].replace(/EV/g, langResource.ihmieditor_order_ev_c);
      }
      replacePrmList.push(prm[key]);
    });
    str = replacePrmList.join(",");
  }

  return str;
}

/*
 =========================================================================
 @function name  : langConvEng
 @argument       : str
 @description    : argument is english only
 @return         : convert str
 =========================================================================
*/
function langConvEng(str) {
  var regExpWord = new RegExp(
    langResource.ihmieditor_order_timeroverflow_c + "\\[",
    "g"
  );
  str = str.replace(regExpWord, "TIMER_OVERFLOW[");
  regExpWord = new RegExp(langResource.ihmieditor_order_constant_c, "g");
  str = str.replace(regExpWord, "Constant");
  regExpWord = new RegExp(langResource.ihmieditor_order_timer_c + "\\[", "g");
  str = str.replace(regExpWord, "TIMER[");
  regExpWord = new RegExp(langResource.ihmieditor_order_uframe_c + "\\[", "g");
  str = str.replace(regExpWord, "UFRAME[");
  regExpWord = new RegExp(langResource.ihmieditor_order_utool_c + "\\[", "g");
  str = str.replace(regExpWord, "UTOOL[");
  regExpWord = new RegExp(
    langResource.ihmieditor_order_uframe_num_c + "\\[",
    "g"
  );
  str = str.replace(regExpWord, "UFRAME_NUM[");
  regExpWord = new RegExp(
    langResource.ihmieditor_order_utool_num_c + "\\[",
    "g"
  );
  str = str.replace(regExpWord, "UTOOL_NUM[");
  regExpWord = new RegExp(langResource.ihmieditor_order_posregi_c + "\\[", "g");
  str = str.replace(regExpWord, "PR[");
  regExpWord = new RegExp(langResource.ihmieditor_order_strregi_c + "\\[", "g");
  str = str.replace(regExpWord, "SR[");
  regExpWord = new RegExp(
    langResource.ihmieditor_order_argument_c + "\\[",
    "g"
  );
  str = str.replace(regExpWord, "AR[");
  regExpWord = new RegExp(langResource.ihmieditor_order_vr_c + "\\[", "g");
  str = str.replace(regExpWord, "VR[");
  regExpWord = new RegExp(langResource.ihmieditor_order_regi_c + "\\[", "g");
  str = str.replace(regExpWord, "R[");
  regExpWord = new RegExp(langResource.ihmieditor_order_pos_c + "\\[", "g");
  str = str.replace(regExpWord, "P[");
  regExpWord = new RegExp(langResource.ihmieditor_order_pulse_c, "g");
  str = str.replace(regExpWord, "PULSE");
  regExpWord = new RegExp(langResource.ihmieditor_order_lpos_c, "g");
  str = str.replace(regExpWord, "Lpos");
  regExpWord = new RegExp(langResource.ihmieditor_order_jpos_c, "g");
  str = str.replace(regExpWord, "Jpos");
  regExpWord = new RegExp(langResource.ihmieditor_order_strren_c, "g");
  str = str.replace(regExpWord, "STRLEN");
  regExpWord = new RegExp(langResource.ihmieditor_order_findstr_c, "g");
  str = str.replace(regExpWord, "FINDSTR");
  regExpWord = new RegExp(langResource.ihmieditor_order_substr_c, "g");
  str = str.replace(regExpWord, "SUBSTR");
  regExpWord = new RegExp(langResource.ihmieditor_order_and_c, "g");
  str = str.replace(regExpWord, "AND");
  regExpWord = new RegExp(langResource.ihmieditor_order_or_c, "g");
  str = str.replace(regExpWord, "OR");
  regExpWord = new RegExp(langResource.ihmieditor_order_on_c, "g");
  str = str.replace(regExpWord, "ON");
  regExpWord = new RegExp(langResource.ihmieditor_order_off_c, "g");
  str = str.replace(regExpWord, "OFF");
  regExpWord = new RegExp(langResource.ihmieditor_order_skip_c, "g");
  str = str.replace(regExpWord, "Skip");
  regExpWord = new RegExp(langResource.ihmieditor_order_lbl_c, "g");
  str = str.replace(regExpWord, "LBL");
  regExpWord = new RegExp(langResource.ihmieditor_order_tool_offset_c, "g");
  str = str.replace(regExpWord, "Tool_Offset");
  regExpWord = new RegExp(langResource.ihmieditor_order_offset_c, "g");
  str = str.replace(regExpWord, "Offset");
  regExpWord = new RegExp(langResource.ihmieditor_order_voffset_c, "g");
  str = str.replace(regExpWord, "VOFFSET");
  regExpWord = new RegExp(langResource.ihmieditor_order_break_c, "g");
  str = str.replace(regExpWord, "BREAK");
  regExpWord = new RegExp(langResource.ihmieditor_order_ind_ev_c, "g");
  str = str.replace(regExpWord, "Ind.EV");
  regExpWord = new RegExp(langResource.ihmieditor_order_ev_c, "g");
  str = str.replace(regExpWord, "EV");
  regExpWord = new RegExp(langResource.ihmieditor_order_wjnt_c, "g");
  str = str.replace(regExpWord, "Wjnt");
  regExpWord = new RegExp(langResource.ihmieditor_order_acc_c, "g");
  str = str.replace(regExpWord, "ACC");
  regExpWord = new RegExp(langResource.ihmieditor_order_ta_c, "g");
  str = str.replace(regExpWord, "TA");
  regExpWord = new RegExp(langResource.ihmieditor_order_tb_c, "g");
  str = str.replace(regExpWord, "TB");
  regExpWord = new RegExp(langResource.ihmieditor_order_inc_c, "g");
  str = str.replace(regExpWord, "INC");
  regExpWord = new RegExp(langResource.ihmieditor_order_pth_c, "g");
  str = str.replace(regExpWord, "PTH");
  regExpWord = new RegExp(langResource.ihmieditor_order_call_c, "g");
  str = str.replace(regExpWord, "CALL");
  return str;
}

/*
 =========================================================================
 @function name  : posCheck
 @argument       : check str
 @description    : Check position information
 @return         : 
 =========================================================================
*/
function posCheck(str) {
  if (
    str.indexOf("P[") != -1 ||
    str.indexOf(langResource.ihmieditor_order_pos_c + "[") != -1 ||
    str.indexOf("PR[") != -1 ||
    str.indexOf(langResource.ihmieditor_order_posregi_c + "[") != -1
  ) {
    return true;
  } else {
    return false;
  }
}

/*
 =========================================================================
 @function name  : titleIns
 @argument       : title name
 @description    : Give a title
 @return         : none
 =========================================================================
*/
function titleIns(title) {
  if (MODE_ACTION >= MODE_ROBOGUIDE) {
    var content = dtlfrm_contentchk(activeTarget);

    if (title != "" && content != null && content.length != 0) {
      if (content.getElementsByClassName("detail_title").length == 0) {
        var insLabel = document.createElement("div");
        insLabel.classList.add("detail_title");
        var insTitle = document.createElement("span");
        $(insTitle).html(title);
        $(insLabel).prepend(insTitle);

        content.prepend(insLabel);
        $(insTitle).css({
          "font-size": "25px",
        });
        $(insLabel).css({
          position: "relative",
          height: "35px",
          width: insTitle.offsetWidth + 10,
          margin: "5px 0 0 20px",
          "text-align": "center",
          "border-bottom": "solid 2px rgb(0, 0, 0)",
          "line-height": "35px",
        });
      }
    }
  }
}

/*
 =========================================================================
 @function name   : radio_out_initDisp
 @argument[value] : 
 @description     : OUTOPUT radio button display switching
 @return          : none
 =========================================================================
*/
function radio_out_initDisp(value) {
  var dtfrm = document.getElementById(
    get_detail_frm_id(activeTarget)
  ).contentWindow;
  var out_sel = ["do", "ro", "ao", "go", "f", "direct"];
  var radio_sel = dtfrm.document.getElementsByClassName("radio-button-option");
  var regi_textbox_value, ins_textbox_value, disabled_flg, o_type, regiIndexVal;
  for (var radioCnt = 0; radioCnt < radio_sel.length; radioCnt++) {
    /* Checked elements. */
    if (radio_sel[radioCnt].dataset.value == value) {
      disabled_flg = false;
    } else {
      disabled_flg = true;
    }
    /* direct input */
    if (out_sel[radioCnt] == "direct") {
      if (disabled_flg) {
        dtfrm.document
          .getElementById("direct_select")
          .refresh(
            dtfrm.outputComponent[radioCnt]["direct_select"].data,
            "0",
            null,
            disabled_flg
          );
        dtfrm.document
          .getElementById("direct_regi")
          .refresh(
            "1",
            dtfrm.outputComponent[radioCnt]["direct_regi"].length,
            disabled_flg
          );
        dtfrm.document
          .getElementById("direct_ins")
          .refresh(
            "OFF",
            dtfrm.outputComponent[radioCnt]["direct_ins"].length,
            disabled_flg
          );
      } else {
        var selVal = "0";
        for (var cnt in dtfrm.selectOutPutList) {
          var param = split_param_for(g_program_data[activeTarget].param);
          var selChk = new RegExp(dtfrm.selectOutPutList[cnt][0]);
          if (param[0].match(selChk)) {
            selVal = cnt;
            break;
          }
        }
        regi_textbox_value = dtfrm.document
          .getElementById(out_sel[radioCnt] + "_regi")
          .getValue();
        ins_textbox_value = dtfrm.document
          .getElementById(out_sel[radioCnt] + "_ins")
          .getValue();
        dtfrm.document
          .getElementById("direct_select")
          .refresh(
            dtfrm.outputComponent[radioCnt]["direct_select"].data,
            selVal,
            null,
            disabled_flg
          );
        dtfrm.document
          .getElementById("direct_regi")
          .refresh(
            langConvEng(regi_textbox_value),
            dtfrm.outputComponent[radioCnt]["direct_regi"].length,
            disabled_flg
          );
        dtfrm.document
          .getElementById("direct_ins")
          .refresh(
            langConvEng(ins_textbox_value),
            dtfrm.outputComponent[radioCnt]["direct_ins"].length,
            disabled_flg
          );
      }
    } else {
      regi_textbox_value = dtfrm.document
        .getElementById(out_sel[radioCnt] + "_regi")
        .getValue();
      ins_textbox_value = dtfrm.document
        .getElementById(out_sel[radioCnt] + "_ins")
        .getValue();
      dtfrm.document
        .getElementById(out_sel[radioCnt] + "_regi")
        .refresh(
          regi_textbox_value,
          dtfrm.outputComponent[radioCnt][out_sel[radioCnt] + "_regi"].min,
          dtfrm.outputComponent[radioCnt][out_sel[radioCnt] + "_regi"].max,
          disabled_flg
        );
      if (out_sel[radioCnt] == "ao" || out_sel[radioCnt] == "go") {
        dtfrm.document
          .getElementById(out_sel[radioCnt] + "_ins")
          .refresh(
            ins_textbox_value,
            dtfrm.outputComponent[radioCnt][out_sel[radioCnt] + "_ins"].min,
            dtfrm.outputComponent[radioCnt][out_sel[radioCnt] + "_ins"].max,
            disabled_flg
          );
      } else {
        dtfrm.document
          .getElementById(out_sel[radioCnt] + "_ins")
          .refresh(
            dtfrm.outputComponent[radioCnt][out_sel[radioCnt] + "_ins"].data,
            ins_textbox_value,
            null,
            disabled_flg
          );
      }
    }
  }
}

/*
 =========================================================================
 @function name  : radio_wait_selectDisp
 @argument       : none
 @description    : Switch display of wait radio button
 @return         : none
 =========================================================================
*/
function radio_wait_selectDisp(id, type, value) {
  var dtfrm = document.getElementById(
    get_detail_frm_id(activeTarget)
  ).contentWindow;
  var radio_sel = dtfrm.document.getElementsByClassName("radio-button-option");
  var wait_id = ["wait_sec", "wait", "conditionValue"];
  var set_value, disabled_flg;
  for (var w_cnt = 0; w_cnt < radio_sel.length; w_cnt++) {
    if (radio_sel[w_cnt].dataset.value === value) {
      disabled_flg = false;
    } else {
      disabled_flg = true;
    }
    if (radio_sel[w_cnt].dataset.value === "1") {
      set_value = dtfrm.document.getElementById(wait_id[w_cnt]).getValue();
      dtfrm.document
        .getElementById(wait_id[w_cnt])
        .refresh(set_value, "0.0", "327.67", disabled_flg);
    } else if (radio_sel[w_cnt].dataset.value === "2") {
      set_detailCondValue(wait_id[w_cnt], disabled_flg);
      var select_time_val = dtfrm.document
        .getElementById("time_out_option")
        .getValue();
      dtfrm.document
        .getElementById("time_out_option")
        .refresh(null, select_time_val, disabled_flg);
      var select_jump_val = dtfrm.document
        .getElementById("jump_select")
        .getValue();
      var time_out_val = dtfrm.document.getElementById("time_out").getValue();
      dtfrm.document
        .getElementById("time_out")
        .refresh(time_out_val, "0.0", "327.67", disabled_flg);
      var array = [];
      for (var listCnt in g_labelNumList) {
        array[listCnt] = g_labelNumList[listCnt].toString(10);
      }
      dtfrm.document
        .getElementById("jump_select")
        .refresh(array, select_jump_val, null, disabled_flg);
    } else {
      set_value = dtfrm.document.getElementById(wait_id[w_cnt]).getValue();
      dtfrm.document
        .getElementById(wait_id[w_cnt])
        .refresh(set_value, 255, disabled_flg);
    }
  }
}

/*
 =========================================================================
 @function name   : radio_if_initDisp
 @argument[value] : Select value
 @description     : Switch display of wait radio button
 @return          : none
 =========================================================================
*/
function radio_if_initDisp(value) {
  var dtfrm = document.getElementById(
    get_detail_frm_id(activeTarget)
  ).contentWindow;
  var radio_sel = dtfrm.document.getElementsByClassName("radio-button-option");
  var if_id = ["if", "conditionValue"];
  var set_value, disabled_flg;
  for (var cnt = 0; cnt < radio_sel.length; cnt++) {
    if (radio_sel[cnt].dataset.value === value) {
      disabled_flg = false;
    } else {
      disabled_flg = true;
    }
    if (radio_sel[cnt].dataset.value === "1") {
      set_detailCondValue(if_id[cnt], disabled_flg);
    } else {
      set_value = dtfrm.document.getElementById(if_id[cnt]).getValue();
      dtfrm.document
        .getElementById(if_id[cnt])
        .refresh(set_value, 255, disabled_flg);
    }
  }
}

/*
 =========================================================================
 @function name   : radio_regi_initDisp
 @argument[value] : Select value
 @description     : Switch display of wait radio button
 @return          : none
 =========================================================================
*/
function radio_regi_initDisp(value) {
  var dtfrm = document.getElementById(
    get_detail_frm_id(activeTarget)
  ).contentWindow;
  var radio_sel = dtfrm.document.getElementsByClassName("radio-button-option");
  var regi_id = ["regi", "regi_val"];
  var set_value, disabled_flg;
  for (var cnt = 0; cnt < radio_sel.length; cnt++) {
    if (radio_sel[cnt].dataset.value === value) {
      disabled_flg = false;
    } else {
      disabled_flg = true;
    }
    if (radio_sel[cnt].dataset.value === "1") {
      set_value = dtfrm.document.getElementById("regi_index").getValue();
      dtfrm.document
        .getElementById("regi_index")
        .refresh(
          set_value,
          g_regIOlimit_val[ORDER_REGI].min,
          g_regIOlimit_val[ORDER_REGI].max,
          disabled_flg
        );
      set_value = dtfrm.document.getElementById("regi_val_select").getValue();
      dtfrm.document
        .getElementById("regi_val_select")
        .refresh(
          dtfrm.regComponent["regi_val_select"].data,
          set_value,
          null,
          disabled_flg
        );
      var selVal =
        set_value == dtfrm.selectRegiValList[0][1]
          ? ORDER_REGI
          : dtfrm.selectRegiValList[set_value][0];
      set_value = dtfrm.document.getElementById("regi_val_index").getValue();
      dtfrm.document
        .getElementById("regi_val_index")
        .refresh(
          set_value,
          g_regIOlimit_val[selVal].min,
          g_regIOlimit_val[selVal].max,
          disabled_flg
        );
      set_value = dtfrm.document.getElementById("regi_val_const").getValue();
      dtfrm.document
        .getElementById("regi_val_const")
        .refresh(
          set_value,
          dtfrm.regComponent["regi_val_const"].min,
          dtfrm.regComponent["regi_val_const"].max,
          disabled_flg
        );
    } else {
      set_value = dtfrm.document.getElementById("regi").getValue();
      dtfrm.document
        .getElementById("regi")
        .refresh(langConvEng(set_value), 255, disabled_flg);
      set_value = dtfrm.document.getElementById("regi_val").getValue();
      dtfrm.document
        .getElementById("regi_val")
        .refresh(langConvEng(set_value), 255, disabled_flg);
    }
  }
}

/*
 =========================================================================
 @function name         : set_detailCondValue
 @argument[kind]        : Instruction kind
 @argument[disabledFlg] : Enable/Disable the input area.(true:disable/false:enable)
 @description           : Switch display of wait radio button
 @return                : none
 =========================================================================
*/
function set_detailCondValue(kind, disabledFlg) {
  var dtfrm = document.getElementById(
    get_detail_frm_id(activeTarget)
  ).contentWindow;

  set_value = dtfrm.document
    .getElementById(kind + ".variable_select")
    .getValue();
  dtfrm.document
    .getElementById(kind + ".variable_select")
    .refresh(
      dtfrm.componentList[0][".variable_select"],
      set_value,
      null,
      disabledFlg
    );
  var selVal = langConvEng(
    dtfrm.componentList[dtfrm.IDX_SELECT][".variable_select"][set_value][0]
  );
  set_value = dtfrm.document
    .getElementById(kind + ".variable_index")
    .getValue();
  dtfrm.document
    .getElementById(kind + ".variable_index")
    .refresh(
      set_value,
      g_regIOlimit_val[selVal].min,
      g_regIOlimit_val[selVal].max,
      disabledFlg
    );
  set_value = dtfrm.document
    .getElementById(kind + ".operator_select1")
    .getValue();
  dtfrm.document
    .getElementById(kind + ".operator_select1")
    .refresh(
      dtfrm.componentList[0][".operator_select1"],
      set_value,
      null,
      disabledFlg
    );
  set_value = dtfrm.document
    .getElementById(kind + ".operator_select2")
    .getValue();
  dtfrm.document
    .getElementById(kind + ".operator_select2")
    .refresh(
      dtfrm.componentList[0][".operator_select2"],
      set_value,
      null,
      disabledFlg
    );
  var set_value1 = dtfrm.document
    .getElementById(kind + ".value_select1")
    .getValue();
  dtfrm.document
    .getElementById(kind + ".value_select1")
    .refresh(
      dtfrm.componentList[0][".value_select1"],
      set_value1,
      null,
      disabledFlg
    );
  var set_value2 = dtfrm.document
    .getElementById(kind + ".value_select2")
    .getValue();
  dtfrm.document
    .getElementById(kind + ".value_select2")
    .refresh(
      dtfrm.componentList[0][".value_select2"],
      set_value2,
      null,
      disabledFlg
    );
  /* '.value_select1' is displayed, and "REGI" is selected. */
  if (
    dtfrm.document.getElementById(kind + ".value_select1").style.display ==
      "block" &&
    set_value1 == "1"
  ) {
    selVal =
      dtfrm.componentList[dtfrm.IDX_SELECT][".value_select1"][set_value1][0];
  } else if (
    /* '.value_select2' is displayed, and all other options except "ON" and "OFF" are selected. */
    dtfrm.document.getElementById(kind + ".value_select2").style.display ==
      "block" &&
    set_value2 != "0" &&
    set_value2 != "1"
  ) {
    selVal =
      dtfrm.componentList[dtfrm.IDX_SELECT][".value_select2"][set_value2][0];
  } else {
    /* Set a temporary value. */
    selVal = ORDER_REGI;
  }
  set_value = dtfrm.document.getElementById(kind + ".value_index").getValue();
  dtfrm.document
    .getElementById(kind + ".value_index")
    .refresh(
      set_value,
      g_regIOlimit_val[selVal].min,
      g_regIOlimit_val[selVal].max,
      disabledFlg
    );
  set_value = dtfrm.document.getElementById(kind + ".value_const").getValue();
  dtfrm.document
    .getElementById(kind + ".value_const")
    .refresh(
      set_value,
      dtfrm.componentList[1][".value_const"].min,
      dtfrm.componentList[1][".value_const"].max,
      disabledFlg
    );
}

/*
 =========================================================================
 @function name : radio_wait_selectCheck
 @argument[]    : none
 @description   : WAIT : Determine which radio button to select.
 @return        : none
 =========================================================================
*/
var WAIT_COND_TIME = "1";
var WAIT_COND_SEL = "2";
var WAIT_COND_DIRECT = "3";
function radio_wait_selectCheck(param) {
  var ret = WAIT_COND_DIRECT;
  var chk_str = new RegExp(
    "(" +
      ORDER_POSREGI +
      "|PR|" +
      ORDER_TIMER_OF +
      "|TIMER_OVERFLOW" +
      "|" +
      ORDER_TIMER +
      "|TIMER" +
      "| " +
      ORDER_AND +
      " | " +
      ORDER_OR +
      " | AND | OR | DIV | MOD |\\$|\\+|\\-|\\*|\\/)",
    "g"
  );
  if (param.length < 3) {
    /* The standby condition is seconds. */
    if (param.length == 1 && param[0].match(/(sec|\(sec\))$/)) {
      param[0] = param[0].replace(/(sec|\(sec\))/, "");
      /* An integer greater than or equal to 0, or to two decimal places. */
      if (param[0].match(/^([0-9]\d*)(\.\d{2}|\.\d{1})?$/)) {
        ret = WAIT_COND_TIME;
        /* Decimal point adjustment. */
        if (param[0].match(/^([0-9]\d*)(\.\d{1})?$/)) {
          g_program_data[activeTarget].param =
            Number(param[0]).toFixed(2) + "(sec)";
        }
      }
    }
  } else {
    param[0] = outputComment_del(param[0]);
    if (param[2].match(chk_str) == null) {
      var onoffchk = new RegExp(
        "^(\\d+|" +
          ORDER_ON +
          "|" +
          ORDER_OFF +
          ")" +
          "(\\s" +
          ORDER_TIMEOUT +
          ")?"
      );
      if (
        cond_variableselectCheck(param[0]) &&
        (cond_variableselectCheck(param[2]) || param[2].match(onoffchk))
      ) {
        ret = WAIT_COND_SEL;
      }
    }
  }
  return ret;
}

/*
 =========================================================================
 @function name : radio_if_selectCheck
 @argument[]    : none
 @description   : IF : Determine which radio button to select.
 @return        : none
 =========================================================================
*/
var IF_COND_SEL = "1";
var IF_COND_DIRECT = "2";
function radio_if_selectCheck(param) {
  var ret = IF_COND_DIRECT;
  var chk_str = new RegExp(
    "(" +
      ORDER_POSREGI +
      "|PR|" +
      ORDER_TIMER_OF +
      "|TIMER_OVERFLOW" +
      "|" +
      ORDER_TIMER +
      "|TIMER" +
      "| " +
      ORDER_AND +
      " | " +
      ORDER_OR +
      " | AND | OR | DIV | MOD |\\$|\\+|\\-|\\*|\\/)",
    "g"
  );
  if (param.length > 2) {
    param[0] = outputComment_del(param[0]);
    if (param[2].match(chk_str) == null) {
      if (
        cond_variableselectCheck(param[0]) &&
        (cond_variableselectCheck(param[2]) ||
          param[2].replace(/[0-9]/g, "") === "" ||
          param[2] == ORDER_ON ||
          param[2] == ORDER_OFF)
      ) {
        ret = IF_COND_SEL;
      }
    }
  }
  return ret;
}

/*
 =========================================================================
 @function name   : radio_regi_selectCheck
 @argument[param] : Left and right side parameters.
 @description     : REGI : Determine which radio button to select.
 @return          : Results of the judgment.
 =========================================================================
*/
var REGI_COND_SEL = "1";
var REGI_COND_DIRECT = "2";
function radio_regi_selectCheck(param) {
  var ret = REGI_COND_SEL;
  var chkLeftStr = new RegExp(
    "^(" +
      ORDER_REGI +
      "|R)\\[(" +
      ORDER_REGI +
      "|" +
      ORDER_ARGUMENT +
      "|R|AR)\\["
  );
  var regi_replace_str = new RegExp(
    "^(" + ORDER_REGI + "|R)" + "\\[|\\]$",
    "g"
  );
  var chkRightStr = new RegExp(
    "^(" +
      ORDER_CONSTANT +
      "|(" +
      ORDER_REGI +
      "|R|AO|AI|GO|GI|DO|DI|RO|RI|SO|SI|UO|UI)\\[)"
  );
  var indirectStr = new RegExp(
    "(" + ORDER_REGI + "|" + ORDER_ARGUMENT + "|R|AR)\\["
  );
  var chk_str = new RegExp(
    "(" +
      ORDER_TIMER_OF +
      "|TIMER_OVERFLOW" +
      "|" +
      ORDER_TIMER +
      "|TIMER|DIV|MOD|" +
      ORDER_POSREGI +
      "|PR|\\$|\\+|\\-|\\*|\\/)",
    "g"
  );

  if (param[0].match(chkLeftStr)) {
    ret = REGI_COND_DIRECT;
  } else {
    if (param[0].replace(/[^0-9]/g, "") === "") {
      param[0] = "0";
    } else {
      param[0] = outputComment_del(param[0]).replace(regi_replace_str, "");
      if (param[0].replace(/[0-9]/g, "") !== "") {
        ret = REGI_COND_DIRECT;
      }
    }
  }

  var rightParam = param[1].split(/\s+/);

  if (rightParam.length > 1 || param[1].match(chk_str)) {
    return REGI_COND_DIRECT;
  }

  if (ret === REGI_COND_SEL) {
    param[1] = outputComment_del(param[1]);
    var matchResult = param[1].match(chkRightStr);
    if (param[1].replace(/[0-9]/g, "") === "") {
      ret = REGI_COND_SEL;
    } else if (matchResult) {
      var chkStr = param[1].replace(matchResult[0], "");
      ret =
        chkStr.match(indirectStr) == null ? REGI_COND_SEL : REGI_COND_DIRECT;
    } else {
      ret = REGI_COND_DIRECT;
    }
  }
  return ret;
}

/*
 =========================================================================
 @function name : cond_variableselectCheck
 @argument[str] : Check string
 @description   : WAIT : Determine which radio button to select.
 @return        : none
 =========================================================================
*/
function cond_variableselectCheck(str) {
  var ret = false;
  var chkStr = new RegExp(
    "(" + ORDER_REGI + "|AO|AI|GO|GI|DO|DI|RO|RI|SO|SI|UO|UI|F)\\["
  );
  var chkIndirectStr = new RegExp(
    "(" +
      ORDER_LABEL +
      "|" +
      ORDER_REGI +
      "|R|AO|AI|GO|GI|DO|DI|RO|RI|SO|SI|UO|UI|F)\\[(" +
      ORDER_REGI +
      "|" +
      ORDER_ARGUMENT +
      "|R|AR)\\["
  );
  var notChkStr = new RegExp("(" + ORDER_STRREGI + ")\\[");
  var timeChkStr = new RegExp(
    "^\\d+\\s" + ORDER_TIMEOUT + "\\," + ORDER_LABEL + "\\["
  );
  if (
    (str.match(notChkStr) == null &&
      str.match(chkStr) &&
      str.match(chkIndirectStr) == null) ||
    (str.match(timeChkStr) && str.match(chkIndirectStr) == null)
  ) {
    ret = true;
  }
  return ret;
}

/*
 =========================================================================
 @function name   : labelNumDupChk
 @argument[id]    : 
 @argument[type]  : 
 @argument[value] : 
 @description     : 
 @return          : none
 =========================================================================
*/
function labelNumDupChk(id, type, value) {
  var dtfrm = document.getElementById(
    get_detail_frm_id(activeTarget)
  ).contentWindow;
  var result = g_labelNumList.indexOf(parseInt(value));
  /* No numbers in the array. */
  if (result === -1) {
    dtfrm.document.getElementById(id).style.color = "rgb(0, 0, 0)";
    detailFix(id, type, value);
  } else {
    dtfrm.document.getElementById(id).style.color = "rgb(230, 0, 18)";
  }
}

/*
 =========================================================================
 @function name  : getAddMotion
 @argument[id]   : 
 @description    : 
 @return         : str
 =========================================================================
*/
function getAddMotion(id) {
  var prgArr = [];
  var roopEndNum = g_program_data[id].array_num;
  var bktName = [];
  var bktEnd = [];
  var bktNest = 0;
  var prgArr = [];
  Object.keys(g_program_data).forEach(function (key) {
    prgArr[g_program_data[key].array_num] = g_program_data[key];
    prgArr[g_program_data[key].array_num].id = key;
  });
  for (var idx = 0; idx < roopEndNum; idx++) {
    if (
      stretchOrder_idStrChk(STRETCH_ID_CHK_LEAD, prgArr[idx].id) === true &&
      typeof g_xml_data[prgArr[idx].iconNo] != "undefined"
    ) {
      if (g_inst_obj[g_xml_data[prgArr[idx].iconNo][2]].type == "admBracket") {
        bktName[bktNest] = [];
        bktName[bktNest][0] = prgArr[idx].id;
        bktName[bktNest][1] = prgArr[idx].iconNo;
        bktEnd[bktNest] = get_stretchOrder_pairId(
          bktName[bktNest][0],
          REQ_ID_KIND_END,
          null
        );
        bktNest++;
      }
    }

    if (bktEnd[bktNest - 1] == prgArr[idx].id) {
      bktNest--;
      bktName[bktNest][0] = "";
      bktName[bktNest][1] = "";
      bktEnd[bktNest] = "";
    }
  }
  if (bktNest > 0) {
    if (g_program_data[bktName[bktNest - 1][0]].param.match(/\(/)) {
      //			var paramStart = g_program_data[bktName[bktNest-1][0]].param.indexOf( "(" );
      //			var paramEnd = g_program_data[bktName[bktNest-1][0]].param.lastIndexOf( ")" );
      //			var pramStr = g_program_data[bktName[bktNest-1][0]].param.substring( paramStart+1,paramEnd  );
      var str = g_inst_obj[g_xml_data[bktName[bktNest - 1][1]][2]].addParam;
    } else {
      var str = g_inst_obj[g_xml_data[bktName[bktNest - 1][1]][2]].addParam;
    }
  } else {
    var str = "";
  }
  if (id.replace(/[0-9]/g, "") == "kakujiku") {
    var regExpWord = new RegExp(langResource.ihmieditor_order_wjnt_c, "g");
    str = str.replace(regExpWord, "");
  }
  return str;
}

/*
 =========================================================================
 @function name  : split_param
 @argument       : str_data
 @description    : Parse a string
 @return         : spl_data
 =========================================================================
*/
function split_param(str_data) {
  var spl_data = str_data.split(/=/);
  return spl_data;
}
/*
 =========================================================================
 @function name  : split_param_for
 @argument       : str_data
 @description    : Parsing roop strings
 @return         : Split data.
 =========================================================================
*/
function split_param_for(str_data) {
  var retArray = [];
  var tmpStrArray = param_combineCheck("", str_data.split(/(=)/));
  retArray.push(tmpStrArray[0], tmpStrArray[1]);
  if (tmpStrArray[2].indexOf(" DOWNTO ") == -1) {
    var spl_data = tmpStrArray[2].split(/(\sTO\s)/);
  } else {
    var spl_data = tmpStrArray[2].split(/(\sDOWNTO\s)/);
  }
  return retArray.concat(spl_data);
}

/*
 =========================================================================
 @function name  : split_param_call
 @argument       : str_data
 @description    : Parsing call program strings
 @return         : spl_data
 =========================================================================
*/
function split_param_call(str_data) {
  var spl_data = str_data.split(/\(/);
  var length = spl_data.length;
  if (length > 2) {
    for (var num = 2; num < length; num++) {
      spl_data[1] = spl_data[1] + "(" + spl_data[2];
      spl_data.splice(2, 1);
    }
  }
  return spl_data;
}

/*
 =========================================================================
 @function name  : split_param_wait
 @argument       : str_data
 @description    : Parse a string
 @return         : spl_data
 =========================================================================
*/
function split_param_wait(str_data) {
  var spl_data = str_data.split(/(<>|>=|<=|>|=|<)/);
  return spl_data;
}

/*
 =========================================================================
 @function name    : posInitCompleteCallback
 @argument[cbArgs] : 
 @description      : Callback function of Position data initialization completion.
                   : (Because initialization (refresh) takes time)
 @return           : none
 =========================================================================
*/
function posInitCompleteCallback(cbArgs) {
  // If there is any processing you want to do after refreshing the position data, please add it here.
  // cbArgs.elem.drawPosition(cbArgs.posNumber, cbArgs.posFrame);
}

/*
 =========================================================================
 @function name  : split_OptionParam
 @argument       : 
 @description    : 
 @return         : Option array
 =========================================================================
*/
function split_OptionParam() {
  var chkStr = new RegExp(
    "(" +
      langResource.ihmieditor_order_ta_c +
      "|" +
      langResource.ihmieditor_order_tb_c +
      "|" +
      langResource.ihmieditor_order_db_c +
      ")"
  );
  var chkRegiStr = new RegExp(
    "^(" +
      ORDER_REGI +
      "|" +
      ORDER_POSREGI +
      "|" +
      ORDER_ARGUMENT +
      "|AR|PR|R)\\["
  );
  var optStr = g_program_data[activeTarget].param.split(/\s+/);
  if (optStr.length > 1) {
    if (optStr[0] === "") optStr.splice(0, 1);
    if (optStr[optStr.length - 1] === "") optStr.splice(optStr.length - 1, 1);
  }
  for (var cnt = 0; cnt < optStr.length; cnt++) {
    if (
      optStr[cnt + 1] != undefined &&
      (optStr[cnt + 1].match(chkRegiStr) ||
        optStr[cnt + 1].match(/(mm|sec)/) ||
        optStr[cnt + 1] == "...")
    ) {
      optStr[cnt] = optStr[cnt] + " " + optStr[cnt + 1];
      optStr.splice(cnt + 1, 1);
      cnt -= 1;
    }
  }
  for (var cnt = 0; cnt < optStr.length; cnt++) {
    if (optStr[cnt].match(chkStr)) {
      if (optStr[cnt + 1] != undefined) {
        var chkCall = new RegExp(langResource.ihmieditor_order_call_c + "$");
        if (optStr[cnt].match(chkCall)) {
          optStr[cnt] = optStr[cnt] + " " + optStr[cnt + 1];
          optStr.splice(cnt + 1, 1);
        }
      }
    } else if (optStr[cnt] === "PR_CALL" || optStr[cnt] === "RampTo(") {
      var cmbStr =
        optStr[cnt] === "PR_CALL" ? " " + optStr[cnt + 1] : optStr[cnt + 1];
      optStr[cnt] = optStr[cnt] + cmbStr;
      optStr.splice(cnt + 1, 1);
    } else {
      /* Check the contents of the split. */
      var chkList = [ORDER_WELDSTART.split(/\s+/), ORDER_WELDEND.split(/\s+/)];
      var chkResult = chkList.filter(function (data) {
        return optStr[cnt] == data[0];
      });
      if (chkResult.length > 0) {
        for (var addcnt = 0; addcnt < chkResult.length; addcnt++) {
          var chkWeldStr = new RegExp("^" + chkResult[addcnt][1] + "\\[");
          if (optStr[cnt + 1].match(chkWeldStr)) {
            optStr[cnt] = optStr[cnt] + " " + optStr[cnt + 1];
            optStr.splice(cnt + 1, 1);
            break;
          }
        }
      }
    }
  }
  return optStr;
}

/*
 =========================================================================
 @function name         : convertPositionGridToArray
 @argument[posElem]     : 
 @argument[posGridData] : 
 @description           : 
 @return                : posCompoArray
 =========================================================================
*/
function convertPositionGridToArray(posElem, posGridData) {
  var posCompoArray = [];
  for (var posIndex = 0; posIndex < posGridData.length; posIndex++) {
    var posGridElem = posGridData[posIndex];
    var posCompoElem = {};
    posCompoElem.comment =
      posGridElem.Comment == undefined ? "" : posGridElem.Comment;
    posCompoElem.posNumber = posGridElem.posNumber;
    var posDataGrp = posGridElem.posData[0]; // Group 1
    var posCompoGrp = top.createNewPosElement(); // irprog_api
    posCompoGrp.group = posDataGrp.groupNumber;
    posCompoGrp.frame = posDataGrp.configStr == undefined ? 1 : 0;
    posCompoGrp.conf =
      posDataGrp.configStr == undefined ? "" : posDataGrp.configStr;
    posCompoGrp.uf = posDataGrp.ufVal;
    posCompoGrp.ut = posDataGrp.utVal;
    var posGridKey = posDataGrp.poskey;
    for (var keyIndex = 0; keyIndex < posGridKey.length; keyIndex++) {
      var targetKey = posGridKey[keyIndex];
      var targetVal = targetKey.val;
      switch (targetKey.key.toUpperCase()) {
        case "X":
          posCompoGrp.cart.X = targetVal;
          break;
        case "Y":
          posCompoGrp.cart.Y = targetVal;
          break;
        case "Z":
          posCompoGrp.cart.Z = targetVal;
          break;
        case "W":
          posCompoGrp.cart.W = targetVal;
          break;
        case "P":
          posCompoGrp.cart.P = targetVal;
          break;
        case "R":
          posCompoGrp.cart.R = targetVal;
          break;
        case "J1":
          posCompoGrp.joint.J1 = targetVal;
          break;
        case "J2":
          posCompoGrp.joint.J2 = targetVal;
          break;
        case "J3":
          posCompoGrp.joint.J3 = targetVal;
          break;
        case "J4":
          posCompoGrp.joint.J4 = targetVal;
          break;
        case "J5":
          posCompoGrp.joint.J5 = targetVal;
          break;
        case "J6":
          posCompoGrp.joint.J6 = targetVal;
          break;
        case "EXT1":
          posCompoGrp.ext.E1 = targetVal;
          break;
        case "EXT2":
          posCompoGrp.ext.E2 = targetVal;
          break;
        case "EXT3":
          posCompoGrp.ext.E3 = targetVal;
          break;
      }
    }
    posCompoElem.group = [];
    posCompoElem.group[0] = posCompoGrp;
    posCompoArray[posIndex] = posCompoElem;
  }
  return posCompoArray;
}

/*
 =========================================================================
 @function name    : detailFix
 @argument[event]  : 
 @description      : Details tab Final processing
 @return           : none
 =========================================================================
*/
function detailFix(id, type, value) {
  //Position and position register switching events
  if (id === "robotPos.selposkind") {
    return;
  }
  if (activeTarget == "") return;
  var errChk = false;
  var setParam = "";
  var record_data = {
    id: "",
    lineNum: g_program_data[activeTarget].array_num + 1,
    contents: g_program_data[activeTarget],
    param1: {},
    param2: {},
    elem: id,
    type: OPERATION_EDIT,
  };
  if (Object.keys(save_failed_data).length) {
    $.extend(true, record_data.param1, save_failed_data);
  } else {
    $.extend(true, record_data.param1, g_program_data[activeTarget]);
  }
  switch (g_program_data[activeTarget].iconNo) {
    case ICON_NO_KAKUJIKU:
      // case ICON_NO_VSN_JOINT:
      setParam = document.getElementById("detail_1");
      break;
    case ICON_NO_STRAIGHT:
      setParam = document.getElementById("detail_2");
      break;
    case ICON_NO_CIRCULAR:
      setParam = document.getElementById("detail_23");
      break;
    case ICON_NO_MACRO:
      setParam = document.getElementById("detail_3");
      break;
    case ICON_NO_CALL:
      setParam = document.getElementById("detail_4");
      break;
    case ICON_NO_WAIT:
      setParam = document.getElementById("detail_5");
      break;
    case ICON_NO_REGI:
      setParam = document.getElementById("detail_6");
      break;
    case ICON_NO_FOR:
      setParam = document.getElementById("detail_7");
      break;
    case ICON_NO_OUTPUT:
      setParam = document.getElementById("detail_8");
      break;
    case ICON_NO_VSN_LINE:
      setParam = document.getElementById("detail_9");
      // setParam = document.getElementById('detail_2');
      break;
    case ICON_NO_JUMP:
      setParam = document.getElementById("detail_10");
      break;
    case ICON_NO_LABEL:
      setParam = document.getElementById("detail_11");
      break;
    case ICON_NO_IF:
      setParam = document.getElementById("detail_12");
      break;
    case ICON_NO_COMMENT:
      setParam = document.getElementById("detail_13");
      break;
    case ICON_NO_NOSUPPORT:
      setParam = document.getElementById("detail_14");
      break;
    case ICON_NO_PAYLOAD:
      setParam = document.getElementById("detail_15");
      break;
    case ICON_NO_ARC_LINE:
      setParam = document.getElementById("detail_19");
      break;
    case ICON_NO_ARC_CIRCLE:
      setParam = document.getElementById("detail_20");
      break;
    case ICON_NO_NOCONNECT:
      setParam = document.getElementById("detail_21");
      break;
    case ICON_NO_VSN_JOINT:
      setParam = document.getElementById("detail_22");
      break;
    case ICON_NO_LASER_PRE:
      setParam = document.getElementById("detail_24");
      break;
    case ICON_NO_LASER_LS:
      setParam = document.getElementById("detail_25");
      break;
    case ICON_NO_LASER_LE:
      setParam = document.getElementById("detail_26");
      break;
    case ICON_NO_LASER_PWC:
      setParam = document.getElementById("detail_27");
      break;
    case ICON_NO_LASER_PRE_SI:
      setParam = document.getElementById("detail_28");
      break;
    case ICON_NO_LASER_LS_SI:
      setParam = document.getElementById("detail_29");
      break;
    case ICON_NO_LASER_LE_SI:
      setParam = document.getElementById("detail_30");
      break;
    case ICON_NO_WELD_START_MO:
      setParam = document.getElementById("detail_31");
      break;
    case ICON_NO_ARC_STOP_MO:
      setParam = document.getElementById("detail_32");
      break;
    case ICON_NO_WELD_START_AL:
      setParam = document.getElementById("detail_33");
      break;
    case ICON_NO_ARC_STOP_AL:
      setParam = document.getElementById("detail_34");
      break;
    case ICON_NO_SET_UFRAME:
      setParam = document.getElementById("detail_35");
      break;
    case ICON_NO_SET_UTOOL:
      setParam = document.getElementById("detail_36");
      break;
    case ICON_NO_SEL_UFRAME:
      setParam = document.getElementById("detail_37");
      break;
    case ICON_NO_SEL_UTOOL:
      setParam = document.getElementById("detail_38");
      break;

    case ICON_NO_LASER_K_PRE:
      setParam = document.getElementById("detail_39");
      break;
    case ICON_NO_LASER_K_LS:
      setParam = document.getElementById("detail_40");
      break;
    case ICON_NO_LASER_K_LE:
      setParam = document.getElementById("detail_41");
      break;

    case ICON_NO_LASER_WIRC:
      setParam = document.getElementById("detail_42");
      break;

    default:
      break;
  }

  if (setParam !== null && setParam !== "") {
    /* Store in g_program_data */
    data_before_change = JSON.parse(
      JSON.stringify(g_program_data[activeTarget])
    );
    if (fixDataSave_g_program(setParam, id, type, value)) {
      $.extend(true, record_data.param2, g_program_data[activeTarget]);
      timeline_record.array_add(record_data);
      check_undoredo_active();
      stretchdata_record.array_add(g_stretchOrder_data);
      position_record.array_add(position);
      positionregi_record.array_add(g_position_regi);
      if (chk_execSave_tporder(id, type)) {
        write_mode = 0;
        save_tporder(
          activeTarget,
          write_mode,
          save_tporder_callback,
          activeTarget
        );
      }
    }
  }
}

/*
 =========================================================================
 @function name  : chk_execSave_tporder
 @argument[id]   : Operated element ID
 @argument[type] : Type of operation
 @description    : 
 @return         : 
 =========================================================================
*/
function chk_execSave_tporder(id, type) {
  var save = true;
  var noSaveTbl = [{ condition: type == "altframe" }];
  for (var i in noSaveTbl) {
    if (noSaveTbl[i].condition) {
      save = false;
      break;
    }
  }
  return save;
}

var data_before_change = {};

/*
 =========================================================================
 @function name  : posFix
 @argument       : none
 @description    : Store value to position
 @return         : none
 =========================================================================
*/

function posFix(bktEndId) {
  var positionNo = null;
  var pos_kind = "";
  var totalPosCnt = 0;
  var activePrgName = "";
  var dtfrm = document.getElementById(
    get_detail_frm_id(activeTarget)
  ).contentWindow;
  var robotPos = $(document.getElementById(get_detail_frm_id(activeTarget)))
    .contents()
    .find(".position");
  var mltPosStock = {};

  if (typeof bktEndId != "undefined") {
    activePrgName = bktEndId;
    totalPosCnt += g_program_data[activeTarget].position.length;
  } else {
    activePrgName = activeTarget;
  }
  for (
    var posNumCnt = 0;
    posNumCnt < g_program_data[activePrgName].position.length;
    posNumCnt++
  ) {
    if (typeof robotPos[totalPosCnt] != "undefined") {
      pos_kind = dtfrm.document
        .getElementById(robotPos[totalPosCnt].id)
        .getCurrentPosKind();
    } else {
      /*When component does not exist, processing of position is unnecessary */
      continue;
    }
    switch (pos_kind) {
      case POSKIND_POSNUM:
        dtfrm.document
          .getElementById(robotPos[totalPosCnt].id)
          .getPositionMulti(
            dtfrm.document
              .getElementById(robotPos[totalPosCnt].id)
              .getCurrentPosNumber(),
            true,
            getPositionMultiCB,
            null
          );
        var posDataList = JSON.parse(JSON.stringify(mltPosStock));
        var posDataListArr = Object.keys(posDataList);

        // search target position data
        positionNo = null;
        for (var i = 0; i < position.length; i++) {
          if (
            position[i].posNumber == posDataList[posDataListArr[0]].posNumber
          ) {
            positionNo = i;
            break;
          }
        }
        if (positionNo === null) {
          positionNo = position.length;
          position[positionNo] = make_position_data(posDataListArr[0].group);
        }
        position[positionNo].posNumber = Number(
          posDataList[posDataListArr[0]].posNumber
        );
        position[positionNo].Comment = posDataList[posDataListArr[0]].comment;

        // search target position data (group)
        for (key in posDataList) {
          var posData = posDataList[key];
          var posDataIdx = null;
          for (var j = 0; j < position[positionNo].posData.length; j++) {
            if (position[positionNo].posData[j].groupNumber == posData.group) {
              posDataIdx = j;
              break;
            }
          }
          if (posDataIdx === null) {
            posDataIdx = position[positionNo].posData.length;
            position[positionNo].posData[posDataIdx] = { poskey: [] };
          }
          if (posData.rep != FORMAT_JOINT) {
            position[positionNo].posData[posDataIdx].poskey[0] = {
              key: "X",
              val: posData.cart.X,
            };
            position[positionNo].posData[posDataIdx].poskey[1] = {
              key: "Y",
              val: posData.cart.Y,
            };
            position[positionNo].posData[posDataIdx].poskey[2] = {
              key: "Z",
              val: posData.cart.Z,
            };
            position[positionNo].posData[posDataIdx].poskey[3] = {
              key: "W",
              val: posData.cart.W,
            };
            position[positionNo].posData[posDataIdx].poskey[4] = {
              key: "P",
              val: posData.cart.P,
            };
            position[positionNo].posData[posDataIdx].poskey[5] = {
              key: "R",
              val: posData.cart.R,
            };
            position[positionNo].posData[posDataIdx].configStr = posData.conf;
          } else {
            position[positionNo].posData[posDataIdx].poskey[0] = {
              key: "J1",
              val: posData.joint.J1,
            };
            position[positionNo].posData[posDataIdx].poskey[1] = {
              key: "J2",
              val: posData.joint.J2,
            };
            position[positionNo].posData[posDataIdx].poskey[2] = {
              key: "J3",
              val: posData.joint.J3,
            };
            position[positionNo].posData[posDataIdx].poskey[3] = {
              key: "J4",
              val: posData.joint.J4,
            };
            position[positionNo].posData[posDataIdx].poskey[4] = {
              key: "J5",
              val: posData.joint.J5,
            };
            position[positionNo].posData[posDataIdx].poskey[5] = {
              key: "J6",
              val: posData.joint.J6,
            };
            position[positionNo].posData[posDataIdx].configStr = "";
          }
          position[positionNo].posData[posDataIdx].ufVal = posData.uf;
          position[positionNo].posData[posDataIdx].utVal = posData.ut;
          position[positionNo].posData[posDataIdx].groupNumber = Number(
            posData.group
          );

          position[positionNo].posData[posDataIdx].poskey[6] = {
            key: "EXT1",
            val: posData.ext.E1,
          };
          position[positionNo].posData[posDataIdx].poskey[7] = {
            key: "EXT2",
            val: posData.ext.E2,
          };
          position[positionNo].posData[posDataIdx].poskey[8] = {
            key: "EXT3",
            val: posData.ext.E3,
          };
        }
        break;
      case POSKIND_POSREGI:
        var posData = dtfrm.document
          .getElementById(robotPos[totalPosCnt].id)
          .getPosRegister();
        var index = get_g_position_regi_index(posData.group, posData.posRegNum);
        if (!g_position_regi[index]) {
          g_position_regi[index] = [];
        }
        if (!posData.empty) {
          if ([FORMAT_CART, FORMAT_CART_ADD].includes(posData.rep)) {
            //crt
            g_position_regi[index].P = posData.cart.P;
            g_position_regi[index].R = posData.cart.R;
            g_position_regi[index].W = posData.cart.W;
            g_position_regi[index].X = posData.cart.X;
            g_position_regi[index].Y = posData.cart.Y;
            g_position_regi[index].Z = posData.cart.Z;
          } else if (posData.rep == 9) {
            //joint
            g_position_regi[index].Config = posData.conf;
            g_position_regi[index].J1 = {
              data: posData.joint.J1,
              unit: getJointUnitStr(posData.group, 0),
            };
            g_position_regi[index].J2 = {
              data: posData.joint.J2,
              unit: getJointUnitStr(posData.group, 1),
            };
            g_position_regi[index].J3 = {
              data: posData.joint.J3,
              unit: getJointUnitStr(posData.group, 2),
            };
            g_position_regi[index].J4 = {
              data: posData.joint.J4,
              unit: getJointUnitStr(posData.group, 3),
            };
            g_position_regi[index].J5 = {
              data: posData.joint.J5,
              unit: getJointUnitStr(posData.group, 4),
            };
            g_position_regi[index].J6 = {
              data: posData.joint.J6,
              unit: getJointUnitStr(posData.group, 5),
            };
          } else {
          }
          var axes_num = getExtendAxesCount();
          for (var axes_cnt = 1; axes_cnt <= axes_num; axes_cnt++) {
            g_position_regi[index]["EXT" + axes_cnt] = {
              data: posData.ext["E" + axes_cnt],
              unit: getJointUnitStr(posData.group, axes_cnt + 5),
            };
          }
          g_position_regi[index].Config = posData.conf;
          g_position_regi[index].axes = posData.axes;
          g_position_regi[index].gnum = posData.group;
          g_position_regi[index].rep = posData.rep;
          g_position_regi[index].uframe = posData.uf;
          g_position_regi[index].utool = posData.ut;
        } else {
          g_position_regi[index] = [];
        }
        g_position_regi[index].comment = posData.comment;
        break;
      case POSKIND_POSREGI_REGI:
      case POSKIND_POSREGI_AR:
      default:
        break;
    }
    totalPosCnt++;
    mltPosStock = {};
  }
  if (totalPosCnt == 0) {
    dtfrm.document
      .getElementById(robotPos[totalPosCnt].id)
      .updatePositionList(get_allPosIndex());
  } else {
    dtfrm.document
      .getElementById(robotPos[totalPosCnt - 1].id)
      .updatePositionList(get_allPosIndex());
  }
  del_unused_posno();

  // Get values synchronously
  function getPositionMultiCB(posNum, resultPosRecArray, callbackarg) {
    mltPosStock = resultPosRecArray;
  }
}

/*
 =========================================================================
 @function name        : fixDropAdinDataSave_g_program
 @argument[saveParam]  : 
 @description          : 
 @return               : none
 =========================================================================
*/
function fixDropAdinDataSave_g_program(saveParam) {
  var instObj = g_inst_obj[g_xml_data[g_adinDropList[0][2]][2]];
  if (
    instObj.detail.appName == saveParam.substring(0, saveParam.indexOf("(")) ||
    instObj.detail.appName == saveParam.trim()
  ) {
    g_program_data[g_adintarget].param = saveParam;
  } else {
    var objCnt = Object.keys(g_stretchOrder_data[g_adintarget]);
    var resultcnt = objCnt.filter(function (value) {
      return !isNaN(value);
    });
    g_program_data[
      g_stretchOrder_data[g_adintarget][resultcnt.length - 1].id
    ].param = saveParam;
  }
}

/*
 =========================================================================
 @function name       : fixDataSave_g_program
 @argument[saveParam] : Detail screen element
 @argument[id]        : Operated element ID
 @argument[opeType]   : Type of operation
 @argument[value]     : Value after operation
 @argument[activeId]  : Bracket end element ID (For Advanced Instruction)
 @description         : Value storage in g_program_data
 @return              : none
 =========================================================================
*/
function fixDataSave_g_program(saveParam, id, opeType, value, activeId) {
  var needSave = true;
  var gpChk = new RegExp("gp\\d");
  var dtfrm = document.getElementById(
    get_detail_frm_id(activeTarget)
  ).contentWindow;
  active_elem = id;
  switch (g_program_data[activeTarget].iconNo) {
    case ICON_NO_KAKUJIKU:
    case ICON_NO_VSN_JOINT:
      if (opeType.match(gpChk)) {
        /* Switching group tabs does not require a save process. */
        needSave = false;
      } else {
        /* Speed */
        paramSet_speed(dtfrm);
        /* Route */
        paramSet_route(dtfrm);
        /* Additional motion */
        g_program_data[activeTarget].addMotion = detail_optInstructionSet(
          id,
          value,
          g_program_data[activeTarget].addMotion
        );

        posNumChk(activeTarget, null);
        posFix();
      }
      break;
    case ICON_NO_STRAIGHT:
    case ICON_NO_VSN_LINE:
    case ICON_NO_CIRCULAR:
      if (opeType.match(gpChk)) {
        /* Switching group tabs does not require a save process. */
        needSave = false;
      } else {
        /* Speed */
        paramSet_speed(dtfrm);
        /* Route */
        paramSet_route(dtfrm);
        /* Additional motion */
        g_program_data[activeTarget].addMotion = detail_optInstructionSet(
          id,
          value,
          g_program_data[activeTarget].addMotion
        );

        posNumChk(activeTarget, null);
        posFix();
      }
      break;
    case ICON_NO_MACRO:
      g_program_data[activeTarget].param = dtfrm.document
        .getElementById("macro_name")
        .getValue();
      break;
    case ICON_NO_CALL:
      var getVal = dtfrm.document.getElementById("call_name").getValue();
      if (getVal == undefined && id === "program_sel1" && value === "1") {
        var call_list = [];
        for (var cnt = 0; cnt < programFileList.length; cnt++) {
          call_list.push(programFileList[cnt].name);
        }
        dtfrm.document
          .getElementById("call_name")
          .refresh(call_list, call_list[0], null, false);
        g_program_data[activeTarget].param = call_list[0];
      } else {
        g_program_data[activeTarget].param = getVal;
      }
      var formList = dtfrm.document.getElementsByClassName(
        "input-form-list-row"
      );
      var argSetFlg = false;
      for (var cnt = 0; cnt < formList.length; cnt++) {
        if (
          dtfrm.document.getElementById("argument_" + (cnt + 1)).getValue() !==
          ""
        ) {
          if (!argSetFlg) {
            argSetFlg = true;
            g_program_data[activeTarget].param += " (";
          } else {
            g_program_data[activeTarget].param += ",";
          }
          g_program_data[activeTarget].param += setLangConvJpEng(
            dtfrm.document.getElementById("argument_" + (cnt + 1)).getValue()
          );
        }
      }
      if (argSetFlg) {
        g_program_data[activeTarget].param += ")";
      }
      break;
    case ICON_NO_WAIT:
      var radio_sel = dtfrm.document.getElementsByClassName(
        "radio-button-option"
      );
      var setvalue = dtfrm.document.getElementById("jump_select").getValue();

      for (var radioCnt = 0; radioCnt < radio_sel.length; radioCnt++) {
        if (radio_sel[radioCnt].classList.contains("selected")) {
          if (radio_sel[radioCnt].dataset.value === "1") {
            // Fixed value
            g_program_data[activeTarget].param =
              Number(
                dtfrm.document.getElementById("wait_sec").getValue()
              ).toFixed(2) + "(sec)";
            dtfrm.document
              .getElementById("jump_select")
              .refresh(g_labelNumList, setvalue, null, true);
          } else if (radio_sel[radioCnt].dataset.value === "2") {
            g_program_data[activeTarget].param = detail_cond_combine("wait");
            var array = [];
            for (var listCnt in g_labelNumList) {
              array[listCnt] = g_labelNumList[listCnt].toString(10);
            }
            dtfrm.document
              .getElementById("jump_select")
              .refresh(array, setvalue, null, false);
            if (
              dtfrm.document.getElementById("time_out_option").getValue() ===
              "1"
            ) {
              g_program_data[activeTarget].param +=
                " " +
                langResource.ihmieditor_order_timeout_c +
                "," +
                ORDER_LABEL +
                "[" +
                dtfrm.document.getElementById("jump_select").getValue() +
                "]";
            }
          } else {
            // Conditional expression
            g_program_data[activeTarget].param = setLangConvJpEng(
              dtfrm.document.getElementById("conditionValue").getValue()
            );
            dtfrm.document
              .getElementById("jump_select")
              .refresh(g_labelNumList, setvalue, null, true);
          }
          break;
        }
      }
      break;
    case ICON_NO_IF:
      var radio_sel = dtfrm.document.getElementsByClassName(
        "radio-button-option"
      );
      for (var radioCnt = 0; radioCnt < radio_sel.length; radioCnt++) {
        if (radio_sel[radioCnt].classList.contains("selected")) {
          if (radio_sel[radioCnt].dataset.value === "1") {
            g_program_data[activeTarget].param = detail_cond_combine("if");
          } else {
            /* Conditional expression */
            g_program_data[activeTarget].param = setLangConvJpEng(
              dtfrm.document.getElementById("conditionValue").getValue()
            );
          }
          break;
        }
      }
      break;
    case ICON_NO_REGI:
      fixDataSave_g_prog_regi(saveParam, id, value, activeId, dtfrm);
      break;
    case ICON_NO_FOR:
      fixDataSave_g_prog_for(dtfrm);
      break;
    case ICON_NO_OUTPUT:
      var o_type = "";
      var radio_sel = dtfrm.document.getElementsByClassName(
        "radio-button-option"
      );
      for (var radioCnt = 0; radioCnt < radio_sel.length; radioCnt++) {
        if (radio_sel[radioCnt].classList.contains("selected")) {
          o_type = dtfrm.document.getElementById("output_list").getValue();
          g_program_data[activeTarget].param = setLangConvJpEng(
            detail_output_paramSet(radioCnt, o_type, id)
          );
          break;
        }
      }
      break;
    case ICON_NO_COMMENT:
      g_program_data[activeTarget].param = dtfrm.document
        .getElementById("comment")
        .getValue();
      timeline_commentDispCheck(activeTarget);
      break;
    case ICON_NO_NOSUPPORT:
      g_program_data[activeTarget].param = setLangConvJpEng(
        dtfrm.document.getElementById("text_form").getValue()
      );
      break;
    case ICON_NO_JUMP:
      var setParamNum = dtfrm.document.getElementById("jump_select").getValue();
      if (setParamNum !== "") {
        setParamNum = ORDER_JUMP + " " + ORDER_LABEL + "[" + setParamNum + "]";
      } else {
        setParamNum = ORDER_JUMP + " " + ORDER_LABEL + "[0]";
      }
      g_program_data[activeTarget].param = setParamNum;
      break;
    case ICON_NO_LABEL:
      var val = dtfrm.document.getElementById("label_text").getValue();
      if (val === "") {
        val = 0;
      }
      g_program_data[activeTarget].param = ORDER_LABEL + "[" + val + "]";
      break;
    case ICON_NO_PAYLOAD:
      var setParam = "";
      var val = dtfrm.document.getElementById("payload_select").getValue();
      if (val === "0") {
        setParam = dtfrm.document.getElementById("payload_const").getValue();
      } else if (val === "1") {
        setParam =
          ORDER_REGI +
          "[" +
          dtfrm.document.getElementById("payload_index").getValue() +
          "]";
      } else {
      }
      g_program_data[activeTarget].param = ORDER_PAYLOAD + "[" + setParam + "]";
      break;
    case ICON_NO_ARC_LINE:
    case ICON_NO_ARC_CIRCLE:
      if (opeType.match(gpChk)) {
        /* Switching group tabs does not require a save process. */
        needSave = false;
      } else {
        posNumChk(activeTarget, null);
        posFix();
      }
      break;
    case ICON_NO_LASER_PRE:
      /* Speed */
      paramSet_speed(dtfrm);
      /* Route */
      paramSet_route(dtfrm);
      /* Additional motion */
      g_program_data[activeTarget].addMotion = detail_optInstructionSet(
        id,
        value,
        g_program_data[activeTarget].addMotion
      );

      posNumChk(activeTarget, null);
      posFix();

      create_laser_data(dtfrm, g_program_data[activeTarget].iconNo);
      break;
    case ICON_NO_LASER_K_PRE:
      if (opeType.match(gpChk)) {
        /* Switching group tabs does not require a save process. */
        needSave = false;
      } else {
        /* Speed */
        paramSet_speed(dtfrm);
        /* Route */
        paramSet_route(dtfrm);
        /* Additional motion */
        g_program_data[activeTarget].addMotion = detail_optInstructionSet(
          id,
          value,
          g_program_data[activeTarget].addMotion
        );

        posNumChk(activeTarget, null);
        posFix();

        create_laser_data(dtfrm, g_program_data[activeTarget].iconNo);
      }
      break;
    case ICON_NO_LASER_PRE_SI:
      create_laser_data(dtfrm, g_program_data[activeTarget].iconNo);
      break;
    case ICON_NO_LASER_LS:
      /* Speed */
      paramSet_speed(dtfrm);
      /* Route */
      paramSet_route(dtfrm);
      /* Additional motion */
      g_program_data[activeTarget].addMotion = detail_optInstructionSet(
        id,
        value,
        g_program_data[activeTarget].addMotion
      );
      posNumChk(activeTarget, null);
      posFix();

      create_laser_data(dtfrm, g_program_data[activeTarget].iconNo);
      break;
    case ICON_NO_LASER_K_LS:
      if (opeType.match(gpChk)) {
        /* Switching group tabs does not require a save process. */
        needSave = false;
      } else {
        /* Speed */
        paramSet_speed(dtfrm);
        /* Route */
        paramSet_route(dtfrm);
        /* Additional motion */
        g_program_data[activeTarget].addMotion = detail_optInstructionSet(
          id,
          value,
          g_program_data[activeTarget].addMotion
        );

        posNumChk(activeTarget, null);
        posFix();

        create_laser_data(dtfrm, g_program_data[activeTarget].iconNo);
      }
      break;
    case ICON_NO_LASER_LS_SI:
      create_laser_data(dtfrm, g_program_data[activeTarget].iconNo);
      break;
    case ICON_NO_LASER_LE:
      /* Speed */
      paramSet_speed(dtfrm);
      /* Route */
      paramSet_route(dtfrm);
      /* Additional motion */
      g_program_data[activeTarget].addMotion = detail_optInstructionSet(
        id,
        value,
        g_program_data[activeTarget].addMotion
      );
      posNumChk(activeTarget, null);
      posFix();

      create_laser_data(dtfrm, g_program_data[activeTarget].iconNo);
      break;
    case ICON_NO_LASER_K_LE:
      if (opeType.match(gpChk)) {
        /* Switching group tabs does not require a save process. */
        needSave = false;
      } else {
        /* Speed */
        paramSet_speed(dtfrm);
        /* Route */
        paramSet_route(dtfrm);
        /* Additional motion */
        g_program_data[activeTarget].addMotion = detail_optInstructionSet(
          id,
          value,
          g_program_data[activeTarget].addMotion
        );

        posNumChk(activeTarget, null);
        posFix();

        create_laser_data(dtfrm, g_program_data[activeTarget].iconNo);
      }
      break;
    case ICON_NO_LASER_LE_SI:
      create_laser_data(dtfrm, g_program_data[activeTarget].iconNo);
      break;
    case ICON_NO_LASER_PWC:
      var setParam = "";
      var val = dtfrm.document.getElementById("pwc_pos").getValue();
      if (val == 1) {
        setParam = dtfrm.document.getElementById("ctrl_table").getValue();
        g_program_data[activeTarget].param = ORDER_PWC + "[" + setParam + "]";
      } else {
        setParam = dtfrm.document.getElementById("ctrl_reg").getValue();
        g_program_data[activeTarget].param =
          ORDER_PWC + "[" + ORDER_REGI + "[" + setParam + "]]";
      }
      break;
    case ICON_NO_LASER_WIRC:
      var setParam = "";
      var val = dtfrm.document.getElementById("pwc_pos").getValue();
      if (val == 1) {
        setParam = dtfrm.document.getElementById("ctrl_table").getValue();
        g_program_data[activeTarget].param =
          ORDER_WIRC + "[Ty=" + setParam + ",Sp=";
      } else {
        setParam = dtfrm.document.getElementById("ctrl_reg").getValue();
        g_program_data[activeTarget].param =
          ORDER_WIRC + "[Ty=" + ORDER_REGI + "[" + setParam + "],Sp=";
      }
      val = dtfrm.document.getElementById("pwc_pos2").getValue();
      if (val == 1) {
        setParam = dtfrm.document.getElementById("ctrl_table2").getValue();
        g_program_data[activeTarget].param += setParam + "]";
      } else {
        setParam = dtfrm.document.getElementById("ctrl_reg2").getValue();
        g_program_data[activeTarget].param +=
          ORDER_REGI + "[" + setParam + "]]";
      }
      break;
    case ICON_NO_WELD_START_MO:
      /* Speed */
      paramSet_speed(dtfrm);
      /* Route */
      paramSet_route(dtfrm);
      /* Additional motion */
      g_program_data[activeTarget].addMotion = detail_optInstructionSet(
        id,
        value,
        g_program_data[activeTarget].addMotion
      );

      // set arc param
      var wpParam = "";
      var schParam = "";
      var selectWpObj = dtfrm.dispParam.getWeldProcNum();
      var selectSchObj = dtfrm.dispParam.getWeldSchNum();

      wpParam = selectWpObj.value !== "" ? selectWpObj.value : "...";
      if (selectWpObj.isRegi) {
        wpParam = langResource.ihmieditor_order_regi_c + "[" + wpParam + "]";
      }

      schParam = selectSchObj.value !== "" ? selectSchObj.value : "...";
      if (selectSchObj.isRegi) {
        schParam = langResource.ihmieditor_order_regi_c + "[" + schParam + "]";
      }

      g_program_data[activeTarget].addMotion.push(
        ORDER_WELDSTART + "[" + wpParam + "," + schParam + "]"
      );

      posNumChk(activeTarget, null);
      posFix();
      break;
    case ICON_NO_ARC_STOP_MO:
      /* Speed */
      paramSet_speed(dtfrm);
      /* Route */
      paramSet_route(dtfrm);
      /* Additional motion */
      g_program_data[activeTarget].addMotion = detail_optInstructionSet(
        id,
        value,
        g_program_data[activeTarget].addMotion
      );

      // set arc param
      var wpParam = "";
      var schParam = "";
      var selectWpObj = dtfrm.dispParam.getWeldProcNum();
      var selectSchObj = dtfrm.dispParam.getWeldSchNum();

      wpParam = selectWpObj.value !== "" ? selectWpObj.value : "...";
      if (selectWpObj.isRegi) {
        wpParam = langResource.ihmieditor_order_regi_c + "[" + wpParam + "]";
      }

      schParam = selectSchObj.value !== "" ? selectSchObj.value : "...";
      if (selectSchObj.isRegi) {
        schParam = langResource.ihmieditor_order_regi_c + "[" + schParam + "]";
      }

      g_program_data[activeTarget].addMotion.push(
        ORDER_WELDEND + "[" + wpParam + "," + schParam + "]"
      );

      posNumChk(activeTarget, null);
      posFix();
      break;
    case ICON_NO_WELD_START_AL:
      var param = g_program_data[activeTarget].param.split(/\s+/);
      /* option instruction set */
      g_program_data[activeTarget].param = "";
      g_program_data[activeTarget].param = detail_optInstructionSet(
        id,
        value,
        param
      );
      // set arc param
      var wpParam = "";
      var schParam = "";
      var selectWpObj = dtfrm.dispParam.getWeldProcNum();
      var selectSchObj = dtfrm.dispParam.getWeldSchNum();

      wpParam = selectWpObj.value !== "" ? selectWpObj.value : "...";
      if (selectWpObj.isRegi) {
        wpParam = langResource.ihmieditor_order_regi_c + "[" + wpParam + "]";
      }

      schParam = selectSchObj.value !== "" ? selectSchObj.value : "...";
      if (selectSchObj.isRegi) {
        schParam = langResource.ihmieditor_order_regi_c + "[" + schParam + "]";
      }

      if (g_program_data[activeTarget].param !== "") {
        g_program_data[activeTarget].param += " ";
      }
      g_program_data[activeTarget].param +=
        ORDER_WELDSTART + "[" + wpParam + "," + schParam + "]";
      break;
    case ICON_NO_ARC_STOP_AL:
      var param = g_program_data[activeTarget].param.split(/\s+/);
      /* option instruction set */
      g_program_data[activeTarget].param = "";
      g_program_data[activeTarget].param = detail_optInstructionSet(
        id,
        value,
        param
      );
      // set arc param
      var wpParam = "";
      var schParam = "";
      var selectWpObj = dtfrm.dispParam.getWeldProcNum();
      var selectSchObj = dtfrm.dispParam.getWeldSchNum();

      wpParam = selectWpObj.value !== "" ? selectWpObj.value : "...";
      if (selectWpObj.isRegi) {
        wpParam = langResource.ihmieditor_order_regi_c + "[" + wpParam + "]";
      }

      schParam = selectSchObj.value !== "" ? selectSchObj.value : "...";
      if (selectSchObj.isRegi) {
        schParam = langResource.ihmieditor_order_regi_c + "[" + schParam + "]";
      }

      if (g_program_data[activeTarget].param !== "") {
        g_program_data[activeTarget].param += " ";
      }
      g_program_data[activeTarget].param +=
        ORDER_WELDEND + "[" + wpParam + "," + schParam + "]";
      break;
    case ICON_NO_SET_UFRAME:
      fixDataSave_g_prog_frame("SET", "uframe", dtfrm);
      break;
    case ICON_NO_SET_UTOOL:
      fixDataSave_g_prog_frame("SET", "utool", dtfrm);
      break;
    case ICON_NO_SEL_UFRAME:
      fixDataSave_g_prog_frame("SEL", "uframe", dtfrm);
      break;
    case ICON_NO_SEL_UTOOL:
      fixDataSave_g_prog_frame("SEL", "utool", dtfrm);
      break;
    default:
      var instObj =
        g_inst_obj[g_xml_data[g_program_data[activeTarget].iconNo][2]];
      if (
        instObj.detail.appName ==
          saveParam.substring(0, saveParam.indexOf("(")) ||
        (saveParam.substring(0, saveParam.indexOf("(")) == "" &&
          saveParam == instObj.detail.appName)
      ) {
        g_program_data[activeTarget].param = saveParam;
      } else {
        var objCnt = Object.keys(g_stretchOrder_data[activeTarget]);
        var resultcnt = objCnt.filter(function (value) {
          return !isNaN(value);
        });
        g_program_data[
          g_stretchOrder_data[activeTarget][resultcnt.length - 1].id
        ].param = saveParam;
      }
      if (g_program_data[activeTarget].position.length != 0) {
        posFix(activeId);
      }
      break;
  }
  return needSave;
}

/*
 =========================================================================
 @function name       : fixDataSave_g_prog_regi
 @argument[saveParam] : 
 @argument[id]        : 
 @argument[value]     : 
 @argument[activeId]  : 
 @argument[dtfrm]     : 
 @description         : Value storage in g_program_data
 @return              : none
 =========================================================================
*/
function fixDataSave_g_prog_regi(saveParam, id, value, activeId, dtfrm) {
  var radio_sel = dtfrm.document.getElementsByClassName("radio-button-option");
  for (var radioCnt = 0; radioCnt < radio_sel.length; radioCnt++) {
    if (radio_sel[radioCnt].classList.contains("selected")) {
      g_program_data[activeTarget].param =
        ORDER_REGI +
        "[" +
        dtfrm.document.getElementById("regi_index").getValue() +
        "]=";

      var getVal = dtfrm.document.getElementById("regi_val_select").getValue();
      if (getVal != "0") {
        g_program_data[activeTarget].param +=
          dtfrm.selectRegiValList[getVal][0] + "[";
      }
      if (dtfrm.document.getElementById("indexarea").style.display == "block") {
        var getIdxVal = dtfrm.document
          .getElementById("regi_val_index")
          .getValue();
        g_program_data[activeTarget].param += getIdxVal + "]";

        dtfrm.inputVal[dtfrm.selectRegiValList[getVal][0]].val =
          Number(getIdxVal);
      } else if (
        dtfrm.document.getElementById("constarea").style.display == "block"
      ) {
        g_program_data[activeTarget].param += dtfrm.document
          .getElementById("regi_val_const")
          .getValue();
      } else {
      }
    } else {
      /* Conditional expression */
      g_program_data[activeTarget].param = setLangConvJpEng(
        "R[" +
          dtfrm.document.getElementById("regi").getValue() +
          "]=" +
          dtfrm.document.getElementById("regi_val").getValue()
      );
    }
    break;
  }
}

/*
 =========================================================================
 @function name   : detail_optInstructionSet
 @argument[dtfrm] : 
 @description     : Function execution and input value setting when reading the details tab.
 @return          : none
 =========================================================================
*/
function detail_optInstructionSet(id, vOffsetVal, param) {
  var dtfrm = document.getElementById(
    get_detail_frm_id(activeTarget)
  ).contentWindow;
  var formList = dtfrm.document.getElementsByClassName("input-form-list-row");
  var argSetFlg = false;
  var setOptStr = [];
  var editElmId = id;
  var val = "";
  var voffsetParam = "";
  var voffsetStr = ORDER_VOFFSET + "," + ORDER_VR;
  var laserStr = new RegExp(
    "((" +
      ORDER_LS +
      "|" +
      ORDER_LS_SCH +
      "|" +
      ORDER_LE +
      "|" +
      ORDER_SLPU +
      "|" +
      ORDER_SLPD +
      ")\\[|" +
      ORDER_PLE_LS +
      ")"
  );
  var laserParamIndx = "";
  if (
    g_program_data[activeTarget].iconNo != ICON_NO_CIRCULAR &&
    param.length > 0
  ) {
    if (id.indexOf("addmotion_") != -1) id = "addmotion_";
    for (var i in param) {
      if (param[i].indexOf(voffsetStr) != -1 || param[i] == ORDER_VOFFSET) {
        voffsetParam = param[i];
        //        break;
      }
      if (param[i].match(laserStr)) {
        if (laserParamIndx == "") laserParamIndx = i;
      }
    }
    switch (id) {
      case "addmotion_":
        if (
          vOffsetVal == "VOFFSET" ||
          vOffsetVal.indexOf("VOFFSET,VR") != -1 ||
          vOffsetVal == "17" ||
          vOffsetVal == "18" ||
          vOffsetVal.indexOf(voffsetStr) != -1 ||
          vOffsetVal == ORDER_VOFFSET
        ) {
          if (
            vOffsetVal.indexOf("VOFFSET,VR") != -1 ||
            vOffsetVal == "17" ||
            vOffsetVal.indexOf(voffsetStr) != -1
          ) {
            param.push(voffsetStr);
          } else if (
            vOffsetVal == "VOFFSET" ||
            vOffsetVal == "18" ||
            vOffsetVal == ORDER_VOFFSET
          ) {
            param.push(ORDER_VOFFSET);
          }

          val = param.filter(function (value) {
            return value.startsWith(voffsetStr) || value == ORDER_VOFFSET;
          });
          if (val.length <= 2) {
            if (
              g_program_data[activeTarget].iconNo == ICON_NO_VSN_LINE ||
              g_program_data[activeTarget].iconNo == ICON_NO_VSN_JOINT
            ) {
              return "'voffset is Already Used'";
            } else {
              val = "";
            }
          } else if (val.length > 2) {
            return "'voffset is Already Used'";
          }
        } else {
          val =
            g_program_data[activeTarget].iconNo == ICON_NO_VSN_LINE ||
            g_program_data[activeTarget].iconNo == ICON_NO_VSN_JOINT
              ? voffsetParam
              : "";
        }
        break;
      case "selType":
        if (vOffsetVal == 0) {
          val = setLangConvJpEng(voffsetStr + "[1]");
        } else if (vOffsetVal == -1) {
          val = setLangConvJpEng(ORDER_VOFFSET);
        }
        break;
      case "selVRIndex":
        var setVal = vOffsetVal;
        var selData = dtfrm.VRIndirectOrder.filter(function (array) {
          return array[1] == vOffsetVal;
        });
        if (selData.length != 0) {
          setVal = selData[0][0] + "[" + selData[0][4] + "]";
        }
        val = setLangConvJpEng(voffsetStr + "[" + setVal + "]");
        break;
      case "index_val.textbox":
        if (voffsetParam.indexOf(voffsetStr + "[" + ORDER_REGI + "[") != -1) {
          val = voffsetStr + "[" + ORDER_REGI + "[" + vOffsetVal + "]]";
          dtfrm.VRIndirectOrder[0][4] = vOffsetVal;
        } else if (
          voffsetParam.indexOf(voffsetStr + "[" + ORDER_ARGUMENT + "[") != -1
        ) {
          val = voffsetStr + "[" + ORDER_ARGUMENT + "[" + vOffsetVal + "]]";
          dtfrm.VRIndirectOrder[1][4] = vOffsetVal;
        }
        break;
      case "option_formlist":
        if (
          g_program_data[activeTarget].iconNo == ICON_NO_VSN_LINE ||
          g_program_data[activeTarget].iconNo == ICON_NO_VSN_JOINT
        )
          val = setLangConvJpEng(voffsetParam);
        break;
      default:
        val =
          g_program_data[activeTarget].iconNo == ICON_NO_VSN_LINE ||
          g_program_data[activeTarget].iconNo == ICON_NO_VSN_JOINT
            ? voffsetParam
            : "";
        break;
    }
    if (val) setOptStr.push(val);
  }
  for (var cnt = 0; cnt < formList.length; cnt++) {
    var setParam = dtfrm.document
      .getElementById("addmotion_" + (cnt + 1))
      .getValue();
    /*5/17 add*/
    if (setParam.match(/^\s$/) != null) setParam = "";
    if (
      (g_program_data[activeTarget].iconNo == ICON_NO_VSN_LINE ||
        g_program_data[activeTarget].iconNo == ICON_NO_VSN_JOINT) &&
      (setParam == "VOFFSET" ||
        setParam.indexOf("VOFFSET,VR") != -1 ||
        setParam.indexOf(voffsetStr) != -1 ||
        setParam == ORDER_VOFFSET)
    ) {
      setParam = "";
    } else if (
      (g_program_data[activeTarget].iconNo == ICON_NO_STRAIGHT ||
        g_program_data[activeTarget].iconNo == ICON_NO_KAKUJIKU) &&
      (setParam == "VOFFSET" ||
        setParam.indexOf("VOFFSET,VR") != -1 ||
        setParam.indexOf(voffsetStr) != -1 ||
        setParam == ORDER_VOFFSET)
    ) {
      sameCnt++;
    }

    if (setParam !== "") {
      if (
        argSetFlg ||
        (!argSetFlg && g_program_data[activeTarget].param != "")
      ) {
      } else {
        argSetFlg = true;
      }
      if (
        sameCnt >= 2 &&
        (vOffsetVal == "VOFFSET" ||
          vOffsetVal.indexOf("VOFFSET,VR") != -1 ||
          vOffsetVal == "17" ||
          vOffsetVal == "18" ||
          vOffsetVal.indexOf(voffsetStr) != -1 ||
          vOffsetVal == ORDER_VOFFSET)
      ) {
        setOptStr.push("'voffset is Already Used'");
      } else {
        setOptStr.push(setLangConvJpEng(setParam));
      }
    }
  }
  sameCnt = 0;
  if (laserParamIndx) {
    /* Laser additional motion insertion position check. */
    var insPos =
      id === "addmotion_" &&
      vOffsetVal == "" &&
      editElmId.replace("addmotion_", "") - 1 < laserParamIndx
        ? laserParamIndx - 1
        : laserParamIndx >= 0
        ? laserParamIndx
        : 0;
    setOptStr.splice(insPos, 0, param[laserParamIndx]);
  }
  return setOptStr;
}

/*
 =========================================================================
 @function name       : fixDataSave_g_prog_for
 @argument[dtfrm]     : Frame on the detail screen.
 @description         : Value storage in g_program_data
 @return              : none
 =========================================================================
*/
function fixDataSave_g_prog_for(dtfrm) {
  var getParam = function (dtfrm, str) {
    var list = str == "loop" ? dtfrm.selectLoopList : dtfrm.selectOptionList;
    var select = dtfrm.document.getElementById(str + "_val").getValue();
    for (var cnt = 0; cnt < list["disp"].length; cnt++) {
      if (list["disp"][cnt][1] == select) {
        var setVal = dtfrm.document
          .getElementById(str + "_val" + (cnt + 1))
          .getValue();
        /* Add '()' for negative numbers. */
        if (Number(setVal) < 0) setVal = "(" + setVal + ")";
        g_program_data[activeTarget].param += list["order"][cnt] + setVal;
        /* Add the same number of ']' as '['. */
        for (
          var i = 0;
          i < (list["order"][cnt].match(/\[/g) || []).length;
          i++
        ) {
          g_program_data[activeTarget].param += "]";
        }
        if (str == "loop") g_program_data[activeTarget].param += "=";
        break;
      }
    }
  };
  g_program_data[activeTarget].param = "FOR ";
  getParam(dtfrm, "loop");
  getParam(dtfrm, "init");
  g_program_data[activeTarget].param +=
    dtfrm.document.getElementById("to_down").getValue() == 0
      ? " TO "
      : " DOWNTO ";
  getParam(dtfrm, "end");
}

/*
 =========================================================================
 @function name       : fixDataSave_g_prog_frame
 @argument[dtfrm]     : Frame on the detail screen.
 @description         : Value storage in g_program_data
 @return              : none
 =========================================================================
*/
function fixDataSave_g_prog_frame(order, judgeStr, dtfrm) {
  var gpflag = 0;
  var getParam = function (order, str, dtfrm) {
    var list = dtfrm.selectList;
    var setParam = "";
    var group = dtfrm.document.getElementById("group_val").getValue();
    var select = dtfrm.document.getElementById(str + "_val").getValue();

    if (g_program_data[activeTarget].param.indexOf("GP") != -1) gpflag = 1;
    switch (order) {
      case "SET":
        for (var cnt = 0; cnt < list["disp"].length; cnt++) {
          if (list["disp"][cnt][1] == select) {
            var setVal = dtfrm.document
              .getElementById(str + "_val" + (cnt + 1))
              .getValue();
            if (setVal == "-1") setVal = "...";
            setParam = list["order"][cnt] + setVal;
            /* Add the same number of ']' as '['. */
            for (
              var i = 0;
              i < (list["order"][cnt].match(/\[/g) || []).length;
              i++
            ) {
              setParam += "]";
            }
            if (str == "uframe" || str == "utool") {
              var orderStr = str == "uframe" ? ORDER_UFRAME : ORDER_UTOOL;
              g_program_data[activeTarget].param =
                orderStr + "[" + setParam + "]" + "=";
            } else if (str == "posReg") {
              if (gpflag == 1) {
                g_program_data[activeTarget].param +=
                  ORDER_POSREGI + "[GP" + group + ":" + setParam + "]";
              } else {
                posRegParam = setParam;
                g_program_data[activeTarget].param +=
                  ORDER_POSREGI + "[" + setParam + "]";
              }
            }
            break;
          }
        }
        break;
      case "SEL":
        for (var cnt = 0; cnt < list["disp"].length; cnt++) {
          if (list["disp"][cnt][1] == select) {
            var setVal = dtfrm.document
              .getElementById(str + "_val" + (cnt + 1))
              .getValue();
            if (setVal == "-1") setVal = "...";
            var orderStr = str == "uframe" ? ORDER_UFRAME_NUM : ORDER_UTOOL_NUM;
            setParam = list["order"][cnt] + setVal;
            /* Add the same number of ']' as '['. */
            for (
              var i = 0;
              i < (list["order"][cnt].match(/\[/g) || []).length;
              i++
            ) {
              setParam += "]";
            }
            break;
          }
        }
        g_program_data[activeTarget].param =
          gpflag == 0
            ? orderStr + "=" + setParam
            : orderStr + "[GP" + group + "]" + "=" + setParam;
        break;
      default:
        break;
    }
  };
  getParam(order, judgeStr, dtfrm);
  if (order == "SET") getParam(order, "posReg", dtfrm);
}

/*
 =========================================================================
 @function name  : detail_cond_combine
 @argument[kind] : Instruction kind
 @description    : Combine conditional statements.
 @return         : Combined string.
 =========================================================================
*/
function detail_cond_combine(kind) {
  var dtfrm = document.getElementById(
    get_detail_frm_id(activeTarget)
  ).contentWindow;
  var cmbStr = "";
  var getVal = "";
  getVal = dtfrm.document.getElementById(kind + ".variable_select").getValue();
  var getIdxVal = dtfrm.document
    .getElementById(kind + ".variable_index")
    .getValue();
  cmbStr += getWaitCondTpParts(detailCondVarSel_1, getVal);
  cmbStr += "[" + getIdxVal + "]";
  dtfrm.inputVal[dtfrm.IDX_LEFT][
    dtfrm.componentList[dtfrm.IDX_SELECT][".variable_select"][getVal][0]
  ].val = Number(getIdxVal);
  if (
    dtfrm.document.getElementById(kind + ".operator_select1").style.display ==
    "block"
  ) {
    getVal = dtfrm.document
      .getElementById(kind + ".operator_select1")
      .getValue();
    cmbStr += getWaitCondTpParts(detailCondSelOpe_1, getVal);
  } else {
    getVal = dtfrm.document
      .getElementById(kind + ".operator_select2")
      .getValue();
    cmbStr += getWaitCondTpParts(detailCondSelOpe_2, getVal);
  }
  if (
    dtfrm.document.getElementById(kind + ".value_select1").style.display ==
    "block"
  ) {
    getVal = dtfrm.document.getElementById(kind + ".value_select1").getValue();
    if (getVal === "1") {
      cmbStr += getWaitCondTpParts(detailCondVarSel_2, getVal);
    }
  } else if (
    dtfrm.document.getElementById(kind + ".value_select2").style.display ==
    "block"
  ) {
    getVal = dtfrm.document.getElementById(kind + ".value_select2").getValue();
    cmbStr += getWaitCondTpParts(detailCondVarSel_3, getVal);
  } else {
  }

  if (
    dtfrm.document.getElementById(kind + ".indexarea").style.display == "block"
  ) {
    getIdxVal = dtfrm.document.getElementById(kind + ".value_index").getValue();
    cmbStr += "[" + getIdxVal + "]";
    if (
      dtfrm.document.getElementById(kind + ".value_select1").style.display ==
      "block"
    ) {
      dtfrm.inputVal[dtfrm.IDX_RIGHT][
        dtfrm.componentList[dtfrm.IDX_SELECT][".value_select1"][getVal][0]
      ].val = Number(getIdxVal);
    } else if (
      dtfrm.document.getElementById(kind + ".value_select2").style.display ==
      "block"
    ) {
      dtfrm.inputVal[dtfrm.IDX_RIGHT][
        dtfrm.componentList[dtfrm.IDX_SELECT][".value_select2"][getVal][0]
      ].val = Number(getIdxVal);
    } else {
    }
  } else if (
    dtfrm.document.getElementById(kind + ".constarea").style.display == "block"
  ) {
    cmbStr += dtfrm.document.getElementById(kind + ".value_const").getValue();
  } else {
  }

  return cmbStr;
}

/*
 =========================================================================
 @function name  : getWaitCondTpParts
 @argument[tbl]  : Tables to search.
 @argument[val]  : input value.
 @description    : WAIT: Find and return an input value in a table.
 @return         : The corresponding TP.
 =========================================================================
*/
function getWaitCondTpParts(tbl, val) {
  var tpStr = "";
  for (var cnt in tbl) {
    if (val === tbl[cnt].val) {
      tpStr = tbl[cnt].tp;
      break;
    }
  }
  return tpStr;
}

/*
 =========================================================================
 @function name   : detail_output_paramSet
 @argument[]      : none
 @description     : 
 @return          : Set parameter
 =========================================================================
*/
function detail_output_paramSet(radioVal, o_type, chgId) {
  setParam = "";
  var selList = [];
  selList["0"] = { tp: "DO", radioVal: "1", initVal: ORDER_ON };
  selList["1"] = { tp: "RO", radioVal: "2", initVal: ORDER_ON };
  selList["2"] = { tp: "AO", radioVal: "3", initVal: "1" };
  selList["3"] = { tp: "GO", radioVal: "4", initVal: "1" };
  selList["4"] = { tp: "F", radioVal: "5", initVal: "(" + ORDER_ON + ")" };

  var dtfrm = document.getElementById(
    get_detail_frm_id(activeTarget)
  ).contentWindow;
  if (o_type === "6") {
    /* direct */
    var selVal = dtfrm.document.getElementById("direct_select").getValue();
    setParam =
      selList[selVal].tp +
      "[" +
      dtfrm.document.getElementById("direct_regi").getValue() +
      "]=";
    if (chgId === "direct_select") {
      dtfrm.document
        .getElementById("direct_ins")
        .refresh(
          langConvEng(selList[selVal].initVal),
          dtfrm.outputComponent[selVal][
            selList[selVal].tp.toLowerCase() + "_ins"
          ].length,
          false
        );
      setParam += selList[selVal].initVal;
    } else {
      setParam += dtfrm.document.getElementById("direct_ins").getValue();
    }
  } else {
    for (var cnt in selList) {
      if (selList[cnt].radioVal === o_type) {
        setParam =
          selList[cnt].tp +
          "[" +
          dtfrm.document
            .getElementById(selList[cnt].tp.toLowerCase() + "_regi")
            .getValue() +
          "]=";
        /* DO/RO/F */
        if (o_type === "1" || o_type === "2" || o_type === "5") {
          var listVal = dtfrm.document
            .getElementById(selList[cnt].tp.toLowerCase() + "_ins")
            .getValue();
          for (var chkCnt in dtfrm.selectOnOffList) {
            if (dtfrm.selectOnOffList[chkCnt][1] === listVal) {
              /* DO/RO */
              if (o_type === "1" || o_type === "2") {
                setParam += langConvEng(dtfrm.selectOnOffList[chkCnt][0]);
              } else {
                /* F */
                setParam +=
                  "(" + langConvEng(dtfrm.selectOnOffList[chkCnt][0]) + ")";
              }
              break;
            }
          }
        } else {
          /* AO/GO */
          setParam += dtfrm.document
            .getElementById(selList[cnt].tp.toLowerCase() + "_ins")
            .getValue();
        }
        break;
      }
    }
  }
  return setParam;
}

/*
 =========================================================================
 @function name   : detail_valReplace_chk
 @argument[]      : 
 @description     : 
 @return          : 
 =========================================================================
*/
function detail_valReplace_chk(chkVal) {
  if (chkVal === "") {
    chkVal = "0";
  }

  return chkVal;
}

var g_order_data_array = [{ order: "", position: "", speed: "" }];

/*
 =========================================================================
 @function name   : getSplitId
 @argument[]      : 
 @description     : 
 @return          : TPname split ID
 =========================================================================
*/
function getSplitId(targetId) {
  var leadIndex = "";
  var splitId = "";
  if (typeof g_program_data[targetId] == "undefined") {
    if (targetId.startsWith("iflead")) {
      return parseInt(targetId.split("iflead")[1], 10);
    } else if (targetId.startsWith("forlead")) {
      return parseInt(targetId.split("forlead")[1], 10);
    } else {
      for (var k in iconTab) {
        splitId = targetId.split(iconTab[k][1]);
        if (typeof splitId[1] == "undefined") continue;

        if (splitId[1].match(/[^0-9*]/g) != null) {
          continue;
        } else {
          return Number(splitId[1]);
        }
      }
    }
  } else {
    leadIndex = get_iconTbl_iconNumIndex(g_program_data[targetId].iconNo);
  }
  return parseInt(targetId.split(iconTab[leadIndex][1])[1], 10);
}

/*
 =========================================================================
 @function name   : getNestIdList
 @argument[]      : 
 @description     : 
 @return          : parent bracket id
 =========================================================================
*/
function getNestIdList(chkPrgName) {
  var parentIdList = [];
  var idCnt = 0;
  var chkNestId = 0;
  var parentChkFlg = true;
  var beforeNestId = "";
  var tpName = "";
  var tlStart = TL_PROG_LEAD_POS;
  var targetId = "";
  if (activeTarget != "") {
    targetId = activeTarget;
  } else if (g_adintarget != "") {
    targetId = g_adintarget;
  } else if (activeTarget == "" && g_weldTeach_list.length > 0) {
    targetId = g_weldTeach_list[0];
  }
  /*get activeIcon nestId */
  var activeElm = document.getElementById(targetId);
  var tl = document.getElementById("TimeLineArea").children;
  var targetTlnum = get_execLinePos(
    activeElm.parentElement,
    get_TL_targetOrder(activeElm.id)
  );
  /* descending order seach in timeline*/
  for (var cnt = targetTlnum + tlStart - 1; cnt >= tlStart; cnt--) {
    /* bktend is not parent*/
    if (
      tl[cnt].className.indexOf("bkt_end") != -1 ||
      tl[cnt].className.indexOf("for_end") != -1 ||
      tl[cnt].className.indexOf("if_end") != -1
    ) {
      continue;
    }
    /* bktlead is endTimeline Number < targetTimeline Number parent*/
    if (
      tl[cnt].id.indexOf("bktlead") != -1 ||
      tl[cnt].id.indexOf("forlead") != -1 ||
      tl[cnt].id.indexOf("iflead") != -1
    ) {
      var endId = get_stretchOrder_pairId(tl[cnt].id, REQ_ID_KIND_END, null);
      if (typeof tl[endId] == "undefined") continue;
      var endTlnum = get_execLinePos(
        tl[endId].parentElement,
        get_TL_targetOrder(endId)
      );
      if (endTlnum < targetTlnum) continue;
    }

    if (tl[cnt].className.indexOf("stretchOrder_open") != -1) {
      var classList = tl[cnt].className.split(/\s+/);
      for (var k in classList) {
        if (classList[k].indexOf("order_nest_") != -1) {
          chkNestId = Number(classList[k].match(/[0-9]*$/)[0]);
          break;
        }
      }
      if (beforeNestId == chkNestId) continue;
      beforeNestId = chkNestId;
      var splitId = new RegExp(String(getSplitId(tl[cnt].id)) + "$", "g");
      var parentTlnum = get_execLinePos(
        tl[cnt].parentElement,
        get_TL_targetOrder(tl[cnt].id)
      );
      tl[cnt].id.match(/^bktlead/) != null
        ? (tpName = tl[cnt].id.replace(/^bktlead/, "").split(splitId)[0])
        : tl[cnt].id.match(/^bktend/) != null
        ? (tpName = tl[cnt].id.replace(/^bktend/, "").split(splitId)[0])
        : tl[cnt].id.match(/^iflead/) != null
        ? (tpName = "IF (" + g_program_data[tl[cnt].id].param + ") THEN")
        : tl[cnt].id.match(/^forlead/) != null
        ? (tpName = g_program_data[tl[cnt].id].param)
        : tl[cnt].id.match(/^ifelse/) != null
        ? (tpName = g_program_data[tl[cnt].id].param)
        : (tpName = tl[cnt].id.split(splitId)[0]);
      parentIdList[idCnt] = {
        parentId: tl[cnt].id,
        tpName: tpName,
        tlNum: parentTlnum,
      };
      /*check parent TPname*/
      if (typeof chkPrgName != "undefined") {
        var chkName = chkPrgName.toUpperCase();
        if (
          chkName ==
            parentIdList[idCnt].tpName.replace(/^bktlead/, "").toUpperCase() ||
          chkName == parentIdList[idCnt].tpName.toUpperCase()
        ) {
          return true;
        } else {
          parentChkFlg = false;
        }
      }
      idCnt++;
      chkNestId = 0;
    }
    if (
      tl[cnt].className.indexOf("order_nest_1") != -1 &&
      tl[cnt].className.indexOf("stretchOrder_open") != -1
    )
      break;
  }
  if (parentChkFlg == false || parentIdList.length == 0) {
    return false;
  } else {
    return parentIdList;
  }
}

/*
 =========================================================================
 @function name     : getProgNameList
 @argument[prgName] : The name of the program to get.
 @description       : Get a list of program names that use "prgName" from the beginning of the program name.
 @return            : TPprogramList
 =========================================================================
*/
function getProgNameList(prgName) {
  var programList = [];
  var param = "";
  var endParam = "";
  if (typeof prgName != "undefined") {
    for (var i in g_inst_obj) {
      if (
        g_inst_obj[i].detail.appName
          .toUpperCase()
          .startsWith(prgName.toUpperCase())
      ) {
        g_inst_obj[i].detail.param != ""
          ? (param =
              "CALL " +
              g_inst_obj[i].detail.appName +
              "(" +
              g_inst_obj[i].detail.param +
              ")")
          : (param = "CALL " + g_inst_obj[i].detail.appName);
        if (typeof g_inst_obj[i].end != "undefined") {
          if (
            g_inst_obj[i].end.appName
              .toUpperCase()
              .startsWith(prgName.toUpperCase())
          ) {
            g_inst_obj[i].end.param != ""
              ? (endParam =
                  "CALL " +
                  g_inst_obj[i].end.appName +
                  "(" +
                  g_inst_obj[i].end.param +
                  ")")
              : (endParam = "CALL " + g_inst_obj[i].end.appName);
          }
        }
        programList.push({
          iconText: g_inst_obj[i].iconText,
          value: param,
          endValue: endParam,
        });
        param = "";
        endParam = "";
      }
    }
  }
  return programList;
}

/*
 =========================================================================
 @function name   : wizard_posFix
 @argument[]      : 
 @description     : position object overwrite
 @return          :
 =========================================================================
*/
function wizard_posFix(bktEndId) {
  var totalPosCnt = 0;
  var activePrgName = "";
  var dtfrm = "";
  var robotPos = "";
  var frameData = "";
  if (typeof bktEndId != "undefined") {
    activePrgName = bktEndId;
    totalPosCnt += g_program_data[activeTarget].position.length;
  } else {
    if (g_adintarget != "") {
      activePrgName = g_adintarget;
    } else {
      activePrgName = activeTarget;
    }
  }
  if (activePrgName == "") return false;

  for (var i = 0; i < top.home.length; i++) {
    if (top.home[i] != undefined) {
      if (top.home[i].wizardPageContents != undefined) {
        /*get wizard frame */
        dtfrm = top.home[i].wizardPageContents.contentWindow;
        robotPos = $(top.home[i].wizardPageContents)
          .contents()
          .find(".position");
        frameData = top.home[i].wizardPageContents;
        break;
      }
    }
  }
  if (dtfrm == "" || robotPos == "") return false;
  pos_overwrite(activePrgName, dtfrm, robotPos, totalPosCnt, frameData);
}

/*
 =========================================================================
 @function name   : posfix_overwrite
 @argument[]      : 
 @description     : 
 @return          :
 =========================================================================
*/
function pos_overwrite(activePrgName, dtfrm, robotPos, totalPosCnt, frameData) {
  if (activePrgName == undefined || dtfrm == undefined || robotPos == undefined)
    return false;
  if (totalPosCnt == undefined) {
    totalPosCnt = 0;
  }
  var mltPosStock = {};
  var positionNo = null;
  var pos_kind = "";
  for (
    var posNumCnt = 0;
    posNumCnt < g_program_data[activePrgName].position.length;
    posNumCnt++
  ) {
    if (typeof robotPos[totalPosCnt] != "undefined") {
      pos_kind = dtfrm.document
        .getElementById(robotPos[totalPosCnt].id)
        .getCurrentPosKind();
    } else {
      /*When component does not exist, processing of position is unnecessary */
      continue;
    }
    switch (pos_kind) {
      case POSKIND_POSNUM:
        dtfrm.document
          .getElementById(robotPos[totalPosCnt].id)
          .getPositionMulti(
            dtfrm.document
              .getElementById(robotPos[totalPosCnt].id)
              .getCurrentPosNumber(),
            true,
            getPositionMultiCB,
            null
          );
        var posDataList = JSON.parse(JSON.stringify(mltPosStock));
        var posDataListArr = Object.keys(posDataList);

        // search target position data
        positionNo = null;
        for (var i = 0; i < position.length; i++) {
          if (
            position[i].posNumber == posDataList[posDataListArr[0]].posNumber
          ) {
            positionNo = i;
            break;
          }
        }
        if (positionNo === null) {
          positionNo = position.length;
          position[positionNo] = make_position_data(posDataListArr[0].group);
        }
        position[positionNo].posNumber = Number(
          posDataList[posDataListArr[0]].posNumber
        );
        position[positionNo].Comment = posDataList[posDataListArr[0]].comment;

        // search target position data (group)
        for (key in posDataList) {
          var posData = posDataList[key];
          var posDataIdx = null;
          for (var j = 0; j < position[positionNo].posData.length; j++) {
            if (position[positionNo].posData[j].groupNumber == posData.group) {
              posDataIdx = j;
              break;
            }
          }
          if (posDataIdx === null) {
            posDataIdx = position[positionNo].posData.length;
            position[positionNo].posData[posDataIdx] = { poskey: [] };
          }
          if (posData.rep != FORMAT_JOINT) {
            position[positionNo].posData[posDataIdx].poskey[0] = {
              key: "X",
              val: posData.cart.X,
            };
            position[positionNo].posData[posDataIdx].poskey[1] = {
              key: "Y",
              val: posData.cart.Y,
            };
            position[positionNo].posData[posDataIdx].poskey[2] = {
              key: "Z",
              val: posData.cart.Z,
            };
            position[positionNo].posData[posDataIdx].poskey[3] = {
              key: "W",
              val: posData.cart.W,
            };
            position[positionNo].posData[posDataIdx].poskey[4] = {
              key: "P",
              val: posData.cart.P,
            };
            position[positionNo].posData[posDataIdx].poskey[5] = {
              key: "R",
              val: posData.cart.R,
            };
            position[positionNo].posData[posDataIdx].configStr = posData.conf;
          } else {
            position[positionNo].posData[posDataIdx].poskey[0] = {
              key: "J1",
              val: posData.joint.J1,
            };
            position[positionNo].posData[posDataIdx].poskey[1] = {
              key: "J2",
              val: posData.joint.J2,
            };
            position[positionNo].posData[posDataIdx].poskey[2] = {
              key: "J3",
              val: posData.joint.J3,
            };
            position[positionNo].posData[posDataIdx].poskey[3] = {
              key: "J4",
              val: posData.joint.J4,
            };
            position[positionNo].posData[posDataIdx].poskey[4] = {
              key: "J5",
              val: posData.joint.J5,
            };
            position[positionNo].posData[posDataIdx].poskey[5] = {
              key: "J6",
              val: posData.joint.J6,
            };
            position[positionNo].posData[posDataIdx].configStr = "";
          }
          position[positionNo].posData[posDataIdx].ufVal = posData.uf;
          position[positionNo].posData[posDataIdx].utVal = posData.ut;
          position[positionNo].posData[posDataIdx].groupNumber = Number(
            posData.group
          );

          position[positionNo].posData[posDataIdx].poskey[6] = {
            key: "EXT1",
            val: posData.ext.E1,
          };
          position[positionNo].posData[posDataIdx].poskey[7] = {
            key: "EXT2",
            val: posData.ext.E2,
          };
          position[positionNo].posData[posDataIdx].poskey[8] = {
            key: "EXT3",
            val: posData.ext.E3,
          };
        }
        break;
      case POSKIND_POSREGI:
        var posData = dtfrm.document
          .getElementById(robotPos[totalPosCnt].id)
          .getPosRegister();
        var index = get_g_position_regi_index(posData.group, posData.posRegNum);
        if (!g_position_regi[index]) {
          g_position_regi[index] = [];
        }
        if (!posData.empty) {
          if ([FORMAT_CART, FORMAT_CART_ADD].includes(posData.rep)) {
            //crt
            g_position_regi[index].P = posData.cart.P;
            g_position_regi[index].R = posData.cart.R;
            g_position_regi[index].W = posData.cart.W;
            g_position_regi[index].X = posData.cart.X;
            g_position_regi[index].Y = posData.cart.Y;
            g_position_regi[index].Z = posData.cart.Z;
          } else if (posData.rep == 9) {
            //joint
            g_position_regi[index].Config = posData.conf;
            g_position_regi[index].J1 = {
              data: posData.joint.J1,
              unit: getJointUnitStr(posData.group, 0),
            };
            g_position_regi[index].J2 = {
              data: posData.joint.J2,
              unit: getJointUnitStr(posData.group, 1),
            };
            g_position_regi[index].J3 = {
              data: posData.joint.J3,
              unit: getJointUnitStr(posData.group, 2),
            };
            g_position_regi[index].J4 = {
              data: posData.joint.J4,
              unit: getJointUnitStr(posData.group, 3),
            };
            g_position_regi[index].J5 = {
              data: posData.joint.J5,
              unit: getJointUnitStr(posData.group, 4),
            };
            g_position_regi[index].J6 = {
              data: posData.joint.J6,
              unit: getJointUnitStr(posData.group, 5),
            };
          } else {
          }
          var axes_num = getExtendAxesCount();
          for (var axes_cnt = 1; axes_cnt <= axes_num; axes_cnt++) {
            g_position_regi[index]["EXT" + axes_cnt] = {
              data: posData.ext["E" + axes_cnt],
              unit: getJointUnitStr(posData.group, axes_cnt + 5),
            };
          }
          g_position_regi[index].Config = posData.conf;
          g_position_regi[index].axes = posData.axes;
          g_position_regi[index].gnum = posData.group;
          g_position_regi[index].rep = posData.rep;
          g_position_regi[index].uframe = posData.uf;
          g_position_regi[index].utool = posData.ut;
        }
        g_position_regi[index].comment = posData.comment;
        break;
    }
    totalPosCnt++;
    mltPosStock = {};
  }

  if (totalPosCnt == 0) {
    dtfrm.document
      .getElementById(robotPos[totalPosCnt].id)
      .updatePositionList(get_allPosIndex());
  } else {
    dtfrm.document
      .getElementById(robotPos[totalPosCnt - 1].id)
      .updatePositionList(get_allPosIndex());
  }
  del_unused_posno();

  // Get values synchronously
  function getPositionMultiCB(posNum, resultPosRecArray, callbackarg) {
    mltPosStock = resultPosRecArray;
  }
}

/*
 =========================================================================
 @function name   : paramSet_speed
 @argument[dtfrm] : 
 @description     : Function execution and input value setting when reading the details tab.
 @return          : none
 =========================================================================
*/
function paramSet_speed(dtfrm) {
  var spdmtd = dtfrm.document.getElementById("speed_method").getValue();
  var spdTxt = dtfrm.document.getElementById("unit_l").getValue();
  if (spdTxt != "") {
    switch (spdmtd) {
      case dtfrm.selectOptionListSpeedMethod[0][1] /* Constant */:
        g_program_data[activeTarget].speed.method = "";
        g_program_data[activeTarget].speed.val = dtfrm.document
          .getElementById("speed_" + spdTxt)
          .getValue();
        break;
      case dtfrm.selectOptionListSpeedMethod[1][1] /* Regi */:
        g_program_data[activeTarget].speed.method = ORDER_REGI + "[";
        g_program_data[activeTarget].speed.val = dtfrm.document
          .getElementById("speed_regi_index")
          .getValue();
        break;
      case dtfrm.selectOptionListSpeedMethod[2][1] /* Regi[Regi */:
        g_program_data[activeTarget].speed.method =
          ORDER_REGI + "[" + ORDER_REGI + "[";
        g_program_data[activeTarget].speed.val = dtfrm.document
          .getElementById("speed_regi_regi_index")
          .getValue();
        break;
      // case dtfrm.selectOptionListSpeedMethod?.[3]?.[1]:  /* WELD_SPEED */
      case dtfrm.selectOptionListSpeedMethod[3] &&
        dtfrm.selectOptionListSpeedMethod[3][1] /* WELD_SPEED */:
        g_program_data[activeTarget].speed.method = "";
        g_program_data[activeTarget].speed.val = ORDER_WELD_SPEED;
        break;
      default:
        g_program_data[activeTarget].speed.method = "";
        g_program_data[activeTarget].speed.val = dtfrm.document
          .getElementById("speed_" + spdTxt)
          .getValue();
        break;
    }
    if (g_program_data[activeTarget].speed.val == undefined) {
      g_program_data[activeTarget].speed.val = dtfrm.document
        .getElementById("speed_" + spdTxt)
        .getValue();
    }
    var idx = dtfrm.selectOptionListSpeedUnit.filter(function (data) {
      return data[1] == spdTxt;
    });
    g_program_data[activeTarget].speed.unit =
      g_program_data[activeTarget].speed.val === ORDER_WELD_SPEED
        ? ""
        : idx[0][0];
  }
}

/*
 =========================================================================
 @function name   : paramSet_route
 @argument[dtfrm] : 
 @description     : Function execution and input value setting when reading the details tab.
 @return          : none
 =========================================================================
*/
function paramSet_route(dtfrm) {
  var stpTxt = dtfrm.document.getElementById("stop_l").getValue();
  switch (stpTxt) {
    case dtfrm.selectOptionListStop[0][1] /* FINE */:
      stpTxt = ORDER_FINE;
      g_program_data[activeTarget].route.val = "";
      break;
    case dtfrm.selectOptionListStop[1][1] /* CNT */:
      stpTxt = ORDER_CNT;
      g_program_data[activeTarget].route.val = dtfrm.document
        .getElementById("nameraka_l")
        .getValue();
      break;
    case dtfrm.selectOptionListStop[2][1] /* CNT Regi */:
      stpTxt = ORDER_CNT + " " + ORDER_REGI;
      g_program_data[activeTarget].route.val = dtfrm.document
        .getElementById("nameraka_regi_index")
        .getValue();
      break;
    case dtfrm.selectOptionListStop[3][1] /* CR */:
      stpTxt = ORDER_CR;
      g_program_data[activeTarget].route.val = dtfrm.document
        .getElementById("stop_cr_val")
        .getValue();
      break;
    default:
      stpTxt = ORDER_FINE;
      g_program_data[activeTarget].route.val = "";
      break;
  }
  g_program_data[activeTarget].route.stop = stpTxt;
}

/*
 =========================================================================
 @function name   : timeline_commentDispCheck
 @argument[dtfrm] : 
 @description     : Function execution and input value setting when reading the details tab.
 @return          : none
 =========================================================================
*/
function timeline_commentDispCheck(id) {
  var editInst = document.getElementById(id);
  var chkCmn = editInst.getElementsByClassName("commentContainer");
  if (chkCmn[0] != undefined) {
    if (g_program_data[id].param != "") {
      chkCmn[0].firstElementChild.innerText = g_program_data[id].param;
      commentOmitCheck(editInst);
    } else {
      chkCmn[0].remove();
    }
  } else {
    if (g_program_data[id].param != "") {
      addCmntFeeder(editInst);
    }
  }

  /* Check to see if it is necessary to omit the forward comment instruction by editing the comment. */
  prevCommentOmitCheck(editInst);

  /* Adjust timeline width by editing comments. */
  TLdrawAreaBufferResize();
  timelineScrlbarUpdate();
}
