/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:   Variabelen manager (variabel.c)                   */
/* AUTEUR:           Resourser                                         */
/* BESCHRIJVING:                                                       */
/*    In dit blok vindt de administratie plaats van de variabelen      */
/*    Wanneer een variabele aangepast moet worden moet dit altijd      */
/*    via een van deze subroutines gebeuren.                           */
/*                                                                     */
/* INPUT PAR:              geen             	                       */
/* OUPUT PAR:              geen                                        */
/* DATUM:                  16 september 1996                           */
/*=====================================================================*/

#include       "struct.h"
#include       "array.ext"
#include       "scherm.h"
#include       "variabel.h"
#include       "constant.h"
#include       <graphics.h>


static    point Cmin ,Cmax;		/* randen van het functieonderzoek */
static    point Pmin ,Pmax;		/* randen van de presentatie */
static intpoint CPmin ,CPmax;		/* start en eindpunt in de Coorlist */
static phipoint Phi;

static float stapgrootte;		/* stapgrootte van de samples */
static float zftr;			/* factor voor de functie compressie */
static int   Xsamples;

static int   Xsamples25;
static int   Xsamples75;
static float deltaXcdiv2;		/* heronderzoeksfactor bij het uitzoomen */
static float deltaXcdiv8;		/* heronderzoeksfactor bij het inzoomen */
static float deltaC;

/*-------------------------------------------------------------------*/

void Analyse(intpoint verplaats)
{
  static point Analyse;
  float  functiestap = stapgrootte / 10;
  float  Z;

  Analyse.X += verplaats.X * functiestap;
  Analyse.Y += verplaats.Y * functiestap;

  if (Analyse.X > Pmax.X) Analyse.X = Pmax.X;
    else if (Analyse.X < Pmin.X) Analyse.X = Pmin.X;
  if (Analyse.Y > Pmax.Y) Analyse.Y = Pmax.Y;
    else if (Analyse.Y < Pmin.Y) Analyse.Y = Pmin.Y;

  Z = Drawcrosshair(Analyse,Phi,zftr);

  if ((verplaats.X != 0) || (verplaats.Y != 0))
     {
      infoviewport;
      Graphvarout(colom1Xpositie,XYAnalyseYpositie,Analyse.X,infotextkleur);
      Graphvarout(colom3Xpositie,XYAnalyseYpositie,Analyse.Y,infotextkleur);
      Graphvaroutlong(colom1Xpositie,ZAnalyseYpositie,Z,infotextkleur);
     }
}

/*-------------------------------------------------------------------*/

void Deltaphi(phipoint deltaphi)

{
 Phi.X += deltaphi.X;
 Phi.Z += deltaphi.Z;

 if (Phi.X > P2I) Phi.X -= P2I;
   else if (Phi.X < 0) Phi.X += P2I;
 if (Phi.Z > P2I) Phi.Z -= P2I;
   else if (Phi.Z < 0) Phi.Z += P2I;

 Deltaphiberekening();

 infoviewport;
 Graphvarout(colom1Xpositie,phiYpositie,Phi.X,infotextkleur);
 Graphvarout(colom3Xpositie,phiYpositie,Phi.Z,infotextkleur);
}

/*-------------------------------------------------------------------*/

void Zfactor(float deltazfactor)

{
 float dzftr = zftr / 10; /* dzftr is een factor van zftr daardoor */
			  /* wordt dzftr gerelateerd aan de huidige */
			  /* zftr en krijg je een vloeiendere regeling */

 zftr += dzftr * deltazfactor;

 if (zftr > zfactormax) zftr = zfactormax;
   else if (zftr < zfactormin) zftr = zfactormin;

 D3berekeningZ();

 infoviewport;
 Graphvaroutlong(colom1Xpositie,ZfactorYpositie,zftr,infotextkleur);
}

/*--------------------------------------------------------------------*/
/* Er is geen grens aan het verplaatsen. Wanneer het onderzoek buiten */
/* de niewe presentatie valt wordt het onderzoek en de presentatie    */
/* verschoven over de opgegeven verplaatsing                          */
/*--------------------------------------------------------------------*/

void Verplaatsing(intpoint verplaats)

