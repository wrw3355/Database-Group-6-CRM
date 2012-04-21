package jdbc;
/**
 * Thrown when an error occurs during the execution of an operation 
 * involving the CRM system.
 * 
 * @author William Wenzel
 *
 */
public class CRMExecutionException extends Exception {

	private static final long serialVersionUID = -7775880144520854372L;

	public CRMExecutionException(final String msg) {
		super(msg);
	}
	
	public CRMExecutionException(final String msg, final Exception e) {
		super(msg, e);
	}
}
