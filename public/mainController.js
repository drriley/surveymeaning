
myapp.controller("mainController", mainController);


function mainController($scope, $http, $window,$location,qa) {
    $scope.formData = {};
    $scope.csv = {};
    $scope.csv.header = true
    $scope.csv.separator = ","
    $scope.csv.result = []
     $scope.selectedIndex = null;


    $scope.showContent = function($fileContent){

    $scope.content = $fileContent;
    var line =   $scope.content
    var txt = line.replace(/(,\s)/g, ' ')
    newTxt = CSVToArray(txt)


     function CSVToArray (CSV_string, delimiter) {
         delimiter = (delimiter || ","); // user-supplied delimeter or default comma

         var pattern = new RegExp( // regular expression to parse the CSV values.
           ( // Delimiters:
             "(\\" + delimiter + "|\\r?\\n|\\r|^)" +
             // Quoted fields.
             "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
             // Standard fields.
             "([^\"\\" + delimiter + "\\r\\n]*))"
           ), "gi"
         );

         var rows = [[]];  // array to hold our data. First row is column headers.
         // array to hold our individual pattern matching groups:
         var matches = false; // false if we don't find any matches
         // Loop until we no longer find a regular expression match
         while (matches = pattern.exec( CSV_string )) {
             var matched_delimiter = matches[1]; // Get the matched delimiter
             // Check if the delimiter has a length (and is not the start of string)
             // and if it matches field delimiter. If not, it is a row delimiter.
             if (matched_delimiter.length && matched_delimiter !== delimiter) {
               // Since this is a new row of data, add an empty row to the array.
               rows.push( [] );
             }
             var matched_value;
             // Once we have eliminated the delimiter, check to see
             // what kind of value was captured (quoted or unquoted):
             if (matches[2]) { // found quoted value. unescape any double quotes.
              matched_value = matches[2].replace(
                new RegExp( "\"\"", "g" ), "\""
              );
             } else { // found a non-quoted value
               matched_value = matches[3];
             }
             // Now that we have our value string, let's add
             // it to the data array.
             rows[rows.length - 1].push(matched_value);
         }
         return rows; // Return the parsed data Array
      }


     $scope.questions = newTxt[0]
     qa.set(newTxt)
     $scope.surveyData = qa.get()
     //console.log( $scope.surveyData )
     $scope.surveyData
     $scope.dataOrg = qa.org($scope.surveyData)
     console.log($scope.dataOrg)
   };



    $scope.local = function (){
      console.log("here")
      $http.get('public/SWT.csv').success(function(data) {
      $scope.data = data;
      console.log(data)
 });
    }

    $scope.answerDetail = function(q,index){
      $scope.readquestion= q.question
      $scope.answerlist = q.answers
      $scope.answerdetails = []
      $scope.sentipack = {"Positive":[],"Neutral":[],"Negative":[]}

      $http.post('/sentiFrame', q )
                       .success(function(data) {

                         console.log(data)
                         for(x=0; x<data.length;x++){
                           console.log(data[x].senti)
                          $scope.sentipack[data[x].senti].push(data[x])
                         }
                         console.log(  $scope.sentipack)

                       })
                       .error(function(data) {
                           console.log('Error: ' + data);
                       });

         if ($scope.selectedIndex === null) {
             $scope.selectedIndex = q.question;
           }
           else if ($scope.selectedIndex === q.question) {
             $scope.selectedIndex = null;
           }
           else {
             $scope.selectedIndex = q.question;
           }



    }

    $scope.classkey = function(key){
      if(key == 'Positive'){
        return 'md-primary'
      }else if (key == 'Neutral'){
        return 'md-accent'
      }else {
        return 'md-warn'
      }


    }

    $scope.detailList = function(key){
      $scope.answerdetails = $scope.sentipack[key]
      console.log(  $scope.answerdetails )
    }




}
