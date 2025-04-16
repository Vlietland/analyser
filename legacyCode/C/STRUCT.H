/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:      Structure definitie         (struct.h)         */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   In deze H-file staan alle structures die nodig zijn voor          */
/*   het gehele programma                                              */
/*                                                                     */
/*                                                                     */
/*                                                                     */
/* DATUM:                  3 oktober 1996                              */
/*=====================================================================*/


#define	       bool              int
#define	       false              -1
#define	       true              255

struct vector   {float X,Y,Z;};
struct point    {float X,Y;  };
struct phipoint {float X,Z;  };
struct intpoint {int   X,Y;  };
