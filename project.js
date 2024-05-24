const loadAllPlayer = (query) => {
    const url = query 
        ? `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${query}`
        : `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p`; 

    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            console.log(data.player);
            displayPlayer(data.player, !!query);
        })
};

const displayPlayer = (players, isSearch = false) => {
    const displayContainer = document.getElementById("cart-container");

    if (isSearch) {
        displayContainer.innerHTML = ''; 
    }

    players.forEach(playerData => {
        const div = document.createElement("div");
        div.classList.add("card");

        div.innerHTML = `
            <img class="card-img-top" src="${playerData?.strThumb}" alt="${playerData?.strPlayer}" />
            <div class="card-body">
                <h5 class="card-title">${playerData?.strPlayer?.slice(0, 20)}</h5>
                <p class="card-text">${playerData?.strDescriptionEN?.slice(0, 50)}</p>
                <p class="card-text">${playerData?.strBirthLocation}</p>
                <p class="card-text">${playerData?.strGender}</p>           
                <p class="card-text">${playerData?.strSport}</p>
                <button onClick="singlePlayer('${playerData?.idPlayer}')" class="btn btn-secondary me-4" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Details</button>
                <button onClick="handleToGroup('${playerData?.strPlayer}','${playerData?.strThumb}','${playerData?.strGender}')" class="btn btn-success">Add to Group</button>
            </div>
        `;

        displayContainer.appendChild(div);
    });
};

const singlePlayer = (playerId) => {
    fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${playerId}`)
        .then(res => res.json())
        .then(data => {
            const playerData = data.players[0];
            populateModal(playerData);
        })
};

const populateModal = (playerData) => {
    document.getElementById("staticBackdropLabel").innerText = playerData.strPlayer;
    document.querySelector(".modal-body").innerHTML = `
        <img src="${playerData?.strThumb}" class="img-fluid mb-3" alt="${playerData?.strPlayer}">
        <p><strong>Description:</strong> ${playerData?.strDescriptionEN }</p>
        <p><strong>Birth Location:</strong> ${playerData?.strBirthLocation}</p>
        <p><strong>Gender:</strong> ${playerData?.strGender}</p>
        <p><strong>Jersey Number:</strong> ${playerData?.strNumber}</p>
        <p><strong>Sport:</strong> ${playerData?.strSport}</p>
        <p> <strong>Jersey Number:</strong> ${playerData?.strNumber}</p>
        <p><strong>Status:</strong> ${playerData?.strStatus}</p>
    `;
};

const handleToGroup = (name,image,gender) => {
    console.log("Image URL:", image);
    const groupCount = document.getElementById("count").innerText;
    const groupfCount = document.getElementById("Fcount").innerText;
    const groupmCount = document.getElementById("Mcount").innerText;
    let female = parseInt(groupfCount);
    let male = parseInt(groupmCount);
    let convertedCount = parseInt(groupCount);

    if (convertedCount >= 11) {
        alert("The group is full. Cannot add more than 11 members.");
        return;
    }
    if(gender === "Male")
        {
            male+=1
        }
        if(gender === "Female")
            {
                female+=1
            }

    convertedCount += 1;
    document.getElementById("count").innerText = convertedCount;
    document.getElementById("Fcount").innerText = female;
    document.getElementById("Mcount").innerText = male;

    const container = document.getElementById("group-main-container");
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
    <img class='mx-auto mt-3' src="${image}" width="80px" alt="${name}"/>
      <p class='text-center fs-2 mb-0'>${name}</p>
      <p class='text-center'>${gender}</p>
    `;
    container.appendChild(div);
};

const handleSearch = (event) => {
    event.preventDefault();
    const searchInput = document.querySelector('input[type="search"]').value;
    loadAllPlayer(searchInput);
};

document.querySelector('form').addEventListener('submit', handleSearch);

loadAllPlayer();
