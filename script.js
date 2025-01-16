let todaysubj = document.getElementById("todaysubj")
let subjdisplay = document.getElementById("subjdisplay")
let subjstatus = document.getElementById("subjstatus")
let sessiontable = document.getElementById("sessiontable")

let data = getdata()
if (data ==  "") {
    let data = {}
}

var timechart;

var selectedsubj;

function writedata() {
    console.log("wrote")
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

function loadsubjects() {
    let today = document.getElementById("todaysubj")
    let yesterday = document.getElementById("yesterdaysubj")
    let lastweek = document.getElementById("lastweeksubj")
    let longtimeago = document.getElementById("longtimesubj")
    for (let i = 0; i < Object.keys(data).length; i++) {
        let lastdate = new Date(data[Object.keys(data)[i]]["date"])
        console.log("i", i)
        console.log("y")
        addsubj(Object.keys(data)[i], true)
    
    }
}

function getdaily(name) { // 100% efficient and clean, im never touching this again
    let dailydata = {}
    for (let i = 0; i < Object.keys(data[name]["sessions"]).length; i++) {

        let sessionstart = Number(Object.keys(data[name]["sessions"])[i])
        let sessionend = Number(data[name]["sessions"][Object.keys(data[name]["sessions"])[i]])

        console.log(new Date(Number(Object.keys(data[name]["sessions"])[i])), sessionend)
        if (!dailydata[`${new Date(sessionstart).getDate()}.${new Date(sessionstart).getMonth() +1}.${new Date(sessionstart).getFullYear()}`]){
            if (!(new Date(Date.now()).setHours(24,0,0,0) - new Date(sessionstart).setHours(0,0,0,0) > 86400000*7)) {
                dailydata[`${new Date(sessionstart).getDate()}.${new Date(sessionstart).getMonth() +1}.${new Date(sessionstart).getFullYear()}`] = 0
            console.log("new", dailydata)
            }
            
        }

        console.log(sessionend, new Date(sessionend).setHours(0,0,0,0), new Date(sessionend).setHours(24,0,0,0), new Date(sessionend).getDate()) // 0000 is start of day, 24,0,0,0 is end

        if (new Date(sessionstart).getDate() == new Date(sessionend).getDate()) {
            if (new Date(Date.now()).setHours(24,0,0,0) - new Date(sessionend).setHours(0,0,0,0) > 86400000*7) {
                break;
            }
            dailydata[`${new Date(sessionstart).getDate()}.${new Date(sessionstart).getMonth() +1}.${new Date(sessionstart).getFullYear()}`] += sessionend - sessionstart
            console.log("q", Number(sessionend) - Number(sessionstart))
        } else { 
            console.log(sessionstart)
            if (!(new Date(Date.now()).setHours(24,0,0,0) - new Date(sessionstart).setHours(0,0,0,0) > 86400000*7)) {
                dailydata[`${new Date(sessionstart).getDate()}.${new Date(sessionstart).getMonth() +1}.${new Date(sessionstart).getFullYear()}`] += new Date(sessionstart).setHours(24,0,0,0) - sessionstart
            }
            

            let betweentime = new Date(sessionend).setHours(0,0,0,0) - new Date(sessionstart).setHours(24,0,0,0)
            let dayamount = betweentime/86400000
            console.log("dayamount ", dayamount)

            for (let i = 1; i <= dayamount; i++) {
                let betweenday = Number(sessionend - 86400000*i)
                if (new Date(Date.now()).setHours(24,0,0,0) - new Date(betweenday).setHours(0,0,0,0) > 86400000*7) {
                    continue;
                }
                if (!dailydata[`${new Date(betweenday).getDate()}.${new Date(betweenday).getMonth() +1}.${new Date(betweenday).getFullYear()}`]) {
                    dailydata[`${new Date(betweenday).getDate()}.${new Date(betweenday).getMonth() +1}.${new Date(betweenday).getFullYear()}`] = 0
                }
                dailydata[`${new Date(betweenday).getDate()}.${new Date(betweenday).getMonth() +1}.${new Date(betweenday).getFullYear()}`] += 86400000
                console.log("between ",new Date(betweenday))
                console.log(data)
            }

            if (!(new Date(Date.now()).setHours(24,0,0,0) - new Date(sessionend).setHours(0,0,0,0) > 86400000*7)) {
                dailydata[`${new Date(sessionend).getDate()}.${new Date(sessionend).getMonth() +1}.${new Date(sessionend).getFullYear()}`] += sessionend - new Date(sessionend).setHours(0,0,0,0)
            }
            
        }

        console.log(dailydata)
    }
    return dailydata
}

function togglebar() {
    if (document.getElementById("bartoggle").innerHTML == "&lt;") {
        console.log("yes")
        document.getElementById("sidebar").style.marginLeft = "-250px"
        document.getElementById("bartoggle").style.marginLeft = "-250px"
        document.getElementById("subjdisplay").style.width = "100vw"
        document.getElementById("subjplaceholder").style.width = "100vw"
        document.getElementById("bartoggle").innerHTML = ">"
    } else {
        console.log(document.getElementById("bartoggle").innerHTML)
        document.getElementById("bartoggle").style.marginLeft = "0"
        document.getElementById("sidebar").style.marginLeft = "0"
        document.getElementById("subjdisplay").style.width = "calc(100vw - 250px)"
        document.getElementById("subjplaceholder").style.width = "calc(100vw - 250px)"
        document.getElementById("bartoggle").innerHTML = "<"
    }
    
}

function addsubj(name, loading=false) {
    if (name in data && !loading ) {
        console.log("didnt add", loading)
        return;
    }
    if (name.trim().length == 0) {
        
        if (name in data) {
            delete data[name]
            writedata()
        }
        alert("Name cannot be whitespace only!")
        return;
    }
    if (!loading) {
        data[name] = {"date": Date.now(), "recording": false, "timestamp": null, "sessions": {}} // date is when created/ last edited, time and timestamp are for total time tracking
        writedata()
    }
    
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
    console.log(getdaily(name))
    document.getElementById("subjtitle").innerText = name
    drawchart(getdaily(name))
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


function drawchart(inputdata) {
    try {timechart.destroy()} catch {}

    let chartlabels = []
    let chartdata = []

    let dates = Object.keys(inputdata);
    let values = Object.values(inputdata);

    let dataArray = dates.map((date, index) => {
        console.log("date", date)
        let [day, month, year] = date.split('.').map(Number);
        return { date: new Date(year, month - 1, day), value: values[index] };
    });

    dataArray.sort((a, b) => a.date - b.date);

    dataArray.forEach(item => {
        chartlabels.push(item.date.toLocaleDateString());
        chartdata.push(item.value);
    });
    const ctx = document.getElementById("Chart").getContext("2d")
    timechart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: chartlabels,
            datasets: [{
                data: chartdata,
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (item) => {
                            return `${(item.formattedValue)}s`
                        }
                    }
                }
            }
        }
    })
}

function togglerec() { // readability is optional
    if (data[selectedsubj]["recording"] == true) {
        data[selectedsubj]["recording"] = false
        data[selectedsubj]["sessions"][data[selectedsubj]["timestamp"]] = Date.now()
        writedata()

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

