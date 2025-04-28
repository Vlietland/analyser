GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007

Copyright (C) 2025 YOUR_NAME

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation as declared in @@@LICENSE.

This project is a remake of an old project. That old project was inspired by my math teacher during 3D math. He was unable to graphically show the formulas. I therefore created a dos-based application that parses and graphically renders the formula. Strengths of the application was the realtime rendering based on mouse handing. The old project took me approximately 6 weeks to complete for which I spend most of my free time :-).

Given the latest AI-development I decided to create a remake and see how much productivity gains I could achieve. The project took me approximately 2 weeks parttime. My first attempt was a bit too bold by asking the AI to (1) analyse the code, (2) make a plan to migrate the code to modern technology and (3) build the project. I used Claude 3.7, Gemini 2.5, Llama, OpenAI and Deepseek. I started bottom-up, first with the core, then the rendering engine and lastly the UI.

My first experience was 'wow' with a working 80% version. However the last 20% resulted in lots of frustration. I ended up in 80% refactoring, simplifying the code and removing lots and lots of redundancy, created by the AI. 

Finally, I removed the UI completely and rebuilt the UI and rendering layer by small instructive prompts. It would probably been possible within one week by starting with that instructive way from the start.

The application hosted on github pages and available here:

The application is easy to use. Just type in the formula and let the magic to its work. A few nice 3D f(x,y) expressions:
sin(sqrt(x^2 + y^2))
sin(x) * cos(y)
sin(5 * sqrt(x^2 + y^2)) / sqrt(x^2 + y^2)
x^2 - y^2
(x^2 + y^2) * cos(x^2 + y^2)
sin(x^2 - y^2)
sqrt(1 - (x/2)^2 - (y/2)^2)