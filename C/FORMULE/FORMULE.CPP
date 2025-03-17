/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:     Formule    (Formule.c)                          */
/* AUTEUR:             Resourser                                       */
/* BESCHRIJVING:                                                       */
/*   Dit programma zorgt voor de nieuwe invoer van de formule          */
/*   * invoer                                                          */
/*   * converteren van minteken en maaltekens                          */
/*   * checken van de formule                                          */
/*   * omzetten naar een machinetaallist (floats)                      */
/*   * meneer van dalen wacht op antwoord controle                     */
/*   * opzoeken van x-en en y-en voor een snelle formule doorloop      */
/*                                                                     */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                  22 oktober 1996                             */
/*=====================================================================*/

#include 	<graphics.h>
#include	"parser.h"
#include	"constant.h"
#include	"scherm.h"
#include	"struct.h"
#include	"buttons.ext"

extern int  Invoer(void);
extern void ConverttoFormule(void);
extern int  Check(void);
extern void ConverttoMachine(void);
extern void Volgorde(void);
extern void ZoekXenYplaatsen(void);

extern char  Toetsenlist[maxtekens ];
extern char  Formulelist[maxformule];
extern float Machinelist[maxmachine];

void Formule(void)

 {
  int goed;
  int foutplaats = false;

  graphicviewport;
  Createzoomfield(Xformulacolom1,Yforhelppositie,
		  Xformulacolom1+grapbuttonlengte,Yforhelppositie+grapbuttonbreedte,
		  formulabackgrkleur,buttonlicht,buttonschaduw,2);
  setcolor(extrainfotextkleur);
  outtextxy(Xformulacolom1+20,Yforhelppositie+buttontextoffset,"Type equation below");

  Createzoomfield(Xformulacolom1,Yforinvoergrpositie,
		  Xformulacolom1+grapbuttonlengte,Yforinvoergrpositie+grapbuttonbreedte,
		  formulabackgrkleur,buttonlicht,buttonschaduw,2);
  setcolor(extrainfotextkleur);
  outtextxy(Xformulacolom1+20,Yforinvoergrpositie+buttontextoffset,"F(x,y) :");

  while (foutplaats != true)
    {
     goed = Invoer();

     if (goed == true)
       {
	ConverttoFormule();
	foutplaats = Check();

	if (foutplaats == true)
	  {
	   ConverttoMachine();
	   Volgorde();
	   ZoekXenYplaatsen();

	   formulaviewport;
	   setcolor(formulabackgrkleur);
	   outtextxy(formulaXfxyformula,formulaYfxytext,"ллллллллллллллллллллллллллллллллллллллллллллллллллл");

	   setcolor(infotextkleur);
	   outtextxy(formulaXfxyformula,formulaYfxytext,Toetsenlist);
	  }
	else
	  {
	   Createzoomfield(Xformulacolom1,Yforfoutpositie,
			   Xformulacolom1+grapbuttonlengte,Yforfoutpositie+grapbuttonbreedte,
			   formulabackgrkleur,buttonlicht,buttonschaduw,4);
	   setcolor(extrainfotextkleur);
	   outtextxy(Xformulacolom2,Yforfoutpositie+buttontextoffset,"       Error in equation");

	   Createzoomfield(Xformulacolom1,Yforreplypositie,
			   Xformulacolom1+grapbuttonlengte,Yforreplypositie+grapbuttonbreedte,
			   formulabackgrkleur,buttonlicht,buttonschaduw,4);
	   setcolor(extrainfotextkleur);
	   outtextxy(Xformulacolom2,Yforreplypositie+buttontextoffset,"       < press any key >");

	   asm {
		pusha
		mov ax,0x0700
		int 0x21			/* getch(); */
		popa
	       }

	   setcolor(formulabackgrkleur);
	   outtextxy(Xformulacolom2,Yforfoutpositie+buttontextoffset,"       лллллллллллллллллл");
	   outtextxy(Xformulacolom2,Yforreplypositie+buttontextoffset,"       лллллллллллллллллл");
	  }
       }
     else foutplaats = true;
    }
 }

