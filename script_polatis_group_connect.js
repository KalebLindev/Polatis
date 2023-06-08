//* Polatis Port I/O GET Data Code Block Starts Here
const infoText = document.getElementById("info")

const headers = {
    "Access-Control-Allow-Origin": "*",
    'Access-Control-Allow-Methods':'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization',
    'Access-Control-Max-Age': 1728000,
    "Authorization": "Basic " +btoa("admin:root"),
    "Content-Type": "application/yang-data+json",
    'Content-Length': 0,
    "cache-control": "no-cache",
    "credential": "include",
    "mode": "cors",
}

//~=================================================================================

//* Polatis Group Connect Code Block Starts Here
const srcListContainer = document.getElementById("src_list_container")
const dstListContainer = document.getElementById("dst_list_container")
const venueArray = ["ARENA", "VINES", "WILLIAMS", "SCHOOL OF MUSIC", "EAST", "BASEBALL", "SOFTBALL", "SOCCER", "SCHOOL OF BUSINESS", "NEST"]
const venuePSUS = {
    // ARENA: ["PSU_01", "PSU_02", "PSU_03", "PSU_04", "PSU_05", "PSU_06"],
    // VINES: ["PSU_07", "PSU_08", "PSU_09", "PSU_10", "PSU_11", "PSU_12"],
    ARENA: [],
    VINES: [],
    WILLIAMS: [],
    "SCHOOL OF MUSIC": [],
    EAST: [],
    BASEBALL: [],
    SOFTBALL: [],
    SOCCER: [],
    "SCHOOL OF BUSINESS": [],
    NEST: []
}

let src = ""
let dst = ""
let srcElement = null
let dstElement = null

//^ TEST Data for coding at home, will be appended with API data when online
let polatisArraySrc = []
let polatisArrayDst = []
const cancelFuncAppear = (e = null) => {
    e.style.backgroundColor = "firebrick"
    e.style.outline = "none"
    e.style.color = "black"
}

const cancelFuncLeave = (e = null) => {
    disableDstSelection()
    //^ If there is no target passed into the parameters, this will instead put all cancel box's to home position
    if(e !== null) {
        e.style.left = "50px"
    } else {
        document.querySelectorAll(".src_list_cancel_box").forEach(each => {
            each.style.left = "50px"
        })
    }
    document.querySelectorAll(".current_dst_connected").forEach(each => {
        each.classList.remove("current_dst_connected")
    })
    clearMobileSrcSelection()
    clearMobileDstSelection()
    src = ""
    dst = ""
}

const linkingFunc = (source, dest) => {  
    console.log("inside")
    console.log(srcElement)
    console.log(dstElement)
    console.log("src & dst", src, dst)
    console.log("SOURCE & DEST", source, dest)
    if(source && dest) {
        disableDstSelection()
        document.querySelectorAll(".src_ul_container").forEach(each => {
            each.style.pointerEvents = "none"
        })
        document.querySelectorAll(".src_text_ul").forEach(each => {
            each.style.backgroundColor = "rgb(25, 47, 79)"
        })
        src = ""
        dst = ""
        document.querySelectorAll(".list_text").forEach(each => {
            // console.log(each)
            if(each.value == dstElement.value) {
                // console.log(each)
                each.value = 999
                each.parentElement.children[2].innerText = ""
            }
        })
        srcElement.value = dstElement.value
        srcElement.children[2].innerText = dstElement.innerText
        linkPolatisPorts(source, dest)
       
        setTimeout(() => {
            cancelFuncLeave()
            clearMobileSrcSelection()
            clearMobileDstSelection()
        }, 500)
    } else { return }}

const show_cancel_box = (e) => {
    const target = e.target.closest("button")
    enableDstSelection()
    const index = target.value
    const currentConnect = dstListContainer.children[index]
    document.querySelectorAll(".src_list_cancel_box").forEach(each => {
        each.style.left = "50px"
    })
    document.querySelectorAll(".list_text").forEach(each => {
        each.classList.remove("mobile_on_click_list_item_src")
    })
    document.querySelectorAll(".current_dst_connected").forEach(each => {
        each.classList.remove("current_dst_connected")
    })
    srcElement = target
    srcElement.classList.add("mobile_on_click_list_item_src")
    // target = e.previousElementSibling
    // target.style.left = "-16px"
    if (!currentConnect) return
    currentConnect.classList.add("current_dst_connected")
}

