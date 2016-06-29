app.controller('PasswordController', ['$scope', 'CheckValuesService', 'refFac', PasswordController]);


function PasswordController($scope, CheckValuesService, refFac) {

    var user_ref = refFac.ref();


    //Password Checks
    $scope.stringmissing = CheckValuesService.stringmissing;

    $scope.toshort = CheckValuesService.toshort;

    $scope.tolong = CheckValuesService.tolong;

    $scope.missingnumber = CheckValuesService.missingnumber;

    $scope.nolowercaselatter = CheckValuesService.nolowercaselatter;

    $scope.nouppercaseletter = CheckValuesService.nouppercaseletter;

    $scope.illegalchar = CheckValuesService.illegalchar;

    $scope.passwordsmatch = CheckValuesService.passwordsmatch;




    $scope.createnewuser = function (user) {

        if ($scope.stringmissing == false && $scope.toshort == false && $scope.tolong == false && $scope.missingnumber == false
            && $scope.nolowercaselatter == false && $scope.nouppercaseletter == false && $scope.illegalchar == false && $scope.passwordsmatch == false) {

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

        }


    };
    


}