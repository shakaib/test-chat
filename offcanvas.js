$(document).ready(function () {
	$('[data-toggle=offcanvas]').click(function () {
		$('.row-offcanvas').toggleClass('active');
		$("#list-buddies").removeClass("circle");
	});
});
