//* Polatis Port I/O GET Data Code Block Starts Here
const infoText = document.getElementById("info")

async function fetcher() {

    //^ Fetcher Top Scope Variables
    // const path1 = "optical-switch:cross-connects"
    // const path2 = "pair"
    let port = ""
    let connected = ""
    let label1 = ""
    let label2 = ""
    let message = ""
    const url = "http://10.239.0.32:8008/api/data/optical-switch:cross-connects"
    const headers = {
        "Authorization": "Basic " +btoa("admin:root"),
        "Content-Type": "application/yang-data+json"
    }

    //^ Input for which Polatis port to API data from
    // userPortSearch = prompt("What port would you like to search for?")
    userPortSearch = "5"


    const r = await fetch(url, { headers: headers })
    const res = await r.json()
    const linkArray = res["optical-switch:cross-connects"]["pair"]

    linkArray.forEach(each => {
        if (Number(each["ingress"]) == userPortSearch) {
        port = each["ingress"]
        connected = each["egress"]
    }})

    //^ function for API calling the port endpoint to get ingress and egress data
    async function portApiFunc(arg) {

        const endpoint = "http://10.239.0.32:8008/api/data/optical-switch:ports/port=" + arg + "/port-label"
        const p = await fetch(endpoint, { headers: headers})
        const label = await p.json()
        console.log(label)
        return label["optical-switch:port-label"]
    }

    if (port) {
        label1 = await portApiFunc(port)
        label2 = await portApiFunc(connected)
        message = (`PORT: ${port} ${label1} is connected to PORT: ${connected} ${label2}`)
        console.log(message)
        infoText.innerText = message
    } else {
        message = (`PORT: #${userPortSearch} ${label1} is not connected to another port`)
        console.log(message)
        infoText.innerText = message
    }

    //^ Must be called inside Fetcher Func since it is initiated inside of it
    portApiFunc()
}

fetcher()

//^ Test if the function can be called after all the code and the program still work
// fetcher()

//~=================================================================================

//* Polatis Group Connect Code Block Starts Here
const srcListContainer = document.getElementById("src_list_container")
const dstListContainer = document.getElementById("dst_list_container")
let src = ""
let dst = ""

//^ TEST Data for coding at home, will be appended with API data when online
const polatisArraySrc = ["CCU_01_SRC", "CCU_02_SRC", "CCU_03_SRC"]
const polatisArrayDst = ["CCU_01_DST", "CCU_02_DST", "CCU_03_DST"]



const cancelFuncAppear = (e = null) => {
    
        e.style.backgroundColor = "firebrick"
        e.style.outline = "none"
        e.style.color = "black"
    
}

const cancelFuncLeave = (e = null) => {
    //^ If there is no target passed into the parameters, this will instead put all cancel box's to home position
    if(e !== null) {
        e.style.left = "50px"
    } else {
        document.querySelectorAll(".src_list_cancel_box").forEach(each => {
            each.style.left = "50px"
        })
    }
}

const linkingFunc = () => {
    if(src && dst) {
        console.log(src, dst)
        src = ""
        dst = ""
        setTimeout(() => {
            cancelFuncLeave()
        }, 500)
    } else { return }}

const show_cancel_box = (e) => {
    document.querySelectorAll(".src_list_cancel_box").forEach(each => {
        each.style.left = "50px"
    })
    target = e.previousElementSibling
    target.style.left = "-16px"
}

polatisArraySrc.forEach(each => {
    const newNode = document.createElement("div")
    newNode.innerHTML = `
        <ul class="src_ul_container">
            <li class="src_list_cancel_box" onmousedown="cancelFuncLeave(this)" onmouseup="cancelFuncAppear(this)">X</li>
            <li class="list_text" onclick="show_cancel_box(this)">${each}</li>
        </ul>
    `
    newNode.addEventListener('click', (e) => {
        src = e.target.innerText
        linkingFunc()
    })

    srcListContainer.appendChild(newNode)
})

polatisArrayDst.forEach(each => {
    const newNode = document.createElement("li")
    newNode.innerText = each
    newNode.addEventListener('click', (e) => {
        dst = e.target.innerText
        linkingFunc()
    })

    dstListContainer.appendChild(newNode)
})


//~=================================================================================
//&=================================================================================
//?=================================================================================


// const dstSearch = "dst"
// const srcSearch = "src"
// let dstGroupsHold = []
// let srcGroupsHold = []
// let dstNumIndex = 1
// let srcNumIndex = 1
// const dstGroupsEnd = [None] * 100
// const srcGroupsEnd = [None] * 100


