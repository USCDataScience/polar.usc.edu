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

or

`mvn tomcat7:run`

Then navigate to <http://localhost:8080>



# Indexing to Solr from Team Project Submission

Downloading the directory of a team's submission from the Amazon S3 bucket, you likely will end up with something like this:

```
├── TeamX/
│   ├── cca
│   ├── raw
│   │   ├── crawldb
│   │   ├── linkdb
│   │   ├── segments
```

When one performs a Nutch crawl, the data is stored in `crawldb`, `linkdb`, and `segments`. This data can be indexed into Solr and viewed in a Banana dashboard. Wooh!

### Version Info
For reference, the versions I'm using are as follows:
- Solr 4.4.0
- Nutch 1.10 or 1.11 (don't remember, my downloads folder tells me 1.11 but my  notes say 1.10-trunk as per the CS572 Assigment)
- Banana 1.5

### Putting it all together
##### Solr
For me, Solr is at `~/solr-4.4.0/solr` (i.e. the internal solr directory); this is what I'll refer to as `$SOLR_HOME`. In `$SOLR_HOME` to build a directory of the example set-up at `$SOLR_HOME/example`:
```
ant example
```
Navigate to that `$SOLR_HOME/example`. To run the example:
```
java -jar start.jar
```
Then navigate to http://localhost:8983/solr to bring you to the admin page where you can manage collections. Cool!

##### + Banana

Adding Banana to Solr is quick and easy, as outlined in the README on [it's Github page](https://github.com/LucidWorks/banana). The following two instructions are taken directly from there, for the versions mentioned here:
- Copy banana folder to $SOLR_HOME/example/solr-webapp/webapp/
- Browse to <http://localhost:8983/solr/banana/src/index.html>

More about this in relation to the Wicket project in the notes at the bottom.
##### + Nutch

For basic knowledge of how to use Nutch, [the tutorial](https://wiki.apache.org/nutch/NutchTutorial) is very effective. Go through the example there. It also covers a bit of incorporation with Solr. 

As metioned earlier, and as you can see from performing the example crawl, the data is stored in `crawl/crawldb`, `crawl/linkdb`, and `crawl/segments`. Indexing this data to Solr is easy (as you can see from the example); it just requires moving this stuff into your `${NUTCH_HOME}/crawl` directory (or some other working directory with Nutch in there). 

Then run the commands: 
```
bin/nutch invertlinks crawl/linkdb -dir crawl/segments
bin/nutch solrindex http://localhost:8983/solr crawl/crawldb/ -linkdb crawl/linkdb/ crawl/segments/* -filter -normalize
```
Now in theory the data should be indexed into Solr and viewable in the Banana dashboard

#### Notes:
As the Nutch tutorial says, Solr's and Nutch's `schema.xml`s must match. Additionally, if you navigate to the Banana dashboard, the default widgets may give you a message saying `event_timestamp` is not defined. I ran into this issue because `schema.xml` from Nutch defined the timestamp value as `tstamp`, while Banana is expecting it to be called `event_timestamp`. 

You can configure it how I did by changing the variable name to `event_timestamp` in Solr's `schema.xml` and updating `${NUTCH_HOME}/conf/solrindex-mapping.xml` to map `tstamp` to `event_timestamp` (don't do this it's not necessary save yourself headaches)

OR

In the Banana dashboard just configure the name of the field the widgets should be querying (the cog icon at the top of each panel).

In relation to our Wicket project, Banana is already placed in the project's webapp folder (`src/main/webapp`). You can see the same results of the Banana dashboard at <http://localhost:8080/banana/#/dashboard> when you start the tomcat/jetty server.

#### Pushing to gh-pages
Here's a straightforward guide to adding things to the static github page:

* Checkout the gh-pages branch
* Modify whatever files you want to
* Commit and push to `origin gh-pages`

That's it.
