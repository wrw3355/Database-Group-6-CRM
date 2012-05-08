package requesthandler;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Iterator;
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
	public String getEntities(@PathParam("entity") String entityName) throws CRMExecutionException, CRMConnectionFailure, JSONException {
		final HashMap<String, String> map = new HashMap<String, String>();
		map.put("id", null);
		
		final List<Entity> result = logic.fetchEntity(map, entityName);
		
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
    @Consumes("application/x-www-form-urlencoded")
    @Produces(MediaType.APPLICATION_JSON)
    public String createEntity(String json, @PathParam("entity") String entityName) throws JSONException, CRMExecutionException, CRMConnectionFailure, SQLException, UnsupportedEncodingException {
        final JSONObject record = new JSONObject(URLDecoder.decode(json, "UTF-8"));
        final HashMap<String, String> entityRecord = new HashMap<String, String>();
        
        for(final Iterator iter = record.keys(); iter.hasNext();) {
            String key = (String)iter.next();
            entityRecord.put(key, record.getString(key));
        }
        
        return logic.insertEntity(entityRecord, entityName).toString();
    }
	
	@PUT
	@Path("/{id}")
    @Consumes("application/x-www-form-urlencoded")
    @Produces(MediaType.APPLICATION_JSON)
    public void updateEntity(String json, @PathParam("entity") String entityName, @PathParam("id") String id) 
            throws JSONException, CRMExecutionException, CRMConnectionFailure, SQLException, UnsupportedEncodingException {
        final JSONObject record = new JSONObject(URLDecoder.decode(json, "UTF-8"));
        final HashMap<String, String> entityRecord = new HashMap<String, String>();
            
        for(final Iterator iter = record.keys(); iter.hasNext();) {
            String key = (String)iter.next();
            entityRecord.put(key, record.getString(key));
        }
        
        // The id is not passed in the JSON
        entityRecord.put("id", id);
        
        logic.updateEntity(entityRecord, entityName);
    }
	
	@DELETE
    @Path("/{id}")
    @Consumes("application/x-www-form-urlencoded")
    @Produces(MediaType.APPLICATION_JSON)
    public void deleteEntity(@PathParam("entity") String entityName, @PathParam("id") String id) 
            throws JSONException, CRMExecutionException, CRMConnectionFailure, SQLException, UnsupportedEncodingException {
	    
        final HashMap<String, String> entityRecord = new HashMap<String, String>();
        
        // The id is not passed in the JSON
        entityRecord.put("id", id);
        
        logic.deleteEntity(entityRecord, entityName);
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
	
	@GET
	@Path("/Schema/{entity}")
	@Produces(MediaType.APPLICATION_JSON)
	private String getSchema(@PathParam("entity") String entity) throws CRMExecutionException, CRMConnectionFailure, JSONException {
		final HashMap<String, String> schema = logic.getSchemaDataForEntity(entity);
		
		final JSONObject schemaJSON = new JSONObject();
		
		for(final String key: schema.keySet()) {
			schemaJSON.put(key, schema.get(key));
		}
		
		return schemaJSON.toString();
		
	}
	
	private String getEntity(final String entityName, final String id) throws JSONException, CRMExecutionException, CRMConnectionFailure {

		final HashMap<String, String> map = new HashMap<String, String>();
		map.put("id", id);
		
		final List<Entity> result = logic.fetchEntity(map, entityName);
		
		final Entity entityResult = result.get(0);
		final JSONObject jsonForEntity = new JSONObject();
		
		for(final Attribute a: entityResult.getAttributes()) {
			jsonForEntity.put(a.getName(), a.getValue());
		}
		
		return jsonForEntity.toString();
	}
}
