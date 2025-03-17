/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:      Constant                (Constant.h)           */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   In deze H-file staan matrixvermenigvuldigingen                    */
/*   Deze matrices worden gebruikt door diverse routines die           */
/*   Figuren moeten draaien.                                           */
/*   De factoren die gebruikt worden zijn :                            */
/*        Ax   --> de X-waarde van de vector                           */
/*        Ay   --> de Y-waarde van de vector                           */
/*        Az   --> de Z-waarde van de vector                           */
/*        cosx --> de cos van de draaiingshoek over de X-as            */
/*        sinx --> de sin van de draaiingshoek over de X-as            */
/*        cosz --> de cos van de draaiingshoek over de Z-as            */
/*        cosz --> de sin van de draaiingshoek over de Z-as            */
/*                                                                     */
/* DATUM:                  3 oktober 1996                              */
/*=====================================================================*/

#define		MatrixX		( Ax*     cosz + Ay     *sinz 	       )
#define		MatrixY		(-Ax*cosx*sinz + Ay*cosx*cosz - Az*sinx)
#define		MatrixZ		(-Ax*sinx*sinz + Ay*sinx*cosz + Az*cosx)