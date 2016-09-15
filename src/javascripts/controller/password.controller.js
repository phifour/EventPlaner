app.controller('PasswordController', ['$scope', 'CheckValuesService', 'refFac','$location','accessFac', PasswordController]);

function PasswordController($scope, CheckValuesService, refFac, $location,accessFac) {

    var user_ref = refFac.user_ref();

    $('#inputName').focus();

    //Password Checks
    $scope.stringmissing = CheckValuesService.stringmissing;

    $scope.tooshort = CheckValuesService.tooshort;

    $scope.toolong = CheckValuesService.toolong;

    $scope.missingnumber = CheckValuesService.missingnumber;

    $scope.nolowercaselatter = CheckValuesService.nolowercaselatter;

    $scope.nouppercaseletter = CheckValuesService.nouppercaseletter;

    $scope.illegalchar = CheckValuesService.illegalchar;

    $scope.passwordsmatch = CheckValuesService.passwordsmatch;
    
    $scope.checkemail = CheckValuesService.checkemail;
    
    $scope.inpast = CheckValuesService.inpast;
    
    $scope.createnewuser = function (user) {
        
        // console.log('click');
        // console.log('$scope.stringmissing(user.password1) == false',$scope.stringmissing(user.password1));
        // console.log('$scope.tooshort(user.password1) == false',$scope.tooshort(user.password1));
        // console.log('$scope.toolong(user.password1) == false',$scope.toolong(user.password1));
        // console.log('$scope.missingnumber(user.password1) == false',$scope.missingnumber(user.password1));
        // console.log('$scope.nolowercaselatter(user.password1) == false',$scope.nolowercaselatter(user.password1));
        // console.log('$scope.nouppercaseletter(user.password1) == false',$scope.nouppercaseletter(user.password1));
        // console.log('$scope.illegalchar(user.password1) == false',$scope.illegalchar(user.password1));
        // console.log('$scope.passwordsmatch(user.password1,user.password2) == false',$scope.passwordsmatch(user.password1,user.password2));
        // console.log('$scope.illegalchar(user.name) == false',$scope.illegalchar(user.name));
        // console.log('$scope.tooshort(user.name) == false',$scope.tooshort(user.name)); 
        

        if ($scope.stringmissing(user.password1) == false && $scope.tooshort(user.password1) == false && 
        $scope.toolong(user.password1) == false && $scope.missingnumber(user.password1) == false
            && $scope.nolowercaselatter(user.password1) == false && $scope.nouppercaseletter(user.password1) == false
            && $scope.illegalchar(user.password1) == false && $scope.passwordsmatch(user.password1,user.password2) == false
            && $scope.illegalchar(user.name) == false && $scope.tooshort(user.name) == false) {
            console.log('creating new user','cond ok',user);

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
                accessFac.username = user.name;                
                //add user
                var tempuser = {name:user.name,email:user.email,id:userData.uid};
                user_ref.push(tempuser);                                
                $scope.$apply(function () {
                    $location.path('/home');
                });
                }
            });

        }


    };
    


}