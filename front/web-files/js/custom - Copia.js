$(document).ready(function(){

  //Json result
  var json_search_return = [];
  //Map HTMO Object
  var map = null;

  //Initialize Map
  function initMapConfig(htmlElement){
    //Set map config
    map = new google.maps.Map(document.getElementById(htmlElement), {
      zoom: 4,
      center: new google.maps.LatLng(0, 0)
    });


    /*map.addListener('zoom_changed', function() {
      alert('Zoom: ' + map.getZoom());
    });*/

    map.addListener('bounds_changed', function() {
      let map_bounds = map.getBounds();

      let result = [];
      //result = buscar pontos passando os bounds para filtro
      $.each(result, function(index, value){
        var point = new google.maps.LatLng(value.lat, value.lon);

        if (map_bounds.contains(point)) {
          console.log("Contem o ponto");
        }
      });

    });

  }



  //Call methods
  getMeasurementProperties();
  getMeasurementParty();

  //Setup form submit
  $('#filter_form').on('submit', function(e) {
      e.preventDefault();  //prevent form from submitting
      var data_form = $("#filter_form").serialize(); //JSON.stringify( $("#filter_form").serializeArray() );
      console.log(data_form);

      $.ajax({
           url : "http://localhost:8080/filter/form", //"http://localhost?search",
           type : 'post',
           data : data_form,
           beforeSend : function(){
             console.log("Searching...");
             initMapConfig("map");
           }
      })
      .done(function(data){
        //Set the returno to variable
        json_search_return = data;

        console.log("RES.:", data);

        drawMarkerPointInMapWithTable(data);
        drawTableWithData(data);
      })
      .fail(function(jqXHR, textStatus, msg){
           alert(msg);
      });



  });

  //Draw points into map with table
  function drawMarkerPointInMapWithTable(data){
    let table_html = ''; //document.createElement("table");
    let table_header = "<tr><td>Data</td><td>Responsável</td><td>Propriedade</td><td>Valor</td></tr>";

    for (const item of data){
      let sample = item.sample;
      let measurement = item.measurement;

      let table_content = '<tr style="border: 1px solid black;"><td>'+sample.date.split("-").reverse().join("/")+'</td><td>'+measurement.party.name+'</td><td>'+measurement.value+'</td><td>'+measurement.unit+'</td>';

      //Create table code
      table_html = "<table style='border: 1px solid black;'>" + table_header + table_content + "</table>";
      //table_html.append(table_header);
      //table_html.append(table_content);

      drawMarkerPointWithTable(sample.locate.lat, sample.locate.long, sample.locate.description, table_html);
    }
  }

  //Draw points into map with table
  function drawMarkerPointInMapWithoutTable(data){
    let table_html = ''; //document.createElement("table");
    let table_header = "<tr><td>Data</td><td>Responsável</td><td>Propriedade</td><td>Valor</td></tr>";

    for (const item of data){
      let sample = item.sample;
      let measurement = item.measurement;

      drawMarkerPointWithoutTable(sample.locate.lat, sample.locate.long);
    }
  }

  //Draw a table with returned data
  function drawTableWithData(data){
    let table_content = "";

    for (const item of data){
      let sample = item.sample;
      let measurement = item.measurement;

      table_content += "<td>"+sample.date.split("-").reverse().join("/")+"</td>";
      table_content += "<td><a onclick='drawMarkerPointWithoutTable("+sample.locate.lat+","+sample.locate.long+")'>Ver no Mapa</a></td>";
      table_content += "<td>"+measurement.party.name+"</td>";
      table_content += "<td>"+measurement.value+"</td>";
      table_content += "<td>"+measurement.unit+"</td>";
    }

    $("#divTableBody").html("<tr>" + table_content + "</tr>");
  }




  /**** API ACCESS FUNCTIONS ****/
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


  //Setup form submit
  $('#export_to_csv').on('click', function(e) {
      JSONToCSVConvertor(json_search_return, "Dados Rio Doce", true);
  });





});
