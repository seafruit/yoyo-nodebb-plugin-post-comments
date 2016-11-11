var db_post = require('./public/db/db-posts');

(function (module) {
	"use strict";
	var bodyParser = require('body-parser');
	var posts, comments = {};
	var newPostpid;

	comments.init = function (params, callback) {

		var app = params.router;

		app.post('/posts', function (req, res) {
			res.json(JSON.stringify(posts));
		});

		app.post("/save/comment", function (req, res) {
			var pid = req.body.pid;
			var com_id = findCommentId(pid, posts.posts);

			db_post.saveComment(req.body, com_id, function (result) {
				res.status(201).json({value: '保存评论成功！'});
			})
		});

		app.post('/reply/newpost', function (req, res) {
			console.log(newPostpid);
			res.json(JSON.stringify(newPostpid));
		});

		callback();
	};

	function findCommentId(pid, posts) {
		for (var post of posts) {

			if (post.pid == pid) {
				if (!post.hasOwnProperty("comments")) {
					return 0;
				} else {
					return post.comments.length;
				}

			}
		}
	}

	comments.showPosts = function (postsData, callback) {
		posts = postsData;
		callback(null, postsData);
	};

	comments.replyNewPost = function (data, callback) {
		console.log(data);
		newPostpid = data.pid;
		callback(null, data);
	};

	module.exports = comments;
}(module));