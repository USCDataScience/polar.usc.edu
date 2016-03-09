var stringify = function (x) {
    if (typeof (x) === 'number' || x === undefined) {
        return String(x);
        // otherwise it won't work for:
        // NaN, Infinity, undefined
    } else {
        return JSON.stringify(x);
    }
};

var js_comparison_table = function () {
    var values = [true, false,
                'true', 'false',
                1, 0, -1,
                '1', '0', '-1',
                null, undefined,
                [], [[]],
                [0], [1],
                ['0'], ['1'],
                '',
                Infinity,
                -Infinity,
                NaN,
        {}];
    var values2 = [true, false,
                'true', 'false',
                1, 0, -1,
                '1', '0', '-1',
                null, undefined,
                [], [[]],
                [0], [1],
                ['0'], ['1'],
                '',
                Infinity,
                -Infinity,
                NaN,
        {}];
    // as for objects it makes difference if they are the same
    var rows = [];
    var row = [];
    var i, j;
    var val1, val2;

    //
    row = values2.map(Boolean).map(function (x) {
        return x ? 1 : -0.5;
    });
    rows.push([1].concat(row));
    for (i = 0; i < values.length; i++) {
        row = [Boolean(values[i]) ? 1 : -0.5];
        for (j = 0; j < values2.length; j++) {
            if (values[i] === values2[j]) {
                row.push(1.);
            } else if (values[i] == values2[j]) {
                row.push(0.5);
            } else if (values[i] == values[j]) {
                row.push(0);
            } else if (values[i] != values2[j]) {
                // row.push(-1);
                row.push(-0.5); // purely for graphical reasons
            } else {
                row.push(0.);
            }
        }
        rows.push(row);
    }

    return {
        labels: ["Boolean(x)"].concat(values.map(stringify)),
        rows: rows
    };
};

window.onload = function () {

    var load_all = function (path) {
        d3.csv(path, function (data) {
            // I de-dictionatize d3 stuff
            // as of now assumes both columns and row labels
            var label_col_full = Object.keys(data[0]);
            var label_row = [];
            var rows = [];
            var row = [];
            for (var i = 0; i < data.length; i++) {
                label_row.push(data[i][label_col_full[0]]);
                row = [];
                for (var j = 1; j < label_col_full.length; j++) {
                    row.push(parseFloat(data[i][label_col_full[j]]));
                }
                rows.push(row);
            }
            d3.select("svg").remove();
            main(rows, label_col_full.slice(1), label_row);

        });
    };


    var mime_type = QueryString.mime_type;
    path = "../../data/mime-analysis-data/cross-correlation/" + mime_type + "_cross_correlation_strength.csv";
    console.log("PATH: " + path);
    load_all(path); // not to start with nothing

};


