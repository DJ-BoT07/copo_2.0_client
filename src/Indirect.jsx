import { useState, useEffect, useContext } from "react";
import { MappingContext } from "./App";
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
import axios from "axios";

function Indirect({ showIndirect }) {
  const { mappingMatrix } = useContext(MappingContext);
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!showIndirect) {
    return null; // Do not render anything if indirect attainment is not selected
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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

    try {
      const response = await axios.post(
        "https://copo-2-0-server.onrender.com/indirect-process",
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

  console.log("Hiii");
  
  const poChartData = output
    ? [...Array(15).keys()].map((index) => {
        const name = index < 12 ? `PO${index + 1}` : `PSO${index - 11}`;
        const value = index < 12
          ? output.po_values[name] || 0
          : output.po_values[`PO${index + 12}`] || 0; // Map PSO1, PSO2, PSO3 to PO13, PO14, PO15
        return {
          name,
          value,
        };
      })
    : [];

  const mappingChartData = output
    ? [...Array(15).keys()].map((index) => {
        const name = index < 12 ? `PO${index + 1}` : `PSO${index - 11}`;
        const value = index < 12
          ? output.po_values[name] || 0
          : output.po_values[`PO${index + 12}`] || 0; // Map PSO1, PSO2, PSO3 to PO13, PO14, PO15
        return {
          name,
          "Average Mapping Value": mappingMatrix.reduce((sum, row) => sum + (row[index] || 0), 0) / mappingMatrix.length,
          "PO Attainment": value,
        };
      })
    : [];

  return (
    <Container maxWidth="lg" style={{ marginTop: "20px" }}>
      <Box mb={3}>
        <Button variant="contained" component="label" fullWidth>
          Upload File
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
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

      {output && output.co_values && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            CO Attainment Table
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
      )}

      {output && output.po_values && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            PO Attainment Table
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">PO/PSO</TableCell>
                  {poChartData.map((data) => (
                    <TableCell key={data.name} align="center">
                      {data.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="center">Attainment</TableCell>
                  {poChartData.map((data) => (
                    <TableCell key={data.name} align="center">
                      {data.value.toFixed(2)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h6" gutterBottom style={{ marginTop: "20px" }}>
            CO-PO-PSO Mapping vs Attainment Chart
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
      )}
    </Container>
  );
}

export default Indirect;
