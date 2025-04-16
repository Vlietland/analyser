/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:      De functie Analyer (Analyser.c)                */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   In dit blok staan de routines die aangeroepen moeten worden om    */
/*   de berekeningen uit te voeren voor het coordinatenmanagement      */
/*   Het blok bevat de volgende functies                               */
/*     * Zcoordinatenberekening                                        */
/*     * 3Dberekening                                                  */
/*     * deltaphiberekening                                            */
/*     * schermpresentatie                                             */
/*                                                                     */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                  16 september 1996                           */
/*=====================================================================*/

#include	<graphics.h>
#include	<conio.h>
#include	<stdlib.h>
#include	<stdio.h>
#include	<dos.h>
#include	"struct.h"
#include	"constant.h"
#include	"prepare.ext"
#include	"mouse.ext"
#include	"buttons.ext"
#include	"scherm.h"
#include	"parser.h"
#include	"scramtxt.h"

		/* grapvarout.cpp */
extern void specialouttext(int Xposition,int Yposition, char text[]);

float Machinelist[maxmachine];
int   Xplaatslist[maxmachine];
int   Yplaatslist[maxmachine];
char  Toetsenlist[maxtekens ];
char  Formulelist[maxformule];

void Initialisation(void);
void colorinit(void);
void licenseinit(void);
void creatorinit(void);

main()

{
  int keuze = configkeuze;

  Initialisation();

    while(keuze != quitkeuze)
   {
    switch(keuze)

     {
      case analysekeuze	  :keuze = Analyseprepare();	break;
      case rotatekeuze	  :keuze = Deltaphiprepare();	break;
      case zoomkeuze	  :keuze = Zoomprepare();	break;
      case verplaatskeuze :keuze = Verplaatsprepare();	break;
      case zfactorkeuze	  :keuze = Zfactorprepare();	break;
      case configkeuze    :keuze = Configure();		break;
     }
   }

  Buttonin(buttonXpositie,quitbutYpositie);

  closegraph();
  printf("End of session !!!");

  return(0);
}

/*======================================================================*/
/*                                                                      */
/*======================================================================*/

void Initialisation(void)

{
  int gdriver = DETECT, gmode, errorcode;

  if (registerbgidriver(EGAVGA_driver) < 0)
    {
     printf("No graphicsdriver detected");
     exit(1);
    }

  initgraph(&gdriver, &gmode, "");

  errorcode = graphresult();
  if (errorcode != grOk)
    {
     printf("Graphics error: %s\n", grapherrormsg(errorcode));
     exit(1);
    }

  if (_8087 == 0)
    {
     printf("No Mathprocessor detected");
     exit(1);
    }

  directvideo = 1;
  colorinit();

			/* scherm veld */
  Create3Dfield(schermXmin+3,schermYmin+3,schermXmax-3,schermYmax-3,
		    schermkleur,schermlicht,schermschaduw);
			/* graphische veld */
  Create3Dfield(schermXgrmin-1,schermYgrmin-1,schermXgrmax+1,schermYgrmax+1,
		 formulabackgrkleur,schermlicht,schermschaduw);
			/* informatie+ button veld*/
  Create3Dfield(schermXinfmin-1,schermYinfmin-1,schermXinfmax+1,schermYinfmax+1,
		    infobackgrkleur,schermlicht,schermschaduw);
			/* formule button veld*/
  Create3Dfield(schermXfrmin-1,schermYfrmin-1,schermXfrmax+1,schermYfrmax+1,
		    infobackgrkleur,schermlicht,schermschaduw);
			/* creator button veld*/
  Create3Dfield(schermXcrmin-1,schermYcrmin-1,schermXcrmax+1,schermYcrmax+1,
		    infobackgrkleur,schermlicht,schermschaduw);
			/* coordinatie veld */
  Create3Dfield(schermXcsmin-1,schermYcsmin-1,schermXcsmax+1,schermYcsmax+1,
		    coorbackgrkleur,schermlicht,schermschaduw);
			/* informatie veld */
  Createcustombutton(schermXvarmin,schermYvarmin,schermXvarmax,schermYvarmax,
		     infobackgrkleur,schermlicht,schermschaduw);

  infoviewport;
  setcolor(extrainfotextkleur);
  outtextxy(colom1Xpositie,XYAnalysetextYpositie," X <Analyse> Y");
  outtextxy(colom1Xpositie,ZAnalysetextYpositie, "       Z");
  outtextxy(colom1Xpositie,XdomeintextYpositie,  " start <X> end");
  outtextxy(colom1Xpositie,YdomeintextYpositie,  " start <Y> end");
  outtextxy(colom1Xpositie,phitextYpositie,      "   X <angle> Z");
  outtextxy(colom2Xpositie,ZfactortextYpositie,  " Zfactor");
  outtextxy(colom1Xpositie,deltaCPtextYpositie,  "screen samples");
  outtextxy(colom1Xpositie,XsamplestextYpositie, "analyse samples");


			/* buttonveld */
  Createbutton(buttonXpositie,analysebutYpositie,"Analyse");
  Createbutton(buttonXpositie,rotatebutYpositie,"Rotate");
  Createbutton(buttonXpositie,verplaatsbutYpositie,"Shift");
  Createbutton(buttonXpositie,zoombutYpositie,"Zoom");
  Createbutton(buttonXpositie,zfactorbutYpositie,"Zfactor");
  Createbutton(buttonXpositie,configurebutYpositie,"Configure");
  Createbutton(buttonXpositie,quitbutYpositie,"Quit");

  formulaviewport;
  setcolor(extrainfotextkleur);
  outtextxy(formulaXfxytext,formulaYfxytext,"F(x,y) :");

  licenseinit();
  creatorinit();

  Toetsenlist[0] = eindelist;
  Machinelist[0] = machineeindelist;
  Xplaatslist[0] = machineeindelist;
  Yplaatslist[0] = machineeindelist;
}

