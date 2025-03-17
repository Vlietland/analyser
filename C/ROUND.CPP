/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:    Afronden van floats  (Round.c)                   */
/* AUTEUR:            Resourser                                        */
/* BESCHRIJVING:                                                       */
/*    Deze functie rond een ingevoerd getal af naar een heel getal     */
/*                                                                     */
/* INPUT PAR:              float            	                       */
/* OUPUT PAR:              afgeronde integer	                       */
/* DATUM:                  3 oktober 1996                              */
/*=====================================================================*/

int round(float getal)

     {
      int afgerond;

      if ((getal - (int)getal) < 0.5) afgerond = getal;
		    	         else afgerond = getal + 1;

      return(afgerond);
     }			 