app.service('CheckValuesService', [CheckValuesService]);

function CheckValuesService() {
    
   this.checkdateorder = function (startdate, enddate) {
        if (startdate > enddate) {
            return true;
        } else {
            return false;
        }
    }

    var minlength = 8;
    var maxlength = 100;

    //Password Checks

    this.stringmissing = function (x) {
        if (x == undefined) {
            return true;
        } else {
            return false;
        }
    }

    this.tooshort = function (x) {
        if (x == undefined) {
            return false;
        } else {
            if (x.length < minlength) { return true; }
            else {
                return false;
            }
        }
    }

    this.toolong = function (x) {
        if (x == undefined) {
            return true;
        } else {
            if (x.length > maxlength) { return true; }
            else {
                return false;
            }
        }
    }


    this.missingnumber = function (x) {
        if (x == undefined) {
            return true;
        } else {
            if (x.match(/\d/g)) { return false; }
            else {
                return true;
            }
        }
    }

    this.nolowercaselatter = function (x) {
        if (x == undefined) {
            return true;
        } else {
            if (x.match(/[a-z]/g)) { return false; }
            else {
                return true;
            }
        }
    }

    this.nouppercaseletter = function (x) {
        if (x == undefined) {
            return true;
        } else {
            if (x.match(/[A-Z]/g)) { return false; }
            else {
                return true;
            }
        }
    }

    this.illegalchar = function (x) {
        if (x == undefined) {
            return true;
        } else {
            if (x.match(/[\!\@\#\$\%\^\&\*]/g)) { return true; }
            else {
                return false;
            }
        }
    }

    this.passwordsmatch = function (x, y) {
        if (x == y) { return false } else { return true; };
    }
    
}