/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:      Check Parser (Check.cpp)                       */
/* AUTEUR:              Resourser                                      */
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

#include	<stdio.h>
#include	"struct.h"
#include	"parser.h"

extern int  Checkstring(int, int *, char[]);

extern char Formulelist[maxformule];


int  Naopenhaakjecheck(int, int *, int *);
int  Nasluithaakjecheck(int, int *, int *);
int  Namintekencheck(int, int *, int *);
int  Nagetalcheck(int, int *, int *);
int  Naoperatiecheck(int, int *, int *);

int  Checkstring(int, int *, char[]);
int  Checkgetal(int, int *);
int  Checkspeciaal(int, int *);
int  Haakjes(int, int *);


int Check(void)
  {
   int  goed = true;
   int  formulelistplaats = 0;
   int  nieuweplaats      = 0;

   int  laatsteactie      = 0;
   int  nieuweactie;
   int  foutplaats	  = goed;
   int  aantalhaakjes     = 0; 	/* omdat de eerste actie een fantoom openhaakje is */


   while ((Formulelist[formulelistplaats] != eindelist) && (goed == true))
     {
      if     ((laatsteactie == openhaakje) || (formulelistplaats == 0))
	goed = Naopenhaakjecheck(formulelistplaats,&nieuweplaats,&nieuweactie);
      else if (laatsteactie == minteken)
	goed = Namintekencheck(formulelistplaats,&nieuweplaats,&nieuweactie);
      else if (laatsteactie == getal)
	goed = Nagetalcheck(formulelistplaats,&nieuweplaats,&nieuweactie);
      else if (laatsteactie == sluithaakje)
	goed = Nasluithaakjecheck(formulelistplaats,&nieuweplaats,&nieuweactie);
      else if (laatsteactie == operatie)
	goed = Naoperatiecheck(formulelistplaats,&nieuweplaats,&nieuweactie);
      else goed = false;

      if  (goed == true)
	{
	 laatsteactie      = nieuweactie;
	 formulelistplaats = nieuweplaats;
	 if      (laatsteactie == openhaakje) goed = Haakjes(openhaakje,&aantalhaakjes);
	 else if (laatsteactie == sluithaakje) goed = Haakjes(sluithaakje,&aantalhaakjes);
	}
     }
   if (
       ( goed != true) || (aantalhaakjes != 0) ||
       ((laatsteactie != sluithaakje) && (laatsteactie != getal))
      )
     foutplaats = formulelistplaats;

   return(foutplaats);
  }

/*-----------------------------------------------------------*/
int Naopenhaakjecheck(int formulelistplaats,int *nieuweplaats,int *nieuweactie)
  {
   int goed = true;

   if      (Checkspeciaal(formulelistplaats,nieuweplaats) == true)
      *nieuweactie  = openhaakje;
   else if (Checkstring(formulelistplaats,nieuweplaats,"(") == true)
      *nieuweactie  = openhaakje;
   else if (Checkstring(formulelistplaats,nieuweplaats,"@") == true)
      *nieuweactie  = minteken;
   else if (Checkstring(formulelistplaats,nieuweplaats,"x") == true)
      *nieuweactie  = getal;
   else if (Checkstring(formulelistplaats,nieuweplaats,"y") == true)
      *nieuweactie  = getal;
   else if (Checkgetal(formulelistplaats,nieuweplaats) == true)
      *nieuweactie  = getal;
   else goed = false;

   return(goed);
  }
/*-----------------------------------------------------------*/
int Namintekencheck(int formulelistplaats,int *nieuweplaats,int *nieuweactie)
  {
   int goed = true;

   if      (Checkspeciaal(formulelistplaats,nieuweplaats) == true)
      *nieuweactie  = openhaakje;
   else if (Checkstring(formulelistplaats,nieuweplaats,"(") == true)
      *nieuweactie  = openhaakje;
   else if (Checkstring(formulelistplaats,nieuweplaats,"x") == true)
      *nieuweactie  = getal;
   else if (Checkstring(formulelistplaats,nieuweplaats,"y") == true)
      *nieuweactie  = getal;
   else if (Checkgetal(formulelistplaats,nieuweplaats) == true)
      *nieuweactie  = getal;
   else goed = false;

   return(goed);
  }
/*-----------------------------------------------------------*/
int Nagetalcheck(int formulelistplaats,int *nieuweplaats,int *nieuweactie)
  {
   int goed = true;

   if      (Checkstring(formulelistplaats,nieuweplaats,"+") == true)
      *nieuweactie  = operatie;
   else if (Checkstring(formulelistplaats,nieuweplaats,"-") == true)
      *nieuweactie  = minteken;
   else if (Checkstring(formulelistplaats,nieuweplaats,"*") == true)
      *nieuweactie  = operatie;
   else if (Checkstring(formulelistplaats,nieuweplaats,"/") == true)
      *nieuweactie  = operatie;
   else if (Checkstring(formulelistplaats,nieuweplaats,"^") == true)
      *nieuweactie  = operatie;
   else if (Checkstring(formulelistplaats,nieuweplaats,")") == true)
      *nieuweactie  = sluithaakje;
   else goed = false;

   return(goed);
  }