const enableDstSelection = () => {
    document.querySelectorAll(".dst_text_btn").forEach(each => {
        each.style.backgroundColor = "rgb(40, 75, 124)"
        each.style.color = "white"
    })
}

const disableDstSelection = () => {
    document.querySelectorAll(".dst_text_btn").forEach(each => {
        each.style.backgroundColor = "rgb(25, 47, 79)"
        each.style.color = "rgb(180, 180, 180)"
    })
}

const clearMobileDstSelection = () => {
    document.querySelectorAll(".mobile_on_click_list_item_dst").forEach(each => {
        each.classList.remove("mobile_on_click_list_item_dst")
        each.classList.remove("current_dst_connected")
    })
}

const clearMobileSrcSelection = () => {
    document.querySelectorAll(".mobile_on_click_list_item_src").forEach(each => {
        each.classList.remove("mobile_on_click_list_item_src")
    })
}



//~=================================================================================
//&=================================================================================
//?=================================================================================

const dstSearch = "CCU"
const srcSearch = "PSU"
const groups = []
let dstGroupsHold = []
let srcGroupsHold = []
let dstNumIndex = 1
let srcNumIndex = 1
let dstGroupsEnd = Array(100).fill(null)
let srcGroupsEnd = Array(100).fill(null)

const linkPolatisPorts = async (portSrc, portDst) => {
    console.log(portSrc, portDst)
    //^ Find current link and break it on the UI so the new link is
    //^ the only visible link
    const removedDstConnectIndex = polatisArrayDst.findIndex(o => o.name === portDst)
    
    polatisArraySrc.forEach(each => {
        // console.log(each)
        if(each["connected-port-slot"] == removedDstConnectIndex)
        each["connected-port-slot"] = undefined
    })

    //& Posting Data to Polatis
    const url2 = "http://10.239.63.32:81/polatis/operations/group-connect"
    const postDictionary = JSON.stringify({
        "input": {
            "group-name-from": portDst,
            "group-name-to": portSrc
        }  
    })
    //& Custom Header
        const res = await fetch(
            url2, {
                method: "POST",
                headers: {
                    "Authorization": "Basic " +btoa("admin:root"),
                    "Content-Type": "application/yang-data+json",
                },
                body: postDictionary,
                mode: "cors"
            }
            )
            if (!res.ok) {
                console.log("try again")
                return
            }
    document.querySelectorAll(".src_ul_container").forEach(each => {
        each.style.pointerEvents = "auto"
    })
    document.querySelectorAll(".src_text_ul").forEach(each => {
        each.style.backgroundColor = "rgb(40, 75, 124)"
    })
}

