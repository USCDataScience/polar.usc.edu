import pysolr
from pysolr import SolrError
from tika.tika import callServer
import json
import re
import copy
import atexit

__author__ = 'Lorraine Sposto'

# Using:
# Tika Server 1.12
# Command: lucene-geo-gazetteer -server
# Command: java -classpath location-ner-model:geotopic-mime:tika-server-1.12.jar org.apache.tika.server.TikaServerCli

SOLR_SOURCE = pysolr.Solr('http://polar.usc.edu/solr/polar', timeout=10)
SOLR_DEST = pysolr.Solr('http://polar.usc.edu/solr/geo_enriched', timeout=10)


def extract_geo(doc):
    """
    Uses Tika to extract geo data and returns an updated copy of the document.

    This script utilizes GeoTopicParser: https://wiki.apache.org/tika/GeoTopicParser
    Make sure to follow the set up steps at the link above to set up location-ner-model and geotopic-mime.

    This script queries documents from the Solr source core and extracts geo data from the document's 'content' field.
    GeoTopicParser returns a set of location names and coordinates. This information is added to each document in the
    fields 'location_names' and 'location_coordinates' respectively, and the new document is indexed to the destination
    core.

    Make sure you have:
      - a lucene-geo-gazetteer server running.
      - a Tika server running with location-ner-model and geotopic-mime in the classpath. Set the Tika server url below.
      - a Solr server running. Set the source core url (the core of documents you want to process)
          and the destination core url (where the enriched documents will go).

    This script assumes Tika is set up with GeoTopicParser. If any of the above is not satisfied, documents will still be
    indexed into the destination core, but will not have any new data. If you do not configure your own Tika server,
    tika-python will attempt to start its own server, which will not have the necessary items in the classpath.
    Additionally, the gazetteer must be running for the Geo extractions to be performed.

    :param doc: A document from solr, as a dict
    :return: Updated document, as a dict, or None if error
    """
    tika_server = 'http://localhost:9998/tika'
    try:
        names = []
        coords = []
        if 'content' in doc:
            content = doc['content']
            if type(content) is list:
                for c in content:
                    res = callServer('put', tika_server, '/rmeta', c, {'Accept' : 'application/json', 'Content-Type' : 'application/geotopic'}, False)
                    if res[0] == 200:
                        parsed = res[1]
                        parsed_json = json.loads(parsed)
                        for item in parsed_json:
                            # Group long/lat/name by index
                            geo_groups = {}
                            for key in item.keys():
                                reg = re.findall(r'Optional_([a-zA-Z]+)(\d+)', key)
                                if reg:
                                    attr = str(reg[0][0]).lower()
                                    n = str(reg[0][1])
                                    if n not in geo_groups.keys():
                                        geo_groups[n] = {}
                                    geo_groups[n][attr] = item[key]

                            for key, value in geo_groups.iteritems():
                                geokeys = value.keys()
                                if 'name' in geokeys:
                                    names.append(value['name'])
                                lat = ""
                                longd = ""
                                if 'latitude' in geokeys:
                                    lat = str(value['latitude'])
                                if 'longitude' in geokeys:
                                    longd = str(value['longitude'])
                                coords.append(lat + ',' + longd)

        # now we have all names grouped, all coordinates grouped
        enriched = copy.deepcopy(doc)
        del enriched['_version_']
        enriched['location_name'] = names
        enriched['location_coordinates'] = coords

        return enriched
    except Exception as e:
        print e.message
        return None


def process_solr_docs():
    queries_made = 0
    start = 0
    rows = 100
    hits = 0
    num_processed = 0
    num_total_successful = 0

    print 'Start:', start
    print 'Rows:', rows
    print '---------------\n'

    while num_processed < hits or num_processed == 0 and hits == 0:
        print 'Fetching', rows, 'rows from', start
        r = SOLR_SOURCE.search('*', **{
            'start': start,
            'rows': rows
        })
        if hits == 0:
            hits = r.hits

        num_docs = len(r.docs)
        print 'Processing', num_docs, 'docs'
        num_successful = 0
        for doc in r.docs:
            geo_enriched_doc = extract_geo(doc)

            if geo_enriched_doc is not None:
                boost = None
                if 'boost' in geo_enriched_doc.keys():
                    boost = geo_enriched_doc['boost']
                    del geo_enriched_doc['boost']

                if 'tstamp' in geo_enriched_doc.keys():
                    tstamp = geo_enriched_doc['tstamp']
                    reg = re.findall('ERROR:SCHEMA-INDEX-MISMATCH,stringValue=(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d+Z)', tstamp)
                    if reg is not None:
                        tstamp = str(reg[0])
                        geo_enriched_doc['tstamp'] = tstamp
                try:
                    SOLR_DEST.add([geo_enriched_doc], boost=boost)
                except SolrError as e:
                    print e.message
                    exit_handler(num_total_successful)
                num_total_successful += 1

        queries_made += 1
        start += rows
        num_processed += num_docs
        print 'Indexed', num_processed, '/', hits, 'docs'

    print '\n---------------'
    print 'Hit Solr', queries_made, 'times'
    print 'Processed', num_processed, 'docs'
    print 'Successfully indexed', num_total_successful, 'docs'


def exit_handler(number):
    print 'Total indexed', number
    print 'Exiting...'


if __name__ == "__main__":
    process_solr_docs()
    # parse_date_time()

    print 'Exiting...'
