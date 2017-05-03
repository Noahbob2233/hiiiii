function init() {};
require([
   'jsiso/canvas/Control',
   'jsiso/tile/Field',
   'jsiso/img/load',
   'jsiso/canvas/Input',
   'requirejs/domReady!'
 ],
 function(CanvasControl, TileField, imgLoad, CanvasInput) {

   // RGBA of color to use
   var tileColor = "(158, 154, 255, 1)";
   var groundColor =  "(100, 154, 100, 1)";

   // Our Tile Map
   var tileMap = [
     [groundColor, groundColor, groundColor, groundColor, groundColor, groundColor, groundColor],
     [groundColor, tileColor, groundColor, tileColor, groundColor, tileColor, groundColor],
     [groundColor, tileColor, tileColor, tileColor, groundColor, tileColor, groundColor],
     [groundColor, tileColor, groundColor, tileColor, groundColor, tileColor, groundColor],
     [groundColor, groundColor, groundColor, groundColor, groundColor, groundColor, groundColor]
   ]

   // Our Height Map
   var tileHeightMap = [
     [0,0,0,0,0,0,0],
     [0,1,0,1,0,1,0],
     [0,1,1,1,0,2,0],
     [0,4,0,4,0,3,0],
     [0,0,0,0,0,0,0]
   ]

   // X & Y drawing position, and tile span to draw
   var xrange = 8;
   var yrange = 8;

   // X & Y Coordinates of Ralph
   var ralphX = 1;
   var ralphY = 1;

   var ralphGraphic = null; // Will contain the image of Raplh once it has been loaded

   var context = CanvasControl.create("canavas", 640, 640, {}, "main");

   // Two layers - one for the ground, second layer for objects, player objects, NPCS, pickups, etc etc
   var tileLayer = new TileField(context, CanvasControl().height, CanvasControl().width);
   var objectLayer = new TileField(context, CanvasControl().height, CanvasControl().width);

// Create our Input controls and pass through the CanvasControl to it
   var input = new CanvasInput(document, CanvasControl());
   // Pressed is the keycode of user input, and keydown means the button is down rather than press ended
   input.keyboard(function(pressed, keydown) {
     if (!keydown) {
       switch(pressed) {
         // Move player
         case 37:
           ralphY ++;
         break;
         case 39:
           ralphY --;
         break;
         case 40:
           ralphX ++;
         break;
         case 38:
           ralphX --;
         break;
       }
       // Call draw Tile Map function
       drawTileMap();
     }
   });

   var images = [
     {
       graphics: [
         "/img/game/ground/blank-block.png" // The images we want to load using imgLoader
       ]
     },
     {
       graphics: [
         "/tutorials/img/ralph.png"
       ]
     }
   ];


   function drawTileMap() {
     // Clear drawn map before clearing
     context.clearRect(0, 0, CanvasControl().width, CanvasControl().height);
     // Loop through our tiles and draw the map
     for (i = 0; i < 0 + xrange; i++) {
       for (j = 0; j < 0 + yrange; j++) {
         tileLayer.draw(i, j);
         if (i === ralphX && j === ralphY) {
           objectLayer.draw(i, j, ralphGraphic);
         }
       }
     }
   }

// imgLoad uses Promises, once the images have loaded we continue and use the returned imgResponse
   imgLoad(images).then(function(imgResponse) {

// set Raplphs image, imgResponse[1] because it was the second list of graphics to be loaded
     ralphGraphic = imgResponse[1].files["ralph.png"]

     tileLayer.setup({
       title: "Ground Layer",
       layout: tileMap,
       isometric: true, // Flag used to layout grid in isometric format
       tileHeight: 50,
       tileWidth: 100,
       heightMap: {
         map: tileHeightMap,
         // imgResponse[0] contains the first set of grpahic files[] we placed in the graphics array
         heightTile: imgResponse[0].files["blank-block.png"],
         offset: 0
       },
       shadow: {
         offset: 50, // Offset is the same height as the stack tile
         verticalColor: '(5, 5, 30, 0.4)',
         horizontalColor: '(6, 5, 50, 0.5)'
       }
     });
     // Object Layer
     objectLayer.setup({
       title: "Object Layer",
       isometric: true, // Flag used to layout grid in isometric format
       zeroIsBlank: true,
       layout: tileMap,
       tileHeight: 50,
       tileWidth: 100,
       heightMap: {
         map: tileHeightMap,
         offset: 50,
         heightMapOnTop: true// We want to draw only on top of the heightmap
       }
     });

     // Rotate our entire Map
     tileLayer.rotate("left");
     objectLayer.rotate("left");

     // Set an offset so our map is on screen
     tileLayer.setOffset(200, 100);
     objectLayer.setOffset(200, 100);

     // Call draw Tile Map function
     drawTileMap();
   });
 });
