app.controller('PasswordController', ['$scope', 'CheckValuesService', 'refFac','$location','accessFac', PasswordController]);

function PasswordController($scope, CheckValuesService, refFac, $location,accessFac) {

    var user_ref = refFac.ref();

    //Password Checks
    $scope.stringmissing = CheckValuesService.stringmissing;

    $scope.tooshort = CheckValuesService.tooshort;

    $scope.toolong = CheckValuesService.toolong;

    $scope.missingnumber = CheckValuesService.missingnumber;

    $scope.nolowercaselatter = CheckValuesService.nolowercaselatter;

    $scope.nouppercaseletter = CheckValuesService.nouppercaseletter;

    $scope.illegalchar = CheckValuesService.illegalchar;

    $scope.passwordsmatch = CheckValuesService.passwordsmatch;





    $scope.createnewuser = function (user) {

        if ($scope.stringmissing(user.password1) == false && $scope.tooshort(user.password1) == false && 
        $scope.toolong(user.password1) == false && $scope.missingnumber(user.password1) == false
            && $scope.nolowercaselatter(user.password1) == false && $scope.nouppercaseletter(user.password1) == false
            && $scope.illegalchar(user.password1) == false && $scope.passwordsmatch(user.password1,user.password2) == false) {
            console.log('creating new user','cond ok');

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
                accessFac.access = true;
                accessFac.username = user.email;
                $scope.$apply(function () {
                    $location.path('/home');
                });
                }
            });

        }


    };
    


}