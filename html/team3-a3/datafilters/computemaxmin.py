# -*- coding: utf-8 -*-
"""
Created on Sun May  1 09:42:21 2016

@author: yashtanna93
"""
import json
maxmin = {}
with open('parserdata.json', 'rb') as f:
    data = eval(f.read())
for key in data:
    tempdic = {}
    tempdic['maxbody'] = max(data[key][1])
    tempdic['minbody'] = min(data[key][1])
    tempdic['maxmeta'] = max(data[key][2])
    tempdic['minmeta'] = min(data[key][2])
    maxmin[key] = tempdic
with open('maxminparser.txt', 'wb') as f:
    json.dump(maxmin, f, indent=2)