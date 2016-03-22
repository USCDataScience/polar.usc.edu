import pysolr
from pysolr import SolrError
from tika.tika import callServer
import json
import re
import copy
import argparse

__author__ = 'Lorraine Sposto'

# Using:
# Tika Server 1.12
# Command: lucene-geo-gazetteer -server
# Command: java -classpath location-ner-model:geotopic-mime:tika-server-1.12.jar org.apache.tika.server.TikaServerCli

SOLR_SOURCE = 'http://polar.usc.edu/solr/polar'
# SOLR_SOURCE = 'http://localhost:8983/solr/collection1'
SOLR_DEST = 'http://localhost:8983/solr/geo'
TIKA_SERVER = 'http://localhost:9998/tika'


def extract_geo_from_doc(doc, tika):
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
    try:
        names = []
        coords = []
        if 'content' in doc:
            content = doc['content']
            if type(content) is list:
                for c in content:
                    res = callServer('put', tika, '/rmeta', c, {'Accept' : 'application/json', 'Content-Type' : 'application/geotopic'}, False)
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


def process_solr_docs(start, rows, rounds, src, dest, tika):
    queries_made = 0
    num_total_successful = 0
    num_total_failure = 0

    print 'Solr Source', src
    print 'Solr Dest', dest
    print 'Tika', tika
    print 'Start:', start
    print 'Rows:', rows
    print '---------------\n'

    solr_src = pysolr.Solr(src, timeout=10)
    solr_dest = pysolr.Solr(dest, timeout=10)

    for i in range(rounds):
        print 'Fetching', rows, 'rows from', start
        r = solr_src.search('*', **{
            'start': start,
            'rows': rows
        })

        for doc in r.docs:
            geo_enriched_doc = extract_geo_from_doc(doc, tika)

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
                    solr_dest.add([geo_enriched_doc], boost=boost)
                    num_total_successful += 1
                except SolrError as e:
                    print e.message
                    num_total_failure += 1
                    print 'Failed at', num_total_failure, 'docs'
        queries_made += 1
        start += rows
        print 'Indexed', num_total_successful, 'docs'

    print '\n---------------'
    print 'Hit Solr', queries_made, 'times'
    print 'Successfully indexed', num_total_successful, 'docs'


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Extract geospatial data from one solr core and index into another.')
    parser.add_argument('-s', '--src', dest='source', default=SOLR_SOURCE, help='url of source solr core')
    parser.add_argument('-d', '--dest', dest='dest', default=SOLR_DEST, help='url of destination solr core')
    parser.add_argument('-t', '--tika', dest='tika', default=TIKA_SERVER, help='url of running tika server')
    parser.add_argument('--start', dest='start', type=int, default=0, help='start row to query solr, default 0')
    parser.add_argument('--rows', dest='rows', type=int, default=1000, help='number of rows to query from solr, default 1000')
    parser.add_argument('--rounds', dest='rounds', type=int, default=1, help='number of times to query from solr, default 1')

    # process_solr_docs()

    args = parser.parse_args()
    solr_src = args.source
    solr_dest = args.dest
    tika = args.tika
    start = args.start
    rows = args.rows
    rounds = args.rounds

    process_solr_docs(start, rows, rounds, solr_src, solr_dest, tika)

    print 'Exiting...'
