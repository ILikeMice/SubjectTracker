todaysubj = document.getElementById("todaysubj")
subjdisplay = document.getElementById("subjdisplay")

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
    data[name] = {"date": Date.now()}
    console.log(name, Date.now())
    subjdiv = document.createElement("div")
    subjdiv.className = "subject"
    subjdiv.innerHTML = name
    
    todaysubj.appendChild(subjdiv)
}

function selectsubj(name) {
    selectedsubj = name 

}

function togglerec() {
    
}