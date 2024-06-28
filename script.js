// Define an array of plants (for demonstration)
const plants = [
  { id: 1, name: 'Plant 1', image: 'plant1.jpg' },
  { id: 2, name: 'Plant 2', image: 'plant2.jpg' },
  { id: 3, name: 'Plant 3', image: 'plant3.jpg' },
  { id: 4, name: 'Plant 4', image: 'plant4.jpg' }
];

// Populate the dropdown with plant options
const plantSelect = document.getElementById('plantSelect');
plants.forEach(plant => {
  const option = document.createElement('option');
  option.value = plant.id;
  option.textContent = plant.name;
  plantSelect.appendChild(option);
});

// Function to handle drag start event
function drag(ev) {
  ev.dataTransfer.setData('text', ev.target.id);
}

// Function to handle drag over event
function allowDrop(ev) {
  ev.preventDefault();
}

// Function to handle drop event
function drop(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData('text');
  const draggedElement = document.getElementById(data);

  // Clone the dragged element to drop into the target
  const clone = draggedElement.cloneNode(true);
  clone.setAttribute('draggable', false); // Disable dragging on the clone

  // Add a remove button
  const removeButton = document.createElement('button');
  removeButton.textContent = 'Remove';
  removeButton.className = 'remove-button';
  removeButton.addEventListener('click', function() {
    this.parentElement.removeChild(this);
  });
  clone.appendChild(removeButton);

  // Find the target table space and append the cloned element
  ev.target.appendChild(clone);
}

// Event listener for when the plant selection changes
plantSelect.addEventListener('change', function() {
  const selectedPlantId = parseInt(this.value); // Get the selected plant ID
  const selectedPlant = plants.find(plant => plant.id === selectedPlantId);

  // Display the selected plant information (for demonstration, you can modify as needed)
  if (selectedPlant) {
    alert(`Selected Plant: ${selectedPlant.name}`);
    
    // Create a draggable plant element
    const plantElement = document.createElement('div');
    plantElement.textContent = selectedPlant.name;
    plantElement.id = `plant_${selectedPlant.id}`;
    plantElement.className = 'draggable-plant';
    plantElement.draggable = true;
    plantElement.addEventListener('dragstart', drag);

    // Append the draggable plant to the container (for demonstration, modify as needed)
    document.body.appendChild(plantElement);
  }
});
