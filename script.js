document.addEventListener('DOMContentLoaded', function() {
  const plants = [
    { id: 1, name: 'Plant 1', image: 'plant1.jpg' },
    { id: 2, name: 'Plant 2', image: 'plant2.jpg' },
    { id: 3, name: 'Plant 3', image: 'plant3.jpg' },
    { id: 4, name: 'Plant 4', image: 'plant4.jpg' }
  ];

  const plantSelect = document.getElementById('plantSelect');
  const selectedPlantsDiv = document.getElementById('selectedPlants');
  const createPlantButton = document.getElementById('createPlantButton');
  const createPlantPopup = document.getElementById('createPlantPopup');
  const addPlantButton = document.getElementById('addPlantButton');
  const closePopupButton = document.querySelector('.close');
  const plantNameInput = document.getElementById('plantName');
  const plantImageInput = document.getElementById('plantImage');

  // Load plants from localStorage or use default if not present
  let createdPlants = JSON.parse(localStorage.getItem('createdPlants')) || [];

  // Populate the dropdown with existing plants and created plants
  plants.concat(createdPlants).forEach(plant => {
    const option = document.createElement('option');
    option.value = plant.id;
    option.textContent = plant.name;
    plantSelect.appendChild(option);
  });

  function drag(ev) {
    ev.dataTransfer.setData('text', ev.target.id);
  }

  function allowDrop(ev) {
    ev.preventDefault();
  }

  function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData('text');
    const draggedElement = document.getElementById(data);

    // Clone the plant element without the existing remove button
    const clone = draggedElement.cloneNode(true);
    const removeButton = clone.querySelector('.remove-button');
    if (removeButton) {
      removeButton.remove();
    }

    // Add a new remove button for the dropped plant
    const newRemoveButton = document.createElement('button');
    newRemoveButton.textContent = 'Remove';
    newRemoveButton.className = 'remove-button';
    newRemoveButton.addEventListener('click', function() {
      clone.remove();
      saveState();
    });

    clone.appendChild(newRemoveButton);
    clone.setAttribute('draggable', false);
    ev.target.appendChild(clone);

    saveState();
  }

  function saveState() {
    const state = {};
    const tablePlaces = document.querySelectorAll('.place');
    tablePlaces.forEach(place => {
      const plantsInPlace = place.children;
      const plantIds = [];
      for (const plant of plantsInPlace) {
        if (plant.id.startsWith('plant_')) {
          const id = plant.id.split('_')[1];
          plantIds.push(id);
        }
      }
      state[place.id] = plantIds;
    });
    localStorage.setItem('tableState', JSON.stringify(state));
  }

  function loadState() {
    const state = JSON.parse(localStorage.getItem('tableState'));
    if (state) {
      const tablePlaces = document.querySelectorAll('.place');
      tablePlaces.forEach(place => {
        const plantIds = state[place.id];
        if (plantIds) {
          plantIds.forEach(id => {
            const plant = plants.find(p => p.id == id) || createdPlants.find(p => p.id == id);
            if (plant) {
              const plantElement = document.createElement('div');
              plantElement.textContent = plant.name;
              plantElement.id = `plant_${plant.id}`;
              plantElement.className = 'draggable-plant';
              plantElement.draggable = true;
              plantElement.addEventListener('dragstart', drag);

              const removeButton = document.createElement('button');
              removeButton.textContent = 'Remove';
              removeButton.className = 'remove-button';
              removeButton.addEventListener('click', function() {
                plantElement.remove();
                saveState();
              });

              plantElement.appendChild(removeButton);
              plantElement.setAttribute('draggable', false);
              place.appendChild(plantElement);
            }
          });
        }
      });
    }
  }

  plantSelect.addEventListener('change', function() {
    const selectedPlantId = parseInt(this.value);
    const selectedPlant = plants.concat(createdPlants).find(plant => plant.id === selectedPlantId);
    if (selectedPlant) {
      const plantElement = document.createElement('div');
      plantElement.textContent = selectedPlant.name;
      plantElement.id = `plant_${selectedPlant.id}`;
      plantElement.className = 'draggable-plant';
      plantElement.draggable = true;
      plantElement.addEventListener('dragstart', drag);

      const removeButton = document.createElement('button');
      removeButton.textContent = 'Remove';
      removeButton.className = 'remove-button';
      removeButton.addEventListener('click', function() {
        plantElement.remove();
        saveState();
      });

      plantElement.appendChild(removeButton);
      selectedPlantsDiv.appendChild(plantElement);
    }
  });

  createPlantButton.addEventListener('click', function() {
    createPlantPopup.style.display = 'block';
  });

  closePopupButton.addEventListener('click', function() {
    createPlantPopup.style.display = 'none';
  });

  addPlantButton.addEventListener('click', function() {
    const plantName = plantNameInput.value;
    const plantImage = plantImageInput.value;

    if (plantName && plantImage) {
      const newPlantId = plants.length + createdPlants.length + 1;
      const newPlant = { id: newPlantId, name: plantName, image: plantImage };
      createdPlants.push(newPlant);
      localStorage.setItem('createdPlants', JSON.stringify(createdPlants));

      const option = document.createElement('option');
      option.value = newPlant.id;
      option.textContent = newPlant.name;
      plantSelect.appendChild(option);

      plantNameInput.value = '';
      plantImageInput.value = '';

      createPlantPopup.style.display = 'none';
    } else {
      alert('Please fill in both the plant name and image URL.');
    }
  });

  // Close the popup if the user clicks outside of the popup content
  window.addEventListener('click', function(event) {
    if (event.target == createPlantPopup) {
      createPlantPopup.style.display = 'none';
    }
  });

  // Add event listeners to the table spaces
  const tablePlaces = document.querySelectorAll('.place');
  tablePlaces.forEach(place => {
    place.addEventListener('dragover', allowDrop);
    place.addEventListener('drop', drop);
  });

  // Load state on page load
  loadState();
});
