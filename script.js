let jobs = [];

// Function to display jobs
function displayJobs(filteredJobs) {
  const jobListings = document.getElementById("jobListings");
  jobListings.innerHTML = ""; // Clear existing jobs

  if (filteredJobs.length === 0) {
    jobListings.innerHTML = `<div style="text-align: center; color: gray; font-size: 18px;">No information found</div>`;
    return;
  }

  filteredJobs.forEach(job => {
    const jobElement = document.createElement("div");
    jobElement.className = "job-listing";
    jobElement.innerHTML = `
      <div class="job-title">${job.Title}</div>
      <div class="job-detail"><strong>Type:</strong> ${job.Type}</div>
      <div class="job-detail"><strong>Level:</strong> ${job.Level}</div>
      <div class="job-detail"><strong>Skill:</strong> ${job.Skill}</div>
      <div class="job-detail"><strong>Posted:</strong> ${job.Posted}</div>
      <a href="${job.JobPageLink}" target="_blank">View Job</a>
    `;
    jobListings.appendChild(jobElement);
  });
}

// Function to populate skill filter dropdown
function populateSkillFilter(jobs) {
  const skillFilter = document.getElementById("skillFilter");
  skillFilter.innerHTML = `<option value="All">All</option>`; // Reset filter options
  const uniqueSkills = [...new Set(jobs.map(job => job.Skill).filter(skill => skill))];
  uniqueSkills.forEach(skill => {
    const option = document.createElement("option");
    option.value = skill;
    option.textContent = skill;
    skillFilter.appendChild(option);
  });
}

// Function to filter jobs
function filterJobs() {
  const levelFilter = document.getElementById("levelFilter").value;
  const typeFilter = document.getElementById("typeFilter").value;
  const skillFilter = document.getElementById("skillFilter").value;

  const filteredJobs = jobs.filter(job => {
    const matchesLevel = levelFilter === "All" || job.Level === levelFilter;
    const matchesType = typeFilter === "All" || job.Type === typeFilter;
    const matchesSkill = skillFilter === "All" || job.Skill === skillFilter;
    return matchesLevel && matchesType && matchesSkill;
  });

  displayJobs(filteredJobs);
}

// Function to sort jobs
function sortJobs(field) {
  jobs.sort((a, b) => (a[field] > b[field] ? 1 : -1));
  displayJobs(jobs);
}

// Function to handle file upload
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        jobs = JSON.parse(e.target.result);
        populateSkillFilter(jobs); // Populate the skill dropdown
        displayJobs(jobs); // Display all jobs
      } catch (error) {
        alert("Error parsing JSON file. Please make sure the format is correct.");
      }
    };
    reader.readAsText(file);
  }
}

// Event listeners
document.getElementById("fileInput").addEventListener("change", handleFileUpload);
document.getElementById("levelFilter").addEventListener("change", filterJobs);
document.getElementById("typeFilter").addEventListener("change", filterJobs);
document.getElementById("skillFilter").addEventListener("change", filterJobs);
document.getElementById("sortTitle").addEventListener("click", () => sortJobs("Title"));
document.getElementById("sortPosted").addEventListener("click", () => sortJobs("Posted"));
