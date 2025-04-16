/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:      Machinetaal convert (Mconvert.c)               */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   Dit programma converteert de formulelist naar de machinelist      */
/*      * Omzetten van asciigetallen naar floats                       */
/*      * omzetten van speciale acties naar speciale getallen          */
/*      * omzetten van haakjes naar speciale getallen                  */
/*                                                                     */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                  22 oktober 1996                             */
/*=====================================================================*/

#include	"struct.h"
#include	"parser.h"

extern int   Checkstring(int, int *, char[]);

extern char  Formulelist[maxformule];
extern float Machinelist[maxmachine];


void Convertopenhaakje(int *, int *);
void Convertsluithaakje(int *, int *);
void Convertgetal(int *, int *);
void Convertvariabele(int *, int *);
void Convertoperatie(int *, int *);
void Convertspeciaal(int *, int *);

void ConverttoMachine(void)
  {
   int  formuleplaats = 0;
   int  machineplaats = 0;
   int  formuleteken  = Formulelist[formuleplaats];


   while (formuleteken != eindelist)
     {
      if       (formuleteken == '(')
	Convertopenhaakje(&formuleplaats,&machineplaats);

      else if  (formuleteken == ')')
	Convertsluithaakje(&formuleplaats,&machineplaats);

      else if (((formuleteken >= '0') && (formuleteken <= '9')) ||
		(formuleteken == '@'))
	Convertgetal(&formuleplaats,&machineplaats);

      else if ((formuleteken >= 'x') && (formuleteken <= 'y'))
	Convertvariabele(&formuleplaats,&machineplaats);

      else if ((formuleteken >= 'a') && (formuleteken <= 'w'))
	Convertspeciaal(&formuleplaats,&machineplaats);

      else Convertoperatie(&formuleplaats,&machineplaats);

      formuleteken = Formulelist[formuleplaats];
     }
   Machinelist[machineplaats] = machineeindelist;
  }

/*-----------------------------------------------------------*/
void Convertopenhaakje(int *formuleplaats,int *machineplaats)
  {
   Machinelist[(*machineplaats)++] = openhaakjecode;
   (*formuleplaats)++;
  }

/*-----------------------------------------------------------*/
void Convertsluithaakje(int *formuleplaats,int *machineplaats)
  {
   Machinelist[(*machineplaats)++] = sluithaakjecode;
   (*formuleplaats)++;
  }

/*-----------------------------------------------------------*/
void Convertgetal(int *formuleplaats,int *machineplaats)
  {
   int   voorkomma = 0;
   int   negatief  = 1;
   float achterkomma = 0;
   float factor = 1;
   char  formuleteken = Formulelist[*formuleplaats];

   if (formuleteken == '@')
     {
      negatief = -1;
      formuleteken = Formulelist[++(*formuleplaats)];
     }

   while ((formuleteken >= '0') && (formuleteken <= '9'))
     {
      (*formuleplaats)++;
      voorkomma *= 10;
      voorkomma += formuleteken - '0';
      formuleteken = Formulelist[*formuleplaats];
     }

   if (formuleteken == '.')
     {
      formuleteken = Formulelist[++(*formuleplaats)];
      while ((formuleteken >= '0') && (formuleteken <= '9'))
	{
	 (*formuleplaats)++;
	 factor /= 10;
	 achterkomma += ((formuleteken - '0') * factor);
	 formuleteken =  Formulelist[*formuleplaats];
	}
     }
   Machinelist[(*machineplaats)++] = (voorkomma + achterkomma) * negatief;
  }



/*-----------------------------------------------------------*/
void Convertvariabele(int *formuleplaats,int *machineplaats)
  {
   int formuleteken  = Formulelist[*formuleplaats];

   if (formuleteken == 'x') Machinelist[(*machineplaats)++] = Xvarcode;
   else Machinelist[(*machineplaats)++] = Yvarcode;

   (*formuleplaats)++;
  }

/*-----------------------------------------------------------*/
void Convertoperatie(int *formuleplaats,int *machineplaats)
  {
   int formuleteken  = Formulelist[*formuleplaats];

   if      (formuleteken == '^') Machinelist[(*machineplaats)++] = machtcode;
   else if (formuleteken == '*') Machinelist[(*machineplaats)++] = maalcode;
   else if (formuleteken == '/') Machinelist[(*machineplaats)++] = deelcode;
   else if (formuleteken == '+') Machinelist[(*machineplaats)++] = optelcode;
   else                          Machinelist[(*machineplaats)++] = aftrekcode;
   (*formuleplaats)++;
  }

/*-----------------------------------------------------------*/
void Convertspeciaal(int *formuleplaats,int *machineplaats)
  {
   int nieuweplaats = 0;

   if      (Checkstring(*formuleplaats,&nieuweplaats,"cos(") == true)
     Machinelist[(*machineplaats)++] = coscode;

   else if (Checkstring(*formuleplaats,&nieuweplaats,"sin(") == true)
     Machinelist[(*machineplaats)++] = sincode;

   else if (Checkstring(*formuleplaats,&nieuweplaats,"tan(") == true)
     Machinelist[(*machineplaats)++] = tancode;

   else if (Checkstring(*formuleplaats,&nieuweplaats,"arccos(") == true)
     Machinelist[(*machineplaats)++] = arccoscode;

   else if (Checkstring(*formuleplaats,&nieuweplaats,"arcsin(") == true)
     Machinelist[(*machineplaats)++] = arcsincode;

   else if (Checkstring(*formuleplaats,&nieuweplaats,"arctan(") == true)
     Machinelist[(*machineplaats)++] = arctancode;

   else if (Checkstring(*formuleplaats,&nieuweplaats,"exp(") == true)
     Machinelist[(*machineplaats)++] = expcode;

   else if (Checkstring(*formuleplaats,&nieuweplaats,"lin(") == true)
     Machinelist[(*machineplaats)++] = lincode;

   else if (Checkstring(*formuleplaats,&nieuweplaats,"log(") == true)
     Machinelist[(*machineplaats)++] = logcode;

   else if (Checkstring(*formuleplaats,&nieuweplaats,"cosh(") == true)
     Machinelist[(*machineplaats)++] = coshcode;

   else if (Checkstring(*formuleplaats,&nieuweplaats,"sinh(") == true)
     Machinelist[(*machineplaats)++] = sinhcode;

   else if (Checkstring(*formuleplaats,&nieuweplaats,"abs(") == true)
     Machinelist[(*machineplaats)++] = abscode;

   *formuleplaats = nieuweplaats;
  }