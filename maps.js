
_renderMap = function(e) {
    var element = $(e),
    width = element.width(),
    height = 315;

    // Create map projection
    var _projection = d3.geo.equirectangular()
      .scale(100)
      .translate([width / 2, height / 2])
      .precision(.1);

    // Add the svg
    var svg = d3.select(e).append('svg')
      .attr('width', width)
      .attr('height', height);

    // Convert projection to a path
    var path = d3.geo.path()
      .projection(_projection);

    var _g = svg.append('g');
    d3.json('js/world-110m.json', function(error, topology) {
      _g.selectAll('path')
      .data(topojson.object(topology, topology.objects.countries)
      .geometries)
      .enter()
      .append('path')
      .attr('d', path);
    });
    return {'proj': _projection,
            'over': _g
           };
 };

_getLoginsStatic = function(state) {
    var _projection = state.proj;
    var overlay = state.over;
    d3.json('cities_small.json', function(error, logins) {
        if (logins.hasOwnProperty('stat') && logins.stat.fail === 'error') {
            return false;
        }
        var circles = overlay.selectAll('circle')
            .data(logins, function(d) { return [d.lon, d.lat] });
        circles.enter()
            .append('circle')
            .attr('cx', function(d) {
                return _projection([d.lon, d.lat])[0];
            })
            .attr('cy', function(d) {
                return _projection([d.lon, d.lat])[1];
            })
            .style('opacity', '.5')
            .attr('r', 4)
            .style('fill', '#77B849');
        circles.exit().remove();
    });
};
_getLogins = function(state, jsondata) {
    var _projection = state.proj;
    var overlay = state.over;
    d3.json(jsondata, function(error, logins) {
        if (logins.hasOwnProperty('stat') && logins.stat.fail === 'error') {
            return false;
        }
        var circles = overlay.selectAll('circle')
            .data(logins, function(d) { return [d.lon, d.lat] });
        circles.enter()
            .append('circle')
            .attr('cx', function(d) {
                return _projection([d.lon, d.lat])[0];
            })
            .attr('cy', function(d) {
                return _projection([d.lon, d.lat])[1];
            })
            .attr('r', 15)
            .style('fill', '#77B849').style('opacity', '0')
            .transition()
            .style('opacity', '.5')
            .attr('r', 4)
            .style('fill', '#77B849')
            .duration(1000).delay(function(d, i) {
                return i / logins.length * 60000});
        circles.exit().remove();
    });
};
