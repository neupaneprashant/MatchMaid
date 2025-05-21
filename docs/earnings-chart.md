# 📈 EarningsChart

## 📌 Purpose
EarningsChart displays a line chart visualizing a maid's monthly earnings.

## 📊 Features

| Feature               | Description                                       |
|------------------------|---------------------------------------------------|
| 📅 Monthly Labels      | X-axis shows months (e.g., Jan, Feb)              |
| 💰 Earnings Line       | Y-axis plots total earnings                       |
| 🧭 Tooltips            | Shows earnings per month on hover                 |
| 📱 Responsive Layout   | Adapts to container size                          |

## 🧩 Props

| Prop           | Type   | Required | Description                          |
|----------------|--------|----------|--------------------------------------|
| `earningsData` | Array  | ✅        | Array of `{ month, amount }` objects |

## 📦 Dependencies

Install with:
```bash
npm install recharts
```

| Component            | Purpose                        |
|----------------------|--------------------------------|
| LineChart            | Chart container                |
| Line                 | Earnings line                  |
| XAxis / YAxis        | Labels and axis scaling        |
| CartesianGrid        | Grid lines                     |
| Tooltip              | Hover display of data          |
| ResponsiveContainer  | Auto scales chart dimensions   |

## 🖼️ Output
Green line chart plotting earnings trends over months.