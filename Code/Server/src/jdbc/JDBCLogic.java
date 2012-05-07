package jdbc;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

/**
 * Contains the logic used to generate SQL queries and execute them
 * by using an existing connection to the database. This class operates
 * to provide all of the functionality to get data out of and put data
 * into the database.
 * 
 * @author William Wenzel
 * @author Nick Garvey
 *
 */
public class JDBCLogic {
    private static final String ID_COLUMN = "id";
    private static final String CRM_DATABASE = "CRM";
    
    private static final String BOOLEAN_PREFIX = "is";
    
    /**
     * Fetches a list of entities from the database based on the given record.
     * Fetches all records for the given type if the companyRecord HashMap does
     * not contain an Id column.
     * 
     * @param entityRecord
     * 		The mapping of attributes to values for the record.
     * @param entityName TODO
     * 
     * @return
     * 		A list of company entities matching the record.
     * 
     * @throws CRMExecutionException
     * @throws CRMConnectionFailure
     */
    public List<Entity> fetchEntity(final HashMap<String, String> entityRecord, String entityName) throws CRMExecutionException, CRMConnectionFailure {
    	final String selectSQL = generateSelectQuery(entityRecord, entityName);
    	return executeSQL(selectSQL, CRM_DATABASE, false, entityName);
    }
    
    /**
     * Updates a given company in the database with the attributes and
     * values specified in the record HashMap.
     * 
     * @param entityRecord
     * 		A mapping of attributes to values for the company record.
     * @param entityName TODO
     * 
     * @throws CRMExecutionException
     * @throws CRMConnectionFailure
     */
    public void updateEntity(final HashMap<String, String> entityRecord, String entityName) throws CRMExecutionException, CRMConnectionFailure {
        final String updateSQL = generateUpdateQuery(entityRecord, entityName);
        executeSQL(updateSQL, CRM_DATABASE, true, entityName);
    }
    
    /**
     * Creates a new company in the database for the given HashMap of
     * attributes to values.
     * 
     * @param entityRecord
     * 		A mapping of attributes to values for the company record.
     * @param entityName TODO
     * @throws CRMExecutionException
     * @throws CRMConnectionFailure
     * @throws JSONException 
     * @throws SQLException 
     */
    public JSONObject insertEntity(final HashMap<String, String> entityRecord, String entityName) throws CRMExecutionException, CRMConnectionFailure, JSONException, SQLException {
		final String insertSQL = generateInsertStatement(entityRecord, entityName);
		final List<Entity> resultingValues = executeSQL(insertSQL, CRM_DATABASE, true, entityName);
		
		
		final JSONObject result = new JSONObject();
		result.put("id", resultingValues.get(0).getId());
		
		return result;
	}
    
    /**
     * Deletes a given record from the database with the values specified
     * in the HashMap.
     * 
     * @param entityRecord
     * 		A mapping of attributes to values to identify the company to
     * 		be deleted.
     * @param entityName TODO
     * 
     * @throws CRMExecutionException
     * @throws CRMConnectionFailure
     */
	public void deleteEntity(final HashMap<String, String> entityRecord, String entityName)
			throws CRMExecutionException, CRMConnectionFailure {
    	final String deleteSQL = generateDeleteStatement(entityRecord, entityName);
    	executeSQL(deleteSQL, CRM_DATABASE, true, entityName);
    }

	/**
	 * Generates a select query based on the attributes and values contained
	 * in the record HashMap.
	 * 
	 * @param record
	 * 		A mapping of attributes to values to identify the record being selected.
	 * 
	 * @param entityName
	 * 		The type of entity (table name) to be selected.
	 * 
	 * @return
	 * 		A SQL query to select the specified record.
	 */
    private String generateSelectQuery(final HashMap<String, String> record, final String entityName) {
    	String whereClause = "";
    	
    	if(record.containsKey(ID_COLUMN) && record.get(ID_COLUMN) != null) {
    		whereClause = "id=" + record.get(ID_COLUMN) + ";";
    	}
    	else {
    		whereClause = "1";
    	}
    	
        return "SELECT * FROM `" + entityName + "` WHERE " + whereClause;
    }

    /**
     * Generates a query to update the given record with the specified
     * attributes and values.
     * 
     * @param record
     * 		A mapping of attributes and values for the record.
     * 
     * @param entityName
     * 		The entity type (table name) to update.
     * 
     * @return
     * 		A SQL query to update the given record.
     * 
     * @throws CRMExecutionException
     */
    private String generateUpdateQuery(final HashMap<String, String> record, final String entityName) 
            throws CRMExecutionException {
            
        final StringBuilder sqlStatement = new StringBuilder("UPDATE `" + entityName + "` SET ");
        for (final String attribute: record.keySet()) {
            if (attribute.equals("id")) {
                continue;
            }
            
            if (attribute.startsWith(BOOLEAN_PREFIX)) {
                sqlStatement.append(attribute + "=" + record.get(attribute) + ", ");
            }
            else {
                sqlStatement.append(attribute + "='" + record.get(attribute) + "', ");
            }
        }
        
        // Remove the ending , added to the String
        sqlStatement.deleteCharAt(sqlStatement.length() - 1);
        sqlStatement.deleteCharAt(sqlStatement.length() - 1);
        
        sqlStatement.append(" WHERE id=" + record.get(ID_COLUMN) + ";");
        
        return sqlStatement.toString();
    }
    
    /**
     * Generates a SQL query to create the given record.
     * 
     * @param record
     * 		The mapping of attributes to values for the entity to create.
     * 
     * @param entityName
     * 		The entity type (table name) to create.
     * 
     * @return
     * 		A SQL query to create the given record.
     * @throws CRMConnectionFailure 
     * @throws SQLException 
     */
    private String generateInsertStatement(final HashMap<String, String> record, final String entityName) throws CRMConnectionFailure, SQLException {
        final StringBuilder attributesBuilder = new StringBuilder();
        final StringBuilder valuesBuilder = new StringBuilder();
        
        for (final String attribute: record.keySet()) {
            attributesBuilder.append(attribute + ", ");
            
            if (attribute.startsWith(BOOLEAN_PREFIX)) {
                valuesBuilder.append(record.get(attribute) + ", ");   
            }
            else {
                valuesBuilder.append("\"" + record.get(attribute) + "\", ");
            }
        }
        
        // Remove the ending , added to the String
        attributesBuilder.deleteCharAt(attributesBuilder.length() - 1);
        attributesBuilder.deleteCharAt(attributesBuilder.length() - 1);
        
        // Remove the ending , added to the String
        valuesBuilder.deleteCharAt(valuesBuilder.length() - 1);
        valuesBuilder.deleteCharAt(valuesBuilder.length() - 1);
                
        return "INSERT INTO `" + entityName + "` (" + attributesBuilder.toString() + ") VALUES (" +
               valuesBuilder.toString() + ");";
        
    }
    
    /**
     * Generates a SQL query to delete the given record.
     * 
     * @param record
     * 		A mapping of attributes to values for the record to be deleted.
     * 
     * @param entityName
     * 		The entity type (table name) to be deleted.
     * 
     * @return
     * 		A SQL query to delete the given record.
     */
    private String generateDeleteStatement(final HashMap<String, String> record, final String entityName) {
        return "DELETE FROM `" + entityName + "` WHERE id=" + record.get(ID_COLUMN) + ";";
    }
    
