$(document).ready(function(){
	$('#check').click(function(){
		var formInfo = $('form').serializeArray();
		console.log(formInfo);
	});

	function clearForm(){
		document.getElementById("jobadd").reset();
	};

	$('#sendJob').click(function(){
		var formInfo = $('form').serializeArray();
		$.ajax({
		  type: "POST",
		  url: '/added',
		  data: formInfo,
		  success: clearForm
		});
	});

	$('#clear').click(function(){
		clearForm();
	});

	$('.remove').click(function(){
		var theId = this.id;
		$.ajax({
			type: "GET",
			url: '/delete',
			data: {"id": theId},
			success: function(){
				$('#' + theId + '').parent().remove();
			}
		});
	});
});