var main = function (corr, label_col, label_row) {

    var transition_time = 1500;

    var body = d3.select('body');

    var tooltip = body.select('div.tooltip');
    //    .style("opacity", 1e-6);

    var svg = body.append('svg')
        .attr('width', 3500)
        .attr('height', 3500);

    // Autodetect symmetric tables
    d3.select("input#keep_symmetry")
        .each(function () {
            this.checked = JSON.stringify(label_col) === JSON.stringify(label_row);
        });

    //    var keep_symmetry = d3.select("input#keep_symmetry")[0][0].checked;
    //    d3.select("input#keep_symmetry").on("change", function () {
    //        if (corr.length !== corr[0].length) {
    //            this.checked = false;
    //            // or I can disable it
    //        }
    //        keep_symmetry = this.checked;
    //        if (keep_symmetry) {
    //            reorder_matrix(last_k, last_what);
    //        }
    //    });
    //
    //    var sort_process = d3.select("select#sort_func")[0][0].value;
    //    d3.select("select#sort_func").on("change", function () {
    //        sort_process = this.value;
    //        reorder_matrix(last_k, last_what);
    //    });


    var row = corr;
    var col = d3.transpose(corr);


    // converts a matrix into a sparse-like entries
    // maybe 'expensive' for large matrices, but helps keeping code clean
    var indexify = function (mat) {
        var res = [];
        for (var i = 0; i < mat.length; i++) {
            for (var j = 0; j < mat[0].length; j++) {
                res.push({
                    i: i,
                    j: j,
                    val: mat[i][j]
                });
            }
        }
        return res;
    };

    var corr_data = indexify(corr);
    var order_col = d3.range(label_col.length + 1);
    var order_row = d3.range(label_row.length + 1);

    var color = d3.scale.linear()
        .domain([-1, 0, 1])
        .range(['blue', 'white', 'red']);

    var scale = d3.scale.linear()
        .domain([0, d3.min([50, d3.max([label_col.length, label_row.length, 4])])])
        .range([0, parseFloat(d3.select("input#zoom")[0][0].value) * 600]);

    d3.select("input#zoom").on("change", function () {
        scale = d3.scale.linear()
            .domain([0, d3.min([50, d3.max([label_col.length, label_row.length, 4])])])
            .range([0, parseFloat(this.value) * 600]);

        tick_col.transition()
            .duration(transition_time)
            .attr('font-size', scale(0.8))
            .attr('transform', function (d, i) {
                return 'rotate(270 ' + scale(order_col[i] + 0.7) + ',0)';
            })
            .attr('x', function (d, i) {
                return scale(order_col[i] + 0.7);
            });

        tick_row.transition()
            .duration(transition_time)
            .attr('font-size', scale(0.8))
            .attr('y', function (d, i) {
                return scale(order_row[i] + 0.7);
            });

        pixel.transition()
            .duration(transition_time)
            .attr('width', scale(0.9))
            .attr('height', scale(0.9))
            .attr('y', function (d) {
                return scale(order_row[d.i]);
            })
            .attr('x', function (d) {
                return scale(order_col[d.j]);
            });

        // the below does not work, as 
        // refresh_order();
        // tick_col.transition().duration(transition_time)
        //   .attr('font-size', scale(0.8));
        // tick_row.transition().duration(transition_time)
        //     .attr('font-size', scale(0.8));
        // pixel.transition().duration(transition_time)
        //   .attr('width', scale(0.9))
        //   .attr('height', scale(0.9));

    });

    var label_space = 225;
    // I will make it also a function of scale and max label length

    var matrix = svg.append('g')
        .attr('class', 'matrix')
        .attr('transform', 'translate(' + (label_space + 10) + ',' + (label_space + 10) + ')');

    var pixel = matrix.selectAll('rect.pixel').data(corr_data);

    // as of now, data not changable, only sortable
    pixel.enter()
        .append('rect')
        .attr('class', 'pixel')
        .attr('width', scale(0.9))
        .attr('height', scale(0.9))
        .style('fill', function (d) {
            return color(d.val);
        })
        .on('mouseover', function (d) {
            pixel_mouseover(d);
        })
        .on('mouseout', function (d) {
            mouseout(d);
        });
    // .on('click', function(d){reorder_matrix(d.i, 'col'); reorder_matrix(d.j, 'row');});
    //the last thing works only for symmetric matrices, but with asymmetric sorting

    tick_col = svg.append('g')
        .attr('class', 'ticks')
        .attr('transform', 'translate(' + (label_space + 10) + ',' + (label_space) + ')')
        .selectAll('text.tick')
        .data(label_col);

    tick_col.enter()
        .append('text')
        .attr('class', 'tick')
        .style('text-anchor', 'start')
        .attr('transform', function (d, i) {
            return 'rotate(270 ' + scale(order_col[i] + 0.7) + ',0)';
        })
        .attr('font-size', scale(0.8))
        .text(function (d) {
            return d;
        })
        .on('mouseover', function (d, i) {
            tick_mouseover(d, i, col[i], label_row);
        })
        .on('mouseout', function (d) {
            mouseout(d);
        })
        .on('click', function (d, i) {
            reorder_matrix(i, 'col');
        });

    tick_row = svg.append('g')
        .attr('class', 'ticks')
        .attr('transform', 'translate(' + (label_space) + ',' + (label_space + 10) + ')')
        .selectAll('text.tick')
        .data(label_row);

    tick_row.enter()
        .append('text')
        .attr('class', 'tick')
        .style('text-anchor', 'end')
        .attr('font-size', scale(0.8))
        .text(function (d) {
            return d;
        })
        .on('mouseover', function (d, i) {
            tick_mouseover(d, i, row[i], label_col);
        })
        .on('mouseout', function (d) {
            mouseout(d);
        })
        .on('click', function (d, i) {
            reorder_matrix(i, 'row');
        });

    var pixel_mouseover = function (d) {
        tooltip.style("opacity", 0.8)
            .style("left", (d3.event.pageX + 15) + "px")
            .style("top", (d3.event.pageY + 8) + "px")
            .html(d.i + ": " + label_row[d.i] + "<br>" + d.j + ": " + label_col[d.j] + "<br>" + "Value: " + (d.val > 0 ? "+" : "&nbsp;") + d.val.toFixed(3));
    };

    var mouseout = function (d) {
        tooltip.style("opacity", 1e-6);
    };

    var tick_mouseover = function (d, i, vec, label) {
        // below can be optimezed a lot
        var indices = d3.range(vec.length);
        // also value/abs val?
        indices.sort(function (a, b) {
            return Math.abs(vec[b]) - Math.abs(vec[a]);
        });
        res_list = [];
        for (var j = 0; j < Math.min(vec.length, 10); j++) {
            res_list.push((vec[indices[j]] > 0 ? "+" : "&nbsp;") + vec[indices[j]].toFixed(3) + "&nbsp;&nbsp;&nbsp;" + label[indices[j]]);
        }
        tooltip.style("opacity", 0.8)
            .style("left", (d3.event.pageX + 15) + "px")
            .style("top", (d3.event.pageY + 8) + "px")
            .html("" + i + ": " + d + "<br><br>" + res_list.join("<br>"));
    };


    var refresh_order = function () {
        tick_col.transition()
            .duration(transition_time)
            .attr('transform', function (d, i) {
                return 'rotate(270 ' + scale(order_col[i] + 0.7) + ',0)';
            })
            .attr('x', function (d, i) {
                return scale(order_col[i] + 0.7);
            });

        tick_row.transition()
            .duration(transition_time)
            .attr('y', function (d, i) {
                return scale(order_row[i] + 0.7);
            });

        pixel.transition()
            .duration(transition_time)
            .attr('y', function (d) {
                return scale(order_row[d.i]);
            })
            .attr('x', function (d) {
                return scale(order_col[d.j]);
            });
    };

    refresh_order();

    var last_k = 0;
    var last_what = 'col';
    var reorder_matrix = function (k, what) {
        last_k = k;
        last_what = what;
        var order = [];
        var vec = [];
        var labels = [];
        var vecs = [];
        if (what === 'row') { //yes, we are sorting counterpart
            vec = row[k];
            vecs = row;
            labels = label_col; //test is if it ok
        } else if (what === 'col') {
            vec = col[k];
            vecs = col;
            labels = label_row;
        }
        var indices = d3.range(vec.length);
        switch (sort_process) {
            case "value":
                indices = indices.sort(function (a, b) {
                    return vec[b] - vec[a];
                });
                break;
            case "abs_value":
                indices = indices.sort(function (a, b) {
                    return Math.abs(vec[b]) - Math.abs(vec[a]);
                });
                break;
            case "original":
                break;
            case "alphabetic":
                indices = indices.sort(function (a, b) {
                    return Number(labels[a] > labels[b]) - 0.5;
                });
                break;
            case "similarity":
                // Ugly, but sometimes we want to sort the coordinate we have clicked
                // Also, as of now with no normalization etc
                indices = d3.range(vecs.length);
                indices = indices.sort(function (a, b) {
                    var s = 0;
                    for (var i = 0; i < vec.length; i++) {
                        s += (vecs[b][i] - vecs[a][i]) * vec[i];
                    }
                    return s;
                });
                if (what === 'col' || keep_symmetry) {
                    order_col = reverse_permutation(indices);
                } //not else if!
                if (what === 'row' || keep_symmetry) {
                    order_row = reverse_permutation(indices);
                }
                refresh_order();
                return undefined;
        }
        if (what === 'row' || keep_symmetry) {
            order_col = reverse_permutation(indices);
        } //not else if!
        if (what === 'col' || keep_symmetry) {
            order_row = reverse_permutation(indices);
        }
        refresh_order();
    };

    var reverse_permutation = function (vec) {
        var res = [];
        for (var i = 0; i < vec.length; i++) {
            res[vec[i]] = i;
        }
        return res;
    };

};

var QueryString = function () {
    // This function is anonymous, is executed immediately and 
    // the return value is assigned to QueryString!
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = decodeURIComponent(pair[1]);
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
            query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else {
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
    }
    return query_string;
}();
