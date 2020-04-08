var toolInfoHidden = true;

$(document).ready(function(){
	$('.tool-card .btn-sec').click(displayToolInfo);
	$('#model-homogeneus-properties input').blur(updateHomogeneusProperty);
});

function displayToolInfo(){
	var name = $(this).attr('id').split('-')[1];

		if(toolInfoHidden){
			toolInfoHidden = false;
			$('#tool-info').fadeIn();
		}

		$('.tool-card .btn-sec').removeClass('btn-sec-pressed');
		$(this).addClass('btn-sec-pressed');

		$('.info-panel:not(#info-'+ name +')').animate({
			'height': 'hide'
		}, 1000, function(){
			$('#info-' + name).animate({
				'height': 'show'
			}, 1000)
		});
		
		
		if(name == 'wells')
			editingWells = true;
		else
			editingWells = false;
}

function selectHomogeneity(homogeneity){
	if(homogeneity == '1'){
		$('#heterogeneus-info').animate({
			'height': 'hide'
		}, 500);

		$('#model-homogeneus-properties').animate({
			'height': 'show'
		}, 500, function(){
			initBalloonInputs();
			debugHomogeneusProperties(); //DEBUG
		});
	}else if(homogeneity == '0'){
		$('#model-homogeneus-properties').animate({
			'height': 'hide'
		}, 500);

		$('#heterogeneus-info').animate({
			'height': 'show'
		}, 500);
	}
}

function updateHomogeneusProperty(){
	var property = $(this).attr('id').split('-')[1];
	var value = parseFloat($(this).val());

	for(var i = 0; i < modelRows; i++)
		for(var j = 0; j < modelColumns; j++)
			properties[property][i][j] = value;

	console.log(properties[ property]);
	console.log(properties);
}

//REVISAR
function saveHomogeneusProperties(){
	$('#model-homogeneus-properties input').each(function(){
		var property = $(this).attr('id').split('-')[1];
		var value = parseFloat($(this).val());

		for(var i = 0; i < modelRows; i++)
			for(var j = 0; j < modelColumns; j++)
				properties[property][i][j] = value;
	});

	updateModelColors();
}


//DEBUG
function debugHomogeneusProperties(){
	$('#model-homogeneus-properties input').each(updateHomogeneusProperty);
}
