/PROG  _ANOTHER
/ATTR
OWNER		= MNEDITOR;
COMMENT		= "";
PROG_SIZE	= 246;
CREATE		= DATE 22-06-26  TIME 17:29:14;
MODIFIED	= DATE 22-06-26  TIME 22:33:54;
FILE_NAME	= ;
VERSION		= 0;
LINE_COUNT	= 1;
MEMORY_SIZE	= 622;
PROTECT		= READ_WRITE;
TCD:  STACK_SIZE	= 0,
      TASK_PRIORITY	= 50,
      TIME_SLICE	= 0,
      BUSY_LAMP_OFF	= 0,
      ABORT_REQUEST	= 0,
      PAUSE_REQUEST	= 0;
DEFAULT_GROUP	= 1,*,*,*,*;
CONTROL_CODE	= 00000000 00000000;
LOCAL_REGISTERS	= 0,0,0;
/APPL

AUTO_SINGULARITY_HEADER;
  ENABLE_SINGULARITY_AVOIDANCE   : FALSE;
  ARC Welding Equipment : 1,*,*,*,*;
/MN
   1:  CALL IPL_FANUC_SWELD_SETUP(1,2,1,4,1,25,'Dxml') ;
/POS
/END
