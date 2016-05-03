# -*- coding: utf-8 -*-
"""
Created on Sun May  1 21:59:06 2016

@author: yashtanna93
"""

import json

terms = []
filterdic = {}
newdic = {}
with open('keys.txt', 'rb') as f:
    for line in f:
        line = line.rstrip('\r\n').lower()
        terms.append(line)
with open('measuremimedata.json', 'rb') as f:
    filterdic = eval(f.read())
for outerkey in filterdic:
    tempdic = {}
    for key in filterdic[outerkey]:
        if key in terms:
            tempdic[key] = filterdic[outerkey][key]
    newdic[outerkey] = tempdic
        
with open('filtermeasuremimedata.json', 'wb') as f:
    json.dump(newdic, f, indent=2)