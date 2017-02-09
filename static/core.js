document.addEventListener('DOMContentLoaded', function(event) {
	var screen = document.body;
	//Function to create the table
	var createTable = function() {
		var table = document.createElement('table');

		for(var i=1;i<9;i++) {
			var tr = document.createElement('tr');
			for(var z=1;z<9;z++) {
				var td = document.createElement('td');
				td.id = i.toString()+z;
				tr.appendChild(td);
			}
			table.appendChild(tr);
		}
		screen.appendChild(table);
		return table;
	};
	var table = createTable();

	//Function to create the hero
	var newHero = function(spec) {
		spec = spec || {};
		var imgPath = 'static/img/';
		var img = spec.img || 'hero.png';
		var imgW = spec.imgW || 128;
		var imgH = spec.imgH || 208;
		var width = imgW/4+'px';
		var height = imgH/4+'px';
		var hero = document.createElement('div');
		hero.style.backgroundImage = 'url('+imgPath+img+')';
		hero.id = 'hero';
		hero.style.width = width;
		hero.style.height = height;
		hero.style.margin = '0px auto';

		return hero;
	};

	//Adding the hero to the desired cell
	var zack = newHero();
	var cell;
	/*var cell = document.getElementById('72');
	cell.appendChild(zack);*/

	//Moving the hero
	table.onmousedown = function(e) {
		var t = e.target || e.srcElement;
		if(t.nodeName == 'TD' || t.id == 'hero') {
			if(!cell) {
				t.appendChild(zack);
				cell = t;
			}
			else if(t.id == cell.id || t.id == 'hero') {
				if(!cell.style.backgroundColor) cell.style.backgroundColor = 'blue';
				else if(cell.style.backgroundColor) cell.removeAttribute('style');
			}
			else {
				t.appendChild(zack);
				cell.removeAttribute('style');
				cell = t;
			}
		}
	};

});