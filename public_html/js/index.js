const BASE_URL = "http://api.login2explore.com:5577";
const DB_NAME = "SCHOOL-DB";
const RELATION_NAME = "STUDENT-TABLE";
const CONNECTION_TOKEN = "90934638|-31949206324093620|90956439";

function disableAll() {
    $("#rollNo, #fullName, #studentClass, #birthDate, #address, #enrollDate").prop("disabled", true);
    $("#save, #update, #reset").prop("disabled", true);
}

function resetForm() {
    $("#rollNo").val("").prop("disabled", false);
    $("#fullName, #studentClass, #birthDate, #address, #enrollDate").val("").prop("disabled", true);
    $("#save, #update, #reset").prop("disabled", true);
    $("#rollNo").focus();
}

function fillForm(data) {
    $("#fullName").val(data["Full-Name"]);
    $("#studentClass").val(data["Class"]);
    $("#birthDate").val(data["Birth-Date"]);
    $("#address").val(data["Address"]);
    $("#enrollDate").val(data["Enrollment-Date"]);
}

function getStudentData() {
    let rollNo = $("#rollNo").val().trim();
    if (rollNo === "") {
        alert("Roll No is required");
        return;
    }

    let getReq = createGET_BY_KEYRequest(CONNECTION_TOKEN, DB_NAME, RELATION_NAME, JSON.stringify({"Roll-No": rollNo}));
    jQuery.ajaxSetup({async: false});
    let res = executeCommandAtGivenBaseUrl(getReq, BASE_URL, "/api/irl");
    jQuery.ajaxSetup({async: true});

    let result = JSON.parse(res);

    if (result.status === 400) {
        // Roll No doesn't exist — enable data entry
        $("#rollNo").prop("disabled", true);
        $("#fullName, #studentClass, #birthDate, #address, #enrollDate").prop("disabled", false);
        $("#save, #reset").prop("disabled", false);
        $("#update").prop("disabled", true);
        $("#fullName").focus();
    } else if (result.status === 200) {
        let data = JSON.parse(result.data).record;
        fillForm(data);
        localStorage.setItem("rec_no", JSON.parse(result.data).rec_no);

        $("#rollNo").prop("disabled", true);
        $("#fullName, #studentClass, #birthDate, #address, #enrollDate").prop("disabled", false);
        $("#save").prop("disabled", false); // Optional: keep Save enabled for retry
        $("#update, #reset").prop("disabled", false);
        $("#fullName").focus();
    }
}

function saveForm() {
    let rollNo = $("#rollNo").val().trim();
    let fullName = $("#fullName").val().trim();
    let studentClass = $("#studentClass").val().trim();
    let birthDate = $("#birthDate").val().trim();
    let address = $("#address").val().trim();
    let enrollDate = $("#enrollDate").val().trim();

    if (!rollNo || !fullName || !studentClass || !birthDate || !address || !enrollDate) {
        alert("All fields are required.");
        return;
    }

    let jsonData = JSON.stringify({
        "Roll-No": rollNo,
        "Full-Name": fullName,
        "Class": studentClass,
        "Birth-Date": birthDate,
        "Address": address,
        "Enrollment-Date": enrollDate
    });

    let putReq = createPUTRequest(CONNECTION_TOKEN, jsonData, DB_NAME, RELATION_NAME);
    jQuery.ajaxSetup({async: false});
    let res = executeCommandAtGivenBaseUrl(putReq, BASE_URL, "/api/iml");
    jQuery.ajaxSetup({async: true});

    alert("Record saved!");
    resetForm();
}

function updateForm() {
    let rec_no = localStorage.getItem("rec_no");
    let jsonData = JSON.stringify({
        "Roll-No": $("#rollNo").val(),
        "Full-Name": $("#fullName").val(),
        "Class": $("#studentClass").val(),
        "Birth-Date": $("#birthDate").val(),
        "Address": $("#address").val(),
        "Enrollment-Date": $("#enrollDate").val()
    });

    let updateReq = createUPDATERecordRequest(CONNECTION_TOKEN, jsonData, DB_NAME, RELATION_NAME, rec_no);
    jQuery.ajaxSetup({async: false});
    let res = executeCommandAtGivenBaseUrl(updateReq, BASE_URL, "/api/iml");
    jQuery.ajaxSetup({async: true});

    alert("Record updated!");
    resetForm();
}
