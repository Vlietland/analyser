/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:    Error handling (Error.cpp)                       */
/* AUTEUR:            Resourser                                        */
/* BESCHRIJVING:                                                       */
/*   Dit programma zorgt voor de errorhandling die anders het          */
/*   programma om zeep helpt                                           */
/*                                                                     */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                  22 oktober 1996                             */
/*=====================================================================*/

#include	<math.h>
#include	<float.h>
#include	<stdio.h>
#include	<string.h>

int matherr (struct exception *a)
{
 if (a->type == SING)
  {
   a->retval = 0;
   return 1;
  }
 else if (a->type == DOMAIN)
  {
   a->retval = 0;
   return 1;
  }
 else if (a->type == UNDERFLOW)
  {
   a->retval = 0;
   return 1;
  }
 else if (a->type == OVERFLOW)
  {
   a->retval = 1E10;
   return 1;
  }
 else return 0;
}
