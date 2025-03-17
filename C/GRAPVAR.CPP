/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:      Presenteren van een variabele  (Grapvar.c)     */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*    Deze functie zet de waarde van een variabele op het scherm       */
/*    op de plaats  (x,y)                                              */
/*                                                                     */
/* INPUT PAR:              float                                       */
/* OUPUT PAR:              afgeronde integer                           */
/* DATUM:                  3 oktober 1996                              */
/*=====================================================================*/

#define	  startplaats		 0
#define	  mintekenplaats	 1
#define	  voorkommabegin	 2 /* drie karakters voor de komma */
#define	  voorkommaeinde	 4
#define	  puntplaats		 5 /* een karakter voor de punt */
#define	  achterkommabegin	 6
#define	  achterkommaeinde	 7 /* twee karakters achter de komma */
#define	  afsluitplaatsbegin     8
#define   afsluitplaatseinde     9 /* twee afsluitingplaatsen */

#define	  tab			64
#define   newline		10
#define   characterwidth	 8

#include 	<graphics.h>
#include	"constant.h"
#include	"scherm.h"

void Graphvarout(int x,int y,double variabele,int color)

{
  char   text[afsluitplaatseinde];
  char   *textptr;

  int    teller;
  int    grootstedigit = 100;
  int    voorkomma;
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

  /* -------------voorste plaatsen opvullen met spaties------- */

  teller = voorkommabegin;
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

  setcolor(color);
  outtextxy(x,y,textptr);

}

void specialouttext(int Xpos,int Yposition, char text[])
  {
   int  textptr = 0;
   char character[2] = {0,0};
   int  Xposition = Xpos;

   moveto(Xposition,Yposition);

   while (text[textptr] != 0)
     {
      if      (text[textptr] == 0x09)
	{Xposition += tab; moveto(Xposition,Yposition);}
      else if (text[textptr] == 0x0A)
	{Xposition = Xpos; ;Yposition += newline; moveto(Xposition,Yposition);}
      else
	{
	 character[0] = text[textptr];
	 outtextxy(Xposition,Yposition,character);
	 Xposition += characterwidth;
	}
      textptr++;
     }
  }
