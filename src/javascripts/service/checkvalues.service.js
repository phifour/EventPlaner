app.service('CheckValuesService', [CheckValuesService]);

function DateAdd(date, type, amount){
    var y = date.getFullYear(),
        m = date.getMonth(),
        d = date.getDate();
    if(type === 'y'){
        y += amount;
    };
    if(type === 'm'){
        m += amount;
    };
    if(type === 'd'){
        d += amount;
    };
    return new Date(y, m, d);
}


function CheckValuesService() {

    this.checkdateorder = function (startdate, enddate) {
        if (startdate != undefined && enddate != undefined){
        if (startdate.getTime() > enddate.getTime()) {
            return true;
        } else {
            return false;
        }
        }else{
            return true; 
        }
    }
    
    this.inpast = function (x) {
 
        if (x == undefined) {
            return true;
        } else if(x instanceof Date == false){
            return true;
        } else {
            var today = new Date();
            // today = DateAdd(today, 'd', -1);
            if (x.getTime() <= today.getTime()) {
                return true;
            } else {
                return false;
            }
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
            if (x.match(/[\!\@\#\$\%\^\&\*\ ]/g)) { return true; }
            else {
                return false;
            }
        }
    }

    this.passwordsmatch = function (x, y) {
        if (x == y) { return false } else { return true; };
    }

    this.checkemail = function (x) {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (x == undefined) {
            return true;
        } else {
            if (x.match(mailformat)) {
                return false;
            }
            else {
                return true;
            }
        }
    }


}