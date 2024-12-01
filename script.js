const fileInput = document.getElementById("fileInput");
const jobList = document.getElementById("jobList");
const levelFilter = document.getElementById("levelFilter");
const typeFilter = document.getElementById("typeFilter");

let jobs = [];

fileInput.addEventListener("change", handleFileUpload);
levelFilter.addEventListener("change", applyFilters);
typeFilter.addEventListener("change", applyFilters);

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

function displayJobs(jobsToDisplay) {
  jobList.innerHTML = ""; // Clear existing jobs
  jobsToDisplay.forEach((job) => {
    const jobDiv = document.createElement("div");
    jobDiv.className = "job";
    jobDiv.innerHTML = `
      <h2>${job.Title}</h2>
      <p><strong>Posted:</strong> ${job.Posted}</p>
      <p><strong>Type:</strong> ${job.Type}</p>
      <p><strong>Level:</strong> ${job.Level}</p>
      <p><strong>Estimated Time:</strong> ${job["Estimated Time"] || "N/A"}</p>
      <p><strong>Skill:</strong> ${job.Skill || "N/A"}</p>
      <p><strong>Detail:</strong> ${job.Detail.substring(0, 100)}...</p>
      <a href="${job["Job Page Link"]}" target="_blank">View Job</a>
    `;
    jobList.appendChild(jobDiv);
  });
}

function applyFilters() {
  const level = levelFilter.value;
  const type = typeFilter.value;

  const filteredJobs = jobs.filter((job) => {
    return (
      (level === "All" || job.Level === level) &&
      (type === "All" || job.Type === type)
    );
  });

  displayJobs(filteredJobs);
}
