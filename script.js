let todaysubj = document.getElementById("todaysubj")
let subjdisplay = document.getElementById("subjdisplay")
let subjstatus = document.getElementById("subjstatus")
let sessiontable = document.getElementById("sessiontable")

let data = {} || getdata()
let selectedsubj = ""

function writedata() {
    document.cookie = "data="+ JSON.stringify(data) + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/"
}
function getdata() {
    let cookies = document.cookie.split(";")
    for (let cookie of cookies) {
      let [key, value] = cookie.trim().split("=")
      if (key == "data") {
        return JSON.parse(value)
      }
    }
}

function togglebar() {
    if (document.getElementById("bartoggle").innerHTML == "&lt;") {
        console.log("yes")
        document.getElementById("sidebar").style.marginLeft = "-250px"
        document.getElementById("bartoggle").style.marginLeft = "-240px"
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

async function selectsubj(name) {
    selectedsubj = name
    document.getElementById("subjtitle").innerText = name
    let subtitle = document.getElementById("subjt2")
    let totaltime = 0
    if (data[name]["recording"] == true) {
        subjstatus.style.backgroundColor = "#008d4c"
        subjstatus.innerText = "Recording..."
    } else {
        subjstatus.innerText = "Not Recording!"
        subjstatus.style.backgroundColor = "#d73925"
    }
    
    document.getElementById("tablediv").style.height = "35px"
    console.log("smaller", document.getElementById("tablediv").style.height)
    await new Promise(res => setTimeout(res, 500))

    sessiontable.innerHTML = "<thead><th>Start</th><th>End</th><th>Duriation</th></thead>"



    for (let i = 0; i < Object.keys(data[name]["sessions"]).length; i++) {
        console.log(Object.keys(data[name]["sessions"])[i])
        row = sessiontable.insertRow(1)

        let startcell = row.insertCell(0)
        let endcell = row.insertCell(1)
        let duracell = row.insertCell(2)

        console.log("i", i)
        startcell.innerText = new Date(Number(Object.keys(data[name]["sessions"])[i])).toLocaleString()
        endcell.innerText = new Date(Number(data[name]["sessions"][Object.keys(data[name]["sessions"])[i]])).toLocaleString()
        let duriation = Number(data[name]["sessions"][Object.keys(data[name]["sessions"])[i]]) - Number(Object.keys(data[name]["sessions"])[i])
    
        totaltime += duriation

        let dursec = Math.floor((duriation / 1000) % 60)
        let durmin = Math.floor((duriation / 60000) % 60)
        let durhr = Math.floor(duriation / 3600000)

        if (durhr > 0) {
            duracell.innerHTML += durhr + "h " + durmin + "m " + dursec + "s"
        } else if (durmin > 0) {
            duracell.innerHTML += durmin + "m " + dursec + "s"
        } else {
            duracell.innerHTML += dursec + "s"
        }
    }

    await new Promise(res => setTimeout(res, 100))
    
    document.getElementById("tablediv").style.height = "calc(100% - 35px)"
    console.log("bigger", document.getElementById("tablediv").style.height)

    let totalsec = Math.floor((totaltime / 1000) % 60)
    let totalmin = Math.floor((totaltime / 60000) % 60)
    let totalhr = Math.floor(totaltime / 3600000)

    subtitle.innerText = ""

    if (totalhr > 0) {
        subtitle.innerText += totalhr + "h " + totalmin + "m " + totalmin + "s"
    } else if (totalmin > 0) {
        subtitle.innerText += totalmin + "m " + totalsec + "s"
    } else {
        subtitle.innerText += totalsec + "s"
    }

    subtitle.innerText += " tracked"
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

function togglerec() { // readability is optional
    if (data[selectedsubj]["recording"] == true) {
        data[selectedsubj]["recording"] = false
        data[selectedsubj]["sessions"][data[selectedsubj]["timestamp"]] = Date.now()

        let totaltime = 0
        
        let subtitle = document.getElementById("subjt2")
        let row = document.getElementById("sessiontable").insertRow(1)

        let startcell = row.insertCell(0)
        let endcell = row.insertCell(1)
        let duracell = row.insertCell(2)


        startcell.innerText = new Date(data[selectedsubj]["timestamp"]).toLocaleString()
        endcell.innerText = new Date(data[selectedsubj]["sessions"][data[selectedsubj]["timestamp"]]).toLocaleString()
        let duriation = data[selectedsubj]["sessions"][data[selectedsubj]["timestamp"]] - data[selectedsubj]["timestamp"]
        
        let dursec = Math.floor((duriation / 1000) % 60)
        let durmin = Math.floor((duriation / 60000) % 60)
        let durhr = Math.floor(duriation / 3600000)

        if (durhr > 0) {
            duracell.innerHTML += durhr + "h " + durmin + "m " + dursec + "s"
        } else if (durmin > 0) {
            duracell.innerHTML += durmin + "m " + dursec + "s"
        } else {
            duracell.innerHTML += dursec + "s"
        }
        
        for (let i = 0; i < Object.keys(data[selectedsubj]["sessions"]).length; i++) {
            let duriation = Number(data[selectedsubj]["sessions"][Object.keys(data[selectedsubj]["sessions"])[i]]) - Number(Object.keys(data[selectedsubj]["sessions"])[i])
        
            totaltime += duriation
        }

        subtitle.innerText = ""

        let totalsec = Math.floor((totaltime / 1000) % 60)
        let totalmin = Math.floor((totaltime / 60000) % 60)
        let totalhr = Math.floor(totaltime / 3600000)


        if (totalhr > 0) {
            subtitle.innerText += totalhr + "h " + totalmin + "m " + totalmin + "s"
        } else if (totalmin > 0) {
            subtitle.innerText += totalmin + "m " + totalsec + "s"
        } else {
            subtitle.innerText += totalsec + "s"
        }

        subtitle.innerText += " tracked"

        data[selectedsubj]["timestamp"] = null
        subjstatus.innerText = "Not Recording!"
        subjstatus.style.backgroundColor = "#d73925"
        writedata()
    } else {
        data[selectedsubj]["recording"] = true
        data[selectedsubj]["timestamp"] = Date.now()
        subjstatus.style.backgroundColor = "#008d4c"
        subjstatus.innerText = "Recording..."
    }
}

