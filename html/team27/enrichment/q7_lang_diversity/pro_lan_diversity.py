#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json


# [{"value": 136632, "label": "other type"}]

lan_div_list = [{'value': 0, 'label': 'others'}]
with open('1.out', 'r') as f:
	for line in f.readlines():
		line_item = line.split()
		if int(line_item[1]) < 8000:
			lan_div_list[0]['value'] += int(line_item[1])
		else:
			value_dict = {'value': int(line_item[1]), 'label': line_item[0][:-1]}
			lan_div_list.append(value_dict)


with open('stat_json.json', 'w') as j:
	json.dump(lan_div_list, j)

