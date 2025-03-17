/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:   De knoppenroutines  (Buttons.c)                   */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*    Deze routine bevat drie functies:                                */
/*    * Createbutton                                                   */
/*    * Buttonin                                                       */
/*    * Buttonout                                                      */
/*    Deze routines zijn eigenlijk erg eenvoudig. Met Createbutton     */
/*    wordt er een knop gecreerd. Met Buttonin wordt de knop           */
/*    ingedrukt. Met Buttonout wordt de knop uitgedrukt                */
/*                                                                     */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                  16 september 1996                           */
/*=====================================================================*/

#include	<graphics.h>
#include	"constant.h"
#include	"scherm.h"

void Createbutton(int Xpositie,int Ypositie,char text[])

{
 int poly[8];
 int Xeinde = Xpositie + buttonlengte;
 int Yeinde = Ypositie + buttonbreedte;


 poly[0] = Xpositie;
 poly[1] = Ypositie;
 poly[2] = Xeinde;
 poly[3] = Ypositie;
 poly[4] = Xeinde;
 poly[5] = Yeinde;
 poly[6] = Xpositie;
 poly[7] = Yeinde;

 infoviewport;

 setcolor(buttonlicht);
 setfillstyle(1,buttonkleur);
 fillpoly(4,poly);

   line(Xpositie-1,Yeinde+1,Xpositie-1,Ypositie-1);
   line(Xpositie-1,Ypositie-1,Xeinde+1,Ypositie-1);

 setcolor(buttonschaduw);
   line(Xeinde,Ypositie,Xeinde,Yeinde);
   line(Xeinde,Yeinde,Xpositie,Yeinde);
   line(Xeinde+1,Ypositie-1,Xeinde+1,Yeinde+1);
   line(Xeinde+1,Yeinde+1,Xpositie-1,Yeinde+1);

 setcolor(buttontextkleur);
 outtextxy(Xpositie+buttontextoffset,Ypositie+buttontextoffset,text);
}


void Buttonin(int Xpositie,int Ypositie)

{
 int Xeinde = Xpositie + buttonlengte;
 int Yeinde = Ypositie + buttonbreedte;

 infoviewport;

 setcolor(buttonschaduw);
   line(Xpositie,Yeinde,Xpositie,Ypositie);
   line(Xpositie,Ypositie,Xeinde,Ypositie);
   line(Xpositie-1,Yeinde+1,Xpositie-1,Ypositie-1);
   line(Xpositie-1,Ypositie-1,Xeinde+1,Ypositie-1);

 setcolor(buttonlicht);
   line(Xeinde,Ypositie,Xeinde,Yeinde);
   line(Xeinde,Yeinde,Xpositie,Yeinde);
   line(Xeinde+1,Ypositie-1,Xeinde+1,Yeinde+1);
   line(Xeinde+1,Yeinde+1,Xpositie-1,Yeinde+1);

}


void Buttonout(int Xpositie,int Ypositie)

{
 int Xeinde = Xpositie + buttonlengte;
 int Yeinde = Ypositie + buttonbreedte;

 infoviewport;

 setcolor(buttonlicht);
   line(Xpositie,Yeinde,Xpositie,Ypositie);
   line(Xpositie,Ypositie,Xeinde,Ypositie);
   line(Xpositie-1,Yeinde+1,Xpositie-1,Ypositie-1);
   line(Xpositie-1,Ypositie-1,Xeinde+1,Ypositie-1);

 setcolor(buttonschaduw);
   line(Xeinde,Ypositie,Xeinde,Yeinde);
   line(Xeinde,Yeinde,Xpositie,Yeinde);
   line(Xeinde+1,Ypositie-1,Xeinde+1,Yeinde+1);
   line(Xeinde+1,Yeinde+1,Xpositie-1,Yeinde+1);

}

void Createcustombutton(int Xmin, int Ymin, int Xmax, int Ymax,
			int fieldkleur, int fieldlicht ,int fieldschaduw)

