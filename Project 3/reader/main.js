include=function(){function f(){var a=this.readyState;(!a||/ded|te/.test(a))&&(c--,!c&&e&&d())}var a=arguments,b=document,c=a.length,d=a[c-1],e=d.call;e&&c--;for(var g,h=0;c>h;h++)g=b.createElement("script"),g.src=arguments[h],g.async=!0,g.onload=g.onerror=g.onreadystatechange=f,(b.head||b.getElementsByTagName("head")[0]).appendChild(g)};
serialInclude=function(a){var b=console,c=serialInclude.l;if(a.length>0)c.splice(0,0,a);else b.log("Done!");if(c.length>0){if(c[0].length>1){var d=c[0].splice(0,1);b.log("Loading "+d+"...");include(d,function(){serialInclude([]);});}else{var e=c[0][0];c.splice(0,1);e.call();};}else b.log("Finished.");};serialInclude.l=new Array();

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
    function(m,key,value) {
      vars[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return vars;
}

serialInclude(['../lib/CGF.js', 'XMLscene.js', 'MySceneGraph.js', 'MyInterface.js', 'Primitive/Rectangle.js',  'Primitive/Triangle.js', 'Primitive/CylinderSide.js','Primitive/Circle.js','Primitive/Cylinder.js', 'Primitive/Sphere.js', 'Component.js', 'Primitive/Torus.js', 'Animation/Animation.js','Animation/LinearAnimation.js',
'Animation/CircularAnimation.js', 'Primitive/Patch.js', 'Primitive/Plane.js', 'Primitive/ChessBoard.js', 'Primitive/Vehicle.js', 'Primitive/VTriangle.js',
'Primitive/Tiles/Tile1.js', 'Primitive/Tiles/Tile2.js', 'Primitive/Tiles/Tile3.js', 'Primitive/Tiles/Tile4.js', 'Primitive/Tiles/Tile8.js', 'Primitive/Tiles/Tile10.js',
main=function()
{
	// Standard application, scene and interface setup
    var app = new CGFapplication(document.body);
    var myScene = new XMLscene();
    var myInterface = new MyInterface();

    app.init();
    app.setScene(myScene);
    app.setInterface(myInterface);
    myScene.setInterface(myInterface);

	// get file name provided in URL, e.g. http://localhost/myproj/?file=myfile.xml
	// or use "demo.xml" as default (assumes files in subfolder "scenes", check MySceneGraph constructor)
	var filename=getUrlVars()['file'] || "gamescene.dsx";

	// create and load graph, and associate it to scene.
	// Check console for loading errors
	var myGraph = new MySceneGraph(filename, myScene);

	// start
    app.run();
}

]);
