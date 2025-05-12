document.addEventListener("DOMContentLoaded", function () {
    let currentPage = 1;
    const rowsPerPage = 10;

    function filterTable() {
        let table = document.getElementById("dataTable");
        let rows = Array.from(table.rows).slice(1);
        
        rows.forEach(row => {
            let cells = row.cells;
            let showRow = true;

            document.querySelectorAll(".filter-input").forEach((input, index) => {
                let filterValue = input.value.trim().toLowerCase();
                let cell = cells[index];
                let cellValue = cell.innerText.trim().toLowerCase();

                // Clear previous highlights
                cell.innerHTML = cell.innerText;

                if (!filterValue) return; // Skip empty filters

                let conditions = filterValue.split(/\s*OR\s*/i); // Split by "OR" (case insensitive)
                let matchFound = conditions.some(condition => {
                    if (condition.toLowerCase() === "blank" && (cellValue === "" || cellValue.trim() === "")) {
                        return true;
                    }

                    condition = ".*" + condition.replace(/\*/g, ".*").replace(/\?/g, ".") + ".*";
                    let regex = new RegExp(condition, "i");

                    return regex.test(cellValue);
                });

                if (!matchFound) {
                    showRow = false;
                }
            });

            row.style.display = showRow ? "" : "none";
        });

        paginateTable(); // Reapply pagination after filtering
    }

    function paginateTable() {
        let table = document.getElementById("dataTable");
        let rows = Array.from(table.rows).slice(1);
        let totalPages = Math.ceil(rows.length / rowsPerPage);

        rows.forEach((row, index) => {
            row.style.display = index >= (currentPage - 1) * rowsPerPage && index < currentPage * rowsPerPage ? "" : "none";
        });

        document.getElementById("page-info").innerText = `Page ${currentPage} of ${totalPages}`;
    }

    function nextPage() {
        let totalPages = Math.ceil(document.querySelectorAll("#dataTable tr").length / rowsPerPage);
        if (currentPage < totalPages) currentPage++;
        paginateTable();
    }

    function prevPage() {
        if (currentPage > 1) currentPage--;
        paginateTable();
    }

    document.querySelectorAll(".filter-input").forEach(input => {
        input.addEventListener("keyup", filterTable);
    });

    document.getElementById("nextPage").addEventListener("click", nextPage);
    document.getElementById("prevPage").addEventListener("click", prevPage);

    paginateTable(); // Initial load
});
