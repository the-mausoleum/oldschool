'use strict';

$.get('http://localhost:3000/stats/Max+Deviant', function (data) {
    var skills = ['overall', 'attack', 'defence', 'strength', 'constitution', 'ranged', 'prayer', 'magic', 'cooking', 'woodcutting', 'fletching', 'fishing', 'firemaking', 'crafting', 'smithing', 'mining', 'herblore', 'agility', 'thieving', 'slayer', 'farming', 'runecrafting', 'hunter', 'construction'];

    for (var i in skills) {
        $('.' + skills[i]).html(data[skills[i]].level);
    }
});

$.get('../../quest-checker/quests.json', function (data) {
    console.log(data);
});