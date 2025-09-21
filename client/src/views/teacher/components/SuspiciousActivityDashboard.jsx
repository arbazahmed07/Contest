import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Chip,
  Paper,
  Stack,
  IconButton,
  Tooltip,
  Alert,
  Divider,
  LinearProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  Warning,
  Phone,
  Face,
  Book,
  Visibility,
  Timeline,
  Security,
  CameraAlt,
  Download,
  Save,
  PictureAsPdf,
  Archive,
} from '@mui/icons-material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useGetExamsQuery } from '../../../slices/examApiSlice';
import { useGetAllCheatingLogsQuery } from '../../../slices/cheatingLogApiSlice';


const SuspiciousActivityDashboard = () => {
  const { data: examsData, isLoading: examsLoading } = useGetExamsQuery();
  const { data: allLogsData, isLoading: logsLoading } = useGetAllCheatingLogsQuery();
  
  // State for processed data
  const [recentScreenshots, setRecentScreenshots] = useState([]);
  const [violationStats, setViolationStats] = useState({});
  
  // Evidence capture state
  const [evidenceDialog, setEvidenceDialog] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState([]);
  const [allEvidenceItems, setAllEvidenceItems] = useState([]);

  // Process the fetched data
  useEffect(() => {
    if (logsLoading || !allLogsData || !examsData) return;

    const logs = Array.isArray(allLogsData) ? allLogsData : [];
    console.log('🔍 Processing logs data:', logs);
    console.log('📊 Total logs found:', logs.length);
    
    const combinedScreenshots = [];
    const stats = {
      cellPhone: 0,
      multipleFace: 0,
      noFace: 0,
      prohibitedObject: 0,
      totalScreenshots: 0,
      totalViolations: 0,
    };

    // Process all logs
    logs.forEach((log, index) => {
      console.log(`📝 Processing log ${index + 1}:`, log);
      console.log(`📸 Screenshots in log ${index + 1}:`, log.screenshots);
      
      // Find exam name
      const exam = examsData.find(e => e.examId === log.examId);
      const examName = exam?.examName || 'Unknown Exam';

      // Count violations
      stats.cellPhone += log.cellPhoneCount || 0;
      stats.multipleFace += log.multipleFaceCount || 0;
      stats.noFace += log.noFaceCount || 0;
      stats.prohibitedObject += log.prohibitedObjectCount || 0;
      stats.totalViolations += (log.cellPhoneCount || 0) + (log.multipleFaceCount || 0) + 
                             (log.noFaceCount || 0) + (log.prohibitedObjectCount || 0);

      // Collect screenshots
      if (log.screenshots && log.screenshots.length > 0) {
        console.log(`✅ Found ${log.screenshots.length} screenshots for ${log.username}`);
        log.screenshots.forEach((screenshot, screenshotIndex) => {
          console.log(`📸 Screenshot ${screenshotIndex + 1}:`, screenshot);
          combinedScreenshots.push({
            ...screenshot,
            username: log.username,
            email: log.email,
            examName: examName,
            examId: log.examId
          });
        });
      } else {
        console.log(`❌ No screenshots found for ${log.username}`, {
          screenshots: log.screenshots,
          screenshotsLength: log.screenshots?.length,
          screenshotsType: typeof log.screenshots
        });
      }
    });

    stats.totalScreenshots = combinedScreenshots.length;
    
    // Sort screenshots by most recent
    combinedScreenshots.sort((a, b) => new Date(b.detectedAt) - new Date(a.detectedAt));

    setRecentScreenshots(combinedScreenshots.slice(0, 12)); // Show latest 12
    setViolationStats(stats);

    console.log('📊 Final stats:', stats);
    console.log('📸 Combined screenshots:', combinedScreenshots);

    // Prepare evidence items for capture
    const evidenceItems = logs.map(log => {
      const exam = examsData.find(e => e.examId === log.examId);
      const evidenceItem = {
        id: log._id,
        studentName: log.username,
        studentEmail: log.email,
        examName: exam?.examName || 'Unknown Exam',
        examId: log.examId,
        violationCounts: {
          cellPhone: log.cellPhoneCount || 0,
          multipleFace: log.multipleFaceCount || 0,
          noFace: log.noFaceCount || 0,
          prohibitedObject: log.prohibitedObjectCount || 0,
        },
        totalViolations: (log.cellPhoneCount || 0) + (log.multipleFaceCount || 0) + 
                        (log.noFaceCount || 0) + (log.prohibitedObjectCount || 0),
        screenshots: log.screenshots || [],
        timestamp: log.createdAt || log.detectedAt,
      };
      
      console.log(`💼 Evidence item for ${log.username}:`, evidenceItem);
      console.log(`📸 Screenshots count: ${evidenceItem.screenshots.length}`);
      
      return evidenceItem;
    }).filter(item => item.totalViolations > 0); // Only include items with violations

    console.log('💼 Final evidence items:', evidenceItems);
    setAllEvidenceItems(evidenceItems);

  }, [allLogsData, examsData, logsLoading]);

  // Evidence capture functions
  const handleEvidenceSelection = (evidenceId, checked) => {
    if (checked) {
      setSelectedEvidence(prev => [...prev, evidenceId]);
    } else {
      setSelectedEvidence(prev => prev.filter(id => id !== evidenceId));
    }
  };

  const handleSelectAllEvidence = (checked) => {
    if (checked) {
      setSelectedEvidence(allEvidenceItems.map(item => item.id));
    } else {
      setSelectedEvidence([]);
    }
  };

  const downloadImageFromUrl = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const generatePDFReport = (data, title, filename) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // Header
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text(title, pageWidth / 2, 20, { align: 'center' });
    
    // Subtitle
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, 30, { align: 'center' });
    
    let yPosition = 45;
    
    if (data.type === 'evidence') {
      // Evidence Report
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      doc.text(`Total Violations: ${data.totalViolations}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Affected Students: ${data.affectedStudents}`, 20, yPosition);
      yPosition += 20;
      
      // Evidence table
      const evidenceTableData = data.evidence.map(item => [
        item.studentName,
        item.studentEmail,
        item.examName,
        item.totalViolations,
        item.screenshotCount,
        `Cell: ${item.violations.cellPhone || 0}, Multiple: ${item.violations.multipleFace || 0}, No Face: ${item.violations.noFace || 0}, Object: ${item.violations.prohibitedObject || 0}`
      ]);
      
      autoTable(doc, {
        head: [['Student Name', 'Email', 'Exam', 'Violations', 'Screenshots', 'Breakdown']],
        body: evidenceTableData,
        startY: yPosition,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] },
        margin: { top: 10 },
        styles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 40 },
          2: { cellWidth: 30 },
          3: { cellWidth: 20 },
          4: { cellWidth: 20 },
          5: { cellWidth: 50 }
        }
      });
      
    } else if (data.type === 'summary') {
      // Summary Report
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      
      // Summary statistics
      doc.text('Summary Statistics:', 20, yPosition);
      yPosition += 15;
      
      const summaryData = [
        ['Total Violations', data.summary.totalViolations],
        ['Total Screenshots', data.summary.totalScreenshots],
        ['Students Monitored', data.summary.studentsMonitored],
        ['Exams Monitored', data.examsMonitored],
        ['Evidence Items', data.evidenceItems]
      ];
      
      autoTable(doc, {
        body: summaryData,
        startY: yPosition,
        theme: 'plain',
        styles: { fontSize: 10 },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 60 },
          1: { cellWidth: 40 }
        }
      });
      
      // Calculate approximate Y position after the table
      yPosition = yPosition + (summaryData.length * 12) + 30;
      
      // Violation breakdown
      doc.text('Violation Breakdown:', 20, yPosition);
      yPosition += 10;
      
      const violationData = [
        ['Cell Phone', data.summary.violationBreakdown.cellPhone],
        ['Multiple Face', data.summary.violationBreakdown.multipleFace],
        ['No Face', data.summary.violationBreakdown.noFace],
        ['Prohibited Object', data.summary.violationBreakdown.prohibitedObject]
      ];
      
      autoTable(doc, {
        body: violationData,
        startY: yPosition,
        theme: 'striped',
        headStyles: { fillColor: [231, 76, 60] },
        styles: { fontSize: 10 },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 60 },
          1: { cellWidth: 40 }
        }
      });
    }
    
    // Footer
    const footerY = pageHeight - 20;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Contest Management System - Suspicious Activity Report', pageWidth / 2, footerY, { align: 'center' });
    
    // Save the PDF
    doc.save(filename);
  };

  const generateEvidenceReport = (evidenceItems) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportData = {
      type: 'evidence',
      generatedAt: new Date().toISOString(),
      totalViolations: evidenceItems.reduce((sum, item) => sum + item.totalViolations, 0),
      affectedStudents: evidenceItems.length,
      evidence: evidenceItems.map(item => ({
        studentName: item.studentName,
        studentEmail: item.studentEmail,
        examName: item.examName,
        examId: item.examId,
        violations: item.violationCounts,
        totalViolations: item.totalViolations,
        screenshotCount: item.screenshots.length,
        timestamp: item.timestamp,
        screenshots: item.screenshots.map(screenshot => ({
          url: screenshot.imageUrl,
          violationType: screenshot.violationType,
          detectedAt: screenshot.detectedAt,
        })),
      })),
    };

    generatePDFReport(reportData, 'Cheating Evidence Report', `cheating-evidence-report-${timestamp}.pdf`);
  };

  const downloadSelectedEvidence = async () => {
    const selectedItems = allEvidenceItems.filter(item => selectedEvidence.includes(item.id));
    
    if (selectedItems.length === 0) {
      alert('Please select evidence to download');
      return;
    }

    try {
      // Show progress
      console.log(`Starting evidence download for ${selectedItems.length} students...`);
      
      // Generate and download the evidence report first
      generateEvidenceReport(selectedItems);

      // Download all suspicious screenshots/images
      let totalImages = 0;
      let downloadedImages = 0;
      
      // Count total images first
      selectedItems.forEach(item => {
        totalImages += item.screenshots.length;
      });
      
      console.log(`Total suspicious images to download: ${totalImages}`);

      // Download all screenshots for each selected student
      for (const item of selectedItems) {
        console.log(`Downloading evidence for ${item.studentName} (${item.screenshots.length} images)...`);
        
        for (let i = 0; i < item.screenshots.length; i++) {
          const screenshot = item.screenshots[i];
          
          // Create descriptive filename with violation type and timestamp
          const timestamp = new Date(screenshot.detectedAt || Date.now()).toISOString().replace(/[:.]/g, '-');
          const violationType = screenshot.violationType || screenshot.type || 'violation';
          const filename = `${item.studentName.replace(/\s+/g, '_')}_${item.examName.replace(/\s+/g, '_')}_${violationType}_${timestamp}_${i + 1}.jpg`;
          
          try {
            // Use imageUrl, url, or cdnUrl property - handle multiple formats
            const imageUrl = screenshot.imageUrl || screenshot.url;
            if (imageUrl) {
              await downloadImageFromUrl(imageUrl, filename);
              downloadedImages++;
              console.log(`Downloaded ${downloadedImages}/${totalImages}: ${filename}`);
            } else {
              console.warn(`No image URL found for screenshot ${i + 1} of ${item.studentName}`, screenshot);
            }
          } catch (error) {
            console.error(`Failed to download image ${filename}:`, error);
          }
          
          // Add delay to prevent overwhelming the browser/server
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }

      console.log(`Evidence download completed: ${downloadedImages}/${totalImages} images downloaded successfully`);
      alert(`Evidence capture completed!\n\n✅ Report: Generated\n✅ Images: ${downloadedImages}/${totalImages} downloaded\n\nFiles saved to your Downloads folder.`);

    } catch (error) {
      console.error('Error during evidence download:', error);
      alert('Error occurred during evidence download. Please check console for details.');
    } finally {
      setEvidenceDialog(false);
      setSelectedEvidence([]);
    }
  };

  const openEvidenceDialog = () => {
    setEvidenceDialog(true);
  };

  const exportSummaryReport = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const summaryData = {
      type: 'summary',
      generatedAt: new Date().toISOString(),
      summary: {
        totalViolations: violationStats.totalViolations,
        totalScreenshots: violationStats.totalScreenshots,
        studentsMonitored: Array.isArray(allLogsData) ? allLogsData.length : 0,
        violationBreakdown: {
          cellPhone: violationStats.cellPhone,
          multipleFace: violationStats.multipleFace,
          noFace: violationStats.noFace,
          prohibitedObject: violationStats.prohibitedObject,
        }
      },
      evidenceItems: allEvidenceItems.length,
      examsMonitored: examsData ? examsData.length : 0,
    };

    generatePDFReport(summaryData, 'Cheating Summary Report', `cheating-summary-report-${timestamp}.pdf`);
  };

  const getViolationColor = (type) => {
    switch (type) {
      case 'cellPhone':
        return 'error';
      case 'multipleFace':
        return 'warning';
      case 'noFace':
        return 'info';
      case 'prohibitedObject':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getViolationLabel = (type) => {
    switch (type) {
      case 'cellPhone':
        return 'Cell Phone';
      case 'multipleFace':
        return 'Multiple Faces';
      case 'noFace':
        return 'No Face';
      case 'prohibitedObject':
        return 'Prohibited Object';
      default:
        return 'Unknown';
    }
  };

  if (examsLoading || logsLoading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" py={4}>
        <LinearProgress sx={{ width: '100%', mb: 2 }} />
        <Typography>Loading suspicious activity data...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Evidence Capture Header */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: '#f8f9fa' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" fontWeight="bold" color="primary">
              Suspicious Activity Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Monitor and capture evidence of examination violations
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<PictureAsPdf />}
              onClick={exportSummaryReport}
              sx={{ borderColor: '#1976d2', color: '#1976d2' }}
            >
              Export Summary
            </Button>
            <Button
              variant="contained"
              startIcon={<Archive />}
              onClick={openEvidenceDialog}
              disabled={allEvidenceItems.length === 0}
              sx={{
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0 0%, #1e88e5 100%)',
                }
              }}
            >
              Capture Evidence ({allEvidenceItems.length})
            </Button>
          </Stack>
        </Stack>
      </Paper>
      
      {/* Statistics Overview */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #ff1744 0%, #ff5252 100%)', color: 'white' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {violationStats.totalViolations}
                  </Typography>
                  <Typography variant="body2">Total Violations</Typography>
                </Box>
                <Warning sx={{ fontSize: 40, opacity: 0.8 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)', color: 'white' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {violationStats.totalScreenshots}
                  </Typography>
                  <Typography variant="body2">Evidence Captured</Typography>
                </Box>
                <CameraAlt sx={{ fontSize: 40, opacity: 0.8 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)', color: 'white' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {Array.isArray(allLogsData) ? allLogsData.length : 0}
                  </Typography>
                  <Typography variant="body2">Students Monitored</Typography>
                </Box>
                <Timeline sx={{ fontSize: 40, opacity: 0.8 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)', color: 'white' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {examsData?.length || 0}
                  </Typography>
                  <Typography variant="body2">Active Exams</Typography>
                </Box>
                <Security sx={{ fontSize: 40, opacity: 0.8 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Violation Type Breakdown */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Violation Breakdown
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Phone color="error" />
              <Box>
                <Typography variant="h6">{violationStats.cellPhone}</Typography>
                <Typography variant="caption">Cell Phone</Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={6} md={3}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Face color="warning" />
              <Box>
                <Typography variant="h6">{violationStats.multipleFace}</Typography>
                <Typography variant="caption">Multiple Faces</Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={6} md={3}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Warning color="info" />
              <Box>
                <Typography variant="h6">{violationStats.noFace}</Typography>
                <Typography variant="caption">No Face Visible</Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={6} md={3}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Book color="secondary" />
              <Box>
                <Typography variant="h6">{violationStats.prohibitedObject}</Typography>
                <Typography variant="caption">Prohibited Objects</Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

  

      {/* Recent Suspicious Activity */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Suspicious Activity Evidence
        </Typography>
        
        {recentScreenshots.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            No suspicious activity detected yet. The system is actively monitoring all active exams.
          </Alert>
        ) : (
          // <>
          //   <Typography variant="body2" color="text.secondary" gutterBottom>
          //     Showing the most recent {recentScreenshots.length} suspicious activities detected across all exams
          //   </Typography>
          //   <Divider sx={{ my: 2 }} />
          //   <Grid container spacing={3}>
          //     {recentScreenshots.map((screenshot, index) => (
          //       <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          //         <Card 
          //           sx={{ 
          //             height: '100%',
          //             border: `2px solid`,
          //             borderColor: `${getViolationColor(screenshot.type)}.main`,
          //             '&:hover': {
          //               transform: 'scale(1.02)',
          //               transition: 'transform 0.2s ease-in-out',
          //               boxShadow: 4
          //             }
          //           }}
          //         >
          //           <Box position="relative">
          //             <CardMedia
          //               component="img"
          //               height="150"
          //               image={screenshot.url}
          //               alt={`${getViolationLabel(screenshot.type)} - Evidence`}
          //               sx={{ 
          //                 objectFit: 'cover',
          //                 cursor: 'pointer'
          //               }}
          //               onClick={() => window.open(screenshot.url, '_blank')}
          //             />
          //             <Chip
          //               label={getViolationLabel(screenshot.type)}
          //               color={getViolationColor(screenshot.type)}
          //               size="small"
          //               sx={{
          //                 position: 'absolute',
          //                 top: 8,
          //                 left: 8,
          //                 fontWeight: 'bold'
          //               }}
          //             />
          //             <Tooltip title="View full size">
          //               <IconButton
          //                 sx={{
          //                   position: 'absolute',
          //                   top: 8,
          //                   right: 40,
          //                   bgcolor: 'rgba(0,0,0,0.5)',
          //                   color: 'white',
          //                   '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
          //                 }}
          //                 onClick={() => window.open(screenshot.url, '_blank')}
          //               >
          //                 <Visibility fontSize="small" />
          //               </IconButton>
          //             </Tooltip>
          //             <Tooltip title="Download evidence">
          //               <IconButton
          //                 sx={{
          //                   position: 'absolute',
          //                   top: 8,
          //                   right: 8,
          //                   bgcolor: 'rgba(25,118,210,0.8)',
          //                   color: 'white',
          //                   '&:hover': { bgcolor: 'rgba(25,118,210,1)' }
          //                 }}
          //                 onClick={() => {
          //                   const filename = `${screenshot.username.replace(/\s+/g, '_')}_${screenshot.examName.replace(/\s+/g, '_')}_${getViolationLabel(screenshot.type).replace(/\s+/g, '_')}_evidence.jpg`;
          //                   downloadImageFromUrl(screenshot.url, filename);
          //                 }}
          //               >
          //                 <Download fontSize="small" />
          //               </IconButton>
          //             </Tooltip>
          //           </Box>
          //           <CardContent sx={{ pb: 1 }}>
          //             <Typography variant="subtitle2" fontWeight="bold" noWrap>
          //               {screenshot.username}
          //             </Typography>
          //             <Typography variant="caption" color="text.secondary" display="block">
          //               {screenshot.examName}
          //             </Typography>
          //             <Typography variant="caption" color="text.secondary" display="block">
          //               {new Date(screenshot.detectedAt).toLocaleString()}
          //             </Typography>
          //           </CardContent>
          //         </Card>
          //       </Grid>
          //     ))}
          //   </Grid>
          // </>
          <></>
        )}
      </Paper>

      {/* Evidence Capture Dialog */}
      <Dialog
        open={evidenceDialog}
        onClose={() => setEvidenceDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Capture Evidence</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedEvidence.length === allEvidenceItems.length && allEvidenceItems.length > 0}
                  indeterminate={selectedEvidence.length > 0 && selectedEvidence.length < allEvidenceItems.length}
                  onChange={(e) => handleSelectAllEvidence(e.target.checked)}
                />
              }
              label="Select All"
            />
          </Stack>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select evidence to download. This will generate a detailed report and download all associated screenshots.
          </Typography>
          
          <List>
            {allEvidenceItems.map((item) => (
              <ListItem
                key={item.id}
                sx={{
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  mb: 1,
                  backgroundColor: selectedEvidence.includes(item.id) ? '#f3f4f6' : 'white'
                }}
              >
                <Checkbox
                  checked={selectedEvidence.includes(item.id)}
                  onChange={(e) => handleEvidenceSelection(item.id, e.target.checked)}
                />
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <Security />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography fontWeight="bold">{item.studentName}</Typography>
                      <Chip 
                        label={`${item.totalViolations} violations`}
                        size="small"
                        color="error"
                      />
                      <Chip 
                        label={`${item.screenshots.length} screenshots`}
                        size="small"
                        color="info"
                      />
                    </Stack>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {item.examName} • {item.studentEmail}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        {item.violationCounts.cellPhone > 0 && (
                          <Chip size="small" label={`${item.violationCounts.cellPhone} Cell Phone`} color="error" />
                        )}
                        {item.violationCounts.multipleFace > 0 && (
                          <Chip size="small" label={`${item.violationCounts.multipleFace} Multiple Face`} color="warning" />
                        )}
                        {item.violationCounts.noFace > 0 && (
                          <Chip size="small" label={`${item.violationCounts.noFace} No Face`} color="info" />
                        )}
                        {item.violationCounts.prohibitedObject > 0 && (
                          <Chip size="small" label={`${item.violationCounts.prohibitedObject} Prohibited Object`} color="secondary" />
                        )}
                      </Stack>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setEvidenceDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={downloadSelectedEvidence}
            disabled={selectedEvidence.length === 0}
            sx={{
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0 0%, #1e88e5 100%)',
              }
            }}
          >
            Download Evidence ({selectedEvidence.length})
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SuspiciousActivityDashboard;