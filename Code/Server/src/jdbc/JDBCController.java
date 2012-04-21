package jdbc;
import java.sql.*;

/**
 * Handles the connection between the application and the database
 * using JDBC to initialize the connection.
 * 
 * @author William Wenzel
 *
 */
public class JDBCController {
    private static final String url = "jdbc:mysql://localhost/";
    private static final String SQL_DRIVER = "com.mysql.jdbc.Driver";
    
    private static final String username = "crmapi";
    private static final String password = "Integration";
    
    private static final String SCHEMA_DB = "information_schema";
    
    private static Connection jdbcCRMConnection = null;
    private static Connection jdbcSchemaConnection = null;
    
    private JDBCController() {
    }
    
    /**
     * Returns the existing connection if one exists. If there is not an
     * existing connection, a new one will be created and stored for later
     * use.
     * 
     * @param database
     * 		The name of the database the connection will initialize with.
     * 
     * @return
     * 		The connection to the database
     * 
     * @throws CRMConnectionFailure
     */
    public static Connection getConnection(final String database) throws CRMConnectionFailure {
            if (jdbcCRMConnection == null) {
                try {
                    Class.forName(SQL_DRIVER).newInstance();
                    jdbcCRMConnection = DriverManager.getConnection(url + database, username, password);
                }
                catch (final ClassNotFoundException cnfe) {
                    throw new CRMConnectionFailure("Unable to connect to the database", cnfe);
                }
                catch (final IllegalAccessException iae) {
                    throw new CRMConnectionFailure("Unable to connect to the database", iae);
                }
                catch (final InstantiationException ie) {
                    throw new CRMConnectionFailure("Unable to connect to the database", ie);
                }
                catch (final SQLException se) {
                    throw new CRMConnectionFailure("Unable to connect to the database", se);
                }
            }
            
            return jdbcCRMConnection;
    }
    /**
     * Connects to the information_schema database.
     * 
     * @return
     * 		A connection to the information_schema database
     * 
     * @throws CRMConnectionFailure
     */
    public static Connection getSchemaConnection() throws CRMConnectionFailure {
    	if (jdbcSchemaConnection == null) {
            try {
                Class.forName(SQL_DRIVER).newInstance();
                jdbcSchemaConnection = DriverManager.getConnection(url + SCHEMA_DB, username, password);
            }
            catch (final ClassNotFoundException cnfe) {
                throw new CRMConnectionFailure("Unable to connect to the database", cnfe);
            }
            catch (final IllegalAccessException iae) {
                throw new CRMConnectionFailure("Unable to connect to the database", iae);
            }
            catch (final InstantiationException ie) {
                throw new CRMConnectionFailure("Unable to connect to the database", ie);
            }
            catch (final SQLException se) {
                throw new CRMConnectionFailure("Unable to connect to the database", se);
            }
        }
        
        return jdbcSchemaConnection;
    }
    
    /**
     * Closes the interaction with the database.
     * 
     * @throws CRMConnectionFailure
     */
    public static void closeConnection() throws CRMConnectionFailure {
    	try {
    		jdbcCRMConnection.close();
    		jdbcSchemaConnection.close();
		} catch (SQLException se) {
			throw new CRMConnectionFailure("Unable to close the connection to the database.", se);
		}
    }
}