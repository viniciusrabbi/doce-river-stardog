//drawMarkerPointWithTable("-19.540218", "-40.654106", "Colatina P103", "A turbidez da água neste ponto é de 20%.");
//drawMarkerPointWithTable("-19.541310", "-40.677169", "Colatina P103", "A turbidez da água neste ponto é de 20%.");

//drawMarkerPoint("-19.533184", "-40.659077", "Colatina P105", "A turbidez da água neste ponto é de 30%.");
//drawMarkerPoint("-19.508201", "-40.742241", "Colatina P208", "A turbidez da água neste ponto é de 15%.");
//drawMarkerPoint("-19.511793", "-40.574410", "Colatina P308", "A turbidez da água neste ponto é de 50%.");

//Store all marker point
var markers = [];

//Initialize Map
function initMapConfig(htmlElement){
  var latlng = new google.maps.LatLng(-19.942, -43.940);
  var mapOptions = {
      zoom: 8,
      center: latlng
  };

  //Set map config
  map = new google.maps.Map(document.getElementById(htmlElement), mapOptions);
}

//Draw Marker Point With Table
function drawMarkerPointWithTable(latitude, longitude, title, content_popup, fit_to_point = true){
  //Create point
  let point_to_create = new google.maps.LatLng(parseFloat(latitude), parseFloat(longitude));

  //Set popup content
  content_popup_created = createBodyPopUp(title, content_popup);

  //Add the content to popup
  let info_popup = new google.maps.InfoWindow({
    content: content_popup_created
  });

  //Create a marker
  var marker = new google.maps.Marker({
    position: point_to_create,
    map: map,
    title: "Titulo tal"
  });

  //Store Marker
  storeMarker(marker);

  marker.addListener('click', function() {
    info_popup.open(map, marker);
  });


  //############################s

  function createBodyPopUp(title, text_content){
    return '<div id="content">'+
              '<div id="siteNotice">'+
              '</div>'+ returnTitleOfPopUp(title) +
              '<div id="bodyContent">'+text_content+'</div>'+
            '</div>';
  }

  function returnTitleOfPopUp(title){
    return '<h3 id="firstHeading" class="firstHeading">'+title+'</h3>';
  }

  //Fit to point
  if(fit_to_point){
    let zoom = map.getZoom();
    if (zoom < 10) map.setZoom(10);
    map.panTo(point_to_create);
  }
}

//Draw without table
function drawMarkerPointWithoutTable(latitude, longitude){
  initMapConfig("map");

  //Simulate the click in button
  $('#view_map').click();

  //Create point
  let point_to_create = new google.maps.LatLng(parseFloat(latitude), parseFloat(longitude));

  //Create a marker
  var marker = new google.maps.Marker({
    position: point_to_create,
    map: map
  });

  //Store Marker
  storeMarker(marker);

  //Fit to point with delay
  setTimeout(function(){
    let zoom = map.getZoom();
    if (zoom < 10) map.setZoom(10);
    map.panTo(point_to_create);
  }, 600);
}


//Draw points into map with table
function drawMarkerPointInMapWithTable(data, fit_to_point = true){
  let table_html = ''; //document.createElement("table");
  let table_header = "<tr><td>Data</td><td>Responsável</td><td>Propriedade</td><td>Valor</td></tr>";

  for (const item of data){
    let locate = item.locate;

    let table_content = "";
    for (const key of Object.keys(locate.measurements)){
      let measurement = locate.measurements[key];
      //.split("-").reverse().join("/")
      table_content += '<tr style="border: 1px solid black;"><td>'+measurement.sample_date+'</td><td>'+measurement.party.name+'</td><td>'+measurement.measurement_property+'</td><td>'+measurement.value+' '+measurement.unit+'</td>';
    }
    //Create table code
    table_html = "<table style='border: 1px solid black;'>" + table_header + table_content + "</table>";
    //table_html.append(table_header);
    //table_html.append(table_content);

    drawMarkerPointWithTable(locate.lat, locate.long, locate.description, table_html, fit_to_point);
  }
}

//Draw points into map with table
function drawMarkerPointInMapWithoutTable(data){
  let table_html = ''; //document.createElement("table");
  let table_header = "<tr><td>Data</td><td>Responsável</td><td>Propriedade</td><td>Valor</td></tr>";

  for (const item of data){
    let locate = item.locate;

    drawMarkerPointWithoutTable(locate.lat, locate.long);
  }
}

//Draw a table with returned data
function drawTableWithData(data){
  let table_content = "";

  for (const item of data){
    let locate = item.locate;

    for (const key of Object.keys(locate.measurements)){
      let measurement = locate.measurements[key];

      let row_content = "";

      //Se for a primeira linha, mostrar a opção de ver no mapa somente nesta
      if(key == 0){
        row_content += "<td><a onclick='drawMarkerPointWithoutTable("+locate.lat+","+locate.long+")'>Ver no Mapa</a></td>";
      }else{
        row_content += "<td></td>";
      }
      row_content += "<td>"+measurement.sample_date+"</td>";
      row_content += "<td>"+measurement.party.name+"</td>";
      row_content += "<td>"+measurement.value+"</td>";
      row_content += "<td>"+measurement.unit+"</td>";

      table_content += "<tr>" + row_content + "</tr>"
    }

  }

      //locate.measurement.sample_date.split("-").reverse().join("/")

  $("#divTableBody").html(table_content);
}



/**** GENERAL FUNCTIONS ****/

//Store marks on array
function storeMarker(marker){
  markers.push(marker);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers(callback) {
  clearMarkers();
  markers = [];
  callback(true);
}