void colorinit(void)
  {
   setpalette(zwart       , 0);
   setpalette(blauw       , 1);
   setpalette(groen       , 2);
   setpalette(cyan        , 3);
   setpalette(rood        , 4);
   setpalette(magenta     , 5);
   setpalette(bruin       , 6);
   setpalette(lichtblauw  , 9);
   setpalette(lichtgroen  ,10);
   setpalette(lichtcyan   ,11);
   setpalette(lichtrood   ,12);
   setpalette(lichtmagenta,13);
   setpalette(geel	  ,14);
  }

void licenseinit(void)
  {
   #define	licensetextlength		500

   char		licensetext[licensetextlength] = scrambletext;

   graphicviewport;

   setcolor(schermschaduw);
   outtextxy(Xformulacolom2+3,Yforhelppositie-30+3,"     !! Important Note !!");
   setcolor(wit);
   outtextxy(Xformulacolom2  ,Yforhelppositie-30,  "     !! Important Note !!");

   setcolor(blauw);
   descramble(licensetext,licensetextlength);
   specialouttext(-20,Yforhelppositie,licensetext);

   setcolor(extrainfotextkleur);
   outtextxy(Xformulacolom2,Yforreplypositie+buttontextoffset,"      < Press any key >");

   asm {
	pusha
	mov ax,0x0700
	int 0x21			/* getch(); */
	popa
       }
  }

void creatorinit(void)
  {
   int teller;
   float uitzoomfactor = 10;

   creatorviewport;
   while (uitzoomfactor > 1)
     {
      setcolor(schermschaduw);
      for(teller = 5; teller < 60; teller+=2)
	line((teller*0.7+8)/uitzoomfactor+5,(teller*0.8+8)/uitzoomfactor+5,
	    (30-teller*0.4+8)/uitzoomfactor+5,(80-teller+8)/uitzoomfactor+5);

      setcolor(rood);
      for(teller = 5; teller < 60; teller+=7)
	line((teller*0.7)/uitzoomfactor+5,(teller*0.4)/uitzoomfactor+5,
	    (30-teller*0.3)/uitzoomfactor+5,(80-teller)/uitzoomfactor+5);

      delay(15);

      uitzoomfactor -= 0.1;
     }
  }