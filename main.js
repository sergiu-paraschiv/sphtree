(function(w, $, d3) {
    'use strict';

    function loadAvatar(fbUserId, callback) {
        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = 'http://graph.facebook.com/' + fbUserId + '/picture?width=600&height=600';

        img.onload = callback;
    }
    
    function fillCanvas(img) {
        $('#canvas').css('position', 'absolute');
        $('#canvas').css('top', '-1000px');
        $('#canvas').attr('width', img.width);
        $('#canvas').attr('height', img.height);
        
        var drawingContext = $('#canvas')[0].getContext('2d');
        drawingContext.drawImage(img, 0, 0);
        
        return drawingContext;
    }
    
    function triangulateSvg(canvas, width, height) {
        var vertices, path, svg, colors;
        var xCenter, yCenter;
        
        vertices = d3.range(1000).map(function(d) {
            return [Math.random() * width, Math.random() * height];
        });
        
        vertices.push([0, 0]);
        vertices.push([width, 0]);
        vertices.push([width, height]);
        vertices.push([0, height]);
        
        svg = d3.select('body')
            .append('svg')
            .attr('width', width)
            .attr('height', height);
        
        colors = [];
        
        path = svg.append('g').selectAll('path');
        
        function render(toTree) {
            path = path.data(d3.geom.delaunay(vertices).map(function(d, i) {
                xCenter = Math.floor((d[0][0] + d[1][0] + d[2][0]) / 3);
                yCenter = Math.floor((d[0][1] + d[1][1] + d[2][1]) / 3);
                colors[i] = averageColorInCircle(canvas, xCenter, yCenter, 3);

                return 'M' + d.join('L') + 'Z';
            }), String);
            
            path.exit().remove();
            path.enter().append('path')
                .attr('fill', function(d, i) {
                    return rgbToHex(colors[i].r, colors[i].g, colors[i].b);
                })
                .attr('d', String);
        }
        
        render();
    }
    
    function averageColorInCircle(canvas, xCenter, yCenter, radius) {
        var x, y;
        var xCenter, yCenter;
        var xSym, ySym;
        var sqRad = radius * radius;
        var averageColor = {r: 0, g: 0, b: 0};
        var pointCount = 0;
        
        function addPoint(px, py) {
            var color;
            
            if(px > 0 && py > 0) {
                pointCount += 1;
                color = canvas.getImageData(px, py, 1, 1);
                averageColor.r += color.data[0];
                averageColor.g += color.data[1];
                averageColor.b += color.data[2];
            }
        }
        
        for(x = xCenter - radius ; x <= xCenter; x++) {
            for(y = yCenter - radius ; y <= yCenter; y++) {
                if((x - xCenter)*(x - xCenter) + (y - yCenter)*(y - yCenter) <= radius * radius) {
                    xSym = xCenter - (x - xCenter);
                    ySym = yCenter - (y - yCenter);
                    addPoint(x, y);
                    addPoint(x, ySym);
                    addPoint(xSym, y);
                    addPoint(xSym, ySym);
                }
            }
        }
        
        return {
            r: Math.floor(averageColor.r / pointCount),
            g: Math.floor(averageColor.g / pointCount),
            b: Math.floor(averageColor.b / pointCount),
        };
    }
    
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? '0' + hex : hex;
    }
    
    function rgbToHex(r, g, b) {
        return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
    
    function main(fb) {
        $('#fblogin').css('display', 'none');
        //fb.userID
        loadAvatar(552792834796681, function() {
            var canvas = fillCanvas(this);
            triangulateSvg(canvas, this.width, this.height);
        });
    }
    
    w.magick = main;
})(window, jQuery, d3);
