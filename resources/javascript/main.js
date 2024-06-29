const contacts = document.getElementById("contacts");
const app = document.getElementById("app");

// getter and setter local storage data

let getData = () => {
    return JSON.parse(localStorage.getItem("data"));
}

let saveNewData = (data) => {
    data = data.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();

        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
    localStorage.setItem("data", JSON.stringify(data));
}



// create single contact html
let createContact = function (data, id) {
    return `<div class="card mb-0 border-0">
    <div class="card-header bg-white px-5" data-toggle="collapse" data-target="#contactDetails${id}">
        <h5 class="card-title my-0">${data.name}</h5>
        
    </div>
    <div id="contactDetails${id}" class="collapse px-5">
        <div class="card-body py-0">
            <p class="card-text">Email: ${data.email}</p>
            <p class="card-text">Phone: ${data.phone}</p>
            <p class="card-text">Address: ${data.address}</p>
        </div>
        <div class="ml-auto mt-2 mx-0 px-5">
            <!-- Edit Icon -->
            <a id="edit${id}" onclick="editContact(this)" class=" btn btn-outline-primary text-primary mx-2 py-0">
                <i class="fas fa-pencil-alt"></i>
            </a>
            <!-- Delete Icon -->
            <a id="del${id}" onclick="deleteContact(this)" class="btn btn-outline-danger text-danger mx-5 py-0">
                <i class="fas fa-trash-alt"></i>
            </a>
        </div>
    </div>
</div>`;
};

// get first char of a string ( Name )
function getfirstchar(str) {
    for (let i = 0; i < str.length; i++) {
        if (str[i] == ' ') continue;
        return str[i].toUpperCase();
    }
}

// render contacts on home page
let renderData = function (data) {
    let Data = data.map((val, index) => {
        return createContact(val, index);
    });
    let currentChar = "";
    let renderData = "";
    Data.forEach((element, index) => {
        if (/^\d$/.test(getfirstchar(data[index].name))) {
            if (currentChar != "0-9") {
                currentChar = "0-9";
                renderData += `
                <div class="card-header bg-white m-0 py-0" id="header${currentChar}">
                <h3 class="card-title my-0 ">${currentChar} </h3>
                </div>
            `;
            }

        }
        else if (/^[a-zA-Z]$/.test(getfirstchar(data[index].name))) {
            if (getfirstchar(data[index].name) != currentChar) {
                currentChar = getfirstchar(data[index].name);
                renderData += `
            <div class="card-header bg-white m-0 py-0" id="header${currentChar}">
            <h3 class="card-title my-0 ">${currentChar} </h3>
            </div>
            `;
            }

        }
        else {
            if ("#" != currentChar) {
                currentChar = "#";
                renderData += `
            <div class="card-header bg-white m-0 py-0" id="header${currentChar}">
            <h3 class="card-title my-0 ">${currentChar} </h3>
            </div>
            `;
            }

        }

        renderData = renderData + element;
    });

    return renderData;
};


// delete contact
let deleteContact = (e) => {
    let index = e.id.substring(3);
    let data = getData();
    data.splice(index, 1);
    console.log(data)
    saveNewData(data);
    app.innerHTML = renderPageNavigation() + renderData(getData());

}

//  EDIT

let editContact = (e) => {
    let index = e.id.substring(4);
    let contact = getData()[parseInt(index)];
    console.log(e.parentElement.parentElement.parentElement);
    e.parentElement.parentElement.parentElement.innerHTML = `
    <div class="card-header bg-white px-5">
    <h5 class="card-title my-0">${contact.name}</h5>
</div>
<div id="contactDetailsedit${index}" class="px-2 px-md-5">
    <div class="card-body py-0">
        <form id="contactForm">
            <div class="row my-0">
                <label for="editContactName" class="col-md-1 col-form-label py-0 text-nowrap">Name:</label>
                <div class="col-md-11">
                    <input type="text" class="form-control" id="editContactName" name="name" placeholder="Name" value="${contact.name}">
                </div>
            </div>
            <div class="row my-0">
                <label for="editContactEmail" class="col-md-1 col-form-label py-0 text-nowrap">Email:</label>
                <div class="col-md-11">
                    <input type="text" class="form-control" id="editContactEmail" name="email" placeholder="Email" value="${contact.email}">
                </div>
            </div>
            <div class="row my-0">
                <label for="editContactPhone" class="col-md-1 col-form-label py-0 text-nowrap">Phone:</label>
                <div class="col-md-11">
                    <input type="text" class="form-control" id="editContactPhone" name="phone" placeholder="Phone" value="${contact.phone}">
                </div>
            </div>
            <div class="row my-0">
                <label for="editContactAddress" class="col-md-1 col-form-label py-0 text-nowrap">Address:</label>
                <div class="col-md-11">
                    <input type="text" class="form-control" id="editContactAddress" name="address" placeholder="Address" value="${contact.address}">
                </div>
            </div>
        </form>
    </div>
    <div class="ml-auto mt-2 mx-0 px-2 px-md-5">
        <!-- Save Icon -->
        <a  class="btn btn-outline-primary text-primary mx-2 py-0" onclick="saveContact(this)">
            Save
        </a>
        <!-- Cancel Icon -->
        <a  class="btn btn-outline-danger text-danger mx-5 py-0" onclick="cancelEdit(this)">
            Cancel
        </a>
    </div>
</div>
    `;
}

