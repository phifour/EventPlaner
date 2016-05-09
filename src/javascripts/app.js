import './modules'

var app = angular.module('app', ['ngRoute', 'firebase', 'ui.bootstrap','autocomplete']);

app.factory('accessFac', function () {
    var obj = {}
    this.access = false;
    obj.getPermission = function () {    //set the permission to true
        this.access = true;
    }
    obj.checkPermission = function () {
        return this.access;             //returns the users permission level
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
    
    
// function asyncGreet(name) {
//   var deferred = $q.defer();

//   setTimeout(function() {
//     deferred.notify('About to greet ' + name + '.');

//     if (okToGreet(name)) {
//       deferred.resolve('Hello, ' + name + '!');
//     } else {
//       deferred.reject('Greeting ' + name + ' is not allowed.');
//     }
//   }, 1000);

//   return deferred.promise;
// }
    
    
//     var promise = asyncGreet('Robin Hood');
// promise.then(function(greeting) {
//   alert('Success: ' + greeting);
// }, function(reason) {
//   alert('Failed: ' + reason);
// }, function(update) {
//   alert('Got notification: ' + update);
// });  
    
    
    
    

    $scope.parseDate = function (x) {

        if (x != null) {

            var date = Date.parse(x);

            console.log('pasing', date);
            //date.toString('yyyy-MM-dd'); 
             var myDate = new Date(date);
          
            return myDate.getHours();//toLocaleDateString(); //.toDateString();
        } else {
            return "Not availabe";
        }
    }


    $scope.getAccess = function () {
        accessFac.getPermission();       //call the method in acccessFac to allow the user permission.
    }

    $scope.params = $routeParams;

    $scope.authData = undefined;

    $scope.guest = "";
    
    $scope.guestlist = [];

    $scope.selected = undefined;

    $scope.login = 'Two birds killed with one stone!'
    //$scope.login = "No Login";
    
    $scope.login = $rootScope.login;

    $scope.user = undefined;
	
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

    $scope.toshort = function (x) {
        if (x.length < 16) { return true; }
        else {
            return false;
        }
    }
   
   $scope.tolong = function (x) {
        if (x.length > 100) { return true; }
        else {
            return false;
        }
    }


   $scope.missingnumber = function (x) {
        if (x.match(/\d/g)) {return false; }
        else {
            return true;
        }
    }

   $scope.nolowercaselatter = function (x) {
        if (x.match(/[a-z]/g)) { return false; }
        else {
            return true;
        }
    }

   $scope.nouppercaseletter = function (x) {
        if (x.match(/[A-Z]/g)) { return false; }
        else {
            return true;
        }
    }
    
   $scope.illegalchar = function (x) {
       if (x.match(/[\!\@\#\$\%\^\&\*]/g)) { return true; }
       else {
           return false;
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
       
                //$scope.login =  getName(authData);
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
                $scope.authData = authData;
               
                // $scope.apply;
                // $location.path('/home');
                // $scope.$digest();
                $scope.$apply(function() {
                     $scope.user = user;                
                    $location.path('/home');
                });
            }
        });
    };









// is the same as
// 08
// 	var promise = $http.get('/api/v1/movies/avengers');
// 09
	 
// 10
// 	promise.then(
// 11
// 	  function(payload) {
// 12
// 	    $scope.movieContent = payload.data;
// 13
// 	  });

$scope.$watch('user',function(newValue, oldValue) {
		if (newValue != oldValue){
		  console.log("User changed!!!",$scope.user);
          $scope.apply;
        };
});

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

  
  
    // create a synchronized array
    // click on `index.html` above to see it used in the DOM!
  
    $scope.events = $firebaseArray(ref.child("events"));     
        
    // var eventID = $routeParams.eventID;
    // $scope.events_array = $firebaseArray($rootScope.ref);    	 	
    // $scope.eventID = $routeParams.eventID;
    // $scope.events = $rootScope.events; 
    // $scope.x = 	$scope.events_array.$getRecord(eventID);
    
    //console.log('XXXXXXXXXXXXXXXXXXXXXXX',$scope.events);
    
    $scope.addguest = function(guest){
        console.log("adding",guest);
        if($scope.guestlist.indexOf(guest) >= 0){
            console.log("guest double entry");
            BootstrapDialog.alert('I want banana!');
        }else{
             $scope.guestlist.push(guest);  
        }
      //  console.log("guestlist",$scope.guestlist);
    };
        
        
        
    $scope.removeguest = function (guest) {
        console.log("adding", guest);
        var index = $scope.guestlist.indexOf(guest);
        if (index > -1) {
            $scope.guestlist.splice(index, 1);
        }
        //  console.log("guestlist",$scope.guestlist);
    };      
        
        
             
        
    $scope.addEvent = function (event) {
        //var obj = { title: event.title, type: event.type,location: location };
	
        event['starttime'] = $scope.starttime.toString();
        event['endtime'] = $scope.endtime.toString();
        
        event['startdate'] = $scope.startdate.toString();;
        event['enddate'] = $scope.enddate.toString();
       
        event['user'] = "john beaver";//$scope.user.name; 
        event['guestlist'] = $scope.guestlist;
       
        $scope.guestlist = [];
        
        ref.child("events").push(event);
        
        console.log('compare dates',$scope.startdate<$scope.startdate)
        
        //$scope.$apply(function() {
                 $location.path('/home');
         //});
    };

};

app.directive('ngAutocomplete', ['$parse', ngAutocomplete]);


function ngAutocomplete($parse) {
    return {

        scope: {
            details: '=',
            ngAutocomplete: '=',
            options: '='
        },

        link: function (scope, element, attrs, model) {

            //options for autocomplete
            var opts

            //convert options provided to opts
            var initOpts = function () {
                opts = {}
                if (scope.options) {
                    if (scope.options.types) {
                        opts.types = []
                        opts.types.push(scope.options.types)
                    }
                    if (scope.options.bounds) {
                        opts.bounds = scope.options.bounds
                    }
                    if (scope.options.country) {
                        opts.componentRestrictions = {
                            country: scope.options.country
                        }
                    }
                }
            }
            initOpts()

            //create new autocomplete
            //reinitializes on every change of the options provided
            var newAutocomplete = function () {
                scope.gPlace = new google.maps.places.Autocomplete(element[0], opts);
                google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
                    scope.$apply(function () {
                        //              if (scope.details) {
                        scope.details = scope.gPlace.getPlace();
                        //              }
                        scope.ngAutocomplete = element.val();
                    });
                })
            }
            newAutocomplete()

            //watch options provided to directive
            scope.watchOptions = function () {
                return scope.options
            };
            scope.$watch(scope.watchOptions, function () {
                initOpts()
                newAutocomplete()
                element[0].value = '';
                scope.ngAutocomplete = element.val();
            }, true);
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
  
  //['A','AA','B','BBC','BBA','C'];
  
  // MovieRetriever.getmovies("...");
  
  
//   $scope.movies.then(function(data){
//     $scope.movies = data;
//   });

//   $scope.getmovies = function(){
//     return $scope.movies;
//   }

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

// app.factory('MovieRetriever', ['$http', '$q', '$timeout', MovieRetriever]);

// function MovieRetriever($http, $q, $timeout){
//   var MovieRetriever = new Object();

//   MovieRetriever.getmovies = function(i) {
//     var moviedata = $q.defer();
//     var movies;

//     var someMovies = ["The Wolverine", "The Smurfs 2", "The Mortal Instruments: City of Bones", "Drinking Buddies", "All the Boys Love Mandy Lane", "The Act Of Killing", "Red 2", "Jobs", "Getaway", "Red Obsession", "2 Guns", "The World's End", "Planes", "Paranoia", "The To Do List", "Man of Steel"];

//     var moreMovies = ["The Wolverine", "The Smurfs 2", "The Mortal Instruments: City of Bones", "Drinking Buddies", "All the Boys Love Mandy Lane", "The Act Of Killing", "Red 2", "Jobs", "Getaway", "Red Obsession", "2 Guns", "The World's End", "Planes", "Paranoia", "The To Do List", "Man of Steel", "The Way Way Back", "Before Midnight", "Only God Forgives", "I Give It a Year", "The Heat", "Pacific Rim", "Pacific Rim", "Kevin Hart: Let Me Explain", "A Hijacking", "Maniac", "After Earth", "The Purge", "Much Ado About Nothing", "Europa Report", "Stuck in Love", "We Steal Secrets: The Story Of Wikileaks", "The Croods", "This Is the End", "The Frozen Ground", "Turbo", "Blackfish", "Frances Ha", "Prince Avalanche", "The Attack", "Grown Ups 2", "White House Down", "Lovelace", "Girl Most Likely", "Parkland", "Passion", "Monsters University", "R.I.P.D.", "Byzantium", "The Conjuring", "The Internship"]

//     if(i && i.indexOf('T')!=-1)
//       movies=moreMovies;
//     else
//       movies=moreMovies;

//     $timeout(function(){
//       moviedata.resolve(movies);
//     },1000);

//     return moviedata.promise
//   }

//   return MovieRetriever;
// };