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
import re
import json
import os, editdistance, itertools, argparse, csv
from requests import ConnectionError
from time import sleep

def stringify(attribute_value):
    if isinstance(attribute_value, list):
        return str((", ".join(attribute_value)).encode('utf-8').strip())
    else:
        return str(attribute_value.encode('utf-8').strip())


def computeScores(inputDir, outCSV, acceptTypes, allKeys):

    with open(outCSV, "wb") as outF:
        write = csv.writer(outF, delimiter=',')
        write.writerow(["x-coordinate","y-coordinate","Similarity_score"])

        filename_list = []

        for root, dirnames, files in os.walk(inputDir):
            dirnames[:] = [d for d in dirnames if not d.startswith('.')]
            for filename in files:
                if not filename.startswith('.'):
                    filename_list.append(os.path.join(root, filename))

        files_tuple = itertools.combinations(filename_list, 2)
        for file1, file2 in files_tuple:
            try:           
                row_edit_distance = [file1, file2]            

                pyresponse = ""
                
                with open(file1) as tweetfile:
                    pyresponse = json.loads(tweetfile.read())

                file1_parsedData = pyresponse
                
                with open(file2) as tweetfile:
                    pyresponse = json.loads(tweetfile.read())                
                
                file2_parsedData = pyresponse
                
                file1_feature_value = stringify(file1_parsedData["Geographic_NAME"])
                file2_feature_value = stringify(file2_parsedData["Geographic_NAME"])
                
                print file1_feature_value
                print file2_feature_value
                
                file_edit_distance = 0.0
                 
                if len(file1_feature_value) == 0 and len(file2_feature_value) == 0:
                    feature_distance = 0.0
                else:
                    feature_distance = float(editdistance.eval(file1_feature_value, file2_feature_value))/(len(file1_feature_value) if len(file1_feature_value) > len(file2_feature_value) else len(file2_feature_value))
                    
                file_edit_distance += feature_distance
                

                row_edit_distance.append(1-file_edit_distance)
                write.writerow(row_edit_distance)

            except ConnectionError:
                sleep(1)
            except KeyError:
                continue


if __name__ == "__main__":
    
    argParser = argparse.ArgumentParser('Edit Distance Similarity based on Metadata values')
    argParser.add_argument('--inputDir', required=True, help='path to directory containing files')
    argParser.add_argument('--outCSV', required=True, help='path to directory for storing the output CSV File, containing pair-wise Similarity Scores based on edit distance')
    argParser.add_argument('--accept', nargs='+', type=str, help='Optional: compute similarity only on specified IANA MIME Type(s)')
    argParser.add_argument('--allKeys', action='store_true', help='compute edit distance across all keys')
    args = argParser.parse_args()   

    if args.inputDir and args.outCSV:
        computeScores(args.inputDir, args.outCSV, args.accept, args.allKeys)