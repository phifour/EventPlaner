import './modules'

var app = angular.module('app', ['ngRoute', 'firebase', 'ui.bootstrap']);

app.factory('accessFac', function () {
    var obj = {}
    this.access = false;
    this.username = undefined;
    obj.getPermission = function () {    //set the permission to true
        this.access = true;
    }
    obj.checkPermission = function () {
        return this.access;             //returns the users permission level
    }
    
    obj.getuser = function(){
        return this.username;
    }
    return obj;
});


app.config(['$routeProvider',
    function ($routeProvider) {

        $routeProvider.when('/login', {
            templateUrl: 'layouts/login.html',
            controller: 'DetailsController'
        })

            .when('/home', {
                templateUrl: "layouts/home.html",
                controller: 'DetailsController',
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
                controller: 'DetailsController'
            })

            .when('/addevent', {
                templateUrl: "layouts/addevent.html",
                controller: 'DetailsController'
            })

            .when('/eventdetails/:eventID', {
                templateUrl: 'layouts/eventdetails.html',
                controller: 'DetailsController'
            })

            .otherwise({
                redirectTo: '/login'
            });
    }]);


app.controller('DetailsController', ['$scope', '$rootScope', '$firebaseArray', '$routeParams', 'accessFac', '$location','$q', DetailsController])


function getlocations() {

    var events_ref = new Firebase("https://flickering-inferno-6917.firebaseio.com/events");

    var query = events_ref.orderByChild("title").limitToLast(100);

    var locations = [];

    query.on("child_added", function (messageSnapshot) {
        // This will only be called for the last 100 messages
        var messageData = messageSnapshot.val();
        locations.push(messageData.location);
        console.log("QUERY", messageData.location);
    });
    
    return locations;
}