// save edit
let saveContact = (e) => {
    let index = parseInt(e.parentElement.parentElement.id.substring(18));
    let contact = e.parentElement.parentElement.firstElementChild.firstElementChild;

    let savingData = {
        name: contact.name.value,
        email: contact.email.value,
        phone: contact.phone.value,
        address: contact.address.value,
    };

    let data = getData();
    data.splice(index, 1);
    data.push(savingData);
    saveNewData(data);
    app.innerHTML = renderPageNavigation() + renderData(getData());

}

// cancel edit
let cancelEdit = (e) => {
    let index = parseInt(e.parentElement.parentElement.id.substring(18));
    let data = getData()[index];

    e.parentElement.parentElement.parentElement.innerHTML = `
    <div class="card-header bg-white px-5" data-toggle="collapse" data-target="#contactDetails${index}">
        <h5 class="card-title my-0">${data.name}</h5>
        
    </div>
    <div id="contactDetails${index}" class="collapse show px-5">
        <div class="card-body py-0">
            <p class="card-text">Email: ${data.email}</p>
            <p class="card-text">Phone: ${data.phone}</p>
            <p class="card-text">Address: ${data.address}</p>
        </div>
        <div class="ml-auto mt-2 mx-0 px-5">
            <!-- Edit Icon -->
            <a href="#" id="edit${index}" onclick="editContact(this)" class=" btn btn-outline-primary text-primary mx-2 py-0">
                <i class="fas fa-pencil-alt"></i>
            </a>
            <!-- Delete Icon -->
            <a href="#"  id="del${index}" onclick="deleteContact(this)" class="btn btn-outline-danger text-danger mx-5 py-0">
                <i class="fas fa-trash-alt"></i>
            </a>
        </div>
    </div>    
    `;
}

//  Page Navigation

let renderPageNavigation = () => {
    let navData = "";
    for (let letter = 'A'.charCodeAt(0); letter <= 'Z'.charCodeAt(0); letter++) {
        navData += `<a class="btn btn-outline-secondary" href="#header${String.fromCharCode(letter)}">${String.fromCharCode(letter)}</a>`;
    }

    let nav = `
    <div class="btn-toolbar mb-3 row --bs-light-bg-subtle d-flex justify-content-center" role="toolbar"
            aria-label="Toolbar with button groups">
            <div class="btn-group d-flex flex-wrap my-auto col-md-10 " role="group" aria-label="First group">
                <a class="btn btn-outline-secondary" href="#header#">#</a>
                <a class="btn btn-outline-secondary" href="#header0-9">0-9</a>  
                ${navData}              
            </div>
        </div>
    `;
    return nav;
}



// ADD NEW CONTACT

let addNewContact = () => {
    app.innerHTML = `
    <div class="container">
            <h2 class="text-center">Add Contact</h2>
            <form onsubmit="handleSubmit(this)">
                <div class="form-group">
                    <label for="name">Name:</label>
                    <input type="text" class="form-control" id="name" placeholder="Enter your name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" class="form-control" id="email" placeholder="Enter your email">
                </div>
                <div class="form-group">
                    <label for="phone">Phone:</label>
                    <input type="tel" class="form-control" id="phone" placeholder="Enter your phone number" required>
                </div>
                <div class="form-group">
                    <label for="address">Address:</label>
                    <input type="text" class="form-control" id="address" placeholder="Enter your address">
                </div>
                <div class="form-group text-center">
                    <button type="submit" class="btn btn-primary mb-5">Submit</button>
                </div>
            </form>
        </div>
    `;
}

let handleSubmit = (e) => {

    let newContact = {
        name: e.name.value,
        email: e.email.value,
        phone: e.phone.value,
        address: e.address.value,
    };
    if(!(/^[0-9]+$/.test(newContact.phone)))
    {
        alert("invalid phone number");
    }else{
        let data = getData();
        data.push(newContact);
        saveNewData(data);
        app.innerHTML = renderPageNavigation() + renderData(getData());
    }


}


// home button ( show all contacts )
let renderContacts = () => {
    app.innerHTML = `
    <div class="row">
        <div class="col-md-12" id="contacts">
            <!-- all contacts -->
            ${renderPageNavigation()}
            ${renderData(getData())}
        </div>
    </div>
    `;    
}

// Search
function search() {
    let data = getData();
    var searchInput = document.getElementById('searchInput').value.toLowerCase();
    var results = document.getElementById('app');
    results.innerHTML = ''; 

    for (var i = 0; i < data.length; i++) {
        if (data[i].name.toLowerCase().includes(searchInput)) {
            results.innerHTML+=`${createContact(data[i],i)}`;
        }
    }

    if (results.innerHTML=="") {
        results.innerHTML = `<div class="alert alert-danger" role="alert">No Results Found</div>`;
    }
}




contacts.innerHTML = renderPageNavigation() + renderData(getData());
