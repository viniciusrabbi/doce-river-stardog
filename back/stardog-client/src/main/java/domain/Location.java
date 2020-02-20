package domain;

import java.util.ArrayList;
import java.util.Map;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

public class Location {

	private String latitude;
	private String longitude;
	private String description;
	private ArrayList<Map> arr_measurements;
	
	//Construct
	public Location() {
		super();
		this.arr_measurements = new ArrayList();
	}

	//
	public boolean verifyLatLng(String latitude, String longitude) {
		if(this.latitude.equals(latitude) && (this.longitude.equals(longitude))){
			return true;
		}else {
			return false;
		}
	}
	
	//
	public void storeMeasurementData(Map<String, String> arr) {
		this.arr_measurements.add(arr);
	}
	
	//
	public int meIsInArray(ArrayList<Location> arr) {
		for(int i=0; i < arr.size(); i++){
			if(arr.get(i).verifyLatLng(this.latitude, this.longitude)) {
				return i;
			}
		}
		return -1;
	}	
	
	//
	public JSONObject createJSONStructure() {
		//
		JSONObject measurements = new JSONObject();
	
		for(int i=0; i < this.arr_measurements.size(); i++) {
			Map<String, String> map = this.arr_measurements.get(i);
			//
			JSONObject party = new JSONObject();
			party.put("name", map.get("responsavel"));
			//			
			JSONObject measurement = new JSONObject();
			measurement.put("sample_date", map.get("data_amostra"));
			measurement.put("measurement_property", map.get("propriedade"));
			measurement.put("value", map.get("valor"));
			measurement.put("unit", map.get("unidmedida"));
			measurement.put("party", party);
			
			//Add to JSON Object
			measurements.put(i, measurement);
		}
		
		//
		JSONObject locate_array = new JSONObject();
		locate_array.put("lat", this.getLatitude());
		locate_array.put("long", this.getLongitude());
		locate_array.put("description", this.getDescription());
		locate_array.put("measurements", measurements);
		//
		JSONObject obj = new JSONObject();
		obj.put("locate", locate_array);
		
		System.out.println(obj.toJSONString());

		return obj;
	}
	
	
	////////////////////
	
	public String getLatitude() {
		return latitude;
	}
	public void setLatitude(String latitude) {
		this.latitude = latitude;
	}
	public String getLongitude() {
		return longitude;
	}
	public void setLongitude(String longitude) {
		this.longitude = longitude;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public ArrayList getMeasurements() {
		return arr_measurements;
	}
	public void setMeasurements(ArrayList measurements) {
		this.arr_measurements = measurements;
	}
	
	
	
}
