app.service('AuthentificationService', ['$location',AuthentificationService]);

function AuthentificationService($location) {
    
    var ref = new Firebase("https://flickering-inferno-6917.firebaseio.com");

    var user_ref = new Firebase("https://flickering-inferno-6917.firebaseio.com/users");
    
    this.loginwithpassword =  function (user) {
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
                // $scope.$apply(function () {
                    $location.path('/home');
                // });
            }
        });
    };
    
    
    
    
    
    
    
    
     this.createnewuser = function (user) {

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

    this.authfacebook = function (ref) {

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

                //console.log($scope.user);


                // $scope.$apply();

                ref.child("users").child(authData.uid).set({
                    provider: authData.provider,
                    name: getName(authData)
                });
                
                accessFac.access = true;
                accessFac.username = $scope.user.name;                          
                $scope.$apply(function() {              
                    $location.path('/home');
                });
               

            }
        }, {
                remember: "sessionOnly",
                scope: "email,user_likes" // the permissions requested
            });

    };
    
    
    
    
    
};
    