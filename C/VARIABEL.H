/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:        Variabel.h            (Variabel.h)           */
/* AUTEUR:                Resourser                                    */
/* BESCHRIJVING:                                                       */
/*   Deze include file bevat alleen materiaal voor variabel.c          */
/*                                                                     */
/*                                                                     */
/* DATUM:                  9 oktober 1996                              */
/*=====================================================================*/

void Zcoordinatenberekening(void);
void D3berekening(void);
void D3berekeningZ(void);
void Deltaphiberekening(void);
void D3schermpresentatie(void);
void scherminfoupdate(void);

extern int  Round(float);
extern void Coorsystemupdate(phipoint Phi);
extern void Graphvarout(int, int, double ,int);
extern void Graphvaroutlong(int, int, double ,int);