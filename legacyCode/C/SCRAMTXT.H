/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:      Scrambledtext    (Scramtxt.h)                  */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   Hieronder staat de gescrambled text voor de eigendoms             */
/*   verklaring                                                        */
/*   De text wordt op de volgende manier gescrambled (elk karakter)    */
/*   Xor uitvoeren &FF                                                 */
/*   Veertig erbij optellen                                            */
/*   Xor uitvoeren &F0                                                 */
/*   Dertig erbij optellen                                             */
/*   Xor uitvoeren &0F                                                 */
/*   Twintig erbij optellen                                            */
/*   Xor uitvoeren &AA                                                 */
/*   Tien erbij optellen                                               */
/*   Xor uitvoeren &88                                                 */
/*                                                                     */
/* DATUM:                  3 oktober 1996                              */
/*=====================================================================*/

#define		scrambletext 		{0,0,235,235,38,139,22,194,18,40,21,\
	45,40,3,47,47,3,194,139,41,194,7,139,45,7,20,6,21,47,194,124,3,20,0,0,\
	235,235,194,194,194,194,194,194,35,44,6,7,46,139,20,45,194,39,46,7,33,\
	22,40,21,0,0,235,235,235,194,42,54,73,239,56,40,7,6,3,0,0,0,235,235,7,\
	20,194,47,3,45,194,20,139,7,22,194,125,21,40,6,7,20,194,45,7,33,21,18,\
	139,7,7,40,6,0,0,235,194,194,194,194,194,194,112,21,20,6,7,40,194,41,\
	25,138,40,139,44,22,7,46,139,32,33,7,194,22,21,7,41,22,7,47,47,139,20,\
	45,0,0,235,235,194,194,194,194,54,7,46,194,48,194,210,61,60,194,239,194,\
	215,232,215,210,215,60,210,0,0,0,0,235,194,194,194,194,194,194,77,7,24,\
	40,23,139,33,7,40,194,48,194,3,44,6,7,46,139,20,45,194,39,238,194,42,54,\
	73,239,56,40,7,6,3,0,226}

/* met de lengte van de text wordt de grootte van de array bedoeld */
/* let op dat de orginele text wordt afgesloten met &00 */
/* daardoor weet outtextxy dat de string ten einde is */

extern void descramble(char scrambeledtext[], int textlengte);