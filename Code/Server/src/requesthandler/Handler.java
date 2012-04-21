package requesthandler;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import jdbc.CRMConnectionFailure;
import jdbc.JDBCController;

import org.codehaus.jettison.json.JSONObject;

@Path("/{entity}")
public class Handler {

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String getEntities(@PathParam("entity") String entity) {
		try {
			Connection conn = JDBCController.getConnection("CRM");
			Statement st = conn.createStatement();
			st.execute("SELECT * FROM Company");
			ResultSet resultSet = st.getResultSet();
			StringBuilder names = new StringBuilder();
			while (resultSet.next()) {
				names.append(resultSet.getString("name") + "\n");
			}
			return names.toString();
		} catch (CRMConnectionFailure e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return "entity: " + entity;
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
	public String getEntity(@PathParam("entity") String entity,
			@PathParam("id") String id) {
		return "entity: " + entity + "\nid: " + id;
	}

	@PUT
	@Path("/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String updateEntity(@PathParam("entity") String entity,
			@PathParam("id") String id, JSONObject putJson) {
		return "entity: " + entity + "\nid: " + id;
	}

	@DELETE
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public String deleteEntity(@PathParam("entity") String entity,
			@PathParam("id") String id) {
		return "entity: " + entity + "\nid: " + id;
	}

}
