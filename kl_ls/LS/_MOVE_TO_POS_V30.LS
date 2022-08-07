/PROG  _MOVE_TO_POS_V30
/ATTR
OWNER		= MNEDITOR;
COMMENT		= "";
PROG_SIZE	= 1077;
CREATE		= DATE 22-07-22  TIME 12:25:40;
MODIFIED	= DATE 22-07-22  TIME 13:02:46;
FILE_NAME	= ;
VERSION		= 0;
LINE_COUNT	= 53;
MEMORY_SIZE	= 1497;
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
   2:  R[91:index]=AR[1]-1    ;
   3:   ;
   4:  !column offset ;
   5:  R[92:colOffset]=AR[2]    ;
   6:   ;
   7:  !row offset ;
   8:  R[93:rowOffset]=AR[3]    ;
   9:   ;
  10:  !column max ;
  11:  R[94:colMax]=AR[4]    ;
  12:   ;
  13:  !row max ;
  14:  R[95:rowMax]=AR[5]    ;
  15:   ;
  16:  !pr for offset ;
  17:  R[96:temp]=AR[6]    ;
  18:  PR[R[96]]=LPOS-LPOS    ;
  19:   ;
  20:  !set major ;
  21:  R[99]=AR[7]    ;
  22:   ;
  22:  !-------------------------;
  23:  LBL[10:GetCurrentRow] ;
  24:  ! index MOD max row ;
  25:  R[97:currRow]=R[91:index] MOD R[95:rowMax]    ;
  26:   ;
  26:  !-------------------------; 
  26:  LBL[20:GetCurrentColumn] ;
  27:  ! index DIV  max columns ;
  28:  R[98:currCol]=R[91:index] DIV R[94:colMax]    ;
  29:   ;
  29:  !-------------------------;
  29:  LBL[30:SetRowOffset] ;
  30:  ! curr row * row offset ;
  31:  R[97:currRow]=R[97:currRow]*R[93:rowOffset]    ;
  32:   ;
  32:  !-------------------------;
  32:  LBL[40:SetColOffset] ;
  33:  ! curr column * column offset ;
  34:  R[98:currCol]=R[98:currCol]*R[92:colOffset]    ;
  35:   ;
  35:  !-------------------------;
  36:  LBL[50:ApplyTypeOffest] ;
  37:  SELECT R[99]=0,JMP LBL[51] ;
  38:         =1,JMP LBL[52] ;
  39:         ELSE,JMP LBL[99] ;
  40:   ;
  41:  LBL[51] ;
  42:  !  Col x Row Major ;
  43:  PR[R[96],1]=R[97:currRow]    ;
  44:  PR[R[96],2]=R[98:currCol]    ;
  45:  END ;
  46:   ;
  47:  LBL[52] ;
  48:  !  Row x Col Major ;
  49:  PR[R[96],1]=R[98:currCol]    ;
  50:  PR[R[96],2]=R[97:currRow]    ;
  51:   ;
  52:   ;
  53:  LBL[99] ;
/POS
/END
