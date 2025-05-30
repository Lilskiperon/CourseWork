import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { overviewData, recentSalesData, topProducts } from "../../constants";
import {
  CreditCard,
  DollarSign,
  Package,
  PencilLine,
  Star,
  Trash,
  TrendingUp,
  Users
} from "lucide-react";

import "./DashboardPage.css";

const DashboardPage = () => {
  const theme = "light";

  return (
    <div className="admin-container">
      <h1 className="admin-title">Dashboard</h1>
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <div className="icon blue">
              <Package size={26} />
            </div>
            <p className="card-title">Total Products</p>
          </div>
          <div className="card-body bg-light">
            <p className="card-value">25,154</p>
            <span className="growth">
              <TrendingUp size={18} />
              25%
            </span>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="icon blue">
              <DollarSign size={26} />
            </div>
            <p className="card-title">Total Paid Orders</p>
          </div>
          <div className="card-body bg-light">
            <p className="card-value">$16,000</p>
            <span className="growth">
              <TrendingUp size={18} />
              12%
            </span>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="icon blue">
              <Users size={26} />
            </div>
            <p className="card-title">Total Customers</p>
          </div>
          <div className="card-body bg-light">
            <p className="card-value">15,400k</p>
            <span className="growth">
              <TrendingUp size={18} />
              15%
            </span>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="icon blue">
              <CreditCard size={26} />
            </div>
            <p className="card-title">Sales</p>
          </div>
          <div className="card-body bg-light">
            <p className="card-value">12,340</p>
            <span className="growth">
              <TrendingUp size={18} />
              19%
            </span>
          </div>
        </div>
      </div>

      <div className="overview-sales-grid">
        <div className="card overview">
          <div className="card-header">
            <p className="card-title">Overview</p>
          </div>
          <div className="card-body no-padding">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={overviewData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  cursor={false}
                  formatter={(value) => `$${value}`}
                  contentStyle={{ borderRadius: "0.5rem" }}
                />
                <XAxis
                  dataKey="name"
                  stroke={theme === "light" ? "#475569" : "#94a3b8"}
                  tickMargin={6}
                />
                <YAxis
                  dataKey="total"
                  stroke={theme === "light" ? "#475569" : "#94a3b8"}
                  tickFormatter={(value) => `$${value}`}
                  tickMargin={6}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#2563eb"
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card recent-sales">
          <div className="card-header">
            <p className="card-title">Recent Sales</p>
          </div>
          <div className="card-body scrollable">
            {recentSalesData.map((sale) => (
              <div key={sale.id} className="sale-entry">
                <div className="sale-info">
                  <img src={sale.image} alt={sale.name} className="avatar" />
                  <div className="sale-text">
                    <p className="sale-name">{sale.name}</p>
                    <p className="sale-email">{sale.email}</p>
                  </div>
                </div>
                <p className="sale-total">${sale.total}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <p className="card-title">Top Orders</p>
        </div>
        <div className="card-body scrollable-table">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Price</th>
                <th>Status</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product) => (
                <tr key={product.number}>
                  <td>{product.number}</td>
                  <td>
                    <div className="product-info">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                      />
                      <div>
                        <p>{product.name}</p>
                        <p className="product-description">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td>${product.price}</td>
                  <td>{product.status}</td>
                  <td>
                    <div className="rating">
                      <Star className="star-icon" size={18} />
                      {product.rating}
                    </div>
                  </td>
                  <td>
                    <div className="actions">
                      <button className="edit-btn">
                        <PencilLine size={20} />
                      </button>
                      <button className="delete-btn">
                        <Trash size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
