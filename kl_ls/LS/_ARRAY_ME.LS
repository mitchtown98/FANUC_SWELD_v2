/PROG  _ARRAY_ME
/ATTR
OWNER		= MNEDITOR;
COMMENT		= "";
PROG_SIZE	= 1730;
CREATE		= DATE 22-07-20  TIME 15:18:32;
MODIFIED	= DATE 22-07-20  TIME 15:57:38;
FILE_NAME	= _ARRAY_M;
VERSION		= 0;
LINE_COUNT	= 61;
MEMORY_SIZE	= 2118;
PROTECT		= READ_WRITE;
TCD:  STACK_SIZE	= 0,
      TASK_PRIORITY	= 50,
      TIME_SLICE	= 0,
      BUSY_LAMP_OFF	= 0,
      ABORT_REQUEST	= 0,
      PAUSE_REQUEST	= 7;
DEFAULT_GROUP	= 1,*,*,*,*;
CONTROL_CODE	= 00000000 00000000;
LOCAL_REGISTERS	= 0,2,0;
/APPL

AUTO_SINGULARITY_HEADER;
  ENABLE_SINGULARITY_AVOIDANCE   : TRUE;
  ARC Welding Equipment : 1,*,*,*,*;
/MN
   1:  !Exmaple of Part Array ;
   2:  ! Use any UT and UF ;
   3:  UFRAME_NUM=1 ;
   4:  //UTOOL_NUM=2 ;
   5:  !Init Registers ;
   6:  R[1:index]=0    ;
   7:  R[7:currCol]=0    ;
   8:  R[8:currRow]=0    ;
   9:  PR[10001]=LPOS-LPOS    ;
  10:  PR[10002]=LPOS-LPOS    ;
  11:   ;
  12:  !Approach  offset Z ;
  13:  PR[10001,3]=R[9:apprchOff]    ;
  14:   ;
  15:  !Set Total Parts ;
  16:  R[4:totalParts]=R[2:colMax]*R[3:rowMax]    ;
  17:   ;
  18:  !------------------- ;
  19:  LBL[10] ;
  20:  !Pick Part ;
  21:  ! current row = ;
  22:  ! index MOD max columns ;
  23:  R[7:currCol]=R[1:index] MOD R[2:colMax]    ;
  24:   ;
  25:  ! current col = ;
  26:  ! index DIV  max columns ;
  27:  R[8:currRow]=R[1:index] DIV R[3:rowMax]    ;
  28:   ;
  29:  !Set offset X and Y ;
  30:  ! current column = ;
  31:  ! curr colum * column offset ;
  32:  R[7:currCol]=R[7:currCol]*R[5:colOffset]    ;
  33:   ;
  34:  ! current row = ;
  35:  ! curr row * row offset ;
  36:  R[8:currRow]=R[8:currRow]*R[6:rowOffset]    ;
  37:   ;
  38:  !Apply offset X and Y ;
  39:  PR[10002,1]=R[7:currCol]    ;
  40:  PR[10002,2]=R[8:currRow]    ;
  41:   ;
  42:  !Use taugh pos with ;
  43:  ! updated PR for Offset ;
  44:J P[1] 100% CNT50 Offset,PR[10002] Tool_Offset,PR[10001]    ;
  45:   ;
  46:J P[1] 100% FINE Offset,PR[10002]    ;
  47:   ;
  48:J P[1] 100% CNT50 Offset,PR[10002] Tool_Offset,PR[10001]    ;
  49:   ;
  50:  WAIT    .50(sec) ;
  51:   ;
  52:  !Increment Index Counter ;
  53:  R[1:index]=R[1:index]+1    ;
  54:   ;
  55:  !Total Parts sets loop counter ;
  56:  IF R[1:index]<R[4:totalParts],JMP LBL[10] ;
  57:   ;
  58:  END ;
  59:  !Touchup ;
  60:J P[1] 100% FINE    ;
  61:   ;
/POS
P[1]{
   GP1:
	UF : 1, UT : 2,		CONFIG : 'N U T, 0, 0, 0',
	X =    70.943153  mm,	Y =    64.617180  mm,	Z =   130.943314  mm,
	W =   179.999939 deg,	P =     -.000015 deg,	R =   -87.341118 deg
};
/END
