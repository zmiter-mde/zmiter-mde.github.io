(function() {

    'use strict';

    angular.module('snakeApp', [])
        .controller('FieldCtrl', function ($scope, $interval) {
            $scope.start = start;
            $scope.stop = stop;
            $scope.startStop = startStop;
            $scope.move = move;
            $scope.changeDirection = changeDirection;

            init();

            function startStop() {
                if ($scope.intervalId == null) {
                    start(true);
                    $scope.startStopText = 'Stop';
                } else {
                    stop(true);
                    $scope.startStopText = 'Start';
                }
            }

            function start(newGame) {
                console.log("Started moving");
                if (newGame)
                    init();
                $scope.intervalId = $interval(move, $scope.interval);
            }

            function stop(gameOver) {
                console.log("Stopped moving");
                $interval.cancel($scope.intervalId);
                $scope.intervalId = null;
                $scope.gameOver = gameOver;
            }

            function move() {
                $scope.direction = $scope.nextDirection;
                switch ($scope.direction) {
                    case 'LEFT':
                        moveLeft();
                        break;
                    case 'UP':
                        moveUp();
                        break;
                    case 'DOWN':
                        moveDown();
                        break;
                    default:
                        moveRight();
                        break;
                }
            }

            function changeDirection($event) {
                console.log($event.charCode);
                switch ($event.charCode) {
                    case 119:
                        if ($scope.direction != 'DOWN')
                            $scope.nextDirection = 'UP';
                        break;
                    case 97:
                        if ($scope.direction != 'RIGHT')
                            $scope.nextDirection = 'LEFT';
                        break;
                    case 115:
                        if ($scope.direction != 'UP')
                            $scope.nextDirection = 'DOWN';
                        break;
                    case 100:
                        if ($scope.direction != 'LEFT')
                            $scope.nextDirection = 'RIGHT';
                        break;
                    case 1099:
                        if ($scope.direction != 'UP')
                            $scope.nextDirection = 'DOWN';
                        break;
                    case 1074:
                        if ($scope.direction != 'LEFT')
                            $scope.nextDirection = 'RIGHT';
                        break;
                    case 1092:
                        if ($scope.direction != 'RIGHT')
                            $scope.nextDirection = 'LEFT';
                        break;
                    case 1094:
                        if ($scope.direction != 'DOWN')
                            $scope.nextDirection = 'UP';
                        break;
                    default:
                        console.log("Wrong key. Use w, a, s, d)");
                        break;
                }
            }

            function moveRight() {
                if ($scope.head.left + 1 == $scope.size.width ||
                    !isFree($scope.field[$scope.head.top][$scope.head.left + 1].val)) {
                    $scope.stop(true);
                    return;
                }
                deleteTail();
                moveHead(3);
            }

            function moveLeft() {
                if ($scope.head.left == 0 ||
                    !isFree($scope.field[$scope.head.top][$scope.head.left - 1].val)) {
                    $scope.stop(true);
                    return;
                }
                deleteTail();
                moveHead(5);
            }

            function moveUp() {
                if ($scope.head.top == 0 ||
                    !isFree($scope.field[$scope.head.top - 1][$scope.head.left].val)) {
                    $scope.stop(true);
                    return;
                }
                deleteTail();
                moveHead(2);
            }

            function moveDown() {
                if ($scope.head.top + 1 == $scope.size.height ||
                    !isFree($scope.field[$scope.head.top + 1][$scope.head.left].val)) {
                    $scope.stop(true);
                    return;
                }
                deleteTail();
                moveHead(4);
            }

            function moveHead(direction) {
                $scope.field[$scope.head.top][$scope.head.left].val = direction;
                switch (direction) {
                    case 2:
                        --$scope.head.top;
                        break;
                    case 3:
                        ++$scope.head.left;
                        break;
                    case 4:
                        ++$scope.head.top;
                        break;
                    case 5:
                        --$scope.head.left;
                        break;
                    default:
                        break;
                }
                $scope.hungry = $scope.field[$scope.head.top][$scope.head.left].val != 7;
                $scope.field[$scope.head.top][$scope.head.left].val = 1;
            }

            function deleteTail() {
                if ($scope.hungry) {
                    var x = $scope.tail.top, y = $scope.tail.left;
                    moveTail(x, y);
                    $scope.field[x][y].val = 0;
                } else {
                    $scope.hungry = true;
                    createMeal();
                    resetSpeed();
                }

            }

            function moveTail(x, y) {
                switch ($scope.field[x][y].val) {
                    case 2:
                        --$scope.tail.top;
                        break;
                    case 3:
                        ++$scope.tail.left;
                        break;
                    case 4:
                        ++$scope.tail.top;
                        break;
                    case 5:
                        --$scope.tail.left;
                        break;
                    default:
                        break;
                }
            }

            function createField(height, width) {
                var field = [];
                for (var i = 0; i < height; ++i) {
                    field[i] = [];
                    for (var j = 0; j < width; ++j)
                        field[i][j] = {val: 0};
                }
                field[0][0].val = 1;
                return field;
            }

            function createMeal() {
                var x = 0, y = 0;
                do {
                    x = Math.trunc(Math.random() * $scope.size.height);
                    y = Math.trunc(Math.random() * $scope.size.width);
                } while($scope.field[x][y].val > 0);
                $scope.field[x][y].val = 7;
                ++$scope.score;
            }

            function resetSpeed(){
                $scope.stop(false);
                var fieldSize = $scope.size.height * $scope.size.width;
                $scope.interval = $scope.interval - (52 - $scope.score * 2);
                $scope.start(false);
            }

            function isFree(number) {
                return number == 0 || number == 7;
            }

            function init() {
                $scope.hungry = true;
                $scope.direction = 'RIGHT';
                $scope.head = { top: 0, left: 0 };
                $scope.tail = { top: 0, left: 0 };
                $scope.size = {width: 10, height: 20};
                $scope.field = createField($scope.size.height, $scope.size.width);
                $scope.intervalId = null;
                $scope.interval = 650;
                $scope.score = 0;
                $scope.gameOver = false;
                $scope.startStopText = 'Start';

                createMeal();
            }

            function outputField() {
                var str = '';
                for (var i = 0; i < $scope.size.height; ++i) {
                    for (var j = 0; j < $scope.size.width; ++j)
                        str += $scope.field[i][j].val + ' ';
                    console.log(str)
                    str = '';
                }
            }

        });
})();
