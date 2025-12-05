package java_backend_reference;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class PassService {

    // ---------------------------------------------
    // WARDEN FUNCTIONALITY
    // ---------------------------------------------

    /**
     * Retrieves all PENDING passes for the warden to review.
     */
    public List<Pass> getPendingPasses() {
        List<Pass> pendingPasses = new ArrayList<>();
        String query = "SELECT * FROM passes WHERE status = 'PENDING' ORDER BY created_at ASC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                pendingPasses.add(mapResultSetToPass(rs));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return pendingPasses;
    }

    /**
     * Updates the status of a pass (APPROVE or REJECT).
     */
    public boolean updatePassStatus(long passId, String status, String rejectionReason) {
        // We will also update the used_flag to TRUE here if APPROVED, so the security can scan it.
        // For this simple example, we'll keep the logic clean and only update STATUS and REASON.
        String query = "UPDATE passes SET status = ?, rejection_reason = ? WHERE id = ?";
        
        // Basic validation for status
        if (!status.equals("APPROVED") && !status.equals("REJECTED")) {
            return false;
        }

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, status);
            // Rejection reason is only set for REJECTED status, otherwise it's null
            stmt.setString(2, status.equals("REJECTED") ? rejectionReason : null);
            stmt.setLong(3, passId);

            int affectedRows = stmt.executeUpdate();
            return affectedRows > 0;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    // ---------------------------------------------
    // STUDENT FUNCTIONALITY
    // ---------------------------------------------

    /**
     * Student creates a new pass request.
     */
    public boolean createPass(PassRequest req) {
        // Generate a unique pass ID (e.g., PASS + current timestamp)
        String newPassId = "PASS" + System.currentTimeMillis();
        
        // Note: status automatically defaults to 'PENDING' in the DB (from schema.sql)
        String query = "INSERT INTO passes (pass_id, usn, student_name, reason, date, time_out, is_emergency) VALUES (?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, newPassId);
            stmt.setString(2, req.getUsn());
            stmt.setString(3, req.getStudentName());
            stmt.setString(4, req.getReason());
            stmt.setString(5, req.getDate());
            stmt.setString(6, req.getTimeOut());
            stmt.setBoolean(7, req.getIsEmergency());

            int affectedRows = stmt.executeUpdate();
            return affectedRows > 0;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Retrieves all passes requested by a specific student.
     */
    public List<Pass> getPassesByUsn(String usn) {
        List<Pass> passes = new ArrayList<>();
        String query = "SELECT * FROM passes WHERE usn = ? ORDER BY created_at DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, usn);
            
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    passes.add(mapResultSetToPass(rs));
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return passes;
    }


    // ---------------------------------------------
    // SECURITY GUARD FUNCTIONALITY (MERGED)
    // ---------------------------------------------
    
    /**
     * Security Guard scans a pass to record EXIT or RETURN time.
     */
    public boolean recordPassEvent(String passId, String eventType) {
        
        String query;
        if (eventType.equalsIgnoreCase("EXIT")) {
            // Only allow EXIT if the status is APPROVED (The student must be checked out at the gate)
            // Note: We set status to 'USED' (for simplicity) and record exited_at time.
            query = "UPDATE passes SET status = 'USED', exited_at = CURRENT_TIMESTAMP WHERE pass_id = ? AND status = 'APPROVED'";
        } else if (eventType.equalsIgnoreCase("RETURN")) {
            // Only allow RETURN if the status is USED (meaning they previously exited)
            query = "UPDATE passes SET returned_at = CURRENT_TIMESTAMP WHERE pass_id = ? AND status = 'USED'";
        } else {
            return false; // Invalid event type
        }

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, passId);

            int affectedRows = stmt.executeUpdate();
            return affectedRows > 0;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    // ---------------------------------------------
    // HELPER METHOD
    // ---------------------------------------------

    // Helper method to map a ResultSet row to a Pass object
    private Pass mapResultSetToPass(ResultSet rs) throws Exception {
        return new Pass(
            rs.getLong("id"),
            rs.getString("pass_id"),
            rs.getString("usn"),
            rs.getString("student_name"),
            rs.getString("reason"),
            rs.getString("date"),
            rs.getString("time_out"),
            rs.getString("status"),
            rs.getString("rejection_reason"),
            rs.getBoolean("is_emergency"),
            rs.getString("qr_base64"),
            rs.getBoolean("used_flag"),
            rs.getTimestamp("created_at"),
            rs.getTimestamp("exited_at"),
            rs.getTimestamp("returned_at")
        );
    }
}