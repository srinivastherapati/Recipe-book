function toggleForm(formId) {
    // Hide all forms
    document.getElementById('form1').style.display = 'none';
    document.getElementById('form2').style.display = 'none';

    // Show the selected form
    document.getElementById(formId).style.display = 'block';
}

function loginUser(){
    if(document.getElementById("emailLogin").value.trim().length == 0 || document.getElementById("passwordLogin").value.trim().length == 0){
        alert("Please fill all the fields");
        return;
    }
    var email = document.getElementById("emailLogin").value.trim();
    var password = document.getElementById("passwordLogin").value.trim();
    var data = JSON.parse(localStorage.getItem("userData") || "[]") ;
    for(let i=0;i<data.length;i++){
        if(data[i].email == email && data[i].password == password ){
            alert("Login Succesfully");
            window.location.href = "browse-recipe.html";
        }
    }
    alert("Couldn't find a User with this Email, please Sign Up")
}

function signUpUser(){
    if(document.getElementById("emailSignUp").value.trim().length == 0 || document.getElementById("passwordSignUp").value.trim().length == 0 
    || document.getElementById("confirmPasswordSignUp").value.trim().length == 0){
        alert("Please fill all the fields");
        return;
    }
    var data = JSON.parse(localStorage.getItem("userData") ||"[]");
    for(let i=0;i<data.length;i++){
        if(data[i].email == document.getElementById("emailSignUp").value.trim()){
            alert("User Already Exists");
            return;
        }
    }
    if(document.getElementById("passwordSignUp").value!= document.getElementById("confirmPasswordSignUp").value.trim()){
        alert("Passwords don't match");
        return;
    }
    data.push({"email" : document.getElementById("emailSignUp").value.trim(), "password" : document.getElementById("passwordSignUp").value.trim()});
    localStorage.setItem("userData", JSON.stringify(data));
    alert("User Added Successfully");
    window.location.href = "browse-recipe.html";
}