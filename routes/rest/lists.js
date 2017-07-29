'use strict';

const passport = require('../../lib/passport');
const lists = require('../../models/lists');

const router = require('../../lib/router-async').create();


router.postAsync('/lists-table', passport.loggedIn, async (req, res) => {
    return res.json(await lists.listDTAjax(req.context, req.body));
});

router.getAsync('/lists/:listId', passport.loggedIn, async (req, res) => {
    const list = await lists.getById(req.context, req.params.listId);
    list.hash = lists.hash(list);
    return res.json(list);
});

router.postAsync('/lists', passport.loggedIn, passport.csrfProtection, async (req, res) => {
    await lists.create(req.context, req.body);
    return res.json();
});

router.putAsync('/lists/:listId', passport.loggedIn, passport.csrfProtection, async (req, res) => {
    const list = req.body;
    list.id = parseInt(req.params.listId);

    await lists.updateWithConsistencyCheck(req.context, list);
    return res.json();
});

router.deleteAsync('/lists/:listId', passport.loggedIn, passport.csrfProtection, async (req, res) => {
    await lists.remove(req.context, req.params.listId);
    return res.json();
});


module.exports = router;