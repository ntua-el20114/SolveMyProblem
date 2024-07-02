// Analytics.js
import React, { useEffect, useState } from 'react';
import Header from './Header';
import '../index.css'; // Import the CSS file
import Highcharts from 'highcharts';
import path from 'path';
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({ submitted: 0, pending: 0, solved: 0 });

  const fetchProblems = async () => {
    try {
      const response = await fetch(`http://${process.env.ANALYTICS}:3006/analytics`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAnalyticsData(data); // Update the state with the fetched data
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  };

  useEffect(() => {
    fetchProblems();
  },[]);

  useEffect(() => {
    // Ensure the chart is rendered after the state is updated with fetched data
    renderProblemStatisticsChart(analyticsData);
  }, [analyticsData]); // This useEffect depends on analyticsData

  async function renderProblemStatisticsChart(data) {
      Highcharts.chart('plot', {
      accessibility: {
        enabled: false
      },
      chart: {
        type: 'bar',
        backgroundColor: '#2c2c2c',
      },
      title: {
        text: 'Problem Status',
        style: {
          color: '#b4b4b4' // Make title text color white
        }
      },
      xAxis: {
        categories: ['Submitted', 'Pending', 'Solved'],
        lineColor: '#b4b4b4', // Set the color of the axis line to black
      tickColor: '#2c2c2c', // Set the color of the axis ticks to black
      gridLineColor: '#2c2c2c', // Set the color of the grid lines to black
      labels: {
        style: {
          color: '#b4b4b4' // Make xAxis labels text color white
        }
      }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Number of Problems',
          style: {
            color: '#b4b4b4' // Make yAxis title text color white
          }
        },
        labels: {
          style: {
            color: '#b4b4b4' // Make yAxis labels text color white
          }
        },
        allowDecimals: false,
        tickInterval: 1,
        lineColor: '#b4b4b4', // color of the axis line
        tickColor: '#2c2c2c', // Set the color of the axis ticks to black
        tickWidth:0,
        //gridLineColor: '#b4b4b4',
        gridLineWidth: 0,
      }, 
      plotOptions: {
        series: {
          borderRadius: 10, // Rounded corners
          dataLabels: {
            enabled: true,
            style: {
              color: '#b4b4b4' // Make yAxis title text color white
            }
          },
          borderColor: '#2c2c2c',
          borderWidth: 0
        },
          stacking: 'normal'
        },
      series: [{
        name: 'Problems',
        data: [data.submitted, data.pending, data.solved],
        color: '#ff66ce'
      }],
      legend: {
        itemStyle: {
          color: '#b4b4b4' 
        }
      }
    });
  }

  return (
    <div>
      <Header />
      <h1 className="left-to-right-slow center-screen">Analytics</h1>
      <div id="plot" style={{width: '80%', height: '400px', margin: '0 auto', borderRadius: '20px', overflow: 'hidden',  animation: 'fadeIn 2s ease-in-out forwards'
}}></div>
    </div>
  );
}

export default Analytics;