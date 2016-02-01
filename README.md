# polar-deep-search

#####Project Description
JPL and USC under the direction of Dr. Mattmann have worked to collect a corpus of “deep web” polar datasets spanning many file types, scientific data, images, videos, and other information on the Web. These pieces of data were collected using Apache Nutch, Apache Tika, and Apache Solr.

Right now, though the data has been collected, it has not been synthesized into a core website allowing Deep Search - ultimately the goal of this project is to construct such a web site using modern information retrieval technologies including Nutch, Tika and Solr, along with Banana, Facetview, and D3.js. The goal is to create http://polar.usc.edu and to use this website to demonstrate value to the NSF, to USC, and to NASA.

Polar Deep Search Engine for CSCI401 Capstone

#####Set up

######Maven

You will need to install Maven if you do not have it already.

https://maven.apache.org/

For mac, if you have homebrew:

`brew install maven`

######Install static dependencies

`npm install`

`bower install` or `node_modules/.bin/bower install`

You need to place static dependencies in resources:

`cp bower_components/startbootstrap-scrolling-nav/css src/main/resources/edu/usc/polar/`

`cp bower_components/startbootstrap-scrolling-nav/js src/main/resources/edu/usc/polar/`

`cp bower_components/startbootstrap-scrolling-nav/fonts src/main/resources/edu/usc/polar/`

######Start command:

From the root directory, run:

`mvn jetty:run`

Then navigate to http://localhost:8080/
