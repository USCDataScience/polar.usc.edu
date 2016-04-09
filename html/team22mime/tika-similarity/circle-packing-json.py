#!/usr/bin/env python2.7
#
# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
# 
#    http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# 
#

import json
import sys
import ast
from collections import Counter

def main(argv = None):
    with open('clusters.json') as data_file:
        data = json.load(data_file)
        numOfCluster = len(data["children"])
        
        for i in range(numOfCluster):
            cluster =  data["children"][i]
            pack = packCluster(cluster["children"])
            data["children"][i]["children"] = pack
        
    with open("circle.json", "w") as f:
        f.write(json.dumps(data, sort_keys=True, indent=4, separators=(',', ': ')))
        
def packCluster(fileList):
    counter = Counter()
    for file in fileList:
        metadataStr = file['metadata']
        metadataKeys = extractMetadataList(metadataStr)
        for key in metadataKeys:
            counter[key] += 1
    
    pack = []
    for tuple in counter.most_common():
        d = {}
        d['name'] = tuple[0]
        d['size'] = tuple[1]
        pack.append(d)
    return pack

def extractMetadataList(metadataStr):
    metadata = json.loads(metadataStr)
    return metadata.keys()


if __name__ == "__main__":
    sys.exit(main())