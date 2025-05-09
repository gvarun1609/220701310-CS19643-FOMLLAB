let myChart = null;
const gaugeCharts = {};

document.getElementById("predictForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  const data = {
    Voltage: parseFloat(form.Voltage.value),
    Current: parseFloat(form.Current.value),
    Temperature: parseFloat(form.Temperature.value),
    Charge_Cycles_Completed: parseInt(form.Charge_Cycles_Completed.value),
    Total_Cycle_Life: parseInt(form.Total_Cycle_Life.value)
  };

  

  try {
    const res = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    const predicted = result.remaining_life;
    const maxLife = 1000;

    updateResultText(predicted);
    drawChart(predicted, maxLife);
    drawGauge("voltageGauge", "Voltage (V)", data.Voltage, 0, 100);
    drawGauge("currentGauge", "Current (A)", data.Current, 0, 100);
    drawGauge("tempGauge", "Temperature (°C)", data.Temperature, 0, 100);
    drawGauge("cyclesGauge", "Cycles Used", data.Charge_Cycles_Completed, 0, data.Total_Cycle_Life);
  } catch (error) {
    document.getElementById("result").innerText = "Error predicting life. Please try again.";
  }
});

function updateResultText(predicted) {
  const result = document.getElementById("result");
  result.innerText = `Remaining Cycle Life: ${predicted}`;

  if (predicted < 100) {
    result.style.color = "red";
    result.innerText += " (Service immediately)";
  } else if (predicted < 300) {
    result.style.color = "orange";
    result.innerText += " (Service within a week)";
  } else {
    result.style.color = "green";
    result.innerText += " (Battery is healthy)";
  }
}

function drawChart(predicted, maxLife) {
  const ctx = document.getElementById('lifeChart').getContext('2d');
  if (myChart) myChart.destroy();

  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Cycle Life'],
      datasets: [
        {
          label: 'Used Life',
          data: [maxLife - predicted],
          backgroundColor: '#d63031',
        },
        {
          label: 'Remaining Life',
          data: [predicted],
          backgroundColor: '#00cec9',
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          enabled: true
        }
      },
      scales: {
        x: {
          stacked: true,
          max: maxLife,
          title: {
            display: true,
            text: 'Cycle Count'
          }
        },
        y: {
          stacked: true
        }
      }
    }
  });
}

function drawGauge(canvasId, label, value, min, max) {
  const ctx = document.getElementById(canvasId).getContext("2d");
  if (gaugeCharts[canvasId]) gaugeCharts[canvasId].destroy();

  gaugeCharts[canvasId] = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: [label, ""],
      datasets: [{
        label: label,
        data: [value, max - value],
        backgroundColor: ['#00cec9', '#dfe6e9'],
        borderWidth: 0,
        cutout: '80%'
      }]
    },
    options: {
      maintainAspectRatio: false,
      rotation: -90,
      circumference: 180,
      responsive: true,
      plugins: {
        tooltip: { enabled: false },
        legend: {
          display: false
        }
      }
    }
  });
}
