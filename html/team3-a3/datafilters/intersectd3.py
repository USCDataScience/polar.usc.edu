# -*- coding: utf-8 -*-
"""
Created on Sun May  1 19:56:01 2016

@author: yashtanna93
"""
import json

data = {}
final = {}
with open('commondataallcount.json', 'rb') as f:
    data = eval(f.read())
final['name'] = 'COMBINENER'
final['children'] = []
for key in data:
    temp = {}
    temp['name'] = key
    temp['children'] = []
    for innerkey in data[key]:
        innertemp = {}
        innertemp['name'] = innerkey
        innertemp['children'] = [{'name':data[key][innerkey]}]
        temp['children'].append(innertemp)
    final['children'].append(temp)
with open('commond3data.json', 'wb') as f:
    json.dump(final, f, indent=2)