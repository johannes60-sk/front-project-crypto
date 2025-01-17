import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import API from "services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PriceEvolution {
  date: string;
  price: number;
}

const Dashboard = () => {
  const [data, setData] = useState<PriceEvolution[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null;
  const storedValidateAccount = localStorage.getItem("validateAccount");
  const [validateAccount] = useState<boolean>(
    storedValidateAccount !== null
      ? JSON.parse(storedValidateAccount)
      : user?.validateAccount
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isLoading) {
          setIsLoading(true);
          const token = localStorage.getItem("accessToken");
          const user = localStorage.getItem("user")
            ? JSON.parse(localStorage.getItem("user") as string)
            : null;

          const response = await API.get(`/user/get_data/${user.email}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setData(response.data.data);
        }
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: data.map((entry) => entry.date),
    datasets: [
      {
        label: "Crypto Wallet Price Evolution",
        data: data.map((entry) => entry.price),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: "Crypto Wallet Price Evolution",
      },
    },
  };

  const token = localStorage.getItem("token");

  const verifyEmail = async () => {
    await API.post("/auth/send-email", { token });
    setEmailSent(true);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Crypto Wallet</h1>
      {!validateAccount && (
        <div
          className={`p-2 rounded mb-4 mt-2 ${
            emailSent ? "bg-green-500" : "bg-yellow-500"
          } text-white`}
        >
          {emailSent ? (
            "A verification email has been sent. Please check your inbox."
          ) : (
            <>
              Please verify your email to access all features.{" "}
              <button
                onClick={verifyEmail}
                className="underline"
                style={{
                  fontWeight: "bold",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  color: "red",
                  textDecoration: "underline",
                }}
              >
                Verify Email
              </button>
            </>
          )}
        </div>
      )}
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!isLoading && !error && data.length > 0 && (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
      {!isLoading && !error && data.length === 0 && <p>No data available.</p>}
    </div>
  );
};

export default Dashboard;
