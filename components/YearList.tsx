import React, { useState, useEffect }  from 'react';

interface YearListProps {
  listName: string;
}

const YearList: React.FC<YearListProps> = ({listName}) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const years = Array.from({ length: 7 }, (_, i) => currentYear - 5 + i);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = parseInt(event.target.value);
    if (selectedYear) {
      setCurrentYear(selectedYear);
    }
  };

  return (
    <div className="year-list">
      <label htmlFor="year-select">{listName}:</label>
      <select id="year-select" value={currentYear} onChange={handleChange}>
        {years.map((year) => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>
  );
};

export default YearList;
