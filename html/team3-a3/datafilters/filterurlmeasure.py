# -*- coding: utf-8 -*-
"""
Created on Sun May  1 21:59:06 2016

@author: yashtanna93
"""

import json

terms = []
filterdic = {}
finaldic = {}
newdic = {}
with open('keys.txt', 'rb') as f:
    for line in f:
        line = line.rstrip('\r\n').lower()
        terms.append(line)
with open('measureurldata.json', 'rb') as f:
    filterdic = eval(f.read())
for outerkey in filterdic:
    tempdic = {}
    for key in filterdic[outerkey]:
        if key in terms:
            tempdic[key] = filterdic[outerkey][key]
    newdic[outerkey] = tempdic

for key in newdic:
    if newdic[key]:
        finaldic[key] = newdic[key]
with open('filtermeasureurldata.json', 'wb') as f:
    json.dump(finaldic, f, indent=2)