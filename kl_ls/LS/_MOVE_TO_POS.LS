/PROG  _MOVE_TO_POS
/ATTR
OWNER		= MNEDITOR;
COMMENT		= "";
PROG_SIZE	= 899;
CREATE		= DATE 22-07-21  TIME 13:46:24;
MODIFIED	= DATE 22-07-21  TIME 14:35:52;
FILE_NAME	= ;
VERSION		= 0;
LINE_COUNT	= 35;
MEMORY_SIZE	= 1259;
PROTECT		= READ_WRITE;
TCD:  STACK_SIZE	= 0,
      TASK_PRIORITY	= 50,
      TIME_SLICE	= 0,
      BUSY_LAMP_OFF	= 0,
      ABORT_REQUEST	= 0,
      PAUSE_REQUEST	= 0;
DEFAULT_GROUP	= 1,*,*,*,*;
CONTROL_CODE	= 00000000 00000000;
LOCAL_REGISTERS	= 8,1,0;
/APPL

AUTO_SINGULARITY_HEADER;
  ENABLE_SINGULARITY_AVOIDANCE   : FALSE;
  ARC Welding Equipment : 1,*,*,*,*;
/MN
   1:  !index ;
   2:  R[10001]=AR[1]-1    ;
   3:  !column offset ;
   4:  R[10002]=AR[2]    ;
   5:  !row offset ;
   6:  R[10003]=AR[3]    ;
   7:  !column max ;
   8:  R[10004]=AR[4]    ;
   9:  !row max ;
  10:  R[10005]=AR[5]    ;
  11:  !pr for offset ;
  12:  R[10006]=AR[6]    ;
  13:  PR[R[10006]]=LPOS-LPOS    ;
  14:   ;
  15:  ! current row = ;
  16:  ! index MOD max columns ;
  17:  R[10007]=R[10001] MOD R[10004]    ;
  18:  ! current col = ;
  19:  ! index DIV  max columns ;
  20:  R[10008]=R[10001] DIV R[10005]    ;
  21:  !Set offset X and Y ;
  22:  ! current column = ;
  23:  ! curr colum * column offset ;
  24:  R[10007]=R[10007]*R[10002]    ;
  25:   ;
  26:  ! current row = ;
  27:  ! curr row * row offset ;
  28:  R[10008]=R[10008]*R[10003]    ;
  29:   ;
  30:  !Apply offset X and Y ;
  31:  PR[R[10006],1]=R[10007]    ;
  32:  PR[R[10006],2]=R[10008]    ;
  33:   ;
  34:   ;
  35:   ;
/POS
/END
