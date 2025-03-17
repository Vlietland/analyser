/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:       Xsamples (Xsamples.cpp)                       */
/* AUTEUR:               Resourser                                     */
/* BESCHRIJVING:                                                       */
/*    Dit programma vraagt om de nieuwe aantal Xsamples                */
/*    Bij een return wordt de oude de nieuwe waarde                    */
/*                                                                     */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                  3 november 1996                             */
/*=====================================================================*/

#include 	<graphics.h>
#include	<conio.h>
#include 	"buttons.ext"
#include 	"constant.h"
#include 	"struct.h"
#include 	"scherm.h"


char Getcijfer(void);

int Xsamples(void)
  {
   int  newsamples = false;
   char teken[1];
   char *textptr;

   textptr = &teken[0];
   teken[1] = 0;

   graphicviewport;
   Createzoomfield(Xformulacolom1,YXsampleshelppositie,
		  Xformulacolom1+grapbuttonlengte,YXsampleshelppositie+grapbuttonbreedte,
		  formulabackgrkleur,buttonlicht,buttonschaduw,2);
   setcolor(extrainfotextkleur);
   outtextxy(Xformulacolom1+20,YXsampleshelppositie+buttontextoffset,"Type number of Samples");

   Createzoomfield(Xformulacolom1,YXsamplesinvoerpositie,
		  Xformulacolom1+grapbuttonlengte,YXsamplesinvoerpositie+grapbuttonbreedte,
		  formulabackgrkleur,buttonlicht,buttonschaduw,2);

   setcolor(extrainfotextkleur);
   outtextxy(Xformulacolom1+20,YXsamplesinvoerpositie+buttontextoffset,"Samples :");
   moveto(Xformulacolom2+20,YXsamplesinvoerpositie+buttontextoffset);
   setcolor(infotextkleur);

   teken[0] = Getcijfer();
   if (teken[0] != Return)
     {
      newsamples = 0;
      outtext(textptr);
      teken[0] -= '0';
      newsamples += teken[0];

      teken[0] = Getcijfer();
      if (teken[0] != Return)
	{
	 outtext(textptr);
	 teken[0] -= '0';
	 newsamples *= 10;
	 newsamples += teken[0];
	}
     }
   return(newsamples);
  }


char Getcijfer(void)
  {
   char teken = 0;

   while (teken == 0)
     {
      asm {
	   pusha
	   mov ax,0x0700
	   int 0x21			/* teken = getch(); */
	   mov teken,al
	   popa
	  }

      if (((teken < '0') || (teken > '9')) && (teken != Return))
	teken = 0;
     }
   return(teken);
  }
