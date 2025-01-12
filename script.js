todaysubj = document.getElementById("todaysubj")
subjdisplay = document.getElementById("subjdisplay")
subjstatus = document.getElementById("subjstatus")

let data = {}
let selectedsubj = ""

function togglebar() {
    if (document.getElementById("bartoggle").innerHTML == "&lt;") {
        console.log("yes")
        document.getElementById("sidebar").style.marginLeft = "-250px"
        document.getElementById("bartoggle").style.marginLeft = "-250px"
        document.getElementById("subjdisplay").style.width = "100vw"
        document.getElementById("bartoggle").innerHTML = ">"
    } else {
        console.log(document.getElementById("bartoggle").innerHTML)
        document.getElementById("bartoggle").style.marginLeft = "0"
        document.getElementById("sidebar").style.marginLeft = "0"
        document.getElementById("subjdisplay").style.width = "calc(100vw - 250px)"
        document.getElementById("bartoggle").innerHTML = "<"
    }
    
}

function addsubj(name) {
    if (name in data) {
        alert("A subject with that name exists already!")
        return;
    }
    data[name] = {"date": Date.now(), "recording": false, "timestamp": null, "sessions": {}} // date is when created/ last edited, time and timestamp are for total time tracking
    console.log(name, Date.now())
    subjdiv = document.createElement("div")
    subjdiv.className = "subject"
    subjdiv.innerHTML = name
    subjdiv.onclick = () => {
        selectsubj(name)
    }
    
    todaysubj.appendChild(subjdiv)
}

function selectsubj(name) {
    selectedsubj = name
    document.getElementById("subjtitle").innerText = name
}

document.addEventListener('DOMContentLoaded', (event) => { // Test data for now
    const ctx = document.getElementById('exampleChart').getContext('2d');
    const exampleChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});

function togglerec() {
    if (data[selectedsubj]["recording"] == true) {
        data[selectedsubj]["recording"] = false
        data[selectedsubj]["sessions"][data[selectedsubj]["timestamp"]] = Date.now()
        data[selectedsubj]["timestamp"] = null
        subjstatus.innerText = "Not Recording!"
        subjstatus.style.backgroundColor = "#d73925"
    } else {
        data[selectedsubj]["recording"] = true
        data[selectedsubj]["timestamp"] = Date.now()
        subjstatus.style.backgroundColor = "#008d4c"
        subjstatus.innerText = "Recording..."
    }
}

