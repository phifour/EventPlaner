app.config(['$routeProvider', mainroute]);

function mainroute($routeProvider) {

    $routeProvider.when('/login', {
        templateUrl: 'layouts/login.html',
        controller: 'MainController'
    })

        .when('/home', {
            templateUrl: "layouts/home.html",
            controller: 'MainController',
            resolve: {
                "check": ['accessFac', '$location', function (accessFac, $location) {
                    if (accessFac.checkPermission()) {    //check if the user has permission -- This happens before the page loads
                        console.log("rooting to home");
                    } else {
                        $location.path('/login');                //redirect user to home if it does not have permission.
                        alert("You don't have access here");
                    }
                }]
            }
        })

        .when('/register', {
            templateUrl: "layouts/register.html",
            controller: 'MainController'
        })

        .when('/addevent', {
            templateUrl: "layouts/addevent.html",
            controller: 'MainController'
        })

        .when('/eventdetails/:eventID', {
            templateUrl: 'layouts/eventdetails.html',
            controller: 'MainController'
        })

        .otherwise({
            redirectTo: '/login'
        });
};
