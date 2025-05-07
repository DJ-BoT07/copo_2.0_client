import { createContext, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import UserData from "./UserData";
import Course from "./Course";
import ExamScoresTable from "./ExamScoresTable";
import Indirect from "./Indirect";

// Create a context for sharing CO PO PSO Mapping data
export const MappingContext = createContext();

function App() {
  const [file, setFile] = useState(null);
  const [mappingMatrix, setMappingMatrix] = useState(
    Array.from({ length: 6 }, () => Array(15).fill(0))
  );
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [showIndirect, setShowIndirect] = useState(false);

  const handleShowIndirect = () => {
    const userResponse = window.confirm("Do you want to continue for Indirect attainment?");
    setShowIndirect(userResponse);
  };

  const columnHeaders = [
    ...Array.from({ length: 15 }, (_, i) => `PO${i + 1}`),
  ];
  const POPSOmap = {
    'PO13':'PSO1',
    'PO14':'PSO2',
    'PO15':'PSO3'
  }
  const columnHeaders2 = [
    ...Array.from({ length: 12 }, (_, i) => `PO${i + 1}`),
    "PSO1",
    "PSO2",
    "PSO3",
  ];
  const rowHeaders = ["CO1", "CO2", "CO3", "CO4", "CO5", "CO6"];

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleMatrixChange = (params) => {
    const updatedMatrix = [...mappingMatrix];
    const rowIndex = params.id;
    const colIndex = parseInt(params.field, 10);
    updatedMatrix[rowIndex][colIndex] = parseFloat(params.value) || 0;
    setMappingMatrix(updatedMatrix);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please upload a file!");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("matrix", JSON.stringify(mappingMatrix));

    try {
      const response = await axios.post(
        "https://copo-2-0-server.onrender.com/direct-process",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setOutput(response.data);
    } catch (error) {
      console.error("Error while processing:", error);
      setErrorMsg("Failed to process the data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateAverages = () => {
    const numRows = mappingMatrix.length;
    const numCols = mappingMatrix[0].length;
    const averages = Array(numCols).fill(0);
    for (let col = 0; col < numCols; col++) {
      let sum = 0;
      for (let row = 0; row < numRows; row++) {
        sum += mappingMatrix[row][col];
      }
      averages[col] = sum / numRows;
    }
    return averages;
  };

  const averages = calculateAverages();

  const rows = mappingMatrix.map((row, rowIndex) => {
    const rowData = {
      id: rowIndex,
      ...Object.fromEntries(row.map((val, i) => [`${i}`, val])),
    };
    return { ...rowData, name: rowHeaders[rowIndex] };
  });

  // Add average row
  rows.push({
    id: 6,
    name: "Average",
    ...Object.fromEntries(averages.map((val, i) => [`${i}`, val.toFixed(2)])),
  });

  const columns = [
    { field: "name", headerName: "CO/PO", width: 100 },
    ...columnHeaders2.map((header, index) => ({
      field: `${index}`,
      headerName: header,
      width: 70,
      editable: index < 15, // Only CO rows are editable
    })),
  ];

  const coChartData = output
    ? Object.entries(output.co_values).map(([key, value]) => ({
        name: key,
        value: value,
      }))
    : [];

  const poChartData = output
    ? columnHeaders.map((header) => ({
        name: POPSOmap[header] || header,
        value: output.po_values[header] || 0,
      }))
    : [];

  const mappingChartData =
    output && output.po_values
      ? columnHeaders.map((header, index) => {
          const averageValue = averages[index] || 0;
          const poValue = output.po_values[header] || 0;
          return {
            name: header,
            "Average Mapping Value": parseFloat(averageValue.toFixed(2)),
            "PO Attainment": parseFloat(poValue.toFixed(2)),
          };
        })
      : [];

  const handleGenerateReport = () => {
    setReportGenerated(true);
    document.title = "Report";
    setTimeout(() => window.print(), 100);
  };

  return (
    <MappingContext.Provider value={{ mappingMatrix, setMappingMatrix }}>
      <UserData />
      <Course />
      <Container maxWidth="lg" style={{ marginTop: "20px" }}>
        {!reportGenerated && (
          <>
            <Box textAlign="center" mb={3}>
              <Typography variant="h4" component="h1">
                CO/PO-PSO Calculator
              </Typography>
            </Box>

            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                CO PO PSO Mapping
              </Typography>
              <div style={{ height: "auto", width: "100%" }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={7}
                  processRowUpdate={(newRow) => {
                    if (newRow.name === "Average") return newRow;
                    const updatedMatrix = [...mappingMatrix];
                    const rowIndex = newRow.id;
                    Object.keys(newRow).forEach((key) => {
                      if (key !== "id" && key !== "name") {
                        const colIndex = parseInt(key, 10);
                        updatedMatrix[rowIndex][colIndex] =
                          parseFloat(newRow[key]) || 0;
                      }
                    });
                    setMappingMatrix(updatedMatrix);
                    return newRow;
                  }}
                  disableSelectionOnClick
                  experimentalFeatures={{ newEditingApi: true }}
                  sx={{
                    "& .MuiDataGrid-cell": {
                      padding: "4px",
                      fontSize: "0.8rem",
                    },
                    "& .MuiDataGrid-columnHeader": {
                      fontSize: "0.9rem",
                      padding: "4px",
                    },
                  }}
                />
              </div>
            </Box>
            <Box mb={3}>
              <Button variant="contained" component="label" fullWidth>
                Upload File
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
              <ExamScoresTable />
              {file && (
                <Typography
                  variant="caption"
                  display="block"
                  mt={1}
                  color="textSecondary"
                >
                  Selected File: {file.name}
                </Typography>
              )}
            </Box>

            <Box mb={3} textAlign="center">
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSubmit}
                disabled={loading}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : "Calculate"}
              </Button>
              {errorMsg && (
                <Typography variant="body2" color="error">
                  {errorMsg}
                </Typography>
              )}
            </Box>
          </>
        )}

        {output && output.co_values && output.po_values && (
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Results
            </Typography>

            <Box mb={2}>
              <Typography variant="subtitle1" gutterBottom>
                CO Attainment
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" style={{ fontWeight: "bold" }}>
                        CO
                      </TableCell>
                      {Object.keys(output.co_values).map((key) => (
                        <TableCell
                          key={key}
                          align="center"
                          style={{ fontWeight: "bold" }}
                        >
                          {key}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" style={{ fontWeight: "bold" }}>
                        Attainment
                      </TableCell>
                      {Object.values(output.co_values).map((value, index) => (
                        <TableCell key={index} align="center">
                          {value.toFixed(2)}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box mb={2}>
              <Typography variant="subtitle1" gutterBottom>
                PO Attainment
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">PO</TableCell>
                      {columnHeaders2.map((header) => (
                        <TableCell key={header} align="center">
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell align="center">Attainment</TableCell>
                      {columnHeaders.map((header) => (
                        <TableCell key={header} align="right">
                          {(output.po_values[header] || 0).toFixed(2)}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box mb={2}>
              <Typography variant="subtitle1" gutterBottom>
                CO Attainment
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={coChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="name"
                    tick={{
                      fontSize: 12,
                      fontWeight: "bold",
                      fill: "#555",
                    }}
                    axisLine={{ stroke: "#ddd" }}
                    tickLine={{ stroke: "#ddd" }}
                  />
                  <YAxis
                    tick={{
                      fontSize: 12,
                      fontWeight: "bold",
                      fill: "#555",
                    }}
                    axisLine={{ stroke: "#ddd" }}
                    tickLine={{ stroke: "#ddd" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                    labelStyle={{ fontWeight: "bold", color: "#555" }}
                    itemStyle={{ color: "#555" }}
                  />
                  <Legend
                    wrapperStyle={{
                      marginTop: "10px",
                      textAlign: "center",
                      fontSize: "14px",
                      color: "#333",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#8884d8"
                    barSize={40}
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>

            <Box mb={2}>
              <Typography variant="subtitle1" gutterBottom>
                PO Attainment
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={poChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="name"
                    tick={{
                      fontSize: 12,
                      fontWeight: "bold",
                      fill: "#555",
                    }}
                    axisLine={{ stroke: "#ddd" }}
                    tickLine={{ stroke: "#ddd" }}
                  />
                  <YAxis
                    tick={{
                      fontSize: 12,
                      fontWeight: "bold",
                      fill: "#555",
                    }}
                    axisLine={{ stroke: "#ddd" }}
                    tickLine={{ stroke: "#ddd" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                    labelStyle={{ fontWeight: "bold", color: "#555" }}
                    itemStyle={{ color: "#555" }}
                  />
                  <Legend
                    wrapperStyle={{
                      marginTop: "10px",
                      textAlign: "center",
                      fontSize: "14px",
                      color: "#333",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#82ca9d"
                    barSize={40}
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>

            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                CO-PO-PSO Mapping vs Attainment
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={mappingChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Average Mapping Value" fill="#8884d8" />
                  <Bar dataKey="PO Attainment" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
            <Indirect poValues={output ? output.po_values : {}} />

            {!reportGenerated && !showIndirect && (
              <>
                <Box mb={3} textAlign="center">
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleShowIndirect}
                    fullWidth
                  >
                    Do you want to continue for Indirect attainment?
                  </Button>
                </Box>
              </>
            )}

            {showIndirect && <Indirect showIndirect={showIndirect} />}

            {!reportGenerated && (
              <Box mb={3} textAlign="center">
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={handleGenerateReport}
                  disabled={loading}
                  fullWidth
                >
                  Generate Report
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Container>
    </MappingContext.Provider>
  );
}

export default App;
