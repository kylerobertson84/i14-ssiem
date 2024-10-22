import React from "react";
import { Button, TextField } from "@mui/material";

const MockPreferencesForm = ({ onSubmit }) => {
    return (
        <form onSubmit={onSubmit}>
            <TextField label="Preference 1" variant="outlined" fullWidth margin="normal" />
            <TextField label="Preference 2" variant="outlined" fullWidth margin="normal" />
            <Button type="submit" variant="contained" color="primary">
                Save Preferences
            </Button>
        </form>
    );
};

export default MockPreferencesForm;
