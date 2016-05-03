# -*- coding: utf-8 -*-
"""
Created on Sat Apr 30 20:30:32 2016

@author: yashtanna93
"""

import json

data = []
size = {}
with open('datasize.json', 'rb') as f:
    data = eval(f.read())
count = 0
for row in data:
    count+=1
    print count,
    try:
        mime = row['tikaMetaData']['Content-Type'].split(';')[0]
        if mime in size:
            sizedata = size[mime]
            sizedata[0].append(row['bodyFileSize'])
            sizedata[1].append(row['metaDataSize'])
            size[mime] = sizedata
        else:
            sizedata = []
            temp = []
            temp.append(row['bodyFileSize'])
            sizedata.append(temp)
            temp1 = []
            temp1.append(row['metaDataSize'])
            sizedata.append(temp1)
            size[mime] = sizedata
    except:
        continue

with open('sizeratiodata.json', 'wb') as f:
    json.dump(size, f, indent=2)