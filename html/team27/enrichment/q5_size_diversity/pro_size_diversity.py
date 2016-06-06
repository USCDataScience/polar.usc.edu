#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json


# [{"value": 136632, "label": "other type"}]

sizeDiversity = [{'value': 0, 'label': 'others'}]
with open('fileSizeDiversity.out', 'r') as f:
	sizeJson = json.load(f)
	for item in sizeJson:
		# print item
		if int(sizeJson[item]) < 20000:
			sizeDiversity[0]['value'] += sizeJson[item]
		else:
			sizeDict = {'value': int(sizeJson[item]), 'label': item}
			# print sizeDict
			sizeDiversity.append(sizeDict)

with open('stat_json.json', 'w') as j:
	json.dump(sizeDiversity, j)

