$(document).ready(function(){
	$('.btn-dash-module').click(function(){
		var thisID = $(this).attr('data-id');
		var thisJRID = $(this).attr('data-jrid');
		var thisSessionStr = $(this).attr('data-session'); //Acts against caching, this is not the session ID
		var newLoc = "/assessment/"+thisID+"/"+thisJRID+"/"+thisSessionStr+"/";
		document.location=newLoc;
		return false;
	})
	/* Start Popovers */
	$(function () {
		$('[data-toggle="tooltip"]').tooltip();
	})
	$("[data-toggle=popover]").popover({
		html: true, 
		content: function() {
			return $('#popover-content').html();
		}
	});
	$(window).on('click', function (e) {
		$('[data-toggle="popover"],[data-original-title]').each(function () {
			if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
				((
					$(this).popover('hide').data('bs.popover')||{}
).inState||{}).click = false  // fix for BS 3.3.6
			}
		});
	});
	$(document).on('click', '.btn-cancel', function(){
		$('.btn-logout').trigger('click');
	});
	/* Video play/pause on click */
	$('video').click(function() {
		if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
// Do nothing - this is not need in Safari, and breaks it when enabled - Chrome ref is needed in here also
} else {
	if (this.paused == false) {
		this.pause();
	} else {
		this.play();
	}
}
});
});