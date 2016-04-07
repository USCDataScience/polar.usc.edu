<?php header('Access-Control-Allow-Origin: *'); ?>
/**
 * Created by PhpStorm.
 * User: charanshampur
 * Date: 11/19/15
 * Time: 8:45 PM
 */
<?php
    $jsonString=$_POST["solrResp"];
    $json_a=json_decode($jsonString,true);

    //$string = file_get_contents("/Users/charanshampur/LDA/json/assign3D3.json");
    //$json_a = json_decode($string, true);

    $response = $json_a["response"]["docs"];
    //echo ("<h3>".$response."</h3>");
    //echo count($response);
    $mapStatus=get_map_data($response);
    $circlePackStatus=get_circle_pack_data($response);
    $collapseTreeStatus=get_collapsible_tree_data($response);
    $barGraphStatus=get_partition_tree_data($response);
    $wordCloudStatus=get_word_count_data($response);
    $lineGraphStatus=get_line_graph_data($response);
    if($mapStatus=="success"){
        echo "success";
    }
    else {
        echo "failure";
    }
?>

<?php
function get_map_data($response)
{
    //$mapfile = fopen("/Users/charanshampur/solr/lucene_solr_4_10/solr/example/solr-webapp/webapp/MyHtml/cities2.csv","w")or die("unable to open file");
    $mapfile = fopen("cities2.csv","w")or die("unable to open file");
    $txt="code,city,country,lat,lon\n";
    fwrite($mapfile, $txt);
    if(count($response)>0) {
        for ($i = 0; $i < count($response); $i++) {
            if(array_key_exists("Geographic_NAME",$response[$i]))
            {
                $txt="XXX,".$response[$i]["Geographic_NAME"].",UnitedStates,".$response[$i]["Geographic_LATITUDE"].",".$response[$i]["Geographic_LONGITUDE"]."\n";
                fwrite($mapfile, $txt);
            }
            if(array_key_exists("Optional_NAME1",$response[$i]))
            {
                $txt="XXX,".$response[$i]["Optional_NAME1"].",UnitedStates,".$response[$i]["Optional_LATITUDE1"].",".$response[$i]["Optional_LONGITUDE1"]."\n";
                fwrite($mapfile, $txt);
            }
            if(array_key_exists("Optional_NAME2",$response[$i]))
            {
                $txt="XXX,".$response[$i]["Optional_NAME2"].",UnitedStates,".$response[$i]["Optional_LATITUDE2"].",".$response[$i]["Optional_LONGITUDE2"]."\n";
                fwrite($mapfile, $txt);
            }
            if(array_key_exists("Optional_NAME3",$response[$i]))
            {
                $txt="XXX,".$response[$i]["Optional_NAME3"].",UnitedStates,".$response[$i]["Optional_LATITUDE3"].",".$response[$i]["Optional_LONGITUDE3"]."\n";
                fwrite($mapfile, $txt);
            }
        }
    }
    fclose($mapfile);
    return "success";

}

function get_circle_pack_data($response)
{
    #$circlefile = fopen("/Users/charanshampur/Sites/MyHtml/circle.json","w")or die("unable to open file");
    $circlefile = fopen("circle.json","w")or die("unable to open file");
    fwrite($circlefile, json_encode($response));
    ob_start();
    passthru('/Library/Frameworks/Python.framework/Versions/2.7/bin/python2.7 /Users/charanshampur/Sites/MyHtml/phpPyth.py');
    $output = ob_get_clean();
    return $output;
}

function get_collapsible_tree_data($response)
{ 
    ob_start();
    passthru('/Library/Frameworks/Python.framework/Versions/2.7/bin/python2.7 /Users/charanshampur/Sites/MyHtml/collapTree.py');
    $output = ob_get_clean();
    return $output;
}

function get_partition_tree_data($response)
{
    ob_start();
    passthru('/Library/Frameworks/Python.framework/Versions/2.7/bin/python2.7 /Users/charanshampur/Sites/MyHtml/AuthorMap.py');
    $output = ob_get_clean();
    return $output;
}

function get_word_count_data($response)
{
    ob_start();
    passthru('/Library/Frameworks/Python.framework/Versions/2.7/bin/python2.7 /Users/charanshampur/Sites/MyHtml/wordCloud.py');
    $output = ob_get_clean();
    return $output;
}

function get_line_graph_data($response)
{
    ob_start();
    passthru('/Library/Frameworks/Python.framework/Versions/2.7/bin/python2.7 /Users/charanshampur/Sites/MyHtml/getCounts.py');
    $output = ob_get_clean();
    //echo("<h1>".$output."</h1>");
    return $output;
}

?>