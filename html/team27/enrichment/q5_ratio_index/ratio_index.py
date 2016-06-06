#-*-coding:utf-8-*-
import json

json_list = []

with open('RatioIndex2File.out', 'r') as f:
	json_read = json.load(f)
	# print json_read
	for item in json_read:
		add_dict = {'value': json_read[item], 'label': item}
		json_list.append(add_dict)

with open('ratio_index_json.json', 'w') as fj:
	json.dump(json_list, fj)


