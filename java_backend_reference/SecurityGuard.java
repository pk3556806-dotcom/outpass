package java_backend_reference;

public class SecurityGuard {

    private String guardId;
    private String name;
    private String password;

    public SecurityGuard(String guardId, String name, String password) {
        this.guardId = guardId;
        this.name = name;
        this.password = password;
    }

    public String getGuardId() {
        return guardId;
    }

    public void setGuardId(String guardId) {
        this.guardId = guardId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