/*-----------------------------------------------------------*/
int Nasluithaakjecheck(int formulelistplaats,int *nieuweplaats,int *nieuweactie)
  {
   int goed = true;

   if      (Checkstring(formulelistplaats,nieuweplaats,"+") == true)
      *nieuweactie  = operatie;
   else if (Checkstring(formulelistplaats,nieuweplaats,"-") == true)
      *nieuweactie  = minteken;
   else if (Checkstring(formulelistplaats,nieuweplaats,"*") == true)
      *nieuweactie  = operatie;
   else if (Checkstring(formulelistplaats,nieuweplaats,"/") == true)
      *nieuweactie  = operatie;
   else if (Checkstring(formulelistplaats,nieuweplaats,"^") == true)
      *nieuweactie  = operatie;
   else if (Checkstring(formulelistplaats,nieuweplaats,")") == true)
      *nieuweactie  = sluithaakje;
   else goed = false;

   return(goed);
  }

/*-----------------------------------------------------------*/
int Naoperatiecheck(int formulelistplaats,int *nieuweplaats,int *nieuweactie)
  {
   int goed = true;

   if      (Checkspeciaal(formulelistplaats,nieuweplaats) == true)
      *nieuweactie  = openhaakje;
   else if (Checkstring(formulelistplaats,nieuweplaats,"@") == true)
      *nieuweactie  = minteken;
   else if (Checkstring(formulelistplaats,nieuweplaats,"(") == true)
      *nieuweactie  = openhaakje;
   else if (Checkstring(formulelistplaats,nieuweplaats,"x") == true)
      *nieuweactie  = getal;
   else if (Checkstring(formulelistplaats,nieuweplaats,"y") == true)
      *nieuweactie  = getal;
   else if (Checkgetal(formulelistplaats,nieuweplaats) == true)
      *nieuweactie  = getal;
   else goed = false;

   return(goed);
  }


/*-----------------------------------------------------------*/
/* De onderstaande functies worden aangeroepn door de 	     */
/* bovenstaande. Deze functies testen rechtstreeks de	     */
/* formulelist. De functies geven een boolean terug	     */
/* waaruit blijkt of de formulelist op die plaats	     */
/* de desbetreffende actie bevat			     */
/*-----------------------------------------------------------*/

int Checkgetal(int plaats,int *nieuweplaats)
  {
   int goed = true;
   int teller;

   teller = 0;
					/* controleer het eerste digit */
   if ((Formulelist[plaats+teller] >= '0') && (Formulelist[plaats+teller] <= '9'))
     {
      teller++;                         /* volgende digit */
      while ((Formulelist[plaats+teller] >= '0') && (Formulelist[plaats+teller] <= '9') &&
	     (goed == true))            /* volgende digit een getal */
	{
	 if (teller > 2) goed = false;  /* aantal karakters voor de komma - 1 */
	 else teller++;
	}
      plaats = plaats+teller;         /* er zijn nu max drie getallen gechecked */

      teller = 0;
      if ((Formulelist[plaats+teller] == '.') && (goed == true))
	{
	 teller++;
	 if ((Formulelist[plaats+teller] >= '0') && (Formulelist[plaats+teller] <= '9'))
	   {
	    while ((Formulelist[plaats+teller] >= '0') && (Formulelist[plaats+teller] <= '9') &&
		   (goed == true))
	      {
	       if (teller > 4) goed = false; /* aantal karakters na de komma */
	       else teller++;
	      }
	   }
	 else goed = false;
	}
     }
    else goed = false;

    *nieuweplaats = plaats+teller;

    return(goed);
  }
/*-----------------------------------------------------------*/
int Checkspeciaal(int formulelistplaats,int *nieuweplaats)
  {
   int goed = true;

   if      (Checkstring(formulelistplaats,nieuweplaats,"cos(") == true);
   else if (Checkstring(formulelistplaats,nieuweplaats,"sin(") == true);
   else if (Checkstring(formulelistplaats,nieuweplaats,"tan(") == true);
   else if (Checkstring(formulelistplaats,nieuweplaats,"arccos(") == true);
   else if (Checkstring(formulelistplaats,nieuweplaats,"arcsin(") == true);
   else if (Checkstring(formulelistplaats,nieuweplaats,"arctan(") == true);
   else if (Checkstring(formulelistplaats,nieuweplaats,"exp(") == true);
   else if (Checkstring(formulelistplaats,nieuweplaats,"lin(") == true);
   else if (Checkstring(formulelistplaats,nieuweplaats,"log(") == true);
   else if (Checkstring(formulelistplaats,nieuweplaats,"cosh(") == true);
   else if (Checkstring(formulelistplaats,nieuweplaats,"sinh(") == true);
   else if (Checkstring(formulelistplaats,nieuweplaats,"abs(") == true);
   else goed = false;

   return(goed);
  }
/*-----------------------------------------------------------*/
int Haakjes(int haakje,int *aantalhaakjes)
  {

   int goed = false;

   if (haakje == openhaakje)
			     {
			      if (*aantalhaakjes < maxhaakjes)
				 {
				  (*aantalhaakjes)++;
				  goed = true;
				 }
			     }
   else
   if (haakje == sluithaakje)
			     {
			      if (*aantalhaakjes > 0)
				 {
				  (*aantalhaakjes)--;
				  goed = true;
				 }
			     }
   return(goed);
  }

