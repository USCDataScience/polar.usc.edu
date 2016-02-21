#D3 Visualizations

####Main HTML Files
Currently, we have a D3 tab on our home page that leads to a separate HTML page -- this is the page that we will be posting examples on for now. The HTML file for this page is located in data/HTML/D3.html. 

We are not planning to use this format in the future as we are going to integrate a couple of these examples within the home page, particularly under the 'Features' section. Nevertheless, linking to separate HTML pages for now will be a good start.

####Where To Place Files
Files such as json, txt, and csv files belong in the data directory. Javascript files belong in the js/D3 directory. HTML files (which we will be eliminating later) should be placed in data/HTML directory.

When adding a new team's HTML file to the page, navigate to data/HTML/D3.html. Scroll down to the D3 section and simply add another link.

####How To Start Finding Projects
We will be mainly looking at D3, so focus on the HW3 project submissions found in the Dropbox link that Dr. Mattmann provided us.

Every team has a different structure for their project. To add to the confusion, half of the teams' submissions are incomplete and cannot be used. Additionally, some projects, such as Mohammad's (Team 40), request data from Solr to generate data for D3 to consume and cannot be used (as of yet). However, there are still quite a few projects that may be useful at this time -- we just need to find them.

#####Example: Extracting D3 stuff from Team 29
-------------------
- Create a folder on your Desktop. This will be our test folder and I will reference it as TEST.
- Navigate to Team 29's HW3 Submission folder. 
- Follow this path: TOTAL_PRERNAN_CSCI572_HW_DATAVIS/src
- Extract hw3.zip and open the hw3 folder

I took three widgets from Team 29's project. One of them Lorraine had demonstrated on the main Wicket page, worldmap-template.html. The other two that I extracted were timeSeriesChart.html and widget3.html. I will just focus on timeSeriesChart.html.

- Copy timeSeriesChart.html over to the TEST folder. Open the copied version of the file.

Immediately, you will see a ton of scripts and links that this HTML file is dependent on. However, a majority of these links are actually not needed and can be removed. If you compare this to the file to the file I altered, which can be found in the Github page's data/HTML/Team29SiteC.html, you can see links that I removed.

- Remove unnecessary links/scripts in timeSeriesChart.html



A lot of these files already exist in our Github page repo. Files such as bootstrap.min.js, jquery-1.7.1.min.js, etc are located in the js directory and can be linked accordingly. However, a couple of files such as timeSeriesChart.js and clickPanel.js have been created by the Team themselves and need to be transferred over to our repo. As stated above, these javascript files can be placed in the js/D3 directory. 

- Place all necessary js and css files into the appropriate folders. You will have to change the src (for scripts) or href (for links) links in timeSeriesChart.html so that they navigate to the correct folder.

After all the js and css dependencies are sorted out, we can move on to separating the javascript functions from the HTML files. As you can see in timeSeriesChart.html near the bottom of the file, there is a function drawTimeSeries() javascript function. We want to remove this and place it in a separate file. I simply just cut and paste it into another file and named it Team29c.js. It can be found in js/D3/Team29c.js if you want to reference it. 

- Remove any javascript functions, typically found near the bottom of the HTML file, and place it in a separate file. Place this file in the js/D3 directory



 




