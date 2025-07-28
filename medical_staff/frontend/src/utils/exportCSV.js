export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) return;

  // Function to process cell data and handle special characters
  const processCell = (cell) => {
    if (cell === null || cell === undefined) return '""';
    // Convert to string and handle special characters
    const stringCell = String(cell).replace(/"/g, '""');
    // Quote if the cell contains commas, quotes, or newlines
    return /[",\n\r]/.test(stringCell) ? `"${stringCell}"` : stringCell;
  };

  // Flatten nested objects into a single level
  const flattenObject = (obj, prefix = '') => {
    return Object.keys(obj).reduce((acc, key) => {
      const propName = prefix ? `${prefix}_${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(acc, flattenObject(obj[key], propName));
      } else {
        acc[propName] = obj[key];
      }
      return acc;
    }, {});
  };

  // Flatten the data
  const flattenedData = data.map(item => flattenObject(item));

  // Get headers from the flattened data
  const headers = Object.keys(flattenedData[0]);

  // Create CSV rows
  const csvRows = [
    // Header row
    headers.join(','),
    // Data rows
    ...flattenedData.map(row =>
      headers.map(header => processCell(row[header])).join(',')
    )
  ];

  // Create and download the CSV file
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
