package control;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;

/*import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import domain.Curso;*/
 
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;

import com.complexible.common.rdf.query.resultio.TextTableQueryResultWriter;
import com.complexible.stardog.StardogException;
import com.complexible.stardog.api.Connection;
import com.complexible.stardog.api.ConnectionPool;
import com.complexible.stardog.api.SelectQuery;
import com.complexible.stardog.ext.spring.SnarlTemplate;
import com.complexible.stardog.ext.spring.mapper.SimpleRowMapper;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.stardog.stark.Value;
import com.stardog.stark.query.BindingSet;
import com.stardog.stark.query.QueryResult;
import com.stardog.stark.query.SelectQueryResult;
import com.stardog.stark.query.io.QueryResultWriters;

import domain.Location;
import util.ConnectionFactoryUtil;
import util.JSONStructureFactory;

import com.complexible.stardog.ext.spring.SnarlTemplate;

 
 
@RestController
public class ControladoraRequisicao {
	
  @Autowired
  public SnarlTemplate snarlTemplate;
 
 
  //OK
  @CrossOrigin(origins="null", allowedHeaders="*")
  @RequestMapping(value = "/list/property", method = RequestMethod.POST)
  public String listProperty() {
	JsonArray arrayResponse = new JsonArray();	  

    ConnectionPool connectionPool = ConnectionFactoryUtil.createConnectionPool();  // creates the Stardog connection pool

    try (Connection connection = ConnectionFactoryUtil.getConnection(connectionPool)) { // obtains a Stardog connection from the pool

        try {        	
      	  	String final_query = "PREFIX prd: <http://www.semanticweb.org/ontologies/2019/3/sampling_and_measurement#>\r\n" + 
      	  		"SELECT distinct ?prop \r\n" + 
      	  		"WHERE {\r\n" + 
      	  			"?prop rdf:type prd:Measurable_Property\r\n" + 
      	  		"}";
      	              	

            // Query the database to get our list of Marvel superheroes and print the results to the console
            SelectQuery query = (SelectQuery) connection.select(final_query);
            SelectQueryResult tupleQueryResult = query.execute();
            
            //Get response and convert to JSON
            String element;
            String elementType;
            String[] elementList;

            System.out.println("Query results: ");
            while (tupleQueryResult.hasNext()) {
            	BindingSet result = tupleQueryResult.next();
            	JsonObject eachGoop = new JsonObject();
            	
            	System.out.println("Size: "+ result.size());
            	
        		elementList = result.get("prop").toString().split("#");
        		element = elementList.length > 1 ? element = elementList[1] : elementList[0];
        		int i = element.lastIndexOf("/");
        		element = element.substring(i+1);
                                            
                arrayResponse.add(element);
                                           
                element = "";
                elementType = "";
            }
        } catch (StardogException e) {
            e.printStackTrace();
        } finally {
        	ConnectionFactoryUtil.releaseConnection(connectionPool, connection);
            connectionPool.shutdown();
        }
        return arrayResponse.toString();
    }	  
  }
 
  
  //OK
  @CrossOrigin(origins="null", allowedHeaders="*")
  @RequestMapping(value = "/list/parties", method = RequestMethod.POST)
  public String listParties() {
	JsonArray arrayResponse = new JsonArray();	  

    ConnectionPool connectionPool = ConnectionFactoryUtil.createConnectionPool();  // creates the Stardog connection pool

    try (Connection connection = ConnectionFactoryUtil.getConnection(connectionPool)) { // obtains a Stardog connection from the pool

        try {        	
      	  	String final_query = "PREFIX prd: <http://www.semanticweb.org/ontologies/2019/3/sampling_and_measurement#>\r\n" + 
      	  		"SELECT distinct ?prop \r\n" + 
      	  		"WHERE {\r\n" + 
      	  			"?prop rdf:type prd:Agent_Party\r\n" + 
      	  		"}";
      	              	

            // Query the database to get our list of Marvel superheroes and print the results to the console
            SelectQuery query = (SelectQuery) connection.select(final_query);
            SelectQueryResult tupleQueryResult = query.execute();
            
            //Get response and convert to JSON
            String element;
            String elementType;
            String[] elementList;

            System.out.println("Query results: ");
            while (tupleQueryResult.hasNext()) {
            	BindingSet result = tupleQueryResult.next();
            	JsonObject eachGoop = new JsonObject();
            	
            	System.out.println("Size: "+ result.size());
            	
        		elementList = result.get("prop").toString().split("#");
        		element = elementList.length > 1 ? element = elementList[1] : elementList[0];
        		int i = element.lastIndexOf("/");
        		element = element.substring(i+1);
        		
        		//Decode the URI
        		element = URLDecoder.decode(element, "UTF-8");
                                            
                arrayResponse.add(element);
                                           
                element = "";
                elementType = "";
            }
        } catch (StardogException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
        	ConnectionFactoryUtil.releaseConnection(connectionPool, connection);
            connectionPool.shutdown();
        }
        return arrayResponse.toString();
    }	  
  }
   
  
  @CrossOrigin(origins="null", allowedHeaders="*")
  @RequestMapping(value = "/filter/form", method = RequestMethod.GET)
  public String returnFilteredData(HttpServletRequest request, 
	        @RequestParam(value="Solidos_suspensos_totais", required=false) String property_selected,
	        @RequestParam(value="measurementPartiesSelect", required=false) String party_selected,
	        @RequestParam(value="firstDateInput", required=false) String firstDate,
	        @RequestParam(value="secondDateInput", required=false) String secondDate,
	        @RequestParam(value="lat1", required=false) String lat1,
	        @RequestParam(value="lat2", required=false) String lat2,
	        @RequestParam(value="lng1", required=false) String lng1,
	        @RequestParam(value="lng2", required=false) String lng2) {
  
	JSONArray arrayResponse = new JSONArray();	  
	  
	//Create a connection to Stardog
    ConnectionPool connectionPool = ConnectionFactoryUtil.createConnectionPool();  // creates the Stardog connection pool

    try (Connection connection = ConnectionFactoryUtil.getConnection(connectionPool)) { // obtains a Stardog connection from the pool

        try {
        	String final_query = null;        		
        		
        		//Create a list to store all property check box
        		String filter_properties_selected = "";
        		
        		/*List<String> arr_properties_selected = new ArrayList<String>();
			    for (Entry<String, Object> entry : corpo.entrySet()) {
			    	if(entry.getValue().equals("on")){
			    		arr_properties_selected.add(entry.getKey().toString());
 
			    		filter_properties_selected = filter_properties_selected + "  ?medicao prd:measures \""+entry.getKey().toString()+"\".\r\n";
			    		
			    	}
			    }*/
        	            
        		//Get other filter params
        		//String party_selected = corpo.get("measurementPartiesSelect").toString();
        		//String firstDate = corpo.get("firstDateInput").toString();
        		//String secondDate = corpo.get("secondDateInput").toString();
        		//String latitude = corpo.get("latitude").toString();
        		//String longitude = corpo.get("longitude").toString();

        	String all_filters = this.createFilterString(property_selected, party_selected, firstDate, secondDate, lat1, lat2, lng1, lng2);
        		
        		
			final_query = "PREFIX prd: <http://www.semanticweb.org/ontologies/2019/3/sampling_and_measurement#>\r\n" + 
					"\r\n" + 
					"SELECT ?responsavel ?propriedade ?valor ?unidmedida ?amostra ?data_amostra ?lat ?long ?estacao_monitoramento ?localizacao\r\n" + 
					"WHERE {\r\n" + 
					"  ?medicao rdf:type prd:Measurement.\r\n" + 
					"  ?medicao prd:measure_unit ?unidmedida.\r\n" + 
					"  ?medicao prd:measures ?propriedade.\r\n" + 
					"  ?medicao prd:val ?valor.\r\n" + 
					"  ?medicao prd:uses ?amostra.\r\n" + 
					"  ?medicao prd:isDoneBy ?responsavel.\r\n" + 
					filter_properties_selected +
					"  \r\n" + 
					"  ?amostra rdf:type prd:Sampling.\r\n" + 
					"  ?amostra prd:date ?data_amostra.\r\n" + 
					"  \r\n" + 
					"  ?estacao_monitoramento rdf:type prd:Monitoring_Facility.\r\n" + 
					"  ?estacao_monitoramento prd:performs ?amostra.\r\n" + 
					"  ?estacao_monitoramento prd:locates ?localizacao.\r\n" + 
					"  \r\n" + 
					"  ?localizacao rdf:type prd:Geographic_Point.\r\n" + 
					"  ?localizacao prd:latitude ?lat.\r\n" + 
					"  ?localizacao prd:longitude ?long.\r\n" + 
					//"  FILTER ( ?valor > 0).\r\n"+
					all_filters + "\r\n" +
					"} LIMIT 150";


            // Query the database to get our list of Marvel superheroes and print the results to the console
            SelectQuery query = (SelectQuery) connection.select(final_query);
            SelectQueryResult tupleQueryResult = query.execute();
            //QueryResultWriters.write(tupleQueryResult, System.out, TextTableQueryResultWriter.FORMAT);

            
            //Contador de loop
            Integer i = 0;
           
            
            //Array of Location
            ArrayList<Location> arr_locations = new ArrayList<Location>();
            
            while (tupleQueryResult.hasNext()) {
            	//Get the next row
            	BindingSet result = tupleQueryResult.next();
            	
            	//Create a Location Object
            	Location loc = new Location();
            	
            	//Getting all variables of select
            	List<String> allVariables = tupleQueryResult.variables();
            	
            	//Verify if found any result with variable
            	if(!allVariables.isEmpty()) {
            		Map<String, String> informacoes  = new HashMap<String, String>();
            		
            		for (String property : allVariables){
            		  System.out.println("Propriedade atual: "+property);
     
            		  if(result.get(property) != null) {
	            		  String value_of_property = result.get(property).toString(); //tupleQueryResult.next().value(property).get().toString();
	            		  String new_value_of_property = null;
	            		  
	            		  new_value_of_property = value_of_property.replaceAll("\"", "");
	            		  new_value_of_property = new_value_of_property.replaceAll("\n", "");

	            		  //Fazer tratamento de String
	            		  //O if foi feito desta forma para melhor legibilidade do código
	            		  if((property.equals("valor")) || property.equals("unidmedida") || property.equals("data_amostra")) {
	                		int limit_string_index = new_value_of_property.lastIndexOf("^^");
	                		new_value_of_property = new_value_of_property.substring(0, limit_string_index);
	            			  
	            		  }else if((property.equals("estacao_monitoramento")) || (property.equals("propriedade")) || (property.equals("responsavel"))) {
	                		int limit_string_index = new_value_of_property.lastIndexOf("#");
	                		new_value_of_property = new_value_of_property.substring(limit_string_index+1);
	                		new_value_of_property = java.net.URLDecoder.decode(new_value_of_property, StandardCharsets.UTF_8.name());
	            			  
	                		//Armazena a descrição da estação de monitoramento no objeto Location
	                		if (property.equals("estacao_monitoramento")){
	                			loc.setDescription(new_value_of_property);
		            		}
	            		  } else if (property.equals("lat") || property.equals("long")) {
	                		int limit_string_index = new_value_of_property.lastIndexOf("^^");
	                		new_value_of_property = new_value_of_property.substring(0, limit_string_index);
	                		new_value_of_property = new_value_of_property.replace(",", ".");
	                		
	                		//Armazenando informacoes de latitude/longitude no objeto
	                		if (property.equals("lat")) {
	                			loc.setLatitude(new_value_of_property);
	                		}else {
	                			loc.setLongitude(new_value_of_property);
	                		}
	            		  }
	            		  
	            		  informacoes.put(property, new_value_of_property);
            		  }else {
	            		  informacoes.put(property, "");
            		  }
            		}
            		
            		
            		//Verifica se o objeto já existe no array de Location
            		//Caso o objeto exista, apenas adicionar mais um indice ao final do array de measurements do objeto
            		int retorno_verificacao = loc.meIsInArray(arr_locations);
            		if(retorno_verificacao != -1) {
            			Location aux_loc = arr_locations.get(retorno_verificacao);
            			aux_loc.storeMeasurementData(informacoes);
            			arr_locations.set(retorno_verificacao, aux_loc);
            		}else {
            			loc.storeMeasurementData(informacoes);
            			arr_locations.add(loc);
            		}
            		
            		i++;
                	System.out.println("Indice contador: "+ i.toString());
            	}else {
            		return arrayResponse.toString(); 
            	}
            	System.out.println("Size of Result: "+ result.size());
            }
            
            //Criando arrays JSON de retorno
            for(Location loc: arr_locations) {
            	JSONObject array_json = loc.createJSONStructure();
        		arrayResponse.add(array_json); 
            }
    		
        } catch (StardogException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
        	ConnectionFactoryUtil.releaseConnection(connectionPool, connection);
            connectionPool.shutdown();
        }
        
        return arrayResponse.toString();
    }	  
  }
 
    
  
  

