# **Color Charter** #

## *A Tool For Selecting Colors* ##
**Color Charter** is a basic website that allows a user to generate various color palettes from a key color of their choosing.
___

## *How To Get Started* ##
**1.** Open a new tab in your browser.

**2.** Drag the `index.html` file to the new tab.
___

## *User Features* ##
**Color Charter** alows a user to select a color from a dragable input, or enter a color of their choosing using hex, rgb, or hsl color values. The user can also input a secondary color to generate gradients between that color and their key color. The user can then peruse the various palettes and additionally store them or copy their data.
___

## *Site Capabilities* ##
**Color Charter** generates 6 common color palettes: complementary, triad, tetrad, split complementary, analogous, and monochrome. Additionally it can create 4 accent palettes of grayshades, tints, common colors, and gradients between a secondary color. All palettes can be temporarily saved and revisited, or their values can be saved to a clipboard for implementation in an editor or CSS file.
___

## *Project Status* ##
**Color Charter** was fun to build and I learned a lot. It may be a project I return to from time to time to make updates or add features of ideas I get about colors and user interaction. One update would be to implement a database so that a user could store an unlimited number of labeled palettes that would not be lost on refresh.
___

## *Project Author* ##
**Color Charter** was created by Rob Chambers, a graduate of The Last Mile in Putnamville, Indiana. He is now a TA and has been with The Last Mile since 2019.
___

## *Acknowledgements* ##
I have never built a project on my own; there are always numerous moments during a build when I need to reach out to others for assistance. This project was no different, and I received help large and small from TAs Keith Evans, Darin Williams, Mike Stayer, Joseph Baker, and Stuart Noffsinger.

The greatest help I received on **Color Charter**, however, came from the classroom facilitator Stephanie Mizelle. This project would have been much less significant (if not nonexistent) without her research, input, and encouragement to continue.
___

## *Why I Made Color Charter* ##
In august of 2021, I noticed something wrong with the palette generator on TLM.cloud. The complementary color to red (#ff0000) was not coming up not as cyan (#00ffff), but as some random shade of green. Even worse, the triadic colors came up different values almost every time the same color input was fed into the generator. I reported the problem to TLM, and they pulled the generator down. Although it was replaced several weeks later, I got the idea in the meantime to create my own simple generator.

I intended to make a basic HTML page with JavaScript that would take a key color as input then produce complementary and triadic colors. As most projects go, it soon got out of hand. The result is a site named **Color Charter** (still only vanilla JavaScript) that provides many color palettes and even tints, shades, and grays so that I can choose the best colors when designing an app or website. What I didn't count on was that the other guys in the room would want to use it for their designs too. And that is why I created a clipboard feature so that all palettes generated can be dropped directly into a text editor or a css file for immediate application to actual project elements.
___

## *Technologies Used and Other Notes* ##
**Color Charter** was built with HTML, CSS, and JavaScript. Several advanced features and techniques were used, including high-order functions, bitwise processing, various APIs, and CSS keyframe animation.

This project also includes JavaScript that would in some instances be considered vulnerable code. Specifically, the `innerHTML` API is susceptible to cross-site scripting (XSS), but only when it is used to insert user input into the document. This site does not use `innerHTML` in that way, which makes it secure against attackers who would inject malicious tags or scripts.
