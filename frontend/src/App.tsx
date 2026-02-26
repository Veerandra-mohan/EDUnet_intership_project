import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Inspection from "./pages/Inspection";
import Reports from "./pages/Reports";
import Domains from "./pages/Domains";
import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />

        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="inspection" element={<Inspection />} />
          <Route path="reports" element={<Reports />} />
          <Route path="domains" element={<Domains />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
