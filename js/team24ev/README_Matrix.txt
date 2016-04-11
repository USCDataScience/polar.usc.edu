Using the D3 visualization script code

------------------------
Functionality supported
------------------------

1. Input is the values.json in the data directory (which could be for FHT or BFC).
2. Output is a 2D matrix visualization which has the byte matrix for the 256 bytes on x and y axis from the FHT or BFC outputs
   and the cells contain the cross co-relation values corresponding to the ith and jth bytes.

------------------
   NOTES
------------------

The folder structure :

data : contains the json file (values.json) which acts as an input to the matrix.

scripts: contains the createMatrix.js which forms the visualization using the values.json.
	--	The createMatrix.js reads the json variable from values.json and assigns the node values and the links in the matrix 		using the source(s) and target(t) values in the json. The rgb for each cell value is assigned based on the cross co-		relation value. A lighter shade means a lower value and the shades get more dark for higher values. The values which are 	 close to zero or have very low values are white. In case of BFC, the diagonal values represent the number of files on 		which the values were computed. A tooltip appears on top of each cell value when mouse is hovered over and on mouse out  	 the tooltip is disabled.

style: contains the css style file which is being used for displaying the matrix and its parent container.

index.html : open this file in appropriate browser to view the visualization. The matrix along with a drop down list of the 
			 mime types is shown. On clicking a particular mimetype, the corresponding matrix is loaded in the browser.

If you want to use the parsed output of transform file for 2D Matrix visualization:
	-> copy the contents of the <source_file>_parsed.json
	-> overwrite the contents of the values.json file in the data folder 
	-> Open the index.html in appropriate browser like IE, firefox or Chrome.

