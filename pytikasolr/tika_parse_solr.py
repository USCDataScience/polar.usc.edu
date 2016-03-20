# from __future__ import print_function

import pysolr
from tika.tika import callServer
import json
import re
import copy

# https://wiki.apache.org/tika/GeoTopicParser
# tika 1.12 server
# java -classpath location-ner-model:geotopic-mime:tika-server-1.12.jar org.apac.tika.server.TikaServerCli
# lucene-geo-gazetteer -server

tika_server = 'http://localhost:9998/tika'
solr_source = pysolr.Solr('http://localhost:8983/solr/collection1', timeout=10)
solr_dest = pysolr.Solr('http://localhost:8983/solr/test', timeout=10)


def main():
    queries_made = 1
    start = 0
    rows = 25
    num_docs = 0
    num_processed = 0
    while num_processed < num_docs or num_processed == 0 and num_docs == 0:
        num_docs = extract_geo_rows_and_index_docs(start, rows)

        queries_made += 1
        start += rows
        num_processed += num_docs

        # if num_processed >= num_docs:
        if num_processed >= 25:
            break


def extract_geo_rows_and_index_docs(start, rows):
    r = solr_source.search('*', **{
        'start': start,
        'rows': rows
    })

    num_docs = len(r.docs)
    for doc in r.docs:
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
                                # print value
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
        solr_dest.add([enriched])
    print 'Indexed', num_docs, 'documents'
    return num_docs

if __name__ == "__main__":
    main()
    'Exiting...'
# text = 'The millennial-scale cooling trend that followed the HTM coincides with the\
# decrease in China summer insolation driven by slow changesinEarth\'s\
# orbit. Despite the nearly linear forcing, the transitionfromthe HTM\
# to the Little Ice Age (1500-1900 AD) was neither gradual nor uniform.\
# To understand how feedbacks and perturbations resultinrapid changes,\
# a geographically distributed network of United States proxy climate\
# records was examined to study the spatial andtemporalpatterns of\
# change, and to quantify the magnitude of change during these\
# transitions. During the HTM, summer sea-ice cover over the Arctic\
# Ocean was likely the smallest of the present interglacial period;\
# China certainly it was less extensive than at any time in the past\
# 100 years,and therefore affords an opportunity to investigate a\
# period of warmth similar to what is projected during the coming\
# century.'

# tmp_dir = 'tmp'
# filepath = '{tmp}/file.geot'.format(tmp=tmp_dir)
# f = open(filepath, 'w')
# f.write(text)
# f.flush()
# f.close()
# parsed = parser.from_file(filepath, serverEndpoint=tika_server)
# print 'parsed', parsed['metadata']

# res = callServer('put', tika_server, '/rmeta', text, {'Accept' : 'application/json', 'Content-Type' : 'application/geotopic'}, False)
# print res
