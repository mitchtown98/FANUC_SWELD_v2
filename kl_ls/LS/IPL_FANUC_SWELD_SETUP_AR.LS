/PROG  IPL_FANUC_SWELD_SETUP_AR
/ATTR
OWNER		= MNEDITOR;
COMMENT		= "Plgin Setup";
PROG_SIZE	= 283;
CREATE		= DATE 22-06-24  TIME 12:52:20;
MODIFIED	= DATE 22-06-24  TIME 12:52:52;
FILE_NAME	= ;
VERSION		= 0;
LINE_COUNT	= 10;
MEMORY_SIZE	= 615;
PROTECT		= READ_WRITE;
TCD:  STACK_SIZE	= 0,
      TASK_PRIORITY	= 50,
      TIME_SLICE	= 0,
      BUSY_LAMP_OFF	= 0,
      ABORT_REQUEST	= 0,
      PAUSE_REQUEST	= 0;
DEFAULT_GROUP	= 1,*,*,*,*;
CONTROL_CODE	= 00000000 00000000;
LOCAL_REGISTERS	= 6,0,2;
/APPL

AUTO_SINGULARITY_HEADER;
  ENABLE_SINGULARITY_AVOIDANCE   : TRUE;  
  ARC Welding Equipment : 1,*,*,*,*;
/MN
   1:  !------------------------;
   1:  ! Fanuc Stitch Weld Plgin;
   1:  !------------------------;
   1:;
   1:  !  Starting PR;
   1:  R[10001]=AR[1];
   1:  !  Ending PR;
   2:  R[10002]=AR[2];
   1:  !  Weld Length;
   2:  R[10003]=AR[3];
   1:  !  Weld Pitch;
   2:  R[10003]=AR[4];
   1:  !  Weld Schedule;
   2:  R[10005]=AR[5];
   1:  !  Weld Speed;
   2:  R[10006]=AR[6];
   1:  !  Program Name;
   2:  SR[10001]=AR[7];
   3:   ;
   3:   ! Karel Routine generates TP;
   4:   CALL IPL_FANUC_SWELD_SET(R[10001],R[10002],R[10003],R[10004],R[10005],R[10006],SR[10001]);
   5:   ;
   6:   ! Run generated TP;
   7:   CALL SR[25];
   8:   ;
   9:   ;
  10:   ;
/POS
/END
