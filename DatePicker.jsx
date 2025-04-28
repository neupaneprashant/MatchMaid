import React from 'react';

import ReactDatePicker from "react-datepicker"; 
import "./datepicker.css";
function MaidDatePicker(){
    const[selectedDate, setSelectedDate] = React.useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    return(
        <div className="datepicker-container">
            <ReactDatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="MMMM d, yyyy"
                placeholderText="Select a date"
                className="datepicker-input"
            />
            {selectedDate && (
                <div className="selected-date">
                    Selected Date: {selectedDate.toLocaleDateString()}
                </div>
            )}
        </div>
    )
}
export default MaidDatePicker;