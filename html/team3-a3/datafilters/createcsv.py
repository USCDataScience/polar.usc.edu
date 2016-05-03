# -*- coding: utf-8 -*-
"""
Created on Mon May  2 00:10:09 2016

@author: yashtanna93
"""
import csv
import os

data = {}
with open('filtermeasuremimedata.json') as f:
    data = eval(f.read())
#with open('csvlist.txt', 'wb') as f:
#    for key in data:
#        f.write(key + '\n')    
for key in data:
    with open('csv/' + key + '.csv', 'wb') as csvfile:
        csvwriter = csv.writer(csvfile)
        csvwriter.writerow(['date', 'value'])
        count = 1
        for value in data[key]:
            csvwriter.writerow([count, value])
            count+=1