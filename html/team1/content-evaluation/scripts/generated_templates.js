angular.module('metadataEvaluationApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/scripts/components/crawler/template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-4\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <label>Crawled Domain</label>\n" +
    "        <select ng-model=\"selectedDomain\" class=\"form-control\">\n" +
    "          <option ng-repeat=\"d in domains\" value=\"{{d}}\" data-ng-bind=\"d\"></option>\n" +
    "        </select>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <hr />\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <nvd3 options=\"options\" data=\"data\"></nvd3>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <h3>Mime diversity vs Domain</h3>\n" +
    "\n" +
    "      <p>\n" +
    "        This visualization demonstrates the mime diversity W.R.T domains crawled.\n" +
    "        The degree of mime diversity of for a given domain is a good indicator of crawl success.\n" +
    "      </p>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <hr />\n" +
    "\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-6\" data-ng-show=\"titles.length > 0\">\n" +
    "      <table class=\"table table-striped\">\n" +
    "        <thead>\n" +
    "          <tr>\n" +
    "            <th>Title</th>\n" +
    "            <th>Doc Count (%)</th>\n" +
    "          </tr>\n" +
    "        </thead>\n" +
    "\n" +
    "        <tbody>\n" +
    "          <tr data-ng-repeat=\"t in titles\">\n" +
    "            <td data-ng-bind=\"t.key\"></td>\n" +
    "            <td data-ng-bind=\"t.norm * 100  | number : 2\"></td>\n" +
    "          </tr>\n" +
    "        </tbody>\n" +
    "      </table>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <h3>Page titles</h3>\n" +
    "\n" +
    "      <p>\n" +
    "        <b>302 Found, 301 Moved Permanently, Document Moved</b> on page are indicators\n" +
    "        of crawl failures.\n" +
    "      </p>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
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


  $templateCache.put('app/scripts/components/language/template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <label>Languages by Type (Polar Full Dump)</label>\n" +
    "        <select ng-model=\"selectedType\" class=\"form-control\">\n" +
    "          <option ng-repeat=\"d in contentTypes\" value=\"{{d}}\" data-ng-bind=\"d\"></option>\n" +
    "        </select>\n" +
    "      </div>\n" +
    "\n" +
    "      <nvd3 options=\"options\" data=\"data\"></nvd3>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <h3>Language diversity</h3>\n" +
    "\n" +
    "      <p>\n" +
    "        This visualization demonstrates the language diversity of each mime type  in the polar dataset.\n" +
    "        Tika-Pythos's language detector with prenuptial language profiles was run on 1.5M files in the polar-fulldump dataset to produce the following language diversity by type.\n" +
    "\n" +
    "        <table class=\"table table-bodered\">\n" +
    "          <tr><th>be</th><td>Belarusian</td></tr>\n" +
    "          <tr><th>ca</th><td>Catalan</td></tr>\n" +
    "          <tr><th>da</th><td>Danish</td></tr>\n" +
    "          <tr><th>de</th><td>German</td></tr>\n" +
    "          <tr><th>eo</th><td>Esperanto</td></tr>\n" +
    "          <tr><th>et</th><td>Estonian</td></tr>\n" +
    "          <tr><th>el</th><td>Greek</td></tr>\n" +
    "          <tr><th>en</th><td>English</td></tr>\n" +
    "          <tr><th>es</th><td>Spanish</td></tr>\n" +
    "          <tr><th>fi</th><td>Finnish</td></tr>\n" +
    "          <tr><th>fr</th><td>French</td></tr>\n" +
    "          <tr><th>fa</th><td>Persian</td></tr>\n" +
    "          <tr><th>gl</th><td>Galician</td></tr>\n" +
    "          <tr><th>hu</th><td>Hungarian</td></tr>\n" +
    "          <tr><th>is</th><td>Icelandic</td></tr>\n" +
    "          <tr><th>it</th><td>Italian</td></tr>\n" +
    "          <tr><th>lt</th><td>Lithuanian</td></tr>\n" +
    "          <tr><th>nl</th><td>Dutch</td></tr>\n" +
    "          <tr><th>no</th><td>Norwegian</td></tr>\n" +
    "          <tr><th>pl</th><td>Polish</td></tr>\n" +
    "          <tr><th>pt</th><td>Portuguese</td></tr>\n" +
    "          <tr><th>ro</th><td>Romanian</td></tr>\n" +
    "          <tr><th>ru</th><td>Russian</td></tr>\n" +
    "          <tr><th>sk</th><td>Slovakian</td></tr>\n" +
    "          <tr><th>sl</th><td>Slovenian</td></tr>\n" +
    "          <tr><th>sv</th><td>Swedish</td></tr>\n" +
    "          <tr><th>th</th><td>Thai</td></tr>\n" +
    "          <tr><th>uk</th><td>Ukrainian</td></tr>\n" +
    "        </table>\n" +
    "      </p>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/measurement/template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-4\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <label>Mime Type</label>\n" +
    "        <select ng-model=\"selectedType\" class=\"form-control\">\n" +
    "          <option ng-repeat=\"d in contentTypes\" value=\"{{d}}\" data-ng-bind=\"d\"></option>\n" +
    "        </select>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-4\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <label>Crawled Domain</label>\n" +
    "        <select ng-model=\"selectedDomain\" class=\"form-control\">\n" +
    "          <option ng-repeat=\"d in domains\" value=\"{{d}}\" data-ng-bind=\"d\"></option>\n" +
    "        </select>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-4\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <label>&nbsp;</label>\n" +
    "        <button class=\"btn btn-primary btn-block\"\n" +
    "                data-ng-disabled=\"state.isWorking\"\n" +
    "                data-ng-click=\"loadMeasurements()\">Refresh</button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <hr />\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <nvd3 options=\"options\" data=\"data\"></nvd3>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <hr/>\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-6 col-md-offset-3 text-center\">\n" +
    "      <h3>Measurement Distribution</h3>\n" +
    "\n" +
    "      <p>This visualization depicts the top 15 extracted measurement types, the min, max, mean\n" +
    "        and SD of each extracted measurement type. The visualization has been normalized with the max measurement value of each type, hovering will display unnormalized(actual) values.</p>\n" +
    "    </div>\n" +
    "  </h>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/ner/template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-8\">\n" +
    "      <nvd3 options=\"options\" data=\"data\"></nvd3>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-4\">\n" +
    "      <h3>NER Evaluation</h3>\n" +
    "\n" +
    "      <o>This visualization demonstrates the maximum, average entities recognized by\n" +
    "        each NER library(OPENNLP, CORENLP, NLTK). It also shows overlap between pairs of NER libraries\n" +
    "        and the 3 combined.</o>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/parser/template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-4\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <label>Parsers by Type</label>\n" +
    "        <select ng-model=\"selectedType\" class=\"form-control\">\n" +
    "          <option ng-repeat=\"d in contentTypes\" value=\"{{d}}\" data-ng-bind=\"d\"></option>\n" +
    "        </select>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <hr />\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <nvd3 options=\"options\" data=\"data\"></nvd3>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <h3 class=\"text-center\">Dataset size vs Index size</h3>\n" +
    "      <hr />\n" +
    "      <nvd3 options=\"statOptions\" data=\"statData\"></nvd3>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <hr />\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <p>\n" +
    "        The count of the various parsers called while parsing a given mime type.\n" +
    "      </p>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <p>Comparison of the size of the elastic search index vs sum of the size\n" +
    "         of all the documents analyzed in assignment 3.</p>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/size/size_chart.html',
    "<div>\n" +
    "  <div class=\"modal-body\">\n" +
    "    <center><img data-ng-src=\"data/size/{{data.key}}\" /></center>\n" +
    "\n" +
    "    <table class=\"table\">\n" +
    "      <thead>\n" +
    "        <tr>\n" +
    "          <th colspan=\"5\" class=\"text-center\">Cluster Demarcation (Bytes)</th>\n" +
    "        </tr>\n" +
    "      </thead>\n" +
    "      <tr>\n" +
    "        <td>[0, {{data.value[0] | number }}]</td>\n" +
    "        <td>({{data.value[0] | number }}, {{data.value[1] | number }}]</td>\n" +
    "        <td>({{data.value[1] | number }}, {{data.value[2] | number }}]</td>\n" +
    "        <td>({{data.value[2] | number }}, {{data.value[3] | number }}]</td>\n" +
    "        <td>({{data.value[3] | number }}, {{data.value[4]}}..Infinity]</td>\n" +
    "      </tr>\n" +
    "    </table>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/size/template.html',
    "<div>\n" +
    "  <table class=\"table table-striped table-hover\">\n" +
    "    <thead>\n" +
    "      <tr>\n" +
    "        <th>Type</th>\n" +
    "        <th>Min (Bytes)</th>\n" +
    "        <th>Max (Bytes)</th>\n" +
    "        <th>Median (Bytes)</th>\n" +
    "        <th>Mean (Bytes)</th>\n" +
    "      </tr>\n" +
    "    </thead>\n" +
    "\n" +
    "    <tbody>\n" +
    "      <tr data-ng-repeat=\"o in clusterSummary\">\n" +
    "        <td>\n" +
    "          <a data-ng-if=\"isClusterable(o.key)\"\n" +
    "             data-ng-click=\"openChart(o.key)\"\n" +
    "             data-ng-bind=\"o.key\"></a>\n" +
    "          <span data-ng-if=\"!isClusterable(o.key)\" data-ng-bind=\"o.key\"></span>\n" +
    "        </td>\n" +
    "        <td data-ng-bind=\"o.summary.min    | number\"></td>\n" +
    "        <td data-ng-bind=\"o.summary.max    | number\"></td>\n" +
    "        <td data-ng-bind=\"o.summary.median | number\"></td>\n" +
    "        <td>\n" +
    "          <span data-ng-bind=\"o.summary.mean\"></span>\n" +
    "        </td>\n" +
    "      </tr>\n" +
    "    </tbody>\n" +
    "  </table>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/size_dist/template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <nvd3 options=\"options\"\n" +
    "            data=\"data\"></nvd3>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div>\n" +
    "    <table class=\"table table-striped\" style=\"font-size: 10px;\">\n" +
    "      <tr>\n" +
    "        <td data-ng-repeat=\"b in buckets\">\n" +
    "          <b>BK: {{ $index }}</b> <br />\n" +
    "\n" +
    "          {{ b }} - {{ buckets[$index + 1] || 'Inf' }} Bytes\n" +
    "        </td>\n" +
    "      </tr>\n" +
    "    </table>\n" +
    "  </div>\n" +
    "\n" +
    "  <hr />\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <div c-type-list data-selected=\"types\"></div>\n" +
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


  $templateCache.put('app/scripts/components/type_list/template.html',
    "<div data-ng-init=\"selected = { }\">\n" +
    "  <div data-ng-repeat=\"f in formats\"\n" +
    "       class=\"type-list\"\n" +
    "       data-ng-click=\"f.$selected = !f.$selected; loadSelectedList()\"\n" +
    "       data-ng-class=\"{ 'selected': f.$selected }\"\n" +
    "       data-ng-if=\"multiple != 'FALSE'\">\n" +
    "    {{ f.key }}\n" +
    "  </div>\n" +
    "\n" +
    "  <div data-ng-repeat=\"f in formats\"\n" +
    "       class=\"type-list\"\n" +
    "       data-ng-click=\"select(f)\"\n" +
    "       data-ng-class=\"{ 'selected': (selected.key == f.key) }\"\n" +
    "       data-ng-if=\"multiple == 'FALSE'\">\n" +
    "    {{ f.key }}\n" +
    "  </div>\n" +
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


  $templateCache.put('app/scripts/sections/home/crawler.html',
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <div c-crawler></div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/sections/home/index.html',
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-3\">\n" +
    "\n" +
    "    <a href=\"#/size\">\n" +
    "      <div class=\"tile hvr-float\">\n" +
    "        <div class=\"big-icon\">\n" +
    "          <i class=\"fa fa-area-chart\"></i>\n" +
    "        </div>\n" +
    "\n" +
    "        <p>Variation of file size</p>\n" +
    "      </div>\n" +
    "    </a>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"col-md-3\">\n" +
    "\n" +
    "    <a href=\"#/crawler\">\n" +
    "      <div class=\"tile hvr-float\">\n" +
    "        <div class=\"big-icon\">\n" +
    "          <i class=\"fa fa-space-shuttle\"></i>\n" +
    "        </div>\n" +
    "\n" +
    "        <p>Crawler performance</p>\n" +
    "      </div>\n" +
    "    </a>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "\n" +
    "  <div class=\"col-md-3\">\n" +
    "\n" +
    "    <a href=\"#/parser\">\n" +
    "      <div class=\"tile hvr-float\">\n" +
    "        <div class=\"big-icon\">\n" +
    "          <i class=\"fa fa-cut\"></i>\n" +
    "        </div>\n" +
    "\n" +
    "        <p>Parser performance</p>\n" +
    "      </div>\n" +
    "    </a>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"col-md-3\">\n" +
    "\n" +
    "    <a href=\"#/language\">\n" +
    "      <div class=\"tile hvr-float\">\n" +
    "        <div class=\"big-icon\">\n" +
    "          <i class=\"fa fa-language\"></i>\n" +
    "        </div>\n" +
    "\n" +
    "        <p>Language</p>\n" +
    "      </div>\n" +
    "    </a>\n" +
    "\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-3 col-md-offset-3\">\n" +
    "\n" +
    "    <a href=\"#/ner\">\n" +
    "      <div class=\"tile hvr-float\">\n" +
    "        <div class=\"big-icon\">\n" +
    "          <i class=\"fa fa-connectdevelop\"></i>\n" +
    "        </div>\n" +
    "\n" +
    "        <p>NER Techniques</p>\n" +
    "      </div>\n" +
    "    </a>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"col-md-3\">\n" +
    "\n" +
    "    <a href=\"#/measurement\">\n" +
    "      <div class=\"tile hvr-float\">\n" +
    "        <div class=\"big-icon\">\n" +
    "          <i class=\"fa fa-balance-scale\"></i>\n" +
    "        </div>\n" +
    "\n" +
    "        <p>Measurements</p>\n" +
    "      </div>\n" +
    "    </a>\n" +
    "\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n"
  );


  $templateCache.put('app/scripts/sections/home/language.html',
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <div c-language></div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/sections/home/measurement.html',
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <div c-measurement></div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/sections/home/ner.html',
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <div c-ner></div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/sections/home/parser.html',
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <div c-parser></div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/sections/home/size.html',
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <div c-size-dist></div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<hr />\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <div c-type-size></div>\n" +
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
