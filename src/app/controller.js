app.controller('CalculatorController', ['$scope', function($scope) {

    if (!configuration) {
        throw new Error('algorithm script is not founded. insert it before this script.');
    }
    if (!algorithm) {
        throw new Error('algorithm script is not founded. insert it before this script.');
    }
    
    $scope.config = configuration;

    $scope.algo = algorithm;

    $scope.entry = '0';

    $scope.answer = '0';

    $scope.historys = [];

    $scope.update = function() {
        $scope.entry = $scope.algo.entryVerify($scope.entry);
    };

    $scope.press = function(event) {
        var el = event.target;

        switch (el.className) {
            case 'operation':
                switch (el.textContent) {
                    case 'x':
                        $scope.entry += '*';
                        $scope.update();
                        break;
                    case '÷':
                        $scope.entry += '/';
                        $scope.update();
                        break;
                    default:
                        $scope.entry += el.textContent;
                        $scope.update();
                        break;
                }
                break;
            case 'operator':
                $scope.entry += el.textContent;
                $scope.update();
                break;
            case 'system':
                switch (el.textContent) {
                    case 'AC':
                        $scope.entry = '0';
                        break;
                    case 'Del':
                        $scope.entry = $scope.entry.slice(0, $scope.entry.length - 1);
                        $scope.update();
                        break;
                    case '=':
                        $scope.entry = $scope.algo.getAnsByRPN(
                            $scope.algo.shuntingYard((
                                $scope.algo.entryTransArray(
                                    $scope.entry
                        ))));
                        $scope.update();
                        $scope.answer = $scope.entry;
                        $scope.historys.unshift($scope.entry);
                        break;
                }
                break;
        }
    };

}]);