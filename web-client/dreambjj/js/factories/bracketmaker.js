angular.module('dreambjj').factory('bracketmaker', function() {
    var totalBrackets=0; //id generator
    return function(level) {
        this.id = totalBrackets++;
        this.level = level;
        this.c1 = {id:-1, name: "--", rank:0};
        this.c2 = {id:-1, name: "--", rank:0};
        this.result = 0.0;
        this.disabled = false;
        this.color = '#FFFFFF'
    }
});