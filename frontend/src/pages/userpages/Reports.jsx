
import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FileText,
  Download,
  FileSpreadsheet,
  Dumbbell,
  Utensils,
  Flame,
  Beef,
  Wheat,
  Droplets,
} from "lucide-react";

const Reports = () => {
  const [workouts, setWorkouts] = useState([]);
  const [nutrition, setNutrition] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [workoutRes, nutritionRes] = await Promise.all([
          axios.get("http://localhost:5000/workout"),
          axios.get("http://localhost:5000/nutrition"),
        ]);

        setWorkouts(workoutRes.data.workoutlists || []);
        setNutrition(nutritionRes.data.nutrition || []);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const totalWorkouts = workouts.length;

  const totalSets = workouts.reduce(
    (sum, item) => sum + Number(item.sets || 0),
    0
  );

  const totalReps = workouts.reduce(
    (sum, item) => sum + Number(item.reps || 0),
    0
  );

  const totalWeight = workouts.reduce(
    (sum, item) =>
      sum +
      Number(item.weight || 0) *
        Number(item.sets || 0) *
        Number(item.reps || 0),
    0
  );

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

  const escapeCSV = (value) => {
    if (value === null || value === undefined) return "";

    const text = String(value);

    return text.includes(",") || text.includes('"') || text.includes("\n")
      ? `"${text.replace(/"/g, '""')}"`
      : text;
  };

  const downloadCSV = (filename, rows) => {
    const csv = rows
      .map((row) => row.map(escapeCSV).join(","))
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  };

  const exportWorkoutCSV = () => {
    const rows = [
      [
        "Workout Name",
        "Exercise Name",
        "Sets",
        "Reps",
        "Weight",
        "Notes",
        "Tags",
        "Created At",
      ],
      ...workouts.map((item) => [
        item.workoutName,
        item.exerciseName,
        item.sets,
        item.reps,
        item.weight,
        item.notes,
        item.tags,
        item.createdAt
          ? new Date(item.createdAt).toLocaleDateString()
          : "",
      ]),
    ];

    downloadCSV("FitTrack_Workout_Report.csv", rows);
  };

  const exportNutritionCSV = () => {
    const rows = [
      [
        "Meal Type",
        "Food Item",
        "Quantity",
        "Calories",
        "Protein",
        "Carbs",
        "Fats",
        "Date",
      ],
      ...nutrition.map((item) => [
        item.mealType,
        item.foodItem,
        item.quantity,
        item.calories,
        item.protein,
        item.carbs,
        item.fats,
        item.date
          ? new Date(item.date).toLocaleDateString()
          : "",
      ]),
    ];

    downloadCSV("FitTrack_Nutrition_Report.csv", rows);
  };

  const exportCompleteCSV = () => {
    const rows = [
      [
        "Type",
        "Workout/Food",
        "Exercise/Meal",
        "Sets",
        "Reps",
        "Weight",
        "Calories",
        "Protein",
        "Carbs",
        "Fats",
        "Date",
      ],
      ...workouts.map((item) => [
        "Workout",
        item.workoutName,
        item.exerciseName,
        item.sets,
        item.reps,
        item.weight,
        "",
        "",
        "",
        "",
        item.createdAt
          ? new Date(item.createdAt).toLocaleDateString()
          : "",
      ]),
      ...nutrition.map((item) => [
        "Nutrition",
        item.foodItem,
        item.mealType,
        "",
        "",
        "",
        item.calories,
        item.protein,
        item.carbs,
        item.fats,
        item.date
          ? new Date(item.date).toLocaleDateString()
          : "",
      ]),
    ];

    downloadCSV("FitTrack_Complete_Report.csv", rows);
  };

  const addPDFHeader = (doc, title) => {
    doc.setFillColor(17, 17, 17);
    doc.rect(0, 0, 210, 30, "F");

    doc.setTextColor(255, 107, 0);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("FitTrack", 15, 19);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text(title, 195, 19, { align: "right" });

    doc.setTextColor(0, 0, 0);
  };

  const tableStyle = {
    theme: "grid",
    headStyles: {
      fillColor: [255, 107, 0],
      textColor: [255, 255, 255],
    },
  };

  const exportWorkoutPDF = () => {
    const doc = new jsPDF();

    addPDFHeader(doc, "Workout Report");

    doc.setFontSize(11);
    doc.text(
      `Generated: ${new Date().toLocaleDateString()}`,
      15,
      40
    );

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");

    doc.text(`Total Workouts: ${totalWorkouts}`, 15, 52);
    doc.text(`Total Sets: ${totalSets}`, 15, 60);
    doc.text(`Total Reps: ${totalReps}`, 15, 68);
    doc.text(`Weight Volume: ${totalWeight.toFixed(2)}`, 15, 76);

    autoTable(doc, {
      startY: 85,
      head: [["Workout", "Exercise", "Sets", "Reps", "Weight", "Date"]],
      body: workouts.map((item) => [
        item.workoutName || "",
        item.exerciseName || "",
        item.sets || 0,
        item.reps || 0,
        item.weight || 0,
        item.createdAt
          ? new Date(item.createdAt).toLocaleDateString()
          : "",
      ]),
      ...tableStyle,
    });

    doc.save("FitTrack_Workout_Report.pdf");
  };

  const exportNutritionPDF = () => {
    const doc = new jsPDF();

    addPDFHeader(doc, "Nutrition Report");

    doc.setFontSize(11);
    doc.text(
      `Generated: ${new Date().toLocaleDateString()}`,
      15,
      40
    );

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");

    doc.text(`Total Calories: ${totalCalories}`, 15, 52);
    doc.text(`Protein: ${totalProtein.toFixed(2)} g`, 15, 60);
    doc.text(`Carbs: ${totalCarbs.toFixed(2)} g`, 15, 68);
    doc.text(`Fats: ${totalFats.toFixed(2)} g`, 15, 76);

    autoTable(doc, {
      startY: 85,
      head: [
        [
          "Meal",
          "Food",
          "Quantity",
          "Calories",
          "Protein",
          "Carbs",
          "Fats",
          "Date",
        ],
      ],
      body: nutrition.map((item) => [
        item.mealType || "",
        item.foodItem || "",
        item.quantity || "",
        item.calories || 0,
        item.protein || 0,
        item.carbs || 0,
        item.fats || 0,
        item.date
          ? new Date(item.date).toLocaleDateString()
          : "",
      ]),
      ...tableStyle,
    });

    doc.save("FitTrack_Nutrition_Report.pdf");
  };

  const exportCompletePDF = () => {
    const doc = new jsPDF();

    addPDFHeader(doc, "Complete Report");

    doc.setFontSize(11);
    doc.text(
      `Generated: ${new Date().toLocaleDateString()}`,
      15,
      40
    );

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Workout Summary", 15, 53);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    doc.text(`Total Workouts: ${totalWorkouts}`, 15, 62);
    doc.text(`Total Sets: ${totalSets}`, 15, 69);
    doc.text(`Total Reps: ${totalReps}`, 15, 76);
    doc.text(`Weight Volume: ${totalWeight.toFixed(2)}`, 15, 83);

    autoTable(doc, {
      startY: 90,
      head: [["Workout", "Exercise", "Sets", "Reps", "Weight"]],
      body: workouts.map((item) => [
        item.workoutName || "",
        item.exerciseName || "",
        item.sets || 0,
        item.reps || 0,
        item.weight || 0,
      ]),
      ...tableStyle,
    });

    const nutritionStart = doc.lastAutoTable.finalY + 15;

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Nutrition Summary", 15, nutritionStart);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    doc.text(`Calories: ${totalCalories}`, 15, nutritionStart + 9);
    doc.text(
      `Protein: ${totalProtein.toFixed(2)} g`,
      15,
      nutritionStart + 16
    );
    doc.text(
      `Carbs: ${totalCarbs.toFixed(2)} g`,
      15,
      nutritionStart + 23
    );
    doc.text(
      `Fats: ${totalFats.toFixed(2)} g`,
      15,
      nutritionStart + 30
    );

    autoTable(doc, {
      startY: nutritionStart + 37,
      head: [["Meal", "Food", "Calories", "Protein", "Carbs", "Fats", "Date"]],
      body: nutrition.map((item) => [
        item.mealType || "",
        item.foodItem || "",
        item.calories || 0,
        item.protein || 0,
        item.carbs || 0,
        item.fats || 0,
        item.date
          ? new Date(item.date).toLocaleDateString()
          : "",
      ]),
      ...tableStyle,
    });

    doc.save("FitTrack_Complete_Report.pdf");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500/20 border-t-[#ff6b00] rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white">
            Loading Reports...
          </h2>
          <p className="text-gray-400 mt-1">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-white animate-fade-in-up pb-10">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 bg-orange-500/10 rounded-xl flex items-center justify-center">
            <FileText size={24} className="text-[#ff6b00]" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Reports & Export
          </h1>
        </div>

        <p className="text-gray-400">
          Generate and export your fitness progress and nutrition data.
        </p>
      </div>

      {/* Fitness Report */}
      <div className="bg-[#111116] border border-white/10 rounded-2xl shadow-xl p-5 sm:p-7 mb-7">

        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <Dumbbell size={23} className="text-[#ff6b00]" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              Fitness Progress Report
            </h2>
            <p className="text-gray-400 text-sm">
              Overview of your workout performance
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">

          {[
            ["Total Workouts", totalWorkouts, Dumbbell],
            ["Total Sets", totalSets, FileText],
            ["Total Reps", totalReps, Flame],
            ["Weight Volume", totalWeight.toFixed(0), Dumbbell],
          ].map(([title, value, Icon]) => (
            <div
              key={title}
              className="bg-[#16161f] border border-white/5 rounded-xl p-5"
            >
              <p className="text-gray-400 text-sm">{title}</p>

              <div className="flex items-center justify-between mt-3">
                <h3 className="text-3xl font-bold text-white">
                  {value}
                </h3>
                <Icon size={24} className="text-[#ff6b00]" />
              </div>
            </div>
          ))}

        </div>

        <div className="flex flex-wrap gap-3">

          {/* CSV */}
          <button
            onClick={exportWorkoutCSV}
            className="flex items-center gap-2 bg-transparent hover:bg-white/5 text-[#ff6b00] border border-[#ff6b00] px-5 py-3 rounded-xl font-semibold transition"
          >
            <FileSpreadsheet size={19} />
            Export Workout CSV
          </button>

          {/* PDF - Orange */}
          <button
            onClick={exportWorkoutPDF}
            className="flex items-center gap-2 bg-[#ff6b00] hover:bg-[#e85f00] text-white px-5 py-3 rounded-xl font-semibold transition shadow-lg shadow-[#ff6b00]/20"
          >
            <Download size={19} />
            Export Workout PDF
          </button>

        </div>
      </div>

      {/* Nutrition Report */}
      <div className="bg-[#111116] border border-white/10 rounded-2xl shadow-xl p-5 sm:p-7 mb-7">

        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <Utensils size={23} className="text-[#ff6b00]" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              Nutrition Report
            </h2>
            <p className="text-gray-400 text-sm">
              Overview of your nutrition and daily intake
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">

          {[
            ["Total Calories", totalCalories, Flame],
            ["Protein", `${totalProtein.toFixed(1)}g`, Beef],
            ["Carbs", `${totalCarbs.toFixed(1)}g`, Wheat],
            ["Fats", `${totalFats.toFixed(1)}g`, Droplets],
          ].map(([title, value, Icon]) => (
            <div
              key={title}
              className="bg-[#16161f] border border-white/5 rounded-xl p-5"
            >
              <p className="text-gray-400 text-sm">{title}</p>

              <div className="flex items-center justify-between mt-3">
                <h3 className="text-3xl font-bold text-white">
                  {value}
                </h3>
                <Icon size={24} className="text-[#ff6b00]" />
              </div>
            </div>
          ))}

        </div>

        <div className="flex flex-wrap gap-3">

          {/* CSV */}
          <button
            onClick={exportNutritionCSV}
            className="flex items-center gap-2 bg-transparent hover:bg-white/5 text-[#ff6b00] border border-[#ff6b00] px-5 py-3 rounded-xl font-semibold transition"
          >
            <FileSpreadsheet size={19} />
            Export Nutrition CSV
          </button>

          {/* PDF - Orange */}
          <button
            onClick={exportNutritionPDF}
            className="flex items-center gap-2 bg-[#ff6b00] hover:bg-[#e85f00] text-white px-5 py-3 rounded-xl font-semibold transition shadow-lg shadow-[#ff6b00]/20"
          >
            <Download size={19} />
            Export Nutrition PDF
          </button>

        </div>
      </div>

      {/* Complete Report */}
      <div className="bg-[#16161f] border border-white/10 rounded-2xl shadow-xl p-5 sm:p-7">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 bg-[#ff6b00] rounded-xl flex items-center justify-center shadow-lg shadow-[#ff6b00]/30">
              <FileText size={25} className="text-white" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">
                Complete FitTrack Report
              </h2>

              <p className="text-gray-400 mt-1">
                Export your complete workout and nutrition data.
              </p>
            </div>

          </div>

          <div className="flex flex-wrap gap-3">

            {/* CSV */}
            <button
              onClick={exportCompleteCSV}
              className="flex items-center gap-2 bg-transparent hover:bg-white/5 text-[#ff6b00] border border-[#ff6b00] px-5 py-3 rounded-xl font-semibold transition"
            >
              <FileSpreadsheet size={19} />
              Complete CSV
            </button>

            {/* PDF */}
            <button
              onClick={exportCompletePDF}
              className="flex items-center gap-2 bg-[#ff6b00] hover:bg-[#e85f00] text-white px-5 py-3 rounded-xl font-semibold transition shadow-lg shadow-[#ff6b00]/20"
            >
              <Download size={19} />
              Complete PDF
            </button>

          </div>

        </div>
      </div>

    </div>
  );
};

export default Reports;
