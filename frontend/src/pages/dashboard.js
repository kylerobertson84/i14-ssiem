import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "../Design/SEO.js";
import {
    Grid,
    Paper,
    Typography,
    Box,
    useTheme,
    Chip,
    IconButton,
    useMediaQuery,
    CircularProgress,
} from "@mui/material";
import {
    EditCalendar,
    Search,
    Notes,
    Devices,
    AssignmentTurnedInOutlined,
    MonitorHeartOutlined,
    MemoryOutlined,
    DeveloperBoardOutlined,
    SaveOutlined,
    WarningAmber,
} from "@mui/icons-material";
import {
    LogsPerHourChart,
    LogsByDeviceChart,
    CpuLoadChart,
    RamUsageChart,
    DiskUsageChart,
} from "../components/dashboardGraphs.js";
import {
    fetchUser,
    fetchLogCount,
    fetchRouterLogCount,
    fetchLogPercentages,
    fetchLogsPerHour,
    fetchEventsToday,
    fetchLatestAlerts,
    fetchHostnameCount,
    fetchInvestigationsCount,
    fetchAssignedAlerts
} from "../services/apiService.js";

const Dashboard = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [user, setUser] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recordCount, setRecordCount] = useState(0);
    const [routerLogCount, setRouterLogCount] = useState(0);
    const [logPercentages, setLogPercentages] = useState({});
    const [logsPerHour, setLogsPerHour] = useState([]);
    const [eventsToday, setEventsToday] = useState({});
    const [latestAlerts, setLatestAlerts] = useState({});
    const [hostnameCount, setHostnameCount] = useState({});
    const [investigationCount, setInvestigationCount] = useState({});
    const [assignedAlerts, setAssignedAlerts] = useState({});

    const logsByDeviceData = [
        { name: "Windows OS", value: logPercentages.windows_os_percentage },
        { name: "Network", value: logPercentages.network_percentage },
    ];

    const severityColors = {
        INFO: "#2196f3",
        LOW: "#4caf50",
        MEDIUM: "#ff9800",
        HIGH: "#f44336",
        CRITICAL: "#9c27b0",
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const [
                    userData,
                    logCountData,
                    routerLogCountData,
                    logPercentages,
                    logsPerHour,
                    fetchedEventsToday,
                    fetchedLatestAlerts,
                    fetchedHostnameCount,
                    fetchedInvestigationCount,
                    fetchedAssignedAlerts
                ] = await Promise.all([
                    fetchUser(),
                    fetchLogCount(),
                    fetchRouterLogCount(),
                    fetchLogPercentages(),
                    fetchLogsPerHour(),
                    fetchEventsToday(),
                    fetchLatestAlerts(),
                    fetchHostnameCount(),
                    fetchInvestigationsCount(),
                    fetchAssignedAlerts()
                ]);

                setUser(userData);
                setRecordCount(logCountData.count);
                setRouterLogCount(routerLogCountData.router_log_count);
                setLogPercentages(logPercentages);
                setLogsPerHour(logsPerHour);
                setEventsToday(fetchedEventsToday);
                setLatestAlerts(fetchedLatestAlerts);
                setHostnameCount(fetchedHostnameCount);
                setInvestigationCount(fetchedInvestigationCount);
                setAssignedAlerts(fetchedAssignedAlerts);
                setLoading(false);
            } catch (error) {
                console.error("Error loading dashboard data", error);
                setLoading(false);
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        fetch("/data.json")
            .then((response) => response.json())
            .then((json) => {
                setData(json);
            })
            .catch((error) => {
                console.error("Error loading data:", error);
            });
    }, []);

    const navigate = useNavigate();
    const handleViewMoreClick = () => {
        navigate("/alerts");
    };
    const handleCardClick = () => {
        navigate("/investigations"); 
    };
    const handleCardClick1 = () => {
        navigate("/queries");
    };

    const handleInvestigation = (id) => {
        // Implement navigation to investigation detail page
        navigate(`/investigations/${id}`);
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!data) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <Typography variant="h6" color="error">
                    Error loading data.
                </Typography>
            </Box>
        );
    }

    const AssignedAlertsSection = () => (
        <Paper
            elevation={3}
            sx={{ overflow: "hidden", borderRadius: 2, height: "100%" }}
        >
            <Box
                sx={{
                    p: 2,
                    bgcolor: theme.palette.primary.main,
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <WarningAmber sx={{ mr: 1 }} />
                <Typography variant="h5" component="h2" fontWeight="bold">
                    My Assigned Alerts
                </Typography>
            </Box>
            <Box sx={{ height: isMobile ? 300 : 400, overflowY: "auto" }}>
                {assignedAlerts.results && assignedAlerts.results.length > 0 ? (
                    assignedAlerts.results.map((investigation, index) => (
                        <Box
                            key={investigation.id}
                            sx={{
                                p: 2,
                                borderBottom:
                                    index < assignedAlerts.results.length - 1
                                        ? "1px solid #e0e0e0"
                                        : "none",
                                "&:hover": { bgcolor: "#f5f5f5" },
                                transition: "background-color 0.3s",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    mb: 1,
                                }}
                            >
                                <Typography variant="subtitle2" fontWeight="medium">
                                    Device: {investigation.alert.event.hostname}
                                </Typography>
                                <Chip
                                    label={investigation.alert.severity}
                                    size="small"
                                    sx={{
                                        bgcolor: severityColors[investigation.alert.severity],
                                        color: "white",
                                        fontWeight: "bold",
                                    }}
                                />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                <strong>{investigation.alert.rule.name}</strong>
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Typography variant="caption" color="text.secondary">
                                    {new Date(investigation.created_at).toLocaleString()}
                                </Typography>
                                <IconButton
                                    size="small"
                                    color="primary"
                                    aria-label="investigate"
                                    onClick={() => handleInvestigation(investigation.id)}
                                >
                                    <Search />
                                </IconButton>
                            </Box>
                        </Box>
                    ))
                ) : (
                    <Typography sx={{ p: 2 }}>No assigned alerts.</Typography>
                )}
            </Box>
        </Paper>
    );

    const LatestAlertsSection = () => (
        <Paper
            elevation={3}
            sx={{ overflow: "hidden", borderRadius: 2, height: "100%" }}
        >
            <Box
                sx={{
                    p: 2,
                    bgcolor: theme.palette.primary.main,
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <WarningAmber sx={{ mr: 1 }} />
                <Typography variant="h5" component="h2" fontWeight="bold">
                    Latest Alerts
                </Typography>
            </Box>
            <Box sx={{ height: isMobile ? 300 : 400, overflowY: "auto" }}>
                {latestAlerts.results &&
                    latestAlerts.results.map((alert, index) => (
                        <Box
                            key={alert.id}
                            sx={{
                                p: 2,
                                borderBottom:
                                    index < latestAlerts.results.length - 1
                                        ? "1px solid #e0e0e0"
                                        : "none",
                                "&:hover": { bgcolor: "#f5f5f5" },
                                transition: "background-color 0.3s",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    mb: 1,
                                }}
                            >
                                <Typography variant="subtitle2" fontWeight="medium">
                                    Device: {alert.event.hostname}
                                </Typography>
                                <Chip
                                    label={alert.severity}
                                    size="small"
                                    sx={{
                                        bgcolor: severityColors[alert.severity],
                                        color: "white",
                                        fontWeight: "bold",
                                    }}
                                />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                <strong>{alert.rule.name}</strong>
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Typography variant="caption" color="text.secondary">
                                    {new Date(alert.created_at).toLocaleString()}
                                </Typography>
                                <IconButton
                                    size="small"
                                    color="primary"
                                    aria-label="investigate"
                                    onClick={() => handleInvestigation(alert.id)}
                                >
                                    <Search />
                                </IconButton>
                            </Box>
                        </Box>
                    ))}
            </Box>
            <Box sx={{ p: 1, textAlign: "right" }}>
                <Typography
                    variant="body2"
                    color="primary"
                    sx={{ cursor: "pointer" }}
                    onClick={handleViewMoreClick}
                >
                    View more &gt;
                </Typography>
            </Box>
        </Paper>
    );

    return (
        <>
            <SEO title="Dashboard" />
            <Box sx={{ p: isMobile ? 2 : 4 }}>
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{ mb: 4, fontWeight: "bold" }}
                >
                    Dashboard
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} lg={8}>
                        <Grid container spacing={3}>
                            <InfoCard
                                title="Total Devices"
                                value={hostnameCount.total_devices}
                                icon={Devices}
                            />
                            <InfoCard
                                title="Logs"
                                value={recordCount + routerLogCount}
                                icon={Notes}
                                sx={{ cursor: "pointer" }}
                                onClick={handleCardClick1}
                            />
                            <InfoCard
                                title="Events per Day"
                                value={eventsToday.events_today}
                                icon={EditCalendar}
                                sx={{ cursor: "pointer" }}
                                onClick={handleViewMoreClick}
                            />
                            <InfoCard
                                title="Open Investigations"
                                value={investigationCount.open_count}
                                icon={Search}
                                sx={{ cursor: "pointer" }}
                                onClick={handleCardClick}
                            />
                            <InfoCard
                                title="In Progress Investigations"
                                value={investigationCount.in_progress_count}
                                icon={Search}
                                sx={{ cursor: "pointer" }}
                                onClick={handleCardClick}
                            />
                            <InfoCard
                                title="Closed Investigations"
                                value={investigationCount.closed_count}
                                icon={AssignmentTurnedInOutlined}
                                sx={{ cursor: "pointer" }}
                                onClick={handleCardClick}
                            />
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 2, height: "100%" }}>
                                    <LogsPerHourChart data={logsPerHour} />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 2, height: "100%" }}>
                                    <LogsByDeviceChart data={logsByDeviceData} />
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} lg={4}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <AssignedAlertsSection />
                            </Grid>
                            <Grid item xs={12}>
                                <LatestAlertsSection />
                            </Grid>
                            <Grid item xs={12}>
                                <Paper
                                    elevation={3}
                                    sx={{ overflow: "hidden", borderRadius: 2 }}
                                >
                                    <Box
                                        sx={{
                                            p: 2,
                                            bgcolor: theme.palette.primary.main,
                                            color: "white",
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <MonitorHeartOutlined sx={{ mr: 1 }} />
                                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                                            SIEM Database Server Status
                                        </Typography>
                                    </Box>
                                    <Box sx={{ p: 2 }}>
									<SystemStat
                                            dataDisk={data.graphs.diskData}
                                            dataRam={data.graphs.ramData}
                                            dataCpu={data.graphs.cpuData}
                                        />
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

const InfoCard = ({ icon: IconComponent, value, title, onClick, sx }) => (
    <Grid item xs={12} sm={6} md={4}>
        <Paper sx={{ p: 2, height: "100%", cursor: "pointer", ...sx}}
            onClick={onClick}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                }}
            >
                <Typography variant="subtitle2" color="textSecondary">
                    {title}
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexGrow: 1,
                    }}
                >
                    <Typography variant="h4">{value}</Typography>
                    <IconComponent sx={{ fontSize: 40, color: "primary.main" }} />
                </Box>
            </Box>
        </Paper>
    </Grid>
);

const SystemStat = ({ dataCpu, dataDisk, dataRam }) => (
    <Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <SaveOutlined sx={{ fontSize: 24, color: "#6c757d", mr: 2 }} />
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2">Disk Used: {dataDisk[5].value}%</Typography>
            </Box>
            <DiskUsageChart data={dataDisk} />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <MemoryOutlined sx={{ fontSize: 24, color: "#6c757d", mr: 2 }} />
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2">RAM Load: {dataRam[5].value}%</Typography>
            </Box>
            <RamUsageChart data={dataRam} />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <DeveloperBoardOutlined sx={{ fontSize: 24, color: "#6c757d", mr: 2 }} />
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2">CPU Load: {dataCpu[5].value}%</Typography>
            </Box>
            <CpuLoadChart data={dataCpu} />
        </Box>
    </Box>
);

export default Dashboard;