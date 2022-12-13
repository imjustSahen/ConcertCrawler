//Contact Form JS

let formHistory = JSON.parse(localStorage.getItem("")) || [];



$("#formBtn").on("click", function(event) {
    event.preventDefault();

    var inputName = document.querySelector("#name").value;
    var inputEmail = document.querySelector("#email").value;
    var inputMessage = document.querySelector("#message").value.trim();

  let form = {
    Name: inputName,
    Email: inputEmail,
    Message: inputMessage,
  }

    formHistory.push(form)
    window.localStorage.setItem("Form Submissions", JSON.stringify(formHistory));

    $("#name").val("");
    $("#email").val("");
    $("#message").val("");

    $("#alert").removeClass("hidden");
    $("#alert").addClass("visible");
    $("#alert").append("<h1> Thank you for your feedback");
    

  console.log(form);
});
