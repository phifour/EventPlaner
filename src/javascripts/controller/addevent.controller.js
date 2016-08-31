 
app.controller('AddEventController', ['$scope', 'CheckValuesService','FourSquareService','$q','$location','refFac','accessFac', AddEventController]);

function AddEventController($scope, CheckValuesService, FourSquareService,$q,$location,refFac,accessFac) {  
    
    $scope.username = accessFac.getuser();

    $scope.stringmissing = CheckValuesService.stringmissing;

    //jquerey workaround
    $('#frmEventName').focus();

    // $scope.params = $routeParams;

    $scope.authData = undefined;
    // Create our Firebase reference
    var ref = refFac.ref();
     
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

    $scope.locations = [];

    $scope.selectedlocation = undefined;

    $scope.guest = "";

    $scope.images = [];

    // $scope.guestlist = [];

    $scope.event = {
      title:undefined,
      type:undefined,
      host:undefined,
      location:undefined,
      guestlist:[]
      };


    $scope.addguest = function (guest) {
        console.log($scope.event.guestlist);
        if (guest != undefined) {
            if ($scope.event.guestlist.indexOf(guest) >= 0) {
                //console.log("guest double entry");
            } else {
                $scope.event.guestlist.push(guest);
            }
        }
    };

    $scope.removeguest = function (guest) {
        var index = $scope.event.guestlist.indexOf(guest);
        if (index > -1) {
            $scope.event.guestlist.splice(index, 1);
        }
    };

    $scope.foursquarecities = ['Vienna,AT', 'Berlin,DE', 'Amsterdam,NL'];

    $scope.foursquarecity = 'Vienna,AT';

    $scope.usefoursquareloc = function (name,address) {
        $scope.event.location = name + ", " + address;
        // $scope.apply;
        // console.log('address', $scope.selectedlocation)
    }
    
    var foursquarefcnt = FourSquareService.getvenues;
    
    $scope.foursquare = function(foursquarekeyword,fourquarecity){
        foursquarefcnt(foursquarekeyword,fourquarecity)
        .then(function (data, status, headers, config) {  
                console.log("data.respons", data.data.response.venues);
                var getphotos = FourSquareService.getphotos;
                return {photos:getphotos(data.data.response.venues),data:data};

            ;}).then(function(data){
                
                $q.all(data.photos)
                    .then(function (responsesArray) {
                        console.log('list of promisi2222',data);
                          $scope.images = [];

                        for (var i = 0; i < responsesArray.length; i++) {
                            var image_url = responsesArray[i].data.response.photos.items[0];
                            // console.log('data.data',data.data.data.response);
                            var name = data.data.data.response.venues[i].name;
                            var link = data.data.data.response.venues[i].url;
                            var address = data.data.data.response.venues[i].location.address;

                            try {
                                var img = { url: image_url.prefix + imgsize + image_url.suffix, name: name, address: address, link: link };
                                img['address'] = address;
                                img['name'] = name;
                                $scope.images.push(img);
                            }
                            catch (err) {
                                console.log(name,err.message);
                            }

                        }
                       $scope.apply;                        
                    });   
            });
               
    }
    

        $scope.addEvent = function (event) {

            console.log('adding event');

        if (event.title != undefined && event.type != undefined && event.host != undefined
        && event.location != undefined) {

            console.log("adding event");

            event['startdate'] = $scope.startdate.toString();;
            event['enddate'] = $scope.enddate.toString();

            if ($scope.username == null) $scope.username = 'unknown';

            event['user'] = $scope.username;
            // event['guestlist'] = $scope.guestlist;
            // event['location'] = event.location;
            // console.log('check event',event);

            ref.child("events").push(event);
            
            event.guestlist = [];
            //$scope.$apply(function() {
            $location.path('/home');
            //});
        }
    };
    
    
    //Check Date functions
    $scope.checkdateorder = CheckValuesService.checkdateorder;
    
}