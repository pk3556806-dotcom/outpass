package java_backend_reference;

public class Student {

    private String usn;
    private String name;
    private String password;
    private String department;
    private int semester;
    private String phone;

    public Student(String usn, String name, String password, String department, int semester, String phone) {
        this.usn = usn;
        this.name = name;
        this.password = password;
        this.department = department;
        this.semester = semester;
        this.phone = phone;
    }

    public String getUsn() {
        return usn;
    }

    public void setUsn(String usn) {
        this.usn = usn;
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

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public int getSemester() {
        return semester;
    }

    public void setSemester(int semester) {
        this.semester = semester;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
