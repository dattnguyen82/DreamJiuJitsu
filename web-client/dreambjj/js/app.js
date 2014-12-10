angular.module('dreambjj', [])
	.controller('homeController', function($scope, $http)
	{
        var MatchResultsEnum = {
            SUB2: -1.5,
            WIN2: -1.0,
            DRAW: 0.5,
            WIN1: 1.0,
            SUB1: 1.5
        };

        $scope.results = 0
        $scope.level = "Brown"

        $scope.rank1 = 0
        $scope.rank2 = 0

        $scope.formData = {};

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
            ew1 = calculate_expected_win(rank2, rank1)
            ew2 = calculate_expected_win(rank1, rank2)

            console.log(ew1)
            console.log(ew2)

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

            console.log(weight1)
            console.log(weight2)

            $scope.rank1 = calculate_elo(rank1, level, weight1, ew1)
            $scope.rank2 = calculate_elo(rank2, level, weight2, ew2)

        };

        $scope.getCalculation = function()
        {
            factor = 15
            calculate_rank(factor, $scope.formData.inputRank1,  $scope.formData.inputRank2,  $scope.formData.matchResult)
        };


	});