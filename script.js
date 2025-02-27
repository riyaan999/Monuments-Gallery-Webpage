// Store monuments in localStorage
let monuments = JSON.parse(localStorage.getItem('monuments')) || [];

// DOM Elements
const monumentsGrid = document.getElementById('monumentsGrid');
const addMonumentBtn = document.getElementById('addMonumentBtn');
const addMonumentModal = document.getElementById('addMonumentModal');
const editMonumentModal = document.getElementById('editMonumentModal');
const monumentForm = document.getElementById('monumentForm');
const editMonumentForm = document.getElementById('editMonumentForm');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

// Close buttons for modals
const closeButtons = document.querySelectorAll('.close');
closeButtons.forEach(button => {
    button.onclick = function() {
        addMonumentModal.style.display = 'none';
        editMonumentModal.style.display = 'none';
    }
});

// Open Add Monument Modal
addMonumentBtn.onclick = function() {
    addMonumentModal.style.display = 'block';
    monumentForm.reset();
}

// Add Monument
monumentForm.onsubmit = function(e) {
    e.preventDefault();
    
    const newMonument = {
        id: Date.now(),
        image: document.getElementById('monumentImage').value,
        name: document.getElementById('monumentName').value,
        description: document.getElementById('monumentDesc').value,
        city: document.getElementById('monumentCity').value
    };
    
    monuments.push(newMonument);
    saveAndRenderMonuments();
    addMonumentModal.style.display = 'none';
    monumentForm.reset();
}

// Edit Monument
editMonumentForm.onsubmit = function(e) {
    e.preventDefault();
    
    const monumentId = parseInt(document.getElementById('editMonumentId').value);
    const monumentIndex = monuments.findIndex(m => m.id === monumentId);
    
    if (monumentIndex !== -1) {
        monuments[monumentIndex] = {
            id: monumentId,
            image: document.getElementById('editMonumentImage').value,
            name: document.getElementById('editMonumentName').value,
            description: document.getElementById('editMonumentDesc').value,
            city: document.getElementById('editMonumentCity').value
        };
        
        saveAndRenderMonuments();
        editMonumentModal.style.display = 'none';
    }
}

// Delete Monument
function deleteMonument(id) {
    monuments = monuments.filter(monument => monument.id !== id);
    saveAndRenderMonuments();
}

// Open Edit Modal
function openEditModal(monument) {
    document.getElementById('editMonumentId').value = monument.id;
    document.getElementById('editMonumentImage').value = monument.image;
    document.getElementById('editMonumentName').value = monument.name;
    document.getElementById('editMonumentDesc').value = monument.description;
    document.getElementById('editMonumentCity').value = monument.city;
    
    editMonumentModal.style.display = 'block';
}

// Search Monuments
searchBtn.onclick = function() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredMonuments = monuments.filter(monument =>
        monument.name.toLowerCase().includes(searchTerm)
    );
    renderMonuments(filteredMonuments);
}

// Reset search when input is cleared
searchInput.onkeyup = function(e) {
    if (e.target.value === '') {
        renderMonuments(monuments);
    }
}

// Save to localStorage and render
function saveAndRenderMonuments() {
    localStorage.setItem('monuments', JSON.stringify(monuments));
    renderMonuments(monuments);
}

// Render monuments to grid
function renderMonuments(monumentsToRender) {
    monumentsGrid.innerHTML = '';
    
    monumentsToRender.forEach(monument => {
        const monumentCard = document.createElement('div');
        monumentCard.className = 'monument-card';
        
        monumentCard.innerHTML = `
            <img src="${monument.image}" alt="${monument.name}" class="monument-image" onclick="openEditModal(${JSON.stringify(monument).replace(/"/g, '&quot;')})">
            <div class="monument-details">
                <h3>${monument.name}</h3>
                <p>${monument.description}</p>
                <p class="city">${monument.city}</p>
            </div>
            <button class="delete-btn" onclick="deleteMonument(${monument.id})">Delete</button>
        `;
        
        monumentsGrid.appendChild(monumentCard);
    });
}

// Initial render
renderMonuments(monuments);

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target === addMonumentModal || event.target === editMonumentModal) {
        addMonumentModal.style.display = 'none';
        editMonumentModal.style.display = 'none';
    }
}