"use strict";

(function () {

	$(window).on('action:topic.loading', function (ev, data) {
		get_comments();
		submit_comment();
	});


	function submit_comment() {

		$("#content").off().on('click', '.comment-submit', function () {

			var data_pid = $(this).closest("li").data('pid');

			var value = $(this).prev().val();
			var showComment = "<li>" + value + "</li>";
			$(this).parent().prev().prev().children().append(showComment);
			$(this).prev().val("");
			// if($(this).closest('.panel').find('li')!=='undefined'){
			// 	add_toggle(data_pid);
			// }

			sendComment(value, data_pid);

		})
	}

	function sendComment(value, pid) {
		$.ajax({
			type: "POST",
			url: "/save/comment",
			data: {com_content: value, pid: pid},
			dataType: "json",
			success: function (result) {
				console.log("---------------------------");
			},
			error: function () {
				alert("error");
			}
		});
	}

	function get_comments() {

		$.ajax({
			type: "POST",
			url: '/posts',
			dataType: 'json',
			success: function (result) {
				var src = $.parseJSON(result);
				get_page_posts(src.posts);
				add_write_comment_event();
			},
			error: function (err) {
				console.log('error');
			}
		});
	}

	function add_write_comment_event() {
		$('#content').on('click', '.comment-write', function () {
			var next = $(this).parent().next();
			if (next.css("display") === 'block') {
				next.css('display', 'none');
			} else {
				next.css('display', 'block');
			}
		});
	};

	function add_writer(data_pid) {
		var writer_div =
			'<div>' +
			'	<button class="comment-write" data-pid="' + data_pid + '">我要说一句</button>' +
			'</div>' +
			'<div class="comment-input-area" data-pid="' + data_pid + '">' +
			'	<input data-pid="' + data_pid + '"/>' +
			'	<button class="comment-submit" data-pid="' + data_pid + '">发表</button>' +
			'</div>';
		return writer_div;
	}

	function get_page_posts(postData) {

		for (var i = 0; i < postData.length; i++) {
			var comment_area = '';
			var data_pid = postData[i].pid;
			if (postData[i].hasOwnProperty("comments")) {

				var comments = postData[i].comments;
				comment_area += add_comment_data(add_comments(comments), data_pid);
				add_toggle(data_pid);
			} else {
				comment_area += add_comment_data('', data_pid);
			}
			comment_area += add_writer(data_pid);
			$('[data-pid=' + data_pid + ']').find('.post-footer').after(comment_area);
		}
		flip_toggle();
	}

	function add_comment_data(data, data_pid) {

		var comment_area =
			'<div class="panel" data-pid="' + data_pid + '">' +
			'	<ul class="comments_ul" data-pid="' + data_pid + '">' +
			data +
			'	</ul>' +
			'</div>';
		return comment_area;
	}

	function add_comments(comments_data) {

		var comment_li = '';
		for (var k = 0; k < comments_data.length; k++) {
			comment_li += '<li >' + comments_data[k].com_content + '</li>';
		}
		return comment_li;
	}

	function add_toggle(data_pid) {

		var comment_flip =
			'<a class="flip">' +
			'	<i>收起</i>' +
			'	<i style="display:none;">展开</i>' +
			'</a>';
		$('[data-pid=' + data_pid + ']')
			.find('.post-tools').after(comment_flip);
	}


	function flip_toggle() {

		$('.flip').click(function () {
			console.log("biu");
			var current_panel = $(this).closest('div').next();
			current_panel.slideToggle("normal");
			$(this).children('i').toggle();
			$(this).closest('div').nextAll('.comment-input-area').css('display', 'none');
		});
	}


	$(window).on('popstate', function () {
		alert($('li').length);
		$.ajax({
			type: "post",
			url: '/reply/newpost',
			dataType: 'json',
			success: function (result) {
				var data_pid = $.parseJSON(result);
				setTimeout(function () {
					var comments = add_comment_data('', data_pid) + add_writer(data_pid);
					$('[data-pid=' + data_pid + ']').find('.post-footer').after(comments);
				}, 1000);
			},
			error: function (err) {
				console.log('err');
			}
		});
	})


}());
