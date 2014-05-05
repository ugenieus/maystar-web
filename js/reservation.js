var BASE_URL = "http://maystar20140531.cafe24.com/html/maystar/api/api.php"

var AREA_R = ['A3', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6',]

var num = 0;
var $select_number, $select_grade, $select_area;
var select_number, select_grade, select_area;

function requestAPI(params) {
	$.post(BASE_URL, params.parameter, params.success);
}

function changeNumber(value) {
	num = value;
	select_grade.clear();
	select_grade.enable();
}

function changeGrade(value) {
	if (value == 'VIP') {
		var divs = '';
		for (var i = 1; i <= num; i++) {
			divs +=	'	<p>' + i + ' 번째</p>' +
					'	<div class="controls">' +
					'		<select name="area" class="select" placeholder="구역 및 좌석번호"></select>' +
					'	</div>';
		}
		$('#seat_select').html(divs);
		seatSelectizeSetting(num);

		requestAPI({
			parameter: {
				cmd: 'getVipZone'
			},
			success: function(data) {
				var jsonData = $.parseJSON(data);				
				var seat = jsonData.result.seat;
				var options = new Array();

				$.each(seat, function(label, seatNumbers) {
					$.each(seatNumbers, function(idx, seatNumber) {
						options.push({
							'label': label + ': ' + seatNumber,
							'value': label + ':' + seatNumber
						});
					});
				});
				for (var i = 0; i < num; i++) {
					select_area[i].addOption(options);
					select_area[i].refreshOptions();
					select_area[i].enable();
				};
			}
		});
	} else if (value == 'R' || value == 'S') {
		var divs;
		divs =	'	<div class="controls">' +
				'		<select name="area" class="select" placeholder="구역 및 좌석번호"></select>' +
				'	</div>';
		$('#seat_select').html(divs);
		seatSelectizeSetting(1);

		requestAPI({
			parameter: {
				cmd: 'getZone'
			},
			success: function(data) {
				var jsonData = $.parseJSON(data);				
				var seat;
				var options = new Array();

				if (value == 'R') {
					seat = jsonData.result.reservation.R;
				} else if (value == 'S') {
					seat = jsonData.result.reservation.S;
				}

				$.each(seat, function(idx, obj) {
					options.push({
						'label': obj.region + '(' + obj.currentNumber + '/' + obj.maxNumber + ')',
						'value': obj.region
					});
				});

				select_area[0].addOption(options);
				select_area[0].refreshOptions();
				select_area[0].enable();
			}
		});
	} else {
		var divs;
		divs =	'	<div class="controls">' +
				'		<select name="area" class="select" placeholder="구역 및 좌석번호"></select>' +
				'	</div>';
		$('#seat_select').html(divs);
		seatSelectizeSetting(1);
	}
}

function submit(event) {
	var VIPs = {}, Rs = {}, Ss = {};
	var grade = select_grade.getValue();

	if (!num) {
		alert('인원 수를 선택해주세요.');
		return;
	}
	if (!grade) {
		alert('좌석 등급을 선택해주세요.');
		return;
	}
	if (grade == 'VIP') {
		for (var i = 0; i < num; i++) {
			var area = select_area[i].getValue();
			var parts = area.split(':');
			var area = parts[0];
			var seatNum = parts[1];

			if (!area) {
				alert('좌석을 모두 선택해주세요.');
				return;
			}

			if (!VIPs[area]) {
				VIPs[area] = new Array;
			}
			VIPs[area].push(seatNum);
		}
	} else if (grade == 'R') {
		var area = select_area[0].getValue();
		if (!area) {
			alert('구역을 선택해주세요.');
			return;
		}
		Rs[area] = num;
	} else if (grade == 'S') {
		var area = select_area[0].getValue();
		if (!area) {
			alert('구역을 선택해주세요.');
			return;
		}
		Ss[area] = num;
	}

	var name, address, mobile_phone, phone, email, receipt;

	name = $('#name').val();
	address = $('#address').val();
	mobile_phone = $('#mobile_phone').val();
	phone = $('#phone').val();
	email = $('#email').val();
	receipt = $('#receipt').is(":checked");

	if (!name) {
		alert('이름을 입력해주세요.');
		return;
	}
	if (!address) {
		alert('티켓을 수령할 주소를 입력해주세요.');
		return;
	}
	if (!name) {
		alert('휴대폰 번호를 입력해주세요.');
		return;
	}

	var seat = {
		'VIP': VIPs,
		'R': Rs,
		'S': Ss
	};
	var params = {
		cmd: 'setUser',
		name: name,
		address: address,
		mobile_phone: mobile_phone,
		phone: phone,
		email: email,
		receipt: receipt,
		seat: JSON.stringify(seat)
	}

	console.log(params);

	requestAPI({
		parameter: params,
		success: function(data) {
			console.log(data);
		}
	});
}

function seatSelectizeSetting(n) {
	$select_area = $('select[name=area]').selectize({
		create: false,
		sortField: 'text',
		labelField: 'label',
		valueField: 'value'
	});

	for (var i = 0; i < n; i++) {
		select_area[i] = $select_area[i].selectize;
		select_area[i].disable();
	};
}

function initialize(jQuery) {
	// number selectize setting
	$select_number = $('select[name=number]').selectize({
		create: false,
		labelField: 'label',
		valueField: 'value',
		options: [ ],
		onChange: changeNumber
	});
	select_number = $select_number[0].selectize;
	for (var i = 1; i <= 49; i++) {
		select_number.addOption({
			'label': i + ' 명',
			'value': i
		});
	}
	select_number.refreshOptions();

	// grade selectize setting
	$select_grade = $('select[name=grade]').selectize({
		create: false,
		labelField: 'label',
		valueField: 'value',
		options: [
			{label: 'VIP석 200,000원', value: 'VIP'},
			{label: 'R석 100,000원', value: 'R'},
			{label: 'S석 70,000원', value: 'S'}
		],
		onChange: changeGrade
	});
	select_grade = $select_grade[0].selectize;
	select_grade.disable();

	select_area = new Array();

	// add event listener
	$('#submit_button').click(submit);
}

$(document).ready(initialize);