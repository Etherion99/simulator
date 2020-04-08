var propertiesNames = ['kx', 'ky', 'por', 'pi', 'vis', 'ct', 'h', 'dx', 'dy'];
var properties = {};
var limsNames = ['l', 'r', 'u', 'd'];
var lims = {};
var editingWells = false;
var modelRows = 0;
var modelColumns = 0;
var editingCellR = -1;
var editingCellC = -1;

$(document).ready(function(){
	initModelViewer(); //DEBUG
})

function initModelViewer(){
	var validationMessage = validateGridData();

	if(validationMessage == ''){
		$('#view-input').animate({
			'height': 'hide'
		}, 100, function(){
			$('#view-model').animate({
				'height': 'show'
			}, 100, function(){
				modelRows = parseInt($('#model-rows').val());
				modelColumns = parseInt($('#model-columns').val());

				createPropertiesJSON();
				saveDimensionsData();

				createWellsMatrix();

				drawCells();

				initCellScripts();

				//initFaultsSystem(); REVISAR FALLAS

				$('#properties-scale').css('background', 'linear-gradient(to top, hsl(0, 100%, 50%), hsl(20, 100%, 50%), hsl(40, 100%, 50%), hsl(60, 100%, 50%), hsl(80, 100%, 50%), hsl(100, 100%, 50%), hsl(120, 100%, 50%), hsl(140, 100%, 50%), hsl(160, 100%, 50%), hsl(180, 100%, 50%), hsl(200, 100%, 50%), hsl(220, 100%, 50%), hsl(240, 100%, 50%))');
			});
		});
	}else{
		alert(validationMessage);
	}
}

function validateGridData(){
	var message = '';

	var rows = parseInt($('#model-rows').val()) || 0;
	var columns = parseInt($('#model-columns').val()) || 0;
	var dx = parseInt($('#model-dx').val()) || 0;
	var dy = parseInt($('#model-dy').val()) || 0;

	if(rows <= 0 || rows > 10){
		message += 'debe indicar un número de filas entre 1 y 10\n';
	}

	if(columns <= 0 || columns > 10){
		message += 'debe indicar un número de columnas entre 1 y 10\n';
	}

	if(dx <= 0){
		message += 'debe indicar un dx positivo\n';
	}

	if(dy <= 0){
		message += 'debe indicar un dy positivo\n';
	}

	return message;
}

function createPropertiesJSON(){
	for(var property of propertiesNames){
		zeroMatrix = new Array();

		for(var i = 0; i < modelRows; i++){
			var zeroArray = new Array();

			for(var j = 0; j < modelColumns; j++){
				//DEBUG
				switch(property){
					case 'kx':
						zeroArray.push(200);
						break;
					case 'ky':
						zeroArray.push(300);
						break;
					case 'por':
						zeroArray.push(0.12);
						break;
					case 'vis':
						zeroArray.push(15);
						break;
					case 'ct':
						zeroArray.push(2e-6);
						break;
					case 'h':
						zeroArray.push(15);
						break;
					case 'pi':
						zeroArray.push(3000);
						break;
					default:
						zeroArray.push(0);
						break;
				}
				
			}

			zeroMatrix.push(zeroArray);
		}

		properties[property] = zeroMatrix;
	}
}

function saveDimensionsData(){
	let delthas = ['dx', 'dy'];

	for(var deltha of delthas)
		for(var i = 0; i < modelRows; i++)
			for(var j = 0; j < modelColumns; j++)
				properties[deltha][i][j] = $('#model-' + deltha).val();
}

function drawCells(){
	$('#model-viewer').html('');

	for(var i = 0; i < modelRows+1; i++){
		var rowElement = $('<div/>', {'class': 'row col-12 d-flex justify-content-center align-items-center p-0 m-0'});

		for(var j = 0; j < modelColumns+1; j++){
			if(i != modelRows && j != modelColumns){
				rowElement.append(
					$('<div/>', {'class': 'col p-0 m-0'}).append(
						$('<div/>', {'class': 'cell m-2 d-flex justify-content-center align-items-center', 'id': 'cell-' + i + '-' + j})
					)
				);
			}else{
				var delthaInputHint = 'dx';
				var delthaInputClass = 'deltha-c';
				var delthaInputId = delthaInputClass + '-' + j;
				var marginInputClass = 'my-3';
				var delthaType = 'c';

				if(j == modelColumns){
					delthaInputHint = 'dy';
					delthaInputClass = 'deltha-r'
					delthaInputId = delthaInputClass + '-' + i;
					marginInputClass = 'mx-3';
					delthaType = 'r';
				}

				if(i != modelRows || j != modelColumns)
					rowElement.append(
						$('<div/>', {'class': 'col p-0 m-0'}).append(
							$('<div/>', {'class': 'p-0 m-2 d-flex justify-content-center'}).append(
								$('<input/>', {
									'class': 'form-control text-center ' + delthaInputClass + ' ' + marginInputClass,
									'placeholder': delthaInputHint,
									'id': delthaInputId,
									'onblur': 'setDelthas(\'' + delthaType + '\', ' + i + ')'
								})
							)
						)
					);
				else{
					rowElement.append(
						$('<div/>', {'class': 'col p-0 m-0'}).append(
							$('<div/>', {'class': 'p-0 m-2 d-flex justify-content-center'}).append(
								$('<input/>', {'class': 'form-control col-10 d-none'})
							)
						)
					);
				}			
			}			
		}

		$('#model-viewer').append(rowElement);
	}

	$('.deltha-r').val($('#model-dy').val());
	$('.deltha-c').val($('#model-dx').val());
}

function initCellScripts(){
	$('.cell').css('height', $('.cell').width() + 'px');

	$('.cell').click(function(){
		var id = $(this).attr('id').split('-');

		editingCellR = id[1];
		editingCellC = id[2];

		console.log(editingWells);

		if(editingWells){
			$('#edit-well-properties').modal('show');
			loadWellProperties();
		}else{
			if($('#model-homogeneity').val() == '0'){
				$('#edit-cell-properties .modal-title').html('Editar propiedades celda(' + id[1] + '-' + id[2] + ')');
				loadCellProperties();
				$('#edit-cell-properties').modal('show');
			}
		}
	});
}

function loadCellProperties(){
	$('.property-input').each(function(){
		var property = $(this).attr('id').split('-')[1];

		$(this).val(properties[property][editingCellR][editingCellC]);
	});
}

function saveCellProperties(){
	$('.property-input').each(function(){
		var property = $(this).attr('id').split('-')[1];
		var value = parseFloat($(this).val());

		if(!isNaN(value)){
			properties[property][editingCellR][editingCellC] = value;
		}
	});

	console.log(properties);

	updateModelColors();

	$('#edit-cell-properties').modal('hide');
}

function updateModelColors(){

}

function setDelthas(type, index){
	for(var i = 0; i < modelRows; i++)
		for(var j = 0; j < modelColumns; j++){
			switch(type){
				case 'c':
					if(j == index)
						properties['dx'][i][j] = $('#deltha-c-' + index).val();
					break;
				case 'r':
					if(i == index)
						properties['dy'][i][j] = $('#deltha-r-' + index).val();
					break;
			}
		}

	console.log(properties);
}