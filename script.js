const plants = [
  { id: 1, name: 'Plant 1', image: 'plant1.jpg' },
  { id: 2, name: 'Plant 2', image: 'plant2.jpg' },
  { id: 3, name: 'Plant 3', image: 'plant3.jpg' },
  { id: 4, name: 'Plant 4', image: 'plant4.jpg' }
];

const plantSelect = document.getElementById('plantSelect');
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
  const clone = draggedElement.cloneNode(true);
  clone.setAttribute('draggable', false);
  const removeButton = document.createElement('button');
  removeButton.textContent = 'Remove';
  removeButton.className = 'remove-button';
  removeButton.addEventListener('click', function() {
    this.parentElement.remove();
  });
  clone.appendChild(removeButton);
  ev.target.appendChild(clone);
}

plantSelect.addEventListener('change', function() {
  const selectedPlantId = parseInt(this.value);
  const selectedPlant = plants.find(plant => plant.id === selectedPlantId);
  if (selectedPlant) {
    alert(`Selected Plant: ${selectedPlant.name}`);
    const plantElement = document.createElement('div');
    plantElement.textContent = selectedPlant.name;
    plantElement.id = `plant_${selectedPlant.id}`;
    plantElement.className = 'draggable-plant';
    plantElement.draggable = true;
    plantElement.addEventListener('dragstart', drag);
    document.body.appendChild(plantElement);
  }
});
