let formHistory = JSON.parse(localStorage.getItem("")) || [];

$("#formBtn").on("click", function(event) {
    var inputName = document.querySelector("#name").value;
    var inputEmail = document.querySelector("#email").value;
    var inputMessage = document.querySelector("#message").value.trim();
    let form = {
      Name: inputName,
      Email: inputEmail,
      Message: inputMessage,
    };

    if (inputName == "" || inputEmail == "" || inputMessage == "") {
      return;
    } else {
      event.preventDefault();
      formHistory.push(form);
      window.localStorage.setItem("Form Submissions", JSON.stringify(formHistory));
       
      $('[type=text]').each(function() {
        $(this).val('');
      })
    
       $("#alert").removeClass("hidden").addClass("visible").append("<h1> Thank you for your feedback");
    }
  });
