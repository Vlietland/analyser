/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:  Array manager (Array.c)                            */
/* AUTEUR:          Resourser                                          */
/* BESCHRIJVING:                                                       */
/*   In dit blok staan de routines die aangeroepen moeten worden om    */
/*   de berekeningen uit te voeren voor het coordinatenmanagement      */
/*   Het blok bevat de volgende functies                               */
/*     * Zcoordinatenupdate                                            */
/*     * Copyconvert                                                   */
/*     * vectorupdate                                                  */
/*     * fastD3schermpresentatie                                       */
/*     * D3schermpresentatie                                           */
/*                                                                     */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                  16 september 1996                           */
/*=====================================================================*/

#include	<graphics.h>
#include	<math.h>
#include	"struct.h"
#include	"scherm.h"
#include	"array.h"
#include	"constant.h"
#include	"matrix.h"


static vector far   Coorlist[arraysize][arraysize];
static vector far   Preslist[arraysize][arraysize];
static vector far Schermlist[arraysize][arraysize];

static float  Zpgem;
static float  Zpmin;		/* onthouden welke Zwaarde de startkleur heeft */
static float  Zpcolor;		/* onthouden wat de factor is voor de kleurenberekening */
static float  schermfactor;
static point  Pgem;

/*--------------------------------------------------------------------*/
float Drawcrosshair(point Analyse,phipoint Phi,float zfctr)

{
  float Z;
  float Ax,Ay,Az;
  static float Bx,By;

  float cosx;
  float cosz;
  float sinx;
  float sinz;

  graphicviewport;
  setcolor(crosshairkleur);
  setwritemode(1);

  cosx = cos(Phi.X);	  /* berekenen van de kengetallen */
  sinx = sin(Phi.X);
  cosz = cos(Phi.Z);
  sinz = sin(Phi.Z);

  Z = Functie(Analyse);

  Ax =   schermfactor *  (Analyse.X - Pgem.X);
		 /* bij Y moet -schermfactor (scherm geinvrteerd) */
  Ay = -(schermfactor *  (Analyse.Y - Pgem.Y));

  Az =   schermfactor * ((Z - Zpgem) / zfctr);

  Bx = MatrixX + offsetXgrscherm;
  By = MatrixY + offsetYgrscherm;

  line(Bx-crosssize,By+crosssize,Bx+crosssize,By-crosssize);
  line(Bx-crosssize,By-crosssize,Bx+crosssize,By+crosssize);

  setwritemode(0);
  return(Z);
}

/*--------------------------------------------------------------------*/
void Zcoordinatenupdate(point Cmin, int Xsamples, float stapgrootte)

  {
    intpoint CC;
    point    Chuidig;

    Chuidig.X = Cmin.X;
    Chuidig.Y = Cmin.Y;

    for(CC.Y = 1; CC.Y <= Xsamples; CC.Y++)
	{
	 for (CC.X = 1; CC.X <= Xsamples; CC.X++)
	    {
	     Coorlist[CC.X][CC.Y].X = Chuidig.X;
	     Coorlist[CC.X][CC.Y].Y = Chuidig.Y;
	     Coorlist[CC.X][CC.Y].Z = Functie(Chuidig);
	     Chuidig.X += stapgrootte;
	    }
	 Chuidig.X  = Cmin.X;
	 Chuidig.Y += stapgrootte;
	}
  }

/*--------------------------------------------------------------------*/

