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
#with open('urllist.txt', 'wb') as f:
    for outkey in data:
#        f.write(outkey + '\n')
        with open(outkey + 'csvlist.txt', 'wb') as f:
            for key in data[outkey]:
                f.write(key + '\n')
#for outkey in data:
#    os.makedirs('urlcsv/' + outkey)
#    for key in data[outkey]:
#        with open('urlcsv/' + outkey + '/' + key + '.csv', 'wb') as csvfile:
#            csvwriter = csv.writer(csvfile)
#            csvwriter.writerow(['date', 'value'])
#            count = 1
#            for value in data[outkey][key]:
#                csvwriter.writerow([count, value])
#                count+=1