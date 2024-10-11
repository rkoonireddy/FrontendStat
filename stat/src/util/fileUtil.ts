export function convertToCSV(data: { [key: string]: string }[]): string {
    if (data.length === 0) return '';

    const columns = Object.keys(data[0]);
    const header = columns.join(',');
    const rows = data.map(row =>
        columns.map(col => row[col]).join(',')
    );
    return [header, ...rows].join('\n');
}

export function preProcessCSVData(csvString: { [key: string]: string; }[], selectedColumns: string[]) {
    let newRawData = csvString.map(row =>
        Object.fromEntries(Object.entries(row).filter(([key]) => selectedColumns.includes(key)))
    );

    // Remove rows where the first column is empty
    newRawData = newRawData.filter(row => {
        const firstKey = Object.keys(row)[0]; // Get the first key
        return row[firstKey] !== undefined && row[firstKey] !== ''; // Keep row if first column is not empty
    });

    // Clean the newRawData to ensure no empty values at the end of each row
    return newRawData.map(row => {
        const cleanedRow = {...row}; // Create a shallow copy of the row
        const keys = Object.keys(cleanedRow);
        let lastNonEmptyKeyIndex = keys.length - 1;

        // Find the last non-empty key in the row
        while (lastNonEmptyKeyIndex >= 0 && (cleanedRow[keys[lastNonEmptyKeyIndex]] === null || cleanedRow[keys[lastNonEmptyKeyIndex]] === '')) {
            lastNonEmptyKeyIndex--; // Move upwards until a non-empty value is found
        }

        // If there are empty values after the last non-empty key, set them to empty string
        for (let i = lastNonEmptyKeyIndex + 1; i < keys.length; i++) {
            cleanedRow[keys[i]] = ''; // Set the remaining keys to an empty string
        }

        return cleanedRow;
    });
}

export async function checkFileValidity(text: string): Promise<{ isValid: boolean, message: string }> {
    // Split the CSV into rows and trim whitespace from each row
    const rows = text.split("\n").map(row => row.trim()).filter(row => row.length > 0); // Remove completely empty rows

    // Determine the number of columns (assuming the first row is the header)
    const numColumns = rows[0]?.split(",").length || 0;

    // Check if the number of columns is less than 2
    if (numColumns < 2) {
        return { isValid: false, message: "The CSV file must contain at least 2 columns." };
    }

    // Remove any rows that are completely empty after cleaning
    const cleanedRows = rows.filter(row => row.split(",").some(cell => cell.trim() !== ''));

    // Check if the number of rows is less than 2
    if (cleanedRows.length < 2) {
        return { isValid: false, message: "The CSV file must contain at least 1 row of data." };
    }

    // Check if any value in the first column (timestamp) is missing
    const firstColumnValues = cleanedRows.map(row => row.split(",")[0]?.trim());
    const emptyTimestampIndex = firstColumnValues.findIndex(value => value === '');

    if (emptyTimestampIndex !== -1) {
        return { isValid: false, message: `Found empty value in the first column at row ${emptyTimestampIndex}, please ensure that the first column only contains valid integers. This is the row:\n${cleanedRows[emptyTimestampIndex]}` };
    }

    // Check if any value in the first column (timestamp) from the second row onwards is not an integer
    const nonIntegerIndex = firstColumnValues.slice(1).findIndex(value => {
        const parsedFloat = parseFloat(value); // First try to convert to float
        const isValidFloat = !isNaN(parsedFloat); // Check if valid float
        if (!isValidFloat) return true; // If not valid float, return true

        return !Number.isInteger(parsedFloat); // Then check if it is also a valid integer
    });

    if (nonIntegerIndex !== -1) {
        return { isValid: false, message: `Found non-integer string in the first column at row ${nonIntegerIndex + 1} with value '${firstColumnValues.slice(1)[nonIntegerIndex]}', please ensure that the first column only contains valid integers. This is the row:\n${cleanedRows[nonIntegerIndex + 1]}` };
    }

    // Also check if any value in the columns 2 to N are not numbers
    const nonNumberIndex = cleanedRows.slice(1).findIndex(row => {
        const values = row.split(",").slice(1);
        // Each value must either be valid number or empty
        const isValid = values.every(value => {
            const cleanedValue = value.trim();  // Remove any surrounding whitespace, e.g. "\r"
            return cleanedValue === "" || !isNaN(parseFloat(cleanedValue));  // Check if it's not empty and also not a number
        });

        return !isValid;
    });

    if (nonNumberIndex !== -1) {
        return { isValid: false, message: `Found non-number value in one of the value columns at row ${nonNumberIndex + 1}, please ensure that the second to N columns only contain valid numbers or empty (missing) values. This is the row:\n${cleanedRows[nonNumberIndex + 1]}` };
    }

    return { isValid: true, message: "The CSV file is valid." };
}