void CopyConvertXY(intpoint CPmin ,intpoint CPmax,
		   float *Xpmin ,float *Ypmin,
		   float *Xpmax ,float *Ypmax)

  {
    float Zpmax;
    intpoint CPhuidig;
						/* P3Dvariabelenupdate */

    *Xpmin = Coorlist[CPmin.X][CPmin.Y].X;
    *Ypmin = Coorlist[CPmin.X][CPmin.Y].Y;
    *Xpmax = Coorlist[CPmax.X][CPmax.Y].X;
    *Ypmax = Coorlist[CPmax.X][CPmax.Y].Y;

    Pgem.X = (*Xpmax + *Xpmin) / 2;
    Pgem.Y = (*Ypmax + *Ypmin) / 2;

    Zpmin = Zpmax = Coorlist[CPmin.X][CPmin.Y].Z;

    schermfactor = deltascherm / (*Xpmax - *Xpmin);
					/* copieer coordinaten */
    #define	    smaller	Coorlist[CPhuidig.X][CPhuidig.Y].Z < Zpmin
    #define	    greater     Coorlist[CPhuidig.X][CPhuidig.Y].Z > Zpmax

    for(CPhuidig.Y = CPmin.Y; CPhuidig.Y <= CPmax.Y; CPhuidig.Y++)
       {
	for (CPhuidig.X = CPmin.X; CPhuidig.X <= CPmax.X; CPhuidig.X++)
	   {                          /* bij Y moet -schermfactor (schermgeinverteerd) */
				      /* alles eerst tussen haakjes ander een fout in os */
				      /* floating point: Domain. ???? */

	    Preslist[CPhuidig.X][CPhuidig.Y].X =     schermfactor *  (Coorlist[CPhuidig.X][CPhuidig.Y].X - Pgem.X);
	    Preslist[CPhuidig.X][CPhuidig.Y].Y =   -(schermfactor *  (Coorlist[CPhuidig.X][CPhuidig.Y].Y - Pgem.Y));

	    if        (smaller) Zpmin = Coorlist[CPhuidig.X][CPhuidig.Y].Z;
	      else if (greater) Zpmax = Coorlist[CPhuidig.X][CPhuidig.Y].Z;

	   }
       }

    Zpgem = (Zpmax + Zpmin) / 2;	/* Pscreenvariabelenupdate */
    Zpcolor  = (Zpmax - Zpmin) / aantalkleuren;
    if (Zpcolor == 0) Zpcolor = 1;      /* voorkomt deling door nul */
  }

/*--------------------------------------------------------------------*/

void CopyConvertZ(intpoint CPmin ,intpoint CPmax, float zfctr)
					/* converteer Z-coordinaten */
  {
   intpoint CPhuidig;

   for(CPhuidig.Y = CPmin.Y; CPhuidig.Y <= CPmax.Y; CPhuidig.Y++)
     {
      for (CPhuidig.X = CPmin.X; CPhuidig.X <= CPmax.X; CPhuidig.X++)
	 {
	  Preslist[CPhuidig.X][CPhuidig.Y].Z =
	    schermfactor * ((Coorlist[CPhuidig.X][CPhuidig.Y].Z - Zpgem) / zfctr);
	 }
     }

  }

/*--------------------------------------------------------------------*/

void vectorupdate(phipoint Phi,intpoint CPmin, intpoint CPmax)

  {
    float cosx;
    float cosz;
    float sinx;
    float sinz;

    float Ax;
    float Ay;
    float Az;

    intpoint CPhuidig;

    cosx = cos(Phi.X);	  /* berekenen van de kengetallen */
    sinx = sin(Phi.X);
    cosz = cos(Phi.Z);
    sinz = sin(Phi.Z);


    for(CPhuidig.Y = CPmin.Y; CPhuidig.Y <= CPmax.Y; CPhuidig.Y++)
       {
	for (CPhuidig.X = CPmin.X; CPhuidig.X <= CPmax.X; CPhuidig.X++)
	   {
	    Ax = Preslist[CPhuidig.X][CPhuidig.Y].X;
	    Ay = Preslist[CPhuidig.X][CPhuidig.Y].Y;
	    Az = Preslist[CPhuidig.X][CPhuidig.Y].Z;

	    Schermlist[CPhuidig.X][CPhuidig.Y].X = MatrixX + offsetXgrscherm;
	    Schermlist[CPhuidig.X][CPhuidig.Y].Y = MatrixY + offsetYgrscherm;
	    Schermlist[CPhuidig.X][CPhuidig.Y].Z = MatrixZ;
	   }
       }

  }

