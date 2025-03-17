/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:      Presenteren van een variabele  (Grapvarl.c)    */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*    Deze functie zet de waarde van een variabele op het scherm       */
/*    op de plaats  (x,y)  ,in long format.                            */
/*                                                                     */
/* INPUT PAR:              float            	                       */
/* OUPUT PAR:              afgeronde integer	                       */
/* DATUM:                  3 oktober 1996                              */
/*=====================================================================*/

#define	  startplaats		 0
#define	  mintekenplaats	 1
#define	  voorkommabegin	 2 /* zeven karakters voor de komma */
#define	  voorkommaeinde	 8
#define	  puntplaats		 9 /* een karakter voor de punt */
#define	  achterkommabegin	10
#define	  achterkommaeinde	11 /* twee karakters achter de komma */
#define	  afsluitplaatsbegin    12
#define   afsluitplaatseinde    13 /* twee afsluitingplaatsen */


#include 	<graphics.h>
#include	"constant.h"
#include	"scherm.h"


void Graphvaroutlong(int x,int y,double variabele,int color)

{
  char   text[afsluitplaatseinde];
  char   *textptr;

  int    teller;
  long   grootstedigit = 1000000L;
  long   voorkomma;
  double achterkomma;
  int    temp;

  textptr = &text[1];
  text[startplaats]        = 0xA0;
  text[afsluitplaatsbegin] = 0;
  text[afsluitplaatseinde] = 0;

  /* ----------------------oude teken wissen----------------- */

  for (teller = 1; teller < afsluitplaatsbegin; teller++)
    text[teller] = asciiblokteken;

  setcolor(infobackgrkleur);
  outtextxy(x,y,textptr);

  /* ----------------------polariteit bepalen---------------- */

  if (variabele < 0) {
		      text[mintekenplaats] = '-';
		      variabele = -variabele;
		     }
    else	      text[mintekenplaats] = ' ';


  voorkomma   = variabele;                  /* int, dus getal truncated */
  achterkomma = variabele - voorkomma;
  teller      = voorkommabegin;

  if (variabele < (grootstedigit * 10))
	 {
	  /* -------------voorste plaatsen opvullen met spaties------- */

	  temp   = voorkomma / grootstedigit;

	  while ((teller < voorkommaeinde) && (temp == 0))
	    {
	     text[teller] = ' ';
	     voorkomma *= 10;
	     temp = voorkomma / grootstedigit;
	     teller++;
	    }

	  /* -------------het getal voor de komma omzetten in ascii--- */

	  while (teller <= voorkommaeinde)
	    {
	     text[teller] = temp + '0';
	     voorkomma   -= temp * grootstedigit;
	     voorkomma   *= 10;
	     temp         = voorkomma / grootstedigit;
	     teller++;
	    }
	  /* -------het ascii teken van de punt op de juiste plaats--- */

	  text[puntplaats]         = '.';

	  /* -------het getal achter de komma omzetten in ascii------- */

	  for (teller =achterkommabegin; teller <=achterkommaeinde; teller++)
	    {
	     achterkomma *= 10;
	     temp         = achterkomma;
	     achterkomma -= temp;
	     text[teller] = temp + '0';
	    }
	 }
    else
	 while (teller <= achterkommaeinde)
	    {
	     text[teller] = '*';
	     teller++;
	    }

  setcolor(color);
  outtextxy(x,y,textptr);

}





