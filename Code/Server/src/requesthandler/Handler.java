package requesthandler;

import java.util.HashMap;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import jdbc.Attribute;
import jdbc.CRMConnectionFailure;
import jdbc.CRMExecutionException;
import jdbc.Entity;
import jdbc.JDBCLogic;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

@Path("/{entity}")
public class Handler {
	
	private static final JDBCLogic logic = new JDBCLogic();
	private static final String SCHEMA_ENTITY = "Schema";

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String getEntities(@PathParam("entity") String entity) throws CRMExecutionException, CRMConnectionFailure, JSONException {
		final HashMap<String, String> map = new HashMap<String, String>();
		map.put("id", null);
		
		final List<Entity> result = logic.fetchCompany(map);
		
		final JSONObject jsonForEntity = new JSONObject();
		
		for(final Entity entityResult: result) {
			
			final JSONObject singleEntity = new JSONObject();
			for(final Attribute a: entityResult.getAttributes()) {
				singleEntity.put(a.getName(), a.getValue());
			}
			jsonForEntity.put(singleEntity.getString("id"), singleEntity);
		}
		
		return jsonForEntity.toString();
	}

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String createEntity(@PathParam("entity") String entity,
			JSONObject postJson) {
		return "entity: " + entity;
	}

	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public String handleGet(@PathParam("entity") String entity,
			@PathParam("id") String id) throws CRMExecutionException, CRMConnectionFailure, JSONException {
		if (entity.equals(SCHEMA_ENTITY)) {
			return getSchema(id);
		}
		else {
			return getEntity(entity, id);
		}
	}
	
	private String getSchema(final String entityName) throws CRMExecutionException, CRMConnectionFailure, JSONException {
		final HashMap<String, String> schema = logic.getSchemaDataForEntity(entityName);
		
		final JSONObject schemaJSON = new JSONObject();
		
		for(final String key: schema.keySet()) {
			schemaJSON.put(key, schema.get(key));
		}
		
		return schemaJSON.toString();
		
	}
	
	private String getEntity(final String entity, final String id) throws JSONException, CRMExecutionException, CRMConnectionFailure {

		final HashMap<String, String> map = new HashMap<String, String>();
		map.put("id", id);
		
		final List<Entity> result = logic.fetchCompany(map);
		
		final Entity entityResult = result.get(0);
		final JSONObject jsonForEntity = new JSONObject();
		
		for(final Attribute a: entityResult.getAttributes()) {
			jsonForEntity.put(a.getName(), a.getValue());
		}
		
		return jsonForEntity.toString();
	}

	@PUT
	@Path("/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String updateEntity(@PathParam("entity") String entity,
			@PathParam("id") String id, JSONObject putJson) {
		return "put entity: " + entity + "\nid: " + id;
	}

	@DELETE
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public String deleteEntity(@PathParam("entity") String entity,
			@PathParam("id") String id) {
		return "delete entity: " + entity + "\nid: " + id;
	}

}
