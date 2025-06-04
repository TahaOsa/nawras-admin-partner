// Time pattern heatmap chart component

import React from 'react';
import { BaseChart } from './BaseChart';
import { formatCurrency } from '../../lib/chartUtils';
import { chartTheme } from '../../lib/chartTheme';
import type { TimePatternData } from '../../types/analytics';

interface TimePatternChartProps {
  data: TimePatternData[];
  height?: number;
  onCellClick?: (data: TimePatternData) => void;
}

export function TimePatternChart({
  data,
  height = 400,
  onCellClick,
}: TimePatternChartProps) {
  // Days of the week
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Hours of the day (simplified to 4-hour blocks)
  const timeBlocks = [
    { start: 0, end: 5, label: 'Night\n(12-6 AM)' },
    { start: 6, end: 11, label: 'Morning\n(6-12 PM)' },
    { start: 12, end: 17, label: 'Afternoon\n(12-6 PM)' },
    { start: 18, end: 23, label: 'Evening\n(6-12 AM)' },
  ];

  // Create a matrix for the heatmap
  const createHeatmapData = () => {
    const matrix: { [key: string]: TimePatternData } = {};

    // Initialize matrix
    daysOfWeek.forEach((_, dayIndex) => {
      timeBlocks.forEach((_, blockIndex) => {
        matrix[`${dayIndex}-${blockIndex}`] = {
          dayOfWeek: dayIndex,
          hour: blockIndex,
          amount: 0,
          count: 0,
          dayName: daysOfWeek[dayIndex],
          timeSlot: timeBlocks[blockIndex].label.split('\n')[0],
        };
      });
    });

    // Populate with actual data
    data.forEach(item => {
      const blockIndex = timeBlocks.findIndex(block =>
        item.hour >= block.start && item.hour <= block.end
      );

      if (blockIndex !== -1) {
        const key = `${item.dayOfWeek}-${blockIndex}`;
        if (matrix[key]) {
          matrix[key].amount += item.amount;
          matrix[key].count += item.count;
        }
      }
    });

    return matrix;
  };

  const heatmapData = createHeatmapData();

  // Find max amount for color scaling
  const maxAmount = Math.max(...Object.values(heatmapData).map(d => d.amount));

  // Get color intensity based on amount
  const getColorIntensity = (amount: number) => {
    if (maxAmount === 0) return 0;
    return amount / maxAmount;
  };

  // Get background color based on intensity
  const getBackgroundColor = (intensity: number) => {
    if (intensity === 0) return chartTheme.colors.neutral[1];

    const opacity = Math.max(0.1, intensity);
    return `rgba(59, 130, 246, ${opacity})`; // Blue with varying opacity
  };

  // Handle cell clicks
  const handleCellClick = (data: TimePatternData) => {
    if (onCellClick) {
      onCellClick(data);
    }
  };

  return (
    <BaseChart
      title="Spending Time Patterns"
      subtitle="When do you spend the most?"
      height={height}
      exportable={true}
    >
      <div className="p-4">
        {/* Heatmap Grid */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {/* Header row */}
          <div className="text-xs font-medium text-gray-500 text-center"></div>
          {timeBlocks.map((block, index) => (
            <div key={index} className="text-xs font-medium text-gray-500 text-center">
              {block.label.split('\n')[0]}
              <br />
              <span className="text-gray-400">{block.label.split('\n')[1]}</span>
            </div>
          ))}

          {/* Data rows */}
          {daysOfWeek.map((day, dayIndex) => (
            <React.Fragment key={dayIndex}>
              {/* Day label */}
              <div className="text-xs font-medium text-gray-500 flex items-center">
                {day}
              </div>

              {/* Time block cells */}
              {timeBlocks.map((_, blockIndex) => {
                const cellData = heatmapData[`${dayIndex}-${blockIndex}`];
                const intensity = getColorIntensity(cellData.amount);

                return (
                  <div
                    key={`${dayIndex}-${blockIndex}`}
                    className="aspect-square rounded-lg border border-gray-200 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors group relative"
                    style={{ backgroundColor: getBackgroundColor(intensity) }}
                    onClick={() => handleCellClick(cellData)}
                  >
                    <div className="text-center">
                      <div className="text-xs font-medium text-gray-900">
                        {cellData.count > 0 ? cellData.count : ''}
                      </div>
                      {cellData.amount > 0 && (
                        <div className="text-xs text-gray-600">
                          {formatCurrency(cellData.amount)}
                        </div>
                      )}
                    </div>

                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      {cellData.dayName} {cellData.timeSlot}
                      <br />
                      {cellData.count} expense{cellData.count !== 1 ? 's' : ''}: {formatCurrency(cellData.amount)}
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>Less</span>
          <div className="flex items-center gap-1">
            {[0, 0.2, 0.4, 0.6, 0.8, 1].map((intensity, index) => (
              <div
                key={index}
                className="w-3 h-3 rounded border border-gray-200"
                style={{ backgroundColor: getBackgroundColor(intensity) }}
              />
            ))}
          </div>
          <span>More</span>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-sm text-blue-600">Peak Day</div>
            <div className="text-lg font-semibold text-blue-900">
              {Object.values(heatmapData)
                .reduce((max, curr) => curr.amount > max.amount ? curr : max, { amount: 0, dayName: 'None' })
                .dayName}
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-sm text-green-600">Peak Time</div>
            <div className="text-lg font-semibold text-green-900">
              {Object.values(heatmapData)
                .reduce((max, curr) => curr.amount > max.amount ? curr : max, { amount: 0, timeSlot: 'None' })
                .timeSlot}
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-sm text-purple-600">Total Expenses</div>
            <div className="text-lg font-semibold text-purple-900">
              {Object.values(heatmapData).reduce((sum, curr) => sum + curr.count, 0)}
            </div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="text-sm text-orange-600">Total Amount</div>
            <div className="text-lg font-semibold text-orange-900">
              {formatCurrency(Object.values(heatmapData).reduce((sum, curr) => sum + curr.amount, 0))}
            </div>
          </div>
        </div>
      </div>
    </BaseChart>
  );
}

export default TimePatternChart;
