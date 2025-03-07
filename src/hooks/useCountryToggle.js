import { useState } from "react";

const useCountryToggle = () => {
  const [expandedCountries, setExpandedCountries] = useState(new Set());

  const toggleCountry = (country) => {
    setExpandedCountries((prevExpanded) => {
      const newExpanded = new Set(prevExpanded);
      if (newExpanded.has(country)) {
        newExpanded.delete(country);
      } else {
        newExpanded.add(country);
      }
      return newExpanded;
    });
  };

  return { expandedCountries, toggleCountry };
};

export default useCountryToggle;
