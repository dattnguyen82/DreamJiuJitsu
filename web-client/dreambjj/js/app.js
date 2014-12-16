angular.module('dreambjj', [])
	.controller('homeController', function($scope, $http, bracketMaker, dataLoader)
	{
        var MatchResultsEnum = {
            SUB2: -1.5,
            WIN2: -1.0,
            DRAW: 0.5,
            WIN1: 1.0,
            SUB1: 1.5
        };

        $scope.formData = {};

        maxBracket = 8192;

        $scope.tournamentSize = 0;
        $scope.brackets = [[]];

        $scope.competitors = null;
        $scope.currentMatchIndex = 0;

        $scope.totalBrackets = 0;

        var load_brackets = function()
        {
            var p = dataLoader.getData();
            p.then(function(result)
            {
                $scope.competitors = result.competitors;

                var competitorCount = Math.ceil($scope.competitors.length / 2);

                calculate_bracket_size(competitorCount)

                for (var i=0; i< $scope.tournamentSize; i++) {
                    $scope.brackets[0][i] = new bracketMaker(0)
                }

                //fill brackets
                var remainder = 0
                for (var i=0; i<$scope.tournamentSize; i++)
                {
                    $scope.brackets[0][i].c1.name = $scope.competitors[i].name;
                    $scope.brackets[0][i].c1.rank = $scope.competitors[i].rank;
                    $scope.brackets[0][i].c1.id   = $scope.competitors[i].id;
                    remainder = i+1;
                }

                for (var j=0; j<$scope.tournamentSize; j++)
                {
                    $scope.brackets[0][j].c2.name = $scope.competitors[remainder].name;
                    $scope.brackets[0][j].c2.rank = $scope.competitors[remainder].rank;
                    $scope.brackets[0][j].c2.id   = $scope.competitors[remainder].id;

                    remainder++;

                    if (remainder >= $scope.competitors.length)
                    {
                        break;
                    }
                }

            });
        }

        var calculate_bracket_size = function(count)
        {
            counter = maxBracket
            while ((counter | count) != count)
            {
                counter = counter >> 1
            }

            $scope.tournamentSize = (count > counter) ? counter << 1 : count
            //console.log("bracket size: " + $scope.tournamentSize)
        }

        var calculate_expected_win = function(a, b)
        {
            return 1.0 / (1 + Math.pow(10, ((a - b) / 400.0)))
        }

        var calculate_elo = function(rank, factor, weight, expected)
        {
            return Math.ceil( rank + factor * (weight - expected) )
        }

        var calculate_rank = function(level, rank1, rank2, result)
        {
            console.log(level + "," + rank1 + "," + rank2 + "," + result);

            ew1 = calculate_expected_win(rank2, rank1)
            ew2 = calculate_expected_win(rank1, rank2)
            weight1 = 0
            weight2 = 0

            if (result == MatchResultsEnum.DRAW)
            {
                weight1 = weight2 = result
            }
            else if (result < MatchResultsEnum.DRAW)
            {
                weight2 = result * -1.0
            }
            else if (result > MatchResultsEnum.DRAW)
            {
                weight1 = result
            }

            var newRanking = {rank1: 0, rank2: 0}

            newRanking.rank1 = calculate_elo(rank1, level, weight1, ew1)
            newRanking.rank2 = calculate_elo(rank2, level, weight2, ew2)

            return newRanking;
        };

        var update_competitor_ranking = function(id, rank)
        {
            for (var i=0; i<$scope.competitors.length; i++)
            {
                if ($scope.competitors[i].id == id)
                {
                    $scope.competitors[i].rank = rank;
                    break;
                    //console.log( $scope.competitors[i] )
                }
            }
        }

        var get_competitor_by_id = function(id)
        {
            var competitor = null;

            for (var i=0; i<$scope.competitors.length; i++)
            {
                if ($scope.competitors[i].id == id)
                {
                    competitor = $scope.competitors[i];
                    break;
                }
            }

            return competitor
        }

        var find_or_insert_new_bracket = function(currentBracket, winner)
        {
            var bracketFound = false;

            var currentLevel = currentBracket.level
            var newLevel = currentLevel + 1;

            for (var i=0; i<$scope.brackets.length; i++) {
                for (var j = 0; j < $scope.brackets[i].length; j++) {
                    var b = $scope.brackets[i][j];
                    if (b.level == newLevel) {
                        if (b.c2.id == -1) {
                            $scope.brackets[i][j].c2.id = winner.id;
                            $scope.brackets[i][j].c2.name = winner.name;
                            $scope.brackets[i][j].c2.rank = winner.rank;

                            bracketFound = true;
                            break;
                        }
                    }
                }
            }

            if (!bracketFound)
            {
                var bracketSize = 0;

                if ($scope.brackets[newLevel] != null) {
                    bracketSize = $scope.brackets[newLevel].length;
                }

                $scope.brackets[newLevel] = [];
                $scope.brackets[newLevel][bracketSize] = new bracketMaker(newLevel);
                $scope.brackets[newLevel][bracketSize].c1.id = winner.id;
                $scope.brackets[newLevel][bracketSize].c1.name = winner.name;
                $scope.brackets[newLevel][bracketSize].c1.rank = winner.rank;

            }
        }


        $scope.submitMatchResult = function(bracketLevel, bracketIndex)
        {
            factor = (typeof( $scope.formData.matchKFactor ) != 'undefined') ? $scope.formData.matchKFactor : 10;
            //console.log(factor)

            $scope.currentMatchIndex = bracketIndex
            //console.log($scope.currentMatchIndex);

            var bracket = $scope.brackets[bracketLevel][bracketIndex];

            var c1 = get_competitor_by_id(bracket.c1.id);
            var c2 = get_competitor_by_id(bracket.c2.id);

            var c1rank = (c1 != null) ? c1.rank : 0;
            var c2rank = (c2 != null) ? c2.rank : 0;

            var newRanking = calculate_rank(factor, c1rank, c2rank, bracket.result)

            //console.log(newRanking.rank1)
            //console.log(newRanking.rank2)

            if (c1 != null) {
                update_competitor_ranking(c1.id, newRanking.rank1)
            }

            if (c2 != null) {
                update_competitor_ranking(c2.id, newRanking.rank2)
            }

            //temp
            $scope.brackets[bracketLevel][bracketIndex].c1.rank = newRanking.rank1;
            $scope.brackets[bracketLevel][bracketIndex].c2.rank = newRanking.rank2;

            var winner = (bracket.result > 0) ? c1 : c2;

            find_or_insert_new_bracket( bracket, winner );

            $scope.brackets[bracketLevel][bracketIndex].disabled = true;
        };

        $scope.getBracketSize = function()
        {
            count = $scope.formData.count;
            calculate_bracket_size(count)
        }

        $scope.getRange = function(min, max, step)
        {
            step = step || 1;
            var input = [];
            for (var i = min; i <= max; i += step) input.push(i);
            return input;
        };

        $scope.loadBrackets = function()
        {
            load_brackets();
        }
	})
    .directive('matchpair', function() {
        return {
            templateUrl: 'templates/matchpair.html'
        };
    })
    .factory('bracketMaker', function() {
        totalBrackets=0;
        return function(level) {
            this.id = totalBrackets++;
            this.level = level;
            this.c1 = {id:-1, name: "", rank:0};
            this.c2 = {id:-1, name: "", rank:0};
            this.result = 0.0;
            this.disabled = false;
        }
    })
    .factory('dataLoader', function($http){
        var getData = function() {

            return $http.get('data/w_purplebrown.json').then(function(result){
                return result.data;
            });
        };
        return { getData: getData };
    });