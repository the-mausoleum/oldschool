'use strict';

var player = '';

lookup();

$.get('../../quest-checker/quests.json', function (data) {
    console.log(data);
});

var done = ['creature-of-fenkenstrain', 'rune-mysteries'];

for (var i in done) {
    $('input[name="' + done[i] + '"]').prop('checked', true);
}

function generateQuestList(quests) {
    var built = '';

    for (var i in quests) {
        built += '<div class="quest">\n\t';
        built += '<input type="checkbox" name="' + quests[i].slug + '">\n\t';
        built += '<span class="name">' + quests[i].name + '</span>',
        built += '\n</div>\n';
    }

    console.log(built)    
}

function lookup() {
    player = $('input[name="player"]').val();

    $.get('http://localhost:3000/stats/' + player, function (data) {
        var skills = ['overall', 'attack', 'defence', 'strength', 'constitution', 'ranged', 'prayer', 'magic', 'cooking', 'woodcutting', 'fletching', 'fishing', 'firemaking', 'crafting', 'smithing', 'mining', 'herblore', 'agility', 'thieving', 'slayer', 'farming', 'runecrafting', 'hunter', 'construction'];

        for (var i in skills) {
            $('.' + skills[i]).html('<span class="level">' + data[skills[i]].level + '</span>');
        }
    });
}