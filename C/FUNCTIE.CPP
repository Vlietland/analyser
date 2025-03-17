/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:      De te onderzoeken functie (functie.cpp)        */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*     Deze module rekent mbv de machinelist de functie door           */
/*       * eerst worden de X en Y plaatsen geinitialiseerd             */
/*       * nu wordt recursief de functie doorgelopen                   */
/*                                                                     */
/*                                                                     */
/*                                                                     */
/* INPUT PAR:              X,Y                                         */
/* OUPUT PAR:              Z                                           */
/* DATUM:                  16 september 1996                           */
/*=====================================================================*/

#include	<math.h>
#include	"struct.h"
#include	"parser.h"


extern float Machinelist[maxmachine];
extern int   Xplaatslist[maxmachine];
extern int   Yplaatslist[maxmachine];


float Tussenhaakjes(int *);


float Functie(point F)
  {
   int   Xplaats       = 0;
   int   Yplaats       = 0;
   float code          = 0;
   int   operation     = optelcode;
   float totaal        = 0;
   int   machineplaats = 0;
   float temp	       = 0;

   while (Xplaatslist[Xplaats] != machineeindelist)
     Machinelist[Xplaatslist[Xplaats++]] = F.X;

   while (Yplaatslist[Yplaats] != machineeindelist)
     Machinelist[Yplaatslist[Yplaats++]] = F.Y;

   code = Machinelist[machineplaats];

   while (code != machineeindelist)
     {
      if       (code < machtcode)			/* code is een getal */
	{
	 if       (operation == optelcode)  	          totaal += code;
	 else if  (operation == aftrekcode) 	          totaal -= code;
	 else if  (operation == maalcode)   	          totaal *= code;
	 else if  (operation == deelcode)
		{ if (code == 0) code = 1;		  totaal /= code;}
	 else if  (operation == machtcode)
		{ if	  (code   >   40)          code   =   40;
		  if      (totaal >  100)          totaal =  100;
		  else if (totaal < -100)	   totaal = -100;
		  else if (fabs(totaal) < 0.0001)  code   =    1;
		  else if (totaal < 0) code = (int)code;  totaal  = pow(totaal,code);}
	}

      else if (code < openhaakjecode)			/* code is een operatie */
	operation = code;

      else if (code < sluithaakjecode)
	{
	 temp = Tussenhaakjes(&machineplaats);
	 if       (code == openhaakjecode)	code = temp;
	 else if  (code == arctancode)		code = atan (temp);
	 else if  (code == arcsincode)		code = asin (temp);
	 else if  (code == arccoscode)		code = acos (temp);
	 else if  (code == tancode)		code = tan  (temp);
	 else if  (code == sincode)		code = sin  (temp);
	 else if  (code == coscode)		code = cos  (temp);
	 else if  (code == logcode)
		{ if (temp <= 0) temp =  1;     code = log10(temp);}
	 else if  (code == lincode)
		{ if (temp <= 0) temp =  1;     code = log10(temp);}
	 else if  (code == expcode)
		{ if (temp > 40) temp = 40;	code = exp  (temp);}
	 else if  (code == coshcode)		code = cosh (temp);
	 else if  (code == sinhcode)		code = sinh (temp);
	 else if  (code == abscode)		code = fabs (temp);

	 if       (operation == optelcode)  	          totaal += code;
	 else if  (operation == aftrekcode) 	          totaal -= code;
	 else if  (operation == maalcode)   	          totaal *= code;
	 else if  (operation == deelcode)
		{ if (code == 0) code = 1;		  totaal /= code;}
	 else if  (operation == machtcode)
		{ if	  (code   >   40)          code   =   40;
		  if      (totaal >  100)          totaal =  100;
		  else if (totaal < -100)	   totaal = -100;
		  else if (fabs(totaal) < 0.0001)  code   =    1;
		  else if (totaal < 0) code = (int)code;  totaal  = pow(totaal,code);}
	}
      if      (totaal > maxgetal) code = maxgetal;
      else if (totaal < mingetal) code = mingetal;

      code = Machinelist[++machineplaats];
     }


   return(totaal);
  }

float Tussenhaakjes(int *machineplaats)
  {
   float code          = 0;
   int   operation     = optelcode;
   float totaal        = 0;
   float temp	       = 0;

   code = Machinelist[++(*machineplaats)];

   while (code != sluithaakjecode)
     {
      if       (code < machtcode)			/* code is een getal */
	{
	 if       (operation == optelcode)  	          totaal += code;
	 else if  (operation == aftrekcode) 	          totaal -= code;
	 else if  (operation == maalcode)   	          totaal *= code;
	 else if  (operation == deelcode)
		{ if (code == 0) code = 1; 	    	  totaal /= code;}
	 else if  (operation == machtcode)
		{ if	  (code   >   40)          code   =   40;
		  if      (totaal >  100)          totaal =  100;
		  else if (totaal < -100)	   totaal = -100;
		  else if (fabs(totaal) < 0.0001)  code   =    1;
		  else if (totaal < 0) code = (int)code;  totaal  = pow(totaal,code);}
	}

      else if (code < openhaakjecode)			/* code is een operatie */
	operation = code;

      else if (code < sluithaakjecode)
	{
	 temp = Tussenhaakjes(machineplaats);
	 if       (code == openhaakjecode)	code = temp;
	 else if  (code == arctancode)		code = atan (temp);
	 else if  (code == arcsincode)		code = asin (temp);
	 else if  (code == arccoscode)		code = acos (temp);
	 else if  (code == tancode)		code = tan  (temp);
	 else if  (code == sincode)		code = sin  (temp);
	 else if  (code == coscode)		code = cos  (temp);
	 else if  (code == logcode)
		{ if (temp <= 0) temp =  1;     code = log10(temp);}
	 else if  (code == lincode)
		{ if (temp <= 0) temp =  1;     code = log10(temp);}
	 else if  (code == expcode)
		{ if (temp > 40) temp = 40;	code = exp  (temp);}
	 else if  (code == coshcode)		code = cosh (temp);
	 else if  (code == sinhcode)		code = sinh (temp);
	 else if  (code == abscode)		code = fabs (temp);

	 if       (operation == optelcode)  	          totaal += code;
	 else if  (operation == aftrekcode) 	          totaal -= code;
	 else if  (operation == maalcode)   	          totaal *= code;
	 else if  (operation == deelcode)
		{ if (code == 0) code = 1;	          totaal /= code;}
	 else if  (operation == machtcode)
		{ if	  (code   >   40)          code   =   40;
		  if      (totaal >  100)          totaal =  100;
		  else if (totaal < -100)	   totaal = -100;
		  else if (fabs(totaal) < 0.0001)  code   =    1;
		  else if (totaal < 0) code = (int)code;  totaal  = pow(totaal,code);}
	}
      if      (totaal > maxgetal) code = maxgetal;
      else if (totaal < mingetal) code = mingetal;

      code = Machinelist[++(*machineplaats)];
     }

   return(totaal);
  }

