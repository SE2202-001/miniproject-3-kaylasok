let jobs = []; // To store the parsed jobs from JSON

// Event listeners for file input and filters
document.getElementById("fileInput").addEventListener("change", handleFileUpload);
document.getElementById("levelFilter").addEventListener("change", filterJobs);
document.getElementById("typeFilter").addEventListener("change", filterJobs);

// Event listeners for sort buttons
document.getElementById("sortTitle").addEventListener("click", () => sortJobs("title"));
document.getElementById("sortPosted").addEventListener("click", () => sortJobs("posted"));

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      jobs = JSON.parse(e.target.result);
      displayJobs(jobs);
    };
    reader.readAsText(file);
  }
}

// Display jobs in the job list
function displayJobs(jobsToDisplay) {
  const jobList = document.getElementById("jobs");
  jobList.innerHTML = ""; // Clear the list

  jobsToDisplay.forEach((job) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <h3>${job.Title}</h3>
      <p><strong>Level:</strong> ${job.Level}</p>
      <p><strong>Type:</strong> ${job.Type}</p>
      <p><strong>Skill:</strong> ${job.Skill}</p>
      <p><strong>Posted:</strong> ${job.Posted}</p>
      <p><strong>Detail:</strong> ${job.Detail}</p>
      <a href="${job["Job Page Link"]}" target="_blank">View Job</a>
    `;
    jobList.appendChild(listItem);
  });
}

// Filter jobs based on selected filters
function filterJobs() {
  const level = document.getElementById("levelFilter").value;
  const type = document.getElementById("typeFilter").value;

  const filteredJobs = jobs.filter((job) => {
    const matchesLevel = level === "All" || job.Level === level;
    const matchesType = type === "All" || job.Type === type;
    return matchesLevel && matchesType;
  });

  displayJobs(filteredJobs);
}

// Sort jobs by criteria
function sortJobs(criteria) {
  let sortedJobs = [...jobs]; // Create a copy of the jobs array

  if (criteria === "title") {
    sortedJobs.sort((a, b) => a.Title.localeCompare(b.Title)); // Alphabetical sort by title
  } else if (criteria === "posted") {
    sortedJobs.sort((a, b) => {
      // Sort by posted time
      return extractMinutesAgo(a.Posted) - extractMinutesAgo(b.Posted);
    });
  }

  displayJobs(sortedJobs); // Update display
}

// Utility function to extract "minutes ago" as a number
function extractMinutesAgo(posted) {
  const match = posted.match(/(\d+)\s+minute/); // Match "X minutes ago"
  return match ? parseInt(match[1], 10) : Infinity; // Default to Infinity if no match
}
