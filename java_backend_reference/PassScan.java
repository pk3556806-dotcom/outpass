package java_backend_reference;

// Used by the Security Guard to record pass events
public class PassScan {
    
    private String passId;
    // Type will indicate if it's an EXIT or RETURN event
    private String type; // Expected: "EXIT" or "RETURN"
    
    // Getters and Setters
    public String getPassId() { return passId; }
    public void setPassId(String passId) { this.passId = passId; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}