/PROG  IPL_FANUC_SWELD_SETKL
/ATTR
OWNER		= MNEDITOR;
COMMENT		= "";
PROG_SIZE	= 471;
CREATE		= DATE 22-07-15  TIME 14:59:32;
MODIFIED	= DATE 22-07-15  TIME 14:59:32;
FILE_NAME	= ;
VERSION		= 0;
LINE_COUNT	= 14;
MEMORY_SIZE	= 795;
PROTECT		= READ_WRITE;
TCD:  STACK_SIZE	= 0,
      TASK_PRIORITY	= 50,
      TIME_SLICE	= 0,
      BUSY_LAMP_OFF	= 0,
      ABORT_REQUEST	= 0,
      PAUSE_REQUEST	= 0;
DEFAULT_GROUP	= *,*,*,*,*;
CONTROL_CODE	= 00000000 00000000;
LOCAL_REGISTERS	= 8,0,1;
/APPL

AUTO_SINGULARITY_HEADER;
  ENABLE_SINGULARITY_AVOIDANCE   : TRUE;  
  ARC Welding Equipment : 1,*,*,*,*;
/MN
   1:  !************************* ;
   2:  ! Fanuc Stitch Weld Plgin ;
   3:  !************************* ;
   4:  !  Starting PR ;
   5:  R[10001]=AR[1]    ;
   6:;
   6:  !  Ending PR;
   6:  R[10002]=AR[2]    ;
   7:;
   7:  !  Weld Length;
   7:  R[10003]=AR[3]    ;
   8:;
   8:  !  Weld Pitch;
   8:  R[10004]=AR[4]    ;
   9:;
   9:  !  Weld Procedure;
   9:  R[10005]=AR[5]    ;
   10:;
   10: !  Weld Schedule;
   10:  R[10006]=AR[6]    ;
   10:;
   10: !  Weld Speed;
   10:  R[10007]=AR[7]    ;
   10:;
   10: !  Weld Speed Unit;
   10:  R[10008]=AR[8]    ;
   11:;
   11: !  TP Name;
   11:  SR[10001]=AR[9]    ;
   12:   ;
   12:! KAREL routine to create segments;
   12:!  and generate TPP;
   13:  CALL IPL_FANUC_SWELD_SET(R[10001],R[10002],R[10003],R[10004],R[10005],R[10006],SR[10001]) ;
   14:   ;
/POS
/END
