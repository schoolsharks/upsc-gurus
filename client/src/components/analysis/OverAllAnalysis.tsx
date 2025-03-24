import { useState } from "react";
import { Box, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector,
} from "recharts";
import { UserTypes } from "../../pages/analysis/Analysis";

// Colors for index-0 Attempted & index-1 Not Attempted
const COLORS = ["#029105", "#111111"];

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;

  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  // Adjust font sizes based on screen size
  const isMobile = window.innerWidth < 600;
  const centerFontSize = isMobile ? 22 : 28;
  const subFontSize = isMobile ? 16 : 20;

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={-5}
        textAnchor="middle"
        fontSize={centerFontSize}
        fontWeight="bold"
      >
        {payload.value}
        <tspan fontSize={subFontSize} fontWeight="lighter">/100</tspan>
      </text>
      <text
        x={cx}
        y={cy}
        dy={20}
        textAnchor="middle"
        fill={fill}
        fontSize={subFontSize}
        fontWeight="bold"
      >
        {payload.name}
      </text>

      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
        fontSize={isMobile ? 12 : 14}
      >{`${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
        fontSize={isMobile ? 12 : 14}
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const OverAllAnalysis = ({ user }: { user: UserTypes }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const data = [
    { name: "Attempted", value: user.attempted },
    { name: "Not Attempted", value: user.totalQuestions - user.attempted },
  ];

  // Adjust chart dimensions based on screen size
  const chartHeight = isMobile ? 250 : 300;
  const innerRadius = isMobile ? 70 : 90;
  const outerRadius = isMobile ? 85 : 110;

  return (
    <Paper
      sx={{
        width: "100%",
        maxWidth: 800,
        mx: "auto",
        p: isMobile ? 2 : 3,
        mt: 3,
      }}
      elevation={2}
    >
      <Typography 
        variant={isMobile ? "subtitle1" : "h6"} 
        align="center" 
        fontWeight="bold"
      >
        Overall Analysis
      </Typography>
      <Box display="flex" justifyContent="center" my={isMobile ? 1 : 2}>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Box>
      <Box sx={{ mt: 2, px: isMobile ? 1 : 2 }}>
        {/* Stats section with responsive layout */}
        <Box 
          sx={{ 
            display: "grid", 
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
            gap: isMobile ? 1 : 2
          }}
        >
          <StatItem 
            label="Total Questions:" 
            value={`${user.totalQuestions} questions`}
            isMobile={isMobile} 
          />
          <StatItem 
            label="Attempted:" 
            value={`${user.attempted} questions`}
            isMobile={isMobile} 
          />
          <StatItem 
            label="Correct:" 
            value={`${user.correct} questions`}
            isMobile={isMobile} 
          />
          <StatItem 
            label="Correct Answers Score:" 
            value={user.correctScore}
            isMobile={isMobile} 
          />
          <StatItem 
            label="Incorrect:" 
            value={`${user.incorrect} questions`}
            isMobile={isMobile} 
          />
          <StatItem 
            label="Negative Marks:" 
            value={user.negativeMarks}
            isMobile={isMobile} 
          />
          <StatItem 
            label="Time Taken:" 
            value={`${user.timeTaken} hrs`}
            isMobile={isMobile} 
          />
        </Box>
      </Box>
    </Paper>
  );
};

// Helper component for stat items
const StatItem = ({ 
  label, 
  value, 
  isMobile 
}: { 
  label: string; 
  value: string | number; 
  isMobile: boolean;
}) => (
  <Box 
    sx={{ 
      display: "flex", 
      justifyContent: "space-between",
      borderBottom: "1px solid #eee",
      py: 1,
      flexDirection: isMobile ? "column" : "row"
    }}
  >
    <Typography 
      fontWeight="bold" 
      variant={isMobile ? "body2" : "body1"}
    >
      {label}
    </Typography>
    <Typography variant={isMobile ? "body2" : "body1"}>
      {value}
    </Typography>
  </Box>
);

export default OverAllAnalysis;