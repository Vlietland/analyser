/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:     Checkstring (String.cpp)                        */
/* AUTEUR:             Resourser                                       */
/* BESCHRIJVING:                                                       */
/*     Dit programma checkt een deel van een string een geeft          */
/*     wanneer deze string gevonden is in de formulelist een           */
/*     boolean goed terug                                              */
/*                                                                     */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                  22 oktober 1996                             */
/*=====================================================================*/

#include	"struct.h"
#include	"parser.h"

extern char  Formulelist[maxformule];


int Checkstring(int plaats,int *nieuweplaats,char text[])
  {
   int goed = true;
   int teller;

   for (teller = 0; ((text[teller] != 0)  && (goed == true)); teller++)
     if (Formulelist[plaats+teller] != text[teller]) goed = false;

   *nieuweplaats = plaats+teller;

   return(goed);
  }