{
 float deltaVerplaatsing;
 int   deltaCP;
 bool  Zcoor     = false;

 deltaCP = (CPmax.X - CPmin.X) / 4; /* maximale verplaatsing is rechts - links */
				    /* gedeeld door 4 --> maximale verplaatsing */
				    /* 2 x 0.25 = 50% */

 if (verplaats.X > deltaCP) verplaats.X = deltaCP;
   else if (verplaats.X < -deltaCP) verplaats.X = -deltaCP;
 if (verplaats.Y > deltaCP) verplaats.Y = deltaCP;
   else if (verplaats.Y < -deltaCP) verplaats.X = -deltaCP;

 CPmin.X += verplaats.X;
 CPmin.Y += verplaats.Y;
 CPmax.X += verplaats.X;
 CPmax.Y += verplaats.Y;


 if ((verplaats.X < 0) && (CPmin.X < 1))	/* X-verplaatsings berekeningen */
	   {
	    if (Cmin.X < Cminmin)
		   {
		    CPmin.X -= verplaats.X;
		    CPmin.Y -= verplaats.Y;
		    CPmax.X -= verplaats.X;
		    CPmax.Y -= verplaats.Y;
		   }

	      else {
		    deltaVerplaatsing = verplaats.X * stapgrootte;
		    Cmin.X += deltaVerplaatsing;
		    Cmax.X += deltaVerplaatsing;
		    Pmin.X += deltaVerplaatsing;
		    Pmax.X += deltaVerplaatsing;
		    Zcoor   = true;
		   }
	   }

   else if ((verplaats.X > 0) && (CPmax.X > Xsamples))
	   {
	    if (Cmax.X > Cmaxmax)
		   {
		    CPmin.X -= verplaats.X;
		    CPmin.Y -= verplaats.Y;
		    CPmax.X -= verplaats.X;
		    CPmax.Y -= verplaats.Y;
		   }

	      else {
		    deltaVerplaatsing = verplaats.X * stapgrootte;
		    Cmin.X += deltaVerplaatsing;
		    Cmax.X += deltaVerplaatsing;
		    Pmin.X += deltaVerplaatsing;
		    Pmax.X += deltaVerplaatsing;   /* presentatie lig weer op de rand */
		    Zcoor   = true;
		   }
	   }

 if ((verplaats.Y < 0) && (CPmin.Y < 1))	/* Y-verplaatsings berekeningen */
	   {
	    if (Cmin.Y < Cminmin)
		   {
		    CPmin.X -= verplaats.X;
		    CPmin.Y -= verplaats.Y;
		    CPmax.X -= verplaats.X;
		    CPmax.Y -= verplaats.Y;
		   }

	      else {
		    deltaVerplaatsing = verplaats.Y * stapgrootte;
		    Cmin.Y += deltaVerplaatsing;
		    Cmax.Y += deltaVerplaatsing;
		    Pmin.Y += deltaVerplaatsing;   /* presentatie lig weer op de rand */
		    Pmax.Y += deltaVerplaatsing;
		    Zcoor   = true;
		   }
	   }

   else if ((verplaats.Y > 0) && (CPmax.Y > Xsamples))
	   {
	    if (Cmax.Y > Cmaxmax)
		   {
		    CPmin.X -= verplaats.X;
		    CPmin.Y -= verplaats.Y;
		    CPmax.X -= verplaats.X;
		    CPmax.Y -= verplaats.Y;
		   }

	      else {
		    deltaVerplaatsing = verplaats.Y * stapgrootte;
		    Cmin.Y += deltaVerplaatsing;
		    Cmax.Y += deltaVerplaatsing;
		    Pmin.Y += deltaVerplaatsing;
		    Pmax.Y += deltaVerplaatsing;   /* presentatie lig weer op de rand */
		    Zcoor   = true;
		   }
	   }

 if (Zcoor == true) Zcoordinatenberekening();
   else		    D3berekening();

 infoviewport;
 Graphvarout(colom1Xpositie,XdomeinYpositie,Pmin.X,infotextkleur);
 Graphvarout(colom1Xpositie,YdomeinYpositie,Pmin.Y,infotextkleur);
 Graphvarout(colom3Xpositie,XdomeinYpositie,Pmax.X,infotextkleur);
 Graphvarout(colom3Xpositie,YdomeinYpositie,Pmax.Y,infotextkleur);
 Graphvarout(colom2Xpositie,deltaCPYpositie,(CPmax.X-CPmin.X+1),infotextkleur);
}
/*-------------------------------------------------------------------*/
/* Het in- en uitzoomen is de ingewikkelste module. Eerst wordt      */
/* gecontroleerd of bij het inzoomen de grenzen niet worden over-    */
/* schreden. Wanneer de presentatie buiten het functieonderzoek valt */
/* wordt er een nieuw functieonderzoek gemaakt die gecentreerd is    */
/* rond de presentatie                                               */
/*-------------------------------------------------------------------*/

void Zoom(int zoomfctr)

