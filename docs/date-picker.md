# 📅 MaidDatePicker.jsx — Maid Schedule Date Picker

## 📌 Purpose
MaidDatePicker is a lightweight date selection component for maids to choose availability dates or service scheduling within the MatchMaid app.

## ✨ Features

| Feature             | Description                                       |
|---------------------|---------------------------------------------------|
| 📆 Date Selection   | Selects date from a calendar picker               |
| 🎯 Live Feedback    | Displays selected date immediately                |
| 🎨 Styled UI        | Uses custom styles via `datepicker.css`           |
| 🧱 Format           | Dates formatted as Month Day, Year                |

## 🧩 Component Structure

### 📥 State
```js
const [selectedDate, setSelectedDate] = React.useState(null);
```

### 🔄 Event Handler
```js
const handleDateChange = (date) => {
    setSelectedDate(date);
};
```

## 📦 Dependencies

| Package           | Purpose                               |
|-------------------|----------------------------------------|
| `react-datepicker`| Calendar UI and logic                  |
| `date-fns`        | Peer dependency used internally        |

```bash
npm install react-datepicker
```

## 📌 Notes
- Supports only single date selection for now.
- Can be extended to include time, range, or disabled dates.