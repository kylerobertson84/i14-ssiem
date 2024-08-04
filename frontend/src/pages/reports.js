import React from 'react';
import '../Design/Report.css';

const Reports = () => {
  return (
    <div className="reporting-container">
      <main>
        <h2>Reporting</h2>
        <form className="reporting-form">
          <div className="left-section">
            <div className="form-group">
              <label htmlFor="type" className="form-label">Type</label>
              <input type="text" id="type" placeholder="Type of Report" className="form-input" />
            </div>
            <div className="form-group">
              <label htmlFor="status" className="form-label">Status</label>
              <input type="text" id="status" placeholder="Status of Report" className="form-input" />
            </div>
            <div className="form-group">
              <label htmlFor="dataSource" className="form-label">Data Source</label>
              <input type="text" id="dataSource" placeholder="Data Source Origin For Report" className="form-input" />
            </div>
            <div className="form-group">
              <label htmlFor="ruleId" className="form-label">Rule ID</label>
              <input type="text" id="ruleId" placeholder="Which Rule Triggered This Report" className="form-input" />
            </div>
            <div className="form-group">
              <label htmlFor="userId" className="form-label">User ID</label>
              <input type="text" id="userId" placeholder="User Who Triggered The Report" className="form-input" />
            </div>
          </div>
          <div className="right-section">
            <div className="form-group description-group">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea id="description" placeholder="Describe the Alert and its reasoning in detail" className="form-textarea"></textarea>
            </div>
            <div className="submit-section">
              <button type="submit" className="submit-button">Submit</button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Reports;
