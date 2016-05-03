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
with open('measuredata.json', 'rb') as f:
    filterdic = eval(f.read())
for key in filterdic:
    if key in terms:
        newdic[key] = filterdic[key]
        
with open('filtermeasuredata.json', 'wb') as f:
    json.dump(newdic, f, indent=2)