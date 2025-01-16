let predictFishSpeciesInterval = "";
let updateChartDataInterval = "";

function autoPredictFishSpecies() {
  console.log("** autoPredictFishSpecies **")
  let realTimePh = 0, realTimeTemp = 0, realTimeTurb = 0;

  $.ajax({
    url: "http://127.0.0.1:8000/sensor-data/get/last",
    method: "GET",
    success: (res) => {
      console.log("res-s", res)
      realTimePh = res.ph;
      realTimeTemp = res.temp;
      realTimeTurb = res.turbidity;

      $.ajax({
        url: "http://127.0.0.1:8000/predict",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ ph: realTimePh, temp: realTimeTemp, turbidity: realTimeTurb }),
        success: (res) => {
          console.log("res-p", res)
          let name = res.single;
          let others = "";
          res["other"].forEach((element) => {
            if (element != name) {
              if (others != "") others += ", ";
              others += element;
            }
          });

          $("#realTimePhData").text(`PH : ${realTimePh}`);
          $("#realTimeTempData").text(`Temperature : ${realTimeTemp}`);
          $("#realTimeTurbData").text(`Turbidity : ${realTimeTurb}`);

          $("#predictedFishTitle").text("Predicted fish species");
          $("#predictedFishTitle2").text("Possible fish species");
          $("#predictedFishNameId").text(name);
          $("#possibleFishTitle").text(others);

          $("#fish_image").css("display", "block");
          $("#fish_image").attr("src", `./res/fish_img/${name}.jpg`);
        }, //success
      }); //ajax
    }, //success
  }); //ajax
}

function loadingText() {
  console.log("Fetching...")
  $("#loading").text(".")
  setTimeout(() => {
    $("#loading").text("..")
    setTimeout(() => {
      $("#loading").text("...")
      setTimeout(() => {
        $("#loading").text("")
        setTimeout(() => loadingText(), 1000);
      }, 1000);
    }, 1000);
  }, 1000);
}
loadingText();

// -------------

var phMin = 0;
var phMax = 0;
var tempMin = 0;
var tempMax = 0;
var turbMin = 0;
var turbMax = 0;

$("#navTab1").on("click", () => {
  clearInterval(predictFishSpeciesInterval)
  clearInterval(updateChartDataInterval)

  $("#navTab1").addClass("active");
  $("#navTab2").removeClass("active");
  $("#navTab3").removeClass("active");
  $("#navTab4").removeClass("active");

  $.ajax({
    url: "http://127.0.0.1:8000/get-min-max",
    method: "GET",
    success: (res) => {
      console.log("res", res)
      phMin = res.phMin;
      phMax = res.phMax;
      tempMin = res.tempMin;
      tempMax = res.tempMax;
      turbMin = res.turbidityMin;
      turbMax = res.turbidityMax;

      let content = `
    <div class="form">
                    <div class="inputbox">
                        <input type="text" required id="input-ph" name="ph">
                        <label>PH (${phMin}-${phMax})</label>
                    </div>
                    <div class="inputbox">
                        <input type="text" required id="input-temp" name="temp">
                        <label>Temperature (${tempMin}-${tempMax})</label>
                    </div>
                    <div class="inputbox">
                    <input type="text" required id="input-turb" name="turb">
                        <label>Turbidity (${turbMin}-${turbMax})</label>
                        </div>
                        <button class="predictBtn" onclick="predictSpecies()">Predict species</button>
                </div>
                <!-- .form -->
                
                <div class="resultBox">
                <p class="txt1" id="predictedFishTitle">No Result</p>
                <p class="txt2" id="predictedFishNameId"></p>
                <img src="./res/fish_img/katla.jpg" id="fish_image">
                <div class="txt1" id="predictedFishTitle2"></div>
                <div class="posibleName" id="possibleFishTitle"></div>
                </div>
                <!-- .resultBox -->
`;
      $("#subBox").html(content);
    }, //success
  }); //ajax
});

$("#navTab1").click();

