/*
 * GET users listing.
 */
exports.list = function(req, res) {
    req.db.tasks.find({username: req.user.username}).toArray(function(error, tasks) {
        console.log(tasks);
        res.render('tasks.hbs', {
            tasks: tasks || [],
            title: 'Todo List'
        }, function(err, html) {
            if (err) throw err;
            res.render('layout.hbs', {
                content: html,
                username: req.user.username
            });
        });
    })
};
exports.add = function(req, res, next) {
    if (!req.body || !req.body.name) return next(new Error('No data provided.'));
    req.db.tasks.save({
        name: req.body.name,
        username: req.user.username,
        createTime: new Date(),
        completed: 0
    }, function(error, task) {
        if (error) return next(error);
        if (!task) return next(new Error('Failed to save.'));
        res.redirect('/user');
    })
};
// exports.markAllCompleted = function(req, res, next) {
//     if (!req.body.all_done || req.body.all_done !== 'true') return next();
//     req.db.tasks.update({
//         completed: false
//     }, {
//         $set: {
//             completeTime: new Date(),
//             completed: true
//         }
//     }, {
//         multi: true
//     }, function(error, count) {
//         if (error) return next(error);
//         console.info('Marked %s task(s) completed.', count);
//         res.redirect('/tasks');
//     })
// };
exports.completeTask = function(req, res, next) {
    console.log(req.body);
    req.db.tasks.updateById(req.body.id, {$set: {completed: req.body.value}});
};
// exports.markCompleted = function(req, res, next) {
//     if (!req.body.completed) return next(new Error('Param is missing.'));
//     var completed = req.body.completed === 'true';
//     req.db.tasks.updateById(req.task._id, {
//         $set: {
//             completeTime: completed ? new Date() : null,
//             completed: completed
//         }
//     }, function(error, count) {
//         if (error) return next(error);
//         if (count !== 1) return next(new Error('Something went wrong.'));
//         console.info('Marked task %s with id=%s completed.', req.task.name, req.task._id);
//         res.redirect('/tasks');
//     })
// };
exports.del = function(req, res, next) {
    console.log(req.body);
    req.db.tasks.removeById(req.body.id, function(error, count) {
        if (error) return next(error);
        if (count !== 1) return next(new Error('Something went wrong.'));
        res.redirect('/user');
    });
};