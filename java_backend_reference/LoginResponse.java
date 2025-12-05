package java_backend_reference;

// Used to return a structured JSON response to the client
public class LoginResponse {
    
    private boolean success;
    private String message;
    private String role;
    private String name;
    private String identifier; // USN, Warden Username, or Guard ID

    public LoginResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    // Getters and Setters (needed for Gson to serialize the fields)

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }
}