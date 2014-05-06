var BASE_URL = "http://maystar20140531.cafe24.com/html/maystar/api/api.php"

var userArray;

function tableTemplate(name, address, mobilePhone, phone, email, receipt, reservationTime, seat) {
	var template;
	template =	'<tr>' +
				'	<th>' + reservationTime		+ '</th>' +
				'	<th>' + seat				+ '</th>' +
				'	<th>' + name				+ '</th>' +
				'	<th>' + address				+ '</th>' +
				'	<th>' + mobilePhone			+ '</th>' +
				'	<th>' + phone				+ '</th>' +
				'	<th>' + email				+ '</th>' +
				'	<th>' + receipt				+ '</th>' +
				'</tr>';
	return template;
}

function requestAPI(params) {
	$.post(BASE_URL, params.parameter, params.success);
}

function refreshTable() {
	var contents = '<tr>' +
				'	<th>예약시간</th>' +
				'	<th>좌석</th>' +
				'	<th>이름</th>' +
				'	<th>주소</th>' +
				'	<th>휴대폰</th>' +
				'	<th>자택</th>' +
				'	<th>이메일</th>' +
				'	<th>기부금 영수증 발행 여부</th>' +
				'</tr>';

	for (var i = 0; i < userArray.length; i++) {
		var u, seat, receipt;

		u = userArray[i];
		seat = ' ';
		$.each(u.seat, function(grade, obj) {
			if (grade == 'VIP') {
				$.each(obj, function(area, seatNumbers) {
					seat = '[' + grade + '>' + area + '(' + seatNumbers.join(',') + ')] - ' + seatNumbers.length + '매';
				});
			} else {
				$.each(obj, function(area, num) {
					seat = '[' + grade + '>' + area + '] - ' + num + '매';
				});
			}
		});

		if (u.receipt == '1') {
			receipt = 'O';
		} else {
			receipt = 'X';
		}
		contents += tableTemplate(u.name, u.address, u.mobilePhone, u.phone, u.email, receipt, u.reservationTime, seat);
	};
	$('#user_table').html(contents);
}

function loadData(searchText) {
	if (searchText) {
		requestAPI({
			parameter: {
				cmd: 'getUser',
				name: searchText
			},
			success: function(data) {
				var jsonData = $.parseJSON(data);
				userArray = jsonData.result.user;
				if (userArray) {
					refreshTable();
				} else {
					$('#user_table').html('\'' + searchText + '\'님은 예약 목록에 존재하지 않습니다.');
				}
			}
		});
	} else {
		requestAPI({
			parameter: {
				cmd: 'getUser'
			},
			success: function(data) {
				var jsonData = $.parseJSON(data);
				userArray = jsonData.result.user;
				refreshTable();
			}
		});
	}
}

function clickSearch(event) {
	var searchText = $('#search_text').val();
	loadData(searchText);
}

function initialize(jQuery) {
	// initialize
	userArray = new Array();

	// add event listener
	$('#search_button').click(clickSearch);

	// load data
	loadData('');
}

$(document).ready(initialize);