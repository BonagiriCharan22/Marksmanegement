// Function to load existing data from local storage
function loadMarks() {
    const marksData = JSON.parse(localStorage.getItem('marksData')) || [];
    displayMarks(marksData);
    updateChart(marksData);
}

// Function to add marks to local storage
function addMarks() {
    const rollNumber = parseInt(document.getElementById('rollNumber').value);
    const name = document.getElementById('name').value.trim();
    const marks = parseInt(document.getElementById('marks').value);

    if (rollNumber && name && marks >= 0 && marks <= 100) {
        const marksData = JSON.parse(localStorage.getItem('marksData')) || [];

        const existingEntry = marksData.find(entry => entry.rollNumber === rollNumber);

        if (existingEntry) {
            existingEntry.name = name;
            existingEntry.marks = marks;
            alert("Updated existing entry for Roll Number " + rollNumber);
        } else {
            marksData.push({ rollNumber, name, marks });
            alert("Added new entry for Roll Number " + rollNumber);
        }

        localStorage.setItem('marksData', JSON.stringify(marksData));
        loadMarks();
        clearInputs();
    } else {
        alert("Please provide valid inputs.");
    }
}

// Function to clear input fields
function clearInputs() {
    document.getElementById('rollNumber').value = '';
    document.getElementById('name').value = '';
    document.getElementById('marks').value = '';
}

// Function to display marks in the table
function displayMarks(data) {
    const marksOutput = document.getElementById('marksOutput').getElementsByTagName('tbody')[0];
    marksOutput.innerHTML = '';

    data.forEach(entry => {
        const row = marksOutput.insertRow();
        row.insertCell(0).textContent = entry.rollNumber;
        row.insertCell(1).textContent = entry.name;
        row.insertCell(2).textContent = entry.marks;
    });

    const downloadVisibility = data.length > 0 ? 'block' : 'none';
    document.getElementById('downloadPDFButton').style.display = downloadVisibility;
    document.getElementById('downloadTextButton').style.display = downloadVisibility;
}

// Function to filter the table
function filterTable() {
    const query = document.getElementById('search').value.toLowerCase();
    const marksData = JSON.parse(localStorage.getItem('marksData')) || [];
    const filteredData = marksData.filter(entry =>
        entry.name.toLowerCase().includes(query) || entry.rollNumber.toString().includes(query)
    );
    displayMarks(filteredData);
}

// Function to sort the table
function sortTable(columnIndex) {
    const marksData = JSON.parse(localStorage.getItem('marksData')) || [];
    marksData.sort((a, b) => {
        const valA = Object.values(a)[columnIndex];
        const valB = Object.values(b)[columnIndex];
        return typeof valA === 'number' ? valA - valB : valA.localeCompare(valB);
    });
    localStorage.setItem('marksData', JSON.stringify(marksData));
    loadMarks();
}

// Function to clear all data
function clearAllData() {
    localStorage.removeItem('marksData');
    loadMarks();
    alert("All data cleared!");
}

// Function to update the chart
function updateChart(data) {
    const ctx = document.getElementById('marksChart').getContext('2d');
    const labels = data.map(entry => entry.name);
    const marks = data.map(entry => entry.marks);

    if (window.marksChart) {
        window.marksChart.destroy();
    }

    window.marksChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Marks',
                data: marks,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Function to generate and download PDF
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const marksData = JSON.parse(localStorage.getItem('marksData')) || [];
    doc.text("Student Marks List", 10, 10);
    marksData.forEach((entry, index) => {
        doc.text(`${entry.rollNumber} ${entry.name} ${entry.marks}`, 10, 20 + (index * 10));
    });
    doc.save("Student_Marks_List.pdf");
}

// Function to download text file
function downloadTextFile() {
    const marksData = JSON.parse(localStorage.getItem('marksData')) || [];
    let text = "Roll Number\tName\tMarks\n";
    marksData.forEach(entry => {
        text += `${entry.rollNumber}\t${entry.name}\t${entry.marks}\n`;
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Student_Marks_List.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Initialize on page load
window.onload = loadMarks;