var myapp = angular.module('myapp', ['ngRoute','ngMaterial','ngCsvImport']);


myapp.config(['$httpProvider', function($httpProvider) {

        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $httpProvider.defaults.useXDomain = true;




    }]);


    myapp.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('altTheme')
       .primaryPalette('blue',{
      'default': '900'})
       .accentPalette('yellow',{
      'default': '500'})
       // .backgroundPalette('grey',{'default': '900'})

       $mdThemingProvider.theme('buy').primaryPalette('blue',{
       'default': '900'})


    $mdThemingProvider.theme('default').dark();
      //   // .primaryPalette('pink')
      //   .backgroundPalette('red',{
      //     'default': '200'})
      //   .accentPalette('blue');

      $mdThemingProvider.theme('input')

        $mdThemingProvider.setDefaultTheme('altTheme');
        $mdThemingProvider.alwaysWatchTheme(true);
});


myapp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'main.html',
        controller: 'mainController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

  myapp.directive('onReadFile', function ($parse) {
  	return {
  		restrict: 'A',
  		scope: false,
  		link: function(scope, element, attrs) {

              var fn = $parse(attrs.onReadFile);

  			element.on('change', function(onChangeEvent) {
  				var reader = new FileReader();

  				reader.onload = function(onLoadEvent) {
  					scope.$apply(function() {
  						fn(scope, {$fileContent:onLoadEvent.target.result});
  					});
  				};

  				reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
  			});
  		}
  	};
  });


  myapp.factory('qa', function(){
    ct = {};

    return {
        set: function(data){
          //console.log(data)
            temp = {};
            for(x=0; x < data[0].length; x++)
            {

              temp[data[0][x]] = []
              for(y=1; y<data.length; y++){


                temp[data[0][x]].push(data[y][x])
              }

            }
          //  console.log(temp)
            ct=temp
        },
        org: function(d){

          /// finding subjective data
            nonsub = []
            sub = []

            //console.log(d)
            for(ques in d){
              var valuesSoFar = [];
              var dup = false
              var fullanswers = []
              for(x=0;x<d[ques].length;x++){
                if(typeof(d[ques][x])==='string' && d[ques][x].length>0 ){
                  fullanswers.push(d[ques][x])
                  if(valuesSoFar.indexOf(d[ques][x]) === -1){
                      valuesSoFar.push(d[ques][x])
                  }else{
                    dup = true
                  }
                }
              }

              if(dup){

                nonsub.push({question:ques, answers:fullanswers})
              }else{
                sub.push({question:ques, answers:fullanswers})
              }

             }
             //console.log(valuesSoFar)
             console.log(nonsub)
             console.log(sub)
             quesorg = {freetext:sub, selection:nonsub}
             return quesorg
        },
        get: function(){
            return ct;
        }
    }
});
