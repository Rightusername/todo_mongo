var bcrypt = require('bcrypt');

module.exports = function(auth, db) {
    return {
        logout: function(req, res) {
            req.logout();
            res.redirect('/');
        },
        settings: function(req, res) {
            res.status(200).send('Secret place');
        },
        login_get: function(req, res) {
            res.render("login.hbs");
        },
        login_post: function(req, res, next) {
            if (!req.body.username) {
                res.render("login.hbs", {
                    msg: "Enter your username"
                });
                return;
            }
            if (!req.body.password) {
                res.render("login.hbs", {
                    msg: "Enter your password"
                });
                return;
            }
 
		  req.db.users.findOne({name: req.body.username}, function(error, user){
                if (error) return next(error);
                if (!user) {
                    res.render("login.hbs", {
                        msg: "User is not exist"
                    });
                    return;
                }
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    auth(req, res, next);
                } else {
                    res.render("login.hbs", {
                        msg: "Wrong password"
                    });
                }
		  });
        },
        registration_post: function(req, res, next) {
            if (!req.body.username) {
                res.render("registration.hbs", {
                    msg: "Enter your username"
                });
                return;
            }
            if (!req.body.password) {
                res.render("registration.hbs", {
                    msg: "Enter your password"
                });
                return;
            }
            if (req.body.password != req.body.password2) {
                res.render("registration.hbs", {
                    msg: "Wrong password"
                });
                return;
            }
            req.db.users.findOne({
               	name: req.body.username
            }, function(error, user) {
            	if(user != null){
	                res.render("registration.hbs", {
	                    msg: "User already exist"
	                });
	            }else{
		            if (!req.body || !req.body.username) return next(new Error('No data provided.'));
			            bcrypt.hash(req.body.password, 5, function(err, hash) {
			            	req.db.users.save({
				                name: req.body.username,
				                password: hash
				            }, function(error, user) {
				                if (error) return next(error);
				                if (!user) return next(new Error('Failed to save.'));
				                auth(req, res);
			                });
			            });
		            }
            });

        },
        registration_get: function(req, res) {
            res.render("registration.hbs");
        },
        root: function(req, res) {
            req.isAuthenticated() ? res.redirect('/user') : res.redirect('/login');
        },
        strategy: function(username, password, done) {
            db.collection('users').findOne({
               name: username
            }, function(error, user) {
                if (user.name && bcrypt.compareSync(password, user.password)) {
                    return done(null, {
                        username: username
                    });
                }
            });
        }
    }
}