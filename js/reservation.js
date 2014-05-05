var BASE_URL = "http://maystar20140531.cafe24.com/html/maystar/api/api.php"

var AREA_R = ['A3', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6',]

var num = 0;
var $select_number, $select_grade, $select_area;
var select_number, select_grade, select_area;

function requestAPI(params) {
	$.post(BASE_URL, params.parameter, params.success);
}

function changeNumber(value) {
	var divs = '';

	num = value;

	for (var i = 0; i < value; i++) {
		divs +=	'	<p>' + (i+1) + ' 번째</p>' +
				'	<div class="controls">' +
				'		<select name="grade" num="' + i +'" class="select" placeholder="좌석 등급"></select>' +
				'	</div>' +
				'	<div class="controls">' +
				'		<select name="area" num="' + i +'" class="select" placeholder="구역 및 좌석번호"></select>' +
				'	</div>';
	}
	$('#seat_select').html(divs);
	seatSelectizeSetting();
}

function changeGrade(event) {
	var index, value;

	index = $(this).attr('num');
	value = select_grade[index].getValue();

	select_area[index].disable();
	select_area[index].clearOptions();

	if (value == 'VIP') {
		requestAPI({
			parameter: {
				cmd: 'getVipZone'
			},
			success: function(data) {
				var jsonData = $.parseJSON(data);				
				var seat = jsonData.result.seat;

				$.each(seat, function(label, seatNumbers) {
					$.each(seatNumbers, function(idx, seatNumber) {
						select_area[index].addOption({
							'label': label + ': ' + seatNumber,
							'value': label + ':' + seatNumber
						});
					});
				});
				select_area[index].refreshOptions();
				select_area[index].enable();
			}
		});
	} else {
		requestAPI({
			parameter: {
				cmd: 'getZone'
			},
			success: function(data) {
				var jsonData = $.parseJSON(data);				
				var seat;

				if (value == 'R') {
					seat = jsonData.result.reservation.R;
				} else if (value == 'S') {
					seat = jsonData.result.reservation.S;
				}

				$.each(seat, function(idx, obj) {
					select_area[index].addOption({
						'label': obj.region + '(' + obj.currentNumber + '/' + obj.maxNumber + ')',
						'value': obj.region
					});
				});
				
				select_area[index].refreshOptions();
				select_area[index].enable();
			}
		});
	}
}

function changeArea(event) {

}

function submit(event) {
	var VIPs = {}, Rs = {}, Ss = {};

	for (var i = 0; i < num; i++) {
		var grade = select_grade[i].getValue();
		var area = select_area[i].getValue();

		if (grade == 'VIP') {
			var parts = area.split(':');
			var area = parts[0];
			var seatNum = parts[1];

			if (!VIPs[area]) {
				VIPs[area] = new Array;
			}
			VIPs[area].push(seatNum);
		} else if (grade == 'R') {
			if (!Rs[area]) {
				Rs[area] = 0;
			}
			Rs[area]++;
		} else if (grade == 'S') {
			if (!Ss[area]) {
				Ss[area] = 0;
			}
			Ss[area]++;
		}
	};

	var seat = {
		'VIP': VIPs,
		'R': Rs,
		'S': Ss
	};
	var params = {
		cmd: 'setUser',
		name: $('#name').val(),
		address: $('#address').val(),
		mobile_phone: $('#mobile_phone').val(),
		phone: $('#phone').val(),
		email: $('#email').val(),
		receipt: $('#receipt').is(":checked"),
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

function seatSelectizeSetting() {
	$select_grade = $('select[name=grade]').selectize({
		create: false,
		labelField: 'label',
		valueField: 'value',
		options: [
			{label: 'VIP석 200,000원', value: 'VIP'},
			{label: 'R석 100,000원', value: 'R'},
			{label: 'S석 70,000원', value: 'S'}
		]
	});

	for (var i = 0; i < $select_grade.length; i++) {
		$select_grade[i]
	};

	$select_area = $('select[name=area]').selectize({
		create: false,
		sortField: 'text',
		labelField: 'label',
		valueField: 'value'
	});

	for (var i = 0; i < num; i++) {
		$select_grade.change(changeGrade);
		$select_area.change(changeArea);
		select_grade[i] = $select_grade[i].selectize;
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

	select_grade = new Array();
	select_area = new Array();

	// add event listener
	$('#submit_button').click(submit);
}

$(document).ready(initialize);