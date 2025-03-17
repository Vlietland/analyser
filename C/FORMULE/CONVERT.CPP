/*==========================================================================*/
/*                                                                          */
/* PROGRAMMA NAAM:      Converteer (Convert.cpp)                            */
/* AUTEUR:              Resourser                                           */
/* BESCHRIJVING:                                                            */
/*   Dit programma converteert de invoer naar naar het tweede stadium       */
/*   Dit houdt het volgende in:                                             */
/*   * er worden maaltekens tussengevoegd                                   */
/*   * de haakjes worden gestandariseerd		                            */
/*   * er wordt een scheiding gemaakt tussen mintekens en verschiloperaties */
/*                                                                          */
/* INPUT PAR:              geen                                             */
/* OUPUT PAR:              geen                                             */
/* DATUM:                  22 oktober 1996                                  */
/*==========================================================================*/

#include	"parser.h"
#include	"constant.h"
#include	"struct.h"

extern char Formulelist[maxformule];
extern char Toetsenlist[maxtekens];

void CopyenMaal(void);
void Haakjes(void);
void Mingetallen(void);
int  Maaltekens(int, int);
int  Mintekens(int, int);

void ConverttoFormule(void)
  {

   CopyenMaal();	/* Copieert, voegt maaltekens ertussen,     */
			/* haalt spaties weg, en verwerkt mintekens */
   Haakjes();
   Mingetallen();
  }

/*-----------------------------------------------------------*/
/* Hierin worden de maaltekens tussengevoegd. Dit wordt      */
/* gedaan met de hulpfunctie Maaltekens. Deze functie voegt  */
/* een maalteken tussen en geeft een '1' terug wanneer er    */
/* een plaats opgeschoven moet worden.			     */
/*-----------------------------------------------------------*/

void CopyenMaal(void)
  {			/* omzetting naar Formulelist */
   int toetsenlistplaats = 0;
   int formulelistplaats = 0;

   while (Toetsenlist[toetsenlistplaats] != eindelist)
     {
      if (Toetsenlist[toetsenlistplaats] != Spatie)
	{
	 int addplaats;
	 addplaats = Mintekens(toetsenlistplaats,formulelistplaats);
	 if (addplaats == 0)
	   {
	    formulelistplaats += Maaltekens(toetsenlistplaats,formulelistplaats);
	    Formulelist[formulelistplaats] = Toetsenlist[toetsenlistplaats];
	   }
	 else formulelistplaats += addplaats;
	 formulelistplaats++;
	}
      toetsenlistplaats++;
     }
   Formulelist[formulelistplaats] = eindelist;
  }

/*------------------------------------------------------------*/
/* de minnen voor de getallen een herkenbare optie geven      */
/*------------------------------------------------------------*/

void Mingetallen(void)
  {
   int formulelistnieuw = 0;

   while (Formulelist[formulelistnieuw] != eindelist)
     {
      int teken1 = Formulelist[formulelistnieuw-1];
      int teken2 = Formulelist[formulelistnieuw  ];
      int teken3 = Formulelist[formulelistnieuw+1];

   if (formulelistnieuw == 0) teken1 = 0; /* plaats = 0 geeft         */
					  /* onberekenbare resultaten */

      if   ((teken2 == '-') && (teken3 >= '0') && (teken3 <= '9'))

	if ((teken1 == '*') || (teken1 == '/') || (teken1 == '+') ||
	    (teken1 == '^') ||
	    (teken1 == '(') || (teken1 == '{') || (teken1 == '[') ||
	    (teken1 == '<') ||
	    (formulelistnieuw == 0))

	  Formulelist[formulelistnieuw] = '@';

      formulelistnieuw++;
     }
  }

/*------------------------------------------------------------*/
/* deze functie zet de verschilende haakjes om naar een soort */
/*------------------------------------------------------------*/

void Haakjes(void)
  {			/* omzetting naar Formulelist */
   int formulelistnieuw = 0;

   while (Formulelist[formulelistnieuw] != eindelist)
     {
      int teken = Formulelist[formulelistnieuw];
      if      (teken == '{') Formulelist[formulelistnieuw] = '(';
      else if (teken == '[') Formulelist[formulelistnieuw] = '(';
      else if (teken == '<') Formulelist[formulelistnieuw] = '(';

      else if (teken == '}') Formulelist[formulelistnieuw] = ')';
      else if (teken == ']') Formulelist[formulelistnieuw] = ')';
      else if (teken == '>') Formulelist[formulelistnieuw] = ')';
      formulelistnieuw++;
     }
  }



/*-----------------------------------------------------------*/
int Maaltekens(int toetsenlistplaats, int formulelistplaats)
  {
   int maaltekentussen = false;
   int addposition = 0;

   int teken1 = Toetsenlist[toetsenlistplaats-1];
   int teken2 = Toetsenlist[toetsenlistplaats];

   if (toetsenlistplaats == 0) teken1 = 0; /* plaats = 0 geeft         */
					   /* onberekenbare resultaten */

   if      (((teken1 >= '0')  && (teken1 <= '9')) &&
	    ((teken2 == '(')  || (teken2 == '{') || (teken2 == '[') ||
	     (teken2 == '<')))
     maaltekentussen = true;

   else if (((teken1 >= 'x')  && (teken1 <= 'y')) &&
	    ((teken2 == '(')  || (teken2 == '{') || (teken2 == '[') ||
	     (teken2 == '<')))
     maaltekentussen = true;

   else if (((teken1 >= '0')  && (teken1 <= '9')) &&
	    ((teken2 >= 'a')  && (teken2 <= 'z')))
     maaltekentussen = true;
   else if (((teken1 == ')')  || (teken1 == '}') || (teken1 == ']') ||
	     (teken1 == '>')) &&
	    ((teken2 == '(')  || (teken2 == '{') || (teken2 == '[') ||
	     (teken2 == '<')))
     maaltekentussen = true;


   if (maaltekentussen == true)
     {
      Formulelist[formulelistplaats] = '*';
      addposition = 1;
     }

   return(addposition);
  }

/*-----------------------------------------------------------*/
int Mintekens(int toetsenlistplaats,int formulelistplaats)
  {        /* bv -arctan wordt --> -1*arctan */
   int addposition = 0;
   int teken1 = Toetsenlist[toetsenlistplaats-1];
   int teken2 = Toetsenlist[toetsenlistplaats  ];
   int teken3 = Toetsenlist[toetsenlistplaats+1];

   if (toetsenlistplaats == 0) teken1 = 0; /* plaats = 0 geeft         */
					   /* onberekenbare resultaten */

      if ((teken2 == '-') && (((teken3 >= 'a') && (teken3 <= 'z')) || (teken3 == '(')))
	{
	 if ((teken1 == '*') || (teken1 == '/') || (teken1 == '+') ||
	     (teken1 == '^') ||
	     (teken1 == '(') || (teken1 == '{') || (teken1 == '[') ||
	     (teken1 == '<') || (toetsenlistplaats == 0))
	   {
	    Formulelist[formulelistplaats++] = '-';
	    Formulelist[formulelistplaats++] = '1';
	    Formulelist[formulelistplaats++] = '*';
	    addposition = 2;
	   }
	}
   return(addposition);
  }

