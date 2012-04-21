package jdbc;
import java.util.List;

/**
 * Holds the data for an entity fetched from the database
 * including the attributes, type, and id (primary key).
 * 
 * @author William Wenzel
 *
 */
public class Entity {
	private String entityType;
	private String id;
	private List<Attribute> attributes;
	
	/**
	 * Construct the Eneity
	 * 
	 * @param entityType
	 * 		The type of entity (table name).
	 * 
	 * @param id
	 * 		The id (primary key) for the entity.
	 * 
	 * @param attributes
	 * 		A list of attributes for the entity.
	 */
	public Entity(final String entityType, final String id, List<Attribute> attributes) {
		this.entityType = entityType;
		this.id = id;
		this.attributes = attributes;
	
	}

	public String getEntityType() {
		return entityType;
	}

	public String getId() {
		return id;
	}
	
	public List<Attribute> getAttributes() {
		return attributes;
	}
}
