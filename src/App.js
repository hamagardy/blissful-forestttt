import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { Home, Plus, Cog, FileText, Package, LogOut } from "lucide-react";
import "./styles.css";
import "./index.css";
import "./output.css";
import DashboardAndHomePage from "./DashboardAndHomePage";
import CreateInvoice from "./CreateInvoice";
import SavedInvoices from "./SavedInvoices";
import InvoiceDetails from "./InvoiceDetails";
import Total from "./total";
import ReturnItems from "./ReturnItems";
import ReturnHistory from "./ReturnHistory";
import ReturnDetails from "./ReturnDetails";
import Login from "./Login";
import SignUp from "./signup";
import SettingsComponent from "./Settings";

// Firebase imports
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app, db } from "./firebase"; // Firebase initialization
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

function App() {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [returnHistory, setReturnHistory] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  // Listen for authentication changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser({ username: firebaseUser.email });
        // Fetch user-specific data from Firestore
        const userDoc = doc(db, "users", firebaseUser.uid);
        const userData = await getDoc(userDoc);
        if (userData.exists()) {
          setInventory(userData.data().inventory || []);
          setInvoices(userData.data().invoices || []);
          setReturnHistory(userData.data().returnHistory || []);
        } else {
          // Initialize default data if no data found
          await setDoc(userDoc, {
            inventory: [],
            invoices: [],
            returnHistory: [],
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  // Sync inventory, invoices, and returnHistory to Firestore
  useEffect(() => {
    if (user) {
      const userDoc = doc(db, "users", auth.currentUser.uid);
      setDoc(userDoc, { inventory }, { merge: true });
    }
  }, [inventory]);

  useEffect(() => {
    if (user) {
      const userDoc = doc(db, "users", auth.currentUser.uid);
      setDoc(userDoc, { invoices }, { merge: true });
    }
  }, [invoices]);

  useEffect(() => {
    if (user) {
      const userDoc = doc(db, "users", auth.currentUser.uid);
      setDoc(userDoc, { returnHistory }, { merge: true });
    }
  }, [returnHistory]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        localStorage.removeItem("user");
      })
      .catch((error) => {
        alert("Error during logout: " + error.message);
      });
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <BrowserRouter>
      {user ? (
        <div className="flex">
          <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
            <div className="sidebar-header">
              {isSidebarOpen && <h1>Inventory System</h1>}
            </div>
            <ul className="sidebar-menu">
              <li>
                <Link to="#" onClick={toggleSidebar} className="sidebar-item">
                  ☰ <span>{isSidebarOpen && "Toggle Sidebar"}</span>
                </Link>
              </li>
              <li>
                <Link to="/" className="sidebar-item">
                  <Home /> <span>{isSidebarOpen && "Dashboard"}</span>
                </Link>
              </li>
              <li>
                <Link to="/invoice" className="sidebar-item">
                  <Plus /> <span>{isSidebarOpen && "Create Invoice"}</span>
                </Link>
              </li>
              <li>
                <Link to="/saved-invoices" className="sidebar-item">
                  <FileText /> <span>{isSidebarOpen && "Saved Invoices"}</span>
                </Link>
              </li>
              <li>
                <Link to="/total" className="sidebar-item">
                  <Package /> <span>{isSidebarOpen && "Total Items"}</span>
                </Link>
              </li>
              <li>
                <Link to="/return-items" className="sidebar-item">
                  <Plus /> <span>{isSidebarOpen && "Return Items"}</span>
                </Link>
              </li>
              <li>
                <Link to="/return-history" className="sidebar-item">
                  <FileText /> <span>{isSidebarOpen && "Return History"}</span>
                </Link>
              </li>
              <li>
                <Link to="/settings" className="sidebar-item">
                  <Cog /> <span>{isSidebarOpen && "Settings"}</span>
                </Link>
              </li>
              <li>
                <Link to="/" onClick={handleLogout} className="sidebar-item">
                  <LogOut /> <span>{isSidebarOpen && "Logout"}</span>
                </Link>
              </li>
            </ul>
          </aside>
          <main className="main-content">
            <Routes>
              <Route
                path="/"
                element={
                  <DashboardAndHomePage
                    inventory={inventory}
                    invoices={invoices}
                    returnHistory={returnHistory}
                  />
                }
              />
              <Route
                path="/invoice"
                element={
                  <CreateInvoice
                    inventory={inventory}
                    setInventory={setInventory}
                    invoices={invoices}
                    setInvoices={setInvoices}
                  />
                }
              />
              <Route
                path="/saved-invoices"
                element={<SavedInvoices invoices={invoices} />}
              />
              <Route
                path="/invoice/:id"
                element={<InvoiceDetails invoices={invoices} />}
              />
              <Route
                path="/total"
                element={
                  <Total inventory={inventory} setInventory={setInventory} />
                }
              />
              <Route
                path="/return-items"
                element={
                  <ReturnItems
                    inventory={inventory}
                    setInventory={setInventory}
                    returnHistory={returnHistory}
                    setReturnHistory={setReturnHistory}
                  />
                }
              />
              <Route
                path="/return-history"
                element={<ReturnHistory returnHistory={returnHistory} />}
              />
              <Route
                path="/return-history/:id"
                element={<ReturnDetails returnHistory={returnHistory} />}
              />
              <Route
                path="/settings"
                element={<SettingsComponent setUser={setUser} />}
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
