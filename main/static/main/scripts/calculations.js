function simulate(){
	castProperties();
	castWells();
	castLims();

	console.log(properties);
	console.log(wells);
	console.log(lims);

	let data = {
		'rows': modelRows,
		'columns': modelColumns,
		'properties': JSON.stringify(properties),
		'wells': JSON.stringify(wells),
		'lims': JSON.stringify(lims),
		'time': JSON.stringify({
			'dt': 1,
			'step': 5
		})
	}

	$.get('simulation', data, function(data){
		console.log(data);
	})
}

function castLims(){
	for(var name of limsNames)
		lims[name] = parseFloat(lims[name]);
}

function castProperties(){
	for(var property of propertiesNames)
		for(var i = 0; i < modelRows; i++)
			for(var j = 0; j < modelColumns; j++)
				properties[property][i][j] = parseFloat(properties[property][i][j]);
}

function castWells(){
for(var property of wellProperties)
		for(var i = 0; i < modelRows; i++)
			for(var j = 0; j < modelColumns; j++)
				wells[property][i][j] = parseFloat(wells[property][i][j]);
}