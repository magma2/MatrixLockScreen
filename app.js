// set time out
var lockScreenTimeOut = 3000;  // 3 sec.

//define angularJS app
var ntk = angular.module('ntk', []);


ntk.controller('screenWatch', function ($scope,  $document, $interval) {
    var int = null; 
    var callbacks = [];
    var lockComplete = false;

    $scope.isIdle = function () {
        var lock = ($scope.idleTime > 0);
        if (lock) {           
            lockComplete = true;
        }
        return lock;
    };
     angular.element($document).bind('mousemove', function (e) {

        if (!lockComplete) {
            $scope.idleTime = 0;
            $interval.cancel(int);
            startInterval();
            $scope.$apply();
        }
    });

    $scope.signIn = function(){
        // Add event
        
        /// unlock screen
        lockComplete = false;
        $scope.idleTime = 0;
        $interval.cancel(int);
        startInterval();
        $scope.$apply();
    };
    /*
    angular.element($document).bind('dblclick', function (e) {
        lockComplete = false;
        $scope.idleTime = 0;
        $interval.cancel(int);
        startInterval();
        $scope.$apply();
    });
    */

    function startInterval() {
        int = $interval(function () {
            $scope.idleTime += lockScreenTimeOut;
        }, lockScreenTimeOut);
    }
    startInterval();

});

ntk.directive("drawing", function () {
    return {
        restrict: "A",
        link: function (scope, element) {
            var c = element[0];
            var ctx = c.getContext('2d');
            c.height = window.innerHeight;
            c.width = window.innerWidth;

            var matrix = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz01234567890";
            //converting the string into an array of single characters
            matrix = matrix.split("");

            var font_size = 10;
            var columns = c.width / font_size; //number of columns for the rain
            //an array of drops - one per column
            var drops = [];
            //x below is the x coordinate
            //1 = y co-ordinate of the drop(same for every drop initially)
            for (var x = 0; x < columns; x++)
                drops[x] = 1;

            //drawing the characters
            function draw() {
                //Black BG for the canvas
                //translucent BG to show trail
                ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
                ctx.fillRect(0, 0, c.width, c.height);

                //ctx.fillStyle = "#0F0"; //green text
                ctx.fillStyle = "#0151e5",// "#0F0" : green text
                ctx.font = font_size + "px arial";
                //looping over drops
                for (var i = 0; i < drops.length; i++) {
                    //a random chinese character to print
                    var text = matrix[Math.floor(Math.random() * matrix.length)];
                    //x = i*font_size, y = value of drops[i]*font_size
                    ctx.fillText(text, i * font_size, drops[i] * font_size);

                    //sending the drop back to the top randomly after it has crossed the screen
                    //adding a randomness to the reset to make the drops scattered on the Y axis
                    if (drops[i] * font_size > c.height && Math.random() > 0.975)
                        drops[i] = 0;

                    //incrementing Y coordinate
                    drops[i]++;
                }
            }// end function draw

            setInterval(draw, 50);

        }
    };
});
