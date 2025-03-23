const ctx = document.getElementById("travelChart").getContext("2d");

const trendData = {
    labels: ["2019", "2020", "2021", "2022", "2023", "2024"],
    datasets: [
    {
        label: "Wenecja",
        data: [60, 40, 20, 50, 70, 85],
        borderColor: "#3B71CA",
        backgroundColor: "#3B71CA",
        fill: false,
        tension: 0.3
    },
    {
        label: "Wyspy Owcze",
        data: [10, 15, 20, 30, 35, 50],
        borderColor: "#14A44D",
        backgroundColor: "#14A44D",
        fill: false,
        tension: 0.3
    },
    {
        label: "Grenlandia",
        data: [5, 8, 12, 20, 28, 33],
        borderColor: "#E4A11B",
        backgroundColor: "#E4A11B",
        fill: false,
        tension: 0.3
    },
    {
        label: "Gruzja",
        data: [20, 25, 30, 45, 65, 80],
        borderColor: "#DC4C64",
        backgroundColor: "#DC4C64",
        fill: false,
        tension: 0.3
    },
    {
        label: "Morskie Oko",
        data: [40, 45, 50, 55, 60, 70],
        borderColor: "#54B4D3",
        backgroundColor: "#54B4D3",
        fill: false,
        tension: 0.3
    },
    {
        label: "Psie Pole",
        data: [15, 20, 25, 30, 55, 95],
        borderColor: "#AA336A",
        backgroundColor: "#AA336A",
        fill: false,
        tension: 0.3
    }
    ]
};

const barData = {
    labels: ["Wenecja", "Wyspy Owcze", "Grenlandia", "Gruzja", "Morskie Oko", "Psie Pole"],
    datasets: [
    {
        label: "Liczba rezerwacji",
        data: [65, 40, 30, 75, 55, 90],
        backgroundColor: [
        "#3B71CA",
        "#14A44D",
        "#E4A11B",
        "#DC4C64",
        "#54B4D3",
        "#AA336A"
        ],         
        hoverBackgroundColor: [
        "#1f4c91", 
        "#0b5d30",
        "#9c720f",
        "#942c3e", 
        "#2e7a95", 
        "#702963"  
        ],
        borderRadius: 5
    }
    ]
};

const lineOptions = {
    responsive: true,
    plugins: {
    legend: {
        position: "bottom"
    },
    tooltip: {
        mode: "index",
        intersect: false
    }
    },
    interaction: {
    mode: "nearest",
    axis: "x",
    intersect: false
    },
    scales: {
    y: {
        beginAtZero: true,
        title: {
        display: true,
        text: "Liczba rezerwacji"
        }
    },
    x: {
        title: {
        display: true,
        text: "Rok / Kierunek"
        },
    }
    }
};

const barOptions = {
    responsive: true,
    plugins: {
    legend: {
        position: "bottom"
    },
    tooltip: {
        mode: "index",
        intersect: false
    }
    },
    interaction: {
    mode: "nearest",
    axis: "x",
    intersect: false
    },
    scales: {
    y: {
        beginAtZero: true,
        title: {
        display: true,
        text: "Liczba rezerwacji"
        }
    },
    x: {
        offset: true,
        title: {
        display: true,
        text: "Rok / Kierunek"
        },
    }
    }
};

let currentChart = new Chart(ctx, {
    type: "line",
    data: trendData,
    options: lineOptions
});

document.getElementById("trendBtn").addEventListener("click", () => {
    updateChart("line", trendData);
    toggleButtons("trend");
});

document.getElementById("popularBtn").addEventListener("click", () => {
    updateChart("bar", barData);
    toggleButtons("popular");
});

function updateChart(type, data) {
    currentChart.destroy();
    const options = type === "bar" ? barOptions : lineOptions;
    currentChart = new Chart(ctx, {
    type: type,
    data: data,
    options: options
    });
}

function toggleButtons(active) {
    const trendBtn = document.getElementById("trendBtn");
    const popularBtn = document.getElementById("popularBtn");

    if (active === "trend") {
    trendBtn.classList.add("btn-primary");
    trendBtn.classList.remove("btn-outline-primary");
    popularBtn.classList.remove("btn-primary");
    popularBtn.classList.add("btn-outline-primary");
    } else {
    popularBtn.classList.add("btn-primary");
    popularBtn.classList.remove("btn-outline-primary");
    trendBtn.classList.remove("btn-primary");
    trendBtn.classList.add("btn-outline-primary");
    }
}
