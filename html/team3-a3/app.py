from flask import Flask, jsonify, send_from_directory, redirect, request
import requests
import os

url = 'http://54.183.25.174:9200/polar.usc.edu/_search?q=*:*&size=10000&fields='
#res = requests.get()
#result = res.json()['hits']['hits']
#print len(result)
data = []
with open('datasize.json', 'rb') as f:
    data = eval(f.read())

app = Flask(__name__)


app = Flask(__name__, static_url_path='')


@app.route('/app/<path:path>', methods=['GET'])
def static_proxy(path):
    return send_from_directory('app', path)


@app.route('/app/', methods=['GET'])
def static_index():
    return send_from_directory('app', 'index.html')


@app.route('/api/sweets')
def send_keywords():
    return jsonify({"data": get_keywords()})

    
@app.route('/api/sizeratio')
def send_sizeratio():
    return jsonify({"data": get_sizeratio()})

@app.route('/api/request')
def send_request():
    input = request.args.get('input')
    requesturls = []
    for row in data:
        try:
            if input in row['taxonomy']['label']:
                requesturls.append(row['requestURL'])
        except:
            continue
    print requesturls
    return jsonify({"data": requesturls})
        

def get_sizeratio():
    ratio = []
    res = requests.get(url+'id')
    result = res.json()['hits']['hits']
    for row in result:
        try:
            resin = requests.get('http://54.183.25.174:9200/polar.usc.edu/metadata/'
                    + row['_id'])
            resultin = resin.json()['_source']
            with open('temp.txt', 'wb') as f:
                f.write(str(resultin))
            indexsize = os.path.getsize('temp.txt')
            bodysize = resultin['bodyFileSize']
            tempratio = float(indexsize/(bodysize*1.0))
            ratio.append(tempratio)
            print tempratio
        except:
            continue
    return ratio
    
    
@app.route('/api/mimetypes')
def send_mimetypes():
    return jsonify({"data": get_mimetypes()})
    
    
def get_mimetypes():
    dict_count_mime = {}
    dict_count_mime_tika = {}
    res = requests.get(url+'tikaMetaData.Content-Type,cbormime')
    result = res.json()['hits']['hits']
    for row in result:
        if 'fields' in row:
            for mime in row['fields']['tikaMetaData.Content-Type']:
                temp = mime.split(';')[0]
                if temp in dict_count_mime_tika:
                    count = dict_count_mime_tika[temp]
                    dict_count_mime_tika[temp] = count+1
                else:
                    dict_count_mime_tika[temp] = 1
            for mime in row['fields']['cbormime']:
                temp = mime.split(';')[0]
                if temp in dict_count_mime:
                    count = dict_count_mime[temp]
                    dict_count_mime[temp] = count+1
                else:
                    dict_count_mime[temp] = 1
    final = []
    final.append(dict_count_mime)
    final.append(dict_count_mime_tika)
    return final

def get_keywords():
    dict_count_owl = {}
    res = requests.get(url+'owlconcepts')
    result = res.json()['hits']['hits']
    for row in result:
        if 'fields' in row:
            for concept in row['fields']['owlconcepts']:
                if concept in dict_count_owl:
                    count = dict_count_owl[concept]
                    dict_count_owl[concept] = count+1
                else:
                    dict_count_owl[concept] = 1
    frequency_list_for_d3 = []
    for key in dict_count_owl:
        temp = {}
        temp['text'] = key
        temp['size'] = dict_count_owl[key]
        frequency_list_for_d3.append(temp)
    return frequency_list_for_d3


if __name__ == '__main__':
    app.run(debug=True)
