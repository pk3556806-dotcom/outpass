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
import javax.servlet.http.HttpSession;
import org.json.JSONObject; // You'll need org.json library

@WebServlet("/api/student/*")
public class StudentServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String path = request.getPathInfo();
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        if ("/login".equals(path)) {
            handleLogin(request, out);
        } else if ("/apply".equals(path)) {
            handleApply(request, out);
        }
    }
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
         // Handle fetching pass history
    }

    private void handleLogin(HttpServletRequest request, PrintWriter out) {
        // Read JSON body (omitted for brevity, assuming standard parsing)
        String usn = request.getParameter("usn"); 
        String password = request.getParameter("password");

        try (Connection conn = DBConnection.getConnection()) {
            String sql = "SELECT * FROM students WHERE usn = ? AND password = ?";
            PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, usn);
            pstmt.setString(2, password);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                JSONObject json = new JSONObject();
                json.put("status", "success");
                json.put("role", "STUDENT");
                json.put("name", rs.getString("name"));
                out.print(json.toString());
            } else {
                out.print("{\"status\": \"error\", \"message\": \"Invalid credentials\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            out.print("{\"status\": \"error\", \"message\": \"Database error\"}");
        }
    }

    private void handleApply(HttpServletRequest request, PrintWriter out) {
        String usn = request.getParameter("usn");
        String reason = request.getParameter("reason");
        String date = request.getParameter("date");
        String time = request.getParameter("time");
        
        // Generate Pass ID logic here (e.g., PASS + Sequence)
        String passId = "PASS" + System.currentTimeMillis(); 

        try (Connection conn = DBConnection.getConnection()) {
            String sql = "INSERT INTO outpass_requests (pass_id, usn, reason, date, time_out, status) VALUES (?, ?, ?, ?, ?, 'PENDING')";
            PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, passId);
            pstmt.setString(2, usn);
            pstmt.setString(3, reason);
            pstmt.setString(4, date);
            pstmt.setString(5, time);
            
            int result = pstmt.executeUpdate();
            if (result > 0) {
                out.print("{\"status\": \"success\", \"message\": \"Pass applied successfully\"}");
            } else {
                out.print("{\"status\": \"error\", \"message\": \"Failed to apply\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
