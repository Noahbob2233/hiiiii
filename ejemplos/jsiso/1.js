/*// Our init function contains all our code and will be called via the onLoad attribute in the <body> tag of our HTML page.
function init() {

    // The two dimensional map array as it sounds is basically your world and what will be drawn.
    // Each number can represet a different graphic or possible enviroment interaction.
    // In this tutorial case we only have two possible tiles, zero which is blank and one which is filled.
    var map = [
      [1,0,1,0,1],
      [1,1,1,0,1],
      [1,0,1,0,1]
    ];

    // The next part grabs the canvas element id of 'main' within our page <body>.
    var ctx = document.getElementById('main').getContext('2d');

    // Using two for loops we run through each of the array rows stored and their element values.
    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[i].length; j++) {

            // Check if the value is a 1, represeting a graphic should be drawn.
            if (map[i][j] === 1) {
                // Draw a rectangle at i & j position * 20 pixels so that
                // our 20x20 pixel squares are correctly positioned.
                ctx.fillStyle = '#FF0000';
                ctx.fillRect(j * 20, i * 20, 20, 20);
            }

        }
    }

}*/

function init() {};
// Create the isometric scope.
// Tutorial Note: Wrapping all our code within a function this way means all
// our variables and functions don't become globals. This prevents conflicts if you're using other scripts.
(function(isometric) {

  // Two Dimensional Array storing our isometric map layout. Each number represents a tile.
  var map = [
    [1,0,0,0],
    [1,0,0,1],
    [0,0,1,1],
    [1,1,1,1]
  ];

  var tileGraphics = [];

  var playerX = 2;
  var playerY = 2;

  function loadImg() {

    // Images to be loaded and used.
    // Tutorial Note: As water is loaded first it will be represented by a 0 on the map and land will be a 1.
    var tileGraphicsToLoad = ["water.png","land.png", "ralph.png"],
    tileGraphicsLoaded = 0;

    for (var i = 0; i < tileGraphicsToLoad.length; i++) {
      tileGraphics[i] = new Image();
      tileGraphics[i].src = tileGraphicsToLoad[i];
      tileGraphics[i].onload = function() {
        // Once the image is loaded increment the loaded graphics count and check if all images are ready.
        tileGraphicsLoaded++;
        if (tileGraphicsLoaded === tileGraphicsToLoad.length) {
            drawMap();
        }
      }
    }

  }


  function drawMap() {

    // create the canvas context
    var ctx = document.getElementById('main').getContext('2d');

    // Set as your tile pixel sizes, alter if you are using larger tiles.
    var tileH = 25;
    var tileW = 52;

    // mapX and mapY are offsets to make sure we can position the map as we want.
    var mapX = 76;
    var mapY = 52;

    var drawTile;

    // Clear the  canvas
    ctx.clearRect(0, 0, 500, 500);

    // loop through our map and draw out the image represented by the number.
    for (var i = 0; i < map.length; i++) {
      for (var j = 0; j < map[i].length; j++) {
        drawTile = map[i][j];
        // Draw the represented image number, at the desired X & Y coordinates followed by the graphic width and height.
        ctx.drawImage(tileGraphics[drawTile], (i - j) * tileH + mapX, (i + j) * tileH / 2 + mapY);
        if (playerX === i && playerY === j) {
          ctx.drawImage(tileGraphics[2], (i - j) * tileH + mapX, (i + j) * tileH / 2 + mapY - tileH);
        }
      }
    }
  }

  function init() {
    // Remove Event Listener and load images.
    isometric.removeEventListener('load', init);
    loadImg();
    isometric.addEventListener("keyup", function(e) {
      switch(e.keyCode) {
        case 37:
          playerY++;
        break;
        case 38:
          playerX--;
        break;
        case 39:
          playerY--;
        break;
        case 40:
          playerX++;
        break;
      }
      drawMap();
    });
  };

  // Add Event Listener to dectect when page has fully loaded.
  isometric.addEventListener('load', init, false);

})(this);
