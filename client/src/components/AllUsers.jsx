import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from 'xlsx';

function AllUsers () {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/allUsers");
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
      setLoading(false);
    }
  };

  const downloadExcel = () => {
    if (users.length === 0) {
      toast.warning("No data to download");
      return;
    }

    try {
      // Prepare data for Excel
      const excelData = users.map((user, index) => ({
        'S.No': index + 1,
        'Name': user.name,
        'Email ID': user.personalEmail,
        'Phone Number': user.mobile,
        'Roll Number': user.rollNumber || 'N/A',
        'Programme': user.programme,
        'Department': user.branch,
        'Emergency Contact Name': user.emergencyContactName,
        'Emergency Contact Phone': user.emergencyContactPhone,
        'Registration Date': new Date(user.date).toLocaleDateString(),
        'Created At': new Date(user.createdAt).toLocaleDateString()
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      const columnWidths = [
        { wch: 5 },   // S.No
        { wch: 25 },  // Name
        { wch: 30 },  // Email ID
        { wch: 15 },  // Phone Number
        { wch: 15 },  // Roll Number
        { wch: 12 },  // Programme
        { wch: 20 },  // Department
        { wch: 25 },  // Emergency Contact Name
        { wch: 20 },  // Emergency Contact Phone
        { wch: 15 },  // Registration Date
        { wch: 15 }   // Created At
      ];
      worksheet['!cols'] = columnWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Registered Users');

      // Generate filename with current date
      const currentDate = new Date().toISOString().split('T')[0];
      const fileName = `Registered_Users_${currentDate}.xlsx`;

      // Save the file
      XLSX.writeFile(workbook, fileName);
      
      toast.success("Excel file downloaded successfully!");
    } catch (error) {
      console.error("Error downloading Excel:", error);
      toast.error("Failed to download Excel file");
    }
  };

  if (loading) {
    return (
      <div style={{ 
        textAlign: "center", 
        padding: "50px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          background: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
        }}>
          <h2 style={{ color: "#333", margin: "0 0 16px 0" }}>Loading users...</h2>
          <div style={{
            width: "40px",
            height: "40px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #667eea",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto"
          }}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "20px"
    }}>
      <ToastContainer />
      <div style={{ 
        maxWidth: "1400px", 
        margin: "0 auto",
        background: "white",
        borderRadius: "16px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        overflow: "hidden"
      }}>
        <div style={{ 
          textAlign: "center", 
          padding: "32px 20px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white"
        }}>
          <h1 style={{ margin: "0 0 8px 0", fontSize: "clamp(1.8rem, 4vw, 2.5rem)" }}>
            Registered Users
          </h1>
          <p style={{ margin: 0, fontSize: "clamp(1rem, 2.5vw, 1.2rem)", opacity: 0.9 }}>
            View all registered users
          </p>
        </div>

        <div style={{ 
          backgroundColor: "#fff", 
          overflow: "hidden"
        }}>
          <div style={{ 
            backgroundColor: "#f8f9fa", 
            padding: "20px",
            borderBottom: "1px solid #e9ecef",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px"
          }}>
            <h3 style={{ margin: 0, color: "#333", fontSize: "1.2rem" }}>
              Total Users: {users.length}
            </h3>
            <button
              onClick={downloadExcel}
              style={{
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(40, 167, 69, 0.3)"
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#218838";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#28a745";
                e.target.style.transform = "translateY(0)";
              }}
            >
              📊 Download Excel
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ 
              width: "100%", 
              borderCollapse: "collapse",
              fontSize: "14px"
            }}>
              <thead>
                <tr style={{ 
                  backgroundColor: "#667eea", 
                  color: "white",
                  position: "sticky",
                  top: 0,
                  zIndex: 10
                }}>
                  <th style={{ padding: "16px 12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600" }}>
                    S.No
                  </th>
                  <th style={{ padding: "16px 12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600" }}>
                    Name
                  </th>
                  <th style={{ padding: "16px 12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600" }}>
                    Email
                  </th>
                  <th style={{ padding: "16px 12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600" }}>
                    Phone
                  </th>
                  <th style={{ padding: "16px 12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600" }}>
                    Roll No.
                  </th>
                  <th style={{ padding: "16px 12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600" }}>
                    Programme
                  </th>
                  <th style={{ padding: "16px 12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600" }}>
                    Department
                  </th>
                  <th style={{ padding: "16px 12px", textAlign: "left", borderBottom: "2px solid #ddd", fontWeight: "600" }}>
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id} style={{ 
                    backgroundColor: index % 2 === 0 ? "#f8f9fa" : "#fff",
                    borderBottom: "1px solid #e9ecef",
                    transition: "background-color 0.2s ease"
                  }}
                  onMouseOver={(e) => e.target.parentElement.style.backgroundColor = "#e3f2fd"}
                  onMouseOut={(e) => e.target.parentElement.style.backgroundColor = index % 2 === 0 ? "#f8f9fa" : "#fff"}
                  >
                    <td style={{ padding: "12px", borderBottom: "1px solid #e9ecef", fontWeight: "500" }}>
                      {index + 1}
                    </td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #e9ecef", fontWeight: "600", color: "#333" }}>
                      {user.name}
                    </td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #e9ecef", color: "#667eea" }}>
                      {user.personalEmail}
                    </td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #e9ecef" }}>
                      {user.mobile}
                    </td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #e9ecef" }}>
                      {user.rollNumber || "N/A"}
                    </td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #e9ecef" }}>
                      {user.programme}
                    </td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #e9ecef" }}>
                      {user.branch}
                    </td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #e9ecef" }}>
                      {new Date(user.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div style={{ 
              textAlign: "center", 
              padding: "60px 20px", 
              color: "#6c757d",
              fontStyle: "italic",
              fontSize: "1.1rem"
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📋</div>
              No users found
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .table-container {
            overflow-x: auto;
          }
          
          table {
            min-width: 800px;
          }
        }
      `}</style>
    </div>
  );
};

export default AllUsers; 