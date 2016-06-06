import pprint
import json
import re

url_list = []
with open('test_url.js', 'r') as f:
	content = f.readlines()
	# pprint.pprint(content[:1])
	for line in content:
		if "\"url\" : \"http://nsidc.org" in line:
			# pprint.pprint(line)
			url_list.append(line)

# print len(url_list)
	
url_dict = {"http://nsidc.org": []}

# for url_item in url_list:

# urls = re.findall(r"http://nsidc.org/.*?/",re.I)
# print str(urls)


for item in url_list:
	matchObj = re.search( r'http://nsidc.org/monthlyhighlights/((?!/).)*$', item, re.M|re.I)
	if matchObj:
		# print matchObj.group()
		url_dict["http://nsidc.org"].append(matchObj.group())


		
print url_dict

# for item in url_dict["http://nsidc.org"]:
# 	match_str = item + '((?!/).)*$'
# 	for url_list_item in url_list:
# 		matchObj = re.search( match_str, url_list_item, re.M|re.I)
# 		if matchObj:
# 			print matchObj.group()

		# url_dict["http://nsidc.org"].append(matchObj.group())
# print url_dict

	
