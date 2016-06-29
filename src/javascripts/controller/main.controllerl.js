
app.controller('MainController', ['$scope', '$rootScope', '$firebaseArray',
 '$routeParams', 'accessFac', '$location', '$http',
  '$q', 'FourSquareService','CheckValuesService','AuthentificationService','refFac', MainController]);

function MainController($scope, $rootScope, $firebaseArray, $routeParams,
 accessFac, $location, $http, $q, FourSquareService,CheckValuesService,AuthentificationService,refFac) {

    $scope.parseDate = function (x) {
        if (x != null) {
            var date = Date.parse(x);
            var myDate = new Date(date);
            return myDate.getDate() + "." + myDate.getMonth() + "." + myDate.getFullYear() + " at " + myDate.toLocaleTimeString();
            //toTimeString();//toUTCString();//.toLocaleDateString();//toLocaleDateString(); //.toDateString();
        } else {
            return "Not availabe";
        }
    }

    $scope.getAccess = function () {
        accessFac.getPermission();       //call the method in acccessFac to allow the user permission.
    }


    // $scope.getproperty = function (obj, pro) {
    //     return 'irgendwas';
    // }

    // $scope.selectedlocation = undefined;

    $scope.username = accessFac.getuser();

    $scope.params = $routeParams;

    $scope.authData = undefined;

    // Create our Firebase reference
    var ref = new Firebase("https://flickering-inferno-6917.firebaseio.com");

    var user_ref = new Firebase("https://flickering-inferno-6917.firebaseio.com/users");

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

    // $scope.authfacebook = function () {

    //     ref.authWithOAuthPopup("facebook", function (error, authData) {
    //         if (error) {
    //             console.log("Login Failed!", error);
    //         } else {
    //             // the access token will allow us to make Open Graph API calls
    //             console.log(authData.facebook.accessToken);
    //             console.log(authData.facebook.email);
    //             console.log(authData.facebook.user_likes);
    //             console.log(authData.uid);
      
    //             $rootScope.login = getName(authData);
                
    //             $scope.user = {
    //                 "id": authData.uid,
    //                 "name": getName(authData),
    //                 "provider": authData.provider,
    //                 "email": authData.facebook.email
    //             };

    //             //console.log($scope.user);


    //             // $scope.$apply();

    //             ref.child("users").child(authData.uid).set({
    //                 provider: authData.provider,
    //                 name: getName(authData)
    //             });
                
    //             accessFac.access = true;
    //             accessFac.username = $scope.user.name;                          
    //             $scope.$apply(function() {              
    //                 $location.path('/home');
    //             });
               

    //         }
    //     }, {
    //             remember: "sessionOnly",
    //             scope: "email,user_likes" // the permissions requested
    //         });

    // };

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

    // $scope.editEvent = function (item) {

    //     item.title = item.title + "edited" + item.mytext;

    //     delete item.mytext;

    //     item['editmode'] = true;

    //     $scope.events.$save(item).then(function (ref) {
    //         ref.key() === item.$id; // true
    //     });


    // };

     $scope.loginwithpassword =  function (user) {
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
                $scope.$apply(function () {
                    $location.path('/home');
                });
            }
        });
    };

    $scope.events = $firebaseArray(ref.child("events"));

    // $scope.showuser = function () {
    //     console.log("adding event", $scope.useremail, $scope.authData, $scope.user);
    //     console.log("user", accessFac.getuser());
    // };



};


