package com.campuspass.servlet;

import com.campuspass.util.DBConnection;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONObject;

@WebServlet("/api/security/*")
public class SecurityServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String path = request.getPathInfo();
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        if ("/scan".equals(path)) {
            validatePass(request, out);
        } else if ("/mark-used".equals(path)) {
            markAsUsed(request, out);
        }
    }

    private void validatePass(HttpServletRequest request, PrintWriter out) {
        String passId = request.getParameter("passId");
        String usn = request.getParameter("usn");

        try (Connection conn = DBConnection.getConnection()) {
            String sql = "SELECT * FROM outpass_requests WHERE pass_id = ? AND usn = ?";
            PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, passId);
            pstmt.setString(2, usn);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                String status = rs.getString("status");
                JSONObject json = new JSONObject();
                
                if ("APPROVED".equals(status)) {
                    json.put("valid", true);
                    json.put("message", "ALLOW ENTRY/EXIT");
                    json.put("studentName", "Fetched Name"); // Join with students table to get name
                } else if ("USED".equals(status)) {
                    json.put("valid", false);
                    json.put("message", "ALREADY USED");
                } else {
                    json.put("valid", false);
                    json.put("message", "INVALID STATUS: " + status);
                }
                out.print(json.toString());
            } else {
                out.print("{\"valid\": false, \"message\": \"INVALID PASS ID OR USN\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void markAsUsed(HttpServletRequest request, PrintWriter out) {
        String passId = request.getParameter("passId");

        try (Connection conn = DBConnection.getConnection()) {
            String sql = "UPDATE outpass_requests SET status = 'USED' WHERE pass_id = ? AND status = 'APPROVED'";
            PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, passId);
            
            int result = pstmt.executeUpdate();
            if (result > 0) {
                out.print("{\"status\": \"success\", \"message\": \"Pass marked as USED\"}");
            } else {
                out.print("{\"status\": \"error\", \"message\": \"Could not mark as used\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
