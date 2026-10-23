
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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
import {
  Dumbbell,
  Apple,
  TrendingUp,
  Weight,
  Timer,
  Activity,
  ArrowRight,
  Beef,
  Wheat,
  Droplets,
  Target,
} from "lucide-react";

const COLORS = ["#ff6b00", "#fbbf24", "#fb923c"];

const Dashboard = () => {
  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    user = {};
  }

  const token = localStorage.getItem("token");

  const [workouts, setWorkouts] = useState([]);
  const [nutrition, setNutrition] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      try {
        const results = await Promise.allSettled([
          axios.get("http://localhost:5000/workout", { headers }),
          axios.get("http://localhost:5000/nutrition", { headers }),
          axios.get("http://localhost:5000/progress", { headers }),
        ]);

        const [workoutRes, nutritionRes, progressRes] = results;

        if (workoutRes.status === "fulfilled") {
          const data = workoutRes.value.data;

          setWorkouts(
            data.workoutlists ||
              data.workouts ||
              data.workout ||
              (Array.isArray(data) ? data : [])
          );
        }

        if (nutritionRes.status === "fulfilled") {
          const data = nutritionRes.value.data;

          setNutrition(
            data.nutrition ||
              (Array.isArray(data) ? data : [])
          );
        }

        if (progressRes.status === "fulfilled") {
          const data = progressRes.value.data;

          setProgress(
            data.progress ||
              (Array.isArray(data) ? data : [])
          );
        }

        if (results.every((result) => result.status === "rejected")) {
          setError("Dashboard data load nahi ho saka. Backend check karein.");
        }
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Dashboard data load nahi ho saka.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  // Latest progress record
  const latestProgress =
    [...progress].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )[0] || null;

  // Dashboard statistics
  const totalCalories = nutrition.reduce(
    (sum, item) => sum + Number(item.calories || 0),
    0
  );

  const totalProtein = nutrition.reduce(
    (sum, item) => sum + Number(item.protein || 0),
    0
  );

  const totalCarbs = nutrition.reduce(
    (sum, item) => sum + Number(item.carbs || 0),
    0
  );

  const totalFats = nutrition.reduce(
    (sum, item) => sum + Number(item.fats || 0),
    0
  );

  const totalSets = workouts.reduce(
    (sum, item) => sum + Number(item.sets || 0),
    0
  );

  const totalReps = workouts.reduce(
    (sum, item) => sum + Number(item.reps || 0),
    0
  );

  const totalLiftedWeight = workouts.reduce(
    (sum, item) =>
      sum +
      Number(item.weight || 0) *
        Number(item.sets || 0) *
        Number(item.reps || 0),
    0
  );

  // Workout frequency by date
  const frequencyMap = {};

  workouts.forEach((item) => {
    const rawDate = item.createdAt || item.date;

    if (!rawDate) return;

    const date = new Date(rawDate).toLocaleDateString();

    frequencyMap[date] = (frequencyMap[date] || 0) + 1;
  });

  const workoutFrequencyData = Object.entries(frequencyMap)
    .map(([date, count]) => ({
      date,
      workouts: count,
      sortDate: new Date(date).getTime(),
    }))
    .sort((a, b) => a.sortDate - b.sortDate)
    .slice(-10);

  // Exercise history
  const exerciseHistory = [...workouts]
    .slice(-10)
    .reverse()
    .map((item, index) => ({
      name: item.exerciseName || item.workoutName || `Exercise ${index + 1}`,
      weight: Number(item.weight || 0),
      sets: Number(item.sets || 0),
      reps: Number(item.reps || 0),
    }));

  // Lifting progress from progress records
  const liftingProgressData = [...progress]
    .filter(
      (item) =>
        item.liftingWeight !== undefined &&
        item.liftingWeight !== null &&
        item.liftingWeight !== ""
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((item) => ({
      date: new Date(item.date).toLocaleDateString(),
      weight: Number(item.liftingWeight || 0),
    }));

  // Calories grouped by day
  const caloriesMap = {};

  nutrition.forEach((item) => {
    const date = item.date
      ? String(item.date).slice(0, 10)
      : item.createdAt
        ? new Date(item.createdAt).toISOString().slice(0, 10)
        : "Unknown";

    caloriesMap[date] =
      (caloriesMap[date] || 0) + Number(item.calories || 0);
  });

  const dailyCaloriesData = Object.entries(caloriesMap)
    .filter(([date]) => date !== "Unknown")
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .slice(-10)
    .map(([date, calories]) => ({
      date,
      calories,
    }));

  const macroData = [
    { name: "Protein", value: totalProtein },
    { name: "Carbs", value: totalCarbs },
    { name: "Fats", value: totalFats },
  ].filter((item) => item.value > 0);

  const stats = [
    {
      title: "Total Workouts",
      value: workouts.length,
      icon: <Dumbbell size={23} />,
      link: "/add-workout",
    },
    {
      title: "Nutrition Entries",
      value: nutrition.length,
      icon: <Apple size={23} />,
      link: "/nutrition",
    },
    {
      title: "Progress Records",
      value: progress.length,
      icon: <TrendingUp size={23} />,
      link: "/progress",
    },
    {
      title: "Latest Weight",
      value:
        latestProgress?.weight !== undefined &&
        latestProgress?.weight !== null
          ? `${latestProgress.weight} kg`
          : "N/A",
      icon: <Weight size={23} />,
      link: "/progress",
    },
  ];

  const ChartCard = ({ title, description, children, full = false }) => (
    <div
      className={`min-w-0 rounded-2xl border border-white/10 bg-[#111116] p-4 sm:p-6 ${
        full ? "md:col-span-2" : ""
      }`}
    >
      <h3 className="font-bold text-white">{title}</h3>
      <p className="mt-1 mb-5 text-xs text-gray-400">{description}</p>
      {children}
    </div>
  );

  const EmptyChart = () => (
    <div className="flex h-[260px] items-center justify-center rounded-xl bg-[#16161f] text-sm text-gray-500">
      No data available yet
    </div>
  );

  const Measurement = ({ title, value }) => (
    <div className="rounded-xl border border-white/5 bg-[#16161f] p-3">
      <p className="text-xs text-gray-400">{title}</p>
      <p className="mt-2 text-lg font-bold text-white">
        {value !== undefined && value !== null && value !== ""
          ? `${value} cm`
          : "—"}
      </p>
    </div>
  );

  const QuickAction = ({ to, icon, title, description }) => (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#16161f] p-4 transition hover:border-orange-500/50"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-1 text-xs text-gray-400">{description}</p>
      </div>
      <ArrowRight size={17} className="text-orange-500" />
    </Link>
  );

  return (
    <div className="w-full min-w-0 text-white">
      <div className="mx-auto w-full max-w-[1450px]">
        {/* Dashboard heading */}
        <div className="mb-7">
          <p className="mb-2 text-xs font-bold tracking-widest text-orange-500">
            FITTRACK DASHBOARD
          </p>

          <h1 className="break-words text-2xl font-extrabold sm:text-3xl lg:text-4xl">
            Welcome, <span className="text-orange-500">{user.name || user.username || "User"}</span> 👋
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Your fitness overview and analytics.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Main statistic cards */}
        <div className="mb-7 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <Link
              to={stat.link}
              key={stat.title}
              className="group rounded-2xl border border-white/10 bg-[#111116] p-5 transition hover:border-orange-500/50"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-400">{stat.title}</p>
                  <h2 className="mt-3 text-2xl font-extrabold">
                    {loading ? "..." : stat.value}
                  </h2>
                </div>

                <div className="rounded-xl bg-orange-500/10 p-3 text-orange-500 transition group-hover:bg-orange-500 group-hover:text-black">
                  {stat.icon}
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-orange-500">
                View Details <ArrowRight size={15} />
              </div>
            </Link>
          ))}
        </div>

        {/* Fitness overview and quick actions */}
        <div className="mb-7 grid grid-cols-1 gap-5 xl:grid-cols-3">
          <section className="min-w-0 rounded-2xl border border-white/10 bg-[#111116] p-5 sm:p-6 xl:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Fitness Overview</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Your latest fitness statistics
                </p>
              </div>
              <Activity className="text-orange-500" size={25} />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-white/5 bg-[#16161f] p-4">
                <Timer className="mb-3 text-orange-500" size={22} />
                <p className="text-sm text-gray-400">Run Time</p>
                <h3 className="mt-2 text-2xl font-bold">
                  {latestProgress?.runTime ?? 0} min
                </h3>
              </div>

              <div className="rounded-xl border border-white/5 bg-[#16161f] p-4">
                <Dumbbell className="mb-3 text-orange-500" size={22} />
                <p className="text-sm text-gray-400">Lifting Weight</p>
                <h3 className="mt-2 text-2xl font-bold">
                  {latestProgress?.liftingWeight ?? 0} kg
                </h3>
              </div>

              <div className="rounded-xl border border-white/5 bg-[#16161f] p-4 sm:col-span-2 lg:col-span-1">
                <Apple className="mb-3 text-orange-500" size={22} />
                <p className="text-sm text-gray-400">Recorded Calories</p>
                <h3 className="mt-2 text-2xl font-bold">
                  {totalCalories.toLocaleString()}
                </h3>
              </div>
            </div>

            <div className="mt-7">
              <h3 className="mb-4 font-bold">Latest Body Measurements</h3>

              {latestProgress ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  <Measurement title="Chest" value={latestProgress.chest} />
                  <Measurement title="Waist" value={latestProgress.waist} />
                  <Measurement title="Hips" value={latestProgress.hips} />
                  <Measurement title="Arms" value={latestProgress.arms} />
                  <Measurement title="Thighs" value={latestProgress.thighs} />
                </div>
              ) : (
                <div className="rounded-xl bg-[#16161f] p-5 text-center text-sm text-gray-400">
                  No progress data available yet.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#111116] p-5 sm:p-6">
            <h2 className="text-xl font-bold">Quick Actions</h2>
            <p className="mb-5 mt-1 text-sm text-gray-400">
              Add or review your fitness data
            </p>

            <div className="space-y-3">
              <QuickAction
                to="/add-workout"
                icon={<Dumbbell size={20} />}
                title="Add Workout"
                description="Record a workout"
              />
              <QuickAction
                to="/add-nutrition"
                icon={<Apple size={20} />}
                title="Add Nutrition"
                description="Record a meal"
              />
              <QuickAction
                to="/progress/add"
                icon={<TrendingUp size={20} />}
                title="Add Progress"
                description="Update measurements"
              />
              <QuickAction
                to="/progress/charts"
                icon={<Activity size={20} />}
                title="View Progress"
                description="Review progress charts"
              />
            </div>
          </section>
        </div>

        {/* Analytics heading */}
        <div className="mb-5 mt-10">
          <p className="text-xs font-bold tracking-widest text-orange-500">
            FITNESS INSIGHTS
          </p>
          <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
            Workout & Nutrition Analytics
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Your exercise history, training volume, calories and macros.
          </p>
        </div>

        {/* Analytics statistics */}
        <div className="mb-7 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-4">
          {[
            { title: "Total Sets", value: totalSets, icon: <Dumbbell size={21} /> },
            { title: "Total Reps", value: totalReps, icon: <Activity size={21} /> },
            { title: "Lifted Volume", value: totalLiftedWeight.toLocaleString(), icon: <Weight size={21} /> },
            { title: "Total Protein", value: `${totalProtein} g`, icon: <Beef size={21} /> },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-[#111116] p-5"
            >
              <div className="mb-4 inline-flex rounded-xl bg-orange-500/10 p-3 text-orange-500">
                {item.icon}
              </div>
              <p className="text-sm text-gray-400">{item.title}</p>
              <h3 className="mt-2 break-words text-2xl font-extrabold">
                {loading ? "..." : item.value}
              </h3>
            </div>
          ))}
        </div>

        {/* Workout analytics charts */}
        <div className="mb-7 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <ChartCard
            title="Workout Frequency"
            description="Number of workouts recorded by date"
          >
            {workoutFrequencyData.length ? (
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={workoutFrequencyData}>
                    <CartesianGrid stroke="#333333" strokeDasharray="3 3" />
                    <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#9ca3af" allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        background: "#171717",
                        border: "1px solid #444",
                        borderRadius: 8,
                        color: "#fff",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="workouts" name="Workouts" fill="#ff6b00" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : <EmptyChart />}
          </ChartCard>

          <ChartCard
            title="Lifting Progress"
            description="Lifting weight recorded in progress entries"
          >
            {liftingProgressData.length ? (
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={liftingProgressData}>
                    <CartesianGrid stroke="#333333" strokeDasharray="3 3" />
                    <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        background: "#171717",
                        border: "1px solid #444",
                        borderRadius: 8,
                        color: "#fff",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      name="Lifting Weight (kg)"
                      stroke="#ff6b00"
                      strokeWidth={3}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : <EmptyChart />}
          </ChartCard>

          <ChartCard
            title="Exercise History"
            description="Weight used for your latest recorded exercises"
            full
          >
            {exerciseHistory.length ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={exerciseHistory}>
                    <CartesianGrid stroke="#333333" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      stroke="#9ca3af"
                      tick={{ fontSize: 11 }}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                      height={65}
                    />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        background: "#171717",
                        border: "1px solid #444",
                        borderRadius: 8,
                        color: "#fff",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="weight" name="Weight (kg)" fill="#ff6b00" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : <EmptyChart />}
          </ChartCard>
        </div>

        {/* Nutrition analytics charts */}
        <div className="mb-7 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <ChartCard
            title="Daily Calorie Intake"
            description="Recorded calories grouped by date"
          >
            {dailyCaloriesData.length ? (
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyCaloriesData}>
                    <CartesianGrid stroke="#333333" strokeDasharray="3 3" />
                    <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        background: "#171717",
                        border: "1px solid #444",
                        borderRadius: 8,
                        color: "#fff",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="calories"
                      name="Calories"
                      stroke="#ff6b00"
                      strokeWidth={3}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : <EmptyChart />}
          </ChartCard>

          <ChartCard
            title="Macronutrient Distribution"
            description="Total recorded protein, carbs and fats"
          >
            {macroData.length ? (
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={macroData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={85}
                      label={({ name, value }) => `${name}: ${value}g`}
                    >
                      {macroData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#171717",
                        border: "1px solid #444",
                        borderRadius: 8,
                        color: "#fff",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : <EmptyChart />}
          </ChartCard>

          <div className="rounded-2xl border border-white/10 bg-[#111116] p-5 sm:p-6 lg:col-span-2">
            <h3 className="mb-5 font-bold">Nutrition Summary</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-[#16161f] p-4">
                <Apple className="mb-3 text-orange-500" size={22} />
                <p className="text-sm text-gray-400">Recorded Calories</p>
                <p className="mt-2 text-2xl font-bold">
                  {totalCalories.toLocaleString()} kcal
                </p>
              </div>

              <div className="rounded-xl bg-[#16161f] p-4">
                <Wheat className="mb-3 text-orange-500" size={22} />
                <p className="text-sm text-gray-400">Carbohydrates</p>
                <p className="mt-2 text-2xl font-bold">{totalCarbs} g</p>
              </div>

              <div className="rounded-xl bg-[#16161f] p-4">
                <Droplets className="mb-3 text-orange-500" size={22} />
                <p className="text-sm text-gray-400">Fats</p>
                <p className="mt-2 text-2xl font-bold">{totalFats} g</p>
              </div>
            </div>

            <Link
              to="/nutrition"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-500 hover:text-orange-400"
            >
              View Nutrition Records <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Bottom links */}
        <div className="mb-5 flex flex-wrap gap-3">
          <Link
            to="/analytics"
            className="inline-flex items-center gap-2 rounded-lg border border-orange-500/40 px-4 py-3 text-sm font-semibold text-orange-500 transition hover:bg-orange-500 hover:text-black"
          >
            <Target size={17} />
            Open Analytics Page
          </Link>

          <Link
            to="/reports"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm font-semibold text-gray-300 transition hover:border-orange-500/50 hover:text-orange-500"
          >
            <TrendingUp size={17} />
            View Reports
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