/*--------------------------------------------------------------------*/

void fastD3schermupdate(intpoint CPmin ,intpoint CPmax)

{
  intpoint CPhuidig;

  float Ax,Ay,Az;
  int   color;

  graphicviewport;
  clearviewport();

	for(CPhuidig.Y = CPmin.Y; CPhuidig.Y <= CPmax.Y; CPhuidig.Y++)
       {
	for (CPhuidig.X = CPmin.X; CPhuidig.X <= CPmax.X; CPhuidig.X++)
	   {

	    Ax = Schermlist[CPhuidig.X][CPhuidig.Y].X;
	    Ay = Schermlist[CPhuidig.X][CPhuidig.Y].Y;

	    Az =   Coorlist[CPhuidig.X][CPhuidig.Y].Z;

	    color = ((Az - Zpmin) / Zpcolor) + beginkleur;

	    putpixel (Ax,Ay,color);
	    putpixel (Ax+1,Ay,color);

	   }
       }
}

/*--------------------------------------------------------------------*/

void D3schermupdate(intpoint CPmin ,intpoint CPmax)

{
  intpoint CPhuidig;

  float Ax,Ay,Az;
  float Bx,By;
  float Cx,Cy;
  int   color;

	graphicviewport;
	clearviewport();

  for(CPhuidig.Y = CPmin.Y; CPhuidig.Y < CPmax.Y; CPhuidig.Y++)
       {
	for (CPhuidig.X = CPmin.X; CPhuidig.X < CPmax.X; CPhuidig.X++)
	   {
	    Ax = Schermlist[CPhuidig.X  ][CPhuidig.Y  ].X;
	    Ay = Schermlist[CPhuidig.X  ][CPhuidig.Y  ].Y;

	    Az =   Coorlist[CPhuidig.X  ][CPhuidig.Y].Z;

	    Bx = Schermlist[CPhuidig.X+1][CPhuidig.Y  ].X;
	    By = Schermlist[CPhuidig.X+1][CPhuidig.Y  ].Y;
	    Cx = Schermlist[CPhuidig.X  ][CPhuidig.Y+1].X;
	    Cy = Schermlist[CPhuidig.X  ][CPhuidig.Y+1].Y;

	    color = ((Az - Zpmin) / Zpcolor) + beginkleur;

	    setcolor(color);

	    line(Ax,Ay,Bx,By);
	    line(Ax,Ay,Cx,Cy);
	   }
	Ax = Schermlist[CPmax.X][CPhuidig.Y  ].X;
	Ay = Schermlist[CPmax.X][CPhuidig.Y  ].Y;

	Az =   Coorlist[CPmax.X][CPhuidig.Y  ].Z;

	Cx = Schermlist[CPmax.X][CPhuidig.Y+1].X;
	Cy = Schermlist[CPmax.X][CPhuidig.Y+1].Y;

	color = ((Az - Zpmin) / Zpcolor) + beginkleur;

	setcolor(color);

	line(Ax,Ay,Cx,Cy);
       }

  for (CPhuidig.X = CPmin.X; CPhuidig.X < CPmax.X; CPhuidig.X++)
	{
	 Ax = Schermlist[CPhuidig.X  ][CPmax.Y].X;
	 Ay = Schermlist[CPhuidig.X  ][CPmax.Y].Y;

	 Az =   Coorlist[CPhuidig.X  ][CPmax.Y].Z;

	 Bx = Schermlist[CPhuidig.X+1][CPmax.Y].X;
	 By = Schermlist[CPhuidig.X+1][CPmax.Y].Y;

	 color = ((Az - Zpmin) / Zpcolor) + beginkleur;

	 setcolor(color);

	 line(Ax,Ay,Bx,By);
	}
}

/*--------------------------------------------------------------------*/
void FullD3schermupdate(intpoint CPmin ,intpoint CPmax)

