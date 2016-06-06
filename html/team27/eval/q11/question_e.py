import httplib
import os

url_str = "www.usc.edu"
search_value = "http://localhost:8983/solr/test_core/select?q=uploadDate%3A*&sort=uploadDate+asc&rows=10000&wt=json&indent=true";
conn = httplib.HTTPConnection(search_value)
conn.request('GET', '/')
r1 = conn.getresponse()

print r1.status, r1.reason

data1 = r1.read()
# print data1


# os.system('python value-similarity.py -f data/')