var intro = false;

$(document).ready(function(){
	introAnimation();
});

function introAnimation(){
	if(intro){
		$('#title').animate({
			'height': 'show'
		}, 1500, function(){
			$('#logo').animate({
				'height': 'show'
			}, 1000, function(){
				setTimeout(function(){
					$('#title').animate({
						'height': 'hide'
					}, 1500, function(){
						$('#logo').animate({
							'opacity': 0
						}, 1500, function(){
							$('#view-intro').css('display', 'none');
							$('#view-input').animate({'height': 'show'}, 2000, function(){
								initBalloonInputs();
							});
						})
					})	
				}, 2000)
			});
		});
	}else{
		$('#view-intro').css('display', 'none');
		$('#view-input').css('display', 'block');
	}	
}

function initBalloonInputs(){
	$('.balloon-input-container').each(function(){
		let indent = $(this).find('label').width() + 30;

		$(this).find('input').focus(function(){
			$(this).css('text-indent', '0px'); 	
		});

		$(this).find('input').focusout(function(){
			if($(this).val().length == 0)
				$(this).css('text-indent', '0px'); 	
			else
				$(this).css('text-indent', indent); 
		});
	});
}

function calculateGeneralDeltha(delthaOrg, delthaDst){
	var deltha = $('#model-' + delthaDst).val();
	var expression = $('#model-' + delthaOrg).val();

	const regExp = RegExp('^[+*\/\-][0-9]+.?[0-9]*$');

	expression = expression.replace(' ', '');
	if(!isNaN(deltha) && regExp.test(expression)){
		$('#model-' + delthaOrg).val(eval(deltha + expression).toFixed(2));
	}
}