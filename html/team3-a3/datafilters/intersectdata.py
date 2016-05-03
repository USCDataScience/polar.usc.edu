# -*- coding: utf-8 -*-
"""
Created on Sun May  1 15:12:05 2016

@author: yashtanna93
"""

import json

data = []
final = {}
with open('datasize.json', 'rb') as f:
    data = eval(f.read())
count=0
NERKEYS = ['PERSON', 'ORGANIZATION', 'LOCATION', 'MONEY', 'PERCENTAGE', 'TIME', 'DATE']

def getCommon(key, row):
    temp = {}
    tempopen = []
    tempcore = []
    tempnltk = []
    if key == 'PERCENTAGE':
        temp['CORENLP' + 'PERCENT'] = len(row['corenlp']['PERCENT'])
        tempcore = row['corenlp']['PERCENT']
    else:
        temp['CORENLP' + key] = len(row['corenlp'][key])
        tempcore = row['corenlp'][key]
    if 'NER_'+key in row['opennlp']:
        temp['OPENNLP' + key] = len(row['opennlp']['NER_'+key])
        tempopen = row['opennlp']['NER_'+key]
    if 'names' in row['nltk']:
        temp['NLTKNAMES'] = len(row['nltk']['names'])
        tempnltk = row['nltk']['names']
    if len(set(tempopen)&set(tempcore)&set(tempnltk))>0:
        temp['commonall' + key] = len(set(tempopen)&set(tempcore)&set(tempnltk))
    if len(set(tempopen)&set(tempcore))>0:
        temp['commonopencore' + key] = len(set(tempopen)&set(tempcore))
    if len(set(tempcore)&set(tempnltk))>0:
        temp['commoncorenltk' + key] = len(set(tempcore)&set(tempnltk))
    if len(set(tempopen)&set(tempnltk))>0:
        temp['commonopennltk' + key] = len(set(tempopen)&set(tempnltk))
    return temp

combine = {}
combine['corenlp'] = {}
combine['opennlp'] = {}
combine['nltk'] = {}
combine['nltk']['names']= []
for row in data:
    count+=1
    print count,
    try:
        opennlp = {}
        for elem in row['opennlp']:
            opennlp.update(elem)
#        print opennlp.keys()
#        print row['corenlp'].keys()
#        if 'DATE' in row['corenlp']:
#            print count,
        if 'names' in row['nltk']:
            combine['nltk']['names'].extend(row['nltk']['names'])
        for key in NERKEYS:
            if key == 'PERCENTAGE':
                key = 'PERCENT'
            if key in combine['corenlp']:
                if key in row['corenlp']:
                    combine['corenlp'][key].extend(row['corenlp'][key])
            elif key in row['corenlp']:
                combine['corenlp'][key] = row['corenlp'][key]
        for key in NERKEYS:
            if 'NER_'+key in combine['opennlp']:
                if 'NER_'+key in opennlp:
                    combine['opennlp']['NER_'+key].extend(opennlp['NER_'+key])
            elif 'NER_'+key in opennlp:
                combine['opennlp']['NER_'+key] = opennlp['NER_'+key]
    except:
        continue
for key in NERKEYS:
    if key == 'PERCENTAGE':
        combine['opennlp']['NER_'+key] = list(set(combine['opennlp']['NER_'+key]))
        key = 'PERCENT'
        combine['corenlp'][key] = list(set(combine['corenlp'][key]))
    else:
        combine['corenlp'][key] = list(set(combine['corenlp'][key]))
        combine['opennlp']['NER_'+key] = list(set(combine['opennlp']['NER_'+key]))
combine['nltk']['names'] = list(set(combine['nltk']['names']))
print combine['corenlp'].keys()
print combine['opennlp'].keys()
print combine['nltk'].keys()
stats = {}
for key in NERKEYS:
    stats[key] = getCommon(key, combine)
with open('commondataallcount.json', 'wb') as f:
    json.dump(stats, f, indent=2)