    /**
     * Generates a map of column name to data type
     * 
     * @param entityName
     * 		The entity type (table name).
     * 
     * @return
     * 		A map of column name to data type mapping
     * 
     * @throws CRMExecutionException
     * @throws CRMConnectionFailure
     */
    public HashMap<String, String> getSchemaDataForEntity(final String entityName) throws CRMExecutionException, CRMConnectionFailure {
    	final Connection conn = JDBCController.getSchemaConnection();
		
		try {
		    final Statement st = conn.createStatement();

	    	final ResultSet results = st.executeQuery("SELECT column_name, data_type FROM columns WHERE table_name='" + entityName + "'");
	    	final ResultSetMetaData metadata = results.getMetaData();
	    	
	    	
	    	final List<Entity> entityList = new ArrayList<Entity>();
	    	
	    	while (results.next()) {
	    		
	    		String id = "";
	    		
	    		final List<Attribute> attributes = new ArrayList<Attribute>();
	    		for(int i = 1; i <= metadata.getColumnCount(); i++) {
	    			final String columnName = metadata.getColumnName(i);
	    			final String value = results.getString(i);
	    			final String type = metadata.getColumnTypeName(i);
	    			
	    			if (columnName.equals(ID_COLUMN)) {
	    				id = value;
	    			}
	    			
	    			attributes.add(new Attribute(columnName, type, value));
	    		}
	    		
	    		
	    		entityList.add(new Entity(entityName, id, attributes));
	        }
	    	
	        results.close();
	        
	        final HashMap<String, String> schema = new HashMap<String, String>();
	        for(final Entity e: entityList) {
	        	for(int i = 0; i < e.getAttributes().size(); i += 2) {
	        		schema.put(e.getAttributes().get(i).getValue(), e.getAttributes().get(i + 1).getValue());
	        	}
	        }
	        
	        return schema;
	    }
		catch (final SQLException se) {
		    throw new CRMExecutionException("Unable to get schema for entity type " + entityName + " because of an exception.", se);
		}
    }
    
    /**
     * Uses JDBC to execute a given SQL statement on the given database.
     * 
     * @param query
     * 		The SQL query to execute.
     * 
     * @param database
     * 		The name of the database to target the query with.
     * 
     * @param manipulation
     * 		True if it is a create, update or delete. False for select.
     * 
     * @param entityName
     * 		The entity type (table name) that is being manipulated.
     * 
     * @return
     * 		A list of entities selected for select statements.
     * 		Null will be returned for creates, updates, and deletes.
     * 
     * @throws CRMExecutionException
     * @throws CRMConnectionFailure
     */
    private List<Entity> executeSQL(final String query, final String database, final boolean manipulation, final String entityName) 
			throws CRMExecutionException, CRMConnectionFailure {
		final Connection conn = JDBCController.getConnection(database);
		
		try {
		    final Statement st = conn.createStatement();
		    
		    if (manipulation) {
		        System.err.println(query);
		    	final int sqlResultValue = st.executeUpdate(query, Statement.RETURN_GENERATED_KEYS);
		    	
		    	// Because the id column is auto-generated, we need to capture it
		    	// from this result set, if it's an insert. Otherwise it will be
		    	// ignored.
		    	final ResultSet generatedKeys = st.getGeneratedKeys();
		    	
		    	final List<Entity> resultList = new ArrayList<Entity>();
		    	while(generatedKeys.next()) {
		    	    final String id = generatedKeys.getString(1);
		    	    resultList.add(new Entity("Company", id, null));
		    	}
		    	
		    	return resultList;
		    }
		    else {
		    	final ResultSet results = st.executeQuery(query);
		    	final ResultSetMetaData metadata = results.getMetaData();
		    	
		    	
		    	final List<Entity> entityList = new ArrayList<Entity>();
		    	
		    	while (results.next()) {
		    		
		    		String id = "";
		    		
		    		final List<Attribute> attributes = new ArrayList<Attribute>();
		    		for(int i = 1; i <= metadata.getColumnCount(); i++) {
		    			final String columnName = metadata.getColumnName(i);
		    			final String value = results.getString(i);
		    			final String type = metadata.getColumnTypeName(i);
		    			
		    			if (columnName.equals(ID_COLUMN)) {
		    				id = value;
		    			}
		    			
		    			attributes.add(new Attribute(columnName, type, value));
		    		}
		    		
		    		
		    		entityList.add(new Entity(entityName, id, attributes));
		        }
		    	
		        results.close();
		        
		        return entityList;
		    }
		}
		catch (final SQLException se) {
		    throw new CRMExecutionException("Unable to execute the query: (" + query + ") because of an exception.", se);
		}
    }
}