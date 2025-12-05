package java_backend_reference;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class DatabaseConnection {

    private static final String URL_WITHOUT_DB = "jdbc:mysql://localhost:3306/";
    private static final String URL = "jdbc:mysql://localhost:3306/campuspass";
    private static final String USER = "root";           // MySQL username
    private static final String PASSWORD = "ds_7406";   // MySQL password

    // Method to create database if it doesn't exist
    private static void createDatabaseIfNotExists() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            // Connect without specifying database
            try (Connection conn = DriverManager.getConnection(URL_WITHOUT_DB, USER, PASSWORD);
                 Statement stmt = conn.createStatement()) {

                String sql = "CREATE DATABASE IF NOT EXISTS campuspass";
                stmt.executeUpdate(sql);
                System.out.println("✅ Database 'campuspass' verified/created successfully!");
            }

        } catch (ClassNotFoundException e) {
            System.out.println(" MySQL JDBC Driver Not Found!");
            e.printStackTrace();
        } catch (SQLException e) {
            System.out.println(" Database creation/check failed!");
            e.printStackTrace();
        }
    }

    // Method to get a connection to 'campuspass'
    public static Connection getConnection() {
        createDatabaseIfNotExists(); // Ensure DB exists first
        try {
            Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
            System.out.println("Connected to database 'campuspass' successfully!");
            return conn;

        } catch (SQLException e) {
            System.out.println("Database connection failed!");
            e.printStackTrace();
        }
        return null;
    }

    // MAIN method — for testing only
    public static void main(String[] args) {
        getConnection();
    }
}
