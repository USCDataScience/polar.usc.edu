# -*- coding: utf-8 -*-

import json

file_list = []

with open("measurements.json") as f:
	json_file = json.load(f)

	for file_arr in json_file:
		dict_list = [file_arr]
		file_list.append(dict_list)
		


with open('new_measurements.json', 'w') as fp:
    json.dump(file_list, fp)


				 

