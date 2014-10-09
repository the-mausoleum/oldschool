'use strict';

var express = require('express');
var parser = require('body-parser');
var http = require('http');

var app = express();

app.use(parser.urlencoded({
    extended: true
}));
app.use(parser.json());

var port = process.env.PORT || 3000;

var router = express.Router();

router.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE');

    console.log(req.method + ' ' + req.url);

    next();
});

var hiscoresUrl = 'http://services.runescape.com/m=hiscore_oldschool/index_lite.ws?player=';

router.route('/stats/:username').get(function (req, res) {
    getStats(req.params.username, function (data) {
        if (data.length === 0) {
            return res.status(404).json({
                message: 'Player not found.'
            });
        }

        var skills = ['overall', 'attack', 'defence', 'strength', 'constitution', 'ranged', 'prayer', 'magic', 'cooking', 'woodcutting', 'fletching', 'fishing', 'firemaking', 'crafting', 'smithing', 'mining', 'herblore', 'agility', 'thieving', 'slayer', 'farming', 'runecrafting', 'hunter', 'construction'];

        var raw = data.join().split('\n');
        var stats = {};

        for (var i in skills) {
            var row = raw[i].split(',');

            stats[skills[i]] = {
                rank: row[0],
                level: row[1],
                xp: row[2]
            };
        }

        return res.status(200).json(stats);
    });

    function getStats(username, callback) {
        http.get(hiscoresUrl + username, function (res) {
            var data = [];

            res.on('data', function (chunk) {
                data.push(chunk);
            });

            res.on('end', function () {
                if (res.statusCode === 404) {
                    data = [];
                }

                callback(data);
            });
        }).end();
    }
});

function extractStats(raw) {
    var stats = {};

    var skills = ['overall', 'attack', 'defence', 'strength', 'constitution', 'ranged', 'prayer', 'magic', 'cooking', 'woodcutting', 'fletching', 'fishing', 'firemaking', 'crafting', 'smithing', 'mining', 'herblore', 'agility', 'thieving', 'slayer', 'farming', 'runecrafting', 'hunter', 'construction'];

    for (var i in skills) {
        var row = raw[i].split(',');

        stats[skills[i]] = {
            rank: row[0],
            level: row[1],
            xp: row[2]
        };
    }

    return stats;
}

app.use('/', router);

app.listen(port);
console.log('Running on localhost:' + port);