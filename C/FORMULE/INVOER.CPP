/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:       Invoer Parser (Invoer.cpp)                    */
/* AUTEUR:               Resourser                                     */
/* BESCHRIJVING:                                                       */
/*   Dit programma test de invoer van de parser                        */
/*     * De invoer wordt op diverse punten gecontroleerd               */
/*     * Bij een backspace gaat het programma een actie terug          */
/*     * De toetsinvoer en de geparste invoer wordt apart bewaard      */
/*                                                                     */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                  22 oktober 1996                             */
/*=====================================================================*/

#include	<graphics.h>
#include	"buttons.ext"
#include	"constant.h"
#include	"scherm.h"
#include	"struct.h"
#include	"parser.h"


char Getteken(void);
void Resetbuffer(void);

extern char Toetsenlist[maxtekens];
extern char Formulelist[maxformule];


int Invoer(void)
  {
   int  toetsenlistplaats = 0;
   int  eindeinvoer = false;
   char teken[1];
   char *textptr;
   int  goed      = false;

   textptr = &teken[0];
   teken[0] = true;
   teken[1] = 0;

   moveto(Xformulacolom2,Yforinvoergrpositie+6);
   setcolor(infotextkleur);

   while (Toetsenlist[toetsenlistplaats] != eindelist)
     {
      teken[0] = Toetsenlist[toetsenlistplaats++];
      outtext(textptr);
     }

   outtext("Г");
   Resetbuffer();

   while (eindeinvoer == false)
     {
      teken[0] = Getteken();

      if  ((teken[0] != Return) && (teken[0] != Backspace))
	{
	 if (toetsenlistplaats < (maxtekens-1))  /* mag de array niet overschrijden */
	   {
	    Toetsenlist[toetsenlistplaats++] = teken[0];
	    setcolor(formulabackgrkleur);	/* karakter wissen */
	    moverel(-karakterbreedte,0);
	    outtext("л");
	    moverel(-karakterbreedte,0);
	    setcolor(infotextkleur);
	    outtext(textptr);
	    outtext("Г");
	    goed = true;
	   }
	}
      else if (teken[0] == Backspace)
	{
	 if (toetsenlistplaats > 0)
	   {
	    toetsenlistplaats--;		/* een plaatsje terug voor backspace */
	    setcolor(formulabackgrkleur);	/* karakter wissen */
	    moverel(-2*karakterbreedte,0);
	    outtext("лл");
	    moverel(-2*karakterbreedte,0);
	    setcolor(infotextkleur);
	    outtext("Г");
	    goed = true;
	   }
	}
      else eindeinvoer = true;
     }

   setcolor(formulabackgrkleur);	/* karakter wissen */
   moverel(-karakterbreedte,0);
   outtext("л");
   Toetsenlist[toetsenlistplaats] = eindelist;

   return(goed);
  }


/*-----------------------------------------------------------*/
char Getteken(void)
  {
   char teken;

   asm {
	pusha
	mov ax,0x0700
	int 0x21			/* teken = getch(); */
	mov teken,al
	popa
       }

   if ((teken <= Spatie) && (teken != Return) && (teken != Backspace))
     teken = Spatie;
   else if ((teken >= 'A') && (teken <= 'Z')) teken += 32;
   else if  (teken >  '}') teken = Spatie;

   Resetbuffer();

   return(teken);
  }

/*-----------------------------------------------------------*/
void Resetbuffer(void)
  {
   char bufferfull;

   asm{
       pusha
       mov ax,0x0B00
       int 0x21
       mov bufferfull, al
       popa
      }

   while (bufferfull == -1)
     {
      asm{
	  pusha
	  mov ax,0x0700
	  int 0x21

	  mov ax,0x0B00
	  int 0x21
	  mov bufferfull, al
	  popa
	 }
     }
  }