async function PullAndPush() {  
    let array = null
    const url1 = 'http://10.239.63.32:81/polatis/data/groups'
        const r = await fetch(url1, {
            headers: headers,
            "mode": "cors"
        })

    if (r.ok) {
            srcGroupsHold = []
            dstGroupsHold = []
            srcGroupsEnd = []
            dstGroupsEnd = []
            polatisArraySrc = []
            polatisArrayDst = []
            const res = await r.json()
            array = res["optical-switch:groups"]["group"]
            array.forEach(each => {
                if(each["group-name"].toLowerCase().includes(dstSearch.toLowerCase())) {
                    // console.log(each)
                    dstGroupsHold.push({
                        name: each["group-name"],
                        portSideA: each["ingress"][0],
                        portSideB: each["egress"][0],
                        "connected-group-name": each["connected-group"]
                    })
                }
                
                if(each["group-name"].toLowerCase().includes(srcSearch.toLowerCase())) {
                    srcGroupsHold.push({
                        name: each["group-name"],
                        portSideA: each["ingress"][0],
                        portSideB: each["egress"][0],
                        "connected-group-name": each["connected-group"],
                        "connected-port-slot": null
                    })
                }
            })
            srcGroupsHold.forEach(each => {
                each["connected-port-slot"] = dstGroupsHold.findIndex(o => o["connected-group-name"] == each["name"])
                polatisArraySrc.push(each)
            })
            // dstGroupsHold = []
            dstGroupsHold.forEach(each => {
                polatisArrayDst.push(each)
            })
        } else {
            console.log("NOPE")
        }

        if(dstGroupsHold) {
            dstGroupsHold.forEach(each => {
                dstGroupsEnd[dstNumIndex] = dstGroupsHold[srcNumIndex - 1]
                dstNumIndex += 1
            })
        }

        srcGroupsHold.forEach(each => {
            const venueParse = each["name"]
            venueArray.forEach(venue => {
                if(venueParse.includes(venue)) {
                    const venueSplit = venueParse.split(`${venue}_`)
                    const pushValue = venueSplit[1]
                    venuePSUS[venue] = []
                    venuePSUS[venue].push({
                        visualName: pushValue,
                        name: each["name"],
                        "connected-group-name": each["connected-group-name"],
                        "connected-port-slot": each["connected-port-slot"],
                        portSideA: each["portSideA"],
                        portSideB: each["portSideB"],
                    })
                }
            }) 
            
            srcGroupsEnd[srcNumIndex] = srcGroupsHold[srcNumIndex - 1]
            srcNumIndex += 1
            
        })
        console.log(venuePSUS)

        // console.log("HOLD", srcGroupsHold)
        // console.log("END", srcGroupsEnd)
        // console.log("ARRAY", polatisArraySrc)
        // console.log("HOLD", dstGroupsHold)
        // console.log("END", dstGroupsEnd)
        // console.log("ARRAY", polatisArrayDst)
    }
    const appendArrayList = () => {
        polatisArrayDst.forEach((each, index) => {
            const newNode = document.createElement("button")
            newNode.classList.add(each["name"])
            newNode.classList.add("dst_text_btn")
            newNode.value = index
            newNode.innerHTML = `
                    <p value=${index}>${each["name"]}</p>
            `
            newNode.addEventListener('click', (e) => {
                if(e.target.closest("button").style.color !== "white") return
                dst = e.target.classList[0]
                dstElement = e.target
                clearMobileDstSelection()
                e.target.value = index
                e.target.closest("button").classList.add("mobile_on_click_list_item_dst")
            })
            dstListContainer.appendChild(newNode)
        })

        const mobileCancelButton = document.getElementById("mobile_cancel_button")
        mobileCancelButton.addEventListener(("click"), () => {
            cancelFuncLeave()
        })
    }
    //* Trigger Get and Post
    const data = PullAndPush()
    
    const loadVenue = () => {

        appendArrayList()
        document.querySelectorAll(".src_text_btn").forEach(each => {
            console.log(each, "is getting a clicker")
            each.addEventListener('click', (e) => {
                src = e.target.closest("button").classList[0]
                console.log(src)
                clearMobileSrcSelection()
                e.target.closest(".src_text_btn").classList.add("mobile_on_click_list_item_src")
                linkingFunc(src, dst)
            })
        })
        document.querySelectorAll(".dst_text_btn").forEach(each => {
            each.addEventListener('click', (e) => {
                dst = e.target.closest(".dst_text_btn").classList[0]
                linkingFunc(src, dst)
            })
        })
    }

    const appendVenuePSU = (venue) => {

        venuePSUS[venue].forEach(each => {
            const connected = each["connected-group-name"] ? each["connected-group-name"] : ""
            const newNode = document.createElement("button")
            newNode.classList.add(each["name"])
            newNode.classList.add("src_text_btn")
            newNode.addEventListener("click", (e) => {
                show_cancel_box(e)
            })
            newNode.value = `${each["connected-port-slot"]}`
            // <span class="src_list_cancel_box" onmousedown="cancelFuncLeave(this)" onmouseup="cancelFuncAppear(this)">X</span>
            newNode.innerHTML = `
                <p class="${each["name"]} list_text"} value="${each["connected-port-slot"]}">${each["visualName"]}</p>
                <p class="line"></p>
                <p class="list_text_under">${connected}</p>
            `
            srcListContainer.appendChild(newNode)
        })
    }

    //~=================================================================================
    //&=================================================================================
    //?=================================================================================
    //* Venue Select Modal Code

    const venueSelectModal = document.getElementById("venue_select_modal")
    const venueSelectBtnContainer = document.getElementById("venue_select_btn_container")
    const venueSelectBtn = document.querySelectorAll(".venue_select_btn")
    const changeVenueBtn = document.getElementById("change_venue_btn")
    venueArray.forEach(venueName => {
        const newNode = document.createElement("div")
        newNode.innerHTML = `
            <button class="venue_select_btn" value="${venueName}">${venueName}</button>
        `
        newNode.addEventListener("click", (e) => {
            venueSelectModal.style.display = "none"
            appendVenuePSU(e.target.value)
            loadVenue()
            disableDstSelection()
        })
        venueSelectBtnContainer.appendChild(newNode)
    })

    changeVenueBtn.addEventListener("click", () => {
        venueSelectModal.style.display = "flex"
        srcListContainer.innerHTML = ""
        dstListContainer.innerHTML = ""
        PullAndPush()

    })


