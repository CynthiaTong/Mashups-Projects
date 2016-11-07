# Audio Wave 
## a Web Audio Visualizer 
Audio Wave is a web development project. The main goal is to visualize the frequency data incoming audio (soundtracks). To achieve this goal, I used the soundCloud API to get the streamable audio url, Web Audio API to decode the frequency data, and D3.js to visualize.

The project is currently hosted here: [Audio Wave](http://xt405.nyuad.im/Mashups/Audio_Wave/). 

##Documentation 
For the second Mashups project, I created a webpage called “Audio Wave”, which visualizes the frequency data of incoming soundtracks. I got the idea when I browse through the “sound and video” page on the Mashups repository on Github. I got interested in making a website that visualizes audio  because so far I had never made a single webpage that has sound integrated into it. Also, when I went through the website of the <a>Chrome Music Lab</a>, I found their visualization of music fascinating. I spent like an hour exploring different visualizations, and settled down with the idea of  frequency “waves”, which I have seen many times online before but never thought I could create one myself.


After the initial brainstorming phase, I started trying to figure out how Web Audio API works. At first I tried to stream a sound file stored in my laptop, since I do not wish to start with the music APIs part. There are many tutorials on Web Audio API, and I went through everything I could find in the Mashups Repo/by Google before I understood the quite complicated mechanics of Web Audio. Basically, I need to create several functions in my javascript file to: 1) Initialize the “audio context” 2)make the audio request with the url of the soundtrack to decode the sound data 3)add “gains” and “analyzers” to control and make sense of the data and 4) finally connect everything together so that the sound can be played (and heard). I went through a period of “painful” experiment with each of these four steps. But eventually it worked out fine and I could play local music files.


The next thing I did was adding the play/pause button and the volume slider. I did some stackovqerflowing for this because I didn’t understand the Date.now() function at first. Since the native Javascript has nothing that does the pause (it’s either start or stop), I need to store in a variable called pausedAt when I paused the music, so that I could resume the music at the same point when the play/pause button is clicked again. The volume control function is much easier, since I can create the slider with the HTML input tag (type=“range”), and then create a gainNode that stores the value on the slider and controls the sound volume accordingly.


Then I started to explore music APIs. I mainly looked at the Spotify API and the SoundCloud API. The reason I finally settled with Soundcloud is just that it gives developers more freedom, and feels more user-friendly than the Spotify API (I read somewhere that you cannot stream music with Spotify but I didn’t verify it). It turns out SoundCloud API is indeed pretty easy to use, so I didn’t spend that much time figuring out the API and moved quickly to the visualization part. The darker side of the story is, the SoundCloud API doesn’t always provide high-quality soundtracks, or even the original version. There are always various versions of the same soundtrack which would sound weird.


I used D3 to visualize the frequency data of each incoming soundtracks. The frequency data is stored in a Uint8Array. After the SVGs are initialized, I created another updateChart() function that updates each bar in the bar chart according to the frequency number (ranging from 0-255) at each frame (I also includes a requestAnimationFrame() function, which means that updateChart() will repeat itself over and again and update the chart constantly). The same thing goes with the Reflection SVG that I added below the first bar chart to add onto the visual appeal of the webpage.


The final user interface is quite simple. There is a search engine near the top, which asks users to type in the soundtracks/artists they want to listen to. Then the users click the “Visualize” button to kick things off. While data is being collected, I implemented a spinner with spin.js to indicate the page is loading. After the Web Audio API gets everything it needs, the title of the soundtrack will appear and D3 starts to visualize. When the sound is being played, the user can pause/resume and adjust volume.  The final touch was to assign color to the bar chart, the reflection, and the search (“Visualize”) button.


When I presented the first prototype to the class on Tuesday, received some useful feedbacks. Peter C suggested that I display the soundtrack title at first. Shelly pointed out I messed up the sequence the play/pause image should appear. So I fixed these problems and added more style to the webpage by using Google fonts and expanding my CSS file :). The reception of the final version on Thursday seemed alright, but I didn’t really get much time to collect feedback. So I will probably show this project during the Arts Open Studios to get more idea of what people think about it.
