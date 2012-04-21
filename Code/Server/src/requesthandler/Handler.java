package requesthandler;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/{entity}")
public class Handler {
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String getEntities(@PathParam("entity") String entity) {
		return "entity: " + entity;
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	public String createEntity(@PathParam("entity") String entity) {
		return "entity: " + entity;
	}
	
	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public String getEntity(@PathParam("entity") String entity, @PathParam("id") String id) {
		return "entity: " + entity + "\nid: " + id;
	}
	
	@PUT
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public String updateEntity(@PathParam("entity") String entity, @PathParam("id") String id) {
		return "entity: " + entity + "\nid: " + id;
	}
	
	@DELETE
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public String deleteEntity(@PathParam("entity") String entity, @PathParam("id") String id) {
		return "entity: " + entity + "\nid: " + id;
	}
	
}
