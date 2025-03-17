/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:     Volgorde (M.V.D.W.O.A (Volgorde.c)              */
/* AUTEUR:             Resourser                                       */
/* BESCHRIJVING:                                                       */
/*    Deze routine plaatst haakjes rond de diverse operaties en        */
/*    zorgt daardoor dat de formule volgens de conventie wordt         */
/*    uitgevoerd.                                                      */
/*    * Bij het plaatsen van een sluithaakje wijst de ptr naar de      */
/*      code na het haakje. Dus het haakje moet erna geplaatst         */
/*      worden                                                         */
/*                                                                     */
/*    * Bij het plaatsen van een openhaakje wijst de ptr naar de       */
/*      code na het haakje. Dus het haakje moet erna geplaatst         */
/*      worden                                                         */
/*    Dit is gedaan omdat de ptr anders naar een plaats -1 kan wijzen  */
/*                                                                     */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                  22 oktober 1996                             */
/*=====================================================================*/

#include	"struct.h"
#include	"parser.h"

extern float Machinelist[maxmachine];

void Verwerkoperatie(int, int);
void Inserthaakjes(int, int);
int Zoekplaatsopen(int);
int Zoekplaatssluit(int);

void Volgorde(void)
  {
   Verwerkoperatie(machtcode,machineeindelist);
   Verwerkoperatie(maalcode,deelcode);
  }

void Verwerkoperatie(int zoekoperatie1, int zoekoperatie2)
  {
   int  machineplaats = 0;
   int  operatieplaats;
   int  openhaakjeplaats;
   int  sluithaakjeplaats;

   while (Machinelist[machineplaats] != machineeindelist)
       {
	if ((Machinelist[machineplaats] == zoekoperatie1) ||
	    (Machinelist[machineplaats] == zoekoperatie2))
	   {
	    operatieplaats = machineplaats;
		/* plaatsen van het openhaakje */
	       machineplaats--;
	       if (Machinelist[machineplaats] == sluithaakjecode)
		openhaakjeplaats = Zoekplaatsopen(operatieplaats);
	       else openhaakjeplaats = machineplaats;

	    machineplaats = operatieplaats;
		/* plaatsen van het sluithaakje */
	    machineplaats++;
	    if ((Machinelist[machineplaats] >= openhaakjecode ) &&
		(Machinelist[machineplaats]   <  sluithaakjecode))
	      sluithaakjeplaats = Zoekplaatssluit(operatieplaats);
	    else sluithaakjeplaats = ++machineplaats;

	    Inserthaakjes(openhaakjeplaats,sluithaakjeplaats);
	   }
	machineplaats++;
       }
  }

void Inserthaakjes(int openhaakjeplaats, int sluithaakjeplaats)
  {
   int nieuweplaats = maxmachine   -1;
   int oudeplaats   = nieuweplaats -2;

   while (sluithaakjeplaats <= oudeplaats)
     Machinelist[nieuweplaats--] = Machinelist[oudeplaats--];

   Machinelist[nieuweplaats--] = sluithaakjecode;

   while (openhaakjeplaats <= oudeplaats)
     Machinelist[nieuweplaats--] = Machinelist[oudeplaats--];

   Machinelist[nieuweplaats] = openhaakjecode;
  }

int Zoekplaatsopen(int machineplaats)
  {
   int haakjes = 0;

   do{
      machineplaats--;
      if ((Machinelist[machineplaats] >= openhaakjecode ) &&
	  (Machinelist[machineplaats] <  sluithaakjecode))
	haakjes++;
      else if (Machinelist[machineplaats] == sluithaakjecode) haakjes--;
     }
   while (haakjes != 0);

   return(machineplaats);
  }


int Zoekplaatssluit(int machineplaats)
  {
   int haakjes = 0;

   do{
      machineplaats++;
      if ((Machinelist[machineplaats] >= openhaakjecode ) &&
	  (Machinelist[machineplaats] <  sluithaakjecode))
	haakjes++;
      else if (Machinelist[machineplaats] == sluithaakjecode) haakjes--;
     }
   while (haakjes != 0);

   return(++machineplaats);
  }

