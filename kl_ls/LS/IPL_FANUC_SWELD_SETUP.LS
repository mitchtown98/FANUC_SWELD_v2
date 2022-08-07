/PROG  IPL_FANUC_SWELD_SETUP
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
DEFAULT_GROUP	= *,*,*,*,*;
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
   1:  $[IPL_FANUC_SWELD_SET]ST_PR=AR[1];
   1:  !  Ending PR;
   2:  $[IPL_FANUC_SWELD_SET]EN_PR=AR[2];
   1:  !  Weld Length;
   2:  $[IPL_FANUC_SWELD_SET]SGLEN=AR[3];
   1:  !  Weld Pitch;
   2:  $[IPL_FANUC_SWELD_CFG]SGPITCH=AR[4];
   1:  !  Weld Schedule;
   2:  $[IPL_FANUC_SWELD_CFG]WSCHED=AR[5];
   1:  !  Weld Speed;
   2:  $[IPL_FANUC_SWELD_CFG]SGSPD=AR[6];
   1:  !  Program Name;
   2:  $[IPL_FANUC_SWELD_CFG]TP_NAME=AR[7];
   3:   ;
   3:   ! Karel Routine generates TP;
   4:   CALL IPL_FANUC_SWELD_SET;
   5:   ;
   6:   ! Run generated TP;
   7:   CALL SR[25];
   8:   ;
   9:   ;
  10:   ;
/POS
/END
