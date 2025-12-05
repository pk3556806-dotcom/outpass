package java_backend_reference;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class AuthService {

    // -------------------------------
    // STUDENT LOGIN
    // -------------------------------
    public Student loginStudent(String usn, String password) {
        String query = "SELECT * FROM students WHERE usn = ? AND password = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, usn);
            stmt.setString(2, password);

            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return new Student(
                        rs.getString("usn"),
                        rs.getString("name"),
                        rs.getString("password"),
                        rs.getString("department"),
                        rs.getInt("semester"),
                        rs.getString("phone")
                );
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return null; // login failed
    }


    // -------------------------------
    // WARDEN LOGIN
    // -------------------------------
    public Warden loginWarden(String username, String password) {
        String query = "SELECT * FROM wardens WHERE username = ? AND password = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, username);
            stmt.setString(2, password);

            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return new Warden(
                        rs.getString("username"),
                        rs.getString("name"),
                        rs.getString("password")
                );
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }


    // -------------------------------
    // SECURITY GUARD LOGIN
    // -------------------------------
    public SecurityGuard loginSecurity(String guardId, String password) {
        String query = "SELECT * FROM security_guards WHERE guard_id = ? AND password = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, guardId);
            stmt.setString(2, password);

            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return new SecurityGuard(
                        rs.getString("guard_id"),
                        rs.getString("name"),
                        rs.getString("password")
                );
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }
}
