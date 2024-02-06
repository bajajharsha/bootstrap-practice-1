var pw;
var confirmPw;

// Submit event listener on register
$('#myForm').submit((event) => {

    // Prevent the default form submission
    event.preventDefault();

    // Get the password and confirm password values
    pw = document.getElementById("pw").value;

    // regExp for password validation
    var paswd = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;

    // if not same
    if (!paswd.test(pw)) {
        alert("Wrong Password Format")
    } else {
        confirmPwValidation();
    }
})

// pw == confirmPw
function confirmPwValidation() {
    pw = document.getElementById("pw").value;
    confirmPw = document.getElementById("confirm-pw").value;
    // pw == confirm-pw
    if (pw != confirmPw) {
        $(".match-pw").css('display', 'block');
    } else {
        store()
    }
}

// After all validation -> check if user exists -> setItem to localStorage
function store() {

    // getting the current input values
    var fname = $('#fname').val();
    var lname = $('#lname').val();
    var email = $('#email').val();
    var dob = $('#dob').val();
    var gender = $('input[name="gender"]:checked').val()
    // if checkbox is checked -> get val otherwise keep it empty
    var sportsChecked = $('#sportsCheckbox').prop('checked') ? $('#sportsCheckbox').val() : '';
    var readingChecked = $('#readingCheckbox').prop('checked') ? $('#readingCheckbox').val() : '';
    var musicChecked = $('#musicCheckbox').prop('checked') ? $('#musicCheckbox').val() : '';
    var comments = $('#comments').val()

    // single img
    var imgInput = document.getElementById('single-file-upload')
    var imgFile = imgInput.files[0]
    // multiple img
    var imgInputs = document.getElementById('multiple-file-upload');
    var imgFiles = imgInputs.files;

    // storing all the details in an object
    var currentDetails = {
        fname: fname,
        lname: lname,
        email: email,
        dob: dob,
        gender: gender,
        interests: {
            sportsChecked: sportsChecked,
            readingChecked: readingChecked,
            musicChecked: musicChecked
        },
        pw: pw,
        confirmPw: confirmPw,
        comments: comments,
    }


    // storing multiple files
    if (imgFiles.length > 0) {
        currentDetails.imgFiles = [];                    // array to store information about uploaded files into current details
        for (var i = 0; i < imgFiles.length; i++) {      // traversing through multiple uploaded files
            var reader = new FileReader();               // Event handler for when file reading is completed
            reader.onload = function (e) {
                currentDetails.imgFiles.push({           // Add file information to imgFiles array
                    base64: e.target.result
                });
                if (i === imgFiles.length - 1) {         // After all files processed
                    storeInLocalStorage(currentDetails);
                }
            }
            reader.readAsDataURL(imgFiles[i]);
        }
    } else {
        storeInLocalStorage(currentDetails);
    }


    // single file storing
    if (imgFile) {
        var reader = new FileReader();
        reader.onload = function (e) {
            currentDetails.imgBase64 = e.target.result;

            // Continue with storing in localStorage
            storeInLocalStorage(currentDetails);
        };
        reader.readAsDataURL(imgFile);
    } else {
        // If no image selected, proceed without adding imgBase64 to currentDetails
        storeInLocalStorage(currentDetails);
    }


}

function storeInLocalStorage(currentDetails) {
    // get all existing users from localstorage in the form of string
    var existingUsersStr = localStorage.getItem('all_users')


    // if there are existing users then parse it else empty array
    var existingUsersObj = JSON.parse(existingUsersStr) || [];


    // Check if the user with the given email already exists
    // .some => checks a condition in an array then return
    var userExists = existingUsersObj.some((user) => user.email === email);

    if (userExists) {
        alert("User already exists!");
    } else {
        existingUsersObj.push(currentDetails);
        localStorage.setItem('all_users', JSON.stringify(existingUsersObj));
        alert("Registration Successful");
        window.location.href = 'http://127.0.0.1:5500/login.html';
    }
}

// Even handler on login form
$('#loginForm').submit((e) => {
    e.preventDefault(); // Prevent the default form submission
    console.log('Login form submitted');
    var existingDetailsStr = localStorage.getItem('all_users');
    var existingDetails = existingDetailsStr ? JSON.parse(existingDetailsStr) : [];

    var loginEmail = $('#login-email').val();
    var loginPw = $('#login-pw').val();
    // console.log(loginPw)

    // some -> returns boolean after checking some condition 
    var matchFound = existingDetails.some((user) => user.email === loginEmail && user.pw === loginPw);
    console.log(matchFound)
    if (matchFound) {
        alert('You are logged in.');
        window.location.href = 'http://127.0.0.1:5500/display.html';
    } else {
        alert('ERROR: Incorrect username or password.');
    }

})

// displaying details 
function displayDetails() {
    console.log("script loaded")
    var userDetails = JSON.parse(localStorage.getItem('all_users')) || [];
    console.log(userDetails);

    var display = $('#display-users')

    userDetails.forEach((user) => {
        var row = $('<tr>');

        // Add user details to each row
        row.append(
            `
            <td scope="row">${userDetails.indexOf(user) + 1})</td>
            <td scope="row">${user.fname} ${user.lname}</td>
            <td>${user.email}</td>
            <td>${user.dob}</td>
            <td>${user.pw}</td>
            <td>${user.gender}</td>
            <td>${user.interests.sportsChecked} ${user.interests.readingChecked} ${user.interests.musicChecked}</td>
            <td>${user.comments || "N/A"}</td>
            <td><img src="${user.imgBase64 || 'No img'}"style="max-width: 100px; max-height: 100px;"></td>
        `
        );

        // Displaying multiple images
        if (user.imgFiles && user.imgFiles.length > 0) {
            var imgCell = $('<td>');
            user.imgFiles.forEach((img) => {
                imgCell.append(`<img src="${img.base64}" style="max-width: 100px; max-height: 100px;">`);
            });
            row.append(imgCell);
        } else {
            row.append('<td>No images</td>');
        }

        display.append(row);
    });
}

displayDetails();