$("#navTab2").on("click", () => {
  clearInterval(predictFishSpeciesInterval)
  clearInterval(updateChartDataInterval)

  $("#navTab2").addClass("active");
  $("#navTab1").removeClass("active");
  $("#navTab3").removeClass("active");
  $("#navTab4").removeClass("active");
  $.ajax({
    url: "http://127.0.0.1:8000/get-fish-name",
    method: "GET",
    success: (res) => {
      let arr = res.split("-");

      let content = `
            <div class="form2">
            <div class="inputbox">
                <p class="label">Select fish species</p>
                <input type="text" placeholder="--select--" id="inputSelectFish">
                <ul id="opt-inputSelectFish">
                `;
      arr.forEach((element) => {
        content += `<li onclick='setOptValue("inputSelectFish","${element}")'>${element}</li>`;
      });
      content += `
                </ul>
            </div>
            <button class="predictBtn" onclick="predictEnvironment()">Predict environment</button>
            </div>
            <!-- .form2 -->
            
            <div class="resultBox2">
            <div class="h1">Aquatic environment</div>
            <div class="txt" id="showEnvironmentValue">
                <p>No result</p>
            </div>
            </div>
            <!-- .resultBox2 -->
            `;
      $("#subBox").html(content);

      setTimeout(() => {
        $("#inputSelectFish").on("focus", () => {
          $("#opt-inputSelectFish").css("display", "block");
        });
        $("#inputSelectFish").on("blur", () => {
          setTimeout(() => {
            $("#opt-inputSelectFish").css("display", "none");
          }, 250);
        });
      }, 500);
    }, //success
  }); //ajax
});

$("#navTab3").on("click", () => {
  predictFishSpeciesInterval = setInterval(autoPredictFishSpecies, 1000);
  clearInterval(updateChartDataInterval)

  $("#navTab3").addClass("active");
  $("#navTab1").removeClass("active");
  $("#navTab2").removeClass("active");
  $("#navTab4").removeClass("active");
  $.ajax({
    url: "http://127.0.0.1:8000/get-fish-name",
    method: "GET",
    success: (res) => {
      let content = `
      <div class="realTimeSectionCol1">
      <div class="h1">Fetching Sensor values<span id="loading"></span></div>
      <div class="txt" id="showEnvironmentValue">
          <p id="realTimePhData">PH : 0</p>
          <p id="realTimeTempData">Temperature : 0</p>
          <p id="realTimeTurbData">Turbidity : 0</p>
      </div>
  </div>
  <!-- .realTimeSectionCol1 -->

  <div class="resultBox">
      <p class="txt1" id="predictedFishTitle">No Result</p>
      <p class="txt2" id="predictedFishNameId"></p>
      <img src="../res/fish_img/katla.jpg" id="fish_image">
      <div class="txt1" id="predictedFishTitle2"></div>
      <div class="posibleName" id="possibleFishTitle"></div>
  </div>
  <!-- .resultBox -->
            `;
      $("#subBox").html(content);

      setTimeout(() => {
        $("#inputSelectFish").on("focus", () => {
          $("#opt-inputSelectFish").css("display", "block");
        });
        $("#inputSelectFish").on("blur", () => {
          setTimeout(() => {
            $("#opt-inputSelectFish").css("display", "none");
          }, 250);
        });
      }, 500);
    }, //success
  }); //ajax
});

var setOptValue = (inputID, value) => {
  $("#" + inputID).val(value);
};

$("#navTab4").on("click", () => {
  clearInterval(predictFishSpeciesInterval)

  $("#navTab4").addClass("active");
  $("#navTab1").removeClass("active");
  $("#navTab2").removeClass("active");
  $("#navTab3").removeClass("active");
  $("#subBox").html(`
  <div style="width:100%">
  <canvas id="myChart" style="width:100%;max-width:600px"></canvas>
  <br>
  <div>
    <div class="lineTag">
      <div class="line"></div>
      <div class="label">PH</div>
    </div>
    <div class="lineTag">
      <div class="line" style="background:red"></div>
      <div class="label">Temparatuee</div>
    </div>
    <div class="lineTag">
      <div class="line" style="background:green"></div>
      <div class="label">Turbidity</div>
    </div>
  </div>
  </div>
  `);
  updateChartData();
});

function updateChartData() {
  console.log("** updateChartData **")
  $.ajax({
    url: "http://127.0.0.1:8000/chart-values",
    method: "GET",
    success: (res) => {

      const xValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      const data1 = res.ph.reverse();
      const data2 = res.temp.reverse();
      const data3 = res.turb.reverse();

      const ctx = document.getElementById("myChart").getContext("2d");

      const myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: xValues,
          datasets: [{
            data: data1,
            borderColor: "blue",
            fill: false
          }, {
            data: data2,
            borderColor: "red",
            fill: false
          }, {
            data: data3,
            borderColor: "green",
            fill: false
          }]
        },
        options: {
          legend: { display: false }
        }
      });

      function updateData() {
        console.log("** updateChartData **")
        $.ajax({
          url: "http://127.0.0.1:8000/chart-values",
          method: "GET",
          success: (res) => {
            myChart.data.datasets[0].data = res.ph.reverse();
            myChart.data.datasets[1].data = res.temp.reverse();
            myChart.data.datasets[2].data = res.turb.reverse();
            myChart.update();
          }, //success
        }); //ajax
      }
      updateChartDataInterval = setInterval(updateData, 1000);
    }, //success
  }); //ajax
}