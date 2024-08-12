import React, { useState } from 'react';
import '../../Design/ReportGenerator.css';

const ReportGenerator = ({ onGenerate }) => {
    const [reportType, setReportType] = useState('');
    const [status, setStatus] = useState('');
    const [dataSource, setDataSource] = useState('');
    const [ruleId, setRuleId] = useState('');
    const [userId, setUserId] = useState('');
    const [description, setDescription] = useState('');

    const handleGenerate = (e) => {
        e.preventDefault();
        const newReport = { reportType, status, dataSource, ruleId, userId, description };
        onGenerate(newReport);
        setReportType('');
        setStatus('');
        setDataSource('');
        setRuleId('');
        setUserId('');
        setDescription('');
    };

    return (
        <form className="reporting-form" onSubmit={handleGenerate}>
            <div className="left-section">
                <div className="form-group">
                    <label htmlFor="reportType" className="form-label">Type</label>
                    <input
                        type="text"
                        id="reportType"
                        placeholder="Type of Report"
                        className="form-input"
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="status" className="form-label">Status</label>
                    <input
                        type="text"
                        id="status"
                        placeholder="Status of Report"
                        className="form-input"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="dataSource" className="form-label">Data Source</label>
                    <input
                        type="text"
                        id="dataSource"
                        placeholder="Data Source Origin For Report"
                        className="form-input"
                        value={dataSource}
                        onChange={(e) => setDataSource(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="ruleId" className="form-label">Rule ID</label>
                    <input
                        type="text"
                        id="ruleId"
                        placeholder="Which Rule Triggered This Report"
                        className="form-input"
                        value={ruleId}
                        onChange={(e) => setRuleId(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="userId" className="form-label">User ID</label>
                    <input
                        type="text"
                        id="userId"
                        placeholder="User Who Triggered The Report"
                        className="form-input"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    />
                </div>
            </div>
            <div className="right-section">
                <div className="form-group">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        id="description"
                        placeholder="Describe the Alert and its reasoning in detail"
                        className="form-textarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>
            </div>
            <div className="submit-section">
                <button type="submit" className="submit-button">Submit</button>
            </div>
        </form>
    );
};

export default ReportGenerator;
