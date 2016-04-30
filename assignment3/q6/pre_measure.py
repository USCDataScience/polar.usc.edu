import json

name_list, min_list, aver_list, max_list  = [], [], [], []


with open('text_html.out', 'r') as f:
	# print f
	dict_json = json.load(f)
	# print dict_json
	for item_name in dict_json:
		name_list.append(item_name.encode('ascii', 'ignore'))
		for item in dict_json[item_name]:
			if item == "min":
				min_list.append(int(dict_json[item_name][item]))
			elif item == "aver":
				aver_list.append(int(dict_json[item_name][item]))
			elif item == "max":
				max_list.append(int(dict_json[item_name][item]))

# print name_list[:10] 

# print min_list[:10] 
# print aver_list[:10] 
# print max_list[:10] 

new_name, new_min, new_aver, new_max = [], [], [], []
for i in range(len(name_list)):
	if 3000 < max_list[i] < 10000:
		new_name.append(name_list[i])
		new_min.append(min_list[i])
		new_aver.append(aver_list[i])
		new_max.append(max_list[i])


print new_name[:10]
print new_min[:10]
print new_aver[:10]
print new_max[:10]



# json1_file = open('GeneralMeasurementsInfo.json')
# json1_str = json1_file.read()
# json1_data = json.loads(json1_str)