{
 int poly[8];

 poly[0] = Xmin;
 poly[1] = Ymin;
 poly[2] = Xmax;
 poly[3] = Ymin;
 poly[4] = Xmax;
 poly[5] = Ymax;
 poly[6] = Xmin;
 poly[7] = Ymax;

 infoviewport;

 setcolor(fieldlicht);
 setfillstyle(1,fieldkleur);
 fillpoly(4,poly);

   line(Xmin-1,Ymax+1,Xmin-1,Ymin-1);
   line(Xmin-1,Ymin-1,Xmax+1,Ymin-1);

 setcolor(fieldschaduw);
   line(Xmax,Ymin,Xmax,Ymax);
   line(Xmax,Ymax,Xmin,Ymax);
   line(Xmax+1,Ymin-1,Xmax+1,Ymax+1);
   line(Xmax+1,Ymax+1,Xmin-1,Ymax+1);
}

void Create3Dfield(int Xmin, int Ymin, int Xmax, int Ymax,
		   int fieldkleur, int fieldlicht ,int fieldschaduw)

{
 int poly[8];

 poly[0] = Xmin;
 poly[1] = Ymin;
 poly[2] = Xmax;
 poly[3] = Ymin;
 poly[4] = Xmax;
 poly[5] = Ymax;
 poly[6] = Xmin;
 poly[7] = Ymax;

 setcolor(fieldlicht);
 setfillstyle(1,fieldkleur);
 fillpoly(4,poly);

   line(Xmin-1,Ymax+1,Xmin-1,Ymin-1);
   line(Xmin-1,Ymin-1,Xmax+1,Ymin-1);
   line(Xmin-2,Ymax+2,Xmin-2,Ymin-2);
   line(Xmin-2,Ymin-2,Xmax+2,Ymin-2);

 setcolor(fieldschaduw);
   line(Xmax,Ymin,Xmax,Ymax);
   line(Xmax,Ymax,Xmin,Ymax);
   line(Xmax+1,Ymin-1,Xmax+1,Ymax+1);
   line(Xmax+1,Ymax+1,Xmin-1,Ymax+1);
   line(Xmax+2,Ymin-2,Xmax+2,Ymax+2);
   line(Xmax+2,Ymax+2,Xmin-2,Ymax+2);
}

void Createzoomfield(int Xminmin, int Ymin, int Xmaxmax, int Ymax,
		     int fieldkleur, int fieldlicht ,int fieldschaduw ,int speed)

{
 int poly[8];
 int Xmin,Xmax;
 int Xgem = (Xmaxmax + Xminmin) / 2;

 for (Xmin = Xmax = Xgem; Xmin > Xminmin; Xmin -=speed, Xmax +=speed)
   {
    poly[0] = Xmin;
    poly[1] = Ymin;
    poly[2] = Xmax;
    poly[3] = Ymin;
    poly[4] = Xmax;
    poly[5] = Ymax;
    poly[6] = Xmin;
    poly[7] = Ymax;

    setcolor(fieldlicht);
    setfillstyle(1,fieldkleur);
    fillpoly(4,poly);

      line(Xmin-1,Ymax+1,Xmin-1,Ymin-1);
      line(Xmin-1,Ymin-1,Xmax+1,Ymin-1);
      line(Xmin-2,Ymax+2,Xmin-2,Ymin-2);
      line(Xmin-2,Ymin-2,Xmax+2,Ymin-2);

    setcolor(fieldschaduw);
      line(Xmax,Ymin,Xmax,Ymax);
      line(Xmax,Ymax,Xmin,Ymax);
      line(Xmax+1,Ymin-1,Xmax+1,Ymax+1);
      line(Xmax+1,Ymax+1,Xmin-1,Ymax+1);
      line(Xmax+2,Ymin-2,Xmax+2,Ymax+2);
      line(Xmax+2,Ymax+2,Xmin-2,Ymax+2);
   }
}

