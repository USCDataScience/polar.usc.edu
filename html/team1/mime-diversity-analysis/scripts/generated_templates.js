angular.module('contentVisualizationApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/scripts/components/char_chart/template.html',
    "<div style=\"overflow-y: scroll\">\n" +
    "  <table class=\"table table-striped\">\n" +
    "    <thead>\n" +
    "      <th data-ng-repeat=\"b in byteSet\" data-ng-bind=\"b\"></th>\n" +
    "    </thead>\n" +
    "    <body>\n" +
    "      <td data-ng-repeat=\"b in byteSet\" data-ng-bind=\"fromCharCode(b)\"></td>\n" +
    "    </body>\n" +
    "  </table>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/compare/template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <h4 data-ng-bind=\"text[d1]\"></h4>\n" +
    "      <h5>({{s1 | number}})</h5>\n" +
    "      <nvd3 options=\"options\" data=\"ds1\"></nvd3>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <h4 data-ng-bind=\"text[d2]\"></h4>\n" +
    "      <h5>({{s2 | number}})</h5>\n" +
    "      <nvd3 options=\"options\" data=\"ds2\"></nvd3>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <hr />\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "\n" +
    "      <table class=\"table table-striped\" at-table at-paginated at-list=\"diff\" at-config=\"config\">\n" +
    "        <thead></thead>\n" +
    "        <tbody>\n" +
    "          <tr>\n" +
    "            <td at-implicit at-sortable at-attribute=\"type\" at-initial-sorting=\"asc\" at-title=\"Type\"></td>\n" +
    "            <td at-sortable at-title=\"Meta\">\n" +
    "              <span class=\"label label-success\" data-ng-if=\"item.d1 == 0 || (item.d2 - item.d1) / item.d2 * 100 > 95\">New</span>\n" +
    "              <span class=\"label label-warning\" data-ng-if=\"item.d2 == 0 || (item.d1 - item.d2) / item.d1 * 100 > 95\">Deprecated</span>\n" +
    "              <span class=\"label label-default\" data-ng-if=\"item.d1 == item.d2\">Retained</span>\n" +
    "            </td>\n" +
    "            <td at-implicit at-sortable at-attribute=\"d1\" at-title=\"D1-Count\"></td>\n" +
    "            <td at-implicit at-sortable at-attribute=\"d2\" at-title=\"D2-Count\"></td>\n" +
    "            <td at-implicit at-sortable at-attribute=\"diff\" at-title=\"Difference\"\n" +
    "                data-ng-class=\"{ 'text-success': item.diff > 0, 'text-danger': item.diff < 0 }\"></td>\n" +
    "            </td>\n" +
    "          </tr>\n" +
    "        </tbody>\n" +
    "      </table>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/correlation/template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <div c-char-chart></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <nvd3 options=\"options\"\n" +
    "            data=\"data\"></nvd3>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <hr />\n" +
    "  <div class=\"row\" data-ng-show=\"exterems.length > 0\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <table class=\"table table-striped\">\n" +
    "        <thead>\n" +
    "          <tr>\n" +
    "            <th>Type</th>\n" +
    "            <th>High Correlation (byte value)</th>\n" +
    "            <th>Low Correlation (byte value)</th>\n" +
    "          </tr>\n" +
    "        </thead>\n" +
    "        <tr data-ng-repeat=\"c in exterems\">\n" +
    "          <td>{{ c.name }}</td>\n" +
    "          <td>{{ c.max[0] }}, {{ c.max[1] }}, {{ c.max[2] }}, {{ c.max[3] }}, {{ c.max[4] }}</td>\n" +
    "          <td>{{ c.min[0] }}, {{ c.min[1] }}, {{ c.min[2] }}, {{ c.min[3] }}, {{ c.min[4] }}</td>\n" +
    "        </tr>\n" +
    "      </table>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/cross_correlation/template.html',
    "<div>\n" +
    "  <style>\n" +
    "    svg {\n" +
    "      font: 12px sans-serif;\n" +
    "      text-anchor: middle;\n" +
    "    }\n" +
    "\n" +
    "    rect {\n" +
    "      stroke: lightgray;\n" +
    "      stoke-width: 1px;\n" +
    "      fill: none;\n" +
    "    }\n" +
    "\n" +
    "    .y.axis path{\n" +
    "      fill: none;\n" +
    "      stroke: none;\n" +
    "    }\n" +
    "\n" +
    "  </style>\n" +
    "\n" +
    "\n" +
    "  <div class=\"cross-correlation\"></div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/fht/template.html',
    "<div>\n" +
    "  <style>\n" +
    "    .axis text {\n" +
    "      font: 10px sans-serif;\n" +
    "    }\n" +
    "\n" +
    "    .axis path,\n" +
    "    .axis line {\n" +
    "      fill: none;\n" +
    "      stroke: #000;\n" +
    "      shape-rendering: crispEdges;\n" +
    "    }\n" +
    "\n" +
    "    .axis path {\n" +
    "      display: none;\n" +
    "    }\n" +
    "\n" +
    "    .isoline {\n" +
    "      fill: none;\n" +
    "      stroke: #fff;\n" +
    "    }\n" +
    "  </style>\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <div c-char-chart></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <nvd3 options=\"options\" data=\"dHeadTrail\"></nvd3>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/signature/template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <div c-char-chart></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <nvd3 options=\"options\"\n" +
    "            data=\"data\"></nvd3>\n" +
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
    "             href=\"#/visualize/bfa/{{o.key}}-1:{{o.key}}-2:{{o.key}}-3:{{o.key}}-4:{{o.key}}-5\"\n" +
    "             data-ng-bind=\"o.key\"></a>\n" +
    "          <span data-ng-if=\"!isClusterable(o.key)\" data-ng-bind=\"o.key\"></span>\n" +
    "        </td>\n" +
    "        <td data-ng-bind=\"o.summary.min    | number\"></td>\n" +
    "        <td data-ng-bind=\"o.summary.max    | number\"></td>\n" +
    "        <td data-ng-bind=\"o.summary.median | number\"></td>\n" +
    "        <td>\n" +
    "          <a data-ng-if=\"isClusterable(o.key)\" data-ng-click=\"openChart(o.key)\" data-ng-bind=\"o.summary.mean\"></a>\n" +
    "          <span data-ng-if=\"!isClusterable(o.key)\" data-ng-bind=\"o.summary.mean\"></span>\n" +
    "        </td>\n" +
    "      </tr>\n" +
    "    </tbody>\n" +
    "  </table>\n" +
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


  $templateCache.put('app/scripts/sections/home/bfa.html',
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <h4>Byte Frequency Analysis (BFA)</h4>\n" +
    "\n" +
    "    <p>We've implemented BFA on each file type in the polar dataset. We computed the byte signatures\n" +
    "       for 75% of the files in each type. You can view the byte signature for a given type by clicking\n" +
    "       on the type in the bottom of the screen. You can select multiple types at a time. You can also zoom\n" +
    "       into smaller regions. There is a character chart (just below) to correlate by readings\n" +
    "       with text characters.</p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row\" data-ng-init=\"types = [ ]\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <div c-signature data-types=\"types\"></div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<hr />\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <div c-type-list data-selected=\"types\"></div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/sections/home/bfc.html',
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <h4>Byte Frequency Correlation (BFC)</h4>\n" +
    "\n" +
    "    <p>We've computed byte frequency correlation on all the file-types in the given polar dataset.\n" +
    "       We computed the average correlation between the signature for each type (75% data set) and\n" +
    "       a newly computed signature from the remaining data set. Values closer to 1 indicate high\n" +
    "       correlation. As you click on a particular type a table appears below indicating the top bytes\n" +
    "       which have the highest / lower correlation.</p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row\" data-ng-init=\"types = [ ]\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <div c-correlation data-types=\"types\"></div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<hr />\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <div c-type-list data-selected=\"types\"></div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/sections/home/bfcc.html',
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <h4>Byte Frequency Cross-Correlation (BFCC)</h4>\n" +
    "\n" +
    "    <p>We've computed byte frequency cross-correlation on the BFA signatures computed for each type.\n" +
    "       Matrix values which are 0 are displayed in white. Values which are 1 are displayed in black.\n" +
    "       Values from 0 to 1 are displayed in varying shades of grey. Darker regions indicate closeness to 1.\n" +
    "       Clicking on the type will load the cross-correlation visualization for the given type.\n" +
    "       <b>Please note the visualization is slow to load</b>. It takes about 10 seconds to load once the type is clicked.\n" +
    "       Only one correlation matrix can be viewed at a time.</p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-8 col-md-offset-2\">\n" +
    "    <div c-cross-correlation data-computed=\"type.key\"></div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<hr />\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <div c-type-list data-selected=\"type\" data-multiple=\"'FALSE'\"></div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/sections/home/compare.html',
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <div c-type-compare\n" +
    "         data-d1=\"params.type1\"\n" +
    "         data-d2=\"params.type2\"</div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/sections/home/fht.html',
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <h4>File Header Trailer Analysis (FHT)</h4>\n" +
    "\n" +
    "    <p>We've computed FHT matrices for all the file types in the data set. For each file type\n" +
    "       we computed the fht matrix by aggregating 75% of the files in each type. You can view\n" +
    "       fingerprints from multiple file types at a time. Each file type has a head/trail fingerprint.\n" +
    "       The size of the blob is indicative of the strength of the byte in the fingerprint.\n" +
    "       There is a character chart (just below) to correlate by readings with text characters.\n" +
    "       Alter the URL to this page to alter the FHT-OFFSET. (ie) /8, /16 or /32.</p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row\" data-ng-init=\"types = [ ]\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <div c-fht data-types=\"types\" data-offset=\"params.offset\"></div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<hr />\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <div c-type-list data-selected=\"types\"></div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/sections/home/index.html',
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-4\">\n" +
    "\n" +
    "    <a href=\"#/compare/before/now\">\n" +
    "      <div class=\"tile hvr-float\">\n" +
    "        <div class=\"big-icon\">\n" +
    "          <i class=\"fa fa-balance-scale\"></i>\n" +
    "        </div>\n" +
    "\n" +
    "        <p>Compare (Before vs Now)</p>\n" +
    "      </div>\n" +
    "    </a>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"col-md-4\">\n" +
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
    "  <div class=\"col-md-4\">\n" +
    "\n" +
    "    <a href=\"#/signatures/bfa\">\n" +
    "      <div class=\"tile hvr-float\">\n" +
    "        <div class=\"big-icon\">\n" +
    "          <i class=\"fa fa-signal\"></i>\n" +
    "        </div>\n" +
    "\n" +
    "        <p>Byte Frequency Analysis</p>\n" +
    "      </div>\n" +
    "    </a>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"col-md-4\">\n" +
    "\n" +
    "    <a href=\"#/signatures/bfc\">\n" +
    "      <div class=\"tile hvr-float\">\n" +
    "        <div class=\"big-icon\">\n" +
    "          <i class=\"fa fa-cube\"></i>\n" +
    "        </div>\n" +
    "\n" +
    "        <p>Byte Frequency Correlation</p>\n" +
    "      </div>\n" +
    "    </a>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"col-md-4\">\n" +
    "\n" +
    "    <a href=\"#/signatures/bfcc\">\n" +
    "      <div class=\"tile hvr-float\">\n" +
    "        <div class=\"big-icon\">\n" +
    "          <i class=\"fa fa-barcode\"></i>\n" +
    "        </div>\n" +
    "\n" +
    "        <p>Byte Frequency Cross-Correlation</p>\n" +
    "      </div>\n" +
    "    </a>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"col-md-4\">\n" +
    "\n" +
    "    <a href=\"#/signatures/fht/8\">\n" +
    "      <div class=\"tile hvr-float\">\n" +
    "        <div class=\"big-icon\">\n" +
    "          <i class=\"fa fa-hashtag\"></i>\n" +
    "        </div>\n" +
    "\n" +
    "        <p>FHT Fingerprints</p>\n" +
    "      </div>\n" +
    "    </a>\n" +
    "\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-4 col-md-offset-4\">\n" +
    "\n" +
    "    <a href=\"#/compare/inter/after\">\n" +
    "      <div class=\"tile hvr-float\">\n" +
    "        <div class=\"big-icon\">\n" +
    "          <i class=\"fa fa-balance-scale\"></i>\n" +
    "        </div>\n" +
    "\n" +
    "        <p>Compare (Inter vs After)</p>\n" +
    "      </div>\n" +
    "    </a>\n" +
    "\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<hr />\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-4\">\n" +
    "\n" +
    "    <a href=\"#/visualize/bfa/tp1:tp2:tp3:tp4:tp5\">\n" +
    "      <div class=\"tile hvr-float\">\n" +
    "        <div class=\"big-icon\">\n" +
    "          <i class=\"fa fa-bar-chart\"></i>\n" +
    "        </div>\n" +
    "\n" +
    "        <p>K-Means on Text-Plain</p>\n" +
    "      </div>\n" +
    "    </a>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"col-md-4\">\n" +
    "\n" +
    "    <a href=\"#/visualize/bfa/c1:c2:c3:c4:c5\">\n" +
    "      <div class=\"tile hvr-float\">\n" +
    "        <div class=\"big-icon\">\n" +
    "          <i class=\"fa fa-bar-chart\"></i>\n" +
    "        </div>\n" +
    "\n" +
    "        <p>K-Means on Application-Octet <b>(Tika 1.11)</b></p>\n" +
    "      </div>\n" +
    "    </a>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"col-md-4\">\n" +
    "\n" +
    "    <a href=\"#/visualize/bfa/aon1:aon2:aon3:aon4:aon5\">\n" +
    "      <div class=\"tile hvr-float\">\n" +
    "        <div class=\"big-icon\">\n" +
    "          <i class=\"fa fa-bar-chart\"></i>\n" +
    "        </div>\n" +
    "\n" +
    "        <p>K-Means on Application-Octet <b>(Tika 1.12)</b></p>\n" +
    "      </div>\n" +
    "    </a>\n" +
    "\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/sections/home/size.html',
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <h4>File Size Variation</h4>\n" +
    "\n" +
    "    <p>We've analyzed the variations of file-size in the data set for each file type. We then\n" +
    "       clustered files using k-means clustering based on their file sizes into five clusters.\n" +
    "       We've computed the average BFA signature for each cluster to analyze the variation of\n" +
    "       signatures across type. We also computed the min, max, median and mean of file sizes\n" +
    "       for each file type the distribution of file sizes. Clicking on the file type will\n" +
    "       take you a new view displaying the signatures. Clicking on the mean will show a pop-up\n" +
    "       displaying the results of K-Means clustering.</p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<hr />\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <div c-type-size></div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/sections/visualization/bfa.html',
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <h4>Byte Frequency Analysis (BFA)</h4>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<hr />\n" +
    "\n" +
    "<div class=\"row\" data-ng-init=\"types = [ ]\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <div c-signature data-types=\"types\" data-computed=\"params.file\"></div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<hr />\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <div c-type-list data-selected=\"types\"></div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/sections/visualization/bfc.html',
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <h4>Byte Frequency Correlation (BFC)</h4>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<hr />\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <div c-correlation data-computed=\"params.file\"></div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/sections/visualization/bfcc.html',
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <h4>Byte Frequency Cross Correlation (BFCC)</h4>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<hr />\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <div c-cross-correlation data-computed=\"params.file\"></div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/sections/visualization/fht.html',
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <h4>File Header Trailer (FHT)</h4>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<hr />\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <div c-fht data-computed=\"params.file\" data-offset=\"params.offset\"></div>\n" +
    "  </div>\n" +
    "</div>\n"
  );

}]);
