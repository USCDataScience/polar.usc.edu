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
        mime = row['tikaMetaData']['Content-Type'].split(';')[0]
        if mime in measurementdic:
            mimedic = measurementdic[mime]
            measurement = row['measurements']
            for measure in measurement:
                temp = measure.split(' ')
                if temp[1] in mimedic:
                    mimedic[temp[1]].append(temp[0])
                else:
                    mimedic[temp[1]] = [temp[0]]
            measurementdic[mime] = mimedic
        else:
            mimedic = {}
            measurement = row['measurements']
            for measure in measurement:
                temp = measure.split(' ')
                if temp[1] in mimedic:
                    mimedic[temp[1]].append(temp[0])
                else:
                    mimedic[temp[1]] = [temp[0]]
            measurementdic[mime] = mimedic
    except:
        continue
with open('measuremimedata.json', 'wb') as f:
    json.dump(measurementdic, f, indent=2)