import scipy.cluster.hierarchy as hcl
from scipy.spatial.distance import squareform
import pandas as pd
import numpy as np
from matplotlib import pyplot as plt
from scipy.cluster.hierarchy import dendrogram
import scipy
import json


#data = pd.read_json(path_or_buf= 'C:\Users\davtalab\Desktop\outJSON.json')
parsed_json = json.loads(open('C:\Users\davtalab\Desktop\data.json').read())

print parsed_json[1]['id']

