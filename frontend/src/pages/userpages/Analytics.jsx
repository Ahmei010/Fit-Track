
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Analytics = () => {
  const [workouts, setWorkouts] = useState([]);
  const [nutrition, setNutrition] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get Workout Data
  const getWorkouts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/workout"
      );

      setWorkouts(res.data.workoutlists || []);
    } catch (error) {
      console.log("Workout Analytics Error:", error);
    }
  };

  // Get Nutrition Data
  const getNutrition = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/nutrition"
      );

      setNutrition(res.data.nutrition || []);
    } catch (error) {
      console.log("Nutrition Analytics Error:", error);
    }
  };

  // Load All Data
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        getWorkouts(),
        getNutrition(),
      ]);

      setLoading(false);
    };

    loadData();
  }, []);

  // =========================
  // WORKOUT ANALYTICS
  // =========================

  const totalWorkouts = workouts.length;

  const totalSets = workouts.reduce(
    (total, item) => total + Number(item.sets || 0),
    0
  );

  const totalReps = workouts.reduce(
    (total, item) => total + Number(item.reps || 0),
    0
  );

  const totalWeight = workouts.reduce(
    (total, item) =>
      total +
      Number(item.weight || 0) *
        Number(item.sets || 0) *
        Number(item.reps || 0),
    0
  );

  // Exercise History
  const exerciseHistory = workouts.map((item, index) => ({
    name: item.exerciseName,
    weight: Number(item.weight || 0),
    sets: Number(item.sets || 0),
    reps: Number(item.reps || 0),
    index: index + 1,
  }));

  // Workout Frequency
  const workoutFrequency = {};

  workouts.forEach((item) => {
    const date = item.createdAt
      ? new Date(item.createdAt).toLocaleDateString()
      : "Unknown";

    if (!workoutFrequency[date]) {
      workoutFrequency[date] = 0;
    }

    workoutFrequency[date]++;
  });

  const workoutFrequencyData = Object.keys(workoutFrequency).map(
    (date) => ({
      date,
      workouts: workoutFrequency[date],
    })
  );

  // =========================
  // NUTRITION ANALYTICS
  // =========================

  const totalCalories = nutrition.reduce(
    (total, item) =>
      total + Number(item.calories || 0),
    0
  );

  const totalProtein = nutrition.reduce(
    (total, item) =>
      total + Number(item.protein || 0),
    0
  );

  const totalCarbs = nutrition.reduce(
    (total, item) =>
      total + Number(item.carbs || 0),
    0
  );

  const totalFats = nutrition.reduce(
    (total, item) =>
      total + Number(item.fats || 0),
    0
  );

  // Daily Calories
  const dailyCalories = {};

  nutrition.forEach((item) => {
    const date = item.date || "Unknown";

    if (!dailyCalories[date]) {
      dailyCalories[date] = 0;
    }

    dailyCalories[date] += Number(item.calories || 0);
  });

  const dailyCaloriesData = Object.keys(dailyCalories)
    .sort()
    .map((date) => ({
      date,
      calories: dailyCalories[date],
    }));

  // Macronutrient Distribution
  const macroData = [
    {
      name: "Protein",
      value: totalProtein,
    },
    {
      name: "Carbs",
      value: totalCarbs,
    },
    {
      name: "Fats",
      value: totalFats,
    },
  ];

  if (loading) {
    return (
      <div className="analytics-loading">
        Loading Analytics...
      </div>
    );
  }

  return (
    <>
      <style>{`
        .analytics-page {
          min-height: calc(100vh - 80px);
          padding: 10px 0 40px;
          background: transparent;
          color: #ffffff;
        }

        .analytics-header {
          margin-bottom: 30px;
        }

        .analytics-header h1 {
          margin: 0;
          font-size: 30px;
          font-weight: 800;
          color: #ffffff;
        }

        .analytics-header p {
          margin: 7px 0 0;
          color: #9ca3af;
          font-size: 14px;
        }

        .analytics-section {
          margin-bottom: 35px;
        }

        .section-title {
          margin-bottom: 18px;
        }

        .section-title h2 {
          margin: 0;
          font-size: 22px;
          font-weight: 800;
          color: #ffffff;
        }

        .section-title p {
          margin: 5px 0 0;
          color: #9ca3af;
          font-size: 13px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-bottom: 20px;
        }

        .stat-card {
          background: #111116;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 22px;
          box-shadow: 0 5px 18px rgba(0, 0, 0, 0.2);
          transition: all 0.3s;
        }

        .stat-card:hover {
          border-color: rgba(255, 107, 0, 0.4);
        }

        .stat-card h3 {
          margin: 0 0 8px;
          color: #9ca3af;
          font-size: 13px;
          font-weight: 600;
        }

        .stat-card .stat-number {
          font-size: 28px;
          font-weight: 800;
          color: #ffffff;
        }

        .stat-card .stat-label {
          margin-top: 4px;
          color: #ff6b00;
          font-size: 12px;
          font-weight: 700;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .chart-card {
          background: #111116;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 22px;
          box-shadow: 0 5px 18px rgba(0, 0, 0, 0.2);
        }

        .chart-card.full {
          grid-column: 1 / -1;
        }

        .chart-header {
          margin-bottom: 20px;
        }

        .chart-header h3 {
          margin: 0;
          font-size: 17px;
          font-weight: 800;
          color: #ffffff;
        }

        .chart-header p {
          margin: 5px 0 0;
          font-size: 12px;
          color: #9ca3af;
        }

        .chart-container {
          width: 100%;
          height: 300px;
        }

        .empty-chart {
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          font-size: 14px;
          background: #16161f;
          border-radius: 12px;
        }

        .analytics-loading {
          min-height: calc(100vh - 80px);
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 18px;
          font-weight: 700;
          color: #ff6b00;
          background: transparent;
        }

        @media (max-width: 1000px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .charts-grid {
            grid-template-columns: 1fr;
          }

          .chart-card.full {
            grid-column: auto;
          }
        }

        @media (max-width: 600px) {
          .analytics-page {
            padding: 10px 5px 30px;
          }

          .analytics-header h1 {
            font-size: 25px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .stat-card .stat-number {
            font-size: 25px;
          }
        }
      `}</style>

      <div className="analytics-page">

        {/* HEADER */}
        <div className="analytics-header">
          <h1>Analytics</h1>
          <p>
            Track your workout progress and nutrition insights
          </p>
        </div>

        {/* ================= WORKOUT ANALYTICS ================= */}

        <div className="analytics-section">

          <div className="section-title">
            <h2>Workout Analytics</h2>
            <p>
              Monitor your workout performance and exercise history
            </p>
          </div>

          {/* Workout Stats */}

          <div className="stats-grid">

            <div className="stat-card">
              <h3>Total Workouts</h3>
              <div className="stat-number">
                {totalWorkouts}
              </div>
              <div className="stat-label">
                Workouts
              </div>
            </div>

            <div className="stat-card">
              <h3>Total Sets</h3>
              <div className="stat-number">
                {totalSets}
              </div>
              <div className="stat-label">
                Sets Completed
              </div>
            </div>

            <div className="stat-card">
              <h3>Total Reps</h3>
              <div className="stat-number">
                {totalReps}
              </div>
              <div className="stat-label">
                Repetitions
              </div>
            </div>

            <div className="stat-card">
              <h3>Total Lifted Weight</h3>
              <div className="stat-number">
                {totalWeight}
              </div>
              <div className="stat-label">
                Total Volume
              </div>
            </div>

          </div>

          <div className="charts-grid">

            {/* Workout Frequency */}

            <div className="chart-card">

              <div className="chart-header">
                <h3>Workout Frequency</h3>
                <p>
                  Number of workouts recorded by date
                </p>
              </div>

              {workoutFrequencyData.length > 0 ? (

                <div className="chart-container">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart
                      data={workoutFrequencyData}
                    >
                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis dataKey="date" />

                      <YAxis allowDecimals={false} />

                      <Tooltip />

                      <Legend />

                      <Bar
                        dataKey="workouts"
                        fill="#ff6b00"
                        name="Workouts"
                      />

                    </BarChart>
                  </ResponsiveContainer>

                </div>

              ) : (

                <div className="empty-chart">
                  No workout data available
                </div>

              )}

            </div>

            {/* Weight Progress */}

            <div className="chart-card">

              <div className="chart-header">
                <h3>Weight Progress</h3>
                <p>
                  Weight used for each exercise
                </p>
              </div>

              {exerciseHistory.length > 0 ? (

                <div className="chart-container">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <LineChart
                      data={exerciseHistory}
                    >
                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis
                        dataKey="name"
                        angle={-20}
                        textAnchor="end"
                        height={70}
                      />

                      <YAxis />

                      <Tooltip />

                      <Legend />

                      <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="#ff6b00"
                        strokeWidth={3}
                        name="Weight"
                      />

                    </LineChart>
                  </ResponsiveContainer>

                </div>

              ) : (

                <div className="empty-chart">
                  No workout data available
                </div>

              )}

            </div>

            {/* Exercise History */}

            <div className="chart-card full">

              <div className="chart-header">
                <h3>Exercise History</h3>
                <p>
                  Sets and repetitions performed for each exercise
                </p>
              </div>

              {exerciseHistory.length > 0 ? (

                <div className="chart-container">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart
                      data={exerciseHistory}
                    >
                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis
                        dataKey="name"
                        angle={-20}
                        textAnchor="end"
                        height={70}
                      />

                      <YAxis />

                      <Tooltip />

                      <Legend />

                      <Bar
                        dataKey="sets"
                        fill="#111"
                        name="Sets"
                      />

                      <Bar
                        dataKey="reps"
                        fill="#ff6b00"
                        name="Reps"
                      />

                    </BarChart>
                  </ResponsiveContainer>

                </div>

              ) : (

                <div className="empty-chart">
                  No exercise history available
                </div>

              )}

            </div>

          </div>

        </div>

        {/* ================= NUTRITION ANALYTICS ================= */}

        <div className="analytics-section">

          <div className="section-title">
            <h2>Nutrition Analytics</h2>
            <p>
              Understand your calorie and macronutrient consumption
            </p>
          </div>

          {/* Nutrition Stats */}

          <div className="stats-grid">

            <div className="stat-card">
              <h3>Total Calories</h3>
              <div className="stat-number">
                {totalCalories}
              </div>
              <div className="stat-label">
                kcal
              </div>
            </div>

            <div className="stat-card">
              <h3>Total Protein</h3>
              <div className="stat-number">
                {totalProtein}g
              </div>
              <div className="stat-label">
                Protein
              </div>
            </div>

            <div className="stat-card">
              <h3>Total Carbs</h3>
              <div className="stat-number">
                {totalCarbs}g
              </div>
              <div className="stat-label">
                Carbohydrates
              </div>
            </div>

            <div className="stat-card">
              <h3>Total Fats</h3>
              <div className="stat-number">
                {totalFats}g
              </div>
              <div className="stat-label">
                Fats
              </div>
            </div>

          </div>

          <div className="charts-grid">

            {/* Daily Calories */}

            <div className="chart-card">

              <div className="chart-header">
                <h3>Daily Calorie Intake</h3>
                <p>
                  Daily calorie consumption trend
                </p>
              </div>

              {dailyCaloriesData.length > 0 ? (

                <div className="chart-container">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <LineChart
                      data={dailyCaloriesData}
                    >
                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis dataKey="date" />

                      <YAxis />

                      <Tooltip />

                      <Legend />

                      <Line
                        type="monotone"
                        dataKey="calories"
                        stroke="#ff6b00"
                        strokeWidth={3}
                        name="Calories"
                      />

                    </LineChart>
                  </ResponsiveContainer>

                </div>

              ) : (

                <div className="empty-chart">
                  No nutrition data available
                </div>

              )}

            </div>

            {/* Macronutrients */}

            <div className="chart-card">

              <div className="chart-header">
                <h3>Macronutrient Distribution</h3>
                <p>
                  Protein, carbohydrates and fats
                </p>
              </div>

              {nutrition.length > 0 ? (

                <div className="chart-container">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>

                      <Pie
                        data={macroData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {macroData.map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                index === 0
                                  ? "#ff6b00"
                                  : index === 1
                                  ? "#111"
                                  : "#888"
                              }
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip />

                      <Legend />

                    </PieChart>

                  </ResponsiveContainer>

                </div>

              ) : (

                <div className="empty-chart">
                  No nutrition data available
                </div>

              )}

            </div>

          </div>

        </div>

      </div>
    </>
  );
};

export default Analytics;