{
  intpoint CPhuidig;
  int knoppenstand = 0;

  int poly[8];

  float Az;
  int   color;

  graphicviewport;
  clearviewport();
			  /* in de Y-richting het verste punt bepalen */
  if (Schermlist[CPmin.X][CPmin.Y].Z < Schermlist[CPmin.X][CPmax.Y].Z)

     {                    /* in de X-richting het verste punt bepalen */
      if (Schermlist[CPmin.X][CPmin.Y].Z < Schermlist[CPmax.X][CPmin.Y].Z)

	 {                    /* Ymin < Ymax AND Xmin < Xmax */
	  for(CPhuidig.Y = CPmin.Y; (CPhuidig.Y < CPmax.Y) && (knoppenstand != 2); CPhuidig.Y++)
	    {
	     for (CPhuidig.X = CPmin.X; CPhuidig.X < CPmax.X; CPhuidig.X++)
	       {
		poly[0] = Schermlist[CPhuidig.X  ][CPhuidig.Y  ].X;
		poly[1] = Schermlist[CPhuidig.X  ][CPhuidig.Y  ].Y;

		Az =   Coorlist[CPhuidig.X  ][CPhuidig.Y].Z;

		poly[2] = Schermlist[CPhuidig.X+1][CPhuidig.Y  ].X;
		poly[3] = Schermlist[CPhuidig.X+1][CPhuidig.Y  ].Y;
		poly[4] = Schermlist[CPhuidig.X+1][CPhuidig.Y+1].X;
		poly[5] = Schermlist[CPhuidig.X+1][CPhuidig.Y+1].Y;
		poly[6] = Schermlist[CPhuidig.X  ][CPhuidig.Y+1].X;
		poly[7] = Schermlist[CPhuidig.X  ][CPhuidig.Y+1].Y;

		color = ((Az - Zpmin) / Zpcolor) + beginkleur;

		setcolor(color);
		setfillstyle(1,color);
		fillpoly(4,poly);
		setcolor(zwart);
		line(poly[0],poly[1],poly[2],poly[3]);
		line(poly[0],poly[1],poly[6],poly[7]);
	       }
	     asm{
		 pusha
		 mov ax,3		/* bepaal de knoppenstand */
		 int 0x33
		 mov knoppenstand,bx
		 popa
		}

	    }
	 }
      else
	 {		    /* Ymin < Ymax AND Xmin > Xmax */
	  for(CPhuidig.Y = CPmin.Y; (CPhuidig.Y < CPmax.Y) && (knoppenstand != 2); CPhuidig.Y++)
	    {
	     for (CPhuidig.X = CPmax.X; CPhuidig.X > CPmin.X; CPhuidig.X--)
	       {
		poly[0] = Schermlist[CPhuidig.X-1][CPhuidig.Y  ].X;
		poly[1] = Schermlist[CPhuidig.X-1][CPhuidig.Y  ].Y;

		Az =   Coorlist[CPhuidig.X  ][CPhuidig.Y].Z;

		poly[2] = Schermlist[CPhuidig.X  ][CPhuidig.Y  ].X;
		poly[3] = Schermlist[CPhuidig.X  ][CPhuidig.Y  ].Y;
		poly[4] = Schermlist[CPhuidig.X  ][CPhuidig.Y+1].X;
		poly[5] = Schermlist[CPhuidig.X  ][CPhuidig.Y+1].Y;
		poly[6] = Schermlist[CPhuidig.X-1][CPhuidig.Y+1].X;
		poly[7] = Schermlist[CPhuidig.X-1][CPhuidig.Y+1].Y;

		color = ((Az - Zpmin) / Zpcolor) + beginkleur;

		setcolor(color);
		setfillstyle(1,color);
		fillpoly(4,poly);
		setcolor(zwart);
		line(poly[2],poly[3],poly[0],poly[1]);
		line(poly[2],poly[3],poly[4],poly[5]);
	       }
	     asm{
		 pusha
		 mov ax,3		/* bepaal de knoppenstand */
		 int 0x33
		 mov knoppenstand,bx
		 popa
		}

	    }
	}
     }
  else
     {                    /* in de X-richting het verste punt bepalen */
      if (Schermlist[CPmin.X][CPmin.Y].Z < Schermlist[CPmax.X][CPmin.Y].Z)

	 {                    /* Ymin > Ymax AND Xmin < Xmax */
	  for(CPhuidig.Y = CPmax.Y; (CPhuidig.Y > CPmin.Y) && (knoppenstand != 2); CPhuidig.Y--)
	    {
	     for (CPhuidig.X = CPmin.X; CPhuidig.X < CPmax.X; CPhuidig.X++)
	       {
		poly[0] = Schermlist[CPhuidig.X  ][CPhuidig.Y-1].X;
		poly[1] = Schermlist[CPhuidig.X  ][CPhuidig.Y-1].Y;

		Az =   Coorlist[CPhuidig.X  ][CPhuidig.Y].Z;

		poly[2] = Schermlist[CPhuidig.X+1][CPhuidig.Y-1].X;
		poly[3] = Schermlist[CPhuidig.X+1][CPhuidig.Y-1].Y;
		poly[4] = Schermlist[CPhuidig.X+1][CPhuidig.Y  ].X;
		poly[5] = Schermlist[CPhuidig.X+1][CPhuidig.Y  ].Y;
		poly[6] = Schermlist[CPhuidig.X  ][CPhuidig.Y  ].X;
		poly[7] = Schermlist[CPhuidig.X  ][CPhuidig.Y  ].Y;

		color = ((Az - Zpmin) / Zpcolor) + beginkleur;

		setcolor(color);
		setfillstyle(1,color);
		fillpoly(4,poly);
		setcolor(zwart);
		line(poly[6],poly[7],poly[0],poly[1]);
		line(poly[6],poly[7],poly[4],poly[5]);
	       }
	     asm{
		 pusha
		 mov ax,3		/* bepaal de knoppenstand */
		 int 0x33
		 mov knoppenstand,bx
		 popa
		}

	    }
	 }
      else
	 {		    /* Ymin > Ymax AND Xmin > Xmax */
	  for(CPhuidig.Y = CPmax.Y; (CPhuidig.Y > CPmin.Y) && (knoppenstand != 2); CPhuidig.Y--)
	    {
	     for (CPhuidig.X = CPmax.X; CPhuidig.X > CPmin.X; CPhuidig.X--)
	       {
		poly[0] = Schermlist[CPhuidig.X-1][CPhuidig.Y-1].X;
		poly[1] = Schermlist[CPhuidig.X-1][CPhuidig.Y-1].Y;

		Az =   Coorlist[CPhuidig.X  ][CPhuidig.Y].Z;

		poly[2] = Schermlist[CPhuidig.X  ][CPhuidig.Y-1].X;
		poly[3] = Schermlist[CPhuidig.X  ][CPhuidig.Y-1].Y;
		poly[4] = Schermlist[CPhuidig.X  ][CPhuidig.Y  ].X;
		poly[5] = Schermlist[CPhuidig.X  ][CPhuidig.Y  ].Y;
		poly[6] = Schermlist[CPhuidig.X-1][CPhuidig.Y  ].X;
		poly[7] = Schermlist[CPhuidig.X-1][CPhuidig.Y  ].Y;

		color = ((Az - Zpmin) / Zpcolor) + beginkleur;

		setcolor(color);
		setfillstyle(1,color);
		fillpoly(4,poly);
		setcolor(zwart);
		line(poly[4],poly[5],poly[6],poly[7]);
		line(poly[4],poly[5],poly[2],poly[3]);
	       }
	     asm{
		 pusha
		 mov ax,3		/* bepaal de knoppenstand */
		 int 0x33
		 mov knoppenstand,bx
		 popa
		}

	    }
	}
     }
}

