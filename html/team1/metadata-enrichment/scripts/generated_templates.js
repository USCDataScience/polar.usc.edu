angular.module('metadataVisualizationApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/scripts/components/document/template.html',
    "<div class=\"document\">\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <h3 class=\"text-center\">\n" +
    "        <span data-ng-bind=\"document.displayType() | uppercase\"></span>\n" +
    "        <span data-ng-if=\"document.isJournal()\">[Journal]</span>\n" +
    "      </h3>\n" +
    "      <br />\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "\n" +
    "      <table class=\"table table-striped\" data-ng-if=\"document.journal\">\n" +
    "        <tr><th>Document Object Identifier:</th> <td><a href=\"{{document.doi}}\">{{document.id}}</a></td></tr>\n" +
    "        <tr><th>Journal Title:</th> <td>{{ document.journal['header-title'] || '-' }}</td></tr>\n" +
    "        <tr><th>Abstract</th> <td>{{ ( document.journal.abstract || '-' ) }}</td></tr>\n" +
    "        <tr><th>Authors:</th> <td>{{ document.getAuthors().join(\",\") || '-' }}</td></tr>\n" +
    "        <tr><th>Affiliations:</th> <td>{{ document.getAffiliations().join(\",\") || '-' }}</td></tr>\n" +
    "        <tr><th>Meta-Authors:</th> <td>{{ document.journal['header-author'] || '-' }}</td></tr>\n" +
    "        <tr><th>Foot-Note:</th> <td>{{ document.journal['header-author'] || '-' }}</td></tr>\n" +
    "        <tr><th>Date:</th> <td>{{ document.journal['date-type'] }} {{ document.journal['date'] || '-' }}</td></tr>\n" +
    "        <tr><th>File created time:</th> <td>{{ document.journal['created-time'] || '-' }}</td></tr>\n" +
    "      </table>\n" +
    "\n" +
    "      <table class=\"table table-striped\" data-ng-if=\"document.additional\">\n" +
    "        <tr><th>Document Object Identifier:</th> <td><a href=\"{{document.doi}}\">{{document.id}}</a></td></tr>\n" +
    "\n" +
    "        <tr ng-repeat=\"(key, value) in document.additional\">\n" +
    "          <th> {{key}} </th>\n" +
    "          <td> {{ value }} </td>\n" +
    "        </tr>\n" +
    "      </table>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-4\" data-ng-if=\"document.isEntityPresent('sweet')\" class=\"tags-container\">\n" +
    "      <h4>Sweet Entities</h4>\n" +
    "      <div>\n" +
    "        <span data-ng-repeat=\"e in document.getEntities('sweet')\">\n" +
    "          <span class=\"label label-default\" data-ng-bind=\"e\"></span>&nbsp;\n" +
    "        </span>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-4\">\n" +
    "      <div  data-ng-if=\"document.isEntityPresent('LOCATION')\" class=\"tags-container\">\n" +
    "        <h4>Locations</h4>\n" +
    "        <div>\n" +
    "          <span data-ng-repeat=\"e in document.getEntities('LOCATION')\">\n" +
    "            <span class=\"label label-default\" data-ng-bind=\"e\"></span>&nbsp;\n" +
    "          </span>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div data-ng-if=\"document.isEntityPresent('ORGANIZATION')\" class=\"tags-container\">\n" +
    "        <h4>Organizations</h4>\n" +
    "        <div>\n" +
    "          <span data-ng-repeat=\"e in document.getEntities('ORGANIZATION')\">\n" +
    "            <span class=\"label label-default\" data-ng-bind=\"e\"></span>&nbsp;\n" +
    "          </span>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div data-ng-if=\"document.isEntityPresent('PERSION')\" class=\"tags-container\">\n" +
    "        <h4>Person</h4>\n" +
    "        <div>\n" +
    "          <span data-ng-repeat=\"e in document.getEntities('PERSION')\">\n" +
    "            <span class=\"label label-default\" data-ng-bind=\"e\"></span>&nbsp;\n" +
    "          </span>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-4\">\n" +
    "      <div data-ng-if=\"document.isEntityPresent('DATE')\" class=\"tags-container\">\n" +
    "        <h4>Date</h4>\n" +
    "        <div>\n" +
    "          <span data-ng-repeat=\"e in document.getEntities('DATE')\">\n" +
    "            <span class=\"label label-default\" data-ng-bind=\"e\"></span>&nbsp;\n" +
    "          </span>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div data-ng-if=\"document.isEntityPresent('TIME')\" class=\"tags-container\">\n" +
    "        <h4>Time</h4>\n" +
    "        <div>\n" +
    "          <span data-ng-repeat=\"e in document.getEntities('TIME')\">\n" +
    "            <span class=\"label label-default\" data-ng-bind=\"e\"></span>&nbsp;\n" +
    "          </span>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div data-ng-if=\"document.isEntityPresent('MONEY')\" class=\"tags-container\">\n" +
    "        <h4>Money</h4>\n" +
    "        <div>\n" +
    "          <span data-ng-repeat=\"e in document.getEntities('MONEY')\">\n" +
    "            <span class=\"label label-default\" data-ng-bind=\"e\"></span>&nbsp;\n" +
    "          </span>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div data-ng-if=\"document.isEntityPresent('emails') || document.isEntityPresent('phones') || document.isEntityPresent('urls')\" class=\"tags-container\">\n" +
    "        <h4>Misc</h4>\n" +
    "        <div>\n" +
    "          <span data-ng-repeat=\"e in document.getEntities('emails')\">\n" +
    "            <span class=\"label label-default\" data-ng-bind=\"e\"></span>&nbsp;\n" +
    "          </span>\n" +
    "          <span data-ng-repeat=\"e in document.getEntities('phones')\">\n" +
    "            <span class=\"label label-default\" data-ng-bind=\"e\"></span>&nbsp;\n" +
    "          </span>\n" +
    "          <span data-ng-repeat=\"e in document.getEntities('urls')\">\n" +
    "            <span class=\"label label-default\" data-ng-bind=\"e\"></span>&nbsp;\n" +
    "          </span>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"row\" data-ng-if=\"document.geo.length > 0\">\n" +
    "    <hr />\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <leaflet markers=\"map.markers\" height=\"480px\" width=\"100%\"></leaflet>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "\n" +
    "  <div data-ng-if=\"document.journal && document.journal['related-publications'].length > 0\">\n" +
    "    <hr />\n" +
    "    <h4>References</h4>\n" +
    "    <ul>\n" +
    "      <li data-ng-repeat=\"r in document.journal['related-publications']\">\n" +
    "        <p>\n" +
    "          <a href=\"{{r.URL}}\">{{ r.title }}</a> <br/>\n" +
    "          {{ r.abstract }}\n" +
    "        </p>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/document_list/template.html',
    "<div>\n" +
    "  <div class=\"document-container\" infinite-scroll=\"loadDocuments()\">\n" +
    "    <div data-ng-repeat=\"d in documents\"\n" +
    "         class=\"document-list\"\n" +
    "         data-ng-click=\"openDocument(d)\">\n" +
    "\n" +
    "      <div class=\"header\">\n" +
    "        <p>\n" +
    "          <span data-ng-bind=\"d.displayType() | uppercase\"></span>\n" +
    "          <span data-ng-if=\"d.isJournal()\">[Journal]</span>\n" +
    "        </p>\n" +
    "        <a href=\"{{d.doi}}\">{{d.id}}</a> - {{ d['metadata-score'] || d['_score'] }}\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"body\">\n" +
    "        <div data-ng-if=\"d.journal\">\n" +
    "          <p><b>Journal Title:</b> {{ d.journal['header-title'] || '-' }}</p>\n" +
    "          <p><b>Abstract</b> {{ ( d.journal.abstract || '-' ) | limitTo:100 }}</p>\n" +
    "          <p><b>Authors:</b> {{ d.getAuthors().join(\",\") || '-' | limitTo:100 }}</p>\n" +
    "          <p><b>Affiliations:</b> {{ d.getAffiliations().join(\",\") || '-' | limitTo:100 }}</p>\n" +
    "        </div>\n" +
    "\n" +
    "        <div data-ng-if=\"d.isImage()\">\n" +
    "          <img ng-src=\"{{d.getURL()}}\" />\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/filters/concept_template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-4\" data-ng-repeat=\"q in queries\">\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-md-9\">\n" +
    "          <tags-input ng-model=\"q.tags\" add-on-paste=\"true\" select-first-match=\"false\">\n" +
    "            <auto-complete source=\"loadTags($query)\"></auto-complete>\n" +
    "          </tags-input>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-1\" style=\"padding-top: 10px;text-align: left;\">\n" +
    "          <i class=\"fa fa-times cursor\" data-ng-click=\"removeQuery($index)\"></i>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-2\" data-ng-show=\"$index != queries.length - 1\">\n" +
    "          <div class=\"form-group\" style=\"padding-top: 10px;\">\n" +
    "            <label>( AND )</label>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/filters/doc_type_template.html',
    "<div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label>Document Type</label>\n" +
    "    <select class=\"form-control\" data-ng-model=\"documentType\">\n" +
    "      <option value=\"application-pdf\">application/pdf</option>\n" +
    "      <option value=\"text-html\">text/html</option>\n" +
    "      <option value=\"application-xhtml-xml\">application/xhtml+xml</option>\n" +
    "      <option value=\"application-rss-xml\">application/rss+xml</option>\n" +
    "      <option value=\"image-jpeg\">image/jpeg</option>\n" +
    "      <option value=\"image-gif\">image/gif</option>\n" +
    "      <option value=\"image-png\">image/png</option>\n" +
    "      <option value=\"video-mp4\">video/mp4</option>\n" +
    "      <option value=\"video-mpeg\">video/mpeg</option>\n" +
    "      <option value=\"video-quicktime\">video/quicktime</option>\n" +
    "    </select>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/filters/entity_template.html',
    "<div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label>Entity</label>\n" +
    "\n" +
    "    <select class=\"form-control\" data-ng-model=\"entity\" data-ng-init=\"entity = 'LOCATION'\">\n" +
    "      <option value='sweet'>sweet</option>\n" +
    "      <option value='LOCATION'>LOCATION</option>\n" +
    "      <option value='geo'>geo</option>\n" +
    "      <option value='DATE'>DATE</option>\n" +
    "      <option value='TIME'>TIME</option>\n" +
    "      <option value='ORGANIZATION'>ORGANIZATION</option>\n" +
    "      <option value='PERSON'>PERSON</option>\n" +
    "      <option value='PERCENT'>PERCENT</option>\n" +
    "      <option value='MONEY'>MONEY</option>\n" +
    "    </select>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/filters/magnification_template.html',
    "<div>\n" +
    "  <div class=\"form-group\" data-ng-init=\"magnification={ value: 0 }\">\n" +
    "    <label>Magnification ( {{ magnification.value }}x ): </label>\n" +
    "\n" +
    "    <div class=\"form-slider\">\n" +
    "      <div ui-slider min=\"0\" max=\"5\" step=\"0.5\" ng-model=\"magnification.value\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/flash/template.html',
    "<div>\n" +
    "  <div class=\"c-alert c-{{flashConfig.type || 'info'}}\" data-ng-if=\"(flashConfig && !closeFlash)\">\n" +
    "    <span class=\"glyphicon c-{{flashConfig.type || 'info'}}-icon\"></span>\n" +
    "    <span class=\"body\" data-ng-bind=\"flashConfig.message\"></span>\n" +
    "    <button type=\"button\" class=\"close\" data-ng-click=\"close()\" aria-hidden=\"true\">&times;</button>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/geographic_distribution/template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-4\">\n" +
    "      <div c-doc-type-filter data-document-type=\"docType\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-8\">\n" +
    "      <leaflet lf-center=\"map.center\"\n" +
    "               lf-draw=\"map.drawOptions\" height=\"480px\" width=\"100%\">\n" +
    "      </leaflet>\n" +
    "\n" +
    "      <hr />\n" +
    "\n" +
    "      <table class=\"table table-striped\" data-ng-show=\"regions.length > 0\">\n" +
    "        <thead>\n" +
    "          <tr>\n" +
    "            <th>Regions</th>\n" +
    "            <th>Coordinates</th>\n" +
    "            <th></th>\n" +
    "          </tr>\n" +
    "        </thead>\n" +
    "\n" +
    "        <tbody>\n" +
    "          <tr data-ng-repeat=\"r in regions\">\n" +
    "            <td data-ng-bind=\"r.name\"></td>\n" +
    "            <td>\n" +
    "              <div data-ng-repeat=\"c in r.coords\" data-ng-bind=\"c\"></div>\n" +
    "            </td>\n" +
    "            <td class=\"cursor text-danger\" data-ng-click=\"removeRegion($index)\"><i class=\"fa fa-times\"></i></td>\n" +
    "          </tr>\n" +
    "        </tbody>\n" +
    "      </table>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-4\">\n" +
    "      <nvd3 options=\"options\" data=\"data\"></nvd3>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/idf_cloud/template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-4\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <label>Order:</label>\n" +
    "\n" +
    "        <select class=\"form-control\" data-ng-model=\"order\">\n" +
    "          <option value=\"-1\">Top Down</option>\n" +
    "          <option value=\"1\">Bottom Up</option>\n" +
    "          <option value=\"0\">Random</option>\n" +
    "        </select>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-4\">\n" +
    "      <div class=\"form-group\" style=\"padding-top: 10px;\">\n" +
    "        <label>Size: {{ size.value }}</label>\n" +
    "        <div ui-slider  min=\"1\" max=\"250\" ng-model=\"size.value\"></div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-4\">\n" +
    "      <div class=\"form-group\" style=\"padding-top: 20px;\">\n" +
    "        <button class=\"btn btn-primary pull-right\"\n" +
    "                data-ng-click=\"refresh()\"\n" +
    "                data-ng-disabled=\"state.isWorking\">Refresh Cloud</button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <hr />\n" +
    "\n" +
    "  <div class=\"row\" class=\"idf-cloud-cont\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <div class=\"idf-cloud\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/idf_location/template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-4\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <label>Order:</label>\n" +
    "\n" +
    "        <select class=\"form-control\" data-ng-model=\"order\">\n" +
    "          <option value=\"-1\">Top Down</option>\n" +
    "          <option value=\"1\">Bottom Up</option>\n" +
    "          <option value=\"0\">Random</option>\n" +
    "        </select>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-4\">\n" +
    "      <div class=\"form-group\" style=\"padding-top: 10px;\">\n" +
    "        <label>Size: {{ size.value }}</label>\n" +
    "        <div ui-slider  min=\"1\" max=\"250\" ng-model=\"size.value\"></div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-4\">\n" +
    "      <div class=\"form-group\" style=\"padding-top: 20px;\">\n" +
    "        <button class=\"btn btn-primary pull-right\"\n" +
    "                data-ng-click=\"refresh(data)\"\n" +
    "                data-ng-disabled=\"state.isWorking\">Refresh Map</button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <hr />\n" +
    "\n" +
    "  <div class=\"row\" class=\"idf-location-cont\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <div class=\"idf-location\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/tag_cloud/template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-4\">\n" +
    "      <div c-doc-type-filter data-document-type=\"docType\"></div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-4\">\n" +
    "      <div c-entity-filter data-entity=\"entity\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-3\">\n" +
    "      <div class=\"form-group\" data-ng-init=\"countType='doc'\">\n" +
    "        <label>Aggregation Type</label>\n" +
    "\n" +
    "        <div class=\"radio\">\n" +
    "          <label>\n" +
    "            <input type=\"radio\" name=\"countType\" value=\"doc\" data-ng-model=\"countType\" />Document Count &nbsp;\n" +
    "          </label>\n" +
    "          <label>\n" +
    "            <input type=\"radio\" name=\"countType\" value=\"occurrence\" data-ng-model=\"countType\" />Occurrence count &nbsp;\n" +
    "          </label>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-3\">\n" +
    "      <div class=\"form-group\" data-ng-init=\"tokenization='raw'\">\n" +
    "        <label>Raw vs Tokenized</label>\n" +
    "\n" +
    "        <div class=\"radio\">\n" +
    "          <label>\n" +
    "            <input type=\"radio\" name=\"tokenization\" value=\"raw\" data-ng-model=\"tokenization\" />Raw &nbsp;\n" +
    "          </label>\n" +
    "          <label>\n" +
    "            <input type=\"radio\" name=\"tokenization\" value=\"token\" data-ng-model=\"tokenization\" />Tokenized &nbsp;\n" +
    "          </label>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-3\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <label>Zoom Level</label>\n" +
    "        <select data-ng-model=\"zoomLevel\" class=\"form-control\">\n" +
    "          <option value=\"1\">1</option>\n" +
    "          <option value=\"2\">2</option>\n" +
    "          <option value=\"3\">3</option>\n" +
    "          <option value=\"4\">4</option>\n" +
    "          <option value=\"5\">5</option>\n" +
    "          <option value=\"6\">6</option>\n" +
    "          <option value=\"7\">7</option>\n" +
    "          <option value=\"8\">8</option>\n" +
    "          <option value=\"9\">9</option>\n" +
    "          <option value=\"10\">10</option>\n" +
    "        </select>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-3\">\n" +
    "      <label>&nbsp;</label>\n" +
    "      <div class=\"form-group\">\n" +
    "        <button class=\"btn btn-primary btn-block pull-right\"\n" +
    "                data-ng-click=\"loadEntities()\"\n" +
    "                data-ng-disabled=\"state.isWorking\">Refresh Tag Cloud</button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <hr />\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <div class=\"tag-cloud\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/time_variance/template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-3\">\n" +
    "      <div c-doc-type-filter data-document-type=\"docType\"></div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-3 col-md-offset-6\">\n" +
    "      <div class=\"form-group pull-right\" style=\"padding-top: 5px;\">\n" +
    "        <button class=\"btn btn-md btn-warning\"\n" +
    "                data-ng-click=\"fn.addQuery()\"\n" +
    "                data-ng-disabled=\"state.isWorking\"> Add Filter </button>&nbsp;&nbsp;\n" +
    "        <button class=\"btn btn-md btn-primary\"\n" +
    "                data-ng-click=\"executeQuery()\"\n" +
    "                data-ng-disabled=\"state.isWorking\"> Query </button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <div c-concept-filter data-queries=\"queries\" data-functions=\"fn\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <hr />\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <nvd3 options=\"options\" data=\"data\"></nvd3>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/year_map/template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-3\">\n" +
    "      <div c-doc-type-filter data-document-type=\"docType\"></div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-3\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <label style=\"margin-bottom: 15px;\">Year: {{ year.value }}</label>\n" +
    "        <div ui-slider=\"{ stop: sliderStop,  disabled: state.isWorking }\"  min=\"1950\" max=\"2050\" ng-model=\"year.value\"></div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-3\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <label style=\"margin-bottom: 15px;\">Size: {{ size.value }}</label>\n" +
    "        <div ui-slider=\"{ stop: sliderStop,  disabled: state.isWorking }\"  min=\"1\" max=\"1000\" ng-model=\"size.value\"></div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-3\">\n" +
    "      <div class=\"form-group pull-right\" style=\"padding-top: 25px;\">\n" +
    "        <button class=\"btn btn-md btn-warning\"\n" +
    "                data-ng-click=\"fn.addQuery()\"\n" +
    "                data-ng-disabled=\"state.isWorking\"> Add Filter </button>&nbsp;&nbsp;\n" +
    "        <button class=\"btn btn-md btn-primary\"\n" +
    "                data-ng-click=\"loadLocations(year.value, size.value, queries)\"\n" +
    "                data-ng-disabled=\"state.isWorking\"> Query </button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <div c-concept-filter data-queries=\"queries\" data-functions=\"fn\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <hr />\n" +
    "\n" +
    "  <div class=\"row\" data-ng-init=\"map={}\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <leaflet lf-center=\"center\"  layers=\"layers\"  markers=\"map.markers\" event-broadcast=\"events\" height=\"680px\" width=\"100%\"></leaflet>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/sections/home/about.html',
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <h3>Team Members</h3>\n" +
    "    <hr />\n" +
    "    <ul>\n" +
    "      <li><a href=\"https://www.linkedin.com/in/zackwinoker\">Zach Winoker</a></li>\n" +
    "      <li><a href=\"https://www.linkedin.com/in/ajaykumar6\">Ajay Kumar</a></li>\n" +
    "      <li><a href=\"https://github.com/nithinkrishna\">Nithin Krishna</a></li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/sections/home/document.html',
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <div c-document data-doc-type=\"params.type\" data-id=\"params.id\"></div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/sections/home/documents.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <div c-document-list data-doc-type=\"params.type\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/sections/home/index.html',
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-3 col-md-offset-3\">\n" +
    "\n" +
    "    <a href=\"#/visualizations/tag_cloud\">\n" +
    "      <div class=\"tile hvr-float\">\n" +
    "        <div class=\"big-icon\">\n" +
    "          <i class=\"fa fa-mixcloud\"></i>\n" +
    "        </div>\n" +
    "\n" +
    "        <p>\n" +
    "          <b>Tag Cloud</b>\n" +
    "        </p>\n" +
    "      </div>\n" +
    "    </a>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"col-md-3\">\n" +
    "\n" +
    "    <a href=\"#/visualizations/idf_sweet\">\n" +
    "      <div class=\"tile hvr-float\">\n" +
    "        <div class=\"big-icon\">\n" +
    "          <i class=\"fa fa-star\"></i>\n" +
    "        </div>\n" +
    "\n" +
    "        <p>\n" +
    "          <b>Sweet entities TF-IDF</b>\n" +
    "        </p>\n" +
    "      </div>\n" +
    "    </a>\n" +
    "\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-3\">\n" +
    "\n" +
    "    <a href=\"#/visualizations/geo_pie\">\n" +
    "      <div class=\"tile hvr-float\">\n" +
    "        <div class=\"big-icon\">\n" +
    "          <i class=\"fa fa-map-signs\"></i>\n" +
    "        </div>\n" +
    "\n" +
    "        <p>\n" +
    "          <b>Document count distribution over space</b>\n" +
    "        </p>\n" +
    "      </div>\n" +
    "    </a>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"col-md-3\">\n" +
    "\n" +
    "    <a href=\"#/visualizations/time_dependence\">\n" +
    "      <div class=\"tile hvr-float\">\n" +
    "        <div class=\"big-icon\">\n" +
    "          <i class=\"fa fa-line-chart\"></i>\n" +
    "        </div>\n" +
    "\n" +
    "        <p>\n" +
    "          <b>Document count distribution over time</b>\n" +
    "        </p>\n" +
    "      </div>\n" +
    "    </a>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"col-md-3\">\n" +
    "\n" +
    "    <a href=\"#/visualizations/year_map\">\n" +
    "      <div class=\"tile hvr-float\">\n" +
    "        <div class=\"big-icon\">\n" +
    "          <i class=\"fa fa-map-marker\"></i>\n" +
    "        </div>\n" +
    "\n" +
    "        <p>\n" +
    "          <b>Time variant maps</b>\n" +
    "        </p>\n" +
    "      </div>\n" +
    "    </a>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"col-md-3\">\n" +
    "\n" +
    "    <a href=\"#/visualizations/idf_location\">\n" +
    "      <div class=\"tile hvr-float\">\n" +
    "        <div class=\"big-icon\">\n" +
    "          <i class=\"fa fa-map\"></i>\n" +
    "        </div>\n" +
    "\n" +
    "        <p>\n" +
    "          <b>Locations based on TF-IDF</b>\n" +
    "        </p>\n" +
    "      </div>\n" +
    "    </a>\n" +
    "\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<hr />\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-4 col-md-offset-4\">\n" +
    "\n" +
    "    <a href=\"#/documents\">\n" +
    "      <div class=\"tile hvr-float\">\n" +
    "        <div class=\"big-icon\">\n" +
    "          <i class=\"fa fa-search\"></i>\n" +
    "        </div>\n" +
    "\n" +
    "        <p>\n" +
    "          <b>Document Explorer</b>\n" +
    "        </p>\n" +
    "      </div>\n" +
    "    </a>\n" +
    "\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/sections/home/list.html',
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-4 col-md-offset-4\">\n" +
    "    <h4>Computed Mime Types</h4>\n" +
    "\n" +
    "    <hr />\n" +
    "\n" +
    "    <ul>\n" +
    "      <li><a href=\"#/documents/application-pdf\">application/pdf</a></li>\n" +
    "      <li><a href=\"#/documents/text-html\">text/html</a></li>\n" +
    "      <li><a href=\"#/documents/application-xhtml-xml\">application/xhtml+xml</a></li>\n" +
    "      <li><a href=\"#/documents/application-rss-xml\">application/rss+xml</a></li>\n" +
    "      <li><a href=\"#/documents/image-jpeg\">image/jpeg</a></li>\n" +
    "      <li><a href=\"#/documents/image-gif\">image/gif</a></li>\n" +
    "      <li><a href=\"#/documents/image-png\">image/png</a></li>\n" +
    "      <li><a href=\"#/documents/video-mp4\">video/mp4</a></li>\n" +
    "      <li><a href=\"#/documents/video-mpeg\">video/mpeg</a></li>\n" +
    "      <li><a href=\"#/documents/video-quicktime\">video/quicktime</a></li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/sections/visualizations/geo_pie.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <div c-geo-dist></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <h3>Geographic Distribution</h3>\n" +
    "\n" +
    "      <p>\n" +
    "        This visualization enables users to compare the document counts between custom geometric regions. The user can define a geographic boundary by drawing a rectangle on the map. A pie chart gets generated on the right comparing the distribution of documents within these user-defined geographic regions.\n" +
    "      </p>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/sections/visualizations/idf_location.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <div c-idf-location></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <hr />\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <h3>TF-IDF Scores for Locations</h3>\n" +
    "\n" +
    "      <p>\n" +
    "        We computed the TF-IDF scores for the geo tagged locations from the corpus of PDF documents to examine locations with High / Low TF-IDF scores. We computed these scores offline.\n" +
    "      </p>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/sections/visualizations/idf_sweet.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <div c-idf-cloud></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <hr />\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <h3>TF-IDF Scores for Sweet terms</h3>\n" +
    "\n" +
    "      <p>\n" +
    "        We computed the TF-IDF scores for the sweet terms from the corpus of PDF documents to examine sweet terms with High / Low TF-IDF scores. This visualizations is more informative than naive count estimation as it can be used to eliminate irrelevant features. We computed these scores offline. We generated scores for each sweet term in the PDF corpus.\n" +
    "      </p>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/sections/visualizations/tag_cloud.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <div c-tag-cloud></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <hr />\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <h3>Tag Cloud</h3>\n" +
    "\n" +
    "      <p>\n" +
    "        This visualization leverages Elasticsearch term aggregations to fetch the\n" +
    "        top 1000 most occurring entities for a given file type. While performing NER\n" +
    "        on the trec polar dataset not only identify entities but also the number of times\n" +
    "        they occur in each document. The <i>Aggregation Type</i> filter aggregates entities\n" +
    "        based on the number of times they've occurred through the dataset ( or ) based on the number of documents in which they've occurred. We also use elasticsearch's inherent\n" +
    "        tokenization mechanism to aggregate entities in their actual / tokenized form.\n" +
    "      </p>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/sections/visualizations/time_dependence.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <div c-time-variance></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <h3>Time Distribution</h3>\n" +
    "\n" +
    "      <p>\n" +
    "        This visualization returns the distribution of document count w.r.t dates fetched from running NER on the various documents. User can also add multiple concept-filters to drill down to distribution of chosen concepts over time.\n" +
    "        (eg) Fetch the distribution of documents over time with tags ( t1 or t2 ) and ( t3 or t4 ).\n" +
    "      </p>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/sections/visualizations/year_map.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <div c-year-map></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <h3>Time Variance</h3>\n" +
    "\n" +
    "      <p>\n" +
    "        This visualization demonstrates the geographic diversity of the Trec-Polar dataset over time. The user can also add concept-filters to further drill down searches.\n" +
    "      </p>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/util/templates/global_loader.html',
    "<div>\n" +
    "  <div class=\"c-global-loader\" data-ng-if=\"loaderConfig\">\n" +
    "    <span data-ng-bind=\"loaderConfig.message\"></span>\n" +
    "  </div>\n" +
    "</div>\n"
  );

}]);
