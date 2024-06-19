// Analytics.js
import React, { useEffect, useState } from 'react';
import Header from './Header';
import '../index.css'; // Import the CSS file
import Highcharts from 'highcharts';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({ submitted: 0, pending: 0, solved: 0 });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch('http://localhost:3006/analytics');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAnalyticsData(data); // Update the state with the fetched data
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    fetchProblems();
  }, []);

  useEffect(() => {
    // Ensure the chart is rendered after the state is updated with fetched data
    renderProblemStatisticsChart(analyticsData);
  }, [analyticsData]); // This useEffect depends on analyticsData

  async function renderProblemStatisticsChart(data) {
    Highcharts.chart('plot', {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Problem Status Statistics'
      },
      xAxis: {
        categories: ['Submitted', 'Pending', 'Solved']
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Number of Problems'
        },
        allowDecimals: false,
        tickInterval: 1
      },
      plotOptions: {
        series: {
          stacking: 'normal'
        }
      },
      series: [{
        name: 'Problems',
        data: [data.submitted, data.pending, data.solved]
      }]
    });
  }

  return (
    <div>
      <Header />
      <h1 className="left-to-right-slow center-screen">Analytics</h1>
      <div id="plot" style={{width: '80%', height: '400px', margin: '0 auto'}}></div>
    </div>
  );
}

export default Analytics;