// async function Pull() {

//     const url = 'http://10.239.0.32:8008/api/data/optical-switch:groups'
//     const r = requests.get(url, auth=("admin", "root"))
//     if (r.ok) {
//         return r.text
//     } else {
//         console.log("Failed to retrieve data from the API.")
//         return None
//     }
// }
    

// const data = Pull()
// if (data) {

//     //& Parse the XML data
//     root = ET.fromstring(data)

//     //& Create a dictionary to store the group data
//     groups = {}

//     //& Iterate over the group elements
//     //^ NEED to convert this for in enumerate into JavaScript
//     for index, group_elem in enumerate(root.findall(".//{http://www.polatis.com/yang/optical-switch}group"), start=1){
//         const group_name = group_elem.findtext("{http://www.polatis.com/yang/optical-switch}group-name")
//         const groups[index] = group_name
//     }
// }
// for(each in groups) {

//     //^ NEED to convert this for in into JavaScript
//     if(dstSearch.lower() in groups[each].lower()) {
//         dstGroupsHold.append(groups[each])
//     }

//     //^ NEED to convert this for in into JavaScript
//     if(srcSearch.lower() in groups[each].lower()) {
//         srcGroupsHold.append(groups[each])
//     }
// }

// //^ NEED to convert this for in into JavaScript
// for (entries in dstGroupsHold) {
//     dstGroupsEnd[dstNumIndex] = dstGroupsHold[dstNumIndex - 1]
//     dstNumIndex += 1
// }

// //^ NEED to convert this for in into JavaScript
// for (entries in srcGroupsHold) {
//     srcGroupsEnd[srcNumIndex] = srcGroupsHold[srcNumIndex - 1]
//     srcNumIndex += 1
// }

// console.log("DST List:", dstGroupsHold)
// console.log("SRC List:", srcGroupsHold)
// # -----------------------------------------

//     //& Prompt the user to enter a number or a comma-separated list of numbers
//     const message = prompt("Which SRC and which DST?")

//     //^ Dummy code for when I want to try and send Polatis the delete port link command
//     // # if (message == "d1"):
//     // #     print('test')
//     // #     url = "http://10.239.0.32:8008/api/operations/polatis-switch:delete-group-cross-connect"
//     // #     # Custom Header
//     // #     headers = {
//     // #         "Content-Type": "application/yang-data+json"
//     // #     }
//     // #
//     // #     data = {
//     // #         "input": {"group-name": dstGroupsEnd[1]}
//     // #     }
//     // #
//     // #     requests.post(
//     // #         url,
//     // #         headers=headers,
//     // #         data=data,
//     // #         auth=("admin", "root"),
//     // #     )

//     //& Check if the user input starts with a period and contains a comma
//     if (message.startsWith('.') && message.includes(',')) {
//         const level = message[2]

//         //^ CONFIRM a way for DEST to be the the char after the comma. cannot just be the 3rd index (10,11,12 would not work)
//         //^ USe the splice or slice I guess or find what is after the comma
//         const dest = message[3: message.find(',')]

//         //^ USe the splice or slice I guess or find what is after the comma
//         const source = message[message.find(',') + 1: message.find('\r')]

//         //& Split the input into a list of numbers
//         //^ USe the splice or slice I guess or find what is after the comma
//         const numbers = message[3:].split(',')

//         //& Convert the numbers to integers and get the corresponding group names
//         //^ NEED to convert this for in into JavaScript
//         const group_names = [groups[int(num)] for num in numbers]

//         //& Save the group names as variables
//         const destPolatis, sourcePolatis = group_names
//         const response = '.U' + level + dest + ',' + source + '\r'
//     }
//     //& print(numbers)
//     const num1 = int(numbers[0])
//     const num2 = int(numbers[1])
//     const dictionary = {"input": {"group-name-from": dstGroupsEnd[num1], "group-name-to": srcGroupsEnd[num2]}}
//     const dataPolatis = json.dumps(dictionary, indent=4)

//     //& Posting Data to Polatis
//     const url = "http://10.239.0.32:8008/api/operations/polatis-switch:add-group-cross-connect"
    
//     //& Custom Header
//     headers = {"Content-Type": "application/yang-data+json"}
//     requests.post(
//         url,
//         headers=headers,
//         data=dataPolatis,
//         auth=("admin", "root"),
//     )
//     console.log(dictionary["input"]["group-name-from"], "-->", dictionary["input"]["group-name-to"])

