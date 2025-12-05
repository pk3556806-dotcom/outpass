package java_backend_reference;

import java.sql.Timestamp;

public class Pass {

    private long id;                 // Auto-increment DB id
    private String passId;           // PASS0001, PASS0002...
    private String usn;
    private String studentName;
    private String reason;
    private String date;
    private String timeOut;
    private String status;           // PENDING / APPROVED / REJECTED / USED
    private String rejectionReason;
    private boolean isEmergency;
    private String qrBase64;
    private boolean usedFlag;
    private Timestamp createdAt;
    private Timestamp exitedAt;
    private Timestamp returnedAt;

    // ------------------ CONSTRUCTOR ------------------
    public Pass(long id, String passId, String usn, String studentName, String reason,
                String date, String timeOut, String status, String rejectionReason,
                boolean isEmergency, String qrBase64, boolean usedFlag,
                Timestamp createdAt, Timestamp exitedAt, Timestamp returnedAt) {

        this.id = id;
        this.passId = passId;
        this.usn = usn;
        this.studentName = studentName;
        this.reason = reason;
        this.date = date;
        this.timeOut = timeOut;
        this.status = status;
        this.rejectionReason = rejectionReason;
        this.isEmergency = isEmergency;
        this.qrBase64 = qrBase64;
        this.usedFlag = usedFlag;
        this.createdAt = createdAt;
        this.exitedAt = exitedAt;
        this.returnedAt = returnedAt;
    }

    

    // ------------------ GETTERS & SETTERS ------------------
    
    public long getId() { return id; }
    public void setId(long id) { this.id = id; }

    public String getPassId() { return passId; }
    public void setPassId(String passId) { this.passId = passId; }

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

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public boolean getIsEmergency() { return isEmergency; }
    public void setIsEmergency(boolean isEmergency) { this.isEmergency = isEmergency; }

    public String getQrBase64() { return qrBase64; }
    public void setQrBase64(String qrBase64) { this.qrBase64 = qrBase64; }

    public boolean isUsedFlag() { return usedFlag; }
    public void setUsedFlag(boolean usedFlag) { this.usedFlag = usedFlag; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public Timestamp getExitedAt() { return exitedAt; }
    public void setExitedAt(Timestamp exitedAt) { this.exitedAt = exitedAt; }

    public Timestamp getReturnedAt() { return returnedAt; }
    public void setReturnedAt(Timestamp returnedAt) { this.returnedAt = returnedAt; }
}
