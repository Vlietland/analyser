/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:      zoekt de X en Y variabelen (zoekX&Y.c)         */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   Deze routine zoekt de X en Y plaatsen en bewaard deze in een      */
/*   array                                                             */
/*                                                                     */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                  22 oktober 1996                             */
/*=====================================================================*/

#include	"struct.h"
#include	"parser.h"

extern float Machinelist[maxmachine];
extern int   Xplaatslist[maxmachine];
extern int   Yplaatslist[maxmachine];


void ZoekXenYplaatsen(void)
  {
   int Xplaats = 0;
   int Yplaats = 0;
   int machineplaats = 0;

   while (Machinelist[machineplaats] != machineeindelist)
     {
      if (Machinelist[machineplaats] == Xvarcode)
	Xplaatslist[Xplaats++] = machineplaats;
      else if (Machinelist[machineplaats] == Yvarcode)
	Yplaatslist[Yplaats++] = machineplaats;
      machineplaats++;
     }
   Xplaatslist[Xplaats] = machineeindelist;
   Yplaatslist[Yplaats] = machineeindelist;
  }

