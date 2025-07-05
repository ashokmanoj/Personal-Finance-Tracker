import React from 'react';
import Select from '../ui/Select';
import { DateRange } from '../../types';
import { 
  getCurrentMonthRange, 
  getCurrentYearRange, 
  getLast30DaysRange, 
  getLast90DaysRange,
  getMonthRange,
  getYearRange,
  getLastNMonths,
  getCurrentMonth,
  getCurrentYear,
  getMonthNameFromString
} from '../../utils/dateUtils';

interface DateRangeSelectorProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  dateRange,
  onDateRangeChange,
}) => {
  // Generate month options for the last 12 months
  const monthOptions = getLastNMonths(12).map(month => ({
    value: month,
    label: getMonthNameFromString(month) + ' ' + month.substring(0, 4),
  }));
  
  // Generate year options for the last 5 years
  const currentYear = parseInt(getCurrentYear());
  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const year = (currentYear - i).toString();
    return { value: year, label: year };
  });
  
  // Predefined date ranges
  const predefinedRanges = [
    { value: 'current_month', label: 'Current Month' },
    { value: 'last_30_days', label: 'Last 30 Days' },
    { value: 'last_90_days', label: 'Last 90 Days' },
    { value: 'current_year', label: 'Current Year' },
    { value: 'custom_month', label: 'Select Month' },
    { value: 'custom_year', label: 'Select Year' },
  ];
  
  // Determine the current range type based on the date range
  const getCurrentRangeType = (): string => {
    const currentMonthRange = getCurrentMonthRange();
    const last30DaysRange = getLast30DaysRange();
    const last90DaysRange = getLast90DaysRange();
    const currentYearRange = getCurrentYearRange();
    
    if (dateRange.startDate === currentMonthRange.startDate && dateRange.endDate === currentMonthRange.endDate) {
      return 'current_month';
    }
    
    if (dateRange.startDate === last30DaysRange.startDate && dateRange.endDate === last30DaysRange.endDate) {
      return 'last_30_days';
    }
    
    if (dateRange.startDate === last90DaysRange.startDate && dateRange.endDate === last90DaysRange.endDate) {
      return 'last_90_days';
    }
    
    if (dateRange.startDate === currentYearRange.startDate && dateRange.endDate === currentYearRange.endDate) {
      return 'current_year';
    }
    
    // Check if it's a specific month
    for (const monthOption of monthOptions) {
      const monthRange = getMonthRange(monthOption.value);
      if (dateRange.startDate === monthRange.startDate && dateRange.endDate === monthRange.endDate) {
        return 'custom_month';
      }
    }
    
    // Check if it's a specific year
    for (const yearOption of yearOptions) {
      const yearRange = getYearRange(yearOption.value);
      if (dateRange.startDate === yearRange.startDate && dateRange.endDate === yearRange.endDate) {
        return 'custom_year';
      }
    }
    
    return 'custom_month';
  };
  
  const [rangeType, setRangeType] = React.useState(getCurrentRangeType());
  const [selectedMonth, setSelectedMonth] = React.useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = React.useState(getCurrentYear());
  
  const handleRangeTypeChange = (value: string) => {
    setRangeType(value);
    
    switch (value) {
      case 'current_month':
        onDateRangeChange(getCurrentMonthRange());
        break;
      case 'last_30_days':
        onDateRangeChange(getLast30DaysRange());
        break;
      case 'last_90_days':
        onDateRangeChange(getLast90DaysRange());
        break;
      case 'current_year':
        onDateRangeChange(getCurrentYearRange());
        break;
      case 'custom_month':
        onDateRangeChange(getMonthRange(selectedMonth));
        break;
      case 'custom_year':
        onDateRangeChange(getYearRange(selectedYear));
        break;
    }
  };
  
  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
    onDateRangeChange(getMonthRange(value));
  };
  
  const handleYearChange = (value: string) => {
    setSelectedYear(value);
    onDateRangeChange(getYearRange(value));
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="w-full sm:w-1/3">
        <Select
          options={predefinedRanges}
          value={rangeType}
          onChange={handleRangeTypeChange}
          label="Date Range"
        />
      </div>
      
      {rangeType === 'custom_month' && (
        <div className="w-full sm:w-1/3">
          <Select
            options={monthOptions}
            value={selectedMonth}
            onChange={handleMonthChange}
            label="Select Month"
          />
        </div>
      )}
      
      {rangeType === 'custom_year' && (
        <div className="w-full sm:w-1/3">
          <Select
            options={yearOptions}
            value={selectedYear}
            onChange={handleYearChange}
            label="Select Year"
          />
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector;