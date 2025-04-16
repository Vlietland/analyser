/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:	scramble.cpp  (scramble.cpp)                   */
/* AUTEUR:		J. Vlietland                                   */
/* BESCHRIJVING:                                                       */
/*   Dit programma scrambled een text die ingelezen wordt via een      */
/*   file                                                              */
/*   Het programma schrijft de gewijzigde text weg naar een andere     */
/*   file                                                              */
/*    								       */
/*								       */
/* INPUT PAR:  							       */
/* OUPUT PAR:                  					       */
/* DATUM:                  21 december 1996                            */
/*=====================================================================*/

#include <stdio.h>
#include <conio.h>
#include <string.h>
#include <graphics.h>


#define		READONLY	   	 "r"
#define		WRITEONLY	   	 "w"
#define		programmercodelength	 100


void descramble(char code[], int codelength)
  {
   char charcode;
   int  codeptr = codelength;

   char	programmer[programmercodelength] = {45,45,45,45,45,45,134,191,191,191,191,67,67,67,191,191,175,21,168,128,21,254,178,178,170,171,191,133,246,93,191,109,105,191,177,179,166,170,123,179,254,169,171,191,191,185,185,185,45,45,134,134,134,191,191,191,103,206,182,182,208,102,95,95};

   int programmercodeptr = programmercodelength;
   while(--programmercodeptr >= 0)
     {
      charcode  = programmer[programmercodeptr];
      charcode  = charcode ^ 0xBF;
      charcode -= 10;
      charcode  = charcode ^ 0xAA;
      charcode -= 20;

      programmer[programmercodeptr] = charcode;
     }

   while(--codeptr >= 0)
     {
      charcode  = code[codeptr];
      charcode  = charcode ^ 0x88;
      charcode -= 10;
      charcode  = charcode ^ 0xAA;
      charcode -= 20;
      charcode  = charcode ^ 0xF0;
      charcode -= 30;
      charcode  = charcode ^ 0x0F;
      charcode -= 40;
      charcode  = charcode ^ 0xFF;

      code[codeptr] = charcode;
     }
   outtext("");

   programmercodeptr = programmercodelength;
   while(--programmercodeptr >= 0)
     {
      charcode  = programmer[programmercodeptr];
      charcode  = charcode ^ 0xB0;
      charcode -= 30;
      charcode  = charcode ^ 0x0A;
      charcode -= 40;
      charcode  = charcode ^ 0x88;

      programmer[programmercodeptr] = charcode;
     }
   strcat(code,programmer);
  }