  @RequestMapping(value = "/submit/sparql", method = RequestMethod.POST, consumes = {MediaType.APPLICATION_JSON_VALUE })
  @ResponseBody
  public String submitSparql(@RequestBody(required = true) Map<String, Object> corpo) {
	  System.out.println(corpo);
	  System.out.println(String.format("%7d %7d", corpo.get("empresaId"), corpo.get("nsu")));
	  return String.format("%7d %7d", corpo.get("empresaId"), corpo.get("nsu"));
  }    
 
  
  private String createFilterString(String property_selected, String party_selected, String firstDate, String secondDate, String lat1, String lat2, String lng1, String lng2) {
	  String all_filter = "";
	  if((property_selected != null) && (!property_selected.equals(""))) {
		  all_filter = all_filter + "\r\n" +
			  		"  FILTER( ?propriedade = prd:Solidos_suspensos_totais ).\r\n"; 		  
	  }
	  if((party_selected != null) && (!party_selected.equals(""))) {
		  all_filter = all_filter + "\r\n" +
			  		"  FILTER( ?responsavel = prd:"+party_selected+" ).\r\n"; 		  
	  }

	  //O filtro por data não foi desenvolvido pois os dados da base estão no formato STRING e não data
	  //Para construir o filtro de data quando os dados da base forem corrigidos, basta adicionar a cláusula filter nos IFs abaixo
	  if((firstDate != null) && (!firstDate.equals(""))) {
		  
	  }
	  if((secondDate != null) && (!secondDate.equals(""))) {
		  
	  }
	  if(((lat1 != null) && (!lat1.equals(""))) && ((lat2 != null) && (!lat2.equals(""))) && ((lng1 != null) && (!lng1.equals(""))) && ((lng2 != null) && (!lng2.equals("")))) {
		  //Trocando pontos por virgulas, conforme está no banco
		  lat1 = lat1.replace(".", ",");
		  lat2 = lat2.replace(".", ",");
		  lng1 = lng1.replace(".", ",");
		  lng2 = lng2.replace(".", ",");
		  
		  //Colocar comentario explicando a questão da inversão dos sinais por ser string
		  //Os sinais de <= e >= estão invertidos pois os dados na base estão em formato de string e não de número
		  //Sendo assim, a clausula FILTER faz a busca por ordenação de string e não de número
		  all_filter = all_filter + "\r\n"
		  		+ "FILTER( ?lat >= \""+lat1+"\" && ?lat <= \""+lat2+"\" ).\r\n" + 
		  		"  FILTER( ?long >= \""+lng1+"\" && ?long <= \""+lng2+"\" ).  "; 
		  
		  
	  }
		  
		  
	  return all_filter;
  }  
  
}