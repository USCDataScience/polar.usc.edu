# -*- coding: utf-8 -*-
"""
Created on Sat Apr 30 18:49:02 2016

@author: yashtanna93
"""

import requests
import json
import os

url = 'http://54.183.25.174:9200/polar.usc.edu/_search?q=*:*&size=10000&fields='
count = 0
res = requests.get(url+'id')
result = res.json()['hits']['hits']
size = []
for row in result:
    try:
        count+=1
        print count,' -- ',row['_id'],'--',
        resin = requests.get('http://54.183.25.174:9200/polar.usc.edu/metadata/'
                + row['_id'])
        resultin = resin.json()['_source']
        with open('temp.txt', 'wb') as f:
            f.write(str(resultin))
        indexsize = os.path.getsize('temp.txt')
        tempdic = {}
        tempdic['id'] = row['_id']
        tempdic['metaDataSize'] = indexsize
        tempdic.update(resultin)
        size.append(tempdic)
        print 'success'
    except:
        continue
#print size
with open('datasize.json', 'wb') as f:
    json.dump(size, f, indent=2)