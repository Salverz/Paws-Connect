<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>My Pet Profiles</title>
<style>
  body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
  }
  .container {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  h1 {
    text-align: center;
    color: #333;
  }
  .pet-profile {
    margin-bottom: 10px;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 8px;
  }
</style>
</head>
<body>
<div class="container">
  <h1>My Pet Profiles</h1>
  <div id="petProfiles">
  </div>
  <button onclick="addPet()">Add New Pet</button>
</div>

<script>
  let petProfiles = [];

  function displayPetProfiles() {
    const petProfilesDiv = document.getElementById('petProfiles');
    petProfilesDiv.innerHTML = '';
    petProfiles.forEach((pet, index) => {
      const petProfileDiv = document.createElement('div');
      petProfileDiv.classList.add('pet-profile');
      petProfileDiv.textContent = `${pet.name} - ${pet.type}`;
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => {
        deletePet(index);
      });
      petProfileDiv.appendChild(deleteButton);
      petProfilesDiv.appendChild(petProfileDiv);
    });
  }

  function addPet() {
    const petName = prompt('Enter pet name:');
    const petType = prompt('Enter pet type:');
    if (petName && petType) {
      petProfiles.push({ name: petName, type: petType });
      displayPetProfiles();
    }
  }

  function deletePet(index) {
    petProfiles.splice(index, 1);
    displayPetProfiles();
  }

  displayPetProfiles();
</script>
</body>
</html>
