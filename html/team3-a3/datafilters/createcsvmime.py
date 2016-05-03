# -*- coding: utf-8 -*-
"""
Created on Mon May  2 00:10:09 2016

@author: yashtanna93
"""
import csv
import os

data = {}
with open('filtermeasureurldata.json') as f:
    data = eval(f.read())
#with open('mimelist.txt', 'wb') as f:
#    for outkey in data:
#        f.write(outkey + '\n')
#    dirname = outkey.replace('/', '-')
#    with open(dirname + 'csvlist.txt', 'wb') as f:
#        for key in data[outkey]:
#            f.write(key + '\n')
for outkey in data:
    dirname = outkey.replace('/', '-')
    os.makedirs('mimecsv/' + dirname)
    for key in data[outkey]:
        with open('mimecsv/' + dirname + '/' + key + '.csv', 'wb') as csvfile:
            csvwriter = csv.writer(csvfile)
            csvwriter.writerow(['date', 'value'])
            count = 1
            for value in data[outkey][key]:
                csvwriter.writerow([count, value])
                count+=1