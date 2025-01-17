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
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null;
  const [validateAccount, setValidateAccount] = useState<boolean>(
    user.validateAccount
  );

  useEffect(() => {
    if (validateAccount === true) {
      setValidateAccount(true);
    }
  }, [validateAccount]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if(!isLoading) {
                    setIsLoading(true);
                    const token = localStorage.getItem("accessToken");
                    const userEmail = localStorage.getItem("userEmail")
                    const response = await API.get(`/user/get_data/${userEmail}`, {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    });
                    setData(response.data.data);
                } 

        // const fakeData: PriceEvolution[] = [
        //     { date: "2025-01-01", price: 1000 },
        //     { date: "2025-01-02", price: 1020 },
        //     { date: "2025-01-03", price: 980 },
        //     { date: "2025-01-04", price: 1050 },
        //     { date: "2025-01-05", price: 1100 },
        //     { date: "2025-01-06", price: 1080 },
        //     { date: "2025-01-07", price: 1150 },
        // ];
        // await new Promise((resolve) => setTimeout(resolve, 1000));
        // setData(fakeData);
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

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Crypto Wallet</h1>
      {!user.validateAccount && (
        <div className="bg-yellow-500 text-white p-2 rounded mb-4 mt-2">
          Please verify your email to access all features.{" "}
          <a href={`/verify-email/${token}`} className="underline">
            Verify Email
          </a>
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
