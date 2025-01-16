const predictSpecies = () => {
  let ph = $("#input-ph").val();
  let temp = $("#input-temp").val();
  let turb = $("#input-turb").val();

  if (ph == "" || ph < phMin || ph > phMax)
    alert(`PH must be between ${phMin} to ${phMax}`);
  else if (temp == "" || temp < tempMin || temp > tempMax)
    alert(`Temperature must be between ${tempMin} to ${tempMax}, now ${temp}`);
  else if (turb == "" || turb < turbMin || turb > turbMax)
    alert(`Turbidity must be between ${turbMin} to ${turbMax}`);
  else {
    $.ajax({
      url: "http://127.0.0.1:8000/predict",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ ph: ph, temp: temp, turbidity: turb }),
      success: (res) => {
        console.log("res-p", res);
        let name = res.single;
        let others = "";
        res["other"].forEach((element) => {
          if (element != name) {
            if (others != "") others += ", ";
            others += element;
          }
        });

        $("#predictedFishTitle").text("Predicted fish species");
        $("#predictedFishTitle2").text("Possible fish species");
        $("#predictedFishNameId").text(name);
        $("#possibleFishTitle").text(others);

        $("#fish_image").css("display", "block");
        $("#fish_image").attr("src", `./res/fish_img/${name}.jpg`);
      }, //success
    }); //ajax
  }
};
//
const predictEnvironment = () => {
  let fname = $("#inputSelectFish").val();
  $.ajax({
    url: "http://127.0.0.1:8000/get-value-for-a-fish",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ name: fname }),
    success: (res) => {
      let content = `
            <p>PH : ${res.phRange}</p>
            <p>Temperature : ${res.tempRange}</p>
            <p>Turbidity : ${res.turbRange}</p>
            `;
      $("#showEnvironmentValue").html(content);
    }, //success
  }); //ajax
};
