//drawMarkerPointWithTable("-19.540218", "-40.654106", "Colatina P103", "A turbidez da água neste ponto é de 20%.");
//drawMarkerPointWithTable("-19.541310", "-40.677169", "Colatina P103", "A turbidez da água neste ponto é de 20%.");

//drawMarkerPoint("-19.533184", "-40.659077", "Colatina P105", "A turbidez da água neste ponto é de 30%.");
//drawMarkerPoint("-19.508201", "-40.742241", "Colatina P208", "A turbidez da água neste ponto é de 15%.");
//drawMarkerPoint("-19.511793", "-40.574410", "Colatina P308", "A turbidez da água neste ponto é de 50%.");



//$(document).ready(function(){

  var map = null;

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


  /*function drawMarkerPoint(latitude, longitude, title, content_popup){
    //Create point
    let point_to_create = new google.maps.LatLng(parseFloat(latitude), parseFloat(longitude));

    //Set popup content
    content_popup = createBodyPopUp(title, '<p>Este é o ponto do mapa. A água está com 30% de turbidez.</p>');

    //Add the content to popup
    let info_popup = new google.maps.InfoWindow({
      content: content_popup
    });

    //Create a marker
    var marker = new google.maps.Marker({
      position: point_to_create,
      map: map,
      title: "Titulo tal"
    });

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
    let zoom = map.getZoom();
    if (zoom < 10) map.setZoom(10);
    map.panTo(point_to_create);


  }*/


  function drawMarkerPointWithTable(latitude, longitude, title, content_popup){
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

    marker.addListener('click', function() {
      info_popup.open(map, marker);
    });


    //############################s

    function createBodyPopUp(title, text_content){

      /*let content_div = document.createElement("div");
      $(content_div).attr("id", "content");

      let site_notice_div = document.createElement("div");
      $(site_notice_div).attr("id", "siteNotice");
      site_notice_div.append(returnTitleOfPopUp(title));


      let body_popup_content = document.createElement("div");
      $(body_popup_content).attr("id", "bodyContent");
      body_popup_content.append(text_content);


      content_div.append(site_notice_div);
      content_div.append(body_popup_content);

      return content_div.innerHTML;*/

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
    let zoom = map.getZoom();
    if (zoom < 10) map.setZoom(10);
    map.panTo(point_to_create);
  }


  function drawMarkerPointWithoutTable(latitude, longitude){
    initMapConfig("map");

    //Simulate the click in button
    $('#view_map').click();

    //Create point
    let point_to_create = new google.maps.LatLng(parseFloat(latitude), parseFloat(longitude));

    console.log("OLHA O MAPA:",point_to_create);

    //Create a marker
    var marker = new google.maps.Marker({
      position: point_to_create,
      map: map
    });

    //Fit to point with delay
    setTimeout(function(){
      let zoom = map.getZoom();
      if (zoom < 10) map.setZoom(10);
      map.panTo(point_to_create);
    }, 600);


  }


//});
