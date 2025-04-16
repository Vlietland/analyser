/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:       Parser headerfile      (Parser.h)             */
/* AUTEUR:               Resourser                                     */
/* BESCHRIJVING:                                                       */
/*   In deze H-file staan alle extra variabelen voor de Parser         */
/*                                                                     */
/*                                                                     */
/*                                                                     */
/* DATUM:                  3 oktober 1996                              */
/*=====================================================================*/

#define		maxtekens		40
/* 2 * maxtekens, dit is altijd genoeg */
#define		maxformule	        2*maxtekens
#define		maxmachine	        2*maxtekens
/* globale macros */
#define		eindelist		 0
#define		machineeindelist	-8000
/* convert macros */
#define		openhaakje		 1
#define		sluithaakje		 2
#define		operatie		 3
#define		getal			 4
#define		minteken		 5

#define		maxhaakjes		 4

#define		openhaakje		 1
#define		sluithaakjes		 2
/* Mconvert macros */

#define		Xvarcode		 4100
#define		Yvarcode		 4200

#define		machtcode		 5100
#define		maalcode		 5200
#define		deelcode		 5300
#define		optelcode		 5400
#define		aftrekcode		 5500

#define		openhaakjecode	 6000
#define		arctancode		 6010
#define		arcsincode		 6020
#define		arccoscode		 6030
#define		tancode		 6040
#define		sincode		 6050
#define		coscode		 6060
#define		logcode		 6070
#define		lincode		 6080
#define		expcode		 6090
#define		coshcode		 6100
#define		sinhcode		 6110
#define		abscode		 6120
#define		sluithaakjecode	 7000

#define		maxgetal		 1.0E10
#define		mingetal		-1.0E10