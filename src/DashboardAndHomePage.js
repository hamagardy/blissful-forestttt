import React, { useState } from "react";
import { Link } from "react-router-dom";

function DashboardAndHomePage({ inventory, invoices, returnHistory }) {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [showMoreLogs, setShowMoreLogs] = useState(false);

  const totalItems = inventory.length;
  const totalStock = inventory.reduce((acc, item) => acc + item.qty, 0);

  // Calculate total stock sold
  const totalStockSold = (invoices || []).reduce((acc, invoice) => {
    if (invoice.type === "sale") {
      (invoice.items || []).forEach((item) => {
        acc += item.orderedQty || 0;
      });
    }
    return acc;
  }, 0);

  // Calculate total returned stock from returnHistory
  const totalReturnedStock = (returnHistory || []).reduce((acc, ret) => {
    if (ret.type === "return") {
      (ret.items || []).forEach((item) => {
        acc += item.returnedQty || 0;
      });
    }
    return acc;
  }, 0);

  // Combine invoices and returnHistory for logs
  const allLogs = [...(invoices || []), ...(returnHistory || [])]
    .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date, most recent first
    .slice(0, 20); // Only keep the last 20 activities

  // Last 5 activities for quick view
  const recentLogs = allLogs.slice(0, 5);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-slate-50">
        Dashboard & Home
      </h2>

      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Total Items",
            value: totalItems,
            textColor: "text-cyan-500 dark:text-cyan-400",
          },
          {
            label: "Total Stock",
            value: totalStock,
            textColor: "text-green-500 dark:text-green-400",
          },
          {
            label: "Total Stock Sold",
            value: totalStockSold,
            textColor: "text-blue-500 dark:text-blue-400",
          },
          {
            label: "Total Returned Stock",
            value: totalReturnedStock,
            textColor: "text-red-500 dark:text-red-400",
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md"
          >
            <div className="min-w-0 flex-auto space-y-1 font-semibold">
              <p className={stat.textColor}>{stat.label}</p>
              <p className="text-slate-900 dark:text-slate-50 text-lg">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modern Log of recent activities */}
      <div className="mt-8 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Recent Activity</h3>
          <button
            className="text--500 hover:text--700 transition-colors duration-200"
            onClick={() => setShowMoreLogs(!showMoreLogs)}
          >
            {showMoreLogs ? "Show Less" : "Show More"}
          </button>
        </div>
        <ul className="space-y-2">
          {(showMoreLogs ? allLogs : recentLogs).map((log) => (
            <li
              key={log.id}
              className={`p-3 rounded-md shadow-sm ${
                log.type === "return"
                  ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300"
                  : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
              }`}
            >
              {log.type === "return"
                ? `Return Created - ID: ${log.id}, Customer: ${log.customerName}`
                : `Invoice Created - ID: ${log.id}, Customer: ${log.customerName}`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DashboardAndHomePage;
