app.factory('accessFac', [accessFac]);

function accessFac() {
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
};