package java_backend_reference;

// Used by the Student to request a new pass
public class PassRequest {
    
    // The student's USN is typically extracted from a session/token, 
    // but for simplicity here, we'll let the client send it.
    private String usn;
    private String studentName;
    private String reason;
    private String date; // Expected format: YYYY-MM-DD
    private String timeOut; // Expected format: HH:MM
    private boolean isEmergency;

    // Getters and Setters (omitted for brevity, but needed for Gson)
    
    public String getUsn() { return usn; }
    public void setUsn(String usn) { this.usn = usn; }
    
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    
    public String getTimeOut() { return timeOut; }
    public void setTimeOut(String timeOut) { this.timeOut = timeOut; }

    public boolean getIsEmergency() { return isEmergency; }
    public void setIsEmergency(boolean isEmergency) { this.isEmergency = isEmergency; }
}