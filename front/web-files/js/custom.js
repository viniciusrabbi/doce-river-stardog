$(document).ready(function(){

  //Json result
  var json_search_return;

  /**** MAP CONFIG FUNCTIONS ****/
  //Add listener to map for bounds_changed event
  setTimeout(function(){
    //Verify if global variable is instancied //bounds_changed
    if(map){
      map.addListener('bounds_changed', function() {
        deleteMarkers(function(){

            let map_bounds = map.getBounds();
            var ne = map_bounds.getNorthEast();
            var sw = map_bounds.getSouthWest();

            //console.log("Norte Leste :  lat: ", ne.lat(), "long: " + ne.lng());
            //console.log("Sul Oeste: lat: ", sw.lat(), "long: " + sw.lng());

            let data_form = $("#filter_form").serialize(); //JSON.stringify( $("#filter_form").serializeArray() );
            let data_geolocation = "&lat1="+ne.lat()+"&lat2="+sw.lat()+"&lng1="+ne.lng()+"&lng2="+sw.lng();

            data_form += data_geolocation;

            console.log(data_form);

            //Get data from API
            $.ajax({
                 /*url : "http://localhost?search",
                 type : 'post',
                 data : {},
                 beforeSend : function(){
                   console.log("Searching...");
                 }*/

                 url : "http://localhost:8080/filter/form", //"http://localhost?search",
                 type : 'get',
                 /*headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                 },
                 dataType: 'json',*/
                 data : data_form,
                 beforeSend : function(){
                   console.log("Searching...");
                   //initMapConfig("map");
                 }
            })
            .done(function(data){
              //Set the returno to variable
              json_search_return = JSON.parse(data);

              if(json_search_return){
                let data_to_draw = [];
                $.each(json_search_return, function(index, value){

                  let lat = value.locate.lat;
                  let long = value.locate.long;

                  //Instance LatLng Object
                  var point = new google.maps.LatLng(lat, long);

                  if (map_bounds.contains(point)) {
                    var array_with_data = [];
                    array_with_data.push(value);
                    drawMarkerPointInMapWithTable(array_with_data, false);
                    data_to_draw.push(value);
                  }
                });

                //Draw the table
                drawTableWithData(data_to_draw);
              }

            })
            .fail(function(jqXHR, textStatus, msg){
                 alert(msg);
            });

            showMarkers();

        });

      });

      /*map.addListener('zoom_changed', function() {
        alert('Zoom: ' + map.getZoom());
      });*/
    }else{
      alert("Error. Please, reload the page.");
    }
  }, 1500);



  //Call methods to load data from webservice
  getMeasurementProperties();
  getMeasurementParty();

  /**** GENERAL FUNCTIONS ****/
  //Setup form submit
  $('#show_hide_second_date').on('click', function(e) {
    $("#secondDateDiv").toggle(500);
  });

  //Change to map
  $('#view_map').on('click', function(e) {
    $('#view_table').removeClass("active");
    $('#view_map').addClass("active");

    //
    $("#divTable").hide();
    $("#map").show(500);
  });

  //Change to map
  $('#view_table').on('click', function(e) {
    $('#view_table').addClass("active");
    $('#view_map').removeClass("active");

    //
    $("#map").hide();
    $("#divTable").show(500);
  });

  //Export results to CSV
  $('#export_to_csv').on('click', function(e) {
    if(json_search_return){
      JSONToCSVConvertor(transformJSONObjectMultiLayer(json_search_return), "Dados Rio Doce", true);
    }else{
      alert("Antes de exportar os dados, é necessário efetuar pelo menos uma busca.");
    }
  });


  //Export results to OWL
  $('#export_to_owl').on('click', function(e) {
        //Get data from API
      	$.ajax({
      		 url : "http://localhost:5820/RioDoceTest/export",
      		 type : 'get',
      		 headers: {
      			'Authorization': 'Basic YWRtaW46YWRtaW4=',
      			'Accept': 'application/rdf+xml',
      			'Content-Type': 'application/rdf+xml'
      		 },
      		 beforeSend : function(){
      		   console.log("Searching...");
      		 }
      	})
      	.done(function(xmlObject){
      	  alert("O arquivo será baixado em alguns instantes.");
      	  console.log(xmlObject);

          var filename = "data";
          var string_data = new XMLSerializer().serializeToString(xmlObject.documentElement);
          var blob = new Blob([string_data], {type: "application/rdf+xml"});
          saveAs(blob, filename+".rdf");

      	})
      	.fail(function(jqXHR, textStatus, msg){
      		 alert("ERROR: "+msg);
      	});
    });



  /**** API ACCESS FUNCTIONS ****/
  //Get results by filter options
  $('#filter_form').on('submit', function(e) {
      e.preventDefault();  //prevent form from submitting
      var data_form = $("#filter_form").serialize(); //JSON.stringify( $("#filter_form").serializeArray() );
      console.log(data_form);

      $.ajax({
           url : "http://localhost:8080/filter/form", //"http://localhost?search",
           type : 'get',
           /*headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
           },
           dataType: 'json',*/
           data : data_form,
           beforeSend : function(){
             console.log("Searching...");
             initMapConfig("map");
           }
      })
      .done(function(data){
        //Set the returno to variable
        json_search_return = JSON.parse(data);

        console.log("RES.:", json_search_return);

        drawMarkerPointInMapWithTable(json_search_return);
        drawTableWithData(json_search_return);
      })
      .fail(function(jqXHR, textStatus, msg){
           alert(msg);
      });
  });

  //Get all property of measurement
  function getMeasurementProperties(){
    $.ajax({
         url : "http://localhost:8080/list/property", //"http://localhost?allMeasurementProperties",
         type : 'post',
         data : {},
         beforeSend : function(){
           console.log("Searching measurements properties...");
         }
    })
    .done(function(data){
      let data_r = JSON.parse(data);
      $.each(data_r, function(index, value) {
        let html_code = '<div class="form-check form-check-inline"><input type="checkbox" class="form-check-input" name="'+value+'" id="'+value+'"><label class="form-check-label" for="'+value+'">'+value+'</label></div>';
        $("#measurementProperties").append(html_code);
      });
    })
    .fail(function(jqXHR, textStatus, msg){
         alert(msg);
    });
  }

  //Get all party of measurement
  function getMeasurementParty(){
    $.ajax({
         url : "http://localhost:8080/list/parties",
         type : 'post',
         data : {},
         beforeSend : function(){
           console.log("Searching measurements parties...");
         }
    })
    .done(function(data){
      let arr = JSON.parse(data);
      arr.forEach(function(currentValue, index, value){
        //let decode_value = decodeURIComponent(currentValue);
        let html_code = '<option value="'+currentValue+'">'+currentValue+'</option>';
        $("#measurementPartiesSelect").append(html_code);
      });


    })
    .fail(function(jqXHR, textStatus, msg){
         alert(msg);
    });
  }
  //END SUBMITS


  // content is the data (a string) you'll write to file.
  // filename is a string filename to write to on server side.
  // This function uses iFrame as a buffer, it fills it up with your content
  // and prompts the user to save it out.
  function save_content_to_file(content, filename){
      var dlg = false;
      with(document){
       ir=createElement('iframe');
       ir.id='ifr';
       ir.location='about.blank';
       ir.style.display='none';
       body.appendChild(ir);
        with(getElementById('ifr').contentWindow.document){
             open("text/plain", "replace");
             charset = "utf-8";
             write(content);
             close();
             document.charset = "utf-8";
             dlg = execCommand('SaveAs', false, filename);
         }
         body.removeChild(ir);
       }
      return dlg;
  }

});
