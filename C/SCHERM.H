/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:	Scherm.h		(Scherm.h)             */
/* AUTEUR:		Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   In deze H-file staan alle variabelen die nodig zijn voor het      */
/*   aansturen van het scherm					       */
/*                                                                     */
/*                                                                     */
/*                                                                     */
/* DATUM:                  10 oktober 1996                             */
/*=====================================================================*/

/* het globale scherm */
#define		schermXmin		 0
#define		schermYmin		 0
#define		schermXmax	       639
#define		schermYmax	       479

#define		schermkleur	       cyan
#define		schermlicht	       wit
#define		schermschaduw	       donkergrijs

#define		infotextkleur	       zwart
#define		extrainfotextkleur     rood

/* graphische gedeelte van het scherm */
#define		schermXgrmin	        10
#define		schermYgrmin	        40
#define		schermXgrmax	       460
#define		schermYgrmax	       470

#define		graphicviewport        setviewport(schermXgrmin,schermYgrmin,schermXgrmax,schermYgrmax,1)

#define		offsetXgrscherm	       ((schermXgrmax - schermXgrmin) / 2)
#define		offsetYgrscherm        ((schermYgrmax - schermYgrmin) / 2)

#define		viewportmargin	        35
#define		deltascherm            ((schermYgrmax - viewportmargin) - (schermYgrmin + viewportmargin))

#define		aantalkleuren	        13
#define		beginkleur	         1.5 /* afwijkingen naar het midden */
#define		graphbackgrkleur       zwart

#define		crosssize		 7
#define		crosshairkleur	       wit

/* formule gedeelte van het scherm */
#define		schermXfrmin	        10
#define		schermYfrmin	        10
#define		schermXfrmax	       460
#define		schermYfrmax	        30

#define		formulaviewport        setviewport(schermXfrmin,schermYfrmin,schermXfrmax,schermYfrmax,1)

#define		formulaXfxytext         15
#define		formulaYfxytext         07
#define		formulaXfxyformula      85

/* coordinatie gedeelte van het scherm */
#define		schermXcsmin	       480
#define		schermYcsmin	        10
#define		schermXcsmax	       560
#define		schermYcsmax	        90

#define		coorsysviewport	       setviewport(schermXcsmin,schermYcsmin,schermXcsmax,schermYcsmax,1)

#define		offsetXcsscherm	       ((schermXcsmax - schermXcsmin) / 2)
#define		offsetYcsscherm        ((schermYcsmax - schermYcsmin) / 2)

#define		coorbackgrkleur	       zwart

/* creator gedeelte van het scherm */
#define		schermXcrmin	       575
#define		schermYcrmin	        10
#define		schermXcrmax	       630
#define		schermYcrmax	        90

#define		creatorviewport        setviewport(schermXcrmin,schermYcrmin,schermXcrmax,schermYcrmax,1)

#define		creatortextkleur       zwart

/* informatie gedeelte en button gedeelte van het scherm */
#define		schermXinfmin	       480
#define		schermYinfmin	       115
#define		schermXinfmax	       630
#define		schermYinfmax	       470

#define		infoviewport	       setviewport(schermXinfmin,schermYinfmin,schermXinfmax,schermYinfmax,1)

#define         infobackgrkleur	       lichtgrijs

/* button gedeelte van het informatie scherm (coordinaten binnen de viewport */
#define		buttonlengte	       140
#define		buttonbreedte	        18
#define		buttontextoffset	 6

#define		buttonXpositie		 5

#define		analysebutYpositie     190
#define		rotatebutYpositie      analysebutYpositie + buttonbreedte + 5
#define		verplaatsbutYpositie   rotatebutYpositie + buttonbreedte + 5
#define		zoombutYpositie        verplaatsbutYpositie + buttonbreedte + 5
#define		zfactorbutYpositie     zoombutYpositie + buttonbreedte + 5
#define		configurebutYpositie   zfactorbutYpositie + buttonbreedte + 5
#define		quitbutYpositie        configurebutYpositie + buttonbreedte + 10

#define		buttonkleur	       lichtgrijs
#define		buttonschaduw	       donkergrijs
#define		buttonlicht	       wit
#define		buttontextkleur	       zwart

/* informatie gedeelte van het scherm (coordinaten binnen de viewport) */
#define		schermXvarmin          buttonXpositie
#define		schermYvarmin	       	 5
#define		schermXvarmax	       buttonXpositie + buttonlengte
#define		schermYvarmax	       schermYvarmin + 175

#define         colom1Xpositie		15
#define         colom2Xpositie          40
#define		colom3Xpositie		78

#define		XYAnalysetextYpositie   10
#define		XYAnalyseYpositie      XYAnalysetextYpositie + 9

#define		ZAnalysetextYpositie   XYAnalyseYpositie + 12
#define		ZAnalyseYpositie       ZAnalysetextYpositie + 9

#define		XdomeintextYpositie    ZAnalyseYpositie + 12
#define         XdomeinYpositie	       XdomeintextYpositie + 9

#define		YdomeintextYpositie    XdomeinYpositie + 12
#define         YdomeinYpositie        YdomeintextYpositie + 9

#define		phitextYpositie	       YdomeinYpositie + 12
#define         phiYpositie	       phitextYpositie + 9

#define         ZfactortextYpositie    phiYpositie + 12
#define         ZfactorYpositie	       ZfactortextYpositie + 9

#define		deltaCPtextYpositie    ZfactorYpositie + 12
#define		deltaCPYpositie	       deltaCPtextYpositie + 9

#define		XsamplestextYpositie   deltaCPYpositie + 12
#define		XsamplesYpositie       XsamplestextYpositie + 9

/* formule en Xsamples (graphische gedeelte van het scherm) */
#define		Xformulacolom1          15
#define		Xformulacolom2         102
#define		grapbuttonlengte       420
#define		grapbuttonbreedte       18

#define		Yforhelppositie         75
#define		Yforinvoergrpositie    Yforhelppositie + 30
#define         YXsampleshelppositie   Yforinvoergrpositie + 50
#define         YXsamplesinvoerpositie YXsampleshelppositie + 30

#define		Yforfoutpositie        375
#define		Yforreplypositie       Yforfoutpositie + 30

#define		formulabackgrkleur     lichtgrijs

