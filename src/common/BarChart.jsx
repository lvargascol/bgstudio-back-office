import React from 'react';
// import { Chart as ChartJS } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
export default function BarChart({ data, options }) {
  return <Bar data={data} options={options} />;
}