{
  float deltazoomfactor;
  int   deltaCP;
  bool  Zcoor     = false;


  deltaCP = (CPmax.X - CPmin.X) / 4; /* maximale zoomfactor is rechts - links */
				     /* gedeeld door 4 --> maximaal inzoomen */
				     /* 2 x 0.25 = 50 % */

  if (zoomfctr >   deltaCP) zoomfctr =  deltaCP;
  if (zoomfctr <  -deltaCP) zoomfctr = -deltaCP;

  CPmin.X +=zoomfctr;
  CPmin.Y +=zoomfctr;
  CPmax.X -=zoomfctr;
  CPmax.Y -=zoomfctr;
                      

  if  ((zoomfctr > 0) && ((CPmin.X > Xsamples25) ||
			  (CPmin.Y > Xsamples25) ||
			  (CPmax.X < Xsamples75) ||
			  (CPmax.Y < Xsamples75)))      /* inzoomen */
	   {
	    if (deltaC < deltaCmin)
		   {
		    CPmin.X -=zoomfctr;	/* bewerkingen ongedaan maken */
		    CPmin.Y -=zoomfctr;
		    CPmax.X +=zoomfctr;
		    CPmax.Y +=zoomfctr;
		   }

	      else {
		    deltazoomfactor = zoomfctr * (stapgrootte / 2);
		    Pmin.X += deltazoomfactor;      /* delen door twee omdat */
		    Pmin.Y += deltazoomfactor;      /* de stapgrootte ong. twee */
		    Pmax.X -= deltazoomfactor;      /* keer zo groot is tov */
		    Pmax.Y -= deltazoomfactor;      /* uitzoomen (relatief gezien) */
		    Cmin.X  = Pmin.X - deltaXcdiv8;
		    Cmin.Y  = Pmin.Y - deltaXcdiv8;
		    Cmax.X  = Pmax.X + deltaXcdiv8; /* onderzoek centreren */
		    Cmax.Y  = Pmax.Y + deltaXcdiv8; /* rond presentatie */
		    Zcoor   = true;
		   }
	   }

    else if  ((zoomfctr < 0) && ((CPmin.X < 1        ) ||
				 (CPmax.X > Xsamples ) ||
				 (CPmin.Y < 1        ) ||
				 (CPmax.Y > Xsamples)))      /* uitzoomen */
	   {
	    if ((Cmin.X < Cminmin) ||
		(Cmin.Y < Cminmin) ||
		(Cmax.X > Cmaxmax) ||
		(Cmax.Y > Cmaxmax))
		   {
		    CPmin.X -=zoomfctr;	/* bewerkingen ongedaan maken */
		    CPmin.Y -=zoomfctr;
		    CPmax.X +=zoomfctr;
		    CPmax.Y +=zoomfctr;
		   }

	      else {
		    deltazoomfactor = zoomfctr * stapgrootte;
		    Pmin.X += deltazoomfactor;
		    Pmin.Y += deltazoomfactor;
		    Pmax.X -= deltazoomfactor;
		    Pmax.Y -= deltazoomfactor;
		    Cmin.X  = Pmin.X - deltaXcdiv2;
		    Cmin.Y  = Pmin.Y - deltaXcdiv2;
		    Cmax.X  = Pmax.X + deltaXcdiv2; /* onderzoek centreren */
		    Cmax.Y  = Pmax.Y + deltaXcdiv2; /* rond presentatie */
		    Zcoor   = true;
		   }
	   }

  if (Zcoor == true) Zcoordinatenberekening();
    else		    D3berekening();

  infoviewport;
  Graphvarout(colom1Xpositie,XdomeinYpositie,Pmin.X,infotextkleur);
  Graphvarout(colom1Xpositie,YdomeinYpositie,Pmin.Y,infotextkleur);
  Graphvarout(colom3Xpositie,XdomeinYpositie,Pmax.X,infotextkleur);
  Graphvarout(colom3Xpositie,YdomeinYpositie,Pmax.Y,infotextkleur);
  Graphvarout(colom2Xpositie,deltaCPYpositie,(CPmax.X-CPmin.X+1),infotextkleur);
}


/*-------------------------------------------------------------------*/
void Varinit(float newXcmin,  float newXcmax,
	     float newYcmin,  float newYcmax,
	     int newXsamples, float newzftr,
	     float newPhiX,   float newPhiZ)

