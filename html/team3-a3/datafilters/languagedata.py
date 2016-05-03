# -*- coding: utf-8 -*-
"""
Created on Sun May  1 13:27:44 2016

@author: yashtanna93
"""

import json
#import csv

final = {}
#langdic = {}
#with open('languagecodes.csv', 'rb') as f:
#    csvreader = csv.reader(f)
#    for row in csvreader:
#        langdic[row[1]] = row[0]
##print langdic

with open('datasize.json', 'rb') as f:
    data = eval(f.read())
count = 0
for row in data:
    count+=1
    print count,
    try: 
        if row['alchemyLanguage'] in final:
            final[row['alchemyLanguage']] += 1
        else:
            final[row['alchemyLanguage']] = 1
    except:
        continue
with open('langalchemydata.json', 'wb') as f:
    json.dump(final, f, indent=2)

#with open('langdata.json', 'rb') as f:
#    data = eval(f.read())
#    final = {}
#    final['name'] = 'flare'
#    children = []
#    for key in data:
#        temp = {}
#        temp['name'] = key
#        temp['size'] = data[key]
#        children.append(temp)
#    final['children'] = children
#    with open('langd3tikadata.json', 'wb') as f1:
#        json.dump(final, f1, indent=2)