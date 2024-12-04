let jobs = []; // To store parsed jobs from JSON

// Event listeners
document.getElementById("fileInput").addEventListener("change", handleFileUpload);
document.getElementById("levelFilter").addEventListener("change", filterJobs);
document.getElementById("typeFilter").addEventListener("change", filterJobs);
document.getElementById("sortTitle").addEventListener("click", () => sortJobs("title"));
document.getElementById("sortPosted").addEventListener("click", () => sortJobs("posted"));

// Modal elements
const modal = document.getElementById("jobModal");
const modalContent = document.getElementById("jobDetails");
const closeModal = document.querySelector(".close");

// Close the modal when the "X" is clicked
closeModal.onclick = () => {
  modal.style.display = "none";
};

// Close the modal when clicking outside of it
window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// Handle file upload
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        jobs = JSON.parse(e.target.result);
        displayJobs(jobs);
      } catch (error) {
        alert("Error parsing JSON file. Please make sure the format is correct.");
      }
    };
    reader.readAsText(file);
  }
}

// Display job listings
function displayJobs(jobsToDisplay) {
  const jobList = document.getElementById("jobs");
  jobList.innerHTML = ""; // Clear existing job listings

  jobsToDisplay.forEach((job, index) => {
    const listItem = document.createElement("li");
    listItem.className = "job-item";
    listItem.innerHTML = `
      <h3>${job.Title} - ${job.Type} (${job.Level})</h3>
      <button class="view-details" data-index="${index}">View Details</button>
    `;

    // Bind the click event listener to the "View Details" button
    const viewDetailsButton = listItem.querySelector(".view-details");
    viewDetailsButton.addEventListener("click", () => {
      showJobDetails(index);
    });

    jobList.appendChild(listItem);
  });
}

// Show job details in a popup
function showJobDetails(index) {
  const job = jobs[index];
  if (!job) {
    alert("Job details not found.");
    return;
  }

  // Open a popup window with specified dimensions
  const popup = window.open("", "jobDetailsPopup", "width=500,height=600,scrollbars=yes");

  // Write job details into the popup window
  popup.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Job Details</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 20px;
        }
        h2 {
          color: #333;
        }
        p {
          margin: 10px 0;
        }
        a {
          color: #007BFF;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
        .close-btn {
          display: inline-block;
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #007BFF;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          text-align: center;
        }
        .close-btn:hover {
          background-color: #0056b3;
        }
      </style>
    </head>
    <body>
      <h2>${job.Title}</h2>
      <p><strong>Type:</strong> ${job.Type}</p>
      <p><strong>Level:</strong> ${job.Level}</p>
      <p><strong>Skill:</strong> ${job.Skill}</p>
      <p><strong>Description:</strong> ${job.Detail}</p>
      <p><strong>Posted:</strong> ${job.Posted}</p>
      <a href="${job["Job Page Link"]}" target="_blank">Go to Job Page</a>
      <br>
      <button class="close-btn" onclick="window.close()">Close</button>
    </body>
    </html>
  `);

  popup.document.close(); // Ensure the document is fully written
}



// Filter jobs based on selected criteria
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

// Sort jobs based on the selected criteria
function sortJobs(criteria) {
  let sortedJobs = [...jobs]; // Create a copy of the jobs array

  if (criteria === "title") {
    sortedJobs.sort((a, b) => a.Title.localeCompare(b.Title)); // Sort alphabetically by title
  } else if (criteria === "posted") {
    sortedJobs.sort((a, b) => extractMinutesAgo(a.Posted) - extractMinutesAgo(b.Posted));
  }

  displayJobs(sortedJobs);
}

// Extract minutes from "X minutes ago" text
function extractMinutesAgo(posted) {
  const match = posted.match(/(\d+)\s+minute/); // Match "X minutes ago"
  return match ? parseInt(match[1], 10) : Infinity; // Default to Infinity if no match
}