{
  if  (Cmin.X < Cminmin) Cmin.X = Cminmin;
  if  (Cmin.Y < Cminmin) Cmin.Y = Cminmin;
  if  (Cmax.X > Cmaxmax) Cmax.X = Cmaxmax;
  if  (Cmax.Y > Cmaxmax) Cmax.Y = Cmaxmax;

  if (newXcmax    <= newXcmin   ) newXcmax    = newXcmin + deltaCmin;
  if (newYcmax    <= newYcmin   ) newYcmax    = newYcmin + deltaCmin;
  if (newzftr     <  zfactormin ) newzftr     = zfactormin;
    else if (newzftr     >  zfactormax ) newzftr     = zfactormax;

  if (newXsamples <  Xsamplesmin) newXsamples = Xsamplesmin;
  else if (newXsamples >  Xsamplesmax) newXsamples = Xsamplesmax;


  Cmin.X  = newXcmin;
  Cmin.Y  = newYcmin;
  Cmax.X  = newXcmax;
  Cmax.Y  = newYcmax;

  Pmin.X  = Cmin.X;
  Pmin.Y  = Cmin.Y;
  Pmax.X  = Cmax.X;
  Pmax.Y  = Cmax.Y;

  zftr    = newzftr;

  newXsamples = (newXsamples / 4) * 4;	  			/* een veelvoud van vier */
  Xsamples= newXsamples;

  Xsamples25 = Xsamples   / 4;
  Xsamples75 = Xsamples25 * 3;

  Phi.X	  =  newPhiX;
  Phi.Z	  =  newPhiZ;

  Zcoordinatenberekening();

  infoviewport;
  Graphvarout(colom1Xpositie,XdomeinYpositie,Pmin.X,infotextkleur);
  Graphvarout(colom1Xpositie,YdomeinYpositie,Pmin.Y,infotextkleur);
  Graphvarout(colom3Xpositie,XdomeinYpositie,Pmax.X,infotextkleur);
  Graphvarout(colom3Xpositie,YdomeinYpositie,Pmax.Y,infotextkleur);

  Graphvarout(colom1Xpositie,phiYpositie,Phi.X,infotextkleur);
  Graphvarout(colom3Xpositie,phiYpositie,Phi.Z,infotextkleur);

  Graphvarout(colom2Xpositie,deltaCPYpositie,(CPmax.X-CPmin.X+1),infotextkleur);

  Graphvarout(colom2Xpositie,XsamplesYpositie,Xsamples,infotextkleur);
  Graphvaroutlong(colom1Xpositie,ZfactorYpositie,zftr,infotextkleur);
}


/*======================================================================*/
/* De volgende modules zijn voor de arrayberekeningen                   */
/*	* Zcoordinatenberekening  (totale nieuwe berekening               */
/*	* D3berekening		  (nieuwe kopie na het verplaatsen        */
/*	* Deltaphiberekening	  (nieuwe rotatie)                        */
/*	* D3schermpresentatie     (totale nieuwe grafische schermupdate   */
/*      * fastD3schermpresentatie (snelle nieuwe grafische schermupdate */
/*      * scherminfoupdate        (nieuwe variabeleninfo naar scherm    */
/*                                                                      */
/*======================================================================*/
void Zcoordinatenberekening(void)

{
  deltaC      = Cmax.X - Cmin.X;

  stapgrootte = deltaC / (Xsamples-1); /* er zijn voor Xsamples, Xsamples - 1 */
				       /* stappen nodig */
  deltaXcdiv2 = deltaC / 2;
  deltaXcdiv8 = deltaC / 8;

  CPmin.X = Round((Pmin.X - Cmin.X) / stapgrootte) +1; /* herbereken de arrayplaats */
  CPmin.Y = Round((Pmin.Y - Cmin.Y) / stapgrootte) +1; /* in de coorlist mbv de oude */
  CPmax.X = Round((Pmax.X - Cmin.X) / stapgrootte) +1; /* punten van de scherm- */
						       /* presentatie */
  CPmax.Y =  CPmin.Y + (CPmax.X - CPmin.X);

  Zcoordinatenupdate(Cmin, Xsamples, stapgrootte);
  D3berekening();
}

/*-------------------------------------------------------------------*/
void D3berekening(void)

{
  CopyConvertXY(CPmin, CPmax,
	      &Pmin.X, &Pmin.Y, &Pmax.X, &Pmax.Y);
  D3berekeningZ();
}
/*-------------------------------------------------------------------*/
void D3berekeningZ(void)

{
  CopyConvertZ(CPmin, CPmax, zftr);
  Deltaphiberekening();
}

/*-------------------------------------------------------------------*/
void Deltaphiberekening(void)

{
  Vectorupdate(Phi, CPmin, CPmax);
  Coorsystemupdate(Phi);
}

/*--------------------------------------------------------------------*/
void FastD3schermpresentatie(void)

{
  FastD3schermupdate(CPmin, CPmax);
}

/*--------------------------------------------------------------------*/
void D3schermpresentatie(void)

{
  D3schermupdate(CPmin, CPmax);
}

/*--------------------------------------------------------------------*/
void FullD3schermpresentatie(void)

{
  FullD3schermupdate(CPmin, CPmax);
}
