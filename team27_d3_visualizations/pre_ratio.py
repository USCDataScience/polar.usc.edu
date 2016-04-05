import json

json_list = []

with open("ratio.json", 'r') as f:
	data = json.load(f)
	for item in data:
		json_dict = {}
		json_dict['label'] = item.keys()[0]
		json_dict['value'] = float(item[item.keys()[0]])
		json_list.append(json_dict)

with open("ratio_result.json", 'w') as fp:
	json.dump(json_list, fp)