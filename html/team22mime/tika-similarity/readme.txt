1) Clustering
run k-means.py to do clustering using different distance measures
Arguments
--inputDir	path to directory containing files to cluster
--measure	specified distance measure
		0 - Euclidean, 1 - Cosine, 2 - Edit (default: 0)
Output
cluster.json	clustering result

2) Circle Packing using clustering result (cluster.json file required)
run circle-packing-json.py
Output
circle.json	circle packing result
