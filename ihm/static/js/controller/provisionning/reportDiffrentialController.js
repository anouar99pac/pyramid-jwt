<script type="text/javascript">
var app = angular.module('neteven',[])
app.controller('ProvisionningReportController', ['$scope', '$http', function($scope, $http){
  $scope.marketplace_id = angular.element(document.querySelector("#marketplace_id")).val()
  //show loader
  $scope.isDataLoaded = false
 //get report with json
 $http.get('/provisionning-download', {'params': {'marketplace_id':$scope.marketplace_id}})
 .success(function(response){
    //array of data 
    var root = []
    root = response.provisionning.details
    if(root){
    $scope.isDataLoaded = true
    }

    //#####hieght of document of document based on number of elements
    var sum_element =  response.provisionning.changes + response.provisionning.new + response.provisionning.old
    var margin = {top: 50, right: 130, bottom: 30, left: 130};
    var width = 2500 - margin.right - margin.left;
        console.log(sum_element);
    var hieght = 700;
    if(sum_element<20){
      hieght = 700
    }
    else{
      hieght = (sum_element/100)*3000 - margin.top - margin.bottom;
    }
    //var height = (sum_element && sum_element<100)?((sum_element/100)*2000 - margin.top - margin.bottom):1500
    //########################
    var i = 0,
        duration = 700;

    var tree = d3.layout.tree()
        .size([height, width]);

    var diagonal = d3.svg.diagonal()
        .projection(function(d) { return [d.y, d.x]; });

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    function collapse(d) {
        if (d.children) {
          d._children = d.children;
          d._children.forEach(collapse);
          d.children = null;
        }
      }
    root.x0 = height / 2;
    root.y0 = 0;
    root.children.forEach(collapse);
    update(root);

    d3.select(self.frameElement).style("height", "1500px");

    function update(source) {

      // Compute the new tree layout.
      var nodes = tree.nodes(root).reverse(),
          links = tree.links(nodes);

      // Normalize for fixed-depth.
      nodes.forEach(function(d) { d.y = d.depth * 400;});

      // Update the nodes…
      var node = svg.selectAll("g.node")
          .data(nodes, function(d) { return d.id || (d.id = ++i); });

      // Enter any new nodes at the parent's previous position.
      var nodeEnter = node.enter().append("g")
          .attr("class",  function(d) { return  "node"})
          .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
          .on("click", click);

      nodeEnter.append("circle")
          .attr("r", 1e-7)
          .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

      nodeEnter.append("text")
          .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
          .style("fill-opacity", 1e-6)
          .style("color", '#fff')
          .attr("dy", ".30em")
          .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
          .text(function(d) { return d.name; })
          .attr("class", function(d){if (d.classe) return d.classe ; if(d.class) return d.class})

      // Transition nodes to their new position.
      var nodeUpdate = node.transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

      nodeUpdate.select("circle")
          .attr("r", 7)
          .style("fill", function(d) { return d._children && d._children.length ? "lightsteelblue" : "#fff"; });

      nodeUpdate.select("text")
          .style("fill-opacity", 1);

      // Transition exiting nodes to the parent's new position.
      var nodeExit = node.exit().transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
          .remove();

      nodeExit.select("circle")
          .attr("r", 1e-6);

      nodeExit.select("text")
          .style("fill-opacity", 1e-6);

      // Update the links…
      var link = svg.selectAll("path.link")
          .data(links, function(d) { return d.target.id; });

      // Enter any new links at the parent's previous position.
      link.enter().insert("path", "g")
          .attr("class", function(d){ if (d.target.classe) return "link "+ d.target.classe ; else return "link"})
          .attr("d", function(d) {
            var o = {x: source.x0, y: source.y0};
            return diagonal({source: o, target: o});
          });

      // Transition links to their new position.
      link.transition()
          .duration(duration)
          .attr("d", diagonal);

      // Transition exiting nodes to the parent's new position.
      link.exit().transition()
          .duration(duration)
          .attr("d", function(d) {
            var o = {x: source.x, y: source.y};
            return diagonal({source: o, target: o});
          })
          .remove();

      // Stash the old positions for transition.
      nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    // Toggle children on click.
    function click(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      update(d);
    }



})
 .error(function(){
    alert("une erreur s'est produite lors de téléchargement de différentiel")
 })
}])
</script>