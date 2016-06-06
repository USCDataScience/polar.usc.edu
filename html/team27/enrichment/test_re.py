import re

url_list = ["http://nsidc.org", "http://nsidc.org/123", "http://nsidc.org/abc",
"http://nsidc.org/abc/de"]

for item in url_list:
	matchObj = re.search( r'http://nsidc.org/((?!/).)*$', item, re.M|re.I)
	if matchObj:
		print matchObj.group()
	
