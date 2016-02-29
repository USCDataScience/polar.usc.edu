<?php
/**
 * 
 * Solr proxy - PHP
 * This script helps keep Solr anonymous on the client side -
 *    mainly for security
 * 
 * @var String $_REQUEST["query"] Solr query
 * 
 * @author shakeh.khudikyan
 */


// Load PHP REST client
include('httpful.phar');
$SOLR_URL='http://localhost:8983/solr/';
$SOLR_CORE='isatools-test';

// Get and build Solr query
$uri = $SOLR_URL . $SOLR_CORE . '/select?' . stripslashes($_REQUEST["query"]);

// Print query result in JSON format
$response = \Httpful\Request::get($uri)->send();
echo($response); 