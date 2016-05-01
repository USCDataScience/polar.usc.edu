# -*- coding: utf-8 -*-

import json

file_hash = {}

with open("new_measurements.json") as f:
	json_file = json.load(f)

	for file_arr in json_file:

		if not file_arr:
			pass
		else:
			for file_dict in file_arr[0]:
				# print file_dict
				for item in file_arr[0][file_dict]:
					if item['unit'].encode('utf-8') in file_hash:
						file_hash[item['unit'].encode('utf-8')] += 1
					else:
						file_hash[item['unit'].encode('utf-8')] = 1
						print item['unit'].encode('utf-8')

# print file_hash
json_array = []
for item in file_hash:
	if file_hash[item] > 300:
		my_dict = {}
		my_dict['label'] = item
		my_dict['value'] = file_hash[item]
		json_array.append(my_dict)

# print json_array

with open('process_data.json', 'w') as fp:
    json.dump(json_array, fp)


				 

