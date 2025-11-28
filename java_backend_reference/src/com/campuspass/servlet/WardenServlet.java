package com.campuspass.servlet;

import com.campuspass.util.DBConnection;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/api/warden/*")
public class WardenServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String path = request.getPathInfo();
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        if ("/approve".equals(path)) {
            updateStatus(request, out, "APPROVED");
        } else if ("/reject".equals(path)) {
            updateStatus(request, out, "REJECTED");
        }
    }

    private void updateStatus(HttpServletRequest request, PrintWriter out, String status) {
        String passId = request.getParameter("passId");
        
        try (Connection conn = DBConnection.getConnection()) {
            String sql = "UPDATE outpass_requests SET status = ? WHERE pass_id = ?";
            PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, status);
            pstmt.setString(2, passId);
            
            int result = pstmt.executeUpdate();
            if (result > 0) {
                // If Approved, you might trigger QR generation here or let the frontend generate it from the ID
                out.print("{\"status\": \"success\", \"message\": \"Pass " + status + "\"}");
            } else {
                out.print("{\"status\": \"error\", \"message\": \"Update failed\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
