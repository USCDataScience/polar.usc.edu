import scipy.cluster.hierarchy as hcl
from scipy.spatial.distance import squareform
import pandas as pd
import numpy as np
from matplotlib import pyplot as plt
from scipy.cluster.hierarchy import dendrogram
import scipy
import json

def fancy_dendrogram(*args, **kwargs):
    max_d = kwargs.pop('max_d', None)
    if max_d and 'color_threshold' not in kwargs:
        kwargs['color_threshold'] = max_d
    annotate_above = kwargs.pop('annotate_above', 0)

    ddata = dendrogram(*args, **kwargs)

    if not kwargs.get('no_plot', False):
        plt.title('Hierarchical Clustering Dendrogram (truncated)')
        plt.xlabel('sample index or (cluster size)')
        plt.ylabel('distance')
        for i, d, c in zip(ddata['icoord'], ddata['dcoord'], ddata['color_list']):
            x = 0.5 * sum(i[1:3])
            y = d[1]
            if y > annotate_above:
                plt.plot(x, y, 'o', c=c)
                plt.annotate("%.3g" % y, (x, y), xytext=(0, -5),
                             textcoords='offset points',
                             va='top', ha='center')
        if max_d:
            plt.axhline(y=max_d, c='k')
    return ddata
# data2 = pd.DataFrame.from_csv('C:\Users\davtalab\Downloads\outCSV.csv')

#print (data2)
data = pd.read_json(path_or_buf= 'C:\Users\davtalab\PycharmProjects\similarity_clustering\LOCATION_SIMILARITY.json')
#data = pd.read_json(path_or_buf= 'C:\Users\davtalab\Desktop\outPut_sweet.json')
#data = pd.read_json(path_or_buf= 'C:\Users\davtalab\Desktop\outJSON.json')
print data.shape
# data = pd.DataFrame({
#     "a": ["A", "A", "A", "A", "B", "B", "B", "C", "C", "D","A", "B", "C", "D", "E"],
#     "b": ["B", "C", "D", "E", "C", "D", "E", "D", "E", "E","A", "B", "C", "D", "E"],
#     "distance": [0.5,1,1,1,1,1,1,0.75, 0.6666667, 0.5,0,0,0,0,0]
# })

# data = pd.DataFrame({
#     "a": ["A", "A", "A", "A", "B", "B", "B", "C", "C", "D","A", "B", "C", "D", "E"],
#     "b": ["B", "C", "D", "E", "C", "D", "E", "D", "E", "E","A", "B", "C", "D", "E"],
#     "distance": [0.5,0,0,0,0,0,0,0.25, 0.3333333, 0.5,1,1,1,1,1]
# })

# print data
# print
# print 'created matrix:'
# data_piv = data.pivot("", "b", "distance").fillna(0)
# piv_arr = data_piv.as_matrix()
# dist_mat = piv_arr + np.transpose(piv_arr)
# print (hcl.linkage(squareform(dist_mat)))


# data_piv = data.pivot("a", "b", "distance").fillna(0)
# piv_arr = data_piv.as_matrix()
# dist_mat = piv_arr + np.transpose(piv_arr)
# print(dist_mat)
#print data
clusters = hcl.linkage(data, 'ward')
#clusters = hcl.single(data)
#print clusters
#print clusters[5]
# Create dictionary for labeling nodes by their IDs
labels = range(0,clusters.shape[0] + 1)
#print labels
id2name = dict(zip(range(len(labels)), labels))


# calculate full dendrogram
plt.figure(figsize=(25, 10))
plt.title('Hierarchical Clustering Dendrogram')
plt.xlabel('sample index')
plt.ylabel('distance')
dendrogram(
    clusters,
    leaf_rotation=0.,  # rotates the x axis labels
    leaf_font_size=8.,  # font size for the x axis labels
)
#plt.show()

max_d = 50
fancy_dendrogram(
    clusters,
    truncate_mode='lastp',
    p=12,
    leaf_rotation=90.,
    leaf_font_size=12.,
    show_contracted=True,
    annotate_above=10,
    max_d=max_d,  # plot a horizontal cut-off line
)
#plt.show()
# Create a nested dictionary from the ClusterNode's returned by SciPy
def add_node(node, parent ):
    # First create the new node and append it to its parent's children
    newNode = dict( node_id=node.id, children=[] )
    parent["children"].append( newNode )

    # Recursively add the current node's children
    if node.left: add_node( node.left, newNode )
    if node.right: add_node( node.right, newNode )

T = scipy.cluster.hierarchy.to_tree( clusters , rd=False )
d3Dendro = dict(children=[], name="Root1")
add_node( T, d3Dendro )
d=0
# Label each node with the names of each leaf in its subtree
def label_tree( n ):

    # If the node is a leaf, then we have its name
    if len(n["children"]) == 0:
        leafNames = [ id2name[n["node_id"]] ]

    # If not, flatten all the leaves in the node's subtree
    else:
        leafNames=[]
        for c in n["children"]:
            leafNames += label_tree(c)

    # Delete the node id since we don't need it anymore and
    # it makes for cleaner JSON
    del n["node_id"]

    # Labeling convention: "-"-separated leaf names
    n["name"] = name = "-".join(sorted(map(str, leafNames)))

    return leafNames

label_tree( d3Dendro["children"][0] )
# Output to JSON
json.dump(d3Dendro, open("LOCATION_OUT.json", "w"), sort_keys=True, indent=4)

