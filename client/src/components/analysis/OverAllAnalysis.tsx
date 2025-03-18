import { useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector,
} from "recharts";
import { UserTypes } from "../../pages/analysis/Analysis";

//  colors for index-0 Attempted & index-1 Not Attempted
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
  // console.log(payload)

  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={-5}
        textAnchor="middle"
        fontSize={28}
        fontWeight="bold"
      >
        {payload.value}
        <tspan fontSize={20} fontWeight="lighter" >/100</tspan>
      </text>
      <text
        x={cx}
        y={cy}
        dy={25}
        textAnchor="middle"
        fill={fill}
        fontSize={20}
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
      >{`${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const OverAllAnalysis = ({ user }: { user: UserTypes }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const data = [
    { name: "Attempted", value: user.attempted },
    { name: "Not Attempted", value: user.totalQuestions - user.attempted },
  ];

  return (
    <Paper
      sx={{
        width: 800,
        mx: "auto",
        p: 3,
        mt: 3,
      }}
    >
      <Typography variant="h6" align="center" fontWeight="bold">
        Overall Analysis
      </Typography>
      <Box display="flex" justifyContent="center" my={2}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={90}
              outerRadius={110}
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
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography fontWeight="bold">Total Questions:</Typography>
          <Typography>{user.totalQuestions} questions</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography fontWeight="bold">Attempted:</Typography>
          <Typography>{user.attempted} questions</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography fontWeight="bold">Correct:</Typography>
          <Typography>{user.correct} questions</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography fontWeight="bold">Correct Answers Score:</Typography>
          <Typography>{user.correctScore}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography fontWeight="bold">Incorrect:</Typography>
          <Typography>{user.incorrect} questions</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography fontWeight="bold">Negative Marks:</Typography>
          <Typography>{user.negativeMarks}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography fontWeight="bold">Time Taken:</Typography>
          <Typography>{user.timeTaken} minutes</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default OverAllAnalysis;
