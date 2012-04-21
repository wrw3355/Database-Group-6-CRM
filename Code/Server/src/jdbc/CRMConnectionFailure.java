package jdbc;
/**
 * Thrown when a connection error occurs when interacting with 
 * the CRM system.
 * 
 * @author William Wenzel
 *
 */
public class CRMConnectionFailure extends Exception {

	private static final long serialVersionUID = -7775880144520854372L;

	public CRMConnectionFailure(final String msg) {
		super(msg);
	}
	
	public CRMConnectionFailure(final String msg, final Exception e) {
		super(msg, e);
	}
}
