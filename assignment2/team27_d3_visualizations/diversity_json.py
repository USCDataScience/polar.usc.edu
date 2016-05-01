import json

json_list = []
with open("yearStat.out", 'r') as f:
	for line in f:
		json_dict = {}
		str_line = str(line)[:-1].split(":")
		name, value = str_line[0], str_line[1]
		try:
			json_dict["value"] = int(value)
		except ValueError:
			json_dict["value"] = 0

		json_dict["label"] = name
		json_list.append(json_dict)
# print json_dict
with open('year_paper.json', 'w') as fp:
    json.dump(json_list, fp)



