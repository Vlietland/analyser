/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:      Coorsystemupdate (Coorsys.c)                   */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*    Deze module draagt zorg voor het coordinatensysteem rechts-      */
/*    bovenin het scherm                                               */
/*                                                                     */
/* INPUT PAR:              geen             	                       */
/* OUPUT PAR:              geen                                        */
/* DATUM:                  16 september 1996                           */
/*=====================================================================*/

#include	"struct.h"
#include	"constant.h"
#include	"scherm.h"
#include	"coorsys.h"
#include	"matrix.h"
#include	<graphics.h>
#include	<math.h>


void coorsystemupdate(phipoint Phi)

{
  float cosx;
  float cosz;
  float sinx;
  float sinz;

  float Ax,Bx;
  float Ay,By;
  float Az,Bz;

  coorsysviewport;
  clearviewport();


  cosx = cos(Phi.X);	  /* berekenen van de kengetallen */
  sinx = sin(Phi.X);
  cosz = cos(Phi.Z);
  sinz = sin(Phi.Z);

			  /* X-lijn berekening */
  Ax =  Xlijn;
  Ay =  0;
  Az =  0;


  Bx = MatrixX + offsetXcsscherm;
  By = MatrixY + offsetYcsscherm;
  Bz = MatrixZ;

  setcolor(Xkleur);

  if (Bz < 0)  {
		setlinestyle(1,0,1);
		line(offsetXcsscherm,offsetYcsscherm,Bx,By);
		setlinestyle(0,0,1);
	       }
     else      {
		line(offsetXcsscherm,offsetYcsscherm,Bx,By);
	       }



			  /* Y-lijn berekening */
  Ax =  0;
  Ay =  -Ylijn;           /* negatief omdat op het scherm de Y-as */
  Az =  0;                /* geinverteerd is */

  Bx = MatrixX + offsetXcsscherm;
  By = MatrixY + offsetYcsscherm;
  Bz = MatrixZ;

  setcolor(Ykleur);

  if (Bz < 0)  {
		setlinestyle(1,0,1);
		line(offsetXcsscherm,offsetYcsscherm,Bx,By);
		setlinestyle(0,0,1);
	       }
     else      {
		line(offsetXcsscherm,offsetYcsscherm,Bx,By);
	       }

			  /* Z-lijn berekening */
  Ax =  0;
  Ay =  0;
  Az =  Zlijn;

  Bx = MatrixX + offsetXcsscherm;
  By = MatrixY + offsetYcsscherm;
  Bz = MatrixZ;

  setcolor(Zkleur);

  if (Bz < 0)  {
		setlinestyle(1,0,1);
		line(offsetXcsscherm,offsetYcsscherm,Bx,By);
		setlinestyle(0,0,1);
	       }
     else      {
		line(offsetXcsscherm,offsetYcsscherm,Bx,By);
	       }

}