function DetailsController($scope, $rootScope, $firebaseArray, $routeParams, accessFac, $location,$q) {
    
     

    $scope.parseDate = function (x) {
        if (x != null) {
            var date = Date.parse(x);          
            var myDate = new Date(date);
            return myDate.toLocaleTimeString();
            //toTimeString();//toUTCString();//.toLocaleDateString();//toLocaleDateString(); //.toDateString();
        } else {
            return "Not availabe";
        }
    }


    // $scope.parseTime = function (x) {
    //     if (x != null) {
    //         var date = Date.parse(x);
    //         //date.toString('yyyy-MM-dd'); 
    //          var myDate = new Date(date);          
    //         return myDate.toUTCString();;//Hours() + ':'+myDate.getMinutes();//toLocaleDateString(); //.toDateString();
    //     } else {
    //         return "Not availabe";
    //     }
    // }


    $scope.getAccess = function () {
        accessFac.getPermission();       //call the method in acccessFac to allow the user permission.
    }

   $scope.username = accessFac.getuser();

    $scope.params = $routeParams;

    $scope.authData = undefined;

    $scope.guest = "";
    
    $scope.guestlist = [];
    
	
    // Create our Firebase reference
    var ref = new Firebase("https://flickering-inferno-6917.firebaseio.com");

    //getlocations()

    var user_ref = new Firebase("https://flickering-inferno-6917.firebaseio.com/users");

    //anonymisiert einloggen
    //    ref.authAnonymously(function(error, authData){
    //    if (error) {
    //                    console.log("Login Failed!", error);
    //    }              else {
    //                    console.log("Authenticated successfully with payload:", authData);
    //    }
    //    }); 
    
    // find a suitable name based on the meta info given by each provider
    function getName(authData) {
        switch (authData.provider) {
            case 'password':
                return authData.password.email.replace(/@.*/, '');
            case 'twitter':
                return authData.twitter.displayName;
            case 'facebook':
                return authData.facebook.displayName;
        }
    }

    $scope.stringmissing = function (x) {
        if (x== undefined){
            return true;
        }else{
            return false;
        }
    }

    $scope.toshort = function (x) {
        if (x== undefined){
            return false;
        }else{
        if (x.length < 16) { return true; }
        else {
            return false;
        }
        }
    }
   
   $scope.tolong = function (x) {
        if (x== undefined){
            return true;
        }else{
            if (x.length > 100) { return true; }
        else {
            return false;
        }
        }
    }


   $scope.missingnumber = function (x) {
        if (x== undefined){
            return true;
        }else{
        if (x.match(/\d/g)) {return false; }
        else {
            return true;
        }
        }
    }

   $scope.nolowercaselatter = function (x) {
        if (x== undefined){
            return true;
        }else{
        if (x.match(/[a-z]/g)) { return false; }
        else {
            return true;
        }
        }
    }

   $scope.nouppercaseletter = function (x) {
       if (x == undefined) {
           return true;
       } else {
           if (x.match(/[A-Z]/g)) { return false; }
           else {
               return true;
           }
       }
   }
    
   $scope.illegalchar = function (x) {
       if (x == undefined) {
           return true;
           }else{
       if (x.match(/[\!\@\#\$\%\^\&\*]/g)) { return true; }
       else {
           return false;
       }
       }
   }
    
  $scope.passwordsmatch = function (x,y) {
    if (x==y) {return false}else{return true;};
  }

  $scope.createnewuser = function (user) {
            
        user_ref.createUser({
            email: user.email,
            password: user.password1
        }, function (error, userData) {
            if (error) {
                switch (error.code) {
                    case "EMAIL_TAKEN":
                        console.log("The new user account cannot be created because the email is already in use.");
                        break;
                    case "INVALID_EMAIL":
                        console.log("The specified email is not a valid email.");
                        break;
                    default:
                        console.log("Error creating user:", error);
                }
            } else {
                console.log("Successfully created user account with uid:", userData.uid);
            }
        });

        console.log('user created! where is it ?!?!');
    };

    $scope.authfacebook = function () {

        ref.authWithOAuthPopup("facebook", function (error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                // the access token will allow us to make Open Graph API calls
                console.log(authData.facebook.accessToken);
                console.log(authData.facebook.email);
                console.log(authData.facebook.user_likes);
                console.log(authData.uid);
      
                $rootScope.login = getName(authData);
                
                $scope.user = {
                    "id": authData.uid,
                    "name": getName(authData),
                    "provider": authData.provider,
                    "email": authData.facebook.email
                };

                console.log($scope.user);


                $scope.$apply();

                ref.child("users").child(authData.uid).set({
                    provider: authData.provider,
                    name: getName(authData)
                });


            }
        }, {
                remember: "sessionOnly",
                scope: "email,user_likes" // the permissions requested
            });

    };

    $scope.logout = function () {
        ref.unauth();
        $location.path('/login');
    }

    $scope.removeEvent = function (item) {
        $scope.events.$remove(item).then(function (ref) {
            $scope.events === item.$id; // true
        });
    };

    $scope.checkeditmode = function (item) {
        if (item.editmode == null) {
            return false;
        } else {
            return true;
        }
    };

    $scope.editEvent = function (item) {

        item.title = item.title + "edited" + item.mytext;

        delete item.mytext;

        item['editmode'] = true;

        $scope.events.$save(item).then(function (ref) {
            ref.key() === item.$id; // true
        });


    };

    $scope.loginwithpassword = function (user) {
        ref.authWithPassword({
            "email": user.email,
            "password": user.password
        }, function (error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
                accessFac.access = true;
                accessFac.username = user.email;                          
                $scope.$apply(function() {              
                    $location.path('/home');
                });
            }
        });
    };


// $scope.$watch('user',function(newValue, oldValue) {
// 		if (newValue != oldValue){
// 		  console.log("User changed!!!",$scope.user); 
//           $scope.useremail = $scope.user.email;
//         };
// });

    //  var authClient = new FirebaseSimpleLogin(ref, function(error, user) {
    //   if (error) {
    //     // an error occurred while attempting login
    //     console.log(error);
    //   } else if (user) {
    //     // user authenticated with Firebase
    //     console.log("User ID: " + user.uid + ", Provider: " + user.provider);
    
    //     ref.child('score').child(user.uid).set({
    //         displayName: user.displayName,
    //         provider: user.provider,
    //         provider_id: user.id
    //       });
    
    
    
    //   } else {
    //     // user is logged out
    //   }
    // });

    
    //     authClient.login("facebook");

    $scope.events = $firebaseArray(ref.child("events"));     
            
    $scope.addguest = function (guest) {
        if (guest != undefined) {
            if ($scope.guestlist.indexOf(guest) >= 0) {
                //console.log("guest double entry");
            } else {
                $scope.guestlist.push(guest);
            }
        }
    };
        
        
        
    $scope.removeguest = function (guest) {
        var index = $scope.guestlist.indexOf(guest);
        if (index > -1) {
            $scope.guestlist.splice(index, 1);
        }
    };      
        
    $scope.showuser = function () {
        console.log("adding event", $scope.useremail, $scope.authData, $scope.user);
        console.log("user", accessFac.getuser());
    };
             
    $scope.addEvent = function (event) {

// && event.startdate != undefined && event.enddate != undefined




        if (event.title != undefined && event.type != undefined && event.host != undefined) {

            console.log("adding event");

            event['startdate'] = $scope.startdate.toString();;
            event['enddate'] = $scope.enddate.toString();

            event['user'] =  $scope.username; 
            event['guestlist'] = $scope.guestlist;

            $scope.guestlist = [];

            ref.child("events").push(event);
            //$scope.$apply(function() {
            $location.path('/home');
            //});
        }

    };

};


app.controller('DatepickerDemoCtrl', ['$scope', DatepickerDemoCtrl]);

function DatepickerDemoCtrl($scope) {
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function() {
    $scope.dt = null;
  };

  $scope.options = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  // Disable weekend selection
  function disabled(data) {
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }

  $scope.toggleMin = function() {
    $scope.options.minDate = $scope.options.minDate ? null : new Date();
  };

  $scope.toggleMin();

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date(tomorrow);
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $scope.events = [
    {
      date: tomorrow,
      status: 'full'
    },
    {
      date: afterTomorrow,
      status: 'partially'
    }
  ];

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  }
};

