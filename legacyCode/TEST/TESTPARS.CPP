/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:	Test Parser (TestPars.c)	               */
/* AUTEUR:		Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   Dit programma test de invoer van de parser			       */
/*     * De invoer wordt op diverse punten gecontroleerd               */
/*     * Bij een backspace gaat het programma een actie terug	       */
/*     * De toetsinvoer en de geparste invoer wordt apart bewaarde     */
/*                                                                     */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                  22 oktober 1996                             */
/*=====================================================================*/

#include 	<graphics.h>
#include 	<stdio.h>
#include 	<stdlib.h>
#include	<conio.h>
#include	"parser.h"
#include	"buttons.ext"
#include	"struct.h"

extern int   Formule(void);
extern float Functie(point);

float Machinelist[maxmachine];
int   Xplaatslist[maxmachine];
int   Yplaatslist[maxmachine];
char  Toetsenlist[maxtekens ];
char  Formulelist[maxformule];

main()

 {
  int gdriver = DETECT, gmode, errorcode;

  initgraph(&gdriver, &gmode, "");
    errorcode = graphresult();

  if (errorcode != grOk)
    {
     printf("Graphics error: %s\n",(errorcode));
     abort();
    }

  Toetsenlist[0] = eindelist;
  Machinelist[0] = machineeindelist;
  Xplaatslist[0] = machineeindelist;
  Yplaatslist[0] = machineeindelist;

  Formule();

  point F = {2,2};
  getch();
  printf("\n\n%f",Functie(F));

  return(0);
 }