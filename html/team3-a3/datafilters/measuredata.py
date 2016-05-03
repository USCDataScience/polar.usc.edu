# -*- coding: utf-8 -*-
"""
Created on Sun May  1 21:36:36 2016

@author: yashtanna93
"""

import json

data = []
measurementdic = {}
with open('datasize.json', 'rb') as f:
    data = eval(f.read())
count = 0
for row in data:
    count+=1
    print count,
    try:
        measurement = row['measurements']
        for measure in measurement:
            temp = measure.split(' ')
            if temp[1] in measurementdic:
                measurementdic[temp[1]].append(temp[0])
            else:
                measurementdic[temp[1]] = [temp[0]]
    except:
        continue
with open('measuremimedata.json', 'wb') as f:
    json.dump(measurementdic, f, indent=2)