/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:      De muisroutine  (Mouse.c)                      */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*    Deze routine bevat twee functies:                                */
/*     * getmousekeuze                                                 */
/*     * getdeltamouse                                                 */
/*      Getmousekeuze geeft de keuze terug die gekozen is met de muis  */
/*      Deze keuze wordt bepaald omdat het scherm in stukjes verdeeld  */
/*      wordt. Elk stukje van het scherm geeft een keuze               */
/*      Getdeltamouse geeft het aantal pixels waarin het scherm tov    */
/*      de vorige poll verschoven is                                   */
/*                                                                     */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                  16 september 1996                           */
/*=====================================================================*/

#include	<stdio.h>
#include	"struct.h"
#include	"scherm.h"
#include	"constant.h"

#define		linkerknop_in		1
#define		onmogelijk	      100
#define		niksgekozen	     -128

#define         Xnabeginbutton	     schermXinfmin + buttonXpositie
#define		Xvooreindebutton     Xnabeginbutton + buttonlengte

int  Muisbinnenvlak(int, int, int, int, int, int);
void Hidemouse(void);
void Showmouse(void);


int Getmousekeuze(void)

{
 int  keuze = niksgekozen;
 int  knoppenstand;
 int  Xmuis,Ymuis;
 bool binnenvlak;

do   {
      Showmouse();

      do{
	 asm{
	     pusha
	     mov ax,3		/* bepaal de knoppenstand */
	     int 0x33
	     mov knoppenstand,bx
	     mov Xmuis,cx
	     mov Ymuis,dx
	     popa
	    }
	}
	 while (knoppenstand != linkerknop_in);

      do{		/* mousepointer binnen graphische vlak */
	 binnenvlak = Muisbinnenvlak(schermXgrmin,schermYgrmin,
				     schermXgrmax,schermYgrmax,
				     Xmuis,Ymuis);
	 if (binnenvlak == true) {
				  keuze = graphkeuze;
				  break;
				 }
				/* mousepointer op de analysebutton */
	 binnenvlak = Muisbinnenvlak(Xnabeginbutton,
				     schermYinfmin+analysebutYpositie,
				     Xvooreindebutton,
				     schermYinfmin+analysebutYpositie+buttonbreedte,
				     Xmuis,Ymuis);
	 if (binnenvlak == true) {
				  keuze = analysekeuze;
				  break;
				 }

			/* mousepointer op de rotatebutton */
	 binnenvlak = Muisbinnenvlak(Xnabeginbutton,
				     schermYinfmin+rotatebutYpositie,
				     Xvooreindebutton,
				     schermYinfmin+rotatebutYpositie+buttonbreedte,
				     Xmuis,Ymuis);
	 if (binnenvlak == true) {
				  keuze = rotatekeuze;
				  break;
				 }
			/* mousepointer op de verplaatsbutton */
	 binnenvlak = Muisbinnenvlak(Xnabeginbutton,
				     schermYinfmin+verplaatsbutYpositie,
				     Xvooreindebutton,
				     schermYinfmin+verplaatsbutYpositie+buttonbreedte,
				     Xmuis,Ymuis);
	 if (binnenvlak == true) {
				  keuze = verplaatskeuze;
				  break;
				 }
			/* mousepointer op de zoombutton */
	 binnenvlak = Muisbinnenvlak(Xnabeginbutton,
				     schermYinfmin+zoombutYpositie,
				     Xvooreindebutton,
				     schermYinfmin+zoombutYpositie+buttonbreedte,
				     Xmuis,Ymuis);
	 if (binnenvlak == true) {
				  keuze = zoomkeuze;
				  break;
				 }
			/* mousepointer op de zfactorbutton */
	 binnenvlak = Muisbinnenvlak(Xnabeginbutton,
				     schermYinfmin+zfactorbutYpositie,
				     Xvooreindebutton,
				     schermYinfmin+zfactorbutYpositie+buttonbreedte,
				     Xmuis,Ymuis);
	 if (binnenvlak == true) {
				  keuze = zfactorkeuze;
				  break;
				 }
			/* mousepointer op de configurebutton */
	 binnenvlak = Muisbinnenvlak(Xnabeginbutton,
				     schermYinfmin+configurebutYpositie,
				     Xvooreindebutton,
				     schermYinfmin+configurebutYpositie+buttonbreedte,
				     Xmuis,Ymuis);
	 if (binnenvlak == true) {
				  keuze = configkeuze;
				  break;
				 }
			/* mousepointer op de quitbutton */
	 binnenvlak = Muisbinnenvlak(Xnabeginbutton,
				     schermYinfmin+quitbutYpositie,
				     Xvooreindebutton,
				     schermYinfmin+quitbutYpositie+buttonbreedte,
				     Xmuis,Ymuis);
	 if (binnenvlak == true)  keuze = quitkeuze;

	}
      while (keuze == onmogelijk);	/* wordt nooit 255 */


      if (keuze != graphkeuze)
	{
	 do{
	    asm{
		pusha
		mov ax,3		/* bepaal de knoppenstand */
		int 0x33
		mov knoppenstand,bx
		mov Xmuis,cx
		mov Ymuis,dx
		popa
	       }
	   }
	 while (knoppenstand == linkerknop_in);
	}
     }
 while(keuze == niksgekozen);

 Hidemouse();

 return(keuze);
}

/*-----------------------------------------------------------------*/
intpoint Getdeltamouse(int *knop)

{
 static int oldXmuis,oldYmuis;
 intpoint deltamouse;
 int Xmuis,Ymuis;
 int knoppenstand;

 do {
     asm{
	 pusha
	 mov ax,3		/* bepaal de knoppenstand */
	 int 0x33
	 mov knoppenstand,bx
	 mov Xmuis,cx
	 mov Ymuis,dx
	 popa
	}
     if (knoppenstand == 1)
	  {
	   deltamouse.X = Xmuis - oldXmuis;
	   deltamouse.Y = oldYmuis - Ymuis; /* omgedraaid omdat de coordinaten */
	   *knop = 1;			    /* van boven naar beneden lopen */
	  }

     else {
	   deltamouse.X = 0;
	   deltamouse.Y = 0;
	   *knop = 0;
	  }
    }
 while((deltamouse.X == 0) && (deltamouse.Y == 0) && (*knop == 1));

 oldXmuis = Xmuis;
 oldYmuis = Ymuis;

 return(deltamouse);

}
/*-----------------------------------------------------------------*/

int Muisbinnenvlak(int Xmin, int Ymin,
		   int Xmax, int Ymax,
		   int Xmuis ,int Ymuis)

  {
   if		/* muispointer binnen het vlak ?? */
     (
      (Xmuis >= Xmin) && (Ymuis >= Ymin) &&
      (Xmuis <= Xmax) && (Ymuis <= Ymax)
     )
      return(true);

   else return(false);
  }

/*-----------------------------------------------------------------*/
void Showmouse(void)

  {
   asm{
       pusha
       mov ax,1		/* show mouse */
       int 0x33
       popa
      }
  }

/*-----------------------------------------------------------------*/
void Hidemouse(void)

  {
   asm{
       pusha
       mov ax,2		/* hide mouse */
       int 0x33
       popa
      }
  }
