package util;

import java.util.ArrayList;
import java.util.Map;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

public class JSONStructureFactory {

	public JSONObject returnResponseStructure() {
		//
		JSONObject locate_array = new JSONObject();
		locate_array.put("lat", "");
		locate_array.put("long", "");
		locate_array.put("description", "");
		//
		JSONObject sample = new JSONObject();
		sample.put("date", "");
		sample.put("party", "");
		sample.put("locate", locate_array);

		//
		JSONObject party = new JSONObject();
		party.put("name", "");
		//
		JSONObject measurement = new JSONObject();
		measurement.put("measurement_property", "");
		measurement.put("value", "");
		measurement.put("unit", "");
		measurement.put("party", party);
		
		JSONObject obj = new JSONObject();
		obj.put("sample", sample);
		obj.put("measurement", measurement);
		
		System.out.println(obj.toJSONString());

		return obj;
	}
	
	
	public JSONObject returnResponseStructureWithData(Map<String, String> arr) {
		//
		JSONObject party = new JSONObject();
		party.put("name", arr.get("responsavel"));
		//
		JSONObject measurement = new JSONObject();
		measurement.put("sample_date", arr.get("data_amostra"));
		measurement.put("measurement_property", arr.get("propriedade"));
		measurement.put("value", arr.get("valor"));
		measurement.put("unit", arr.get("unidmedida"));
		measurement.put("party", party);
		
		//
		JSONObject locate_array = new JSONObject();
		locate_array.put("lat", arr.get("lat"));
		locate_array.put("long", arr.get("long"));
		locate_array.put("description", arr.get("estacao_monitoramento"));
		locate_array.put("measurement", measurement);
		//
		JSONObject obj = new JSONObject();
		obj.put("locate", locate_array);
		
		System.out.println(obj.toJSONString());

		return obj;
	}	
	
	
	public JSONObject returnResponseStructureWithDataAnotherStruct(Map<String, String> arr) {
		//
		JSONObject locate_array = new JSONObject();
		locate_array.put("lat", arr.get("lat"));
		locate_array.put("long", arr.get("long"));
		locate_array.put("description", arr.get("estacao_monitoramento"));
		//
		JSONObject sample = new JSONObject();
		sample.put("date", arr.get("data_amostra"));
		sample.put("party", "");
		sample.put("locate", locate_array);

		//
		JSONObject party = new JSONObject();
		party.put("name", "");
		//
		JSONObject measurement = new JSONObject();
		measurement.put("measurement_property", arr.get("propriedade"));
		measurement.put("value", arr.get("valor"));
		measurement.put("unit", arr.get("unidmedida"));
		measurement.put("party", party);
		
		JSONObject obj = new JSONObject();
		obj.put("sample", sample);
		obj.put("measurement", measurement);
		
		System.out.println(obj.toJSONString());

		return obj;
	}		
	
	
}
