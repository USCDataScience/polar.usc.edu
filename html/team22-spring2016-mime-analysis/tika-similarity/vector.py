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

import math, editdistance

def stringify(attribute_value):
    if isinstance(attribute_value, list):
        return str((", ".join(attribute_value)).encode('utf-8').strip())
    else:
        return str(attribute_value.encode('utf-8').strip())


class Vector:
    '''
    An instance of this class represents a vector in n-dimensional space
    '''
    na_metadata = ["resourceName"]
    
    def __init__(self, filename=None, features=None):
        '''
        Create a vector
        @param metadata features 
        '''
        self.features = {}
        self.featuresText = {}
        
        if filename and features:
            self.filename = filename
            
            for na in self.na_metadata:
                features.pop(na, None)
            
            for key in features:
                self.features[key] = len(stringify(features[key]))
                self.featuresText[key] = stringify(features[key])

    '''
    def __str__(self):        
        vector_str = "( {0} ): \n".format(self.)
        if self.features:
            for key in self.features:
                vector_str += " {1}: {2} \n".format(key, self.features[key])
        return vector_str+"\n"
    '''

    def getMagnitude(self):
        totalMagnitude = 0.0
        for key in self.features:
            totalMagnitude += self.features[key] ** 2
        return math.sqrt(totalMagnitude)


    def dotProduct(self, anotherVector):
        '''
        A = ax+by+cz
        B = mx+ny+oz
        A.B = a*m + b*n + c*o
        '''        
        dot_product = 0.0
        intersect_features = set(self.features) & set(anotherVector.features)
        
        for feature in intersect_features:
            dot_product += self.features[feature] * anotherVector.features[feature]
        return dot_product


    def cosTheta(self, v2):
        '''
        cosTheta = (V1.V2) / (|V1| |V2|)
        cos 0 = 1 implies identical documents
        '''
        return self.dotProduct(v2) / (self.getMagnitude() * v2.getMagnitude())


    def euclidean_dist(self, anotherVector):
        '''
        dist = ((x1-x2)^2 + (y1-y2)^2 + (z1-z2)^2)^(0.5)
        '''
        intersect_features = set(self.features) & set(anotherVector.features)

        dist_sum = 0.0
        for feature in intersect_features:
            dist_sum += (self.features[feature] - anotherVector.features[feature]) ** 2

        setA = set(self.features) - intersect_features
        for feature in setA:
            dist_sum += self.features[feature] ** 2

        setB = set(anotherVector.features) - intersect_features
        for feature in setB:
            dist_sum += anotherVector.features[feature] ** 2

        return math.sqrt(dist_sum)
    
    def edit_dist(self, anotherVector):
        intersect_features = set(self.features.keys()) & set(anotherVector.features.keys())                
        intersect_features = [feature for feature in intersect_features if feature not in self.na_metadata ]
        
        file_edit_distance = 0.0
        count = 0
        for feature in intersect_features:
            file1_feature_value = self.featuresText[feature]
            file2_feature_value = anotherVector.featuresText[feature]
            
            divider = (len(file1_feature_value) if len(file1_feature_value) > len(file2_feature_value) else len(file2_feature_value))
            
            if divider == 0:
                continue
            
            feature_distance = float(editdistance.eval(file1_feature_value, file2_feature_value))/ divider
            file_edit_distance += feature_distance
            count += 1
        
        if count == 0:
            return file_edit_distance
        
        file_edit_distance /= count
        return file_edit_distance
