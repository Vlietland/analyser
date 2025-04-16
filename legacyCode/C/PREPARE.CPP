/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:      De functies (Prepare.c)                        */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*    In deze module staan de functies die zorg dragen voor de         */
/*    bewerkingen op het functieonderzoek                              */
/*    Elke functie wordt aangeroepen via main                          */
/*                                                                     */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                  16 september 1996                           */
/*=====================================================================*/

#define		rotatespeed         0.01
#define		zoomspeed           0.1
#define		verplaatsspeed      0.1
#define		zfactorspeed        0.1
#define		analysespeed        1.5


#include	<dos.h>
#include	<graphics.h>
#include	<stdio.h>
#include	"struct.h"
#include	"constant.h"
#include	"variabel.ext"
#include	"buttons.ext"
#include	"scherm.h"
#include	"mouse.ext"


extern void Formule(void);
extern int  Xsamples(void);


int Analyseprepare(void)
  {
   intpoint verplaats;
   int   keuze;
   intpoint deltamouse;
   int   knop;

   Buttonin(buttonXpositie,analysebutYpositie);
   verplaats.X = verplaats.Y = 0;
   Analyse(verplaats); 			/* teken cursor op een plaats */
   do {

       keuze = Getmousekeuze();
       if (keuze == graphkeuze)
	 {
	  Getdeltamouse(&knop);		/* initialisatie van getdeltamouse */
	  while (knop == 1)             /* controleer of de knop nog is ingedrukt */
		 {
		  deltamouse       = Getdeltamouse(&knop);
		  verplaats.X = verplaats.Y = 0; /* verwijder cursor op de oude plaats */
		  Analyse(verplaats);
		  verplaats.X = deltamouse.X * analysespeed;
		  verplaats.Y = deltamouse.Y * analysespeed;
		  Analyse(verplaats);		 /* teken nieuwe cursor op de nieuwe plaats */
		  delay(50);			 /* cursor tenminste 50 mS zichtbaar */
		 }
	  keuze = analysekeuze;
	 }
      }
   while (keuze == analysekeuze);

   Buttonout(buttonXpositie,analysebutYpositie);
   verplaats.X = verplaats.Y = 0;
   Analyse(verplaats);			/* verwijder cursor op de oude plaats */

   setcolor(infobackgrkleur);		/* verwijder text */
   infoviewport;
   outtextxy(colom1Xpositie,XYAnalyseYpositie,"ллллллллллллллл");
   outtextxy(colom1Xpositie,ZAnalyseYpositie,"ллллллллллллллл");

   return(keuze);
  }


int Deltaphiprepare(void)
  {
   phipoint deltaphi;
   int keuze;
   intpoint deltamouse;
   int knop;

   Buttonin(buttonXpositie,rotatebutYpositie);

   do {
       keuze = Getmousekeuze();
       if (keuze == graphkeuze)
	 {
	  Getdeltamouse(&knop);		/* initialisatie van getdeltamouse */
	  while (knop == 1)             /* controleer of de knop nog is ingedrukt */
		 {
		  deltamouse = Getdeltamouse(&knop);
		  deltaphi.X = deltamouse.Y * rotatespeed; /* Ymuis --> rotatie X-as */
		  deltaphi.Z = deltamouse.X * rotatespeed; /* Xmuis --> rotatie Y-as */

		  Deltaphi(deltaphi);
		  FastD3schermpresentatie();
		 }
	  keuze = rotatekeuze;
	  FullD3schermpresentatie();
	 }
      }
   while (keuze == rotatekeuze);

   Buttonout(buttonXpositie,rotatebutYpositie);

   return(keuze);
  }

int Verplaatsprepare(void)
  {
   intpoint verplaats;
   int keuze;
   intpoint deltamouse;
   int knop;

   Buttonin(buttonXpositie,verplaatsbutYpositie);

   do {
       keuze = Getmousekeuze();
       if (keuze == graphkeuze)
	 {
	  Getdeltamouse(&knop);		/* initialisatie van getdeltamouse */
	  while (knop == 1)             /* controleer of de knop nog is ingedrukt */
		 {
		  deltamouse  = Getdeltamouse(&knop);
		  verplaats.X = deltamouse.X * verplaatsspeed;
		  verplaats.Y = deltamouse.Y * verplaatsspeed;

		  Verplaatsing(verplaats);
		  FastD3schermpresentatie();
		 }
	  keuze = verplaatskeuze;
	  FullD3schermpresentatie();
	 }
      }
   while (keuze == verplaatskeuze);

   Buttonout(buttonXpositie,verplaatsbutYpositie);

   return(keuze);
  }

int Zoomprepare(void)
  {
   int dzoomfac;
   int keuze;
   intpoint deltamouse;
   int knop;

   Buttonin(buttonXpositie,zoombutYpositie);

   do {
       keuze = Getmousekeuze();
       if (keuze == graphkeuze)
	 {
	  Getdeltamouse(&knop);		/* initialisatie van getdeltamouse */
	  while (knop == 1)             /* controleer of de knop nog is ingedrukt */
		 {
		  deltamouse = Getdeltamouse(&knop);
		  dzoomfac   = deltamouse.Y * zoomspeed;
		  Zoom(dzoomfac);
		  FastD3schermpresentatie();
		 }
	  keuze = zoomkeuze;
	  FullD3schermpresentatie();
	 }
      }
   while (keuze == zoomkeuze);

   Buttonout(buttonXpositie,zoombutYpositie);

   return(keuze);
  }

int Zfactorprepare(void)
  {
   float deltazfactor;
   int   keuze;
   intpoint deltamouse;
   int   knop;

   Buttonin(buttonXpositie,zfactorbutYpositie);

   do {
       keuze = Getmousekeuze();
       if (keuze == graphkeuze)
	 {
	  Getdeltamouse(&knop);		/* initialisatie van getdeltamouse */
	  while (knop == 1)             /* controleer of de knop nog is ingedrukt */
		 {
		  deltamouse   = Getdeltamouse(&knop);
		  deltazfactor = deltamouse.Y * zfactorspeed;
		  Zfactor(deltazfactor);
		  FastD3schermpresentatie();
		 }
	  keuze = zfactorkeuze;
	  FullD3schermpresentatie();
	 }
      }
   while (keuze == zfactorkeuze);

   Buttonout(buttonXpositie,zfactorbutYpositie);

   return(keuze);

  }


int Configure(void)
  {
   int keuze;
   int newXsamples;

   do {
       Buttonin(buttonXpositie,configurebutYpositie);

       graphicviewport;
       Create3Dfield(0,0,schermXgrmax-schermXgrmin,schermYgrmax-schermYgrmin,
		     formulabackgrkleur,formulabackgrkleur,formulabackgrkleur);

       Formule();
       newXsamples = Xsamples();

       if (newXsamples == false) newXsamples = defaultXsamples;

       Buttonout(buttonXpositie,configurebutYpositie);

       Varinit(defaultXmin,defaultXmax,defaultYmin,defaultYmax,newXsamples,
	       defaultzfactor,defaultPhiX,defaultPhiZ);

       FullD3schermpresentatie();

       do {keuze = Getmousekeuze(); delay(100); } while (keuze == graphkeuze);
      }
   while (keuze == configkeuze);

   return(keuze);
  }

