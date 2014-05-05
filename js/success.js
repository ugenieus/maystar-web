
function initialize(jQuery) {
	var GET = {};
	var query = window.location.search.substring(1).split("&");
	for (var i = 0, max = query.length; i < max; i++)
	{
	    if (query[i] === "") // check for trailing & with no param
	        continue;

	    var param = query[i].split("=");
	    GET[decodeURIComponent(param[0])] = decodeURIComponent(param[1] || "");
	}

	$('#name').html('이름: ' + GET['name']);
	$('#address').html('주소: ' + GET['address']);
	$('#mobile_phone').html('연락처: ' + GET['mobile_phone']);
	$('#seat').html('좌석등급: ' + GET['grade'] + ' / ' + GET['num'] + ' 매');
	if (GET['grade'] == 'VIP') {
		$('#cost').html('금액: ' + (200000 * GET['num']) + '원');
	} else if (GET['grade'] == 'R') {
		$('#cost').html('금액: ' + (100000 * GET['num']) + '원');
	} else if (GET['grade'] == 'S') {
		$('#cost').html('금액: ' + (70000 * GET['num']) + '원');
	}
}

$(document).ready(initialize);