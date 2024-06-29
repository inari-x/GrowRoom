const plants = [
  { id: 1, name: 'Plant 1', image: 'plant1.jpg' },
  { id: 2, name: 'Plant 2', image: 'plant2.jpg' },
  { id: 3, name: 'Plant 3', image: 'plant3.jpg' },
  { id: 4, name: 'Plant 4', image: 'plant4.jpg' }
];

const plantSelect = document.getElementById('plantSelect');
const selectedPlantsDiv = document.getElementById('selectedPlants');

plants.forEach(plant => {
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
  });
  
  clone.appendChild(newRemoveButton);
  clone.setAttribute('draggable', false);
  ev.target.appendChild(clone);
}

plantSelect.addEventListener('change', function() {
  const selectedPlantId = parseInt(this.value);
  const selectedPlant = plants.find(plant => plant.id === selectedPlantId);
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
    });

    plantElement.appendChild(removeButton);
    selectedPlantsDiv.appendChild(plantElement);
  }
});
