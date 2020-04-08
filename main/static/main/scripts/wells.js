var wells = {};
var wellProperties = ['type', 'q', 'pwf', 's', 'rw'];

function createWellsMatrix(){
	for(var property of wellProperties){
		let zeroMatrix = new Array();

		for(var i = 0; i < modelRows; i++){
			var zeroArray = new Array();

			for(var j = 0; j < modelColumns; j++){
				switch(property){
					case 'type':
						zeroArray.push(0)
						break;
					case 'q':
						if(i == 1 && j == 0)
							zeroArray.push(0)
						else
							zeroArray.push(0)
						break;
					case 'pwf':
							if(i == 1 && j == 0)
							zeroArray.push(1000)
						else
							zeroArray.push(0)
						break;
						break;
					case 's':
							zeroArray.push(0)
						break;
					case 'rw':
							zeroArray.push(0.25)
						break;
				}
			}

			zeroMatrix.push(zeroArray);
		}

		wells[property] = zeroMatrix;
	}
}

function loadWellProperties(){
	$('.well-property-input').each(function(){
		var property = $(this).attr('id').split('-')[1];

		$(this).val(wells[property][editingCellR][editingCellC]);
	});
}

function saveWellProperties(){
	$('.well-property-input').each(function(){
		var property = $(this).attr('id').split('-')[1];
		var value = parseFloat($(this).val());

		if(!isNaN(value)){
			wells[property][editingCellR][editingCellC] = value;
		}
	});

	console.log(wells);

	//updateModelIcons();

	$('#edit-well-properties').modal('hide');
}

function changeWellControl(property){
	let property2 = 'q'

	if(property == 'q')
		property2 = 'pwf'

	if(!isNaN($('#well-' + property).val()) && $('#well-' + property).val() > 0){
		$('#well-' + property2).val('0');
	}else{
		$('#well-' + property).val('0');
	}
}