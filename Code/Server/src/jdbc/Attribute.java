package jdbc;
/**
 * Holds the data for a single entry for a column in a row
 * for an entity.
 * 
 * @author William Wenzel
 *
 */
public class Attribute {
	private String name;
	private String type;
	private String value;
	
	/**
	 * Create the attribute.
	 * 
	 * @param name
	 * 		The column name.
	 * 
	 * @param type
	 * 		The column type.
	 * 
	 * @param value
	 * 		The value in the column.
	 */
	public Attribute(final String name, final String type, final String value) {
		this.name = name;
		this.type = type;
		this.value = value;
	}

	public String getName() {
		return name;
	}

	public String getType() {
		return type;
	}

	public String getValue() {
		return value;
	}
}
