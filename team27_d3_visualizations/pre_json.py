import os
import json
from pprint import pprint


# for i in os.listdir(os.getcwd()):
# 	if i.endswith(".json"):
# 		with open(i) as data_file:
# 			data = json.load(data_file)
# 		print data[0]['mimeType']


with open("diversity.json") as data_file:
	data = json.load(data_file)
	stat_total = [{'label' : 'other type', 'value' : 0}]

	for mime in data:
		# print mime
		# print data[mime]
		if int(mime['value']) < 5000:
			# print 'haha'
			stat_total[0]['value'] += int(mime['value'])
			# print stat_total[0]
		else:
			mime_dict = {}
			mime_dict['label'] = str(mime['label'])
			mime_dict['value'] = int(mime['value'])
			stat_total.append(mime_dict)
print len(stat_total)
with open('stat_json1.json', 'w') as f:
	json.dump(stat_total, f)


