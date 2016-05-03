# -*- coding: utf-8 -*-
"""
Created on Sun May  1 10:57:19 2016

@author: yashtanna93
"""

import json

data = []
finaldata = {}
with open('datasize.json', 'rb') as f:
    data = eval(f.read())
count = 0
for row in data:
    count+=1
    print count,
    try:
        mime = row['cbormime'].split(';')[0]
        if mime in finaldata:
            mimedata = finaldata[mime]
            mimedata[0].append(str(row['tikaMetaData']['X-Parsed-By']))
            mimedata[1].append(row['contentFileSize'])
            mimedata[2].append(row['metaDataSize'])
            finaldata[mime] = mimedata
        else:
            mimedata = []
            tempparser = []
            tempparser.append(str(row['tikaMetaData']['X-Parsed-By']))
            mimedata.append(tempparser)
            temptext = []
            temptext.append(row['contentFileSize'])
            mimedata.append(temptext)
            temp1 = []
            temp1.append(row['metaDataSize'])
            mimedata.append(temp1)
            finaldata[mime] = mimedata
    except:
        continue
with open('parserdata.json', 'wb') as f:
    json.dump(finaldata, f, indent=2)