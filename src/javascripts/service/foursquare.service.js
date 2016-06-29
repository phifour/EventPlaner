app.service('FourSquareService', ['$http', '$q', FourSquareService]);
var imgsize = '100x100';


function FourSquareService($http, $q) {

    // $scope.images = [];       
        
var list_of_promisses = [];      
var list_of_objects = [];      
        
// https://irs1.4sqi.net/img/general/100x100/16086765_bTY3TnX3I6d3pVGGz814R4OIVlSGPERXAjMAMHZ5ALU.jpg        

this.getphotos = function(list_of_ids){
                // console.log("data.respons", data.data.response.venues);
                // $scope.locations = data.response.venues;
                // console.log("$scope.locations", $scope.locations);
                list_of_promisses = [];
                for (var i=0;i<list_of_ids.length;i++){
                   console.log("id",list_of_ids[i].id);
                   var id = list_of_ids[i].id;
                   var photourl = 'https://api.foursquare.com/v2/venues/' + id + '/photos';
                   var api1 = $http({
                        method: 'GET',
                        timeout: 5000000,
                        url: photourl,
                        params: {
                            client_id: 'DATGSLTPSJN2AUSVTGOK12NIGHPOTDD4Z1SEZ0XLPN0DOPBU',
                            client_secret: '1YQUJF4STX2FTU4HMDDA5IFZEJSNSJB35RBTGP3SKKR0M4RL',
                            limit:1,
                            v: 20130815
                        },
                        contentType: 'application/json; charset=utf-8'
                    })
                    list_of_promisses.push(api1);
                }
                return list_of_promisses;
};

this.getvenues = function (foursquarekeyword, fourquarecity) {

       var promise = $http({
            method: 'GET',
            timeout: 5000000,
            url: "https://api.foursquare.com/v2/venues/search?v=20130815&&",
            params: {
                query:foursquarekeyword,
                near:fourquarecity,
                client_id: 'DATGSLTPSJN2AUSVTGOK12NIGHPOTDD4Z1SEZ0XLPN0DOPBU',
                client_secret: '1YQUJF4STX2FTU4HMDDA5IFZEJSNSJB35RBTGP3SKKR0M4RL'
            },
            contentType: 'application/json; charset=utf-8'
        });
            // .then(function (data, status, headers, config) {


            //     console.log('data',data);
                 
            //     return data;
                 
            //     //  return list_of_promisses;
                                
            //     // $q.all(list_of_promisses)
            //     //     .then(function (responsesArray) {
            //     //         console.log('responsesArray',responsesArray);
            //     //         var images = [];
            //     //         for (var i=0;i<responsesArray.length;i++){
            //     //             var image_url = responsesArray[i].data.response.photos.items[0];
            //     //             var name = data.response.venues[i].name;
            //     //            var link = data.response.venues[i].url;
            //     //            var address =  data.response.venues[i].location.address;
            //     //            var img  = {url:image_url.prefix + imgsize + image_url.suffix,name:name,address:address,link:link};
            //     //            img['address'] = address;
            //     //            images.push(img);
            //     //             // console.log(name, imgurl);                           
            //     //         }
            //     //          console.log('images',images);
            //     //     });  
                   
            return promise;
    }
}