app.controller('TimepickerDemoCtrl', ['$scope', '$log', TimepickerDemoCtrl]);

function TimepickerDemoCtrl($scope, $log) {
  $scope.mytime = new Date();

  $scope.hstep = 1;
  $scope.mstep = 15;

  $scope.options = {
    hstep: [1, 2, 3],
    mstep: [1, 5, 10, 15, 25, 30]
  };

  $scope.ismeridian = false;
  
  $scope.toggleMode = function() {
    $scope.ismeridian = ! $scope.ismeridian;
  };

  $scope.update = function() {
    var d = new Date();
    d.setHours( 14 );
    d.setMinutes( 0 );
    $scope.mytime = d;
  };

  $scope.changed = function () {
    $log.log('Time changed to: ' + $scope.mytime);
  };

  $scope.clear = function() {
    $scope.mytime = null;
  };
};


app.controller("TestCtrl", function ($scope) {

    $scope.result1 = '';
    $scope.options1 = null;
    $scope.details1 = '';



    $scope.result2 = '';
    $scope.options2 = {
        country: 'ca',
        types: '(cities)'
    }; $scope.details2 = '';



    $scope.result3 = '';
    $scope.options3 = {
        country: 'gb',
        types: 'establishment'
    };
    $scope.details3 = '';
});


app.controller('MyCtrl', ['$scope', MyCtrl]);

function MyCtrl($scope, MovieRetriever){

  $scope.movies = getlocations();
  
  $scope.doSomething = function(typedthings){
    console.log("Do something like reload data with this: " + typedthings );
    $scope.newmovies = MovieRetriever.getmovies(typedthings);
    $scope.newmovies.then(function(data){
      $scope.movies = data;
    });
  }

  $scope.doSomethingElse = function(suggestion){
    console.log("Suggestion selected: " + suggestion );
  }

};
