
	import java.sql.*;
import java.util.ArrayList;

public class Database {
	
	//STEP 1. Import required packages


	   // JDBC driver name and database URL
	   static final String JDBC_DRIVER = "com.mysql.jdbc.Driver";  
	   static final String DB_URL = "jdbc:mysql://apollo11.student.rit.edu/CRM";

	   //  Database credentials
	   static final String USER = "databaseuser";
	   static final String PASS = "Password101!";
	
	   public static ArrayList<Company> select(){
		   
	   ArrayList<Company> returnlist=new ArrayList<Company>();
	   Connection conn = null;
	   Statement stmt = null;
	   try{
	      //STEP 2: Register JDBC driver
	      Class.forName("com.mysql.jdbc.Driver");

	      //STEP 3: Open a connection
	      conn = DriverManager.getConnection(DB_URL,USER,PASS);

	      //STEP 4: Execute a query
	      stmt = conn.createStatement();
	      String sql;
	      sql = "SELECT id, name, email, phone,address, type FROM Company";
	      ResultSet rs = stmt.executeQuery(sql);

	      //STEP 5: Extract data from result set
	      while(rs.next()){
	    	  
	      Company c=new Company();
	         //Retrieve by column name
	         int id  = rs.getInt("id");
	
	         String name = rs.getString("name");
	         String email = rs.getString("email");
	         String phone = rs.getString("phone");
	         String address= rs.getString("address");
	         String type= rs.getString("type");
	        


	         //Display values
	     //    System.out.print("ID: " + id);
	     //    System.out.print(", Age: " + age);
	        c.setName(name);
	        c.setPhone(phone);
	        c.setEmail(email);
	        c.setAddress(address);
	        c.setType(type);
	        c.setId(id);
	        returnlist.add(c);
	      }
	      //STEP 6: Clean-up environment
	      rs.close();
	      stmt.close();
	      conn.close();
	   }catch(SQLException se){
	      //Handle errors for JDBC
	      se.printStackTrace();
	   }catch(Exception e){
	      //Handle errors for Class.forName
	      e.printStackTrace();
	   }finally{
	      //finally block used to close resources
	      try{
	         if(stmt!=null)
	            stmt.close();
	      }catch(SQLException se2){
	      }// nothing we can do
	      try{
	         if(conn!=null)
	            conn.close();
	      }catch(SQLException se){
	         se.printStackTrace();
	      }//end finally try
	   }//end try
	   return returnlist;

	   }//end 
	   
	   
	   public  void delete(int index){
		   
		   Connection conn = null;
		   Statement stmt = null;
		   try{
		      //STEP 2: Register JDBC driver
		      Class.forName("com.mysql.jdbc.Driver");

		      //STEP 3: Open a connection
		      conn = DriverManager.getConnection(DB_URL,USER,PASS);

		      //STEP 4: Execute a query
		      System.out.println("Creating statement...");
		      stmt = conn.createStatement();
		      String sql;
		      sql = "delete FROM Company where id="+index;
		      stmt.executeUpdate(sql);

		      //STEP 5: Extract data from result set
		    	  
	
		  
		   }catch(Exception e){
		      //Handle errors for Class.forName
		      e.printStackTrace();
		   }finally{
			   try {
				conn.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
               try {
				stmt.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		   }//end try
	   }
	
	   
	   public static void main(String[] args) {
		   
	  for(Company c :select()){
		  
	  System.out.println(c.toString());
	  
	   }
	   
	   
	   }
	}//end FirstExample


